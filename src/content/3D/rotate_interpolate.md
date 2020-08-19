---
title: "Smooth rotation"
weight: 12
draft: true
---

## Problem

You want to smoothly rotate a 3D object to point in a new direction.

## Solution

When you first encounter this problem, you may find yourself thinking in terms of *Euler angles* - the three values representing the angles to the **x/y/z** axes. While Godot will allow you to see the object's Euler angles in the `rotation` property, it is not recommended to use them to work in 3D.

{{% notice info %}}
If you're interested in the background behind Euler angles and issues like gimbal lock, here's a [video that explains it well](https://www.youtube.com/watch?v=zc8b2Jo7mno).
{{% /notice %}}

In 3D, the object's `Transform` represents the body's position *and* orientation in space.

```gdscript
func _process(delta):
    var target_position = $Target.transform.origin
    $Arrow.look_at(target_position, Vector3.UP)
```

```gdscript
var speed = 5

func _process(delta):
    var target_position = $Target.transform.origin
    var new_transform = $Arrow.transform.looking_at(target_position, Vector3.UP)
    $Arrow.transform  = $Arrow.transform.interpolate_with(new_transform, speed * delta)
```

## Wrapping up


{{% notice note %}}
Download the project file here: [floating_text.zip](/godot_recipes/files/floating_text.zip)
{{% /notice %}}

## Related recipes

- [Gamedev Math: Transforms](/godot_recipes/math/transforms/)
- [Camera Gimbal](/godot_recipes/3d/camera_gimbal/)

#### Like video?

