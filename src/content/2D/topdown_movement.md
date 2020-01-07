---
title: "Top-down character"
weight: 1
draft: false
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

We will also assume you're using a `KinematicBody2D` character.

We can solve this problem in many ways, depending on what type of behavior you're looking for.

### Option 1: 8-way movement

In this scenario, the player uses the four directional keys to move (including diagonals).

```gdscript
extends KinematicBody2D

var speed = 200  # speed in pixels/sec
var velocity = Vector2.ZERO

func get_input():
    velocity = Vector2.ZERO
    if Input.is_action_pressed('right'):
        velocity.x += 1
    if Input.is_action_pressed('left'):
        velocity.x -= 1
    if Input.is_action_pressed('down'):
        velocity.y += 1
    if Input.is_action_pressed('up'):
        velocity.y -= 1
    # Make sure diagonal movement isn't faster
    velocity = velocity.normalized() * speed

func _physics_process(delta):
    get_input()
    velocity = move_and_slide(velocity)
```

### Option 2: Rotate and move

In this scenario, the left/right actions rotate the character and up/down move the character forward and back in whatever direction it's facing. This is sometimes referred to as "Asteroids-style" movement.

```gdscript
extends KinematicBody2D

var speed = 200
var rotation_speed = 1.5

var velocity = Vector2.ZERO
var rotation_dir = 0

func get_input():
    rotation_dir = 0
    velocity = Vector2.ZERO
    if Input.is_action_pressed('right'):
        rotation_dir += 1
    if Input.is_action_pressed('left'):
        rotation_dir -= 1
    if Input.is_action_pressed('down'):
        velocity -= transform.x * speed
    if Input.is_action_pressed('up'):
        velocity += transform.x * speed

func _physics_process(delta):
    get_input()
    rotation += rotation_dir * rotation_speed * delta
    velocity = move_and_slide(velocity)
```

### Option 3: Click and move

In this option, the character moves to the clicked location.

```gdscript
extends KinematicBody2D

var speed = 200
var target = null
var velocity = Vector2.ZERO

func _input(event):
    if event.is_action_pressed('click'):
        target = event.position

func _physics_process(delta):
    if target:
        look_at(target)
        velocity = transform.x * speed
        # stop moving if we get close to the target
        if position.distance_to(target) > 5 > 5:
            velocity = move_and_slide(velocity)
```
