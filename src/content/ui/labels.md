---
title: "Labels"
weight: 1
draft: false
---

## Problem

You want to display some text on the screen.

## Solution

Sooner or later you're going to need to display some text on your screen. Examples include a title, countdown timer, score counter, and many others. For the majority of these, Godot's `Label` node is the answer.

### Working with fonts

Before you can start, you're going to need a font. We'll go into the full details of Godot's font support in a separate recipe, but for our purposes, let's assume you have a TTF or OTF font file. For using bitmap fonts, see the associated recipe.

{{% notice note %}}
For this example, we'll use "Roboto" - a popular free font, which you can find on [Google Fonts](https://fonts.google.com/specimen/Roboto). You can also download here: [Roboto_font.zip](/godot_recipes/files/Roboto_font.zip)
{{% /notice %}}

### Adding a Label

Add a new `Label` node to your scene. In the Inspector, you'll see the node's properties, most of which are self-explanatory (hover them with the mouse to see a description):

![alt](/godot_recipes/img/ui_label_properties.png)

Go ahead and add something in the *Text* field and experiment with how it looks. You'll notice there is a default font, but it's very plain (and small).

#### Adding a `DynamicFont`

To add your font in the Inspector, scroll down to and expand the *Custom Fonts* section. In the empty *Font* property, choose "New DynamicFont" and then click the new `DynamicFont` to expand it.

![alt](/godot_recipes/img/ui_label_font_properties.png)

Drag your font file (in this example we're using `Roboto-Medium.ttf`) into the *Font Data* property (or choose "Load" and navigate to the file). There are several properties to adjust but for now let's make *Size* a bit bigger.

Feel free to tinker with how the others affect the text appearance. For example, in the picture below, the second label has the *Filter* property enabled:

![alt](/godot_recipes/img/ui_label_font_filter.png)

#### Adjusting color

You can adjust the label's font color in the *Custom Colors* section. Here you can change *Font Color* as well as add a shadow color. Shadow properties are set in the *Custom Constants* section.

![alt](/godot_recipes/img/ui_label_font_colors.png)

### Dynamically changing text

If all you need in your scene is static text, then you're done. However, if you need to update the label dynamically, you can do so in code by using the `text` property.

For example, if we had a `Timer` node in our scene, we could do the following:

```gdscript
extends Control

var counter = 0

func _ready():
    $Label.text = str(counter)

func _on_Timer_timeout():
    counter += 1
    $Label.text = str(counter)
```

See the "related recipes" section for more examples of using labels and working with UI nodes.

<!-- {{% notice note %}}
Download the project file here: [screen_shake.zip](/godot_recipes/files/screen_shake.zip)
{{% /notice %}} -->

## Related recipes

<!-- - [Noise](/godot_recipes/math/noise/) -->


#### Like video?

<!-- {{< youtube C-Sn55e5wnk >}} -->