---
title: "RigidBody2D: Look at Target"
weight: 2
draft: false
---

## Problem

You want a rigid body to rotate smoothly to look at a target.

## Solution

Using {{< gd-icon RigidBody2D >}}`RigidBody2D` can be tricky. Because it's controlled by Godot's physics engine, you need to apply forces rather than moving it directly. Before doing anything with rigid bodies, I highly recommend looking at the [RigidBody2D API doc](https://docs.godotengine.org/en/stable/classes/class_rigidbody2d.html).

To rotate a body, we need to apply a rotational force - a *torque*. Once the body is rotating, we want the torque to get smaller as we get closer to the final rotation.

This is the perfect situation to use the *dot product*. Its sign will tell us whether the target is to the left/right, and its magnitude will tell us how far away from the target direction we're pointing.

{{% notice style="tip" title="" %}}
See [Vectors: Using Dot and Cross Product](/godot_recipes/4.x/math/dot_cross_product/) for a brief review of the dot product.
{{% /notice %}}

```gdscript
extends RigidBody2D

var angular_force = 50000
var target = position + Vector2.RIGHT

func _physics_process(delta):
    var dir = transform.y.dot(position.direction_to(target))
    constant_torque = dir * angular_force
```

You may be wondering why we're using the `transform.y` here, when `transform.x` is the body's forward vector. Using `transform.x`, the dot product would be at its maximum when the body is directly pointing at the target, but we want the torque to be zero at that point. Using `transform.y` means that our torque will be higher when we're *not* aligned with the target.

### Skip the Rigid Body Entirely

You can avoid all of this entirely by not rotating your rigid body at all! Instead, change the child sprite's `rotation` to point at the target. You can use `lerp()` or a {{< gd-icon Tween >}}`Tween` to make the rotation as smooth as you wish.

In many cases, this will be a great solution. Remember, the underlying body's orientation doesn't have to match the attached sprite!

## Related recipes

- [Vectors: Using Dot and Cross Product](/godot_recipes/4.x/math/dot_cross_product/index.html)
- [RigidBody2D: Move to Target](/godot_recipes/4.x/physics/smooth_rigid_move/)
