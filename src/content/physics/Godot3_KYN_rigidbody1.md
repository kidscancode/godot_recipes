---
title: "Using Rigid Bodies"
weight: 1
draft: false
---

{{% notice note %}}
This tutorial was written prior to Godot Recipes. Its format will eventually be updated to match the rest of the docs on this site.
{{% /notice %}}

In this tutorial, I'll explain when (and when not) to use rigid bodies, how they
work, and demonstrate a few handy tricks to bend them to your will. The
examples will use RigidBody2D, but the lessons apply equally to 3D.

## Introduction

<a href="http://docs.godotengine.org/en/latest/classes/class_rigidbody2d.html" target="_blank"><svg width="18" height="18" class="icon-icon_rigid_body_2d">
<use xlink:href="/blog/img/symbol-defs.svg#icon-icon_rigid_body_2d"></svg> `RigidBody2D`</a>
is the physics body in Godot that provides simulated physics. This means that you
don't control a RigidBody2D directly. Instead you apply forces to it (gravity, impulses,
etc.) and Godot's built-in physics engine calculates the resulting movement, including
collisions, bouncing, rotating, etc.

You can modify a RigidBody2D's behavior via properties such as "Mass", "Friction",
or "Bounce", which can be set in the Inspector:

![alt](/godot_recipes/img/rigidbody_properties.png)

The body's behavior is also affected by the world, via the _Project Settings -> Physics_
properties, or by entering an <a href="http://docs.godotengine.org/en/latest/classes/class_area2d.html"><svg width="18" height="18" class="icon-icon_area_2d" target="_blank"><use xlink:href="/blog/img/symbol-defs.svg#icon-icon_area_2d"></svg> `Area2D`</a> that is overriding the global physics properties.

## Using RigidBody2D

One of the benefits of using a rigid body is that a lot of behavior can be gotten "for
free" without writing any code. For example, let's look at making a rudimentary
"Angry Birds"-style game with falling blocks. You only need to create RigidBody2Ds
for the blocks and projectile, and set their properties. Stacking, falling, and bouncing
will automatically be handled by the physics engine.

### Stacking blocks

Start by making a RigidBody2D for the block and adding <a href="http://docs.godotengine.org/en/latest/classes/class_sprite.html" target="_blank"><svg width="18" height="18" class="icon-icon_sprite"><use xlink:href="/blog/img/symbol-defs.svg#icon-icon_sprite"></svg>`Sprite`</a> and
<a href="http://docs.godotengine.org/en/latest/classes/class_collisionshape2D.html" target="_blank"><svg width="18" height="18" class="icon-icon_collision_shape_2d"><use xlink:href="/blog/img/symbol-defs.svg#icon-icon_collision_shape_2d"></svg>`CollisionShape2D`</a>
children:

![alt](/godot_recipes/img/rigidbody_block_scene.png)

Add a texture to the Sprite and a rectangular collision shape. **IMPORTANT**: Do _not_
change the _Scale_ of the collision shape! In general this is a bad idea, and will
result in unexpected collision behavior. Always use the shape's inner size handles and
not the outer `Node2D`-derived scale handles.

> **NOTE:** For the textures in this example, I'm using the [Physics Asset](http://kenney.nl/assets/physics-assets) pack from Kenney.nl. It contains a
wide variety of blocks in different shapes and materials.

Press "Play" and you'll see the block fall slowly downward. This is due to the
default global gravity. You can find this setting in "Project Settings" under
_Physics -> 2d_. You can also try changing the Block's `Gravity Scale` property in the
Inspector. I'm using a value of `3`.

Now create a Main scene (I usually use a <a href="http://docs.godotengine.org/en/latest/classes/class_node.html" target="_blank"><svg width="18" height="18" class="icon-icon_node"><use xlink:href="/blog/img/symbol-defs.svg#icon-icon_node"></svg>Node</a>) for the root).
Add a few <a href="http://docs.godotengine.org/en/latest/classes/class_staticbody2d.html" target="_blank"><svg width="18" height="18" class="icon-icon_staticbody2d"><use xlink:href="/blog/img/symbol-defs.svg#icon-icon_static_body_2d"></svg>StaticBody2D</a>
nodes with rectangular collision shapes to serve as your "ground" and walls.

Instance a Block, and then duplicate it (`Ctrl-D` on Windows and `Cmd-D` on MacOS)
so you can make a nice stack. Something like this:

![alt](/godot_recipes/img/rigidbody_scene1.png)

### Projectile

