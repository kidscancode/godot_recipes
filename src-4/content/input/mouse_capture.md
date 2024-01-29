---
title: "Capturing the Mouse"
weight: 3
draft: false
ghcommentid: 49
---

## Problem

You want to hide the mouse cursor and keep the mouse from leaving the game window. This is common in many 3D games (and some 2D ones).

## Solution

You can set the mouse state using `Input.mouse_mode`. There are four possible mouse modes:

- **MOUSE_MODE_VISIBLE**: The mouse is visible and can move freely into and out of the window. This is the default state.

- **MOUSE_MODE_HIDDEN**: The mouse cursor is invisible, but the mouse can still move outside the window.

- **MOUSE_MODE_CAPTURED**: The mouse cursor is hidden and the mouse is unable to leave the game window.

- **MOUSE_MODE_CONFINED**: The mouse is visible, but cannot leave the game window.

"Captured" is the most commonly used option. You can set the mouse mode at runtime using:

```gdscript
func _ready():
    Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
```

When the mouse is captured, mouse input events will still be passed as normal. However, you will find there is a problem. If you want to close the game or switch to another window, you can't. For this reason, you will want to also include a way to "release" the mouse. For example, to release when the player pressed the Escape key:

```gdscript
func _input(event):
    if event.is_action_pressed("ui_cancel"):
        Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
```

So that the game doesn't respond to mouse movement when you're in another window, you can test for the capture state in your character controller using:

```gdscript
if Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
```

Once the mouse is released, that leaves the need to re-capture it to continue playing. Assuming you have an event in the Input Map for a mouse click, you can do the following:

```gdscript
    if event.is_action_pressed("click"):
        if Input.mouse_mode == Input.MOUSE_MODE_VISIBLE:
            Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
```

Since you may also be using a mouse click to shoot or perform some other action, it's probably a good idea to stop the event from propagating. Add this after setting the mouse mode:

```gdscript
get_viewport().set_input_as_handled()
```
