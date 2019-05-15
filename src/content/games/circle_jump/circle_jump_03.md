---
title: "Limited circles"
weight: 3
draft: false
pre: "03. "
---

In the first two parts, we got the basic gameplay working. Now we're going to start adding some different modes to the circles.

## Circle modes

Eventually, we'll have many different modes, but we're going to start with the "limited" mode: the circle only allows a given number of orbits before disappearing. First, let's add a `Label` node to show the number of remaining orbits. Type a number (`1`) in the text field so we can see how it looks.

In the _Custom Fonts_ section, add a new `DynamicFont`, load the _Font Data_ from the assets folder, and set the _Size_ to `64`. To align the label, in the "Layout" menu, choose "Center".

Add the following new variables at the top of the `Circle.gd`:

```gdscript
enum MODES {STATIC, LIMITED}

var mode = MODES.STATIC
var num_orbits = 3  # Number of orbits until the circle disappears
var current_orbits = 0  # Number of orbits the jumper has completed
var orbit_start = null  # Where the orbits started
```

Next we need a way to set the mode:

```gdscript
func set_mode(_mode):
    mode = _mode
    match mode:
        MODES.STATIC:
            $Label.hide()
        MODES.LIMITED:
            current_orbits = num_orbits
            $Label.text = str(orbits_left)
            $Label.show()
```

Right now we have these two modes defined, but later we'll be adding more.

Let's also add to the `init()` method a way to pass a mode. The default should be `STATIC`, but we're going to use `LIMITED` now so we can test:

```gdscript
func init(_position, _radius=radius, _mode=MODES.LIMITED):
    set_mode(_mode)
```

The jumper is setting the rotation position when it's captured. Remove the line from `Jumper.gd` and put it in the circle's `capture()` method:

```gdscript
func capture(target):
    jumper = target
    $AnimationPlayer.play("capture")
    $Pivot.rotation = (jumper.position - position).angle()
    orbit_start = $Pivot.rotation
```

Note that we're now sending a reference to the jumper, so add `var jumper = null` at the top, and in the `Main.gd` script update the call to read `object.capture(player)`.

Now we can check to see if the jumper has gone full circle, and if so, decrement `current_orbits`:

```gdscript
func _process(delta):
    $Pivot.rotation += rotation_speed * delta
    if mode == MODES.LIMITED and jumper:
        check_orbits()

func check_orbits():
    # Check if the jumper completed a full circle
    if abs($Pivot.rotation - orbit_start) > 2 * PI:
        current_orbits -= 1
        $Label.text = str(current_orbits)
        if orbits_left <= 0:
            jumper.die()
            jumper = null
            implode()
        orbit_start = $Pivot.rotation
```

In order for this to work, we need to add a `die()` method to the jumper:

```gdscript
func die():
    target = null
    queue_free()

func _on_VisibilityNotifier2D_screen_exited():
    if !target:
        die()
```

We've also connected the jumper's `VisibilityNotifier2D` signal so that we can remove the player when it exits the screen.

If we try it out, everything looks good so far:

![alt](/godot_recipes/img/cj_03_01.gif)

### Circle effect

The last thing we'll do for this part is add a "fill" effect to the circle to show that the orbits are running out. To begin, we'll use some drawing code from the [official docs](https://docs.godotengine.org/en/latest/tutorials/2d/custom_drawing_in_2d.html#arc-polygon-function):


```gdscript
func draw_circle_arc_poly(center, radius, angle_from, angle_to, color):
    var nb_points = 32
    var points_arc = PoolVector2Array()
    points_arc.push_back(center)
    var colors = PoolColorArray([color])

    for i in range(nb_points + 1):
        var angle_point = angle_from + i * (angle_to - angle_from) / nb_points - PI/2
        points_arc.push_back(center + Vector2(cos(angle_point), sin(angle_point)) * radius)
    draw_polygon(points_arc, colors)
```

We'll call this function in `_draw()`:

```gdscript
func _draw():
    if jumper:
        var r = ((radius - 50) / num_orbits) * (1 + num_orbits - current_orbits)
        draw_circle_arc_poly(Vector2.ZERO, r, orbit_start + PI/2,
                            $Pivot.rotation + PI/2, Color(1, 0, 0))
```

Lastly, add `update()` to the `_physics_process` so that it will be called after every call to `check_orbits()`.

![alt](/godot_recipes/img/cj_03_02.gif)

In the next part we'll start adding some UI.

----------

#### Follow this project on Github:

[https://github.com/kidscancode/circle_jump](https://github.com/kidscancode/circle_jump)

#### Do you prefer video?

{{< youtube I1noxf5LV4I >}}