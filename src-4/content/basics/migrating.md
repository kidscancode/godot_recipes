---
title: "Migrating from 3.x"
weight: 5
draft: false
---

This is an evolving list of the main changes and "gotchas" to look out for if you're transitioning to 4.0.

## New Names

One of the biggest changes in Godot 4 is a whole bunch of renaming - of nodes, functions, and property names. Most of it is done to make things consistent or clear. Here are a few of the biggest ones to watch out for:

* 2D/3D nodes - In Godot 3.x, 2D nodes had the "2D" suffix, but 3D nodes had none. This has been made consistent - they all now have "2D" or "3D" suffixes. For example: {{< gd-icon RigidBody2D >}}`RigidBody2D` vs. {{< gd-icon RigidBody3D >}}`RigidBody3D`.

* Also in the category of 3D, the `Spatial` node is renamed to {{< gd-icon Node3D >}}`Node3D` to match.

* One of the most popular nodes, `KinematicBody`, has been renamed to {{< gd-icon CharacterBody2D >}}`CharacterBody2D`/{{< gd-icon CharacterBody3D >}}`CharacterBody3D`. See below for further changes with this node's API.

* {{< gd-icon PackedScene >}}`PackedScene`'s `instance()` function has been renamed to `instantiate()`.

* The `position` and `global_position` properties replace `translation` and `global_translation` in 3D, making them consistent with 2D.

## Signals and Callables

Working with signals is much more streamlined in 4.0. `Signal` is a native type now, so you'll be using fewer strings, meaning you get autocomplete and error checking. This applies to functions as well, which can now be directly referenced rather than using strings.

Here's an example of defining, connecting, and emitting a signal.

```gdscript
extends Node

signal my_signal

func _ready():
    my_signal.connect(signal_handler)

func _input(event):
    if event.is_action_pressed("ui_select"):
        my_signal.emit()

func signal_handler():
    print("signal received")
```

## Tweens

If you started using `SceneTreeTween` in Godot 3.5, then you'll be familiar with Godot 4.0's {{< gd-icon Tween >}}`Tween` usage.

{{< gd-icon Tween >}}`Tween` is no longer a node. Instead, you create one-off tween animation objects whenever you need them. Once you get used to it, it's a lot more powerful and easier to use than the old method.

## AnimatedSprite[2D|3D]

The biggest change that catches people who are familiar with the 3.x version of this node is that the `playing` property is gone. It's now much more consistent with {{< gd-icon AnimationPlayer >}}`AnimationPlayer`'s usage - to automatically play an animation, you can toggle autoplay in the **SpriteFrames** panel. In code, use `play()` and `stop()` to control playback.

## CharacterBody[2D|3D]

The biggest change in this node is in using `move_and_slide()`. It no longer takes any parameters - they are all now built-in properties. This includes a native `velocity` property, so you no longer need to declare your own.

For detailed examples of using these nodes, see [Platform Character](/godot_recipes/4.x/2d/platform_character/) and/or [Basic FPS Character](/godot_recipes/4.x/3d/basic_fps/).


## TileMap

The {{< gd-icon TileMap >}}`TileMap` node is completely overhauled for 4.0. Just about everything, from how you create {{< gd-icon TileSet >}}`TileSet`s to how you draw and interact with tiles is 100% new.

Our "Using TileMaps" guide is coming soon.

## RNG

There are a few changes to GDScript's built-in random number generator functions:

* You no longer need to call `randomize()` - this is automatic. If you do want repeatable "randomness", use `seed()` to set it to a preselected value.

* `rand_range()` is now replaced with either `randf_range()` (for floats) or `randi_range()` (for ints).

## Raycasting

When casting rays in code, there's a new API. `PhysicsDirectSpaceState[2D|3D].intersect_ray()` now takes a special object as a parameter. This object specifies the ray properties. For example, to cast a ray in 3D:

```gdscript
var space = get_world_3d().direct_space_state
var ray = PhysicsRayQueryParameters3D.create(position, destination)
var collision = space.intersect_ray(ray)
if collision:
    print("ray collided")
```