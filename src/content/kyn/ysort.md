---
title: "YSort"
draft: false
ghcommentid: 93
---

## {{< gd-icon YSort >}}`YSort`

Many 2D games use a "3/4 view" perspective, giving the impression that the camera is looking at the world at an angle. However, to make this art style work, objects that are "farther" away should be rendered behind "nearer" objects. In practice, we want to "y sort", or make the drawing order tied to the object's `y` coordinate: the higher on the screen, the farther away and therefore the lower the render order.

Here's an example of the problem:

![alt](/godot_recipes/img/ysort_01.png)

These objects are being drawn in the default render order: *tree* order. They are arranged like this in the scene tree:

![alt](/godot_recipes/img/ysort_02.png)

### Changing the render order

The {{< gd-icon YSort >}}`YSort` node changes the draw order of its children to use each object's `y` coordinate. Lower values of `y` (ie higher on the screen) get rendered first.

Here are the same objects placed under a {{< gd-icon YSort >}}`YSort` node:

![alt](/godot_recipes/img/ysort_03.png)

However, there is still a problem:

![alt](/godot_recipes/img/ysort_01.gif)

The draw order is based on the object's `y` coordinate. By default, for most objects this is the center:

![alt](/godot_recipes/img/ysort_04.png)

We can solve this by offsetting the sprite so that the object's `position` is aligned with the *bottom* of the sprite - the feet of the character, for example:

![alt](/godot_recipes/img/ysort_05.png)

Now things look a lot better:

![alt](/godot_recipes/img/ysort_02.gif)

### {{< gd-icon YSort >}}`YSort` and {{< gd-icon TileMap >}} `TileMap`

A {{< gd-icon TileMap >}} `TileMap` can perform the same function on its children if you enable the `cell_y_sort` property.

