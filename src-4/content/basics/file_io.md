---
title: "Saving/loading data"
weight: 4
draft: false
ghcommentid: 13
---

## Problem

You need to save and load local data between game sessions.

## Solution

Godot's file I/O (input/output) system is based around the `FileAccess` object. You open a file by calling `FileAccess.open()`, which creates a new `FileAccess` object.

```gdscript
var file = FileAccess.open("user://myfile.name", FileAccess.READ)
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
var score_file = "user://score.save"

func save_score():
    var file = FileAccess.open(score_file, File.WRITE)
    file.store_var(highscore)
```

We're saving our score, but we need to be able to load it when the game starts:

```gdscript
func load_score():
    if FileAccess.file_exists(score_file):
        var file = FileAccess.open(score_file, FileAccess.READ)
        highscore = file.get_var()
    else:
        highscore = 0
```

Don't forget to check for the file's existence before attempting to read from it - it may not be there! If that's the case, you can use a default value.

### Saving objects

You can save more than just basic data types. Using `store_var()`'s `full_objects` parameter you can save any object, including custom ones. For example, let's say you have a custom object defined:

```gdscript
extends Node
class_name CustomObject

var a = 10

func say_hello():
    print("hello")
```

And then your save/load code would look like this:

```gdscript
var score_file = "user://score.save"
var c = CustomObject.new()

func save_to_file():
    var file = FileAccess.open(score_file, FileAccess.WRITE)
    file.store_var(c, true)


func load_from_file():
    if FileAccess.file_exists(score_file):
        var file = FileAccess.open(score_file, File.READ)
        c = file.get_var(true)
```

```gdscript
var c

func _ready():
    load_from_file()
    c.say_hello()
```

### What about JSON?

I see it very often (and some readers may be asking it already): "What if I want to use JSON to save my data?" This is my response:

> Don't use JSON for your save files!

While Godot has [JSON support](https://docs.godotengine.org/en/latest/classes/class_json.html), saving game data is not what JSON is for. JSON is a data *interchange* format - its purpose is to allow systems using different data formats and/or languages to exchange data between each other.

This means JSON has limitations that are negatives for you when it comes to saving your game data. JSON doesn't support many data types (no int vs. float, for example) so you have to do a lot of converting and validating to try and save/load your data. It's cumbersome and time consuming.

Don't waste your time. Using Godot's built-in serialization, you can store native Godot objects - Nodes, Resources, even Scenes - without any effort, which means less code and fewer errors.

### Wrapping up

This article just scratches the surface of what you can do with the `FileAccess` object. For the full list of available `FileAccess` methods, see the [FileAccess documentation](https://docs.godotengine.org/en/latest/classes/class_fileaccess.html).
