---
title: "Changing behaviors"
weight: 4
draft: false
---

## Problem

You want your AI-controlled entity to switch between different behaviors.

## Solution

For this example, we'll assume an enemy with the following behaviors. See the individual recipes for how to make each behavior work.

- **Patrol**

    The "Patrol" state moves along a pre-defined path (or stands still if there's no path assigned). See [Recipe: Path following](/godot_recipes/ai/path_follow/) for details.

- **Chase**

    The "Chase" state moves the enemy towards the player. See [Recipe: Chasing the player](/godot_recipes/ai/chase/) for how to make this behavior.

- **Attack**

    In this state, the player is in range of a melee attack, so the enemy stops moving and executes its attack. See [Recipe: Melee attacks](/godot_recipes/animation/melee_attacks/) for how to make melee attacks.

These behaviors are states - the enemy can only be in one of these states at a time, and certain events, such as the player getting near, will cause a transition to another state.

To determine the state transitions, we have two `Area2D` nodes on the enemy: an outer one called "DetectRadius" and an inner called "AttackRadius". The player entering or exiting these areas will trigger the related behavior.

![alt](/godot_recipes/img/behaviors_01.png)

We've chosen a rectangular shape for `AttackRadius` in this example due to the shape of the enemy's attack. Any shape is fine as long as it's smaller than the `DetectRadius`.

Connect the `body_entered` and `body_exited` signals of both these areas. If you're using collision layers (and you should be), set them so that they can only detect the player (or any other body you want to be chased/attacked).

Now let's examine the enemy's script:

```gdscript
extends KinematicBody2D

enum states {PATROL, CHASE, ATTACK, DEAD}
var state = states.PATROL
```

We start with an `enum` to give us a way to reference our states by name, and a variable to hold the current state.

```gdscript
# For setting animations.
var anim_state
var run_speed = 25
var attacks = ["attack1", "attack2"]

# For path following.
export (NodePath) var patrol_path
var patrol_points
var patrol_index = 0

# Target for chase mode.
var player = null

var velocity = Vector2(run_speed, 0)

```

The other variables needed for the individual behaviors and animations. See the referenced behavior links above for details.

```gdscript
func _physics_process(delta):
    choose_action()
    # Changing the x scale flips the sprite and its attack area.
    if velocity.x > 0:
        $Sprite.scale.x = 1
    elif velocity.x < 0:
        $Sprite.scale.x = -1

    # If we're moving, show the run animation.
    if velocity.length() > 0:
        anim_state.travel("run"
        )
    # Show the idle animation when coming to a stop (but not attacking).
    if anim_state.get_current_node() == "run" and velocity.length() == 0:
        anim_state.travel("idle")

    velocity = move_and_slide(velocity)
```

We'll handle movement as normal in `_physics_process()`, calling `choose_action()` (see below) to decide what the resulting movement will be.

```gdscript
func choose_action():
    velocity = Vector2.ZERO
    var current = anim_state.get_current_node()
    # If we're currently attacking, don't move or change state.
    if current in attacks:
        return

    # Depending on the current state, choose a movement target.
    var target
    match state:
        states.DEAD:
            set_physics_process(false)

        # Move along assigned path.
        states.PATROL:
            if !patrol_path:
                return
            target = patrol_points[patrol_index]
            if position.distance_to(target) < 1:
                patrol_index = wrapi(patrol_index + 1, 0, patrol_points.size())
                target = patrol_points[patrol_index]
            velocity = (target - position).normalized() * run_speed

        # Move towards player.
        states.CHASE:
            target = player.position
            velocity = (target - position).normalized() * run_speed

        # Make an attack.
        states.ATTACK:
            target = player.position
            if target.x > position.x:
                $Sprite.scale.x = 1
            elif target.x < position.x:
                $Sprite.scale.x = -1
            anim_state.travel("attack")
```

In `choose_action()` we determine the target and move toward it.

```gdscript
func _on_DetectRadius_body_entered(body):
    state = states.CHASE
    player = body

func _on_DetectRadius_body_exited(body):
    state = states.PATROL
    player = null

func _on_AttackRadius_body_entered(body):
    state = states.ATTACK

func _on_AttackRadius_body_exited(body):
    state = states.CHASE
```

Finally, the functions connected to the area signals change the state accordingly.

### Expanding

This example is intentionally kept as simplified as possible, while still demonstrating complete behaviors. In a larger project, there would likely be a greater number of behaviors, as well as more complex conditions for deciding which one to apply.

## Related recipes

- [Top-down character](/godot_recipes/2d/topdown_movement/#option-1-8-way-movement)
- [Spritesheet animation](/godot_recipes/animation/spritesheet_animation/)
- [Controlling animation states](/godot_recipes/animation/animation_state_machine/)
- [Path following](/godot_recipes/ai/path_follow/)
- [Chasing the player](/godot_recipes/ai/chase/)