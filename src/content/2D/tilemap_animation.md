---
title: "TileMap: animated tiles"
weight: 5
draft: false
---

## Problem

You'd like to use animated tiles in your TileMap.

## Solution

The most straightforward way to approach this problem is to use the `AnimatedTexture` resource.

### Creating an AnimatedTexture

For this example, we'll use the following water tiles:

![alt](/godot_recipes/img/anim_tiles.png)

Download these images: [water.zip](/godot_recipes/files/water_tiles.zip)

Unzip the images into your project folder.
In the Inspector, click the "Create a new resource" button:

![alt](/godot_recipes/img/create_new_resource.png)

Choose `AnimatedTexture` and set the _Frames_ property to `5`. For each frame, drag the corresponding image to its _Texture_ property.

![alt](/godot_recipes/img/anim_texture_add.png)

You can adjust the overall animation's speed with the _Fps_ property, as well as each individual frame's _Delay Sec_.

Click the "Save" button to save the resource. Give it a name such as `water_anim.tres`.

### Using AnimatedTexture in a TileMap

Now that the `AnimatedTexture` is saved, it can be used in a `TileSet`. Open a new or existing `TileMap` and select its _Tile Set_ property. Click the button to add a new texture to the `TileSet`:

![alt](/godot_recipes/img/anim_tile_add.png)

Select the newly added texture and click "New Single Tile". Draw a box around the texture (use "Enable Snap" to make this easier).

![alt](/godot_recipes/img/anim_tile_select.png)

Now you can select the tile in your `TileMap` and draw with it just like any other tile.

![alt](/godot_recipes/img/anim_tile_draw.gif)

You can download a complete project of this example: [animated_tiles.zip](/godot_recipes/files/animated_tiles.zip)

## Related Recipes

- [TileMap: using autotile](http://kidscancode.org/godot_recipes/autotile_intro)