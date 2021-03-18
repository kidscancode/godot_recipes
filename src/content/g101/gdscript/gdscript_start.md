---
title: "GDScript: Getting started"
weight: 1
draft: true
ghcommentid:
---

## Overview

Writing scripts and attaching them to nodes and other objects is how you build behavior and game mechanics into your game. For example, a `Sprite` node automatically displays an image, but to move it across the screen, you'll add a script that tells it how fast, in what direction, and so on.

You can think of it as the coding version of using the Inspector - GDScript knows all about Godot nodes and how to access them.

GDScript is Godot's built-in language for scripting and interacting with nodes. The [GDScript documentation](https://docs.godotengine.org/en/latest/getting_started/scripting/gdscript/gdscript_basics.html) on the Godot website is a great place to get an overview of the language, and I highly recommend taking the time to read through it.

**Is GDScript Python?**

You'll often read comments to the effect that "GDScript is based on Python". That's somewhat misleading; GDScript uses a syntax that's modeled on Python's, but it's a distinct language that's optimized for and integrated into the Godot engine. That said, if you already know some Python, you'll find GDScript feels very familiar.

{{% notice warning %}}
Many tutorials (and Godot in general) assume that you have at least *some* programming experience already. If you've never coded before, you'll likely find learning Godot to be a challenge. Learning a game engine is a large task
on its own; learning to code at the same time means you're taking on a lot. If
you find yourself struggling with the code in this section, you may find that working through an introductory Python lesson will help you grasp the basics.
{{% /notice %}}

## Structure of a script

The first line of any GDScript file must be `extends <Class>`, where `<Class>` is some existing built-in or user-defined class. For example, if you're attaching a script to a `KinematicBody2D` node, then your script would start with `extends KinematicBody2D`. This states that your script is taking all the functionality of the built-in `KinematicBody2D` object and *extending* it with additional functionality created by you.

In the rest of the script, you can define any number of variables ("class properties") and functions ("class methods").

## Creating a script

Let's make our first script. Remember, any node can have a script attached to it.

Open the editor and add a `Sprite` node to empty scene. Right-click on the new node, and choose "Attach Script". You can also click the button next to the search box.

![alt](/godot_recipes/img/gds_01_attach.png?width=250)

Next you need to decide where you want the script saved and what to call it. If you've named the node, the script will automatically be named to match it.

Now the script editor window opens up, and this is your new, empty sprite script. Godot has automatically included some lines of code, as well as some comments describing what they do.

```gdscript
extends Sprite

# Declare member variables here. Examples:
# var a = 2
# var b = "text"

# Called when the node enters the scene tree for the first time.
func _ready():
    pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#   pass
```

Since the script was added to a `Sprite`, the first line is automatically set to `extends Sprite`.  Because this script extends Sprite, it will be able to access and manipulate all the properties and functions that a Sprite node provides.

After that is where you're going to define all the variables you will use in the script, the "member variables". You define variables with the 'var' keyword - as you can see by the comment examples.

Go ahead and delete the comments and let's talk about this next piece.

Now we see a function called `_ready()`. In GDScript you define a function with the keyword "func". The `_ready()` function is a special one that Godot looks for and runs whenever a node is added to the tree, for example when we hit "Play".

Let's say that when the game starts, we want to make sure the Sprite goes to a particular location. In the Inspector, we want to set the _Position_ property. Notice that it's in the section called "Node2D" - that means this is a property that *any* Node2D type node will have, not just Sprites.

**img here**

How do we set the property in code? One way to find the name of the property is by hovering over it in the Inspector.

![alt](/godot_recipes/img/gds_01_01.png)

Godot has a great built-in help/reference tool. Click on "Classes" at the top of the Script window and search for Node2D and you'll see a help page showing you all the properties and methods the class has available. Looking down a bit you can see `position` in the "Member Variables" section - that's the one we want. It also tells us the property is of the type "Vector2".

![alt](/godot_recipes/img/gds_01_02.png)

Let's go back to the script and use that property:

```gdscript
func _ready():
    position = Vector2(100, 150)
```

Notice how the editor is making suggestions as you type. Godot uses vectors for lots of things, and we'll talk more about them later. For now, let's type Vector2, and the hint tells us to put two floats for `x` and `y`.

Now we have a script that says "When this Sprite starts, set its position to `(100, 150)`". We can try this out by pressing the "Play Scene" button.

![alt](/godot_recipes/img/gds_01_03.png)

{{% notice tip %}}
When first learning to code, beginners often ask "How do you memorize all these commands?" It's not a matter of memorization, it's about practice. As you use things more, the things you do frequently will "stick" and become automatic. Until then, it's a great idea to keep the reference docs handy. Use the search function whenever you see something you don't recognize. If you have multiple monitors, keep a copy of the [web docs](https://docs.godotengine.org/en/latest/) open on the side for quick reference.
{{% /notice %}}


## Wrapping up

Congratulations on making your first script in GDScript! Before moving on, make sure you understand everything we did in this step. In the next part, we'll add some more code to move the Sprite around the screen.