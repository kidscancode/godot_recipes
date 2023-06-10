---
title: "Using Y-Sort"
weight: 4
draft: false
---

## Problem

Many 2D games use a "3/4 view" perspective, giving the impression that the camera is looking at the world at an angle. To make this work, objects that are "farther" away need to be rendered behind "nearer" objects. In practice, that means we want to "y-sort" - making the drawing order tied to the object's `y` coordinate. The higher on the screen, the farther away and therefore lower the render order.

Here's an example of the problem:

![alt](/godot_recipes/4.x/img/ysort_01.png)

These objects are being drawn in the default render order: tree order. They are arranged like this in the scene tree:

![alt](/godot_recipes/4.x/img/ysort_06.png)

## Solution

Godot has a built-in option to change the render order: on any {{< gd-icon CanvasItem >}}`CanvasItem` node ({{< gd-icon Node2D >}}`Node2D` or {{< gd-icon Control >}}`Control`), we can enable the **Y Sort Enabled** property. When this is enabled, all child nodes are then y-sorted.

In the above example, we can enable the property on the {{< gd-icon TileMap >}}`TileMap` node. However, there's still a problem:

![alt](/godot_recipes/4.x/img/ysort_01.png)

The draw order is based on each object's `y` coordinate. By default, that is the object's center:

![alt](/godot_recipes/4.x/img/ysort_04.png)

Since we want to give the impression that the objects are on the "ground", we can solve this by offsetting each object's sprite so that the object's `position` is aligned with the *bottom* of the sprite:

![alt](/godot_recipes/4.x/img/ysort_05.png)

Now things look a lot better:

![alt](/godot_recipes/4.x/img/ysort_02.gif)

## <i class="fas fa-code-branch"></i> Download This Project

Download the project's example code here: [https://github.com/godotrecipes/using_ysort](https://github.com/godotrecipes/using_ysort)