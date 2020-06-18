---
title: "Draw trajectory"
weight: 13
draft: true
---

## Problem

You want to draw the trajectory of a ballistic shot, like from a tank.

## Solution

[Ballistic bullet](/godot_recipes/2d/ballistic_bullet/)

```gdscript
var dt = 1.0/60
var num_points = 250


func update_trajectory():
    line.clear_points()
    var vel = muzzle.global_transform.x * tank.muzzle_velocity
    var pos = muzzle.global_position
    for i in max_points:
        line.add_point(pos)
        vel.y += tank.gravity * dt
        pos += vel * dt
        if pos.y > $Ground.position.y - 25:
            break
```