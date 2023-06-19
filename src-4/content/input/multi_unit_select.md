---
title: "Mouse: Drag-select multiple units"
weight: 7
draft: false
---

## Problem

You want to click-and-drag to select multiple units, RTS style.

## Solution

Realtime strategy (RTS) games often require giving orders to many units at once. A typical style of selecting multiple units is to click-and-drag a box around them. Once the units are selected, clicking on the map commands them to move.

Here's an example of what we're going for:

![alt](/godot_recipes/4.x/img/multi_unit_01.gif)

### Unit setup

To test this out, we'll need some basic RTS-style units. They are set up to move towards a target and to avoid running into each other. We won't go into too much detail on them in this tutorial. The unit script is commented if you'd like to use it as a base for creating your own RTS units. See below for a link to download the project.

### World setup

Processing the unit selection will happen in the world. We'll start with a {{< gd-icon Node2D >}}`Node2D` called "World" and add a few `Unit` instances in it. Attach a script to the World node and add the following variables:

```gdscript
extends Node2D

var dragging = false  # Are we currently dragging?
var selected = []  # Array of selected units.
var drag_start = Vector2.ZERO  # Location where drag began.
var select_rect = RectangleShape2D.new()  # Collision shape for drag box.
```

Note that once we've drawn the box, we'll need a way to find what units are inside it. The {{< gd-icon RectangleShape2D >}}`RectangleShape2D` will allow us to query the physics engine and see what we collided with.

### Drawing the box

We'll be using the left mouse button for this. Clicking starts a drag and then letting go ends it. During dragging, we'll draw the rectangle for visibility.

```gdscript
func _unhandled_input(event):
    if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
        if event.pressed:
            # If the mouse was clicked and nothing is selected, start dragging
            if selected.size() == 0:
                dragging = true
                drag_start = event.position
        # If the mouse is released and is dragging, stop dragging
        elif dragging:
            dragging = false
            queue_redraw()
    if event is InputEventMouseMotion and dragging:
        queue_redraw()

func _draw():
    if dragging:
        draw_rect(Rect2(drag_start, get_global_mouse_position() - drag_start),
                Color.YELLOW, false, 2.0)
```

### Selecting the units

Now that we've got a selection box, we need to find the units that are inside it. When we release the button and the drag ends, we must query the physics space to find the units. Note that the units are {{< gd-icon CharacterBody2D >}}`CharacterBody2D`, but {{< gd-icon Area2D >}}`Area2D` or other bodies would work as well.

We'll use `PhysicsDirectSpaceState2D.intersect_shape()` to find the units. This requires a shape (our rectangle) and a transform (our location). See [Godot docs](https://docs.godotengine.org/en/stable/classes/class_physicsdirectspacestate2d.html#class-physicsdirectspacestate2d-method-intersect-shape) for details.

```gdscript
elif dragging:
    dragging = false
    queue_redraw()
    var drag_end = event.position
    select_rect.extents = abs(drag_end - drag_start) / 2
```

We start by recording the location when we released the button, and use that to set the {{< gd-icon RectangleShape2D >}}`RectangleShape2D`'s `extents` (remember: `extents` are measured from the rectangle's *center*, so they're half the full width/height).

```gdscript
    var space = get_world_2d().direct_space_state
    var query = PhysicsShapeQueryParameters2D.new()
    q.shape = select_rect
    q.collision_mask = 2  # Units are on collision layer 2
    q.transform = Transform2D(0, (drag_end + drag_start) / 2)
    selected = space.intersect_shape(query)
```

Now we get a reference to the physics state and set up our shape query using `PhysicsShapeQueryParameters2D`, assigning it our shape, and using the center of the dragged area as the origin for the query's transform. Our result after calling `intersect_shape()` is an array of dictionaries, which looks like this:

```
[{ "rid": RID(4093103833089), "collider_id": 32145147326, "collider": Unit2:<CharacterBody2D#32145147326>, "shape": 0 },
{ "rid": RID(4123168604162), "collider_id": 32229033411, "collider": Unit3:<CharacterBody2D#32229033411>, "shape": 0 }]
```

Each of those `collider` items is a reference to a unit, so we can use this to notify them that they've been selected, activating the outline shader:

```gdscript
    for item in selected:
        item.collider.selected = true
```

![alt](/godot_recipes/4.x/img/multi_unit_03.gif)

### Commanding the units

Finally, we can command the selected units to move by clicking somewhere on the screen:

```gdscript
func _unhandled_input(event):
    if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
        if event.pressed:
            # If the mouse was clicked and nothing is selected, start dragging
            if selected.size() == 0:
                dragging = true
                drag_start = event.position
            # Otherwise a click tells the selected units to move
            else:
                for item in selected:
                    item.collider.target = event.position
                    item.collider.selected = false
                selected = []
```

The `else` clause here triggers if we click the mouse when `selected` is greater than `0`. Each item's `target` is set, and we make sure to deselect the units so we can start again.

## Wrapping up

This technique can be expanded to a wide range of RTS or other game styles. Download the full project below and use it as a base for your own game.

## <i class="fas fa-code-branch"></i> Download This Project

Download the project code here: [https://github.com/godotrecipes/multi_unit_select](https://github.com/godotrecipes/multi_unit_select)


## Related recipes

- [Mouse Input](/godot_recipes/4.x/input/mouse_input/)
