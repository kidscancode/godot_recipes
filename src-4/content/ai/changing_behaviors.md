---
title: "Changing Behaviors"
weight: 5
draft: true
---

## Problem
You want your AI-controlled entity to switch between different behaviors.

## Solution

For this example, we’ll assume an enemy with the following behaviors:

- **Patrol**

    The "Patrol" state moves along a pre-defined path (or stands still if there's no path assigned).
    <!-- See [Path following](/godot_recipes/4.x/ai/path_follow/) for details. -->

- **Chase**

    The "Chase" state moves the enemy towards the player. See [Chasing the player](/godot_recipes/4.x/ai/chasing/) for how to make this behavior.

- **Attack**

    In this state, the player is in range of a melee attack, so the enemy stops moving and executes its attack.
    <!-- See [Melee attacks](/godot_recipes/4.x/animation/melee_attacks/) for how to make melee attacks. -->

These behaviors are states - the enemy can only be in one of these states at a time, and certain events, such as the player getting near, will cause a transition to another state.

To determine the state transitions, we have two {{< gd-icon Area2D >}}`Area2D` nodes on the enemy: an outer one called "DetectRadius" and an inner called "AttackRadius". The player entering or exiting these areas will trigger the related behavior.

![alt](/godot_recipes/4.x/img/behaviors_01.png)

We've chosen a rectangular shape for `AttackRadius` in this example due to the shape of the enemy's attack. Any shape is fine as long as it's smaller than the `DetectRadius`.

Connect the `body_entered` and `body_exited` signals of both these areas. If you're using collision layers (and you should be), set them so that they can only detect the player (or any other body you want to be chased/attacked).

Now let's examine the enemy's script:


```gdscript
extends CharacterBody2D

@export var patrol_path : Path2D

var run_speed = 25.0
var attacks = ["attack1", "attack2"]

enum states {PATROL, CHASE, ATTACK, DEAD}
var state = states.PATROL
var target = null
var player = null
var current_patrol_point = 0
var patrol_points = []
```

```gdscript
func _ready():
    if patrol_path:
        patrol_points = patrol_path.curve.get_baked_points()

func _physics_process(delta):
    $Label.text = str(states.keys()[state])
    velocity = Vector2.ZERO
    choose_action()
    if target:
        if target.x > position.x:
            $Sprite2D.scale.x = 1
        elif target.x < position.x:
            $Sprite2D.scale.x = -1
        if state != states.ATTACK:
            velocity = position.direction_to(target) * run_speed

    if velocity.length() > 0:
        anim_state.travel("run")
    move_and_slide()

func choose_action():
    var current_anim = anim_state.get_current_node()
    if current_anim in attacks:
        return
    match state:
        states.DEAD:
            set_physics_process(false)
        states.PATROL:
            if !patrol_path:
                anim_state.travel("idle")
                target = null
                return
            target = patrol_points[current_patrol_point]
            if position.distance_to(target) < 5:
                current_patrol_point = wrapi(current_patrol_point + 1, 0, patrol_points.size())
        states.CHASE:
            target = player.position
        states.ATTACK:
            target = player.position
            anim_state.travel(attacks.pick_random())

func _on_detect_radius_body_entered(body):
    player = body
    state = states.CHASE

func _on_attack_radius_body_entered(body):
    state = states.ATTACK

func _on_detect_radius_body_exited(body):
    player = null
    state = states.PATROL

func _on_attack_radius_body_exited(body):
    state = states.CHASE

```