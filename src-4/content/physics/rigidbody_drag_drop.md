---
title: "RigidBody2D: Drag and Drop"
weight: 4
draft: false
---

## Problem

You want to pick up and move rigid bodies with the mouse.

## Solution

Working with rigid bodies can be tricky. Godot's physics engine controls their movements, and interfering with that can often lead to unexpected results. The key is to make use of the body's `mode` property. This applies equally well in 2D or 3D.

### Body setup

We'll start with our rigid body object, adding a {{< gd-icon Sprite2D >}}`Sprite2D` and {{< gd-icon CollisionShape2D >}}`CollisionShape2D`. You can also add a `PhysicsMaterial` if you want to set _Bounce_ and _Friction_ properties.

We're going to use the rigid body's `freeze` property to remove it from the control of the physics engine while we're dragging it. Since we still want it to be movable, we need to set the **Freeze Mode** to "Kinematic", rather than the default value of "Static".

Place the body in a group called "pickable". We'll use this to allow for multiple instances of the pickable object in the main scene. Attach a script to the body and connect the its `_input_event` signal.

```gdscript
extends RigidBody2D

signal clicked

var held = false

func _on_input_event(viewport, event, shape_idx):
    if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
        if event.pressed:
            print("clicked")
            clicked.emit(self)
```

We'll emit a signal when a mouse click is detected, including a reference to the body. Since there can be many bodies, we'll let the main scene manage whether a body can be dragged or if there's already one in the `held` state.

If the body is being dragged, we update its position to follow the mouse.

```gdscript
func _physics_process(delta):
    if held:
        global_transform.origin = get_global_mouse_position()
```

Finally, these are the two functions to call when the body is picked up and dropped. Changing the `freeze` to `true` removes the body from physics engine processing. Note that other objects can still collide with it. If you don't want that, you can disable the `collision_layer` and/or `collision_mask` here as well. Just remember to re-enable them when dropping.

```gdscript
func pickup():
    if held:
        return
    freeze = true
    held = true

func drop(impulse=Vector2.ZERO):
    if held:
        freeze = false
        apply_central_impulse(impulse)
        held = false
```

In the `drop` function, after we change `freeze` back to `false, the body will return to the physics engine's control. By passing in an optional impulse value, we can add the ability to "throw" the object on release.

### Main scene

Create a main scene with some static body obstacles or a {{< gd-icon TileMap >}}`TileMap` and instance a few copies of the pickable body.

Here's the script for the main scene. We start by connecting the `clicked` signal on any pickable bodies that are in the scene.

```gdscript
extends Node2D

var held_object = null

func _ready():
    for node in get_tree().get_nodes_in_group("pickable"):
        node.clicked.connect(_on_pickable_clicked)
```

Next,  we have the function we connect the signal to. The connected function sets `held_object` so that we know something is currently being dragged, and calls the body's `pickup()` method.

```gdscript
func _on_pickable_clicked(object):
    if !held_object:
        object.pickup()
        held_object = object
```

Lastly, when the mouse is released during dragging, we can perform the reverse actions.

```gdscript
func _unhandled_input(event):
    if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
        if held_object and !event.pressed:
            held_object.drop(Input.get_last_mouse_velocity())
            held_object = null
```

Note the use of `get_last_mouse_velocity()` to pass the impulse to the object - be careful with this! You may find yourself launching the rigid bodies at high speeds, especially if the bodies have low `mass` values. It's probably a good idea to scale this to a reasonable value and `clamp()` it to some maximum. Experiment to find out what works for you.

<video controls src="/godot_recipes/4.x/img/rbody_drag.webm"></video>

## <i class="fas fa-code-branch"></i> Download This Project

Download the project code here: [https://github.com/godotrecipes/rigidbody_drag_drop](https://github.com/godotrecipes/rigidbody_drag_drop)

## Related recipes

