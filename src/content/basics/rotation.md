---
title: "Circular movement"
weight: 6
draft: false
---

## Problem

You want an object to "orbit" (move in a circle) around another object.

## Solution

This is a common beginner question, and often comes after a bunch of messy experimenting with trig functions. The answer is much simpler:

![alt](/godot_recipes/img/circle_motion_01.png)

Place the orbiting sprite in a child node of the main sprite (we're calling it "Pivot"). Give it an offset and rotate the `Pivot`.

```gdscript
extends Node2D

export var rotation_speed = PI


func _process(delta):
    $Sprite/Pivot.rotation += rotation_speed * delta
```

![alt](/godot_recipes/img/circle_motion_02.gif)

This works just as well in 3D, too:

```gdscript
extends Spatial

export var rotation_speed = PI


func _process(delta):
    $MeshInstance/Pivot.rotate_y(rotation_speed * delta)

```

![alt](/godot_recipes/img/circle_motion_03.gif)