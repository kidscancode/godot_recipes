---
title: "Melee attacks"
weight: 3
draft: false
---

## Problem

You want to implement a melee attack, such as a sword or punch.

## Solution

For this example, we'll assume we have already set up a character with one or more attack animations. To illustrate, we'll use these two attacks:

![alt](/godot_recipes/img/attack2.png)

![alt](/godot_recipes/img/attack1.png)

We can detect the sword hitting the target using an `Area2D`, but we only want that area to be active during the swing. In order for this activation to be in sync with the animation, we'll use the AnimationPlayer to control it.

Add an `Area2D` and `CollisionShape2D` to the scene. We'll use a rectangle shape for the hitbox and size it so that it covers the sword during the swing frame.

![alt](/godot_recipes/img/melee_attack_01.png)

Move the animation to the first frame and check the _Disabled_ property of the area. Click the keyframe icon to add a track to the animation. Then advance the animation to the frame where the sword is extended, and add another keyframe with _Disabled_ unchecked. Finally, advance to the end of the swing and keyframe _Disabled_ on once more.

![alt](/godot_recipes/img/melee_attack_02.gif)

Now connect this new area's `area_entered` signal (or, depending on how your game is set up, `body_entered`). For the purposes of this demo, let's assume that any body that can take damage has an `Area2D` defined and placed in a group called "hurtbox".

```gdscript
func _on_SwordHit_area_entered(area):
    if area.is_in_group("hurtbox"):
        area.take_damage()
```

Now you should be able to try it out and see the attack doing damage if the target is inside the sword's hitbox.

![alt](/godot_recipes/img/melee_attack_03.gif)

### Changing the hitbox size

When you have more than one attack animation, the size of the affected area may not be the same. In the above attack animations, the first one is an upward sweeping attack that covers more area. To handle this, we also need to add an animation track for the collision shape's _Extents_ property. Set this and keyframe it at the start of each animation.

![alt](/godot_recipes/img/melee_attack_04.gif)

![alt](/godot_recipes/img/melee_attack_05.gif)

## Related recipes

- [Top-down character](http://kidscancode.org/godot_recipes/2d/topdown_movement/#option-1-8-way-movement)
- [Controlling animation states](http://kidscancode.org/godot_recipes/animation/animation_state_machine/)

#### Like video?

{{< youtube AaJopFFkmNo >}}