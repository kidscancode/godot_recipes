---
title: "Moving circles"
weight: 7
draft: false
pre: "07. "
---

## Fixing a bug

Our first task is to fix a bug with our menu system. Pressing the "Start" button launches a new game, but as the screen is moving off, it can be pressed again. Try "spamming" the start button - disaster ensues!

We can fix this by disabling the buttons while the screen transition is happening. Since we put all the buttons in a "buttons" group, we can easily do this with `call_group()`.

Here's the updated `BaseScreen.gd`:

```gdscript
extends CanvasLayer

onready var tween = $Tween

func appear():
    get_tree().call_group("buttons", "set_disabled", false)
    tween.interpolate_property(self, "offset:x", 500, 0,
                        0.5, Tween.TRANS_BACK, Tween.EASE_IN_OUT)
    tween.start()

func disappear():
    get_tree().call_group("buttons", "set_disabled", true)
    tween.interpolate_property(self, "offset:x", 0, 500,
                        0.5, Tween.TRANS_BACK, Tween.EASE_IN_OUT)
    tween.start()
```

## Score and level

As our score increases, we'll want the game's difficulty to increase as well. This means that when we get points, we'll need to check if we've passed a certain threshold (`circles_per_level`). We may also have other things that give us points besides jumping on a circle. To make this easier to handle, we'll give our score variable a `setget` method in the main script:

```gdscript
var score = 0 setget set_score
var level = 0
```

And update the `new_game()` to use that method:

```gdscript
func new_game():
    self.score = 0
    level = 1
```

Do the same with the score change in `_on_Jumper_captured()`, and we'll move the HUD update into our new `set_score()` method:

```gdscript
func _on_Jumper_captured(object):
    $Camera2D.position = object.position
    object.capture(player)
    call_deferred("spawn_circle")
    self.score += 1

func set_score(value):
    score = value
    $HUD.update_score(score)
    if score > 0 and score % settings.circles_per_level == 0:
        level += 1
        $HUD.show_message("Level %s" % str(level))
```

Try the game and you should see a "Level 2" message on the screen when you reach five points.

## Moving circles

Part of the level progression is going to be increased difficulty. One way we'll do that is by making some circles move. We already have multiple circle types (static and limited), but either of those should be capable of moving, so this won't be a new circle type. Instead, it will be a property that any circle can have.

Open up the `Circle` scene and add a `Tween` node called "MoveTween". Add this to the top of the circle script:

```gdscript
onready var move_tween = $MoveTween

var move_range = 100  # Distance the circle moves.
var move_speed = 1.0  # The circle's movement speed.
```

If `move_range` is `0`, we'll have a non-moving circle. We'll make the default `100` here so that we can test it out.

To handle the movement, we'll start the `MoveTween`. When it ends, we'll start it again in the opposite direction, using the `tween_completed` signal.

This is the code to start the movement. Connect the `tween_completed` signal to this function:

```gdscript
func set_tween(object=null, key=null):
    if move_range == 0:
        return
    move_range *= -1
    move_tween.interpolate_property(self, "position:x",
                position.x, position.x + move_range,
                move_speed, Tween.TRANS_QUAD, Tween.EASE_IN_OUT)
    move_tween.start()
```

Finally, we'll add `set_tween()` to the end of the `init()` function and we can try it out.

<video controls src="/godot_recipes/img/cj_07_01.webm"></video>

----------

#### Follow this project on Github:

[https://github.com/kidscancode/circle_jump](https://github.com/kidscancode/circle_jump)

#### Do you prefer video?

{{< youtube 8SOw_IvB2gE >}}
