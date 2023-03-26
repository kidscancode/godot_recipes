---
title: "Shooting"
weight: 5
draft: true
pre: "05. "
---

The `Bullet` scene provides us with a

Let's head back to the `Player` scene

##

```gdscript
@export var cooldown = 0.25
@export var bullet_scene : PackedScene
var can_shoot = true
```

The two `@export` variables let you configure them in the **Inspector** so that you can adjust the cooldown time. Set the `bullet_scene` by clicking the property and choosing the `bullet.tscn` file.

Next, we'll add a `start()` function similar to the one we made for the `Bullet`. This will let us set initial values for the player, as well as resetting them when the game restarts.

```gdscript
func _ready():
    start()

func start():
    position = Vector2(screensize.x / 2, screensize.y - 64)
    $GunCooldown.wait_time = cooldown
```

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

```gdscript
func _on_gun_cooldown_timeout():
    can_shoot = true
```