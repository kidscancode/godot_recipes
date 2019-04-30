---
title: "Menus"
weight: 4
draft: false
pre: "04. "
---

Now that we've got the basic gameplay, it's time to start working on the UI. We're going to need menu screens for the title, settings, and game over.

## Menu screens

The three screens will share a common layout and some functionality, so we'll start with a base scene they can all inherit from. In the new scene, start with a `CanvasLayer` and name it `BaseScreen`. Save this scene in the "UI" folder.

* `CanvasLayer` ("BaseScreen")
  * `MarginContainer`
    * `VBoxContainer`
      * `Label`
      * `HBoxContainer` ("Buttons")
  * `Tween`

The `MarginContainer` will ensure that none of our UI elements get too close to the edge of the screen. Set all four of its _Custom Constants_ properties to `20`.

Next is a `VBoxContainer` to organize the main elements. Set its _Custom Constants/Separation_ to `150`.

The `Label` node displays the screen's title. Put "Title" in its _Text_ field and load the same font resource we used for the circles.

Finally, add an `HBoxContainer` named "Buttons" which will hold the buttons we add to the screens. Set its _Separation_ to `75`. Then duplicate the node so that we have another row of buttons.

The screen should start offscreen, so set the _Offset_ on the root node to `(500, 0)`. Then add a script to the scene:

```gdscript
extends CanvasLayer

onready var tween = $Tween

func appear():
    tween.interpolate_property(self, "offset:x", 500, 0,
                    0.5, Tween.TRANS_BACK, Tween.EASE_IN_OUT)
    tween.start()

func disappear():
    tween.interpolate_property(self, "offset:x", 0, 500,
                    0.4, Tween.TRANS_BACK, Tween.EASE_IN_OUT)
    tween.start()
```

This script sets up the animations we can call to make the screen appear and disappear.

Now we can make our three inherited scenes. For each, name the root node, change the Label text, and add `TextureButton`s to the "Buttons" containers. Use the images from the assets folder for each button's _Normal_ texture. Name each button for its function ("Play", "Settings", etc.) and add it to the group "buttons".

Here is what the three scenes should look like, using the indicated button names:

![alt](/godot_recipes/img/cj_04_01.png)

Make one more scene with a `Node` root named "Screens" and instance the three screens in it. Add the following script, which will handle scene transitions and state.

```gdscript
extends Node

signal start_game

var current_screen = null

func _ready():
    register_buttons()
    change_screen($TitleScreen)

func register_buttons():
    var buttons = get_tree().get_nodes_in_group("buttons")
    for button in buttons:
        button.connect("pressed", self, "_on_button_pressed", [button.name])

func _on_button_pressed(name):
    match name:
        "Home":
            change_screen($TitleScreen)
        "Play":
            change_screen(null)
            yield(get_tree().create_timer(0.5), "timeout")
            emit_signal("start_game")
        "Settings":
            change_screen($SettingsScreen)

func change_screen(new_screen):
    if current_screen:
        current_screen.disappear()
        yield(current_screen.tween, "tween_completed")
    current_screen = new_screen
    if new_screen:
        current_screen.appear()
        yield(current_screen.tween, "tween_completed")

func game_over():
    change_screen($GameOverScreen)
```

This script connects up all our buttons by linking the `pressed` signal and passing along the button's name as a parameter. This lets our `_on_button_pressed()` method decide what each button should do.

The `change_screen()` method handles transition to the selected screen, including the `null` option for when we don't want to display a screen at all.

Run it to test out the screen transitions:

![alt](/godot_recipes/img/cj_04_02.gif)

Instance this scene in Main, then connect its `start_game` signal to the `new_game()` function in main. Don't forget to remove `new_game()` from the `_ready()`. Try running the game and you should be able to start. The last part will be to connect up the game over condition.

In the Jumper, add a signal called `died` and emit that signal in the visibility notifier's method.

Add this to the `new_game()` function:

```gdscript
player.connect("died", self, "_on_Jumper_died")
```

Then add this new function, which will ensure all the circles are removed when the player dies.

```gdscript
func _on_Jumper_died():
    get_tree().call_group("circles", "implode")
    $Screens.game_over()
```

Our menu screens are basic and no-frills, but they're functional. In the next part, we'll continue the UI work with our score counter and other in-game displays.

----------

#### Follow this project on Github:

[https://github.com/kidscancode/circle_jump](https://github.com/kidscancode/circle_jump)

#### Do you prefer video?

{{< youtube tWWncIkfCWs >}}