---
title: "Adding Input Actions in code"
weight: 3
draft: false
---

## Problem

You need to add actions to the InputMap at runtime.

## Solution

Typically, you'll add actions to the InputMap via _Project Settings_, as shown in [Recipe: Input Actions](/godot_recipes/input/input_actions/). However, you may find yourself needing to add one or more actions directly in a script. The[InputMap singleton](https://docs.godotengine.org/en/latest/classes/class_inputmap.html) has methods to help you do this.

Here's an example that would add a new action called "attack" using the space key:

```gdscript
func _ready():
    InputMap.add_action("attack")
    var ev = InputEventKey.new()
    ev.scancode = KEY_SPACE
    InputMap.action_add_event("attack", ev)
```

If you also wanted to add the left mouse button to the same action:

```gdscript
ev = InputEventMouseButton.new()
ev.button_index = BUTTON_LEFT
InputMap.action_add_event("jump", ev)
```

{{% notice note %}}
`InputMap.add_action()` will produce an error if the action already exists. You should check first with `InputMap.has_action()` before attempting to add a new action.
{{% /notice %}}

### Practical Example

Let's say you've made the platform character from [Recipe: Platform character](/godot_recipes/2d/platform_character/) and you want to re-use it in another project. If you saved the scene, script, and assets in a single folder, you need only copy that folder to your new project. But you'd still need to edit the Input Map in order for the inputs to work.

Instead, you could add the following code to the player script and be sure that the necessary input actions will be added automatically:

```gdscript
var controls = {"walk_right": [KEY_RIGHT, KEY_D],
                "walk_left": [KEY_LEFT, KEY_A],
                "jump": [KEY_UP, KEY_W, KEY_SPACE]}

func _ready():
    add_inputs()

func add_inputs():
    var ev
    for action in controls:
        if not InputMap.has_action(action):
            InputMap.add_action(action)
        for key in controls[action]:
            ev = InputEventKey.new()
            ev.scancode = key
            InputMap.action_add_event(action, ev)
```

## Related recipes

- [Input Actions](/godot_recipes/input/input_actions/)
- [Platform Character](/godot_recipes/2d/platform_character/)

#### Like video?

