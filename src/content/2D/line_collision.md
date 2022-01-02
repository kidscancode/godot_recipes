---
title: "Line2D Collision"
weight: 12
draft: false
ghcommentid: 109
tags:
---

## Problem

You want to have collisions with a {{< gd-icon Line2D >}}`Line2D`.

## Solution

### Node setup

Add the following nodes to your scene, and draw your line as desired:

```
{{< gd-icon Line2D >}} Line2D
    {{< gd-icon StaticBody2D >}} StaticBody2D
```

Don't add a collision shape to the body yet!

{{% notice note %}}
You can use an {{< gd-icon Area2D >}}`Area2D` instead if you want to detect overlap with the line rather than collision.
{{% /notice %}}

Next, we need to add collision shapes to the body. We have two options:

### Option 1: Using {{< gd-icon SegmentShape2D >}}`SegmentShape2D`

{{< gd-icon SegmentShape2D >}}`SegmentShape2D` is a line-segment collision shape. The idea here is to create a segment collision for each pair of points in the line.

```gdscript
extends Line2D

func _ready():
    for i in points.size() - 1:
        var new_shape = CollisionShape2D.new()
        $StaticBody2D.add_child(new_shape)
        var segment = SegmentShape2D.new()
        segment.a = points[i]
        segment.b = points[i + 1]
        new_shape.shape = segment
```

### Option 2: Using {{< gd-icon RectangleShape2D >}}`RectangleShape2D`

{{< gd-icon SegmentShape2D >}}`SegmentShape2D` does not have any width component, so if you need your line collision to have a thickness, you can use a rectangle collision instead.

```gdscript
extends Line2D

func _ready():
    for i in points.size() - 1:
        var new_shape = CollisionShape2D.new()
        $StaticBody2D.add_child(new_shape)
        var rect = RectangleShape2D.new()
        new_shape.position = (points[i] + points[i + 1]) / 2
        new_shape.rotation = points[i].direction_to(points[i + 1]).angle()
        var length = points[i].distance_to(points[i + 1])
        rect.extents = Vector2(length / 2, 10)
        new_shape.shape = rect
```

{{% notice note %}}
Download an example project here: [2d_line_collision.zip](/godot_recipes/files/2d_line_collision.zip)
{{% /notice %}}


## Related recipes

- [Top-down Movement](/godot_recipes/2d/topdown_movement/)