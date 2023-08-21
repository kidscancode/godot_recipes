---
title: "Pet Following"
weight: 10
draft: false
---

## Problem

You need to have a game entity such as a pet or minion, follow a character.

<video controls src='/godot_recipes/4.x/img/pet_follow.webm'></video>

## Solution

We start by adding a {{< gd-icon Marker2D >}}`Marker2D` to the character. This will represent the place where the pet wants to "hang out" near the character.

![alt](/godot_recipes/4.x/img/pet_follow_01.png)

In this example, we've made it a child of the {{< gd-icon Sprite2D >}}`Sprite2D`, because the character's code uses `$Sprite2D.scale.x = -1` to flip the horizontal direction when the character moves left. Since the marker is a child of the sprite, it will flip too.

### Pet script

Here's the script for the pet.

```gdscript
extends CharacterBody2D

@export var parent : CharacterBody2D

var speed = 25

@onready var follow_point = parent.get_node("Sprite2D/FollowPoint")
```

The `parent` variable holds a reference to the character the pet should follow. We then get the `FollowPoint` node from that so we can get its position in `_physics_process()`:

```gdscript
func _physics_process(delta):
    var target = follow_point.global_position
    velocity = Vector2.ZERO
    if position.distance_to(target) > 5:
        velocity = position.direction_to(target) * speed

    if velocity.x != 0:
        $Sprite2D.scale.x = sign(velocity.x)

    if velocity.length() > 0:
        $AnimationPlayer.play("run")
    else:
        $AnimationPlayer.play("idle")

    move_and_slide()
```

If it's close to the target point, we stop the pet's movement.

### Navigating obstacles

Depending on your world, you may find the pet gets stuck on obstacles. For more robust following, you can use navigation. See [TileMap Navigation](/godot_recipes/4.x/ai/tilemap_navigation/) for an example.

## <i class="fas fa-code-branch"></i> Download This Project

Download the project's example code here: [https://github.com/godotrecipes/ai_behavior_demos](https://github.com/godotrecipes/ai_behavior_demos)
