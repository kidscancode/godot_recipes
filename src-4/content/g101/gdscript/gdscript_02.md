---
title: "Moving sprites"
weight: 1
draft: true
ghcommentid: 90
pre: "02. "
---

In the previous step, we added a script to a {{< gd-icon Sprite2D >}}`Sprite2D` and used that script to set its position.

Here's the script we have so far:

```gdscript
extends Sprite2D

func _ready():
    position = Vector2(100, 150)
```

## Moving the sprite

Now we want to make the sprite move around the screen. Godot runs at *60 fps* (frames per second) by default, and we'd like to the sprite to move a little bit each frame. Add this code to the script and run it to see what happens.

```gdscript
func _process(delta):
    position.x += 100 * delta
```

Did you see the sprite moving to the right? Let's break down what's happening.

Just as the `_ready()` function was called when the node was first started (by pressing "Play"), the `_process()` function is called every frame. This means any code you write in this function will be executed every `1/60` of a second. This is what the `delta` represents - the length of the frame in seconds.

What are we asking Godot to do every frame here? Take the sprite's `x` coordinate and add `100 * 1/60` to it.

The result is that we have a sprite that's moving `100` pixels per second to the right.

{{% expand title="More info" %}}
For more information about `delta` and why we use it in game development, see [Understanding delta](/godot_recipes/4.x/basics/understanding_delta/).
{{% /expand %}}

## Using vectors

What if we want to move the sprite diagonally? That means we need to change the `x` and `y` coordinates at the same time. `position` is a **vector** - it contains both coordinates in one quantity. Vectors can be added, so let's change the code to this:

```gdscript
func _process(delta):
    position += Vector2(100, 50) * delta
```

Run the code and you should see the sprite moving down and to the right.

Let's make this a little easier to deal with by using **variables**:

```gdscript
extends Sprite2D

var velocity = Vector2(100, 50)

func _ready():
    position = Vector2(100, 150)

func _process(delta):
    position += velocity * delta
```

We've taken this quantity and made it a variable. You **declare** a variable by using the keyword `var`, giving the variable a name, and then assigning a value with `=`.

It's often more convenient to set values at the top where they're easy to find. We'll also find it more convenient later, when we start making multiples of this sprite.

## Randomizing the movement

Let's mix this up and choose a random direction for the sprite to move in.

```gdscript
func _ready():
    position = Vector2(100, 150)
    velocity = Vector2.RIGHT.rotated(randf_range(0, TAU))
    velocity = velocity * randf_range(100, 400)
```

Here, we're first setting `velocity` to point to the right, and then rotating it a random amount. Then we multiply that by another random number to give it a random speed. Try running the scene a couple of times and you'll see the sprite go in different directions.

```gdscript
func _process(delta):
    position += velocity * delta
    position.x = wrapf(position.x, -64, screensize.x+64)
    position.y = wrapf(position.y, -64, screensize.y+64)
```