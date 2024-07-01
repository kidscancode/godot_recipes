---
title: "RigidBody2D: Move to Target"
weight: 3
draft: false
---

## Problem

You want a rigid body to move to a target position.

## Solution

Using {{< gd-icon RigidBody2D >}}`RigidBody2D` can be tricky. Because it's controlled by Godot's physics engine, you need to apply forces rather than moving it directly. Before doing anything with rigid bodies, I highly recommend looking at the [RigidBody2D API doc](https://docs.godotengine.org/en/stable/classes/class_rigidbody2d.html).

To move a body, we need to apply a push in a given direction - a *force*. Once the body is moving, we want the force to get smaller as we get closer to the final position.

This is the perfect situation to use the `Vector2.distance_to()` function. It will tell us how far away the target is, and we can use that to set the force.


```gdscript
# Smoothly move to target
extends RigidBody2D

var linear_force = 5
var target = position


func _physics_process(delta):
    var dist = position.distance_to(target)
    constant_force = dir * linear_force * dist
```

{{% notice style="note" title="Use linear damp" %}}
If you try this using the default {{< gd-icon RigidBody2D >}}`RigidBody2D` settings, you will notice that the body shoots right past the target. This is due to the body's **Linear/Damp** property, which has a default setting (found in the *Project Settings* of `1`). This value represents "friction" and controls how quickly a moving rigid body will come to a stop when no force is applied. Increasing this value will ensure that your body coasts to a stop at the target. Experiment with how this value and the `linear_force` interact to get the exactly the movement you're looking for.
{{% /notice %}}

## Related recipes

-  [RigidBody2D: Look at Target](/godot_recipes/4.x/physics/smooth_rigid_rotate/)
