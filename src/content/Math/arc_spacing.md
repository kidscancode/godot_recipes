---
title: "Arc positioning"
weight: 5
draft: true
---

## Problem

You need to Examples: bullet spread, radial menu.

## Solution

asdf

* `num_items` - The number of objects you want to place
* `arc` - The angle of the full arc


```gdscript
var arc
for i in num_items:
    var angle = -arc / 2 + i * arc / (num_items - 1)
```


{{% notice note %}}
Download the project file here: [2d_touch_camera.zip](/godot_recipes/files/2d_touch_camera.zip)
{{% /notice %}}

## Related recipes

- [Input: Input Actions](/godot_recipes/input/input_actions/)
- [Drag-select multiple units](/godot_recipes/input/multi_unit_select/)

<!-- #### Like video?

{{< youtube -jRMhJSwd-Xw >}} -->
