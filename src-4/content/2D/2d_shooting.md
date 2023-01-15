---
title: "Shooting projectiles"
weight: 2
draft: false
ghcommentid: 26
---

## Problem

You want to shoot projectiles from your player/mob/etc..

## Solution

### Setting up the bullet

First, we'll set up a "bullet" object that we can instance. Here are the nodes we'll use:

```
{{< gd-icon Area2D >}} Area2D: Bullet
    {{< gd-icon Sprite2D >}} Sprite2D
    {{< gd-icon CollisionShape2D >}} CollisionShape2D
```

For the {{< gd-icon Sprite2D >}}`Sprite2D`'s texture, you can use any image you like. Here's an example one:

![alt](/godot_recipes/4.x/img/laserRed01.png)

Set up the nodes and configure the sprite and collision shape. If your texture is oriented pointing up, like the one above, make sure to rotate the {{< gd-icon Sprite2D >}}`Sprite` node by `90°` so that it's pointing to the right, ensuring it matches the parent’s “forward” direction.

Add a script and connect the {{< gd-icon Area2D >}}`Area2D`'s `body_entered` signal.

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

For this example, we'll remove the bullet if it hits anything at all. We'll also delete anything tagged in the "mobs" group that it hits.

### Shooting

We need to set up a spawn location for the bullets. Add a {{< gd-icon Marker2D >}}`Marker2D` and place it where you want the bullets to spawn. Here's an example, placed at the barrel of the gun. I've named it "Muzzle".

![alt](/godot_recipes/4.x/img/2d_shoot_01.gif)

Notice that as the  player rotates, the Muzzle's `transform` remains oriented the same way relative to the gun. This will be very convenient when spawning the bullets, as they can use the transform to get the proper position *and* direction. We just set the new bullet's `transform` equal to the muzzle's.

{{% notice tip %}}
This will work for any character type, not just the "rotate-and-move" style shown here. Just attach the {{< gd-icon Marker2D >}}`Marker2D` where you want the bullets to spawn.
{{% /notice %}}

In the character's script we add a variable to hold the bullet scene for instancing:

```gdscript
export var Bullet : PackedScene
```

And check for our defined input action:

```gdscript
    if Input.is_action_just_pressed("shoot"):
        shoot()
```

Now in our `shoot()` function we can instance a bullet and add it to the tree. A common mistake is to add the bullet as a child of the player:

```gdscript
func shoot():
    var b = Bullet.instantiate()
    add_child(b)
    b.transform = $Muzzle.transform
```

The problem here is that since the bullets are children of the player, they are affected when the player moves or rotates.

![alt](/godot_recipes/4.x/img/2d_shoot_02.gif)

To fix this, we should make sure the bullets are added to the world instead. In this case, we'll use `owner`, which refers to the root node of the scene the player is in. Note that we also need to use the muzzle's *global* transform, or else the bullet would not be where we expected.

```gdscript
func shoot():
    var b = Bullet.instantiate()
    owner.add_child(b)
    b.transform = $Muzzle.global_transform
```

![alt](/godot_recipes/4.x/img/2d_shoot_03.gif)

## Related recipes

<!-- - [Top-down character](/godot_recipes/3.x/2d/topdown_movement/) -->
- [Gamedev Math: transforms](/godot_recipes/4.x/math/transforms/)
<!-- - [AI: Homing missiles](/godot_recipes/3.x/ai/homing_missile/) -->

<!-- #### Like video?

{{< youtube 7axJJYont6Y >}} -->

## <i class="fas fa-code-branch"></i> Download This Project

Download the project code here: [https://github.com/godotrecipes/2d_shooting](https://github.com/godotrecipes/2d_shooting)
