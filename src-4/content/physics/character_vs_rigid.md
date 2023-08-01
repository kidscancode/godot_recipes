---
title: "Character to Rigid Body Interaction"
weight: 5
draft: false
---

## Problem

You want your character body to interact with rigid bodies.

## Solution

{{% notice note %}}
This recipe applies equally well in both 2D and 3D nodes.
{{% /notice %}}

By default, a {{< gd-icon CharacterBody2D >}}`CharacterBody2D` moved with `move_and_slide()` or `move_and_collide()` will not push any {{< gd-icon RigidBody2D >}}`RigidBody2D` it collides with. The rigid body doesn't react at all, and behaves just like a {{< gd-icon StaticBody2D >}}`StaticBody2D`.

![alt](/godot_recipes/4.x/img/char_push_default.gif)

In some cases, this might be all you need. However, if you want to be able to push the bodies, you'll need to make some changes.

For this example, we'll use the 2D character described in the [Platform character](/godot_recipes/4.x/2d/platform_character/) recipe. This example uses the most common movement method for character bodies: `move_and_slide()`. If you're using `move_and_collide()`, you'll need to adjust the examples below accordingly.

You have two options when deciding how to interact with rigid bodies:

1. You can just push them, ignoring physics. If you're familiar with Godot 3.x, this is equivalent to the "infinite inertia" option.
1. You can give them a push based on the character's imagined "mass" and velocity. This will give you a "realistic" result - pushing heavy bodies a little, and lighter bodies a lot.

We'll try out both options below.

### Infinite Inertia

This option has its pros and cons. The biggest pro is, you don't need any extra code. You just need to correctly set the collision layers/masks of the objects. For this example, we've defined three physics layers:

![alt](/godot_recipes/4.x/img/2d_physics_layers_01.png)

For the rigid body, we've placed it on the "items" layer (layer 3), and left the mask at the default (masking all layers):

![alt](/godot_recipes/4.x/img/physics_layers_box.png)

Then, we've placed the player on the "player" layer (layer 2), and configured the mask to ignore the "items":

![alt](/godot_recipes/4.x/img/physics_layers_player.png)

Running the game, we now see we can push the boxes around. Note that the mass of the box doesn't matter - they'll all be pushed the same.

![alt](/godot_recipes/4.x/img/char_push_inf.gif)

Here, you can also see the downside of this option. Because the physics of the boxes is being ignored, they can clip through walls and you can't jump on top of them.

For some games, this will be fine. If you want to prevent the clipping, you'll need to go with option 2.

### Applying impulses

To give the colliding body a "push" we'll need to apply an impulse. An impulse is an instantaneous "kick" - think of a bat hitting a ball. This is as opposed to a force, which is a continuous "push" on an object.

```gdscript
# This represents the player's inertia.
var push_force = 80.0

func _physics_process(delta):
    # after calling move_and_slide()
    for i in get_slide_collision_count():
        var c = get_slide_collision(i)
        if c.get_collider() is RigidBody2D:
            c.get_collider().apply_central_impulse(-c.get_normal() * push_force)
```

The collision normal points *out* of the rigid body, so we reverse it to point away from the character and apply the `push_force` factor. Now pushing works again, but it won't force the rigid bodies through walls:

![alt](/godot_recipes/4.x/img/char_push_impulse.gif)

You'll need to adjust the `push_force` in relation to the mass of your rigid bodies. Too high a force will still cause clipping, while too low will prevent pushing at all.

Experiment to find the settings that work for your particular game.

## <i class="fas fa-code-branch"></i> Download This Project

Download the project's example code here: [https://github.com/godotrecipes/character_vs_rigid](https://github.com/godotrecipes/character_vs_rigid)

## Related recipes

- [Platform character](/godot_recipes/4.x/2d/platform_character/)

## <i class="fas fa-video"></i> Watch Video
{{< youtube SJuScDavstM >}}
