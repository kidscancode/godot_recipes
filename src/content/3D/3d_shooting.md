---
title: "Shooting projectiles"
weight: 5
draft: true
---

## Problem

You want to shoot projectiles from your player/mob/etc..

## Solution

For this example, we'll use the "Mini Tank" that we set up in LINK

### Setting up the bullet

First, we'll set up a "bullet" object that we can instance. Here are the nodes we'll use:

```markdown
- Area ("Bullet")
    - MeshInstance
    - CollisionShape
```

For your mesh, you can use one of Godot's built-in primitive shapes, or something like this:

![alt](/godot_recipes/img/3d_shoot_01.png)

{{% notice note %}}
If you'd like to use the bullet model pictured here, you can grab it from [Kenney's "Weapon Pack"](https://kenney.nl/assets/weapon-pack).
{{% /notice %}}

Add your mesh and a collision shape to match.

{{% notice warning %}}
Remember to align your mesh with the forward direction (**-Z**) of the `Area` node, or your bullet will look like it's flying sideways!
{{% /notice %}}

Add a script and connect the `Area`'s `body_entered` signal.

```gdscript
extends Area

signal exploded

export var muzzle_velocity = 25
export var g = Vector3.DOWN * 20

var velocity = Vector3.ZERO


func _physics_process(delta):
    velocity += g * delta
    look_at(transform.origin + velocity.normalized(), Vector3.UP)
    transform.origin += velocity * delta


func _on_Shell_body_entered(body):
    emit_signal("exploded", transform.origin)
    queue_free()
```

We're using a custom gravity vector, `g` so that we can customize how the shell flies from the tank's cannon, giving it a nice arc effect. If you'd rather your projectiles move in a straight line, you can remove the line that applies it in `_physics_process()`.

Using `look_at()` each frame turns the bullet to point in its direction of travel.

We'll also emit an `exploded` signal, which you can connect up to implement explosion effects (but that's for another recipe).

```gdscript
export (PackedScene) var Bullet
```

And in `_process()` or `_unhandled_input()` (wherever you're capturing input), add the code to instance the bullet:

```gdscript
if Input.is_action_just_pressed("shoot"):
    var b = Bullet.instance()
    owner.add_child(b)
    b.transform = $Cannon/Muzzle.global_transform
    b.velocity = -b.transform.basis.z * b.muzzle_velocity
```