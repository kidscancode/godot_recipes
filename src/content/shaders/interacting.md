---
title: "Interacting with Shaders"
weight: 2
draft: false
---

## Problem

You want to interact with a Godot shader from GDScript.

## Solution

To access the uniform's value from GDScript, you can use `set_shader_param()` on the object's `material` property. If the attached material is a ShaderMaterial, then you can access it like so:

```gdscript
node.material.get_shader_param("param_name", value)
```

You can also change the value with `set_shader_param()`.

For an example of this, see the [Blur Shader](/godot_recipes/shaders/blur/) recipe.

## Related Recipes

- [Shaders: Intro](/godot_recipes/shaders/intro/)