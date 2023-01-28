---
title: "Basic FPS Character"
weight: 2
draft: false
tags: []
---

## Problem

You need to make a first-person shooter (FPS) character.

## Solution

Start with a {{< gd-icon CharacterBody3D >}}`CharacterBody3D` node, and add a {{< gd-icon CollisionShape3D >}}`CollisionShape3D` to it. The {{< gd-icon CapsuleShape3D >}}`CapsuleShape3D` collision shape is the most common choice. Depending on your world setup, you may want to add additional shapes here, but for the purposes of this example, we'll stick to the basics.

We'll leave all the sizing at the default values, meaning the capsule will be 2 meters high. Move it up by `1.0` m to align its bottom with the ground.

Next, add a {{< gd-icon Camera3D >}}`Camera3D` as a child of the body and move it up about `1.6` m.

{{% notice note %}}
For this example, we'll leave the character "bodyless" - meaning we're not adding a mesh to display for the player's body. Depending on your setup, you may or may not need to see the player's body.
{{% /notice %}}

Attach a script to the body and start by defining some properties:

```gdscript
extends CharacterBody3D

var gravity = ProjectSettings.get_setting("physics/3d/default_gravity")
var speed = 5
var jump_speed = 5
var mouse_sensitivity = 0.002
```

The `_physics_process()` function is the place to handle movement. Note that `Input.get_vector()` returns a 2-dimensional vector based on the combination of the forward/back/left/right keys. We want to use this vector to set the `x` and `z` components of the body's velocity (because `y` is handled by gravity). Multiplying this vector by the body's `basis` ensures we account for rotation - forward should always be the *body's* forward vector.

```gdscript
func _physics_process(delta):
    velocity.y += -gravity * delta
    var input = Input.get_vector("left", "right", "forward", "back")
    var movement_dir = transform.basis * Vector3(input.x, 0, input.y)
    velocity.x = movement_dir.x * speed
    velocity.z = movement_dir.z * speed

    move_and_slide()
    if is_on_floor() and Input.is_action_just_pressed("jump"):
        velocity.y = jump_speed
```

Don't forget to add the input actions to your **Input Map** using the keys/inputs you prefer (W/A/S/D is typical, or you can use joystick axes if you prefer a controller).

Add the player to a "World" scene where you've created some {{< gd-icon StaticBody3D >}}`StaticBody3D` nodes for the floor and some walls.

When you try to move, you'll notice you can move forward/back and left/right, but you can't rotate. That's what we'll handle next.

## Mouse control in 3D

First, we need the player to rotate left/right when we move the mouse the same way. Mouse input is represented in 2D, relative to the screen, so we need the `x` movement of the mouse to rotate the player's body around its `y` (vertical) axis. The `mouse_sensitivity` property we defined above lets us adjust how many pixels of mouse movement translate to a degree of rotation.

```gdscript
func _input(event):
    if event is InputEventMouseMotion:
        rotate_y(-event.relative.x * mouse_sensitivity)
```

Try the code again, and you'll see that you can now rotate with the mouse. However, you may find your mouse running outside the game window. This is the perfect time to add some code to capture your mouse. See [Input: Capturing the Mouse](/godot_recipes/4.x/input/mouse_capture/) for details.

Our updated code then becomes

```gdscript
func _input(event):
    if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
        rotate_y(-event.relative.x * mouse_sensitivity)
```

Finally, to look up/down, we'll use the `y` motion of the mouse to tilt the camera. We don't want it to turn completely upside-down, though, so we'll `clamp()` the rotation to a reasonable value of 70 degrees.

```gdscript
func _input(event):
    if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
        rotate_y(-event.relative.x * mouse_sensitivity)
        $Camera3D.rotate_x(-event.relative.y * mouse_sensitivity)
        $Camera3D.rotation.x = clampf($Camera3D.rotation.x, -deg_to_rad(70), deg_to_rad(70))
```

## Holding a weapon

![alt](/godot_recipes/4.x/img/fps_01.png)

An FPS character typically has a 3D mesh of a weapon positioned in front. Setting this up can be easy with a couple of Godot editor tricks.

Add your weapon mesh as a child of the {{< gd-icon Camera3D >}}`Camera3D`. Then, in the editor view menu, choose "2 Viewports" and set one of them to preview the camera. Then, you can move around the weapon and easily see how it will look from the player's perspective.

To add a little personality, try using an {{< gd-icon AnimationPlayer >}}`AnimationPlayer` to animate the weapon's position from side-to-side as the player moves.


## Related recipes

- [Input: Capturing the Mouse](/godot_recipes/4.x/input/mouse_capture/)


## <i class="fas fa-code-branch"></i> Download This Project

Download the project code here: [https://github.com/godotrecipes/basic_fps](https://github.com/godotrecipes/basic_fps)
