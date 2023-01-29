---
title: "Shooting with Raycasts"
weight: 3
draft: false
tags: []
---

## Problem

You need to implement shooting in an FPS, but moving individual projectiles is impractical.

## Solution

Game physics engines often break down when trying to handle very fast-moving objects. The solution is to cast a ray from the shooter's location and detect the first thing that would be hit.

There are two ways to approach raycasting in Godot: the {{< gd-icon RayCast3D >}}`RayCast3D` node, or directly casting a ray in space using the physics engine. While they can both accomplish the same thing, each has its uses. The node method tends to be best for situations where you continuously want to check for collisions - a downward-facing ray to check if you're on the floor, for example.

We'll use the second method, querying the physics state, because we want to know, at the moment we press the "shoot" key, whether we've hit anything.

{{% notice note %}}
This recipe assumes you already have a working FPS character controller and a world to move around in. If you don't, see the [Basic FPS Character](/godot_recipes/4.x/3d/basic_fps) recipe first.
{{% /notice %}}

To display what we've hit, add a {{< gd-icon CanvasLayer >}}`CanvasLayer` with a {{< gd-icon Label >}}`Label` node to the `FPSPlayer` scene.

We'll add an input check in the `_input()` function, which we're already using to handle mouse input.

```gdscript
    if event.is_action_pressed("shoot"):
        shoot()
```

Then we'll define the `shoot()` method. Whenever it's called, we want to build a `PhysicsRayQueryParameters3D` object, which defines the start (position of the camera) and end (position of the camera projected forward by 100 meters) points of the ray. We'll pass this to the physics engine using the `direct_space_state` of the world. If we get a returned value (a dictionary containing data about the collision), we'll update the label so we can see what kind of object we hit.

```gdscript
func shoot():
    var space = get_world_3d().direct_space_state
    var query = PhysicsRayQueryParameters3D.create($Camera3D.global_position,
            $Camera3D.global_position - $Camera3D.global_transform.basis.z * 100)
    var collision = space.intersect_ray(query)
    if collision:
        $CanvasLayer/Label.text = collision.collider.name
    else:
        $CanvasLayer/Label.text = ""
```


## Related recipes

- [Basic FPS Character](/godot_recipes/4.x/3d/basic_fps)

## <i class="fas fa-code-branch"></i> Download This Project

Download the project code here: [https://github.com/godotrecipes/3d_shoot_raycasts](https://github.com/godotrecipes/3d_shoot_raycasts)
