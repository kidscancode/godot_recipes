---
title: "Cooldown Button"
weight: 5
draft: false
---

## Problem

You want to make RPG-style ability buttons, including a cooldown effect.

![alt](/godot_recipes/img/cooldown_01.gif)

## Solution

If you need art for your buttons, you can find a wide variety of well-designed buttons at [Game-icons.net](https://game-icons.net/). We'll be using a few from there for this recipe.

### Node setup

The scene for our ability button will need the following nodes:

```text
┖╴TextureButton ("AbilityButton")
   ┠╴TextureProgress ("Sweep")
   ┠╴Timer
   ┖╴MarginContainer ("Counter")
      ┖╴Label ("Value")
```

Drop your chosen icon into the _Texture_ property of the `AbilityButton`.

On the `Sweep` node, choose "Full Rect" from the _Layout_ menu. Set the _Fill Mode_ to "Counter Clockwise".

We also want our cooldown "radial wipe" to darken the button, so set the _Modulate_ property to a dark gray with some transparency:

![alt](/godot_recipes/img/cooldown_02.png)

The `Timer` node should be set to "One Shot".

`Counter` is a container to hold and align the text. Set its _Layout_ to "Bottom Wide", and in its _Custom Constants_, both _Margin Right_ and _Margin Left_ to `5`.

Finally, on the `Value` label, set _Align_ to "Right" and _Clip Text_ to "On". Choose a font by adding a `DynamicFont` and setting an appropriate size. Put a value like `0.0` in the _Text_ field to check how it works. Since our icon is black and white, it also helps to add an _Outline Size_ of `1` in the font's settings.

### Script

Add a script to the `AbilityButton`. Connect the `Timer`'s `timeout` signal and the `AbilityButton`'s `pressed` signal.

```gdscript
extends TextureButton

onready var time_label = $Counter/Value

export var cooldown = 1.0


func _ready():
    $Timer.wait_time = cooldown
    time_label.hide()
    $Sweep.texture_progress = texture_normal
    $Sweep.value = 0
    set_process(false)
```

We start by exporting a `cooldown` variable for the length of our ability's cooldown. Then, in the `_ready()` method, we can set the `Timer` to use that value. Then we hide the label, because we only want to display it during the countdown.

Next, we need a texture to assign to the `TextureProgress` display. In this case, we'll copy the texture from the button - you could also use a different texture if you like.

Finally, we make sure the sweep's value is at `0`, and set the node's processing to `false`. We'll do the animation in `_process()` so we don't need it running when we're not in cooldown mode.

```gdscript
func _process(delta):
    time_label.text = "%3.1f" % $Timer.time_left
    $Sweep.value = int(($Timer.time_left / cooldown) * 100)
```

In `_process()` we use the `time_left` on the timer to set the label's `text` and the sweep's `value`.

```
func _on_AbilityButton_pressed():
    disabled = true
    set_process(true)
    $Timer.start()
    time_label.show()
```

When the button is clicked, everything gets started.

```gdscript
func _on_Timer_timeout():
    print("ability ready")
    $Sweep.value = 0
    disabled = false
    time_label.hide()
    set_process(false)
```

And everything is reset when the timer runs out. Put several buttons in an `HBoxContainer` and you've got an action bar:

![alt](/godot_recipes/img/cooldown_03.gif)

{{% notice note %}}
Download the project file here: [cooldown_button.zip](/godot_recipes/files/cooldown_button.zip)
{{% /notice %}}

## Related recipes

- [UI: Labels](/godot_recipes/ui/labels/)
- [UI: Containers](/godot_recipes/ui/containers/)

<!-- #### Like video?

{{< youtube -jRMhJSwd-Xw >}} -->