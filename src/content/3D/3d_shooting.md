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

``markdown
- Area ("Bullet")
    - MeshInstance
    - CollisionShape
```

For the `Sprite`'s texture, you can use any image you like. Here's an example one:

![alt](/godot_recipes/img/laserRed01.png)


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

```gdscript

export (PackedScene) var Bullet

if Input.is_action_just_pressed("shoot"):
    var b = Bullet.instance()
    owner.add_child(b)
    b.connect("exploded", owner, "_on_Bullet_exploded")
    b.transform = $Head_Cube001/Pivot/Cannon_Cube005/Muzzle.global_transform
    b.velocity = -b.transform.basis.z * b.muzzle_velocity
```