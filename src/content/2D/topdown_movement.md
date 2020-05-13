---
title: "Top-down movement"
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
### Option 3: Aim with mouse

Similar to option 2, but this time the character rotation is controlled with the mouse (ie the character always points towards the mouse). Forward/back movement is done with the keys as before.

```gdscript
extends KinematicBody2D

var speed = 200

var velocity = Vector2.ZERO

func get_input():
    velocity = Vector2.ZERO
    if Input.is_action_pressed("forward"):
        velocity += transform.x * speed
    if Input.is_action_pressed("back"):
        velocity -= transform.x * speed

func _physics_process(delta):
    look_at(get_global_mouse_position())
    get_input()
    velocity = move_and_slide(velocity)
```

### Option 4: Click and move

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
        if position.distance_to(target) > 5:
            velocity = move_and_slide(velocity)
```

### Option 5: Adding friction

All of the movement methods above move and change direction instantly - there's no acceleration or friction. What if we want to ramp our velocity up from or down to zero? Let's add some code to *interpolate* or "lerp" the velocity after getting the input.

We'll use the code from [Option 1: 8-way movement](#option-1-8-way-movement) movement.

```gdscript
extends KinematicBody2D

export var speed = 200
export var friction = 0.01
export var acceleration = 0.1

var velocity = Vector2()

func get_input():
    var input = Vector2()
    if Input.is_action_pressed('right'):
        input.x += 1
    if Input.is_action_pressed('left'):
        input.x -= 1
    if Input.is_action_pressed('down'):
        input.y += 1
    if Input.is_action_pressed('up'):
        input.y -= 1
    return input

func _physics_process(delta):
    var direction = get_input()
    if direction.length() > 0:
        velocity = lerp(velocity, direction.normalized() * speed, acceleration)
    else:
        velocity = lerp(velocity, Vector2.ZERO, friction)
    velocity = move_and_slide(velocity)
```

Now our input isn't applied directly to the `velocity` but rather used to "push" the velocity towards the input direction. If there's no input, we ramp down towards zero.