---
title: "Interacting with Shaders"
weight: 2
draft: false
ghcommentid: 77
---

## Problem

You want to interact with a Godot shader from GDScript.

## Solution

To access the uniform's value from GDScript, you can use `set_shader_param()` on the object's `material` property. If the attached material is a ShaderMaterial, then you can access it like so:

```gdscript
node.material.set_shader_param("param_name", value)
```

You can also get the value with `get_shader_param()`.

For an example of this, see the [Blur Shader](/godot_recipes/3.x/shaders/blur/) recipe.

## Related Recipes

- [Shaders: Intro](/godot_recipes/3.x/shaders/intro/)