---
title: "3D Kinematic Car: Traction/Drifting"
weight: 2
draft: false
---

## Problem

You've got a [kinematic car](/godot_recipes/3d/kinematic_car/car_base/), but you don't like the "on rails" feeling, especially at high speeds. You'd like to have some "slip" so that you can have drifting and loss of traction.

## Solution

When the car is drifting, the heading of the car (the direction it's pointing) may not be the same as its velocity (the direction it's moving). Turning the wheel will make the car turn, but the velocity will not instantly "catch up" - instead, we'll use `lerp()` (linear interpolation) to gradually move the velocity to the desired direction.

Add the following new variables to `car_base.gd`:

```gdscript
export var slip_speed = 9.0
export var traction_slow = 0.75
export var traction_fast = 0.02

var drifting = false
```

`slip_speed` is how fast the car needs to be going before losing traction. You'll need to adjust this based on the car's other parameters.

`traction_slow` and `traction_fast` represent the traction when below or above the `slip_speed`, ranging from `0` - `1`. Smaller numbers mean the car will feel more "slippery". Setting them to `1` will be "on rails" with no sliding at all.

`drifting` is a boolean variable to keep track of the drifting state.

Next, add this code to the `calculate_steering()` function in `car_base.gd`, right after calculating the `new_heading`:

```gdscript
# traction
if not drifting and velocity.length() > slip_speed:
    drifting = true
if drifting and velocity.length() < slip_speed and steer_angle == 0:
    drifting = false
var traction = traction_fast if drifting else traction_slow
```

This code sets the `drifting` state as appropriate, and then selects which traction value to use.

The last piece of the puzzle is to interpolate the velocity to the new heading. Change this line:

```gdscript
velocity = new_heading * velocity.length()
```

to this:

```gdscript
velocity = lerp(velocity, new_heading * velocity.length(), traction)
```

![alt](/godot_recipes/img/3d_car_06.gif)

### Wrapping up

At this point, we have a large number of parameters to adjust, giving us a very wide range of behavior for the car. Depending on the style of driving you're going for, your number might be very different from the ones used here.

If you're looking to add more, here are some of the topics we'll address in follow-up recipes:

* Chase camera and camera control
* AI/NPC control (steering, obstacle avoidance, track following)
* Slopes and ramps

## Related recipes

- [Kinematic Car: Base](/godot_recipes/3d/kinematic_car/car_base/)
- [2D: Car Steering recipe](/godot_recipes/2d/car_steering)
- [Input Actions](http://kidscancode.org/godot_recipes/input/input_actions/)
- [3D: KinematicBody Movement](/godot_recipes/3d/kinematic_body/)

#### Like video?

