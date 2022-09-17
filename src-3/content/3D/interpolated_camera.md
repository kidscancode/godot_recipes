---
title: "Interpolated Camera"
weight: 2
draft: false
ghcommentid: 88
---
## Problem

You need a 3D camera that smoothly follows a target (interpolates).

## Solution

{{% notice info %}}
Godot's built-in `InterpolatedCamera` node is deprecated and will be removed in the release of Godot 4.0.
{{% /notice %}}

Attach the script below to a {{< gd-icon Camera3D >}}`Camera` node in your scene. The three `export` properties let you choose:

* `lerp_speed` - the camera's movement speed. Lower values result in a "lazier" camera.
* `target_path` - choose the camera's target node.
* `offset` - position of the camera relative to the target.

See below for some examples of the camera in action.

```gdscript
extends Camera

export var lerp_speed = 3.0
export (NodePath) var target_path = null
export (Vector3) var offset = Vector3.ZERO

var target = null

func _ready():
    if target_path:
        target = get_node(target_path)

func _physics_process(delta):
    if !target:
        return
    var target_pos = target.global_transform.translated(offset)
    global_transform = global_transform.interpolate_with(target_pos, lerp_speed * delta)
    look_at(target.global_transform.origin, Vector3.UP)
```

In the `_physics_process()` function we interpolate the camera's position with the `target`'s (plus `offset`).

### Examples

* `lerp_speed`: 3.0
* `offset`: (0, 7, 5)


<video width="500" controls src="/3.x/img/3d_sphere_car_07.webm"></video>