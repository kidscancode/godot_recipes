---
title: "TileMap: detecting tiles"
weight: 1
draft: false
---

## Problem

You have a `KinematicBody2D` character colliding with a `TileMap`, and you want to know which tile it collided with.

## Solution

When a `KinematicBody2D` collides, the collision data is returned in a `KinematicCollision2D` object. The `TileMap` acts as a single collider, so if you reference the `collider` property, it will be the `TileMap` node.

You then need to find out which tile in the `TileMap` is at the collision location.

Assume you've obtained a `KinematicCollision2D` object stored in the variable `collision`:

```gdscript
# Confirm the colliding body is a TileMap
if collision.collider is TileMap:
    # Find the character's position in tile coordinates
    var tile_pos = collision.collider.world_to_map(position)
    # Find the colliding tile position
    tile_pos -= collision.normal
    # Get the tile id
    var tile_id = collision.collider.get_cellv(tile_pos)
```

Once you have the `tile_id`, you can get the tile properties from the `TileSet` resource, found in the `TileMap`'s `tile_set` property. For example, to get the name of the tile:

```gdscript
    var tile_name = collision.collider.tile_set.tile_get_name(tile_id)
```

You can also change the tile by setting it to a new `id`:

```gdscript
    collision.collider.set_cellv(tile_pos, new_id)
```

## Related recipes

- [TileMap: using autotile](http://kidscancode.org/godot_recipes/2d/autotile_intro/)
- [TileMap: animated tiles](http://kidscancode.org/godot_recipes/2d/tilemap_animation/)

#### Like video?

{{< youtube OzgK__VowVs >}}