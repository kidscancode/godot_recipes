---
title: "Using Custom Resources"
weight: 10
draft: false
ghcommentid: 85
---

## Problem

You're looking for a way to handle data and/or create flexible data objects in your game.

## Solution

Godot's `Resource` class is a powerful tool for storing and working with data. Many of the most common objects you work with in Godot extend the [Resource](https://docs.godotengine.org/en/stable/classes/class_resource.html#class-resource) type: animations, collision shapes, images, etc. Resources not only contain data, but can also manipulate that data (if you're familiar with the concept of *scriptable objects* in Unity, the concept is similar).

In addition to all of Godot's built-in `Resource` types, you can create your own custom resources to handle your own game data. This has the benefit of abstracting and encapsulating data - creating something that can be used by any other object in your game.

### Example: Player health

For this example, we'll take the concept of player health in a platformer game. A lot of game systems interact with the player's health. For example:

* The player may take damage when running into obstacles
* Enemies can damage the player when touching or shooting them
* The player can heal when picking up objects or standing in certain places
* The game's UI needs to display the health and any changes that happen

In addition, there may be other interactions: maybe the game's soundtrack changes as the player's health gets low, or enemy behavior changes based on the player's status.

{{% notice note %}}
This is an intentionally simplified example. In practice, you'll probably need more functionality than we use here, or you'll want to modify the example to fit with your game's architecture.
{{% /notice %}}

First, we need to define our new custom resource, which we'll call `PlayerHealth`. This resource needs to keep track of properties related to health. It also provides some functionality and signals to handle the changing of the health amount (such as healing and taking damage).

In the _Script_ tab, choose _File>New Script_. Make sure it inherits `Resource` and name it `PlayerHealth.gd`.

Let's break it down piece-by-piece:

At the top we have our `extends` line and the `class_name` we're assigning to the resource. This name will appear in various places in the editor.

```gdscript
extends Resource
class_name PlayerHealth
```

Next we have a signal that game objects can subscribe to if they need to know when the player's health changes. You could also add additional signals for the health reaching zero, etc.

```gdscript
signal health_changed
```

These are the properties we'll be using.

```gdscript
export (int) var max_value

var current_value = 0
```

This function lets us initialize the health to the max value. You might do this at game restart or when starting a new level.

```gdscript
func reset():
    current_value = max_value
```

This function should be called whenever damage is dealt to the player.

```gdscript
func take_damage(amount):
    current_value = max(0, current_value - amount)
    emit_signal("health_changed", current_value)
```

This function should be called whenever the player needs to be healed.

```gdscript
func heal(amount):
    current_value = min(max_value, current_value + amount)
    emit_signal("health_changed", current_value)
```

Here's the full script:

```gdscript
extends Resource
class_name PlayerHealth

signal health_empty
signal health_changed

export (int) var max_value

var current_value = 0

func reset():
    current_value = max_value

func take_damage(amount):
    current_value = max(0, current_value - amount)
    emit_signal("health_changed", current_value)

func heal(amount):
    current_value = min(max_value, current_value + amount)
    emit_signal("health_changed", current_value)
```

#### Creating a new resource

Once the `PlayerHealth` class is defined, we can make a new instance of it. Click the "New Resource" button at the top of the Inspector:

![alt](/3.x/img/custom_resource_01.png)

In the "Create New Resource" dialog you'll see the long list of resource types. Searching will locate our `PlayerHealth` type.

![alt](/3.x/img/custom_resource_02.png)

Now you can set the desired `max_value` and save the new resource as a `.tres` file.

![alt](/3.x/img/custom_resource_03.png)

#### Using the resource

Once the resource has been created and saved, we're ready to use it. Once again, in this scenario we have the following objects:

* Player - a {{< gd-icon KinematicBody2D >}}`KinematicBody2D`
* UI - contains a {{< gd-icon TextureProgressBar >}}`ProgressTexture` to display health
* Heal zone - an {{< gd-icon Area2D >}}`Area2D` that heals anything that stands in it
* Spikes - {{< gd-icon TileMap >}}`TileMap` tiles that cause damage if touched

We won't include all of the code for the game, just the parts that pertain to the health resource.

On the player, we `export` a variable to attach the resource via the Inspector. As part of the player's movement code, it calls `hurt()` when the player runs into spikes.

```gdscript
export (Resource) var health

func _ready():
    health.reset()

func hurt(amount):
    # Called when running into obstacles
    health.take_damage(amount)
```

The heal zone (an `Area2D`), affects anything inside it that has a `health` property:

```gdscript
func _physics_process(delta):
    for body in get_overlapping_bodies():
        if "health" in body:
            body.health.heal(heal_rate * delta)
```

Finally, for the UI to display the health, we attach the same health resource and connect to its `health_changed` signal:

```gdscript
export (Resource) var player_health

func _ready():
    if player_health:
        player_health.connect("health_changed", self, "_on_player_health_changed")

func _on_player_health_changed(value):
    healthbar.value = float(value) / player_health.max_value * 100
```

Here's an example of it in action:

![alt](/3.x/img/custom_resource_04.gif)

{{% notice note %}}
Download the project file here: [custom_resources.zip](/3.x/files/custom_resources.zip)
{{% /notice %}}

## Related recipes

- [Platform character](/3.x/2d/platform_character/)
- [Object healthbars](/3.x/ui/unit_healthbar/)