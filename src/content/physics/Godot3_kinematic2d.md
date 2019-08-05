---
title: "Using KinematicBody2D"
weight: 1
draft: false
---

Godot offers a number of collision objects to provide both collision detection and response. Trying to decide which one to use for your project can be confusing. You can avoid problems and simplify development if you understand how each each works and what their pros and cons are. In this tutorial, we'll look at the `KinematicBody2D` node and show some examples of how it can be used.

## Introduction: Physics bodies

In game development you often need to know when two objects in the game space intersect or come into contact. This is known as _collision detection_. When a collision is detected, you typically want something to happen. This is known as _collision response_.

Godot offers three kinds of physics bodies, grouped under the <a href="http://docs.godotengine.org/en/latest/classes/class_physicsbody2d.html" target="_blank">`PhysicsBody2D`</a> type:

- `StaticBody2D`

A static body is one that is not moved by the physics engine. It participates in collision detection, but does not move in response to the collision. This type of body is most often used for objects that are part of the environment or that do not need to have any dynamic behavior.

- `RigidBody2D`

This is the node that implements simulated 2D physics. You do not control a `RigidBody2D` directly, but instead you apply forces to it (gravity, impulses, etc.) and the physics engine calculates the resulting movement. See [Godot 3.0: Rigid Bodies](/blog/2017/12/godot3_kyn_rigidbody1/) for more information.

- `KinematicBody2D`

A body that provides collision detection, but no physics. All movement must be implemented in code.

## Collision shapes

A physics body can hold any number of `Shape2D` objects as children. These shapes are used to define the object's collision bounds and to detect contact with other objects.

> **Note:** In order to detect collisions, at least one `Shape2D` must be assigned to the object.

The most common way to assign a shape is by adding a `CollisionShape2D` or `CollisionPolygon2D` as a child of the object. These nodes allow you to draw the shape directly in the editor workspace.

> **Note:** Be careful to never scale your collision shapes in the editor. The `Scale` property in the Inspector should remain at `(1, 1)`. When changing the size of the collision shape, you should always use the shape's handles, _not_ the `Node2D` scale handles. Changing the scale can result in unexpected collision behavior.

!player_coll_shape.png

### Collision Layers and Masks

One of the most powerful but frequently misunderstood collision features in Godot is the collision layer system. This system allows you to build up very complex interactions between a variety of objects. The key concepts are _layers_ and _masks_. Each CollisionObject2D has 32 different physics layers it can interact with.

Let's look at each of the properties in turn:

-   **`collision_layer`**
describes the layers that the object appears _in_. By default, all bodies are on layer `1`.

-   **`collision_mask`**
describes what layers the body will _scan_ for collisions. If an object isn't in one of the mask layers, the body will ignore it. By default, all bodies scan layer `1`.

You can also assign names to layers. In "Project Settings", look for the "Layer Names -> 2D Physics" section:

![alt](/godot_recipes/img/k2d_layer_names.png?width=300)

A body's layer properties can be configured via code, or directly in the Inspector:

![alt](/godot_recipes/img/k2d_layer_example.png?width=300)

**Example:**

You have three nodes with the following configuration:

|           |Layers|Mask|
|-----------|------|----|
|**Player** |`1`|`2, 3` |
|**Enemy**  |`2`|`1`    |
|**Coin**   |`3`|`1`    |

In this scenario, the `Player` node would detect collisions with both `Enemy` and `Coin` nodes (because they are in layers it scans). However, `Enemy` and `Coin` nodes would not detect each other, because they only scan layers they are _not_ in.

## Kinematic Bodies

`KinematicBody2D` is for implementing bodies that are to be controlled via code. They detect collisions with other bodies when moving, but are not affected by engine physics properties like gravity or friction. While this means that you have to write some code to create their behavior, it also means you have more precise control over how they move and react.

> **Note:** A `KinematicBody2D` can be affected by gravity and other forces, but you must calculate the movement in code. The physics engine will not move a `KinematicBody2D`.

### Movement and collision

When moving a `KinematicBody2D`, you should not set its `position` directly. Instead, you use the `move_and_collide()` or `move_and_slide()` methods. These methods move the body along a given vector and will instantly stop if a collision is detected with another body. After a KinematicBody2D has collided, any _collision response_ must be coded manually.

> **Note:** Kinematic body movement should only be done in the `_physics_process()` callback.

#### move_and_collide

This method takes one parameter: a `Vector2` indicating the body's relative movement. Typically, this is your velocity vector multiplied by the frame timestep (`delta`). If the engine detects a collision anywhere along this vector, the body will immediately stop moving. If this happens, the method will return a `KinematicCollision2D` object.

##### KinematicCollision2D

When a KinematicBody2D detects a collision, Godot provides a <a href="http://docs.godotengine.org/en/latest/classes/class_kinematiccollision2d.html" target="_blank">`KinematicCollision2D`</a> object. This object contains data about the collision and the colliding object. Using this data you can calculate your collision response.

#### move_and_slide

The `move_and_slide()` method is intended to simplify the collision response in the common case where you want one body to slide along the other. This is especially useful in platformers or top-down games, for example.

