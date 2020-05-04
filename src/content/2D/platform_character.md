---
title: "Platform character"
weight: 1
draft: false
---

## Problem

You need to make a 2D platform-style character.

## Solution

New developers are often surprised at how complex a platform character can be to program. Godot provides some built-in tools to assist, but there are as many solutions as there are games. In this tutorial, we won't be going in-depth with features like double-jumps, crouching, wall-jumps, or animation. Here we'll discuss the fundamentals of platformer movement. See the rest of the recipes for other solutions.

{{% notice tip %}}
While it's possible to use `RigidBody2D` to make a platform character, we'll be focusing on `KinematicBody2D`. Kinematic bodies are well-suited for platformers, where you are less interested in realistic physics than in responsive, arcade feel.
{{% /notice %}}

Start with a `KinematicBody2D` node, and add a `Sprite` and `CollisionShape2D` to it.

Attach the following script to the root node of the character. Note that we're using input actions we've defined in the InputMap: `"walk_right"`, `"walk_left"`, and `"jump"`. See [InputActions](/godot_recipes/input/input_actions/).

```gdscript
extends KinematicBody2D

export (int) var speed = 1200
export (int) var jump_speed = -1800
export (int) var gravity = 4000

var velocity = Vector2.ZERO

func get_input():
    velocity.x = 0
    if Input.is_action_pressed("walk_right"):
        velocity.x += speed
    if Input.is_action_pressed("walk_left"):
        velocity.x -= speed

func _physics_process(delta):
    get_input()
    velocity.y += gravity * delta
    velocity = move_and_slide(velocity, Vector2.UP)
    if Input.is_action_just_pressed("jump"):
        if is_on_floor():
            velocity.y = jump_speed
```

The values used for `speed`, `gravity`, and `jump_speed` depend greatly on the size of your player sprite. The player's texture in this example is `108x208` pixels. If your sprite is smaller, you'll want to use smaller values. We also want high values so that everything feels fast and responsive. A low gravity results in a floaty-feeling game while a high value means you're soon back on the ground and ready to jump again.

Note that we're checking `is_on_floor()` *after* using `move_and_slide()`. The `move_and_slide()` function sets the value of this method, so it's important not to check it before, or you'll be getting the value from the previous frame.

### Friction and acceleration

The above code is a great start, and you can use it as the foundation for a wide variety of platform controllers. One problem it has, though, is the instantaneous movement. For a more natural feel, it's better if the character has to accelerate up to its max speed and that it coasts to a stop when there is no input.

One way to add this behavior is to use linear interpolation ("lerp"). When moving, we will lerp between the current speed and the max speed and while stopping we'll lerp between the current speed and `0`. Adjusting the lerp amount will give us a variety of movement styles.

{{% notice tip %}}
For an overview of linear interpolation, see [Gamedev Math: Interpolation](/godot_recipes/math/interpolation/).
{{% /notice %}}

```gdscript
export (float, 0, 1.0) var friction = 0.1
export (float, 0, 1.0) var acceleration = 0.25

func get_input():
    var dir = 0
    if Input.is_action_pressed("walk_right"):
        dir += 1
    if Input.is_action_pressed("walk_left"):
        dir -= 1
    if dir != 0:
        velocity.x = lerp(velocity.x, dir * speed, acceleration)
    else:
        velocity.x = lerp(velocity.x, 0, friction)
```

Try changing the values for `friction` and `acceleration` to see how they affect the game's feel. An ice level, for example, could use very low values, making it harder to maneuver.

![alt](/godot_recipes/img/platformer1.gif)

## Conclusion

This code gives you a starting point for building your own platformer controller. For more advanced platforming features such as wall jumps, see the other recipes in this section.

Download an example project using this recipe:

{{% notice note %}}
Download the project file here: [platform_character.zip](/godot_recipes/files/platform_character.zip)
{{% /notice %}}

## Related Recipes

- [Input Intro](/godot_recipes/input/input_intro/)
- [Kinematic Friction](/godot_recipes/physics/kinematic_friction/)