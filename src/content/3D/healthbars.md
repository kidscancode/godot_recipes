---
title: "3D Unit Healthbars"
weight: 5
draft: false
---

## Problem

You want a floating "healthbar" for your 3D game objects (mobs, characters, etc.).

## Solution

For this solution, we're going to re-use a 2D healthbar based on a `TextureProgress` node. It's already set up with textures and code for updating the value and color. If you already have something similar, feel free to use it here. In the example, we'll name this scene "Healthbar2D".

![alt](/godot_recipes/img/healthbar_example.gif)

If you need some assets, here are the three images used in the bar:

![alt](/godot_recipes/img/barHorizontal_green_mid 200.png)
![alt](/godot_recipes/img/barHorizontal_yellow_mid 200.png)
![alt](/godot_recipes/img/barHorizontal_red_mid 200.png)

{{% notice note %}}
Re-using existing objects can save you a lot of time. Don't re-invent the wheel everytime you need a healthbar, camera, or other common object.
{{% /notice %}}

### Project setup

We'll start with a `KinematicBody` mob. It's programmed to spawn and travel in a straight line. It also has the following code to handle damage:

```gdscript
func _on_Mob_input_event(camera, event, click_position, click_normal, shape_idx):
    if event is InputEventMouseButton:
        if event.button_index == BUTTON_LEFT and event.pressed:
            health -= 1
            if health <= 0:
                queue_free()
```

![alt](/godot_recipes/img/3d_bars01.gif)

Clicking on a unit deals one damage. Do ten damage, and the unit is destroyed. Now we need a visual representation of that using our 2D bar.

### 2D in 3D

You can display a 2D image in 3D using a `Sprite3D`. Add one to a new scene and name it "Healthbar3D". First, we'll get it configured and sized, so set the _Texture_ to the green bar image.

The `Sprite3D` acts like any other 3D object - as we pan the camera around, our perspective on it changes. However, we want the healthbar to always "face" toward the camera so that we can see it.

In the Inspector, under _GeometryInstance/Material Override_, add a new `SpatialMaterial`. Set the following properties in the `SpatialMaterial`:

- _Flags/Transparent_: **On**
- _Flags/Unshaded_: **On**
- _Parameters/Billboard Mode_: **Enabled**

Now try moving the camera to confirm that the texture is always facing you.

![alt](/godot_recipes/img/3d_bars02.gif)

Add an instance of this scene to the `Mob` scene and position the bar above the mob's body.

![alt](/godot_recipes/img/3d_bars04.png)

### Viewport texture

We don't want the `Sprite3D` to show a static texture - we want it to display the 2D `TextureProgress`. We can do that using a `Viewport` node, which can export a texture.

Add a `Viewport` as a child of the `Sprite3D`. In the Inspector set these properties:

- _Transparent Bg_: **On**
- _Rendering/Usage_: **2D**
- _Render Target/V Flip_: **On**

We also need to set the size of the Viewport to match the size of the healthbar texture, which is `(200, 26)`.

Instance the `HealthBar2D` as a child of the `Viewport`. Your scene should look like this:

![alt](/godot_recipes/img/3d_bars03.png)

If the `Viewport` were not a child of the `Sprite3D`, we could set it as the sprite's texture directly in the Inspector. Since it's a child, it won't be ready at the right time, so we'll need to set it in a script attached to the `Sprite3D`:

```gdscript
extends Sprite3D

func _ready():
    texture = $Viewport.get_texture()
```

### Connecting it all together

In the mob's `_on_Mob_input_event()` method, add the following after reducing the health:

```gdscript
$HealthBar3D.update(health, max_health)
```

Add the following to `HealthBar3D.gd`:

```gdscript
onready var bar = $Viewport/HealthBar2D

func update(value, full):
    bar.update_bar(value, full)
```

This calls the update method that already exists on the 2D bar, setting the progress bar's value and selecting the bar color:

```gdscript
func update_bar(amount, full):
    texture_progress = bar_green
    if amount < 0.75 * full:
        texture_progress = bar_yellow
    if value < 0.45 * full:
        texture_progress = bar_red
    value = amount
```

Click on the mobs to see the health bars change.

![alt](/godot_recipes/img/3d_bars05.gif)

{{% notice note %}}
Download the project file here: [3d_labels.zip](/godot_recipes/files/3d_labels.zip)
{{% /notice %}}

### Wrapping up

You can use this technique to display any other `Control` nodes, such as `Label`, `VideoPlayer`, etc. You can even use the `Viewport` to "project" an entire 2D game in 3D space.

## Related Recipes

- [Object Healthbars (2D)](/godot_recipes/ui/unit_healthbar/)

#### Like video?

{{< youtube 37hEX3Lrc0A >}}
