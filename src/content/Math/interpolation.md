---
title: "Interpolation"
weight: 1
draft: false
---

**Linear Interpolation**, or its commonly-used abbreviation **lerp**, is a term that comes up often in game development. If you've never come across it before it can seem mysterious and highly-technical, but as you'll see in this tutorial, it's actually a straightforward concept with a wide variety of applications in game programming.

## Numeric Interpolation

The core formula for linear interpolation is this:

```gdscript
func lerp(a, b, t):
    return (1 - t) * a + t * b
```

In this formula, `a` and `b` represent the two values and `t` is the amount of interpolation, typically expressed as a value between `0` (which returns `a`), and `1` (which returns `b`). The function finds a value the given amountFor example:

```gdscript
x = lerp(0, 1, 0.75)  # x is 0.75
x = lerp(0, 100, 0.5)  # x is 50
x = lerp(10, 75, 0.3)  # x is 29.5
x = lerp(30, 2, 0.75)  # x is 9
```

It's called *linear* interpolation because the path between the two points is a straight line.

You can animate a node's properties with `lerp()`. For example, if you divide the elapsed time by the desired duration, you'll get a value between zero and one you can use to alter a property smoothly over time. This script scales a sprite up to five times its starting size while fading it out (using `modulate.a`) over two seconds:

```gdscript
extends Sprite

var time = 0
var duration = 2  # length of the effect

func _process(delta):
    if time < duration:
        time += delta
        modulate.a = lerp(1, 0, time / duration)
        scale = Vector2.ONE * lerp(1, 5, time / duration)
```

## Vector interpolation

You can also interpolate between vectors. Both `Vector2` and `Vector3` provide `linear_interpolate()` methods for this.

For example, to find a vector that's halfway between a `Spatial` node's forward and left direction vectors:

```gdscript
var forward = -transform.basis.z
var left = transform.basis.x
var forward_left = forward.linear_interpolate(left, 0.5)
```

The following example moves a Sprite node towards the mouse click position. Each frame the node moves 10% of the way to the target. This results in an "approach" effect, where the object's speed becomes slower the closer it gets to the target.

```gdscript
extends Sprite

var target

func _input(event):
    if event is InputEventMouseButton and event.pressed:
        target = event.position

func _process(delta):
    if target:
        position = position.linear_interpolate(target, 0.1)
```
<!-- !LINK -->
For more advanced applications of interpolation, see `Tween`.