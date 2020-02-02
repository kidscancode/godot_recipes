---
title: "Touchscreen Camera"
weight: 12
draft: false
---

## Problem

You need a touch-controlled 2D camera for your mobile game.

## Solution

In this recipe, we'll create a generic 2D camera with multiple touch controls:

* Drag to pan
* Pinch to zoom

### Setup

Our camera will extend the built-in node, so add a `Camera2D` to a new scene and name it "TouchCamera". Save and attach a script.

Here are the variables we'll need:

```gdscript
extends Camera2D

export (NodePath) var target

# Optional: export these properties for convenient editing.
var target_return_enabled = true
var target_return_rate = 0.02
var min_zoom = 0.5
var max_zoom = 2
var zoom_sensitivity = 10
var zoom_speed = 0.05

var events = {}
var last_drag_distance = 0
```

If a `target` is assigned, then the camera can follow and/or automatically return to it. The other properties that control how the camera works:

* `target_return_enabled` - If this is `true`, the camera will automatically return to the target after dragging.
* `target_return_rate` - Controls how fast the camera returns to its target.
* `min_zoom` / `max_zoom` - Limits how far you can zoom in/out.
* `zoom_sensitivity` - Sets how sensitive pinch-to-zoom will be - it's the number of pixels' movement needed to "start" a zoom.
* `zoom_speed` - Used to smooth the zooming.

You can `export` these properties as well, if you'd like to be able to adjust them in the Inspector.

The other variables track the state of the camera. `events` is a dictionary that will hold the active touchscreen events, using the event's `index` as its key. `last_drag_distance` keeps track of the distance between the two drag events in a "pinch" gesture.

In the `_process()` function, we'll move the camera towards the target (if target return is enabled and there's no touch event active).

```gdscript
func _process(delta):
    if target and target_return_enabled and events.size() == 0:
        position = lerp(position, get_node(target).position, target_return_rate)
```

This will allow us to pan the camera around and it will return to the player when we release the touch.

Now we're ready to start adding the gestures, starting with "pan".

### Pan

{{% notice note %}}
You can test this gesture your computer by enabling "Emulate Touch From Mouse" in *Project Settings -> Input Devices -> Pointing*.
{{% /notice %}}

Just like mouse or keyboard events, touch events extend `InputEvent` and follow the same input priority. We'll use `_unhandled_input()` for processing so that other nodes, such as Control nodes, can process events first:

```gdscript
func _unhandled_input(event):
    if event is InputEventScreenTouch:
        if event.pressed:
            events[event.index] = event
        else:
            events.erase(event.index)
```

First we're checking for a touch event (`InputEventScreenTouch`). We add the event to the `events` dictionary. The event's `index` property is our dictionary's key. We also remove the event if it's not `pressed`, which means the touch has ended.

Next, we need to handle a drag that comes after the touch:

```gdscript
    if event is InputEventScreenDrag:
        events[event.index] = event
        if events.size() == 1:
            position += event.relative * zoom.x
```

If we get a drag event, we also add to the dictionary. Note that this will be *updating* the value - index `0` was already there from the first touch event, for example, and has now become a drag event.

If there's only one event active, then this must be a one-finger drag, and we can adjust our camera's position accordingly. Note that we need to scale the movement based on the current `zoom`, or else our drag movement will be disproportionately large when zoomed in and small when zoomed out.

Here's an example captured directly from a mobile device. The yellow circle indicates the touch location.

<video controls src="/godot_recipes/img/touch_camera_01.webm"></video>

### Zoom

{{% notice note %}}
You won't be able to test this gesture on your computer because it requires 2 touch events, which the mouse can't emulate.
{{% /notice %}}

A "pinch" gesture will trigger the camera to zoom. This happens when we detect *two* drag events. If the drag events move toward each other, we'll zoom in; away from each other, we'll zoom out.

```gdscript
if event is InputEventScreenDrag:
    events[event.index] = event
    if events.size() == 1:
        position += event.relative * zoom.x

    elif events.size() == 2:
        var drag_distance = events[0].position.distance_to(events[1].position)
        if abs(drag_distance - last_drag_distance) > zoom_sensitivity:
            var new_zoom = (1 + zoom_speed) if drag_distance < last_drag_distance else (1 - zoom_speed)
            new_zoom = clamp(zoom.x * new_zoom, min_zoom, max_zoom)
            zoom = Vector2.ONE * new_zoom
            last_drag_distance = drag_distance
```

Here we handle the case of `2` active drag events. `drag_distance` tells us how far apart they are, and we can compare it with `last_drag_distance` to see if it's larger or smaller. `zoom_speed` is a factor, so we'll be multiplying the zoom by `1.05` (for zooming in) and `0.95` (for zooming out). We can then clamp the resulting zoom so that it doesn't exceed our designated limits, and then assign the new `zoom` level. Finally, we update `last_drag_distance` for the next event.

<video controls src="/godot_recipes/img/touch_camera_02.webm"></video>

## Wrapping up

You can use this camera as a basis for your own camera needs. Here are some suggestions you can try to make yourself:

* Use `lerp()` to smooth the zooming.
* Automatically return zoom to default level.
* Double-tap to reset.
* Add more gestures -three fingers, etc.

For completeness, here's the full `TouchCamera.gd` script:

```gdscript
extends Camera2D

export (NodePath) var target

var target_return_enabled = true
var target_return_rate = 0.02
var min_zoom = 0.5
var max_zoom = 2
var zoom_sensitivity = 10
var zoom_speed = 0.05

var events = {}
var last_drag_distance = 0


func _process(delta):
    if target and target_return_enabled and events.size() == 0:
        position = lerp(position, get_node(target).position, target_return_rate)


func _unhandled_input(event):
    if event is InputEventScreenTouch:
        if event.pressed:
            events[event.index] = event
        else:
            events.erase(event.index)

    if event is InputEventScreenDrag:
        events[event.index] = event
        if events.size() == 1:
            position += event.relative * zoom.x
        elif events.size() == 2:
            var drag_distance = events[0].position.distance_to(events[1].position)
            if abs(drag_distance - last_drag_distance) > zoom_sensitivity:
                var new_zoom = (1 + zoom_speed) if drag_distance < last_drag_distance else (1 - zoom_speed)
                new_zoom = clamp(zoom.x * new_zoom, min_zoom, max_zoom)
                zoom = Vector2.ONE * new_zoom
                last_drag_distance = drag_distance
```
{{% notice note %}}
Download the project file here: [2d_touch_camera.zip](/godot_recipes/files/2d_touch_camera.zip)
{{% /notice %}}

## Related recipes

- [Input: Input Actions](/godot_recipes/input/input_actions/)
- [Drag-select multiple units](/godot_recipes/input/multi_unit_select/)


#### Like video?

*Coming Soon*
<!-- {{< youtube -R1rasEyuqY >}} -->
