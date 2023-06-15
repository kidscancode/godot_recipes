---
title: "Saving/loading data"
weight: 4
draft: false
ghcommentid: 13
---

## Problem

You need to save and load local data between game sessions.

## Solution

Godot's file I/O (input/output) system is based around the `FileAccess` object. You open a file by calling `open()`.

```gdscript
var file = FileAccess.open("user://myfile.name", File.READ)
```

{{% notice warning %}}
User data should only be stored in the `user://` path. While `res://` can be used when running from the editor, when your project is exported, the `res://` path becomes read-only.
{{% /notice %}}

The second argument after the file path is the "Mode Flag", which can be one of the following:

* FileAccess.READ - Open for reading.
* FileAccess.WRITE - Open for writing. Creates the file if it doesn't exist and truncates if it does.
* FileAccess.READ_WRITE - Open for reading and writing. Doesn't truncate the file.
* FileAccess.WRITE_READ - Open for reading/writing. Creates the file if it doesn't exist and truncates if it does.

### Storing data

You can save data using its specific data type (`store_float()`, `store_string()`, etc.), or using the generic `store_var()`, which will use Godot's built-in serialization to encode your data, including complex data like objects (more on this later).

Let's start with a small example: saving the player's high score. We can write a function that we can call whenever the score needs to be saved:

```gdscript
var save_path = "user://score.save"

func save_score():
    var file = FileAccess.open(save_path, FileAccess.WRITE)
    file.store_var(highscore)
```

We're saving our score, but we need to be able to load it when the game starts:

```gdscript
func load_score():
    if FileAccess.file_exists(save_path):
        print("file found")
        var file = FileAccess.open(save_path, FileAccess.READ)
        highscore = file.get_var()
    else:
        print("file not found")
        highscore = 0
```

Don't forget to check for the file's existence before attempting to read from it - it may not be there! If that's the case, you can use a default value.

You can `store_var()` and `get_var()` as many times as you need for any number of values.

### Saving Resources

The above technique works great when all you need to save are a few values. For more complex situations, you can save your data in a Resource, just like Godot does. Godot saves all its data Resources as `.tres` files (Animations, TileSets, Shaders, etc.) and you can too!

To save and load Resources, use the `ResourceSaver` and `ResourceLoader` Godot classes.

For this example, let's say you have all the data about your character's stats stored in a Resource like this:

```gdscript
extends Resource
class_name PlayerData

var level = 1
var experience = 100

var strength = 5
var intelligence = 3
var charisma = 2
```

You can then save and load like so:


```gdscript
func load_character_data():
    if ResourceLoader.exists(save_path):
        return load(save_path)
    return null

func save_character_data(data):
    ResourceSaver.save(data, save_path)
```

Resources can contain subresources, so you could have your player's inventory Resource included as well, and so on.

### What about JSON?

I see it very often (and some readers may be asking it already): "What if I want to use JSON to save my data?" This is my response:

> Don't use JSON for your save files!

While Godot has [JSON support](https://docs.godotengine.org/en/latest/classes/class_json.html), saving game data is not what JSON is for. JSON is a data *interchange* format - its purpose is to allow systems using different data formats and/or languages to exchange data between each other.

This means JSON has limitations that are negatives for you when it comes to saving your game data. JSON doesn't support many data types (no int vs. float, for example) so you have to do a lot of converting and validating to try and save/load your data. It's cumbersome and time consuming.

Don't waste your time. Using Godot's built-in serialization, you can store native Godot objects - Nodes, Resources, even Scenes - without any effort, which means less code and fewer errors.

There's a reason that Godot itself doesn't use JSON for saving scenes and resources.

### Wrapping up

This article just scratches the surface of what you can do with `FileAccess`. For the full list of available `FileAccess` methods, see the [FileAccess documentation](https://docs.godotengine.org/en/stable/classes/class_fileaccess.html).