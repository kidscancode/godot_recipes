---
title: "Rolling Cube"
weight: 6
draft: false
ghcommentid: 101
---

## Problem

You want to make a rolling cube in 3D.

<video width="500" controls src="/godot_recipes/4.x/img/rolling_cube.webm"></video>

## Solution

Rolling a cube is trickier than it seems. You can't just rotate the cube around its center:

![alt](/godot_recipes/4.x/img/cube_001.gif)

Instead, the cube needs to be rotated around its bottom edge.

![alt](/godot_recipes/4.x/img/cube_002.gif)

Here's the tricky part: which bottom edge? It depends on which direction the cube is rolling.

In preparing this recipe, I experimented with a few different solutions to this problem:

* Pure math - calculating and applying rotation transforms
* AnimationPlayer - using animations to key the rotations and offsets
* Helper nodes - using Spatial(s) as rotation helpers

They all worked fine, but I found the last option the most flexible and easiest to adapt, so that's what we'll do here.

### Node setup

```
Cube: {{< gd-icon CharacterBody3D >}} CharacterBody3D
    Pivot: {{< gd-icon Node3D >}} Node3D
        Mesh: {{< gd-icon MeshInstance3D >}} MeshInstance3D
    Collision: {{< gd-icon CollisionShape3D >}} CollisionShape3D
```

{{% notice tip %}}
You can do this with {{< gd-icon RigidBody3D >}}`RigidBody3D`, {{< gd-icon CharacterBody3D >}}`CharacterBody3D`, or {{< gd-icon Area3D >}}`Area3D` as your collision node. There will be minor differences in how you handle movement. Which node you choose should depend on what other behavior you want in your game. For this recipe, we're only concerned with the movement.
{{% /notice %}}

By default, everything is centered at `(0, 0, 0)` so the first thing we're going to do is offset everything so that the *bottom center* of the cube is the {{< gd-icon CharacterBody3D >}}`CharacterBody3D`'s position.

The default size of a {{< gd-icon BoxMesh3D >}}`BoxMesh3D` is `(1, 1, 1)`, so do this, move the mesh and collision nodes both up to `(0, 0.5, 0)`, leaving the rest where they are. Now when you select the root node, its position will be the *bottom* of the cube:

![alt](/godot_recipes/4.x/img/cube_003.png)

Now when you want to roll the cube, you'll need to move the `Pivot` `0.5` in the direction you want to move. Since the mesh is attached, you need to move it the opposite amount. For example, to roll to the right (**+X**), you'll end up with this:

![alt](/godot_recipes/4.x/img/cube_004.gif)

Now the pivot node is at the correct edge and rotating it will also rotate the mesh.

### Movement script

The movement is broken in to 3 steps:

#### Step 1

Here we apply the two offsets shown above: shift the `Pivot` in the direction of movement, and shift the `Mesh` in the opposite direction.

#### Step 2

In this step we animate the rotation. We find the axis of rotation using the *cross product* of the direction and the down vector. Then we use a {{< gd-icon Tween >}}`Tween` to animate rotating the pivot's `transform`.

#### Step 3

Finally, once the animation has finished, we need to reset everything so that it's ready to happen again. In the end, we want to have the cube moved 1 unit in the chosen direction (for a cube of size 1) and have the pivot and mesh back at their original positions.

```gdscript
extends CharacterBody3D

@onready var pivot = $Pivot
@onready var mesh = $Pivot/MeshInstance3D

var cube_size = 1.0
var speed = 4.0
var rolling = false

func _physics_process(delta):
    var forward = Vector3.FORWARD
    if Input.is_action_pressed("ui_up"):
        roll(forward)
    if Input.is_action_pressed("ui_down"):
        roll(-forward)
    if Input.is_action_pressed("ui_right"):
        roll(forward.cross(Vector3.UP))
    if Input.is_action_pressed("ui_left"):
        roll(-forward.cross(Vector3.UP))

func roll(dir):
    # Do nothing if we're currently rolling.
    if rolling:
        return
    rolling = true

    # Step 1: Offset the pivot.
    pivot.translate(dir * cube_size / 2)
    mesh.global_translate(-dir * cube_size / 2)

    # Step 2: Animate the rotation.
    var axis = dir.cross(Vector3.DOWN)
    var tween = create_tween()
    tween.tween_property(pivot, "transform",
            pivot.transform.rotated_local(axis, PI/2), 1 / speed)
    await tween.finished

    # Step 3: Finalize the movement and reset the offset.
    transform.origin += dir * cube_size
    var b = mesh.global_transform.basis
    pivot.transform = Transform3D.IDENTITY
    mesh.transform.origin = Vector3(0, cube_size / 2, 0)
    mesh.global_transform.basis = b
    rolling = false
```

If your cube's texture isn't symmetrical, you may notice that it's resetting after every roll. To preserve the rotation of the mesh, add the following:

In *Step 1*:

Change `mesh.translate(-dir)` to `mesh.global_translate(-dir)`.

In *Step 3*:

Add two lines to keep the mesh rotation after reset:

```gdscript
    # Step 3: Finalize the movement and reset the offset.
	transform.origin += dir * cube_size
	var b = mesh.global_transform.basis  # Save the mesh rotation.
	pivot.transform = Transform3D.IDENTITY
	mesh.transform.origin = Vector3(0, cube_size / 2, 0)
	mesh.global_transform.basis = b  # Restore the mesh rotation.
```

### Checking for collisions

If you plan to have obstacles in your game, you can check for collisions before moving (similar to any other grid-based movement scheme). Add a raycast check before *Step 1* of the move:

```gdscript
# Cast a ray before moving to check for obstacles
var space = get_world_3d().direct_space_state
var ray = PhysicsRayQueryParameters3D.create(mesh.global_transform.origin,
        mesh.global_transform.origin + dir * cube_size, 4294967295, [self])
var collision = space.intersect_ray(ray)
if collision:
    return
```

{{% notice note %}}
You could also use a {{< gd-icon RayCast3D >}}`RayCast3D` node. Just remember to call `force_raycast_update()` before checking.
{{% /notice %}}

## <i class="fas fa-code-branch"></i> Download This Project

Download the project code here: [https://github.com/godotrecipes/rolling_cube](https://github.com/godotrecipes/rolling_cube)

## Related recipes

- [Transforms](/godot_recipes/4.x/math/transforms/)
