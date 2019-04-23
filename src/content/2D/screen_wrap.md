---
title: "Screen wrap"
weight: 1
draft: false
---

## Problem

You want to allow the player to "wrap around" the screen, teleporting from one side of the screen to the other. This is a common feature, especially in old-school 2D games (think Pac-man).

## Solution

1. Get your screen (viewport) size

    ```gdscript
    onready var screen_size = get_viewport_rect().size
    ```

    `get_viewport_rect()` is available to any `CanvasItem` derived node.

1. Compare your player's position

    ```gdscript
    if position.x > screen_size.x:
        position.x = 0
    if position.x < 0:
        position.x = screen_size.x
    if position.y > screen_size.y:
        position.y = 0
    if position.y < 0:
        position.y = screen_size.y
    ```

    Note that this is using the node's `position`, which is usually the center of your sprite and/or body.

1. Simplifying with `wrapf()`

    The above code can be simplified using GDScript's `wrapf()` function, which "loops" a value between the given limits.

    ```gdscript
    position.x = wrapf(position.x, 0, screen_size.x)
    position.y = wrapf(position.y, 0, screen_size.y)
    ```
