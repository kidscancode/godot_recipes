---
title: "Entering/Exiting the screen"
weight: 1
draft: false
---

## Problem

You want to detect when an object enters or exits the screen.

## Solution

The engine provides a node for this: `VisibilityNotifier2D`. Attach this node to your object, and you'll be able to use its `screen_entered` and `screen_exited` signals.

#### Example 1

Consider a projectile that travels in a straight line after it's fired. If we continue firing, eventually we'll have a large number of objects for the engine to track, event though they're offscreen, which can cause lag.

Here's the movement code for the projectile:

```gdscript
extends Area2D

var velocity = Vector2(500, 0)

func _process(delta):
    position += velocity * delta
```

To have the projectile automatically deleted when it moves offscreen, add a `VisibilityNotifier2D` and connect its `screen_exited` signal.

```gdscript
func _on_VisibilityNotifier2D_screen_exited():
    queue_free()
```

#### Example 2

We have an enemy that performs some actions, such as moving along a path or playing an animation. On a large map with many enemies, only a few of them will be onscreen at the same time. We can disable the enemy's actions while it's offscreen using `VisibilityNotifier2D`.

Partial code:

```gdscript
var active = false

func _process(delta):
    if active:
        play_animation()
        move()

func _on_VisibilityNotifier2D_screen_entered():
    active = true

func _on_VisibilityNotifier2D_screen_exited():
    active = false
```
