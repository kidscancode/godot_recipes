---
title: "Saving settings"
weight: 12
draft: false
pre: "12. "
---

## Saving settings

We've added three toggle properties in the game - which works fine - but the settings aren't preserved when we quit. We need to save those settings so the next time you run the game, they persist.

First, we'll define our settings file in `res://settings.gd`:

```gdscript
var settings_file = "user://settings.save"
```

Next, we'll add saving/loading functions for the three game settings that we want to save.

```gdscript
func save_settings():
    var f = File.new()
    f.open(settings_file, File.WRITE)
    f.store_var(enable_sound)
    f.store_var(enable_music)
    f.store_var(enable_ads)
    f.close()

func load_settings():
    var f = File.new()
    if f.file_exists(settings_file):
        f.open(settings_file, File.READ)
        enable_sound = f.get_var()
        enable_music = f.get_var()
        self.enable_ads = f.get_var()
        f.close()
```

Call `load_settings()` in `_ready()` and `save_settings()` at the end of `set_enable_ads()`. Also, in `Screens.gd` we need to save the state when the sound/music settings change, so add `settings.save_settings()` in each of those parts of the `match` statement.

Another problem we'll have is when the game starts, the icons in the settings menu won't reflect the state that we just loaded from the save file. We can set that in `register_buttons()` which is already looping through all buttons to connect their signals:

```gdscript
for button in buttons:
    button.connect("pressed", self, "_on_button_pressed", [button])
    match button.name:
        "Ads":
            if settings.enable_ads:
                button.text = "Disable Ads"
            else:
                button.text = "Enable Ads"
        "Sound":
            button.texture_normal = sound_buttons[settings.enable_sound]
        "Music":
            button.texture_normal = music_buttons[settings.enable_music]
```

## About screen

The other thing we'll add in this part is an "About" screen. This is where we'll let the player know what the game's all about and link to its license and to this page, since it is a tutorial game.

{{% notice warning %}}
Complying with license terms is very important. You can find out what's required by Godot here: [Complying with Licenses](https://docs.godotengine.org/en/latest/tutorials/legal/complying_with_licenses.html). Note that the art you're using may also require credit, links, or other acknowledgement.
{{% /notice %}}

To reach it, we've added a new button on the "Title" screen:

![alt](/godot_recipes/img/cj_12_01.png)

The button is setup just like the others - add it to the "buttons" group so that it will get registered. In the `Screens.gd`, add another `match` for this button's name:

```gdscript
"About":
    change_screen($AboutScreen)
```

Here's what the "About" screen looks like:

![alt](/godot_recipes/img/cj_12_02.png)

Extending "BaseScreen.tscn", we've added a `TextEdit` and another container for a single "Home" button.

In the `TextEdit`, set _BBCode_ enabled and put the following in the _Text_ property:

```text
[center][u]Circle Jump[/u]

[img]res://assets/images/godot_logo.png[/img][/center]

Circle Jump is an open source tutorial game made with the Godot Game Engine. You can find the tutorial and the game's source code here:

[url=https://github.com/kidscancode/circle_jump]Circle Jump Source[/url]

Copyright © 2019 KidsCanCode

[url=https://github.com/kidscancode/circle_jump/blob/master/LICENSE]License Information[/url]
```

{{% notice note %}}
See [BBCode in RichTextLabel](https://docs.godotengine.org/en/latest/tutorials/gui/bbcode_in_richtextlabel.html) for details on how BBCode formatting works.
{{% /notice %}}

To allow clicking on URLs, connect the `meta_clicked` signal of the `TextEdit`:

```gdscript
func _on_TextEdit_meta_clicked(meta):
    OS.shell_open(meta)
```

----------

#### Follow this project on Github:

[https://github.com/kidscancode/circle_jump](https://github.com/kidscancode/circle_jump)

#### Do you prefer video?

{{< youtube h5987aIENqs >}}