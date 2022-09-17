---
title: "RayCast2D"
draft: false
ghcommentid: 87
---

## {{< gd-icon RayCast2D >}}RayCast2D

*Raycasting* is a common technique in game development. "Casting a ray" means extending a line from a point until it collides with something or reaches its limit.

### Node properties

Add a {{< gd-icon RayCast2D >}}`RayCast2D` node and take a look at the Inspector:

![alt](/3.x/img/kyn_raycast2d_01.png)

Here are the main properties you'll need to understand:

* **Enabled**

Turn this on to make the raycast work. *This property is disabled by default!*

* **Exclude Parent**

This property causes the ray to ignore collisions with the parent object. Enabled by default.

* **Cast To**

This is the destination point of the ray. *Note:* This is in *local* coordinates.

Also, take note of the *Collide With* section. By default the ray will only detect bodies, so you'll need to go here if you want to detect areas as well or instead.

### Useful functions

You can see the full list of the node's functions in the [API Documentation](https://docs.godotengine.org/en/stable/classes/class_raycast2d.html). Here are the some of the most useful ones:

* `is_colliding()`

Boolean function, lets you know if the ray is colliding with something.

* `get_collision_point()`

If the ray is colliding, this will return the position of the collision (in *global* coordinates).

* `get_collider()`

If the ray is colliding, this function will return a reference to the colliding object.

* `get_collision_normal()`

Another useful piece of information, this is the normal of the collided object at the point of collision.

### Example uses

There are many uses for raycasts: visibility (can A see B, or is there an obstacle between?), proximity (am I close to a wall/ground/obstacle?), etc. Here are a couple of practical examples in use:

#### 1. Shooting

Fast-moving projectiles often have the problem of "tunneling" through obstacles - they are moving too fast for the collision to be detected in a single frame. As an alternative, you can use a {{< gd-icon RayCast2D >}}`Raycast2D` to represent the path (or a laser, etc.).

Here's a player sprite with a raycast attached to the end of the gun. The `cast_to` is set to `(250, 0)`.

![alt](/3.x/img/kyn_raycast2d_02.png)

When the player shoots, you check to see if the ray is colliding with something:

```gdscript
func _input(event):
    if event.is_action_pressed("shoot"):
        if $RayCast2D.is_colliding():
            print($RayCast2D.get_collider().name)
```

#### 2. Edge detection

Consider a platformer enemy that walks on platforms, but you don't want it to fall off the edges. Add two downward-pointing raycasts to the mob like so:

![alt](/3.x/img/kyn_raycast2d_03.png)

In the mob's script, check for when the ray *stops* colliding. That means you've found the edge and should turn around:

```gdscript
func _physics_process(delta):
    velocity.y += gravity * delta
    if not $RayRight.is_colliding():
        dir = -1
    if not $RayLeft.is_colliding():
        dir = 1
    velocity.x = dir * speed
    $AnimatedSprite.flip_h = velocity.x > 0
    velocity = move_and_slide(velocity, Vector2.UP)
```

Here's what it looks like in action:

![alt](/3.x/img/kyn_raycast2d_04.gif)

<!-- ## Related recipes

- [Interpolated Camera](/3.x/3d/interpolated_camera/)
- [Inputs: Introduction](/3.x/input/input_intro/)
- [KinematicBody: Movement](/3.x/3d/kinematic_body/) -->

<!-- #### Like video?

{{< youtube Lx2d5cgMj5U >}} -->