---
title: "Radial Popup Menu"
weight: 13
draft: false
ghcommentid: 63
---

## Problem

You want a radial menu - a ring of buttons that pops up for you to choose an option.

## Solution

Radial menus are used in a variety of games to allow access to a selection of buttons. For example, clicking on an NPC in a game allows you to choose what action to take: talk, inspect, attack, etc.

The specific look-and-feel of your menu should match with your game's esthetic. For this demo, we'll focus on the mechanics of making the menu work, and leave the styling choices to you.

Here's the node setup:

![alt](/godot_recipes/3.x/img/ui_radial_menu_01.png)



We're using a {{< gd-icon TextureButton >}}`TextureButton` as our root node. This is the button you'll click to open/close the menu.

The "Buttons" {{< gd-icon Control >}}`Control` node is the container where you'll place any number of items that you want. For this example, we're using some buttons from our [Cooldown Button](/godot_recipes/3.x/ui/cooldown_button/) recipe.

Finally, we have a {{< gd-icon Tween >}}`Tween` to handle animating the menu opening/closing.

Now, let's look at the script for the button:

```gdscript
extends TextureButton

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
        b.rect_position = rect_position
```

In `_ready()` we start setting things up: hiding the menu buttons by default, and setting their positions to that of the main button.

Now connect the `pressed` signal of the main button, and the `tween_all_completed` signal of the `Tween`.

```gdscript
func _on_StartButton_pressed():
    disabled = true
    if active:
        hide_menu()
    else:
        show_menu()
```

Clicking the button show/hides the menu. We also need to disable the button, or else clicking again *while* the tween is playing would restart it.

```gdscript
func _on_Tween_tween_all_completed():
    disabled = false
    active = not active
    if not active:
        $Buttons.hide()
```

When the tween animation finishes, toggle the active state and enable the button again.

Let's look at the `show_menu()` function:

```gdscript
func show_menu():
    var spacing = TAU / num
    for b in $Buttons.get_children():
        # Subtract PI/2 to align the first button  to the top
        var a = spacing * b.get_position_in_parent() - PI / 2
        var dest = b.rect_position + Vector2(radius, 0).rotated(a)
        $Tween.interpolate_property(b, "rect_position",
                b.rect_position, dest, speed,
                Tween.TRANS_BACK, Tween.EASE_OUT)
        $Tween.interpolate_property(b, "rect_scale",
                Vector2(0.5, 0.5), Vector2.ONE, speed,
                Tween.TRANS_LINEAR)
    $Buttons.show()
    $Tween.start()
```

In this function we calculate the angle we need between each item (`spacing`). We then loop through each button and find its destination (`dest`) based on this angle and the chosen `radius`. For each button, we're tweening two properties, `rect_position` and `rect_scale`, to get our desired effect.

`hide_menu()` performs the exact opposite function:

```gdscript
func hide_menu():
    for b in $Buttons.get_children():
        $Tween.interpolate_property(b, "rect_position", b.rect_position,
                rect_position, speed, Tween.TRANS_BACK, Tween.EASE_IN)
        $Tween.interpolate_property(b, "rect_scale", null,
                Vector2(0.5, 0.5), speed, Tween.TRANS_LINEAR)
    $Tween.start()
```

Here's the end result:

![alt](/godot_recipes/3.x/img/ui_radial_menu_02.gif)

{{% notice note %}}
Download the project file here: [ui_radial_menu.zip](/godot_recipes/3.x/files/ui_radial_menu.zip)
{{% /notice %}}

## Related recipes

- [UI: Cooldown Button](/godot_recipes/3.x/ui/cooldown_button/)