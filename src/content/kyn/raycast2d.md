---
title: "RayCast2D"
draft: true
ghcommentid:
---

## {{< gd-icon RayCast2D >}}RayCast2D

*Raycasting* is a common technique in game development. "Casting a ray" means extending a line from a point to see if it collides with anything.


### Node properties

Let's add a {{< gd-icon RayCast2D >}}`RayCast2D` node and take a look at the Inspector:

![alt](/godot_recipes/img/kyn_raycast2d_01.png)

* **Enabled**

* **Exclude Parent**

* **Cast To**


### Useful functions

You can see the full list of the node's functions in the [API Documentation](https://docs.godotengine.org/en/stable/classes/class_raycast2d.html)

* `is_colliding()`
* `get_collider()`
* `get_collision_normal()`


### When *not* to use

### Example uses

1. Visibility

2. Ground detection

enemy w/2 downward