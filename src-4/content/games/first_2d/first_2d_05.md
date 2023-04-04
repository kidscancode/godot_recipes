---
title: "Shooting"
weight: 5
draft: false
pre: "05. "
---

The `Bullet` scene provides us with a reusable object we can _instantiate_ whenever the player shoots.

## Adding to the player

Let's head back to the `Player` script and add a few new variables:

```gdscript
@export var cooldown = 0.25
@export var bullet_scene : PackedScene
var can_shoot = true
```

The two `@export` variables let you configure them in the **Inspector** so that you can adjust the cooldown time. Set the `bullet_scene` by clicking the property and choosing the `bullet.tscn` file.

`can_shoot` is what programmers call a *flag* - a Boolean variable that controls a certain condition. In this case it determines whether the player is allowed to shoot or not. During the cooldown period, this variable will be `false`.

Next, we'll add a `start()` function similar to the one we made for the `Bullet`. This will let us set initial values for the player, as well as resetting them when the game restarts.

```gdscript
func _ready():
    start()

func start():
    position = Vector2(screensize.x / 2, screensize.y - 64)
    $GunCooldown.wait_time = cooldown
```

This places the player at the bottom center of the screen - a good place to start. It also ensures that the cooldown timer has the correct wait time.

The `shoot()` function will be called whenever we press the "shoot" input.

```gdscript
func shoot():
    if not can_shoot:
        return
    can_shoot = false
    $GunCooldown.start()
    var b = bullet_scene.instantiate()
    get_tree().root.add_child(b)
    b.start(position + Vector2(0, -8))
```

The first thing this function does is check if the player is allowed to shoot. If it isn't, `return` will end the function immediately.

If the player is allowed to shoot, then we set the flag to `false`, and start the cooldown timer. Then we create a new bullet and add it to the game, calling its `start()` function to make sure it's placed in the correct position (just above the player's ship).

We'll also need to connect the `timeout` signal of `GunCooldown`.

```gdscript
func _on_gun_cooldown_timeout():
    can_shoot = true
```

When the cooldown ends, we can allow shooting again.

Go ahead and run the scene and try pressing the shoot action.

![alt](/godot_recipes/4.x/img/2d_101_17.gif)

{{% notice style="note" title="Adding instances to the three" %}}
Notice that we've added the new bullets as children of the SceneTree root (`get_tree().root`), and not to the player ship. This is important because if we made the bullets children of the ship, then they would be "attached" to it when it moves.
{{% /notice %}}

## Next steps

Shooting's no fun without something to shoot at. We'll start making the enemies soon, but first we need a scene where we can bring the player, enemies, and other game objects together.