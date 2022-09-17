---
title: "Platform character"
weight: 1
draft: false
ghcommentid: 16
---

## Problem

You need to make a 2D platform-style character.

## Solution

New developers are often surprised at how complex a platform character can be to program. Godot provides some built-in tools to assist, but there are as many solutions as there are games. In this tutorial, we won't be going in-depth with features like double-jumps, crouching, wall-jumps, or animation. Here we'll discuss the fundamentals of platformer movement. See the rest of the recipes for other solutions.

{{% notice tip %}}
While it's possible to use {{< gd-icon RigidBody2D >}}`RigidBody2D` to make a platform character, we'll be focusing on {{< gd-icon CharacterBody2D >}}`CharacterBody2D`. Kinematic bodies are well-suited for platformers, where you are less interested in realistic physics than in responsive, arcade feel.
{{% /notice %}}

Start with a {{< gd-icon CharacterBody2D >}}`CharacterBody2D` node, and add a {{< gd-icon Sprite2D >}}`Sprite2D` and {{< gd-icon CollisionShape2D >}}`CollisionShape2D` to it.

Attach the following script to the root node of the character. Note that we're using input actions we've defined in the InputMap: `"walk_right"`, `"walk_left"`, and `"jump"`. See [InputActions](/4.x/input/input_actions/).

```gdscript
extends CharacterBody2D

@export var speed = 1200
@export var jump_speed = -1800
@export var gravity = 4000


func _physics_process(delta):
    # Add gravity every frame
    velocity.y += gravity * delta

    # Input affects x axis only
    velocity.x = Input.get_axis("walk_left", "walk_right") * speed

    move_and_slide()

    # Only allow jumping when on the ground
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_speed
```

The values used for `speed`, `gravity`, and `jump_speed` depend greatly on the size of your player sprite. The player's texture in this example is `108x208` pixels. If your sprite is smaller, you'll want to use smaller values. We also want high values so that everything feels fast and responsive. A low gravity results in a floaty-feeling game while a high value means you're soon back on the ground and ready to jump again.

Note that we're checking `is_on_floor()` *after* using `move_and_slide()`. The `move_and_slide()` function sets the value of this method, so it's important not to check it before, or you'll be getting the value from the previous frame.

### Friction and acceleration

The above code is a great start, and you can use it as the foundation for a wide variety of platform controllers. One problem it has, though, is the instantaneous movement. For a more natural feel, it's better if the character has to accelerate up to its max speed and that it coasts to a stop when there is no input.

One way to add this behavior is to use linear interpolation ("lerp"). When moving, we will lerp between the current speed and the max speed and while stopping we'll lerp between the current speed and `0`. Adjusting the lerp amount will give us a variety of movement styles.

{{% notice tip %}}
For an overview of linear interpolation, see [Gamedev Math: Interpolation](/4.x/math/interpolation/).
{{% /notice %}}

```gdscript
extends CharacterBody2D

@export var speed = 1200
@export var jump_speed = -1800
@export var gravity = 4000
@export_range(0.0, 1.0) var friction = 0.1
@export_range(0.0 , 1.0) var acceleration = 0.25


func _physics_process(delta):
    velocity.y += gravity * delta
    var dir = Input.get_axis("walk_left", "walk_right")
    if dir != 0:
        velocity.x = lerp(velocity.x, dir * speed, acceleration)
    else:
        velocity.x = lerp(velocity.x, 0.0, friction)

    move_and_slide()
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_speed
```

Try changing the values for `friction` and `acceleration` to see how they affect the game's feel. An ice level, for example, could use very low values, making it harder to maneuver.

![alt](/4.x/img/platformer1.gif)

## Conclusion

This code gives you a starting point for building your own platformer controller. For more advanced platforming features such as wall jumps, see the other recipes in this section.
<!--
Download an example project using this recipe:

{{% notice note %}}
Download the project file here: [platform_character.zip](/4.x/files/platform_character4.zip)
{{% /notice %}} -->

## Related Recipes

<!-- - [Input Intro](/3.x/input/input_intro/)
- [Kinematic Friction](/3.x/physics/kinematic_friction/) -->