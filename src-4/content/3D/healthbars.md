---
title: "3D Unit Healthbars"
weight: 5
draft: true
ghcommentid: 35
---

## Problem

You want a floating "healthbar" for your 3D game objects (mobs, characters, etc.).

## Solution

For this solution, we're going to re-use a 2D healthbar based on a {{< gd-icon TextureProgressBar >}}`TextureProgressBar` node. It's already set up with textures and code for updating the value and color. If you already have something similar, feel free to use it here. In the example, we'll name this scene "Healthbar2D".

![alt](/godot_recipes/4.x/img/healthbar_example.gif)

If you need some assets, here are the three images used in the bar:

![alt](/godot_recipes/4.x/img/barHorizontal_green_mid%20200.png)

![alt](/godot_recipes/4.x/img/barHorizontal_yellow_mid%20200.png)

![alt](/godot_recipes/4.x/img/barHorizontal_red_mid%20200.png)

{{% notice note %}}
Re-using existing objects can save you a lot of time. Don't re-invent the wheel everytime you need a healthbar, camera, or other common object.
{{% /notice %}}

### Project setup

For our example "mob", we'll start with a {{< gd-icon CharacterBody3D >}}`CharacterBody3D` node. It's programmed to spawn and travel in a straight line. It also has the following code to handle damage:

```gdscript
func _on_input_event(camera, event, position, normal, shape_idx):
    if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
        health -= 1
        if health <= 0:
            queue_free()
```

![alt](/godot_recipes/4.x/img/3d_bars01a.gif)

Clicking on a unit deals one damage. Do ten damage, and the unit is destroyed. Now we need a visual representation of that using our 2D bar.

### 2D in 3D

We can display a 2D image in 3D using a {{< gd-icon Sprite3D >}}`Sprite3D`. Add one to a new scene and name it "Healthbar3D". First, we'll get it configured and sized, so set the _Texture_ property to the green bar image.

The {{< gd-icon Sprite3D >}}`Sprite3D` acts like any other 3D object - as we pan the camera around, our perspective on it changes. However, we want the healthbar to always "face" toward the camera so that we can see it.

In the Inspector, under _Flags_, set _Billboard_ to "Enabled".

Now try moving the camera to confirm that the texture is always facing you.

![alt](/godot_recipes/4.x/img/3d_bars02.gif)

Add an instance of this scene to the `Mob` scene and position the bar above the mob's body.

![alt](/godot_recipes/4.x/img/3d_bars04.png)

### Viewport texture

We don't want the {{< gd-icon Sprite3D >}}`Sprite3D` to show a static texture - we want it to display the 2D {{< gd-icon TextureProgressBar >}}`TextureProgressBar`. We can do that using a {{< gd-icon SubViewport >}}`SubViewport` node, which can export a texture.

Add a {{< gd-icon SubViewport >}}`SubViewport` as a child of the {{< gd-icon Sprite3D >}}`Sprite3D`. In the Inspector set _Transparent BG_ to **On**.

We also need to set the size of the viewport to match the size of the healthbar texture, which is `(200, 26)`.

Instance the `HealthBar2D` as a child of the {{< gd-icon Viewport >}}`Viewport`. Your scene should look like this:

![alt](/godot_recipes/4.x/img/3d_bars_03a.png)

If the {{< gd-icon SubViewport >}}`SubViewport` were not a child of the {{< gd-icon Sprite3D >}}`Sprite3D`, we could set it as the sprite's texture directly in the Inspector. Since it's a child, it won't be ready at the right time, so we'll need to set it in a script attached to the {{< gd-icon Sprite3D >}}`Sprite3D`:

```gdscript
extends Sprite3D

func _ready():
    texture = $SubViewport.get_texture()
```

### Connecting it all together

In the mob's `_on_input_event()` method, add the following after reducing the health:

```gdscript
$HealthBar3D.update(health, max_health)
```

Add the following to `HealthBar3D.gd`:

```gdscript
func update_health(_value, max_value):
    $SubViewport/HealthBar2D.update_health(_value)
```

This calls the update method that already exists on the 2D bar, setting the progress bar's value and selecting the bar color:

```gdscript
func update_health(_value, max_value):
	value = _value
	if value < max_value:
		show()
	texture_progress = bar_green
	if value < 0.75 * max_value:
		texture_progress = bar_yellow
	if value < 0.45 * max_value:
		texture_progress = bar_red
```

Click on the mobs to see the health bars change.

![alt](/godot_recipes/4.x/img/3d_bars_05a.gif)

{{% notice note %}}
Download the project file here: [https://github.com/godotrecipes/3d_object_healthbars](https://github.com/godotrecipes/3d_object_healthbars)
{{% /notice %}}

### Wrapping up

You can use this technique to display any other {{< gd-icon Node2D >}}`Node2D` or {{< gd-icon Control >}}`Control` nodes, such as {{< gd-icon Label >}}`Label`, {{< gd-icon VideoStreamPlayer >}}`VideoStreamPlayer`, etc. You can even use the {{< gd-icon SubViewport >}}`SubViewport` to "project" an entire 2D game in 3D space.

<!-- ## Related Recipes

- [Object Healthbars (2D)](/godot_recipes/4.x/ui/unit_healthbar/) -->

