---
title: "Autoloads/ Singletons"
weight: 2
draft: true
ghcommentid: 98
tags: []
---

## Problem

Your game has data that is needed by more than one scene. Your player's score, for example, needs to be accessed by various game objects (to increase it) and by the HUD (to display it). Furthermore, if you're changing scenes using `change_scene()`, you don't want that data to be lost when the old scene is freed.

## Solution

To solve this problem, Godot provides the concept of an *Autoload*. This is a scene (or script) that you want the engine to automatically load at runtime. This scene's node(s) will be added to the root viewport before any other scenes are loaded.

{{% notice note %}}
If you autoload a script, Godot will create a {{< gd-icon Node >}} `Node` and attach the script to it.
{{% /notice %}}

### Adding Autoloads

You can create any number of autoloads in your game by opening **Project Settings** and clicking the "AutoLoad" tab:

![alt](/godot_recipes/img/autoload_01.png)

Click the folder button to navigate to the file you want to autoload, set an optional "Node Name" (the name it'll have in the scene tree), and click the "Add" button.

For example, as described in the [Audio Manager](/godot_recipes/audio/audio_manager/) recipe, here's the audio manager scene added as an autoload:

![alt](/godot_recipes/img/autoload_02.png)

{{% notice tip %}}
If you have multiple autoloads they'll be added in the order listed. You can drag-and-drop them to change the order.
{{% /notice %}}

And when the game is run, looking at the remote scene tree will show you where the autoload was added, as a direct child of the root viewport:

![alt](/godot_recipes/img/autoload_03.png)

### Singleton

As an option when adding an autoload, you can declare it as a *singleton* by checking the "Enable" box. This makes the *Name* of the autoload a globally-registered value, so that you can refer to it from anywhere in your game.

For example, by loading the audio manager above and choosing the singleton option, you can now access it in any script:

```gdscript
AudioManager.play("res://path/to/sound")
```

## Wrapping up

Autoloads/singletons are useful in many situations you may encounter. For example:

- Making your UI an autoload lets you keep it always present, hiding/showing it whenever needed, regardless of what scene you currently have loaded.
- Persistent data, such as player score can be kept as a property of your singleton and accessed from anywhere.
- Keep global configuration data in a singleton so that any node can easily find it upon being instanced.

## Related recipes

- [Audio Manager](/godot_recipes/audio/audio_manager/)
- [Displaying Debug Data](/ui/debug_overlay/)

<!-- #### Like video?

{{< youtube  >}} -->