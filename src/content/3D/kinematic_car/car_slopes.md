---
title: "3D Kinematic Car: Slopes & Ramps"
weight: 4
draft: false
ghcommentid: 44
---

## Problem

Your [Kinematic Car](/godot_recipes/3d/kinematic_car/car_base/) climbs slopes, but it doesn't look quite right:

![alt](/godot_recipes/img/3d_car_10.png)

## Solution

Kinematic bodies don't automatically rotate on collision. When the wheels aren't both touching the ground, as in the image above, we'll need to align the car manually.

To begin, we need to detect when the wheel isn't on the ground. Add two {{< gd-icon RayCast3D >}}`RayCast` nodes to the car and align them with the front and rear wheels like so:

![alt](/godot_recipes/img/3d_car_11.png)

For both, set the **Cast To** to (0, -0.25, 0) and don't forget to check the "Enabled" box.

### Aligning a 3D object

We're going to reuse the code from the [KinematicBody: Align with Surface](/godot_recipes/3d/3d_align_surface/) recipe. Add this to `car_base.gd`:

```gdscript
func align_with_y(xform, new_y):
    xform.basis.y = new_y
    xform.basis.x = -xform.basis.z.cross(new_y)
    xform.basis = xform.basis.orthonormalized()
    return xform
```

Now, in the `_physics_process()` function, right after calling `move_and_slide_with_snap()`, we'll check to see if we need to align the car:

```gdscript
# If either wheel is in the air, align to slope.
if $FrontRay.is_colliding() or $RearRay.is_colliding():
    # If one wheel is in air, move it down
    var nf = $FrontRay.get_collision_normal() if $FrontRay.is_colliding() else Vector3.UP
    var nr = $RearRay.get_collision_normal() if $RearRay.is_colliding() else Vector3.UP
    var n = ((nr + nf) / 2.0).normalized()
    var xform = align_with_y(global_transform, n)
    global_transform = global_transform.interpolate_with(xform, 0.1)
```

### How it works

When neither wheel is on the ground, we don't rotate the car at all.

Otherwise, we're going to use an average of the front and rear rays' results. When the ray is colliding, the collider's surface normal is used. This way, if the two wheels are touching different slopes (like on a curved hill, for example), the result will be to try and get both wheels on the surface, like so:

![alt](/godot_recipes/img/3d_car_12.png)

In this image, you can see the car isn't aligned with either surface, but is halfway between.

If the ray is not hitting anything, then we'll assume a horizontal surface. That will bring the front or rear down when the other wheel is touching.

## Related recipes

- [Kinematic Car: Base](/godot_recipes/3d/kinematic_car/car_base/)
- [KinematicBody: Align with Surface](/godot_recipes/3d/3d_align_surface/)

#### Like video?

