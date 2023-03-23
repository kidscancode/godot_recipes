---
title: "Moving Platforms"
weight: 5
draft: false
ghcommentid: 25
---

## Problem

You need moving platforms in your 2D platformer.

## Solution

There are several ways to approach this problem. In this recipe, we'll use {{< gd-icon AnimatableBody2D >}}`AnimatableBody2D`s for our platform and move it with a {{< gd-icon Tween >}}`Tween`. This allows for a variety of movement styles while minimizing the amount of code we need to write.

{{% notice info %}}
You can also implement this moving platform technique using an {{< gd-icon AnimationPlayer >}}`AnimationPlayer` rather than a tween. Much of the setup will be the same, but rather than tween code, you'll animate the body's `position` property.
{{% /notice %}}

### Setting up

We'll start with a basic platformer setup using the [Platform character](/godot_recipes/4.x/2d/platform_character/) recipe. The basic movement from that recipe will work fine with the platforms. If you've modified it or used your own, everything should still work the same.

### Creating the platform

The platform scene contains the following nodes:

- {{< gd-icon Node2D >}}`Node2D` ("MovingPlatform"): The `Node2D` parent is there to act as the "anchor" or start point for the platform. We'll animate the platform's `position` relative to this parent node.
  - {{< gd-icon AnimatableBody2D >}}`AnimatableBody2D`: This represents the platform itself. This is the node that will move.
    - {{< gd-icon Sprite2D >}}`Sprite2D`: You can use a sprite sheet here, individual images, or even a {{< gd-icon TileMap >}}`TileMap`.
    - {{< gd-icon CollisionShape2D >}}`CollisionShape2D`: Don't make the hitbox too big, or the player will appear to be "hovering" off the edge of the platform.

Set up the {{< gd-icon Sprite2D >}}`Sprite2D`'s **Texture** and the collision shape appropriately. In the {{< gd-icon AnimatableBody2D >}}`AnimatableBody2D`, set the **Sync to Physics** property "On". Since we're moving the body in code, this ensures that it's moved during the physics step, keeping it in sync with the player and other physics bodies.

Now add a script to the root {{< gd-icon Node2D >}}`Node2D`:

```gdscript
extends Node2D

@export var offset = Vector2(0, -320)
@export var duration = 5.0

func _ready():
    start_tween()

func start_tween():
    var tween = get_tree().create_tween().set_process_mode(Tween.TWEEN_PROCESS_PHYSICS)
    tween.set_loops().set_parallel(false)
    tween.tween_property($AnimatableBody2d, "position", offset, duration / 2)
    tween.tween_property($AnimatableBody2d, "position", Vector2.ZERO, duration / 2)
```

We've used a few of {{< gd-icon Tween >}}`Tween`'s options here to make everything work smoothly:

* `set_process_mode()`: ensures that all movement takes place during the physics processing step.
* `set_loops()`: this makes the tween repeat.
* `set_parallel(false)`: by default, all `tween_property()` changes would happen at that same time. This makes the two happen one after another: moving to one end of the offset, then back to the start.

Using the two exported properties, you can adjust the platform's movement. Set the `offset` to determine where the tween moves relative to its starting point, and the `duration` to determine how long it takes to complete the cycle.

Add some platforms in your level/world and try them out:

<video controls src="/godot_recipes/4.x/img/moving_platform4.webm" autoplay></video>

## <i class="fas fa-code-branch"></i> Download This Project

Download the project code here: [https://github.com/godotrecipes/2d_moving_platforms](https://github.com/godotrecipes/2d_moving_platforms)

## Related recipes

- [Platform character](/godot_recipes/4.x/2d/platform_character/)

#### Like video?

*Coming soon*
<!-- {{< youtube C-Sn55e5wnk >}} -->