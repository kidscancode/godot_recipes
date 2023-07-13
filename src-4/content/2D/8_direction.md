---
title: "8-Directional Movement/Animation"
weight: 4
draft: false
ghcommentid: 100
---

## Problem

You need a 2D character that has 8-directional movement, including animation.

## Solution

For our example, we'll use the [Isometric Mini-Crusader](https://remos.itch.io/mini-crusader), which contains 8-directional animations for idle, run, attack, and several other states.

![alt](/godot_recipes/4.x/img/8_direction_01.gif)

The animations are organized in folders, with a separate image for each frame. We'll use an {{< gd-icon AnimatedSprite2D >}}`AnimatedSprite2D` and we'll name each animation based on its direction. For example, `idle0` pointing to the right and going clockwise to `idle7`.

When our character moves, it will pick an animation based on the direction of movement:

![alt](/godot_recipes/4.x/img/8_direction_03w.png)

We'll use the mouse to move - the character will always face the mouse and run in that direction when we click the mouse button.

To choose which animation to play, we need to get the mouse direction and map it to this same range of `0-7`. `get_local_mouse_position()` gives us the position of the mouse relative to the character. We can then use `snappedf()` to snap the angle of the mouse vector to the closest multiple of 45° (`PI/4` radians) giving the following result:

![alt](/godot_recipes/4.x/img/8_direction_04w.png)

Divide each value by 45° (`PI/4` radians), and we have:

![alt](/godot_recipes/4.x/img/8_direction_02w.png)

Finally, we need to map the resulting range to `0-7` using the `wrapi()` function, and we'll have our correct values. Adding that value to the end of the animation name ("idle", "run", etc) gives us the correct animation:

```gdscript
func _physics_process(delta):
    current_animation = "idle"

    var mouse = get_local_mouse_position()
    angle = snappedf(mouse.angle(), PI/4) / (PI/4)
    angle = wrapi(int(angle), 0, 8)

    if Input.is_action_pressed("left_mouse") and mouse.length() > 10:
        current_animation = "run"
        velocity = mouse.normalized() * speed
        move_and_slide()
    $AnimatedSprite2D.animation = current_animation + str(a)
```

Testing the movement, we see this:

![alt](/godot_recipes/4.x/img/8_direction_05.gif)

### Keyboard input

If you're using keyboard controls instead of mouse, you can get the angle of movement based on which keys are being held. The rest of the process works in the same way.

```gdscript
func _process(delta):
    current_animation = "idle"
    var input_dir = Input.get_vector("left", "right", "up", "down")
    if input_dir.length() != 0:
        angle = input_dir.angle() / (PI/4)
        angle = wrapi(int(a), 0, 8)
        current_animation = "run"
    velocity = input_dir * speed
    move_and_slide()
    $AnimatedSprite2D.play(current_animation + str(angle))
```


## <i class="fas fa-code-branch"></i> Download This Project

Download the project code here: [https://github.com/godotrecipes/8_direction_animation](https://github.com/godotrecipes/8_direction_animation)
