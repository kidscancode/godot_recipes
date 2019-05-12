---
title: "Score and HUD"
weight: 5
draft: false
pre: "05. "
---

In the last part, we added UI in the form of menus to start and configure the game. We also need a UI to display in-game information such as score.

## HUD scene

Add a new scene with a `CanvasLayer` root to be our HUD. Give it two children: a `MarginContainer` named "ScoreBox" and a `Label" named "Message".

Your scene tree should look like this:

![alt](/godot_recipes/img/cj_05_01.png)

Set the layout of the `ScoreBox` to "Bottom Wide" and the _Custom Constants_ all to `20`. Add an `HBoxContainer` child and under that two `Label` nodes. Name the second label "Score" and put `100` in its _Text_ property. Set the `HBoxContainer`'s _Alignment_ to "End".

Add the same `DynamicFont` resource to both labels, but choose "Make Unique" on the first label and set its size to `32`. Set its _Text_ property to "Score". In its _Size Flags/Vertical, set "Fill". Your layout should look like this:

![alt](/godot_recipes/img/cj_05_02.png)

Now for the `Message` node load the font and set _Text_ to "Message" so we'll have something to see. Also choose "Make Unique" on the font resource (you'll see why in the next section). Set _Align_ and _Valign_ to "Center" and _Clip Text_ to "On". For layout, choose "Center Wide". Also, set _Grow Direction/Vertical_ to "Both".

## Message animation

This message will show information during gameplay (level up, bonuses, etc). We want it to be animated - to appear and then fade out. Add an `AnimationPlayer` to the scene.

We'll make two animations: one to set the initial values, and one to animate the message display. Add the first animation, "init" and click the "Autoplay on Load" button. Set the length to `0.1`.

Add a keyframe at time `0` for the _Font/Size_ (`64`), and one for the _Visible_
set to "Off".

Add the second animation, "show_message". Set its length to `0.75` and keyframe _Visibility_ to "On".

Next, we'll keyframe the _Font/Size_ from `64` at time `0` and `200` at the end. Set the track's _Update Mode_ to "Continuous".

We also want it to fade out as it grows, so keyframe the _Modulate_ alpha value from `255` to `0`.

Heres' what the animation settings should look like:

![alt](/godot_recipes/img/cj_05_03.png)

And the animation when it plays:

![alt](/godot_recipes/img/cj_05_04.gif)

## HUD Script

Now let's add a script to the scene, with methods to update the displays:

```gdscript
extends CanvasLayer

func show_message(text):
    $Message.text = text
    $AnimationPlayer.play("show_message")

func hide():
    $ScoreBox.hide()

func show():
    $ScoreBox.show()

func update_score(value):
    $ScoreBox/HBoxContainer/Score.text = str(value)
```

Instance the HUD in the main scene, and add `$HUD.hide()` to the `_ready()` and `_on_Jumper_died()` functions. In `new_game()` we need to show the hud and display a message:

```gdscript
$HUD.show()
$HUD.show_message("Go!")
```

To add the score, create a `score` variable and set it to `0` in `new_game()`. In `_on_Jumper_captured()` increment it by one. Make sure to call `$HUD.update_score(score)` after each of these.

In the next part, we'll add sound and color to the game!

----------

#### Follow this project on Github:

[https://github.com/kidscancode/circle_jump](https://github.com/kidscancode/circle_jump)

#### Do you prefer video?

{{< youtube Fz2ltnvI4MQ >}}
