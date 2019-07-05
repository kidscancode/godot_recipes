---
title: "Mouse Input"
weight: 2
draft: false
---

## Problem

You want to detect mouse input.

## Solution

`InputEventMouse` is the base class for mouse events. It contains `position` and `global_position` properties. Inheriting from it are two classes: `InputEventMouseButton` and `InputEventMouseMotion`.

{{% notice note %}}
You can assign mouse button events in the InputMap, so you can use them with `is_action_pressed()`.
{{% /notice %}}

### `InputEventMouseButton`

`@GlobalScope.ButtonList` contains a list of `BUTTON_*` constants for each possible button, which will be reported in the event’s `button_index` property. Note that the scrollwheel also counts as a button - two buttons, to be precise, with both `BUTTON_WHEEL_UP` and `BUTTON_WHEEL_DOWN` being separate events.

{{% notice tip %}}
Unlike regular buttons, mouse wheel clicks only produce `pressed` events. There is no concept of a mouse wheel click being "released".
{{% /notice %}}

```gdscript
func _unhandled_input(event):
    if event is InputEventMouseButton:
        if event.button_index == BUTTON_LEFT:
            if event.pressed:
                print("Left button was clicked at ", event.position)
            else:
                print("Left button was released")
        if event.button_index == BUTTON_WHEEL_DOWN:
            print("Wheel down")
```

### `InputEventMouseMotion`

These events occur whenever the mouse moves. You can find the distance moved (in screen coordinates) with the `relative` property.

Here’s an example using mouse movement to rotate a 3D character:

```gdscript
# Converts mouse movement (pixels) to rotation (radians).
var mouse_sensitivity = 0.002

func _unhandled_input(event):
    if event is InputEventMouseMotion:
        rotate_y(-event.relative.x * mouse_sensitivity)
```