---
title: "Camera Gimbal"
weight: 1
draft: false
---

## Problem

You need a camera controller, using mouse or keyboard, that remains level while rotating and following a target.

## Solution

Try this: take a Camera node and rotate it a small amount around **X** (the red ring on the gizmo), then a small amount around **Z** (the blue ring). Now reverse the **X** rotation and click the "Preview" button. Observe how the camera is now tilted.

The solution to this problem is to place the camera on a _gimbal_ - a device designed to keep an object level during movement. We can create a gimbal using two `Spatial` nodes, which will control the camera's left/right and up/down rotation respectively.

The node setup should look like this:

```markdown
- CameraGimbal (Spatial)
    - InnerGimbal (Spatial)
        - Camera
```

Set the _Transform/Translation_ of the `Camera` to `(0, 0, 4)`.

Here's how the gimbal works: the outer spatial node can only be rotated in **Y**, while the inner one rotates only in **X**. You can test this out by rotating them manually, but make sure you change to "Local Space Mode" first (that's the cube icon next to the lock in the menu bar - the keyboard shortcut to toggle is "T"). Remember to only move the _green_ ring of the outer node and only the _red_ ring of the inner one. Don't touch the camera node at all.

<video controls src="/godot_recipes/img/gimbal_01.webm"></video>

Reset all the rotations to `0` once you've finished experimenting.

### Keyboard control

We'll start with the keyboard controls, then add an option to use the mouse as well. Here are the required actions and their assigned inputs:

   Action Name | Input
--------|------
`"cam_up"` | W
`"cam_down"` | S
`"cam_right"` | D
`"cam_left"` | A
`"cam_zoom_in"` | Wheel Up
`"cam_zoom_out"` | Wheel Down

Here's the initial script. Note that we're making sure to rotate each `Spatial` in its local space around the specific axis, as described above.

```gdscript
extends Spatial

var rotation_speed = PI/2

func get_input_keyboard(delta):
    # Rotate outer gimbal around y axis
    var y_rotation = 0
    if Input.is_action_pressed("cam_right"):
        y_rotation += 1
    if Input.is_action_pressed("cam_left"):
        y_rotation += -1
    rotate_object_local(Vector3.UP, y_rotation * rotation_speed * delta)
    # Rotate inner gimbal around local x axis
    var x_rotation = 0
    if Input.is_action_pressed("cam_up"):
        x_rotation += -1
    if Input.is_action_pressed("cam_down"):
        x_rotation += 1
    $InnerGimbal.rotate_object_local(Vector3.RIGHT, x_rotation * rotation_speed * delta)

func _process(delta):
    get_input_keyboard(delta)
```

Make a test scene with a `MeshInstance` and instance the CameraGimbal in it to test out the movement.

You'll notice that holding the up/down control will cause the camera to rotate all the way around, eventually becoming upside-down. To prevent this, we can clamp the rotation.

```gdscript
func _process(delta):
    get_input_keyboard(delta)
    $InnerGimbal.rotation.x = clamp($InnerGimbal.rotation.x, -1.4, -0.01)
```
The `-1.4` value lets it go *almost* to 90 degrees up, while setting a very small value for the minimum keeps the camera from clipping into the ground. Feel free to experiment with other values.

### Mouse control

We'll add a flag called `mouse_control` to enable easy toggling of mouse/keyboard controls.

```gdscript
# mouse properties
var invert_y = false
var invert_x = false
var mouse_control = false
var mouse_sensitivity = 0.005

func _unhandled_input(event):
    if mouse_control and event is InputEventMouseMotion:
        if event.relative.x != 0:
            var dir = 1 if invert_x else -1
            rotate_object_local(Vector3.UP, dir * event.relative.x * mouse_sensitivity)
        if event.relative.y != 0:
            var dir = 1 if invert_y else -1
            $InnerGimbal.rotate_object_local(Vector3.RIGHT, dir * event.relative.y * mouse_sensitivity)

func _process(delta):
    if !mouse_control:
        get_input_keyboard(delta)
```

This code works by converting horizontal mouse motion to **Y** rotation of the outer gimbal and vertical to **X** rotation for the inner gimbal. We've also added `invert_x` and `invert_y` flags so that you can flip the motion in either axis - many players prefer one over the other, so it's best to allow for both options.

Also, in `_process()` we disable keyboard input when using mouse control.

