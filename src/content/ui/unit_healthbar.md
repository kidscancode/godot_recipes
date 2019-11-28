---
title: "Object Healthbars"
weight: 10
draft: false
---

## Problem

You want units in your game to have healthbars that follow them as they move.

![alt](/godot_recipes/img/unit_healthbar_preview.png    )

## Solution

Displaying the bar can be done with a `TextureProgress` node. This is like the `ProgressBar` node, but allows the use of textures for the bar itself. The length of the bar will indicate the health value, but we can also change the texture color. We'll use three colored bars for this:

![alt](/godot_recipes/img/barHorizontal_green.png)
![alt](/godot_recipes/img/barHorizontal_yellow.png)
![alt](/godot_recipes/img/barHorizontal_red.png)

So that this bar can be added to any unit in the game, we'll make it a separate scene. Start with a `Node2D` and a `TextureProgress` child. Add a script to the root node.

![alt](/godot_recipes/img/unit_healthbar_nodes.png)

Drag the green bar into the `TextureProgress` _Textures/Progress_ property and set its _Value_ to `100`. Drag the bar until it's centered and above the origin.

![alt](/godot_recipes/img/unit_healthbar_layout.png)

```gdscript
extends Node2D

var bar_red = preload("res://assets/barHorizontal_red.png")
var bar_green = preload("res://assets/barHorizontal_green.png")
var bar_yellow = preload("res://assets/barHorizontal_yellow.png")

onready var healthbar = $HealthBar
```

The script starts by loading the three colored bars, which will change as the health decreases. We also store a reference to the progress bar.

```gdscript
func _ready():
    hide()
    if get_parent() and get_parent().get("max_health"):
        healthbar.max_value = get_parent().max_health
```

The `HealthDisplay` should be attached to a unit. If the unit has a `max_health` property, we use that to set the range of the bar (it's `100` by default). We also want the bar to start out hidden, and appear if the unit loses health.

```gdscript
func _process(delta):
    global_rotation = 0
```

This prevents the bar from rotating. It will always remain on top of the unit it's attached to.

```gdscript
func update_healthbar(value):
    healthbar.texture_progress = bar_green
    if value < healthbar.max_value * 0.7:
        healthbar.texture_progress = bar_yellow
    if value < healthbar.max_value * 0.35:
        healthbar.texture_progress = bar_red
    if value < healthbar.max_value:
        show()
    healthbar.value = value
```

Finally, we have a function we can call when the unit's health changes. It updates the value of the bar and sets the texture based on the remaining proportion.

When you attach this to a unit, the bar may appear too big. Set the _Scale_ property of the instanced `HealthDisplay` to adjust based on the size of your unit.

Here's an example of this system in use. You can download the example project for this below.

<video controls src="/godot_recipes/img/tower_def_demo.webm"></video>

{{% notice note %}}
Download the project file here: [tower_defense_demo.zip](/godot_recipes/files/tower_defense_demo.zip)
{{% /notice %}}