> **NOTE:** `move_and_slide()` automatically calculates frame-based movement using `delta`. Do _not_ multiply your velocity vector by `delta` before passing it to `move_and_slide()`.

In addition to the velocity vector, `move_and_slide` takes a number of other parameters allowing you to customize the slide behavior:

`floor_normal` - default value: `Vector2( 0, 0 )`

This parameter allows you to define what surfaces the engine should consider to be the floor. Setting this lets you use the `is_on_floor()`, `is_on_wall()`, and `is_on_ceiling()` methods to detect what type of surface the body is in contact with. The default value means that all surfaces are considered walls.

`slope_stop_min_velocity` - default value: `5`

This is the minimum velocity when standing on a slope. This prevents a body from sliding down a slope when standing still.

`max_bounces` - default value: `4`

This is the maximum number of collisions before the body stops moving. Setting this too low may prevent movement entirely.

`floor_max_angle` - default value: `0.785398` (in radians, equivalent to 45 degrees)

This is the maximum angle before a surface is no longer considered a "floor".

### Which to use?

A common question from new Godot users is: "How do you decide which movement function to use?"
Often the response is to use `move_and_slide()` because it's "simpler", but this is not
necessarily the case. One way to think of it is that `move_and_slide()` is a special case,
and `move_and_collide()` is more general. For example, the following two code snippets result in the same collision response:

![alt](/godot_recipes/img/k2d_compare.gif)

{{< highlight python>}}
var collision = move_and_collide(velocity * delta)
if collision:
	velocity = velocity.slide(collision.normal)
{{< /highlight >}}
{{< highlight python>}}
velocity = move_and_slide(velocity)
{{< /highlight >}}

Anything you do with `move_and_slide()` can also be done with `move_and_collide()`,
it just might take a little more code. However, as we'll see in the examples below,
there are cases where `move_and_slide()` isn't the response you want.

## Examples

Download the [Sample Project](/blog/img/KYN3.0_KinematicBody2D.zip) for the examples
below.

## Basic movement

If you've downloaded the sample project, this example is in the "BasicMovement.tscn" scene.

For this example, Add a `KinematicBody2D` with two children: a `Sprite` and a `CollisionShape2D`. As with many demos, we'll use the Godot "icon.png" as the Sprite's texture (drag it from the Filesystem dock to the "Texture" property of the `Sprite`). In the `CollisionShape2D`'s "Shape" property, select "New RectangleShape2D" and size the rectangle to fit over the sprite image.

Attach a script to the KinematicBody2D and add the following code:

{{< highlight python >}}
extends KinematicBody2D

var speed = 250
var velocity = Vector2()

func get_input():
	# Detect up/down/left/right keystate and only move when pressed
	velocity = Vector2()
	if Input.is_action_pressed('ui_right'):
		velocity.x += 1
	if Input.is_action_pressed('ui_left'):
		velocity.x -= 1
	if Input.is_action_pressed('ui_down'):
		velocity.y += 1
	if Input.is_action_pressed('ui_up'):
		velocity.y -= 1
	velocity = velocity.normalized() * speed

func _physics_process(delta):
	get_input()
	move_and_collide(velocity * delta)
{{< /highlight >}}

Run this scene and you'll see that `move_and_collide()` works as expected, moving
the body along the velocity vector. Now let's see what happens when you add
some obstacles. Add a StaticBody2D with a rectangular collision shape. For visibility,
you can use a sprite, a Polygon2D, or just turn on "Visible Collision Shapes" from
the "Debug" menu.

Run the scene again and try moving into the obstacle. You'll see that the `KinematicBody2D`
can't penetrate the obstacle. However, try moving into the obstacle at an angle and
you'll find that the obstacle acts like glue - it feels like the body gets stuck.

This happens because there is no _collision response_. `move_and_collide()` just stops
the body's movement when a collision occurs. We need to code whatever response we
want from the collision.

Try changing the function to `move_and_slide(velocity)` and running again. Note that we removed `delta` from the velocity calculation.

`move_and_slide()` provides a default collision response of sliding the body along the
collision object. This is useful for a great many game types, and may be all you need
to get the behavior you want.

Next, we'll look at a few other examples.

### Bouncing/reflecting and collision detection

What if you don't want a sliding collision response? For this example ("BounceandCollide.tscn"
in the sample project), we have a character shooting bullets and we want the bullets to
bounce off the walls.

For this example, we have three scenes: the main scene containing the Player, a Bullet,
and a Wall. The Bullet and Wall are separate scenes so that they can be instanced.

The Player is controlled by W/S for forward/back and aims using the mouse. Here is
the code for the Player, using `move_and_slide()`:

{{< highlight python >}}
extends KinematicBody2D

export (PackedScene) var Bullet
export (int) var speed

var velocity = Vector2()

func get_input():
	# add these actions in Project Settings -> Input Map
	velocity = Vector2()
	if Input.is_action_pressed('backward'):
		velocity = Vector2(-speed/3, 0).rotated(rotation)
	if Input.is_action_pressed('forward'):
		velocity = Vector2(speed, 0).rotated(rotation)
	if Input.is_action_just_pressed('mouse_click'):
		shoot()

