---
title: "Ballistic bullet"
weight: 12
draft: false
---

## Problem

You want a 2D bullet that travels in an arc, or ballistic curve.

## Solution

One approach to this problem would be to use a `RigidBody2D` - with its built-in physics, gravity would automatically pull it back to earth after firing it.

However, as mentioned in the [2D shooting recipe](/godot_recipes/2d/2d_shooting/), `Area2D` is a great choice for simple bullets and other projectiles - when you don't need collisions, bouncing, or other physics reactions. Ballistic motion is easy enough to calculate that we won't need the help of the physics engine.

### Setting up the bullet

```markdown
- Bullet (Area2D)
    - Sprite
    - CollisionShape2D
```

We can use `Area2D`'s `gravity` property. Set it to `150` for the initial test.

```gdscript
extends Area2D

var velocity = Vector2(350, 0)


func _process(delta):
    velocity.y += gravity * delta
    position += velocity * delta
    rotation = velocity.angle()


func _on_BallisticBullet_body_entered(body):
    queue_free()
```

Using the [standard equations of motion](https://www.khanacademy.org/science/physics/one-dimensional-motion/kinematic-formulas/a/what-are-the-kinematic-formulas) is all we need to do here. The initial value for `velocity` is just for testing. Run the bullet scene:

![alt](/godot_recipes/img/2d_ballistic_01.gif)

Now in your object that's doing the shooting, you can instance the bullet and set its initial properties. Put this in whatever function/input handles shooting:

```gdscript
export var muzzle_velocity = 350
export var gravity = 250

func shoot():
    var b = Bullet.instance()
    owner.add_child(b)
    b.transform = $Barrel/Position2D.global_transform
    b.velocity = b.transform.x * muzzle_velocity
    b.gravity = gravity
```

Here's an example in action:

![alt](/godot_recipes/img/2d_ballistic_02.gif)

## Related recipes

- [2D shooting recipe](/godot_recipes/2d/2d_shooting/)
