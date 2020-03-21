---
title: "Click to move"
weight: 12
draft: false
---

## Problem

You want to move a 3D object to a clicked position.

## Solution

We'll start with a flat plane for our world. Our actor will move on this plane.

![alt](/godot_recipes/img/3d_click_01.png)

The actor for this demo is a triangular prism mesh:

![alt](/godot_recipes/img/3d_click_02.png)

Here is the code for the movement. If given a target, the object will turn and move toward it.

```gdscript
extends KinematicBody

export var speed = 5
export var gravity = -5

var target = null
var velocity = Vector3.ZERO

func _physics_process(delta):
    velocity.y += gravity * delta
    if target:
        look_at(target, Vector3.UP)
        rotation.x = 0
        velocity = -transform.basis.z * speed
        if transform.origin.distance_to(target) < .5:
            target = null
            velocity = Vector3.ZERO
    velocity = move_and_slide(velocity, Vector3.UP)
```

We've also added a `MeshInstance` called "Marker" to the scene. This will be moved to indicate the clicked position.

![alt](/godot_recipes/img/3d_click_03.png)

### Mouse -> 3D

Now we need a way to map mouse position into our 3D world. If you imagine the screen as a window into the 3D world, the mouse is trapped on the glass. To select something in 3D, we must project a ray from our eye (the camera), through the mouse's position and into the world.

While this can be done manually using The Camera's `project_ray` methods, we can take advantage of the fact that `CollisionObject` nodes do this automatically. All we need to do is connect our `StaticBody' ground's `input_event` signal:

```gdscript
func _on_StaticBody_input_event(camera, event, click_position, click_normal, shape_idx):
    if event is InputEventMouseButton and event.pressed:
        $Marker.transform.origin = click_position
        $Player.target = click_position
```

We set the position of the marker and the Player's target to the clicked position:

![alt](/godot_recipes/img/3d_click_04.gif)

## Wrapping up

You can use this technique to detect clicks on any objects in your 3D world.

<!-- {{% notice note %}}
Download the project file here: [floating_text.zip](/godot_recipes/files/floating_text.zip)
{{% /notice %}} -->

## Related recipes

<!-- - [UI: Labels](/godot_recipes/ui/labels/)
- [UI: Object Healthbars](/godot_recipes/ui/unit_healthbar/) -->

#### Like video?

