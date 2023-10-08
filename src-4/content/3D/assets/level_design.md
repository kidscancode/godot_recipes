---
title: "Designing a Level"
weight: 15
draft: true
---

## Problem

## Solution

We have several options to consider for designing our level:

### Options

#### GridMap

Using the built-in {{< gd-icon GridMap >}}`GridMap` node allows you to layout meshes in a grid in the editor. It's similar in concept to the 2D {{< gd-icon TileMap >}}`TileMap` node, though with less functionality.

This option has a few drawbacks:

1. The GridMap functionality in Godot is fairly rudimentary (especially compared to its 2D equivalent) and hasn't been updated in some time.
1. Placement is limited to a fixed grid layout, so you don't have as much control over how your meshes are placed.

#### Directly placing models

Alternatively, you can turn on grid snapping in the editor and just drag scenes directly from the **FileSystem** tab to place them. This has the advantage of being more flexible than `GridMap`, although a bit more manual in how you go about placing objects.

#### External tool

A third option is to use a separate tool to design your levels and then import them to Godot. [Blender](https://blender.org/) is a very popular choice for this. Odds are, if you're making your own 3D assets, you're probably already using Blender to do your modeling.

Using Blender, you can use your familiar modeling tools to create your level and then export that as a `GLTF` for Godot. You can even use Godot [Import Hints](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_scenes.html#import-hints) to have Godot automatically create collision shapes, lights, etc in your imported level.

You can even use Godot's built-in [Blender support](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_scenes.html#importing-blend-files-directly-within-godot) to make this even easier. Changes to your `.blend` file will instantly appear in your Godot project.

### Interactable objects

#### Door

Find the `wall_doorway_scaffold.glb` file in the **FileSystem** and double-click to check the import settings and see that you've created a static collision for both meshes (the door frame and the door). Right-click to create a "New Inherited Scene".

Add an {{< gd-icon AnimationPlayer >}}`AnimationPlayer` node, which we'll use to animate the door opening. Your node tree should look like this:

**SS**

The "wall_doorway_scaffold_door" is the mesh that we want to rotate.
We want to be able to open the door in either direction, so we're going to create two animations. Both of them rotate the door's **Y** rotation by `90°`, but "open+" opens in the **+Z** direction and "open-" does the opposite. This way, when the player interacts with the door, we can open it away from them, no matter which side they're on.

Add the {{< gd-icon StaticBody3D >}}`StaticBody3D` child of the door to a group called "interactable". This is the object the player is going to detect. If it's in that group, the player will call `interact()` on it.

Add a script to the door scene:

```gdscript
extends Node3D

var open = false

func interact(dir):
    if open:
        return
    if dir.dot(global_transform.basis.z) < 0:
        $AnimationPlayer.play("open+")
    else:
        $AnimationPlayer.play("open-")
    open = true
```

#### Chest

Find the `chest.glb` file in the **FileSystem** and double-click to check the import settings and see that you've created a static collision for both meshes (the chest body and lid). Right-click to create a "New Inherited Scene".

Add an {{< gd-icon AnimationPlayer >}}`AnimationPlayer` and create an animation of the chest lid opening.

Similar to the door, add the static body to the "interactable" group and an `interact()` function in its script:

```gdscript
extends Node3D

func interact(_dir):
    $AnimationPlayer.play("open")
```
