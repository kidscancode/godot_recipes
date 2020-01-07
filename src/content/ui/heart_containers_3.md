---
title: "Heart Containers: 3 Ways"
weight: 5
draft: false
---

## Problem

You need to display a heart container bar (or other icon-based bar).

## Solution

A common way of displaying the player's health is via a series of icons (typically hearts) that disappear as the player takes damage.

In this recipe, we're going to explore three ways of displaying this information, which I'm labeling "simple", "empty", and "partial":

![alt](/godot_recipes/img/heart_bar_02.png)

This image shows what the bar displays when the player has `3` health.

* **simple**: Only the hearts are displayed.
* **empty**: Empty heart containers are displayed.
* **partial**: The player can have partially filled containers.

### Setting up the bar

The heart images I'm using are 53x45. You can get them here:

[Kenney.nl: Platformer Art Deluxe](https://kenney.nl/assets/platformer-art-deluxe)

Ideally, your heart bar will be easy to drop into your overall HUD/UI. It therefore makes sense to make it a separate scene. We'll start with an `HBoxContainer` which will keep things aligned. Set the *Custom Constants/Separation* to `5`.

Add a `TextureRect` child. Drag your heart texture into the *Texture* property and set the *Stretch Mode* to "Keep". Name the node "1" and then press "Ctrl-D" to duplicate the node for as many hearts as you need (5 in this example). Your node setup should look like this:

![alt](/godot_recipes/img/heart_bar_03.png)

### Adding a script

The script below will cover all three bar configurations for flexibility. If you only need one in your game, you can remove the code relating to the other modes.

To begin, we're going to load the textures we need and define our three bar modes:

```gdscript
extends HBoxContainer

enum MODES {simple, empty, partial}

var heart_full = preload("res://assets/hud_heartFull.png")
var heart_empty = preload("res://assets/hud_heartEmpty.png")
var heart_half = preload("res://assets/hud_heartHalf.png")

export (MODES) var mode = MODES.simple

func update_health(value):
    match mode:
        MODES.simple:
            update_simple(value)
        MODES.empty:
            update_empty(value)
        MODES.partial:
            update_partial(value)
```

Calling `update_health()` on the bar will cause it to display the passed value, based on the selected mode.

{{% notice note %}}
We're not going to do any bounds checking on the value input. There are many ways you may have health implemented in your game, and so that's left to you.
{{% /notice %}}

First, the `update_simple()` method. Here, we loop through the heart containers and set the visibility of each `TextureRect`:

```gdscript
func update_simple(value):
    for i in get_child_count():
        get_child(i).visible = value > i
```

`update_empty()` is very similar, except instead of hiding the icon, we change its texture to the empty container:

```gdscript
func update_empty(value):
    for i in get_child_count():
        if value > i:
            get_child(i).texture = heart_full
        else:
            get_child(i).texture = heart_empty
```

Finally, for the partially filled containers, we have a third texture and twice the number of possible values:

```gdscript
func update_partial(value):
    for i in get_child_count():
        if value > i * 2 + 1:
            get_child(i).texture = heart_full
        elif value > i * 2:
            get_child(i).texture = heart_half
        else:
            get_child(i).texture = heart_empty
```

Here's an example using each of the bar modes:

![alt](/godot_recipes/img/heart_bar_04.gif)

## Wrapping up

Use this heart bar setup as a basis for your own HUD. This technique can be expanded to support a wide variety of information displays.

{{% notice note %}}
Download the project file here: [heart_bars.zip](/godot_recipes/files/heart_bars.zip)
{{% /notice %}}

## Related recipes

- [UI: Containers](/godot_recipes/ui/containers/)