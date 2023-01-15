---
title: "Top-down movement"
weight: 1
draft: false
ghcommentid: 20
---

## Problem

You're making a 2D top-down game, and you want to control a character's movement.

## Solution

For this solution, we'll assume you have the following input actions defined:

   Action Name | Key(s)
--------|------
`"up"` | W,↑
`"down"` | S,↓
`"right"` | D,→
`"left"` | A,←
`"click"` | Mouse button 1

We will also assume you're using a {{< gd-icon CharacterBody2D >}}`CharacterBody2D` node.

We can solve this problem in many ways, depending on what type of behavior you're looking for.

### Option 1: 8-way movement

In this scenario, the player uses the four directional keys to move (including diagonals).

```gdscript
extends CharacterBody2D

var speed = 400  # speed in pixels/sec

func _physics_process(delta):
    var direction = Input.get_vector("left", "right", "up", "down")
    velocity = direction * speed

    move_and_slide()
```

### Option 2: Rotate and move

In this scenario, the left/right actions rotate the character and up/down move the character forward and back in whatever direction it's facing. This is sometimes referred to as "Asteroids-style" movement.

```gdscript
extends CharacterBody2D

var speed = 400  # move speed in pixels/sec
var rotation_speed = 1.5  # turning speed in radians/sec

func _physics_process(delta):
    var move_input = Input.get_axis("down", "up")
    var rotation_direction = Input.get_axis("left", "right")
    velocity = transform.x * move_input * speed
    rotation += rotation_direction * rotation_speed * delta
    move_and_slide()
```

{{% notice note %}}
Godot considers an angle of `0` degrees to be pointing along the `x` axis. This means that a node's forward direction (`transform.x`) is to the right. You should ensure that your character's sprite is also drawn pointing to the right.
{{% /notice %}}

### Option 3: Aim with mouse

Similar to option 2, but this time the character rotation is controlled with the mouse (ie the character always points towards the mouse). Forward/back movement is done with the keys as before.

```gdscript
extends CharacterBody2D

var speed = 400  # move speed in pixels/sec

func _physics_process(delta):
    look_at(get_global_mouse_position())
    var move_input = Input.get_axis("down", "up")
    velocity = transform.x * move_input * speed
    move_and_slide()
```

### Option 4: Click and move

In this option, the character moves to the clicked location.

```gdscript
extends CharacterBody2D

var speed = 400  # move speed in pixels/sec
var target = null

func _input(event):
    if event.is_action_pressed("click"):
        target = get_global_mouse_position()

func _physics_process(delta):
    if target:
        # look_at(target)
        velocity = position.direction_to(target) * speed
        if position.distance_to(target) < 10:
            velocity = Vector2.ZERO
    move_and_slide()
```

Note that we stop moving if we get close to the target position. If you don't do this, the character will "jiggle" back and forth as it moves a little bit past the target, moves back, goes a little past it, and so on. Optionally, you can use `look_at()` to face in the direction of movement.

## <i class="fas fa-code-branch"></i> Download This Project

Download the project code here: [https://github.com/godotrecipes/topdown_movement](https://github.com/godotrecipes/topdown_movement)
