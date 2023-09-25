---
title: "Character Controller"
weight: 10
draft: true
---

## Problem

You've imported a rigged, animated 3D character in Godot and set up its animations using {{< gd-icon AnimationTree >}}`AnimationTree`. Now you need to implement movement: a character controller.

## Solution

In this recipe, we'll assume you've already imported your character model and animations, and that you're set up {{< gd-icon AnimationTree >}}`AnimationTree` to handle transitioning and blending the animations. If you haven't yet, see [Importing Assets](/4.x/3d/assets/importing_assets/) and [Character Animation](/4.x/3d/assets/character_animation/) for details. As a reminder, we're using the art packs linked in the [section description](/godot_recipes/4.x/3d/assets/).

### Adding collision

We've chosen {{< gd-icon CharacterBody3D >}}`CharacterBody3D` as the root node of the character scene, and it's complaining about a missing collision shape, so let's fix that first. Add a {{< gd-icon CollisionShape3D >}}`CollisionShape3D` child and choose {{< gd-icon CapsuleShape3D >}}`CapsuleShape3D` as its **Shape** property.

Size and position the capsule to enclose the character's body. For reference, here are the values I used:

**SS**

Note that the imported rig is positioned so that its feet are on the "ground", ie at the body's position. This will be helpful later, as the player's position will remain on the ground, rather than floating in mid-air.

If you're familiar with Godot's 3D orientation, you'll also notice that the character is facing the **+Z** direction, which is backwards. Select the {{< gd-icon Skeleton3D >}}`Skeleton3D` node and set its **Y** **Rotation** to `180` to correct this.

### Input actions

In the **Input Map**, we're using the following inputs: `forward`, `back`, `left`, `right`, and `jump`. Assign them to whatever keys/buttons you prefer.

### Camera

There are many ways to handle a 3D camera that follows the player. For this example, we'll use a {{< gd-icon SpringArm3D >}}`SpringArm3D` as the camera "mount".

The {{< gd-icon SpringArm3D >}}`SpringArm3D` node works by casting a ray and then moving its children to the collision point. Using this for a camera means nothing can get between the camera and the player, and we can implement zoom by varying this length.

Add one as a child of the root node, and then add a {{< gd-icon Camera3D >}}`Camera3D` as a child of that.

In the spring arm's properties, set **Spring Length** to `5`, the **Margin** to `0.1`, and the **Position** to `(0, 2.5, 0)`.

### Movement

```gdscript
extends CharacterBody3D
class_name Knight

@export var speed = 5.0
@export var acceleration = 4.0
@export var jump_speed = 8.0

var gravity = ProjectSettings.get_setting("physics/3d/default_gravity")
var jumping = false
```

asdf

```gdscript
@onready var spring_arm = $SpringArm3D
@onready var model = $Rig
@onready var anim_tree = $AnimationTree
@onready var anim_state = $AnimationTree.get("parameters/playback")
```

We'll use the `anim_tree` reference to set the blend position for the Idle/Walk/Run blendspace. `anim_state` is a reference to the animation state machine, which we can use to call which animation to transition to. See the [Character Animation](/4.x/3d/assets/character_animation/) recipe for how we set these up.

```gdscript
func _physics_process(delta):
    velocity.y += -gravity * delta
    get_move_input(delta)

    move_and_slide()
```

```gdscript
func get_move_input(delta):
    var vy = velocity.y
    velocity.y = 0
    var input = Input.get_vector("left", "right", "forward", "back")
    var dir = Vector3(input.x, 0, input.y).rotated(Vector3.UP, spring_arm.rotation.y)
    velocity = lerp(velocity, dir * speed, acceleration * delta)
    velocity.y = vy
```


    * camera control
* vel to blend tree
* attacks
* interact ray