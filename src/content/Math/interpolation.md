---
title: "Interpolation"
weight: 1
draft: true
---

**Interpolation**, or its commonly-used abbreviation **lerp**, is a term that
comes up quite often in game development. If you've never come across it before
it can seem mysterious and highly-technical, but as you'll see in this tutorial,
it's actually a straightforward concept with a wide variety of applications in
game programming.

The core formula for linear interpolation is this:

```gdscript
func lerp(a, b, t):
    return (1 - t) * a + b * t
```

numeric examples

vector interp

45deg angle
var forward_dir = get_transform().basis.z
var left_dir = get_transform().basis.x
var mid_forward_left_dir = forward_dir.linear_interpolate(left_dir, 0.5)

animating - changing the weight
smoothing - approach

link to Tween