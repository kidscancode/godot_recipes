---
title: "Shooting projectiles"
weight: 5
draft: true
---

## Problem

You want to shoot projectiles from your player/mob/etc..

## Solution

### Setting up the bullet

```gdscript
extends Area2D

var speed = 750

func _physics_process(delta):
    position += transform.x * speed * delta

func _on_Bullet_body_entered(body):
    if body.is_in_group("mobs"):
        body.queue_free()
    queue_free()
```

### Shooting

First we need to set up a spawn location for the bullets. Add a `Position2D` and place it where you want the bullets to spawn. Here's an example, placed at the barrel of the gun. I've named it "Muzzle".

![alt](/godot_recipes/img/2d_shoot_01.gif)

Notice that as the  player rotates, the Muzzle's `transform` remains oriented the same way relative to the gun. This will be very convenient when spawning the bullets, as they can use the transform to get the proper position *and* direction. Just set the new bullet's `transform` equal to the muzzle's.

We'll add a variable to hold the bullet scene for instancing:

```gdscript
export (PackedScene) var Bullet
```

And check `Input` for our defined input action:

```gdscript
    if Input.is_action_just_pressed("shoot"):
        shoot()
```

Now in our `shoot()` function we can instance a bullet and add it to the tree. A common mistake is to add the bullet as a child of the player:

```gdscript
func shoot():
    var b = Bullet.instance()
    add_child(b)
    b.transform = $Muzzle.transform
```

The problem here is that since the bullets are children of the player, they are affected when the player moves or rotates.

![alt](/godot_recipes/img/2d_shoot_02.gif)

To fix this, we should make sure the bullets are added to the world instead. In this case, we'll use `owner`, which refers to the root node of the scene the player is in. Note that we also need to use the muzzle's *global* transform, or else the bullet would not be where we expected.

```gdscript
func shoot():
    var b = Bullet.instance()
    owner.add_child(b)
    b.transform = $Muzzle.global_transform
```

![alt](/godot_recipes/img/2d_shoot_03.gif)

## Related recipes

- [Top-down character](/godot_recipes/2d/topdown_movement/)
- [Gamedev Math: transforms](/godot_recipes/math/transforms/)

<!-- #### Like video?

{{< youtube 7axJJYont6Y >}} -->