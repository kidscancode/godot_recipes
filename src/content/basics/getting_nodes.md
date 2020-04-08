---
title: "Understanding node paths"
weight: 2
draft: false
---

## Problem

It's probably the most common error seen in the Godot help channels: an invalid node reference. Most often, it results in the following error:

> Invalid get index 'position' (on base: 'null instance').

## Solution

It's that last part, the "null instance", that's the source of this problem, and the main source of confusion for Godot beginners.

The way to avoid this problem is to understand the concept of *node paths*.

### Understanding node paths

The scene tree is made of nodes, which are connected together in parent-child relationships. A node path is the path it takes to get from one node to another by moving through this tree.

As an example, let's take a simple "Player" scene:

![alt](/godot_recipes/img/node_paths_01.png)

The script for this scene is on the `Player` node. If the script needs to call `play()` on the `AnimatedSprite` node, it needs a reference to that node:

```gdscript
get_node("AnimatedSprite").play()
```

The argument of the `get_node()` function is a string representing the *path* to the desired node. In this case, it's a child of the node the script is on. If the path you give it is invalid, you'll get the dreaded `null instance` error (as well as "Node not found").

Getting a node reference with `get_node()` is such a common situation that GDScript has a shortcut for it:

```gdscript
$AnimatedSprite.play()
```

{{% notice info %}}
`get_node()` returns a *reference* to the desired node.
{{% /notice %}}

Let's look at a more complex scene tree:

![alt](/godot_recipes/img/node_paths_02.png)

If the script on `Main` needs to access `ScoreLabel` it can do so with this path:

```gdscript
get_node("HUD/ScoreLabel").text = "0"
# or using the shortcut:
$HUD/ScoreLabel.text = "0"
```

{{% notice tip %}}
When using `$` notation, the Godot editor will autocomplete paths for you. You can also right-click on a node in the Scene tab and choose "Copy Node Path".
{{% /notice %}}

What if the node you want to access is higher in the tree? You can use `get_parent()` or `".."` to reference the parent node. In the above example tree, to get the `Player` node from the `ScoreLabel`:

```gdscript
get_node("../../Player")
```

Let's break that down. The path `"../../Player"` means "get the node that's up one level (`HUD`), then one more level (`Main`), then its child `Player`".

{{% notice tip %}}
Does this seem familiar? Node paths work exactly like directory paths in your operating system. The `/` character indicates the parent-child relationship, and `..` means "up one level".
{{% /notice %}}

### Relative vs absolute paths

The above examples all use *relative* paths - meaning they start at the current node and follow the path to the destination. Node paths can also be absolute, starting from the root node of the scene.

For example, the absolute path to the player node is:

```gdscript
get_node("/root/Main/Player")
```

`/root`, which can also be accessed with `get_tree().root` is *not* the root node of your scene. It's the Viewport node that is always present by default in the SceneTree.

### A warning

While the above examples work just fine, there are some things you should be aware of that may cause problems later. Imagine the following situation: the `Player` node has a `health` property, which you want to display in a `HealthBar` node somewhere in your UI. You might write something like this in the player's script:

```gdscript
func take_damage(amount):
    health -= amount
    get_node("../Main/UI/HealthBar").text = str(health)
```

While this may work fine at first, it is *brittle*, meaning it can break easily. There are two main problems with this kind of arrangement:

1. You can't test the player scene independently. If you run the player scene by itself or in a test scene that doesn't have a UI, the `get_node()` line will cause a crash.
2. You can't change your UI. If you decide to rearrange or redesign your UI, the path will no longer be valid and you have to change it.

For this reason, you should try to avoid using node paths that go *up* the scene tree. In the above situation, if the player instead emitted a signal when the health changed, the UI could listen for that signal to update itself. You could then rearrange and separate nodes without fear of breaking your game.

## Wrapping up

Once you understand how to use node paths, you'll see how easy it is to reference any node you need. And put a stop to seeing those `null instance` error messages.

<!-- ## Related Recipes

- [Using KinematicBody2D](/godot_recipes/physics/godot3_kinematic2d/) -->