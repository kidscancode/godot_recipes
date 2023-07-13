---
title: "Asteroids-style Physics (using RigidBody2D)"
weight: 12
draft: false
---

## Problem

You want to use a {{< gd-icon RigidBody2D >}}`RigidBody2D` to create a semi-realistic spaceship, a la *Asteroids*.

## Solution

Using {{< gd-icon RigidBody2D >}}`RigidBody2D` can be tricky. Because it's controlled by Godot's physics engine, you need to apply forces rather than moving it directly. Before doing anything with rigid bodies, I highly recommend looking at the [RigidBody2D API doc](https://docs.godotengine.org/en/stable/classes/class_rigidbody2d.html), and we'll refer to it as we work through this example.

For this example, we'll use the following node setup:

```
{{< gd-icon RigidBody2D >}} RigidBody2D (Ship)
     {{< gd-icon Sprite2D >}} Sprite2D
     {{< gd-icon CollisionShape2D >}} CollisionShape2D
```

{{% notice style="tip" title="Sprite orientation" %}}
Don't forget to orient your sprite correctly. An object that is not rotated should be pointing along the **+X** axis, i.e. to the right. If your sprite's art is drawn facing in another direction, rotate the {{< gd-icon Sprite2D >}}`Sprite2D` (not the parent body) to align it correctly.
{{% /notice %}}

We'll use the following inputs in the **Input Map**:

|Input|Key|
|-----|---|
|`thrust`| **w** or ↑|
|`rotate_right`|**d** or →|
|`rotate_left`|**a** or ←|

Add a script to the body, and let's define some variables:

```gdscript
extends RigidBody2D

@export var engine_power = 800
@export var spin_power = 10000

var thrust = Vector2.ZERO
var rotation_dir = 0
```

The first two variables are how we'll control the ship's "handling". `engine_power` is going to affect acceleration and top speed. `spin_power` controls how fast the ship rotates.

`thrust` and `rotation_dir` are going to be set by pressing the inputs. Let's do that next:

```gdscript
func get_input():
    thrust = Vector2.ZERO
    if Input.is_action_pressed("thrust"):
        thrust = transform.x * engine_power
    rotation_dir = Input.get_axis("rotate_left", "rotate_right")
```

If we're pressing the `"thrust"` input, we'll set the `thrust` vector to the ship's forward direction, while `rotation_dir` will be `+/-1` based on the rotate inputs.

We can start flying by applying those values in `_physics_process()`:

```gdscript
func _physics_process(_delta):
    get_input()
    constant_force = thrust
    constant_torque = rotation_dir * spin_power
```

It works, but you'll notice that it's very hard to control. The rotation is too fast, and it accelerates to a high speed before going offscreen. This is where we want to break from "real" space physics. In space, there's no friction, but our Asteroids-style ship will be a lot easier to control if it coasted to a stop when we're not thrusting. We can control this with *damping*.

In the {{< gd-icon RigidBody2D >}}`RigidBody2D` properties, you'll find **Linear/Damp** and **Angular/Damp**. Set these to `1` and `2` respectively, and they'll slow the movement/rotation as well as causing them to stop.

Feel free to experiment with these values and how they interact with the `engine_power` and `spin_power`

### Screen wrapping

Wrapping around the screen is really teleportation: when the ship goes off the right side of the screen, you teleport it to the left side. However, if you just tried to change the `position`, you'd find that it instantly snapped back. This is because the physics engine is trying to control the position as well.

The solution to this is to use the `_integrate_forces()` callback of the rigid body. In this function, you can safely update the physics properties of the object without conflicting with what the physics engine is doing.

Let's get the screensize at the top of the script:

```gdscript
@onready var screensize = get_viewport_rect().size
```

Then add the new function:

```gdscript
func _integrate_forces(state):
    var xform = state.transform
    xform.origin.x = wrapf(xform.origin.x, 0, screensize.x)
    xform.origin.y = wrapf(xform.origin.y, 0, screensize.y)
    state.transform = xform
```

As you can see, the `_integrate_forces()` function includes a parameter called `state`. This object is the [PhysicsDirectBodyState2D](https://docs.godotengine.org/en/stable/classes/class_physicsdirectbodystate2d.html) of our body. It contains all of the current physics properties such as the forces, velocity, position, etc.

From the state, we grab the current transform, modify it to wrap around the screen using `wrapf()`, and then set it back to the current state.

Here's how it looks:

![alt](/godot_recipes/4.x/img/asteroids_wrap.gif)

### Warping

Let's look at one more example of using `_integrate_forces()` to alter the body's state without issues. Let's add a "warp" mechanic - when the player presses the `"warp"` input, the ship will teleport to a random spot on the screen.

First, we'll add a new variable for this:

```gdscript
var teleport_pos = null
```

Then, in `get_input()`, we'll set a random position:

```gdscript
    if Input.is_action_just_pressed("warp"):
        teleport_pos = Vector2(randf_range(0, screensize.x), randf_range(0, screensize.y))
```

Finally, in `_integrate_forces()`, if there's a `teleport_position` set, we'll use it and then clear it:

```gdscript
    if teleport_pos:
        physics_state.transform.origin = teleport_pos
        teleport_pos = null
```

![alt](/godot_recipes/4.x/img/asteroids_warp.gif)

## <i class="fas fa-code-branch"></i> Download This Project

Download the project's example code here: [https://github.com/godotrecipes/asteroids_physics](https://github.com/godotrecipes/asteroids_physics)
