---
title: "3D Transforms"
weight: 4
draft: true
ghcommentid:
---

- introduction
- Use Local Space (T)

- properties (position, rotation, scale)
- parent (local vs. global)

- Spatial helper functions
    - translate/scale/rotate (local)
    - rotate_x, etc
    - look_at/look_at_from_position
- Transform helper functions
    xform/xform_inv
    rotated/translated/scaled
    interpolate_with
- Basis
    - rotated/scaled
    - xform/xform_inv
    - slerp

In 3D space, the concept of transforms applies in the same way as in 2D. In fact, working with transforms becomes a necessity, as using angles in 3D can lead to a variety of problems, as we'll see in a bit.

3D nodes inherit from the base node {{< gd-icon Node3D >}}[`Spatial`](https://docs.godotengine.org/en/latest/classes/class_spatial.html), which contains the transform information. You can see the `transform` property in the Inspector for any 3D node:

![alt](/3.x/img/transform3D_01.png)

The 3D transform contains more information than the 2D version. Position data is still held in the `origin` property, but rotation is contained in a property called `basis`. The basis contains three unit vectors representing the body's local **X**, **Y**, and **Z** axes.

![alt](/3.x/img/3d_intro_gizmo.png)

{{% notice note %}}
In the editor, you can see and manipulate the body's local orientation by clicking the "Local Space Mode" button.
![alt](/3.x/img/3d_intro_local_space.png)
{{% /notice %}}

As in 2D, we can use the local axes to move an object forward. In Godot's 3D orientation (**Y-up**), this means that by default the body's **-Z** axis is the forward direction:

```gdscript
    translation += -transform.basis.z
```

{{% notice tip %}}
Godot has default vector values defined, for example: `Vector3.FORWARD == Vector3(0, 0, -1)`. See [Vector2](https://docs.godotengine.org/en/latest/classes/class_vector2.html) and [Vector3](https://docs.godotengine.org/en/latest/classes/class_vector3.html) for details.
{{% /notice %}}