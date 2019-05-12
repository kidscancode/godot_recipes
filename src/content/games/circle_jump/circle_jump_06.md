---
title: "Sound and Colors"
weight: 6
draft: false
pre: "06. "
---

## Settings singleton

First, we'll add a new script by choosing _File -> New Script_ in the script tab. Name the script `settings.gd`.

In this script we'll place the configuration settings for the game.

```gdscript
var enable_sound = true
var enable_music = true

var circles_per_level = 5
```

Add the script as an autoload by opening "Project Settings" and selecting the "Autoloads" tab. Click the folder to load the script and then click "Add".

![alt](/godot_recipes/img/cj_06_01.png)

## Adding sound

To play sounds, we'll be adding several `AudioStreamPlayer` nodes to different scenes.

- First, add one to the `Main` scene and name it "Music". For its _Stream_ property use `res://assets/audio/Music_Light-Puzzles.ogg`.

- To the `Screens` scene, add another called "Click", which will play when we tap buttons. Use `menu_click.wav` from the assets folder.

- In the `Circle` scene, add an audio player named "Beep" and use the `89.ogg` sound file.

- Finally, on the Jumper, we need two sound effects: "Jump" and "Capture". Use `70.ogg` and `88.ogg`, respectively.

Now to play the sounds, we can call their `play()` methods. Add this to `Main.new_game()`:

```gdscript
if settings.enable_music:
    $Music.play()
```

 and `Main._on_Jumper_died()`:

 ```gdscript
 if settings.enable_music:
    $Music.stop()
 ```

In `Screens.gd` add this to `_on_button_pressed()`:

```gdscript
if settings.enable_sound:
    $Click.play()
```

On the circle, we want to play the `Beep` sound when a limited circle completes a full orbit. This is in `check_orbits()`:

```gdscript
current_orbits -= 1
if settings.enable_sound:
    $Beep.play()
```

And in `Jumper.gd`, we add the sounds like so:

```gdscript
func jump():
    target.implode()
    target = null
    velocity = transform.x * jump_speed
    if settings.enable_sound:
        $Jump.play()

func _on_Jumper_area_entered(area):
    target = area
    velocity = Vector2.ZERO
    emit_signal("captured", area)
    if settings.enable_sound:
        $Capture.play()
```

Run the game and test that you hear all the sounds as expected.

## Sound settings

Now that we have sound working, we can connect the buttons on the "Settings" screen that can toggle sound and music.

The button appearance needs to be changed to match the current on/off state of the property. We'll load the textures first so that we can assign them as needed:

```gdscript
var sound_buttons = {true: preload("res://assets/images/buttons/audioOn.png"),
                    false: preload("res://assets/images/buttons/audioOff.png")}
var music_buttons = {true: preload("res://assets/images/buttons/musicOn.png"),
                    false: preload("res://assets/images/buttons/musicOff.png")}
```

Right now, we're not handling the buttons when they're pressed. The issue is that we're currently passing the button's name, which won't let us change its texture. Instead, we're going to refactor `register_buttons()` to pass a reference to the button itself:

```gdscript
button.connect("pressed", self, "_on_button_pressed", [button])
```

Then we can update `_on_button_pressed()` like so:

```gdscript
func _on_button_pressed(button):
    if settings.enable_sound:
        $Click.play()
    match button.name:
        "Home":
            change_screen($TitleScreen)
        "Play":
            change_screen(null)
            yield(get_tree().create_timer(0.5), "timeout")
            emit_signal("start_game")
        "Settings":
            change_screen($SettingsScreen)
        "Sound":
            settings.enable_sound = !settings.enable_sound
            button.texture_normal = sound_buttons[settings.enable_sound]
        "Music":
            settings.enable_music = !settings.enable_music
            button.texture_normal = music_buttons[settings.enable_music]
```

## Color themes

We're also goign to add a way to have different color schemes. These can change in different ways: perhaps as a settings option, or they change as the player gets to higher levels.

We'll store the color scheme data in a dictionary, with the keys being the "name" of the scheme. Each color scheme will also be a dictionary, with the keys denoting the game component that will use that color.

Add this to `settings.gd`:

```gdscript
var color_schemes = {
    "NEON1": {
        'background': Color8(0, 0, 0),
        'player_body': Color8(203, 255, 0),
        'player_trail': Color8(204, 0, 255),
        'circle_fill': Color8(255, 0, 110),
        'circle_static': Color8(0, 255, 102),
        'circle_limited': Color8(204, 0, 255)
    },
    "NEON2": {
        'background': Color8(0, 0, 0),
        'player_body': Color8(246, 255, 0),
        'player_trail': Color8(255, 255, 255),
        'circle_fill': Color8(255, 0, 110),
        'circle_static': Color8(151, 255, 48),
        'circle_limited': Color8(127, 0, 255)
    },
    "NEON3": {
        'background': Color8(0, 0, 0),
        'player_body': Color8(255, 0, 187),
        'player_trail': Color8(255, 148, 0),
        'circle_fill': Color8(255, 148, 0),
        'circle_static': Color8(170, 255, 0),
        'circle_limited': Color8(204, 0, 255)
    }
}

var theme = color_schemes["NEON1"]
```

Now on each object, we need to set the colors based on the settings property.

For the circle, the color is set using the shader material resource. Because resources are shared, that means that changing one circle's color would change them all. Let's make each circle's material unique to avoid this:

```gdscript
$Sprite.material = $Sprite.material.duplicate()
$SpriteEffect.material = $Sprite.material
```

The color of the circle is determined by what mode it's using, so `set_mode()` is where we'll choose the color:

```gdscript
func set_mode(_mode):
    mode = _mode
    var color
    match mode:
        MODES.STATIC:
            $Label.hide()
            color = settings.theme["circle_static"]
        MODES.LIMITED:
            current_orbits = num_orbits
            $Label.text = str(current_orbits)
            $Label.show()
            color = settings.theme["circle_limited"]
    $Sprite.material.set_shader_param("color", color)
```

Then in the `_draw()` function where we're filling in the limited circle, replace the red color with `settings.theme["circle_fill"]`.

For the player, set the color in its `_ready()`:

```gdscript
func _ready():
    $Sprite.material.set_shader_param("color", settings.theme["player_body"])
    $Trail/Points.default_color = settings.theme["player_trail"]
```

In the next part, we'll add a movement to the circles.

----------

#### Follow this project on Github:

[https://github.com/kidscancode/circle_jump](https://github.com/kidscancode/circle_jump)

#### Do you prefer video?

{{< youtube 8yvVej_fLMs >}}