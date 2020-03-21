---
title: "Floating combat text"
weight: 12
draft: false
---

## Problem

You want units to display damage as floating numbers when hit.

![alt](/godot_recipes/img/fct_demo.gif)

## Solution

There are many ways to approach this problem. For example, you could use a bitmap font and build an image for each number out of its digits, then use a `Sprite` node to display and move it.

However, for this recipe, we'll use a `Label` node (named "FCT"). This will give us the flexibility to change the font, as well as making it easy to display the number as a string - or even other messages such as "miss".

Start with a `Label` node and add a `Tween` child. We'll use the `Tween` to animate the movement and the fade-out effect.

Set the Label's _Custom Fonts/Font_ property using your favorite font. In this example, we're using "Xolonium.ttf" with a font size of `28` and a black outline of `1` pixel. In the menu select "Layout->Center", and also set _Align_ and _Valign_ to "Center".

Add a script to the Label.

```gdscript
extends Label

func show_value(value, travel, duration, spread, crit=false):
```

When we spawn the floating text, we'll call this function to set the parameters:

- `value` - the number (or string) to display
- `travel` - a `Vector2` representing the direction of travel
- `duration` - how long the text will last
- `spread` - movement will be randomly spread across this arc
- `crit` - if `true`, indicates the damage was a "critical" hit

Here's what the function does:

```gdscript
    text = value
    var movement = travel.rotated(rand_range(-spread/2, spread/2))
    rect_pivot_offset = rect_size / 2
```

First, assign the value and randomize the movement based on the given spread (+/-90 degrees, for example). Since we may also be animating the scale, we set the `rect_pivot_offset` to the center of the control so that it will scale from the center.

```gdscript
    $Tween.interpolate_property(self, "rect_position",
            rect_position, rect_position + movement,
            duration, Tween.TRANS_LINEAR, Tween.EASE_IN_OUT)
    $Tween.interpolate_property(self, "modulate:a",
            1.0, 0.0, duration,
            Tween.TRANS_LINEAR, Tween.EASE_IN_OUT)
```

Next, we have two properties to interpolate: `rect_position` for the movement and `modulate.a` for the visibility.

```gdscript
    if crit:
        modulate = Color(1, 0, 0)
        $Tween.interpolate_property(self, "rect_scale",
            rect_scale*2, rect_scale,
            0.4, Tween.TRANS_BACK, Tween.EASE_IN)
```

If the hit is a critical, we'll also change the color and animate the scale for a bigger effect. Note, I've hardcoded this to be red, but you should probably make this a configurable value.

```gdscript
    $Tween.start()
    yield($Tween, "tween_all_completed")
    queue_free()
```

Finally, we start the Tween and wait for it to finish, then remove the Label.

### Floating text manager

Next we'll crate a small node to manage placing and spawning the floating text. This node will be attached to the game entities that you want to display floating text effects.

This is a `Node2D` named "FCTManager". It contains the following script:

```gdscript
extends Node2D

var FCT = preload("res://FCT.tscn")

export var travel = Vector2(0, -80)
export var duration = 2
export var spread = PI/2

func show_value(value, crit=false):
    var fct = FCT.instance()
    add_child(fct)
    fct.show_value(str(value), travel, duration, spread, crit)
```

Here you can expose the settings to the Inspector for convenient changes. The `show_value()` method here spawns the floating labels and sets their properties.

In your game unit, you'd attach an instance of this node, and position it wherever you want the text to appear. Then add something like the following to the unit's `take_damage()` method:

```gdscript
$FCTManager.show_value(dmg, crit)
```

## Wrapping up

Optimization: in the case where you have a very large number of enemies/bullets, you may experience some performance impact from repeatedly spawning and freeing floating text. In this case, you can spawn a fixed number of text objects in the manager, and show/hide them rather than freeing them at the end of the animation.

{{% notice note %}}
Download the project file here: [floating_text.zip](/godot_recipes/files/floating_text.zip)
{{% /notice %}}

{{% notice note %}}
Art in this demo by [Luis Zuno](https://www.patreon.com/ansimuz)
{{% /notice %}}

## Related recipes

- [UI: Labels](/godot_recipes/ui/labels/)
- [UI: Object Healthbars](/godot_recipes/ui/unit_healthbar/)

#### Like video?

