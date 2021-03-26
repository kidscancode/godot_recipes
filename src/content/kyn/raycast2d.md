---
title: "RayCast2D"
draft: true
ghcommentid:
---

## {{< gd-icon RayCast2D >}}RayCast2D

*Raycasting* is a common technique in game development. "Casting a ray" means extending a line from a point until it collides with something or reaches its limit.

### Node properties

Let's add a {{< gd-icon RayCast2D >}}`RayCast2D` node and take a look at the Inspector:

![alt](/godot_recipes/img/kyn_raycast2d_01.png)

* **Enabled**

Turn this on to make the raycast work. *This property is disabled by default!*

* **Exclude Parent**

This property causes the ray to ignore collisions with the parent object. Enabled by default.

* **Cast To**

This is the destination point of the ray. *Note:* This is in *local* coordinates.


### Useful functions

You can see the full list of the node's functions in the [API Documentation](https://docs.godotengine.org/en/stable/classes/class_raycast2d.html). Here are the some of the most useful ones:

* `is_colliding()`

Boolean function, lets you know if the ray is colliding with something.

* `get_collision_point()`


* `get_collider()`

If the ray is colliding, this function will return a reference to the colliding object.

* `get_collision_normal()`

Another useful piece of information


### When *not* to use

### Example uses

1. Visibility

2. Shooting

3. Ground detection

enemy w/2 downward