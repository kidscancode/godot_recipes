---
title: "Draw trajectory"
weight: 13
draft: false
---

## Problem

You want to draw the trajectory of a ballistic shot, like from a tank.

## Solution

### Setup

For this example, we're using the "Ballistic Bullet" from this recipe:

* [Ballistic bullet](/godot_recipes/2d/ballistic_bullet/)

and a tank set up like so, with a `Position2D` designating the "muzzle" where the bullet will be spawned:

![alt](/godot_recipes/img/tank_01.png)

In the tank's script, we instance the bullet like so:

```gdscript
func _unhandled_input(event):
    if event.is_action_released("shoot") and can_shoot:
        var b = Bullet.instance()
        owner.add_child(b)
        b.transform = $Barrel/Muzzle.global_transform
        b.velocity = b.transform.x * muzzle_velocity
        b.gravity = gravity
        can_shoot = false
```

This instances the bullet, adds it as a child to the "world" node (the tank's `owner`) and sets its initial properties. Note that we're using the tank to define gravity, but that's just for this example - in a full project you would likely use a global value for this.

Here's our starting setup in action:

![alt](/godot_recipes/img/tank_02.gif)

### Line setup

In the main scene, which contains the tank and the ground, we've added a `Line2D`. This is what we'll use to draw the trajectory.

To improve the line's appearance, we've set the **Width** to `15` and all of the **Capping** options to "Round". We've also added a `Gradient` in the **Fill** section:

![alt](/godot_recipes/img/2d_tank_03.png)

### Drawing the line

Now we're ready to draw the line. The goal will be to move along the projected trajectory and add points to the line as we go. Since we know the starting velocity and the gravity that the bullet is using, we can use the same calculation.

```gdscript
onready var tank = $Tank
onready var muzzle = $Tank/Barrel/Muzzle
onready var line = $Line2D
var max_points = 250

func update_trajectory(delta):
    line.clear_points()
    var pos = muzzle.global_position
    var vel = muzzle.global_transform.x * tank.muzzle_velocity
    for i in max_points:
        line.add_point(pos)
        vel.y += tank.gravity * delta
        pos += vel * delta
        if pos.y > $Ground.position.y - 25:
            break

func _process(delta):
    if Input.is_action_pressed("shoot"):
        line.show()
        update_trajectory(delta)

func _on_Bullet_exploded(pos):
    tank.can_shoot = true
    line.hide()
```

`max_points` sets the maximum number of points you want to add to the line. In the `update_trajectory()` function, we get the bullet's starting position and velocity from the tank (remember, gravity is defined in the tank too, for this example). We then iterate through those points, moving the position each "step" by the same amount the bullet will move during one frame.

We've also added a `break` if the path contacts the position of the *top* of the ground, so that we don't keep drawing in that case.

Finally, we show/hide the line when shooting or not.

![alt](/godot_recipes/img/tank_04.gif)

## Related recipes

- [2D shooting recipe](/godot_recipes/2d/2d_shooting/)
- [2D ballistic bullet](/godot_recipes/2d/ballistic_bullet)