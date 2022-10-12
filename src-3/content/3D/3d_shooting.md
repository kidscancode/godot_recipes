---
title: "Shooting projectiles"
weight: 5
draft: false
ghcommentid: 36
---

## Problem

You want to shoot projectiles from your player/mob/etc..

## Solution

For this example, we'll use the "Mini Tank" that we set up in [KinematicBody: Movement](/godot_recipes/3.x/3d/kinematic_body/).

### Setting up the bullet

First, we'll set up a "bullet" object that we can instance. Here are the nodes we'll use:

```
{{< gd-icon Area3D >}} Area: Bullet
    {{< gd-icon MeshInstance3D >}} MeshInstance
    {{< gd-icon CollisionShape3D >}} CollisionShape
```

For your mesh, you can use one of Godot's built-in primitive shapes, or something like this:

![alt](/godot_recipes/3.x/img/3d_shoot_01.png)

{{% notice note %}}
If you'd like to use the bullet model pictured here, you can grab it from [Kenney's "Weapon Pack"](https://kenney.nl/assets/weapon-pack).
{{% /notice %}}

Add your mesh to the {{< gd-icon MeshInstance3D >}}`MeshInstance` and a scale a collision shape to match.

{{% notice warning %}}
Remember to align your {{< gd-icon MeshInstance3D >}}`MeshInstance` with the forward direction (**-Z**) of the `Area` node, or your bullet won't look like it's flying the right way!
{{% /notice %}}

Add a script and connect the {{< gd-icon Area3D >}}`Area`'s `body_entered` signal.

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

We're using a custom gravity vector, `g` so that we can control how the shell flies from the tank's cannon, giving it a nice arc effect. If you'd rather your projectiles move in a straight line, you can remove the line that applies it in `_physics_process()`.

Using `look_at()` each frame turns the bullet to point in its direction of travel.

We'll also emit an `exploded` signal, which you can connect up to implement explosion and/or damage effects (but that's for another recipe).

### Shooting

Now in the tank (or whatever object you have doing the shooting), add a {{< gd-icon Position3D >}}`Position3D` child at the point where you want the bullets to appear. In the case of our tank, we're placing it at the end of the cannon barrel:

![alt](/godot_recipes/3.x/img/3d_shoot_02.png)

Now we can add the code to the tank's script. First a way to add the bullet scene we're going to instance:

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

That's it - run your scene and try it out:

<video controls src="/godot_recipes/3.x/img/3d_shoot_03.webm"></video>

{{% notice note %}}
Download the project file here: [3d_shooting.zip](/godot_recipes/3.x/files/3d_shooting.zip)
{{% /notice %}}

## Related recipes

- [KinematicBody: Movement](/godot_recipes/3.x/3d/kinematic_body/)
- [Godot 101: Intro to 3D](/godot_recipes/3.x/g101/3d/)

<!-- #### Like video?

{{< youtube 7axJJYont6Y >}} -->