Create another scene with the same node setup as your Block, but name this one "Ball". Use one of
the round textures and a circular collision shape. Instance this in your Main
scene and place it somewhere to the side of the stack of blocks.

To cause a rigid body to move, it must have some velocity. You can give the body
an initial velocity using the `Linear -> Velocity` property. Try setting this
to `(500, 0)`.

![alt](/godot_recipes/img/rigidbody_vel.gif)

You can also tinker with the ball's `Friction` and `Bounce` properties. Both of
these properties can range from zero to one. I like a bounce of around `0.5`.

> **IMPORTANT:** _NEVER_ scale a physics body! If you try, a warning will appear,
> and when the scene runs, the physics engine will automatically set the scale back
> to `(1, 1)`.

### Forces

Reset the linear velocity to `(0, 0)`. Now what if you want to be able to toss
the ball? You should never set a rigid body's velocity or position manually -
remember, these are simulating "real-world" style physics. In the real world,
objects can't instantly jump from place to place or from a standstill to a high
speed. If you try and do so, the physics engine will resist it, and unexpected
movement can occur. Instead, we must apply forces which create an acceleration in a certain
direction (also known as Newton's Second Law). Godot physics objects work in
the same way.

To add force to a rigid body, you have two functions to choose from:

- `add_force()`

Adds a continuous force to the body. Imagine a rocket's thrust, steadily
pushing it faster and faster. Note that this _adds_ to any already existing
forces. The force continues to be applied until removed.

- `apply_impulse()`

Adds an instantaneous "kick" to the body. Imagine hitting a baseball with a bat.

We'll use `apply_impulse()` to kick the ball when we click, drag, and release
the mouse button.

Open "Project Settings" and in the "Input Map" tab, add a new action called "click".
Connect it to the left mouse button.

Next, add a script to the Ball, and add the following code:

{{< highlight swift >}}
extends RigidBody2D

var dragging
var drag_start = Vector2()

func _input(event):
    if event.is_action_pressed("click") and not dragging:
        dragging = true
        drag_start = get_global_mouse_position()
    if event.is_action_released("click") and dragging:
        dragging = false
        var drag_end = get_global_mouse_position()
        var dir = drag_start - drag_end
        apply_impulse(Vector2(), dir * 5)
{{< /highlight >}}

This script toggles `dragging` on when the mouse button is pressed and records
the location of the click. When the button is released, we find the vector from
the click point to the release point and use that to apply the impulse (multiplying
by `5` to scale it up). `apply_impulse()` also takes an `offset` as its first
parameter. This lets you "hit" the body off center, if you wish. For instance,
try setting it to `Vector2(25, 0)` and you'll add some spin to the ball when
it's launched.

![alt](/godot_recipes/img/rigidbody_impulse.gif)

## Controlling Rigid Bodies

There are cases where you need more direct control of a rigid body. For example,
imagine you're trying to make a version of the classic game "Asteroids". The
player's spaceship needs to rotate using the left/right arrow keys, and to move
forward when the up arrow is pressed.

Here's the image I'm using for my ship:

![alt](/godot_recipes/img/ship_red.png)

I recommend you also go to [OpenGameArt](http://opengameart.org/) and search for
a nice space background (but this is totally optional).

Create a new scene for the ship as we did above with the following node structure:

- `RigidBody2D`
    - `Sprite`
    - `CollisionShape2D`

> **Note:** In Godot 3.0, `0` degrees points to the right (along the **x** axis).
> This means you need to add a `Rotation` of `90` to the `Sprite` so it will
> match the body's direction.

By default, the physics settings provide some _damping_, which reduces a body's
velocity and spin. In space, there's no friction, so there shouldn't be any
damping at all. However, for the "Asteroids" feel, we want the ship to stop rotating
when we let go of the keys, so set the ship's `Angular -> Damp` to `5`.

{{< highlight swift >}}
extends RigidBody2D

export (int) var engine_thrust
export (int) var spin_thrust

var thrust = Vector2()
var rotation_dir = 0
var screensize

func _ready():
    screensize = get_viewport().get_visible_rect().size

func get_input():
    if Input.is_action_pressed("ui_up"):
        thrust = Vector2(engine_thrust, 0)
    else:
        thrust = Vector2()
    rotation_dir = 0
    if Input.is_action_pressed("ui_right"):
        rotation_dir += 1
    if Input.is_action_pressed("ui_left"):
        rotation_dir -= 1

func _process(delta):
    get_input()

func _physics_process(delta):
    set_applied_force(thrust.rotated(rotation))
    set_applied_torque(rotation_dir * spin_thrust)

{{< /highlight >}}

Let's walk through what this script is doing. The two variables, `engine_thrust`
and `spin_thrust` control how fast the ship can accelerate and turn. In the
Inspector, set them to `500` and `25000` respectively (the units of torque make
for large numbers). `thrust` will represent the ship's engine state: `(0, 0)`
when coasting, or a vector with the length of `engine_thrust` when powered on.
`rotation_dir` will represent what direction the ship is turning. The `screensize`
variable will capture the size of the screen, which we'll be using later.

Next, the `input()` function captures the keystates and sets the ship's `thrust`
on or off, and the rotation direction (`rotation_dir`) positive or negative. This
function is called every frame in `_process()`.

Finally, physics-related functions should be called in `_physics_process()`. Here
we use `set_applied_force()` to apply the `thrust` in whatever `direction` the
ship is facing. Then we use `set_applied_torque()` to cause the ship to rotate.

Play the scene - you should be able to fly around freely.

![alt](/godot_recipes/img/rigidbody_ship1.gif)

## The Position Problem

Another feature of "Asteroids" is that the screen "wraps around". If the player
goes off one side, it teleports to the other side. But we already talked above
about how you can't change a rigid body's position without breaking the physics
engine. This presents a huge problem when working with rigid bodies.

A common mistake is to try adding something like this to `_physics_process()`:

{{< highlight swift >}}
func _physics_process(delta):
    if position.x > screensize.x:
        position.x = 0
    if position.x < 0:
        position.x = screensize.x
    if position.y > screensize.y:
        position.y = 0
    if position.y < 0:
        position.y = screensize.y
    set_applied_force(thrust.rotated(rotation))
    set_applied_torque(rotation_dir * spin_thrust)
{{< /highlight >}}

This fails spectacularly, trapping the player on the edge of the screen (with
occasional glitches). So why doesn't this work? The docs say `_physics_process()`
is for physics-related stuff, right?

Not exactly. `_physics_process()` is _synced_ to the physics timestep, but that
doesn't make it OK to use for just anything. Hope is not lost, however, the answer
is in the docs.

To quote the [RigidBody2D docs](http://docs.godotengine.org/en/latest/classes/class_rigidbody2d.html#description):

> You should not change a RigidBody2D’s position or linear_velocity every frame or even very often. If you need to directly affect the body’s state, use `_integrate_forces`, which allows you to directly access the physics state.

And the [description for _integrate_forces](http://docs.godotengine.org/en/latest/classes/class_rigidbody2d.html#class-rigidbody2d-integrate-forces):

> Allows you to read and **safely modify** the simulation state for the object. Use this instead of `_physics_process` if you need to directly change the body’s position or other physics properties.

So there's our answer. Instead of using `_physics_process()` we need to use `_integrate_forces()`,
which gives us access to the <a href="http://docs.godotengine.org/en/latest/classes/class_physics2ddirectbodystate.html" target="_blank">Physics2DDirectBodyState</a>. I highly recommend you take a look at the
linked document, there is a lot of really useful data provided in the physics state object.
For our purposes, the key piece of information is the body's <a href="http://docs.godotengine.org/en/latest/classes/class_transform2d.html" target="_blank">Transform2D</a>.
(Explaining transforms is beyond the scope of this document - see [Matrices and transforms](http://docs.godotengine.org/en/latest/learning/features/math/matrices_and_transforms.html)
for more information.)

The body's position is contained in the transform's `origin`. Change `_physics_process()`
to `_integrate_forces()` and add the following code:

{{< highlight swift >}}
func _integrate_forces(state):
    set_applied_force(thrust.rotated(rotation))
    set_applied_torque(rotation_dir * spin_thrust)
    var xform = state.get_transform()
    if xform.origin.x > screensize.x:
        xform.origin.x = 0
    if xform.origin.x < 0:
        xform.origin.x = screensize.x
    if xform.origin.y > screensize.y:
        xform.origin.y = 0
    if xform.origin.y < 0:
        xform.origin.y = screensize.y
    state.set_transform(xform)
{{< /highlight >}}

We grab the current transform, change it as necessary, and set it back as the new
transform. The physics engine stays happy, and everything works as expected:

![alt](/godot_recipes/img/rigidbody_ship2.gif)

## Conclusion

When used properly, rigid bodies are a powerful tool in your Godot toolkit. Many
users get in trouble, however, when they use them for the wrong purposes, or
fail to understand exactly how they work.