You may notice a problem with the up/down movement if you move the mouse too quickly. A large value for `event.relative.y` results in "skipping" to the opposite side of the clamped value. We can solve this by clamping the vertical mouse movement to a reasonable value. Change the above code for `y` to this:

```gdscript
if event.relative.y != 0:
    var dir = 1 if invert_y else -1
    var y_rotation = clamp(event.relative.y, -30, 30)
    $InnerGimbal.rotate_object_local(Vector3.RIGHT, dir * y_rotation * mouse_sensitivity)
```

{{% notice note %}}
In your project, you'll probably also want to capture the mouse during gameplay. See the linked recipe at the end of this document for details.
{{% /notice %}}

### Camera zoom

Camera zoom works by varying the `scale` of the gimbal system.

```gdscript
# zoom settings
var max_zoom = 3.0
var min_zoom = 0.5
var zoom_speed = 0.09

var zoom = 1.5

func _unhandled_input(event):
    if event.is_action_pressed("cam_zoom_in"):
        zoom -= zoom_speed
    if event.is_action_pressed("cam_zoom_out"):
        zoom += zoom_speed
    zoom = clamp(zoom, min_zoom, max_zoom)

func _process(delta):
    scale = lerp(scale, Vector3.ONE * zoom, zoom_speed)
```

Using `lerp()` to change the zoom level results in smoother zooming.

![alt](/godot_recipes/img/gimbal_02.gif)

### Following a target

Once you have the camera gimbal set up, it can follow a target by adding the following:

```gdscript
export (NodePath) var target

func _process(delta):
    if target:
        global_transform.origin = get_node(target).global_transform.origin
```

Instance the camera in your scene and use the Inspector to choose the node you want to follow.

## Final script

For completeness, here's the full script, including `export` variables for all the camera settings, so that you can configure it in your project.

```gdscript
extends Spatial

export (NodePath) var target

export (float, 0.0, 2.0) var rotation_speed = PI/2

# mouse properties
export (bool) var mouse_control = false
export (float, 0.001, 0.1) var mouse_sensitivity = 0.005
export (bool) var invert_y = false
export (bool) var invert_x = false

# zoom settings
export (float) var max_zoom = 3.0
export (float) var min_zoom = 0.4
export (float, 0.05, 1.0) var zoom_speed = 0.09

var zoom = 1.5

func _unhandled_input(event):
    if Input.get_mouse_mode() != Input.MOUSE_MODE_CAPTURED:
        return
    if event.is_action_pressed("cam_zoom_in"):
        zoom -= zoom_speed
    if event.is_action_pressed("cam_zoom_out"):
        zoom += zoom_speed
    zoom = clamp(zoom, min_zoom, max_zoom)
    if mouse_control and event is InputEventMouseMotion:
        if event.relative.x != 0:
            var dir = 1 if invert_x else -1
            rotate_object_local(Vector3.UP, dir * event.relative.x * mouse_sensitivity)
        if event.relative.y != 0:
            var dir = 1 if invert_y else -1
            var y_rotation = clamp(event.relative.y, -30, 30)
            $InnerGimbal.rotate_object_local(Vector3.RIGHT, dir * y_rotation * mouse_sensitivity)

func get_input_keyboard(delta):
    # Rotate outer gimbal around y axis
    var y_rotation = 0
    if Input.is_action_pressed("cam_right"):
        y_rotation += 1
    if Input.is_action_pressed("cam_left"):
        y_rotation += -1
    rotate_object_local(Vector3.UP, y_rotation * rotation_speed * delta)
    # Rotate inner gimbal around local x axis
    var x_rotation = 0
    if Input.is_action_pressed("cam_up"):
        x_rotation += -1
    if Input.is_action_pressed("cam_down"):
        x_rotation += 1
    x_rotation = -x_rotation if invert_y else x_rotation
    $InnerGimbal.rotate_object_local(Vector3.RIGHT, x_rotation * rotation_speed * delta)

func _process(delta):
    if !mouse_control:
        get_input_keyboard(delta)
    $InnerGimbal.rotation.x = clamp($InnerGimbal.rotation.x, -1.4, -0.01)
    scale = lerp(scale, Vector3.ONE * zoom, zoom_speed)
    if target:
        global_transform.origin = get_node(target).global_transform.origin
```

## Related recipes

- [Capturing the Mouse](/godot_recipes/input/mouse_capture/)
- [Intro to 3D](/godot_recipes/g101/3d/)

#### Like video?

{{< youtube 4NLrfxNt3ps >}}