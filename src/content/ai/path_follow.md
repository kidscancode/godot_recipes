---
title: "Path following"
weight: 2
draft: false
---

## Problem

You want a character to follow a pre-defined path, such as a guard patrolling or a car following the road.

## Solution

There are many ways to approach this problem. In this solution, we'll use Godot's `Path2D` node (or `Path` for 3D) as a convenient way to draw paths in the editor.

You can add the `Path2D` as a child of your main scene, your map, or another location that makes sense. Don't make it a child of the patrolling entity, though - or the path will move along with the player!

### Drawing the path

After adding the `Path2D` node, you'll see some new buttons appear above the viewport:

![alt](/godot_recipes/img/path2d_buttons.png)

Select the "Add points" button and click to start adding. If you want a closed curve, the "Close curve" button will connect the last point to the first one.

Use the "Control points" mode to adjust the "curviness" of the line.

### Moving along the path

You can use `PathFollow2D` to automatically move along a path. However, if you're using a kinematic body, this will cause problems with collisions, because you're not using the body's movement methods. For this reason, we'll instead use the path's points as "targets" for the body to move towards.

```gdscript
extends KinematicBody2D

var move_speed = 100
export (NodePath) var patrol_path
var patrol_points
var patrol_index = 0

func _ready():
    if patrol_path:
        patrol_points = get_node(patrol_path).curve.get_baked_points()
```

Exporting the `patrol_path` lets us assign the path node directly in the Inspector. Then, if it's assigned, we can get the points that make up the line in `_ready()`.

Next, we can use the currently selected point in the path as our target for movement. If we get close enough to it, we advance to the next point in the curve, using `wrapi()` to loop around to the first point when we reach the end.

```gdscript
func _physics_process():
    if !patrol_path:
        return
    var target = patrol_points[patrol_index]
    if position.distance_to(target) < 1:
        patrol_index = wrapi(patrol_index + 1, 0, patrol_points.size())
        target = patrol_points[patrol_index]
    velocity = (target - position).normalized() * move_speed
    velocity = move_and_slide(velocity)
```

## Related recipes

