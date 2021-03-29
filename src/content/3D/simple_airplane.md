---
title: "Simplified Airplane Movement"
weight: 7
draft: true
ghcommentid:
---
## Problem

You want to make an airplane controller in 3D, but don't need a fully accurate flight-simulator.

## Solution

{{% notice note %}}
This recipe is *not* an accurate flight simulator. We are not simulating aerodynamics, so this doesn't fly like a *real* airplane. We're going for simplicity and "fun" here, not accuracy.
{{% /notice %}}

### Node setup

We're going to use a {{< gd-icon KinematicBody3D >}}`KinematicBody` for this. Since we won't be simulating actual flight physics (lift, drag, etc.), we don't need {{< gd-icon RigidBody >}}`RigidBody` in this case.

Here's our model:

![alt](/godot_recipes/img/kb_plane_01.png)

We're using a cylinder for the collision shape, sized to match the plane's fuselage. This will allow for detecting the ground, which is all we're concerned with for this demo.

To start the script, let's look at our plane's properties:

```gdscript
extends KinematicBody

# Can't fly below this speed
var min_flight_speed = 10
# Maximum airspeed
var max_flight_speed = 20
# Turn rate
var turn_speed = 0.75
# Climb/dive rate
var pitch_speed = 0.5
# Lerp speed returning wings to level
var level_speed = 3

# Current speed
var forward_speed = 0
# Throttle input speed
var target_speed = 0
# Lets us disable certain things when grounded
var grounded = false

var velocity = Vector3.ZERO
var turn_input = 0
var pitch_input = 0
```

### Movement

```gdscript
func _physics_process(delta):
    # Accelerate/decelerate
    forward_speed = lerp(forward_speed, target_speed, 0.1)
    # Movement is always forward
    velocity = -transform.basis.z * forward_speed
    velocity = move_and_slide(velocity, Vector3.UP)
```

To test, set `target_speed` to `20` and you should see the plane accelerate.

### Controls

We'll need the following input actions for our controls. We're using a game controller in this demo, but you can add key inputs as well if you like.

![alt](/godot_recipes/img/kb_plane_02.png)



```gdscript
func get_input(delta):
    # Throttle input
    if Input.is_action_pressed("throttle_up"):
        target_speed = min(forward_speed + 0.5, max_flight_speed)
    if Input.is_action_pressed("throttle_down"):
        var limit = 0 if grounded else min_flight_speed
        target_speed = max(forward_speed - 0.5, limit)
    # Turn (roll/yaw) input
    turn_input = 0
    turn_input -= Input.get_action_strength("roll_right")
    turn_input += Input.get_action_strength("roll_left")
    # Pitch (climb/dive) input
    pitch_input = 0
    pitch_input -= Input.get_action_strength("pitch_down")
    pitch_input += Input.get_action_strength("pitch_up")
```

### Landing/taking off

### Full script

Here's the full script:

```gdscript

```