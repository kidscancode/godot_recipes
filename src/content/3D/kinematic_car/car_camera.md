---
title: "3D Kinematic Car: Chase Camera"
weight: 3
draft: false
---

## Problem

You want a "chase camera" that can follow your car (or any other object).

## Solution

{{% notice note %}}
Godot has a built-in `InterpolatedCamera` node that does most of what's described here. However, we're not going to use it for two reasons: first, it has a tendency to stutter when following kinematic bodies, and second, it's getting removed in Godot 4.0. Setting up our own is really easy though, so don't worry. <i class='far fa-smile-beam'></i>
{{% /notice %}}

### Setting up the camera

Add a new scene with a `Camera`. Name it `ChaseCamera`, save it, and add a script.

The `ChaseCamera` will have a `target` - the thing it's following. We're also going to include the ability to change that target.

```gdscript
extends Camera

export var lerp_speed = 10.0

var target = null

func _physics_process(delta):
    if !target:
        return
    global_transform = global_transform.interpolate_with(target.global_transform, lerp_speed * delta)

func _on_change_camera(t):
    target = t
```

The only parameter to set here is the `lerp_speed`, which controls how quickly the camera updates its position. Set it low, and the camera will "lag" behind the car. Set it high, and it will remain locked on.

### Setting up the target(s)

We want to be able to have a few different chase camera positions. One close and one far, for example, or perhaps one looking straight down. Add a `Spatial` to the car and name it `CameraPositions`. Add a few `Position3D`s to this - as many as you would like.

Move and orient each `Position3D` in a different location of your choosing. The position's **-Z** axis should point at the car.

{{% notice tip %}}
You may find it helpful to temporarily attach a `Camera` to the position and use its "Preview" mode to help aim the `Position3D` so that it's pointing directly where you want (you can remove the camera once you're done).
![alt](/godot_recipes/img/3d_car_09.png)
{{% /notice %}}

To communicate to the camera, we'll emit a signal whenever we want it to change position. Add the following code to the car's script:

```gdscript
extends "res://cars/car_base.gd"

signal change_camera

var current_camera = 0
onready var num_cameras = $CameraPositions.get_child_count()

func _ready():
    emit_signal("change_camera", $CameraPositions.get_child(current_camera))

func _input(event):
    if event.is_action_pressed("change_camera"):
        current_camera = wrapi(current_camera + 1, 0, num_cameras)
        emit_signal("change_camera", $CameraPositions.get_child(current_camera))
```

Add an action in the InputMap for changing the camera. Here, we're using Tab and the right shoulder button:

![alt](/godot_recipes/img/3d_car_07.png)

### Connecting it together

Add a `ChaseCamera` instance to your main scene and set it `Current`. Then connect the car's `change_camera` signal to the camera's `_on_change_camera()` function.



Run the game and press the camera change button to try it out:

![alt](/godot_recipes/img/3d_car_08.gif)

## Related recipes

- [Kinematic Car: Base](/godot_recipes/3d/kinematic_car/car_base/)
- [2D: Car Steering recipe](/godot_recipes/2d/car_steering)
- [Input Actions](http://kidscancode.org/godot_recipes/input/input_actions/)
- [3D: KinematicBody Movement](/godot_recipes/3d/kinematic_body/)

#### Like video?

