---
title: "Using 2D Joints"
weight: 7
draft: false
---

## Problem

You'd like to understand Godot's `Joint2D` nodes.

## Solution

Joint are used to constrain the movement of attached physics objects. For any joint node, you need to attach two bodies, which must extend from `PhysicsObject2D`.

#### Properties

These properties are common to all joint nodes:

- _Node A_ and _Node B_: The assigned physics bodies.
- _Bias_: The rate at which the joint pulls the two bodies back together if they move apart. Defaults to `0`.
- _Disable Collisions_: Allows the connected bodies to ignore collisions between them. Defaults to `true`.

There are three types of Joint2D. In all of the following examples, there is one `RigidBody2D` connected via a joint to a `StaticBody2D`. "Visible Collision Shapes" is enabled in the screen images below so you can see a representation of the joint.

### PinJoint2D

The "pin" joint attaches the two bodies at a single point, allowing them to freely rotate.

![alt](/godot_recipes/img/pinjoint_example.gif)

The pin joint's _Softness_ property gives some "springiness" to the connection. The value can range from `0` (the default) which allows no movement, to `16`.

![alt](/godot_recipes/img/pinjoint_example2.gif)

### DampedSpringJoint2D

This joint connects the two bodies with a spring-like force.

![alt](/godot_recipes/img/springjoint_example.gif)

The spring's behavior can be adjusted with these properties:

- _Length_: The joint's maximum length.
- _Rest Length_:The joint's length when no forces or movement are applied.
- _Stiffness_: The spring's "stretchiness", i.e. how much it resists forces pulling against it.
- _Damping_: How quickly the spring stops "bouncing".

### GrooveJoint2D

This joint constrains the attached bodies to move linearly.

![alt](/godot_recipes/img/groovejoint_example.gif)

By default, the groove runs vertically, but you can change this by rotating the groove node.

These properties control the groove's behavior:

- _Length_: The groove's length. The attached bodies can't move past this maximum distance.
- _Initial Offset_: Starting "position" along the groove.

You can download an example project to play with these joints here: [physics_joints.zip](/godot_recipes/files/physics_joints.zip)

![alt](/godot_recipes/img/joints_demo.png)

## Related Recipes