func shoot():
	# "Muzzle" is a Position2D placed at the barrel of the gun
	var b = Bullet.instance()
	b.start($Muzzle.global_position, rotation)
	get_parent().add_child(b)

func _physics_process(delta):
	get_input()
	var dir = get_global_mouse_position() - global_position
	# Don't move if too close to the mouse pointer
	if dir.length() > 5:
		rotation = dir.angle()
		velocity = move_and_slide(velocity)
{{< /highlight >}}

And the code for the Bullet:

{{< highlight python>}}
extends KinematicBody2D

var speed = 750
var velocity = Vector2()

func start(pos, dir):
	rotation = dir
	position = pos
	velocity = Vector2(speed, 0).rotated(rotation)

func _physics_process(delta):
	var collision = move_and_collide(velocity * delta)
	if collision:
		velocity = velocity.bounce(collision.normal)
		if collision.collider.has_method("hit"):
			collision.collider.hit()

func _on_VisibilityNotifier2D_screen_exited():
	queue_free()
{{< /highlight >}}

The action happens in `_physics_process()`. After using `move_and_collide()` if a
collision occurs, a `KinematicCollision2D` object is returned (otherwise, the return
is `Nil`).

If there is a returned collision, we use the `normal` of the collision to reflect
the bullet's `velocity`. `bounce()` is a `Vector2` method.

If the colliding object (`collider`) has a `hit` method,
we also call it. In the example project, we've added a flashing color effect to
the Wall to demonstrate this.

![alt](/godot_recipes/img/k2d_bullet_bounce.gif)

### Platforming with move_and_slide

Let's try one more example - one that often gets asked about - the 2D platformer. `move_and_slide()` is ideal for quickly getting a functional character controller up and running. If you've downloaded the sample project, you can find this in "Platformer.tscn".

For this example, we'll assume you have a level made of StaticBody2D objects. They can be any shape and size. In the sample project, we're using a TileMap to lay out the level, but for the purposes of this demo, they could just as well be individual static bodies.

We're also using the adorable ["Sunny Land" art pack by Ansimuz](https://opengameart.org/content/sunny-land-2d-pixel-art-pack) for the art and character animations.

Here's the code for the player body:

{{< highlight python >}}
extends KinematicBody2D

export (int) var run_speed
export (int) var jump_speed
export (int) var gravity

enum {IDLE, RUN, JUMP}
var velocity = Vector2()
var state
var anim
var new_anim

func _ready():
    change_state(IDLE)

func change_state(new_state):
    state = new_state
    match state:
        IDLE:
            new_anim = 'idle'
        RUN:
            new_anim = 'run'
        JUMP:
            new_anim = 'jump_up'

func get_input():
    velocity.x = 0
    var right = Input.is_action_pressed('ui_right')
    var left = Input.is_action_pressed('ui_left')
    var jump = Input.is_action_just_pressed('ui_select')

    if jump and is_on_floor():
        change_state(JUMP)
        velocity.y = jump_speed
    if right:
        change_state(RUN)
        velocity.x += run_speed
    if left:
        change_state(RUN)
        velocity.x -= run_speed
    $Sprite.flip_h = velocity.x < 0
    if !right and !left and state == RUN:
        change_state(IDLE)

func _process(delta):
    get_input()
    if new_anim != anim:
        anim = new_anim
        $AnimationPlayer.play(anim)

func _physics_process(delta):
    velocity.y += gravity * delta
    if state == JUMP:
        if is_on_floor():
            change_state(IDLE)
    velocity = move_and_slide(velocity, Vector2(0, -1))

    if position.y > 600:
        get_tree().reload_current_scene()
{{< /highlight >}}

![alt](/godot_recipes/img/k2d_platf_sample.gif?width=300)

We're using a very rudimentary state machine to handle the transitions between the character's idle, running, and jumping states.

When using `move_and_slide()` the function returns a vector representing the
movement that remained after the slide collision occurred. Setting that value back
to the character's `velocity` allows us to smoothly move up and down slopes. Try
removing `velocity =` and see what happens if you don't do this.

Also note that we've added `Vector2(0, -1)` as the floor normal. This is a vector
pointing straight upward. This means that if the character collides with an object
that has this normal, it will be considered a floor.

Using the floor normal allows us to make jumping work, using `is_on_floor()`. This
function will only return `true` after a `move_and_slide()` collision where the
colliding body's normal is within 45 degrees of the given floor vector (this can
be adjusted by setting `floor_max_angle`).

This also allows you to implement other features like wall jumps using `is_on_wall()`,
for example.

## Conclusion

This introduction only scratches the surface of what's possible with KinematicBody2D.
As with all Godot nodes, <a href="http://docs.godotengine.org/en/latest/classes/class_kinematicbody2d.html" target="_blank">
the API documentation</a> is your friend, so reference it frequently until you're
comfortable with the class methods.

Kinematic bodies are so useful, that I'll probably do a followup "Know Your Nodes" exploring
more uses. Please comment below if you have ideas or suggestions for other examples you'd
like to see.

### <a href="/blog/img/KYN3.0_KinematicBody2D.zip">Download the sample project</a>
