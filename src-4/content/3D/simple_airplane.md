---
title: "Arcade-stype Airplane"
weight: 12
draft: true
---

## Problem

You want to make an airplane controller in 3D, but don't need a fully accurate flight-simulator.

## Solution

In this recipe, we're going to make a *simplified* airplane controller. By "simplified" we mean stripping things down to the basics. We're looking for the "feel" of flying a plane - one that you can just jump in and start flying effortlessly, with a minimal control scheme.

{{% notice note %}}
This recipe is *not* an accurate flight simulator. We are not simulating aerodynamics, so this doesn't fly like a *real* airplane. We're going for simplicity and "fun" here, not accuracy.
{{% /notice %}}

### Node setup

We're going to use a {{< gd-icon CharacterBody3D >}}`CharacterBody3D` for this. Since we won't be simulating actual flight physics (lift, drag, etc.), we don't need {{< gd-icon RigidBody3D >}}`RigidBody3D` in this case.

Here's our model setup:

![alt](/godot_recipes/4.x/img/kb_plane_01.png)

We're using a cylinder for the collision shape, sized to match the plane's fuselage. This will allow for detecting the ground, which is all we're concerned with for this demo.

To start the script, let's look at our plane's properties:

```gdscript
extends CharacterBody3D

# Can't fly below this speed
var min_flight_speed = 12
# Maximum airspeed
var max_flight_speed = 40
# Turn rate
var turn_speed = 0.75
# Climb/dive rate
var pitch_speed = 0.5
# Wings "autolevel" speed
var level_speed = 3.0
# Throttle change speed
var throttle_delta = 50
# Acceleration/deceleration
var acceleration = 6.0

# Current speed
var forward_speed = 0
# Throttle input speed
var target_speed = 0
# Lets us change behavior when grounded
var grounded = false

var turn_input = 0
var pitch_input = 0
```

### Controls

We'll need the following input actions for our controls. We're using a game controller in this demo, but you can add keyboard inputs as well if you like.

![alt](/godot_recipes/4.x/img/kb_plane_02.png)

This function captures the inputs and sets the input values. Note that increasing/decreasing throttle changes the `target_speed`, not the actual speed. This will allow us to acclerate/decelerate from the current speed to the target speed.

```gdscript
func get_input(delta):
    # Throttle input
    if Input.is_action_pressed("throttle_up"):
        target_speed = min(forward_speed + throttle_delta * delta, max_flight_speed)
    if Input.is_action_pressed("throttle_down"):
        var limit = 0 if grounded else min_flight_speed
        target_speed = max(forward_speed - throttle_delta * delta, limit)

    # Turn (roll/yaw) input
    turn_input = Input.get_axis("roll_right", "roll_left")

    # Pitch (climb/dive) input
    pitch_input =  Input.get_axis("pitch_down", "pitch_up")
```

### Movement

Movement happens in `_physics_process()`, first lerping the speed towards the target speed and then using `move_and_slide()`:

```gdscript
func _physics_process(delta):
    get_input(delta)
    # Accelerate/decelerate
    forward_speed = lerpf(forward_speed, target_speed, acceleration * delta)

    # Movement is always forward
    velocity = -transform.basis.z * forward_speed

    move_and_slide()
```

