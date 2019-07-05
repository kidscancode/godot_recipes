---
title: "Blur shader"
weight: 4
draft: false
---

## Problem

You want a shader to blur an object or the screen.

## Solution

```glsl
shader_type canvas_item;

uniform float blur_amount : hint_range(0, 5);

void fragment() {
	COLOR = textureLod(SCREEN_TEXTURE, SCREEN_UV, blur_amount);
}
```

For example, to gradually blur the entire screen, such as for a scene transition effect:

![alt](/godot_recipes/img/blur_shader1.png)
![alt](/godot_recipes/img/blur_shader2.png)

You can also animate the blurring:

```gdscript
extends Node

# Add a ColorRect or other Control set to fill the screen
# Place it lower in the tree and/or place in CanvasLayer
# so it's on top of the rest of the scene.
onready var blur = $Blur
var blur_amount = 0

func _process(delta):
    blur_amount = wrapf(blur_amount + 0.05, 0.0, 5.0)
    blur.material.set_shader_param("blur_amount", blur_amount)
```

<video controls src='/godot_recipes/img/blur_shader3.webm'></video>

## Related Recipes

- [Shaders: Intro](/godot_recipes/shaders/intro/)
- [Interacting with Shaders](/godot_recipes/shaders/interacting/)