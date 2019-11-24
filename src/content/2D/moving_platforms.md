---
title: "Moving Platforms"
weight: 5
draft: false
---

## Problem

You need moving platforms in your 2D platformer.

## Solution

There are several ways to approach this problem. In this recipe, we'll use `KinematicBody2D`s for our platforms and move them with `AnimationPlayer`. This allows for a variety of movement styles while minimizing the amount of code we need to write.

### Setting up

We'll start with a basic platformer setup using the [Platform character](http://kidscancode.org/godot_recipes/ai/platform_character) recipe. We will need to make one small modification from that recipe: using `move_and_slide_with_snap()` for the movement.

Here is the updated code:

```gdscript
func _physics_process(delta):
    get_input()
    velocity.y += gravity * delta
    var snap = Vector2.DOWN * 16 if is_on_floor() else Vector2.ZERO
    velocity = move_and_slide_with_snap(velocity, snap, Vector2.UP)
    if Input.is_action_just_pressed("jump"):
        if is_on_floor():
            velocity.y = jump_speed
```

With this code, we'll still get the same behavior with jumping and sliding, but the `snap` value will ensure that the character "sticks" to the platform even if it moves. See the [KinematicBody2D docs](https://docs.godotengine.org/en/3.1/classes/class_kinematicbody2d.html#class-kinematicbody2d-method-move-and-slide-with-snap) for more information on how the `snap` parameter works.

### Creating the platform

The platform scene contains the following nodes:

![alt](/godot_recipes/img/moving_plats_01.png)

The `Node2D` parent is there to act as the "anchor" or start point for the platform. We'll animate the platform's `position` relative to this parent node.

Set up the Sprite's *Texture* and the collision shape appropriately. In the KinematicBody2D, set the *Sync to Physics* property "On". Since we're not moving the body in code, this ensures that it's moved during the physics step. You'll also need to set the *Process Mode* property of the AnimationPlayer to "Physics".

To move the platform, create an animation in the `AnimationPlayer` that animates the body's `position` property. For example, here's one animating the platform horizontally in a 4 second loop:

![alt](/godot_recipes/img/moving_plats_02.gif)

You're done! Instance some platforms in your level/world and try them out:

<video controls src="/godot_recipes/img/moving_plats_03.webm"></video>

{{% notice note %}}
Download the project file here: [moving_platforms.zip](/godot_recipes/files/moving_platforms.zip)
{{% /notice %}}

## Related recipes

- [Platform character](http://kidscancode.org/godot_recipes/2d/platform_character)

#### Like video?

*Coming soon*
<!-- {{< youtube C-Sn55e5wnk >}} -->