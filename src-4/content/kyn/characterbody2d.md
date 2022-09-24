---
title: "CharacterBody2D"
draft: true
ghcommentid:
---

## {{< gd-icon CharacterBody2D >}}CharacterBody2D

Godot offers a number of collision-related objects to use in your game. Knowing how each of them works will help you

### Node properties

* Motion Mode - This property has two options:

    * `Floating`

    Floating mode is intended for top-down games. In this mode, all collisions are considered to be "walls".

    * `Grounded`

    This is the mode you want for a platformer-style game. When choosing this mode, you specify an `Up Direction` which tells the engine what surfaces to consider a floor, a wall, or a ceiling. The default `Up Direction` is `(0, -1)`.


### Movement methods

When you move the body, you should not directly set its `position` property (unless you want to teleport it). Instead, you use the provided movement methods, which will detect collisions and allow you to respond to them. See below for examples of using each one.

* `move_and_collide`

This method takes a parameter called `distance`. This is the vector you want the body to move in a given frame. Typically, you'll pass your `velocity` vector multiplied by `delta` (which is, of course, a distance).

When moving with `move_and_collide()` the body will immediately stop as soon as it collides with another body. The returned value is a {{< gd-icon KinematicCollision2D >}}`KinematicCollision2D`, an object containing a bunch of useful information about the collision, such as the colliding object, its surface normal, etc.

* `move_and_slide()`

This method provides the common collision response where you want one body to slide along the other, such as in a platformer or a top-down game.

{{% notice note %}}
`move_and_slide()` takes no parameters. Just set the built-in `velocity` property and it will apply `delta` and calculate the movement.
{{% /notice %}}

### Detecting collisions

This depends on which method you use. When using `move_and_collide()` you'll get back a `KinematicCollision2D` object with data about the collision.

When using `move_and_slide()`, it's a little trickier, as it's possible to have multiple collisions occur in a single frame (for example when moving into a corner). For this situation, there is `get_slide_collision_count()` and `get_slide_collision()`.

Here are two code snippets showing what was collided with. In both, assume that `velocity` has been set previously.

```gdscript
# Using move_and_collide()
var collision = move_and_collide(velocity * delta)
if collision:
    print("I collided with ", collision.get_collider().name)

# Using move_and_slide()
move_and_slide()
for i in get_slide_collision_count():
    var collision = get_slide_collision(i)
    print("I collided with ", collision.get_collider().name)
```

### Which movement method do I use?

### Examples

Comparing collide and slide (code to do the same thing)

1. Platform character (link)

See the [Platform character]](/godot_recipes/4.x/2d/platform_character/) recipe for more details.

2. Top-down shooter (link)
