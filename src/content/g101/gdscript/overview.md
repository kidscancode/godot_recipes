+++
title = "Overview"
date = 2019-04-09T20:23:50-07:00
weight = 1
draft = true
pre = "01. "
+++

We've talked about how Godot uses nodes and scenes to create the structure of a game, and looked at some of the types of nodes you can use, such as the Sprite node I have here. But all this isn't effective if you can't make the nodes move or interact with the player or each other.

Put another way, we need to define the "rules" of our game. In developer terms: the "game logic". The way we do that is through scripting.

GDScript is Godot's builtin language for scripting and interacting with nodes. The [GDScript documentation](https://docs.godotengine.org/en/latest/getting_started/scripting/gdscript/gdscript_basics.html) on the Godot website is good, and I highly recommend taking the time to read through it.

Writing scripts and attaching them to nodes is how you build behavior and game mechanics into your game. For example, if you want a sprite to move across the screen, you'll add a script that tells it how fast, in what direction, and so on.

GDScript uses a syntax that is based on Python's, but it's optimized and integrated into the Godot engine, which makes it easy to get started with. You can think of it as the coding version of using the Inspector - GDScript knows all about Godot nodes and how to access them.

Let's make our first script. Remember, any node can have a script attached to it. Right-click on the sprite node, and choose "Add Script". You can also click the button next to the search box:

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
#	pass
```

The first line of every script says "extends" followed by a node type. This matches the node the script is attached to.  Because this script extends Sprite, it will be able to access and manipulate all the properties of the Sprite node. We are *extending* the functionality of a basic Sprite node.

After that is where you're going to define all the variables you will use in the script, the "member variables". You define variables with the 'var' keyword - as you can see by the comment examples. Let's get rid of the comments and talk about this next piece.

Now we see a function called `_ready()`. In GDScript you define a function with the keyword "func". The `_ready()` function is a special one that Godot looks for and runs whenever a node is added to the tree, for example when we hit "Play".

Let's say that when the game starts, we want to make sure the Sprite goes to a particular location. We want to set the "Position" property. Notice that it's under "Node2D" - that means this is a property that *any* Node2D type node will have, not just Sprites.

How do we set the property?

Godot has a great built-in help/reference tool. Click on "Classes" at the top of the Script window and search for Node2D and you'll see a help page showing you all the properties and methods the class has available. Looking down a bit you can see `position` in the "Member Variables" section - that's the one we want. It also tells us the property is of the type "Vector2".

Another way to find the name of the property is by hovering over it in the Inspector.

Let's go back to our script and use that property - notice how the editor is making suggestions as I type. Godot uses vectors for lots of things, and we'll talk more about them later. For now, let's type Vector2, and the hint tells us to put two floats for `x` and `y`.

### A quick note about learning

Beginners often ask "How do you memorize all these commands?" It's not a matter of memorization, it's about practice. As you use things more, the things you do frequently will "stick" and become automatic. Until then, it's a great idea to keep the reference docs handy. Use the search function or, if you have multiple monitors, keep a copy of the web docs open on the side to refer to.