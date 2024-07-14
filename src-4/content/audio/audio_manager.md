---
title: "Audio Manager"
weight: 1
draft: false
ghcommentid: 80
---

## Problem

You've tried adding an {{< gd-icon AudioStreamPlayer >}}`AudioStreamPlayer` to your mob/coin/etc. to play when the object dies or is collected. But the problem is that when you remove the object, the audio player goes with it, chopping off the sound. You need an easier way to manage playing audio.

## Solution

We'll solve this problem with a node that is available from anywhere in the SceneTree. This node manages a set of {{< gd-icon AudioStreamPlayer >}}`AudioStreamPlayer` nodes and a queue of sound streams to play.

Create a new script in the script editor:

```gdscript
extends Node

var num_players = 8
var bus = "master"

var available = []  # The available players.
var queue = []  # The queue of sounds to play.


func _ready():
    # Create the pool of AudioStreamPlayer nodes.
    for i in num_players:
        var player = AudioStreamPlayer.new()
        add_child(player)
        available.append(player)
        player.finished.connect(_on_stream_finished.bind(player))
        player.bus = bus


func _on_stream_finished(stream):
    # When finished playing a stream, make the player available again.
    available.append(stream)


func play(sound_path):
    queue.append(sound_path)


func _process(delta):
	# Play a queued sound if any players are available.
    if not queue.empty() and not available.empty():
        available[0].stream = load(queue.pop_front())
        available[0].play()
        available.pop_front()
```

Set this script as an autoload in Project Settings. Give it an easily recognizable name, such as "AudioManager".

![alt](/godot_recipes/4.x/img/audio_mgr_01.png)

Anywhere in your project that you want to play a sound, use:

```gdscript
AudioManager.play("res://path/to/sound")
```

Remember, you can drag sound files directly into the text editor to paste the file path.

{{% notice note %}}
This audio manager is adapted with thanks from [SFXPlayer by TheDuriel]
(https://github.com/TheDuriel/DurielsGodotUtilities).
{{% /notice %}}

### Example project

Below you can download an example project showing the use of the audio manager node. This project reads a folder full of audio files and generates a grid of buttons. Click the button to play the sound.

![alt](/godot_recipes/4.x/img/audio_mgr_02.png)

At the top, you can see the audio manager's live statistics.

<!-- ## Related recipes
 -->


<!-- #### Like video?

{{< youtube 7axJJYont6Y >}} -->

## <i class="fas fa-code-branch"></i> Download This Project

Download the project's example code here: [https://github.com/godotrecipes/audio_manager](https://github.com/godotrecipes/audio_manager)