To test, add the plane to a test scene (don't forget a {{< gd-icon Camera3D >}} `Camera`). Press the `"throttle_up"` input and you should see the plane accelerate forward.

{{% notice tip %}}
We're using the [Interpolated Camera](/godot_recipes/4.x/3d/interpolated_camera/) recipe in this demo.
{{% /notice %}}

![alt](/godot_recipes/4.x/img/kb_plane_03.gif)

Next, let's handle changing the pitch of the plane. Add this right after calling `get_input()` in `_physics_process()`:

```gdscript
transform.basis = transform.basis.rotated(transform.basis.x, pitch_input * pitch_speed * delta)
```

Run the scene again and try pitching up and down:

![alt](/godot_recipes/4.x/img/kb_plane_04.gif)

After that, add the following for the turn input:

```gdscript
transform.basis = transform.basis.rotated(Vector3.UP, turn_input * turn_speed * delta)
```

![alt](/godot_recipes/4.x/img/kb_plane_05.gif)

Notice that while the plane turns, it doesn't really look natural. Airplanes *bank* when they turn, so let's animate that by changing the rotation of the mesh:

```gdscript
mesh.rotation.z = lerpf(mesh.rotation.z, -turn_input, level_speed * delta)
```

![alt](/godot_recipes/4.x/img/kb_plane_06.gif)

Where `mesh` is a reference to the {{< gd-icon MeshInstance3D >}}`MeshInstance3D` in the plane scene (in the example, this is `$cartoon_plane`).

The amount of roll is related to the `turn_input` so a shallow turn banks less. Going straight will "auto" level the plane.

That's it! You now have the basic flying controls working correctly, and it should feel comfortable and natural to fly around. Try adjusting the various properties to see how they affect the movement.

### Landing/taking off

While the above is fine for flying, it doesn't handle the ground very well. Here, we'll simulate landing using a simplistic approach (by "simplistic", we mean doing so in a very basic way - you'll probably want to expand on it depending on what your game may need).

First, we'll want to distinguish between being on the ground and being in the air. On the ground, we can slow down to 0; in the air, we must maintain the minimum airspeed. Also, when on the ground, we won't bank when turning (we don't want our wings digging into the ground!).

```gdscript
func _physics_process(delta):
    get_input(delta)
    transform.basis = transform.basis.rotated(transform.basis.x, pitch_input * pitch_speed * delta)
    transform.basis = transform.basis.rotated(Vector3.UP, turn_input * turn_speed * delta)

    # Bank when turning
    if grounded:
        mesh.rotation.z = 0
    else:
        mesh.rotation.z = lerpf(mesh.rotation.z, -turn_input, level_speed * delta)

    # Accelerate/decelerate
    forward_speed = lerpf(forward_speed, target_speed, acceleration * delta)

    # Movement is always forward
    velocity = -transform.basis.z * forward_speed

    # Landing
    if is_on_floor():
        if not grounded:
            rotation.x = 0
        grounded = true
    else:
        grounded = false
    move_and_slide()
```

Meanwhile, in the `get_input()` function, we'll also take into account `grounded` when throttling down and when pitching down, and only allow takeoff if above `min_flight_speed`:

```gdscript
func get_input(delta):
    # Throttle input
    if Input.is_action_pressed("throttle_up"):
        target_speed = min(forward_speed + throttle_delta * delta, max_flight_speed)
    if Input.is_action_pressed("throttle_down"):
        var limit = 0 if grounded else min_flight_speed
        target_speed = max(forward_speed - throttle_delta * delta, limit)

    # Turn (roll/yaw) input
    turn_input = Input.get_axis("roll_right", "roll_left")
    if forward_speed <= 0.5:
        turn_input = 0

    # Pitch (climb/dive) input
    pitch_input = 0
    if not grounded:
        pitch_input -= Input.get_action_strength("pitch_down")
    if forward_speed >= min_flight_speed:
        pitch_input += Input.get_action_strength("pitch_up")
```

![alt](/godot_recipes/4.x/img/kb_plane_07.gif)

### Full script

Here's the full script:

{{% expand "Click to expand..." %}}

```gdscript
extends CharacterBody3D

# Can't fly below this speed
var min_flight_speed = 12
# Maximum airspeed
var max_flight_speed = 40
# Turn rate
var turn_speed = 0.75
# Climb/dive rate
var pitch_speed = 0.5
# Wings "autolevel" speed
var level_speed = 3.0
# Throttle change speed
var throttle_delta = 50
# Acceleration/deceleration
var acceleration = 6.0

# Current speed
var forward_speed = 0
# Throttle input speed
var target_speed = 0
# Lets us change behavior when grounded
var grounded = false

var turn_input = 0
var pitch_input = 0

var tracer_scene = preload("res://tracer.tscn")
var can_shoot = true

@onready var mesh = $cartoon_plane

func _ready():
    $cartoon_plane/AnimationPlayer.play("prop_spin")

func get_input(delta):
    # Throttle input
    if Input.is_action_pressed("throttle_up"):
        target_speed = min(forward_speed + throttle_delta * delta, max_flight_speed)
    if Input.is_action_pressed("throttle_down"):
        var limit = 0 if grounded else min_flight_speed
        target_speed = max(forward_speed - throttle_delta * delta, limit)

    # Turn (roll/yaw) input
    turn_input = Input.get_axis("roll_right", "roll_left")
    if forward_speed <= 0.5:
        turn_input = 0

    # Pitch (climb/dive) input
    pitch_input = 0
    if not grounded:
        pitch_input -= Input.get_action_strength("pitch_down")
    if forward_speed >= min_flight_speed:
        pitch_input += Input.get_action_strength("pitch_up")
#	pitch_input =  Input.get_axis("pitch_down", "pitch_up")

func _physics_process(delta):
    get_input(delta)
    transform.basis = transform.basis.rotated(transform.basis.x, pitch_input * pitch_speed * delta)
    transform.basis = transform.basis.rotated(Vector3.UP, turn_input * turn_speed * delta)

    # Bank when turning
    if grounded:
        mesh.rotation.z = 0
    else:
        mesh.rotation.z = lerpf(mesh.rotation.z, -turn_input, level_speed * delta)

    # Accelerate/decelerate
    forward_speed = lerpf(forward_speed, target_speed, acceleration * delta)

    # Movement is always forward
    velocity = -transform.basis.z * forward_speed

    # Landing
    if is_on_floor():
        if not grounded:
            rotation.x = 0
        grounded = true
    else:
        grounded = false
    move_and_slide()
```

{{% /expand%}}

## Wrapping up

You can adapt this technique to a variety of arcade-style flying games. For example, for mouse control, you could use the `relative` property of `InputEventMouseMotion` to set the pitch and turn input.

## <i class="fas fa-code-branch"></i> Download This Project

Download the project's example code here: [https://github.com/godotrecipes/3d_airplane_demo](https://github.com/godotrecipes/3d_airplane_demo)
