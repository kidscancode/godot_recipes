---
title: "Label"
draft: false
ghcommentid: 91
---

## {{< gd-icon Label >}}`Label`

{{< gd-icon Label >}}`Label` is a {{< gd-icon Control >}}`Control` node for displaying unformatted text, with options for controlling the text's alignment, wrapping, etc.

[API Documentation](https://docs.godotengine.org/en/stable/classes/class_label.html)

### Node properties

See the documentation for the full list, but here we'll review the most commonly used properties of the node:

* `text` - this property is the contents of the label. Change this in code to change what the label displays. If you're displaying numerical values, don't forget to convert them to strings! For example, to update a label with a given numerical value:

```gdscript
func update_label(value):
    $Label.text = str(value)
```

* `align` - this property allows you to align the text right/center/left.

* `percent_visible` - this property limits the number of characters displayed. For example setting `0.5` would show half of the contents. Try animating this value to create a "typewriter" effect.

### Adding a font

As soon as you type something into the *Text* property, you'll see that Godot's default font is probably too small for your needs. Here's how you can change the font:

First, make sure you have a TTF or OTF font file in your project folder.

In the {{< gd-icon Label >}}`Label`'s properties under "Custom Fonts", choose "New DynamicFont". `DynamicFont` is a Resource type that renders text from a given font.

Click on the "DynamicFont" you added, and under "Font/Font Data", choose "Load" and select your font file. You should also set the font's *Size*.