---
title: "Radial Popup Menu"
weight: 13
draft: false
---

## Problem

You want a radial menu - a ring of buttons that pops up for you to choose an option.

## Solution

Radial menus are used in a variety of games to allow access to a selection of buttons. For example, clicking on an NPC in a game allows you to choose what action to take: talk, inspect, attack, etc.

The specific look-and-feel of your menu should match with your game's esthetic. For this demo, we'll focus on the mechanics of making the menu work, and leave the styling choices to you.

Here's the node setup:

![alt](/godot_recipes/4.x/img/ui_radial_menu_01_4.png)



We're using a {{< gd-icon TextureButton >}}`TextureButton` as our root node. This is the button you'll click to open/close the menu.

The `Buttons` {{< gd-icon Control >}}`Control` node is the container where you'll place any number of items that you want. Make sure to set this control's **Mouse/Filter** property to "Ignore" so that it won't intercept mouse clicks.

For this example, we're using 9 buttons from our [Cooldown Button](/godot_recipes/4.x/ui/cooldown_button/) recipe.

Now, let's look at the script for the button:

```gdscript
extends TextureButton
class_name RadialMenuButton

export var radius = 120
export var speed = 0.25

var num
var active = false
```

Here are our variables. `radius` represents the "size" of the menu: the radius of the circle. `speed` is for the animation - smaller numbers are faster.

`num` keeps track of how many buttons there are, while `active` is a flag to track whether the menu is open or closed.

```gdscript
func _ready():
    $Buttons.hide()
    num = $Buttons.get_child_count()
    for b in $Buttons.get_children():
        b.position = position
```

In `_ready()` we start setting things up: hiding the menu buttons by default, and setting their positions to that of the main button.

Now connect the `pressed` signal of the main button.

```gdscript
func _on_pressed():
    disabled = true
    if active:
        hide_menu()
    else:
        show_menu()
```

Clicking the button shows/hides the menu. We also need to disable the button, or else clicking again *while* the tween is playing would restart it.

```gdscript
func _on_tween_finished():
    disabled = false
    if not active:
        $Buttons.hide()
```

When the tween animation finishes, toggle the active state and enable the button again.

Let's look at the `show_menu()` function:

```gdscript
func show_menu():
    $Buttons.show()
    var spacing = TAU / num
    active = true
    var tw = create_tween().set_parallel()
    tw.finished.connect(_on_tween_finished)
    for b in $Buttons.get_children():
        # Subtract PI/2 to align the first button  to the top
        var a = spacing * b.get_position_in_parent() - PI / 2
        var dest = Vector2(radius, 0).rotated(a)
        tw.tween_property(b, "position", dest, speed).from(Vector2.ZERO).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
        tw.tween_property(b, "scale", Vector2.ONE, speed).from(Vector2(0.5, 0.5)).set_trans(Tween.TRANS_LINEAR)
```

In this function we calculate the angle we need between each item (`spacing`). We then loop through each button and find its destination (`dest`) based on this angle and the chosen `radius`. For each button, we're tweening two properties, `position` and `scale`, to get our desired effect.

`hide_menu()` performs the exact opposite function:

```gdscript
func hide_menu():
    active = false
    var tw = create_tween().set_parallel()
    tw.finished.connect(_on_tween_finished)
    for b in $Buttons.get_children():
        tw.tween_property(b, "position", Vector2.ZERO, speed).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_IN)
        tw.tween_property(b, "scale", Vector2(0.5, 0.5), speed).set_trans(Tween.TRANS_LINEAR)
```

Here's the end result:

![alt](/godot_recipes/4.x/img/ui_radial_menu_02.gif)

## <i class="fas fa-code-branch"></i> Download This Project

Download the project's example code here: [https://github.com/godotrecipes/ui_radial_menu](https://github.com/godotrecipes/ui_radial_menu)

## Related recipes

- [UI: Cooldown Button](/godot_recipes/4.x/ui/cooldown_button/)