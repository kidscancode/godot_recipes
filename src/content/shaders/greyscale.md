---
title: "Greyscale (monochrome) shader"
weight: 3
draft: false
---

## Problem

You want a shader to convert an image to greyscale.

## Solution

Let's start with a `canvas_item` (2D) shader. To convert to greyscale but also preserve pixel contrast, we need to _average_ the pixel's color value. Add the color channels together and divide by 3:

```glsl
shader_type canvas_item;

void fragment() {
    COLOR = texture(TEXTURE, UV);
    float avg = (COLOR.r + COLOR.g + COLOR.b) / 3.0;
    COLOR.rgb = vec3(avg);
}
```

![alt](/godot_recipes/img/shader_greyscale01.png)

You can apply this to the whole screen by adding a ColorRect (placed in a CanvasLayer to ignore camera movement) and scaling it to cover the screen.

Change the `texture()` function to sample the screen instead of the object's pixels:

```glsl
COLOR = texture(SCREEN_TEXTURE, SCREEN_UV);
```

![alt](/godot_recipes/img/shader_greyscale02.png)

## Related Recipes

- [Shaders: Intro](/godot_recipes/shaders/intro/)