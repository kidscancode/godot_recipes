---
title: "Input Actions"
weight: 2
draft: false
---

## Problem

You want to understand Godot's "input action" system.

## Solution

Let's say you're making a top-down character and you write code using `InputActionKey` that uses the arrow keys for movement. You'll quickly find that many players prefer to use "WASD" style controls. You can go back into your code and add the additional key checks, but this would result in duplicated/redundant code.

Input actions can help to make your code more configurable. Rather than hard-coding specific keys, you'll be able to modify and customize them without changing the code.

### Creating inputs

You define input actions in the "Project Settings" under the "Input Map" tab. Here, you can create new actions and/or assign inputs to them.

You'll see when you click on the tab there are already some default actions configured. They are all named "ui_*" to indicate that they are the default interface actions. "Tab" for next UI element, for example.

Generally speaking, you should create your own actions for your game, rather than use the existing ones.

For this example, let's say you want to allow the player to control the game with the keyboard or the mouse. They need to be able to shoot by pressing either the left mouse button *or* the spacebar.

Create the new action "shoot" by typing the name in the "Action" field at the top and clicking "Add" (or pressing enter). Scroll to the bottom and you'll see the new action has been added to the list.

Now you can assign inputs to this action by clicking the "+" sign to the right. Inputs can be keys, mouse buttons, or joy/gamepad inputs. Choose "Key" and you can press the key on the keyboard you want to assign - let's press the spacebar - and click "OK".

Click "+" to add another input, and this time choose "Mouse Button". The default of "Device 0" and "Left Button" is fine, but you can select others if you like.

### Using input actions

You can check for the action either by polling the `Input` singleton every frame:

```gdscript
func _process(delta):
    if Input.is_action_pressed("shoot"):
        # This will execute every frame as long as the input is held.
```

This is best for continuous actions - i.e. those you want to check constantly, such as movement.

If instead you want to detect the action at the moment it occurs, you can use the `_input()` or `_unhandled_input()` callbacks:

```gdscript
func _unhandled_input(event):
    if event.is_action_pressed("shoot"):
       # This will run once on the frame when the action is first pressed
```

There are several functions you can use for checking input state:

- `is_action_pressed()`: This function returns `true` if the action is currently in the `pressed` state.

- `is_action_released()`: This function returns `true` if the action is *not* In the `pressed` state.

- `is_action_just_pressed()` / `is_action_just_released()`: These methods work like the above, but *only* return `true` on the single frame after the event occurs. This is useful for non-recurring actions like shooting or jumping where the user needs to let go and then press the key again to repeat the action.

## Related Recipes

- [Inputs: Introduction](/godot_recipes/input/input_intro/)