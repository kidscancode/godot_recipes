---
title: "Customizing the Mouse Cursor"
weight: 5
draft: false
---

## Problem

You want to use a custom mouse cursor.

## Solution

Setting the mouse cursor is done with `Input.set_custom_mouse_cursor()`. All you need is a texture to use. The texture must be no larger than `256x256` pixels in size.

For example, to use the following image:

![alt](/godot_recipes/img/crosshair137.png)

And set its hotspot to the center:

```gdscript
extends Node2D

func _ready():
    Input.set_custom_mouse_cursor(cursor_image,
            Input.CURSOR_ARROW,
            Vector2(64, 64))
```

The second parameter sets which system cursor to replace. See the [Input docs](https://docs.godotengine.org/en/latest/classes/class_input.html#enum-input-cursorshape) for the full list.
