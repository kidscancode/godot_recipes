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

We'll start with our rigid body object, adding a `Sprite` and `CollisionShape2D`. You can also add a `PhysicsMaterial` if you want to set _Bounce_ and _Friction_ properties.

Place the body in a group called "pickable". We'll use this to allow for multiple instances of the pickable object in the main scene. Attach a script and connect the body's `_input_event` signal.

```gdscript
extends RigidBody2D

signal clicked

var held = false

func _input_event(viewport, event, shape_idx):
    if event is InputEventMouseButton:
        if event.button_index == BUTTON_LEFT and event.pressed:
            emit_signal("clicked", self)
```

We'll emit a signal when a mouse click is detected. Since there can be many bodies, we'll let the main scene manage whether a body can be dragged or if there's already one in the `held` state.

```gdscript
func _physics_process(delta):
    if held:
        global_transform.origin = get_global_mouse_position()
```

If the body is being dragged, we update its position to follow the mouse.

```gdscript
func pickup():
    if held:
        return
    mode = RigidBody2D.MODE_STATIC
    held = true

func drop(impulse=Vector2.ZERO):
    if held:
        mode = RigidBody2D.MODE_RIGID
        apply_central_impulse(impulse)
        held = false
```

Finally, these are the two functions to call when the body is picked up and dropped. Changing the `mode` to `MODE_STATIC` removes the body from physics engine processing. Note that other objects can still collide with it. If you don't want that, you can disable the `collision_layer` and/or `collision_mask` here as well. Just remember to re-enable them when dropping.

In the `drop` function, when we change back to `MODE_RIGID`, the body will be _asleep_. A sleeping body can be awoken by applying an impulse to it (even a zero magnitude impulse is fine). However, by passing in an optional impulse value, we can "throw" the object on release.

### Main scene

Create a main scene with some static body obstacles or a `TileMap` and instance a few copies of the pickable body.

Here's the script for the main scene:

```gdscript
extends Node2D

var held_object = null

func _ready():
    for node in get_tree().get_nodes_in_group("pickable"):
        node.connect("clicked", self, "_on_pickable_clicked")

func _on_pickable_clicked(object):
    if !held_object:
        held_object = object
        held_object.pickup()
```

Here's where we connect up the signal from the rigid body instances. The connected function sets `held_object` so that we know something is currently being dragged, and calls the body's `pickup()` method.

```gdscript
func _unhandled_input(event):
    if event is InputEventMouseButton and event.button_index == BUTTON_LEFT:
        if held_object and !event.pressed:
            held_object.drop(Input.get_last_mouse_speed())
            held_object = null
```

Lastly, when the mouse is released during dragging, we can perform the reverse actions. Note the use of `get_last_mouse_speed()` - be careful with this! You may find yourself launching the rigid bodies at high speeds, especially if the bodies have low `mass` values. It's probably a good idea to `clamp()` this to a reasonable value. Experiment to find out what works for you.

<video controls src="/godot_recipes/img/rbody_drag.webm"></video>

{{% notice note %}}
Download the project file here: [rigidbody_drag_and_drop.zip](/godot_recipes/files/rigidbody_drag_and_drop.zip)
{{% /notice %}}

## Related recipes

- [Using Rigid Bodies](/godot_recipes/physics/godot3_kyn_rigidbody1/)
- [Kinematic to Rigid Body Interaction](/godot_recipes/physics/kinematic_to_rigidbody/)