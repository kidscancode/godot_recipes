---
title: "Multitarget Camera"
weight: 11
draft: false
---

## Problem

You need a dynamic camera that moves and zooms to keep multiple objects on screen at the same time.

An example might be in a 2 player game, keeping both players on-screen as they move farther and closer together, like so:

![alt](/godot_recipes/4.x/img/multi_cam_01.gif)

## Solution

In a single-player game, you're probably used to attaching the camera to the player, so that it automatically follows them. We can't really do this here because we have 2 (or more) players or other game objects that we want to keep on the screen at all times.

We need our camera to do 3 things:

1. Add/remove any number of targets.
1. Keep the camera's position centered at the midpoint of the targets.
1. Adjust the camera's zoom to keep all targets on screen.

Create a new scene with a {{< gd-icon Camera2D >}}`Camera2D` and attach a script. We'll add this camera to our game once we're done.

Let's break down how the script works.

{{% notice note %}}
You can see the full script at the [end of the article](#full-script).
{{% /notice %}}

Here's how the script starts:

```gdscript
extends Camera2D

@export var move_speed = 30 # camera position lerp speed
@export var zoom_speed = 3.0  # camera zoom lerp speed
@export var min_zoom = 5.0  # camera won't zoom closer than this
@export var max_zoom = 0.5  # camera won't zoom farther than this
@export var margin = Vector2(400, 200)  # include some buffer area around targets

var targets = []  # Array of targets to be tracked.

@onready var screen_size = get_viewport_rect().size
```

These settings will let you adjust the camera's behavior. We'll `lerp()` all camera changes, setting the move/zoom speeds to low values will introduce some delay in the camera "catching up" to sudden changes.

Maximum and minimum zoom values will also depend on the size of objects in your game and how close or far you want to get. Adjust to suit.

The `margin` property is going to add some extra space around the targets so they're not right on the edge of the viewable area.

Lastly, we have our array of targets and we get the viewport size so that we can properly calculate the scale.

```gdscript
func add_target(t):
    if not t in targets:
        targets.append(t)

func remove_target(t):
    if t in targets:
        targets.erase(t)
```

For adding and removing targets, we have two helper functions. You can use these during gameplay to change what targets are being tracked ("Player 3 has entered the game!"). Note that we don't want to have the same target tracked twice, so we reject it if it's already there.

Most of the functionality happens in `_process()`. First, moving the camera:

```gdscript
func _process(delta):
    if !targets:
        return
    # Keep the camera centered between the targets
    var p = Vector2.ZERO
    for target in targets:
        p += target.position
    p /= targets.size()
    position = lerp(position, p, move_speed * delta)
```

Here, we loop through the targets' positions and find the common center. Using `lerp()` we make sure it moves there smoothly.

Next, we'll handle the zoom:

```gdscript
# Find the zoom that will contain all targets
var r = Rect2(position, Vector2.ONE)
for target in targets:
    r = r.expand(target.position)
r = r.grow_individual(margin.x, margin.y, margin.x, margin.y)
var z
if r.size.x > r.size.y * screen_size.aspect():
    z = 1 / clamp(r.size.x / screen_size.x, min_zoom, max_zoom)
else:
    z = 1 / clamp(r.size.y / screen_size.y, min_zoom, max_zoom)
zoom = lerp(zoom, Vector2.ONE * z, zoom_speed)
```

The key functionality here comes from `Rect2`. We want to find a rectangle that encloses all the targets, which we can get with the `expand()` method. We then grow the rect by the `margin`.

Here you can see the rectangle being drawn (press "Tab" in the demo project to enable this drawing):

![alt](/godot_recipes/4.x/img/multi_cam_02.gif)

Then, depending whether the rectangle is wider or taller (relative to the screen's aspect ratio), we find the scale and clamp it in the max/min range we've defined.

## Full script

```gdscript
extends Camera2D

@export var move_speed = 30 # camera position lerp speed
@export var zoom_speed = 3.0  # camera zoom lerp speed
@export var min_zoom = 5.0  # camera won't zoom closer than this
@export var max_zoom = 0.5  # camera won't zoom farther than this
@export var margin = Vector2(400, 200)  # include some buffer area around targets

var targets = []

@onready var screen_size = get_viewport_rect().size

func _process(delta):
    if !targets:
        return

    # Keep the camera centered among all targets
    var p = Vector2.ZERO
    for target in targets:
        p += target.position
    p /= targets.size()
    position = lerp(position, p, move_speed * delta)

    # Find the zoom that will contain all targets
    var r = Rect2(position, Vector2.ONE)
    for target in targets:
        r = r.expand(target.position)
    r = r.grow_individual(margin.x, margin.y, margin.x, margin.y)
    var z
    if r.size.x > r.size.y * screen_size.aspect():
        z = 1 / clamp(r.size.x / screen_size.x, max_zoom, min_zoom)
    else:
        z = 1 / clamp(r.size.y / screen_size.y, max_zoom, min_zoom)
    zoom = lerp(zoom, Vector2.ONE * z, zoom_speed * delta)

    # For debug
    get_parent().draw_cam_rect(r)

func add_target(t):
    if not t in targets:
        targets.append(t)

func remove_target(t):
    if t in targets:
        targets.remove(t)
```

## <i class="fas fa-code-branch"></i> Download This Project

Download the project's example code here: [https://github.com/godotrecipes/multitarget_camera](https://github.com/godotrecipes/multitarget_camera)
