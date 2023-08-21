---
title: "Coyote Time"
weight: 5
draft: false
---

## Problem

Your platformer jumping feels "off". Players don't have good control and sometimes they "miss" jumping off the edge of platforms.

## Solution

The answer to this problem is to use a technique called "coyote time". This gives the player a greater feeling of control and a little "wiggle room" around the process of jumping from the edges of platforms.

"Coyote time" works like this:

If the player walks off the edge of a platform, for a few frames afterward, we still allow them to jump as if they were still on the ground.

{{% notice style="info" title="Origins" %}}
The name "coyote time" comes from the famous cartoon coyote, who wouldn't fall until he looked down:

![alt](/godot_recipes/4.x/img/coyote.png)
{{% /notice %}}


We're going to add this to an already existing platform character. See the [Platform character](/godot_recipes/4.x/2d/platform_character/) recipe for how to set one up.

To handle the timing, we'll add a {{< gd-icon Timer >}}`Timer` node called `CoyoteTimer` and set it to **One Shot**.

There are a few new variables we'll need to keep track of coyote time:

```gdscript
var coyote_frames = 6  # How many in-air frames to allow jumping
var coyote = false  # Track whether we're in coyote time or not
var last_floor = false  # Last frame's on-floor state
```

Since we're using frames to set the duration, we can translate that to time when setting the {{< gd-icon Timer >}}`Timer`'s length in `_ready()`:

```gdscript
$CoyoteTimer.wait_time = coyote_frames / 60.0
```

Each frame we'll store the current value of `is_on_floor()` to be used in the following frame, so put this in `_physics_process()` after the `move_and_slide()`:

```gdscript
    last_floor = is_on_floor()
```

When we detect the jump input, we need to check if the character is on the floor *or* in coyote time:

```gdscript
    if Input.is_action_just_pressed("jump") and (is_on_floor() or coyote):
        velocity.y = jump_speed
        jumping = true
```

Coyote time begins if the player walks off the edge of a platform. That means that they are no longer on the floor, but were on the floor in the previous frame. We can check that like this, and start the timer if we did just transition from on- to off-floor:

```gdscript
    if !is_on_floor() and last_floor and !jumping:
        coyote = true
        $CoyoteTimer.start()
```

The `CoyoteTimer` tells us when the coyote state ends:

```gdscript
func _on_coyote_timer_timeout():
    coyote = false
```

{{% notice style="tip" title="Implementing in 3D" %}}
You can apply the same process to 3d characters.
{{% /notice %}}

## <i class="fas fa-code-branch"></i> Download This Project

The character in the [Moving Platforms](/godot_recipes/4.x/2d/moving_platforms) project has coyote time implemented.

Download the project code here: [https://github.com/godotrecipes/2d_moving_platforms](https://github.com/godotrecipes/2d_moving_platforms)

## Related recipes

- [Platform character](/godot_recipes/4.x/2d/platform_character/)
