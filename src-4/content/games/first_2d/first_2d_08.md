---
title: "Enemy Shooting"
weight: 8
draft: false
pre: "08. "
---

Now that our enemy can shoot, let's give them something to shoot at.

## Enemy bullet scene

Make a new `EnemyBullet` scene just like you made the player bullet earlier. We won't go into all the steps here, but you can refer back to that part if you're stuck. The only difference here is that you can use the `Enemy_projectile (16 x 16).png` image instead.

The script will be a little bit different:

```gdscript
extends Area2D

@export var speed = 150

func start(pos):
    position = pos

func _process(delta):
    position.y += speed * delta
```

Connect the `screen_exited` and `area_entered` signals of the {{< gd-icon VisibleOnScreenNotifier2D >}}`VisibleOnScreenNotifier2D` and {{< gd-icon Area2D >}}`Area2D`, respectively:

```gdscript
func _on_visible_on_screen_notifier_2d_screen_exited():
    queue_free()

func _on_area_entered(area):
    if area.name == "Ship":
        queue_free()
```

Notice that we're detecting the hit on the player, but it's not doing anything yet. We'll come back to that once we add a way for the player to take damage.

## Adding shooting to the enemy

At the top of the enemy's script, load the new bullet:

```gdscript
var bullet_scene = preload("res://enemy_bullet.tscn")
```

Then update the shooting function:

```gdscript
func _on_shoot_timer_timeout():
    var b = bullet_scene.instantiate()
    get_tree().root.add_child(b)
    b.start(position)
    $ShootTimer.wait_time = randf_range(4, 20)
    $ShootTimer.start()
```

Play the `Main` scene again and you should have some random enemy bullets appearing.