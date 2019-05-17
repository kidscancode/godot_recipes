---
title: "Spritesheet animation"
weight: 1
draft: false
---

## Problem

You want to use a spritesheet containing 2D animations.

## Solution

Spritesheets are a common way for 2D animations to be distributed. In a spritesheet, all of the animation frames are packed into a single image.

For this demo, we'll be using the excellent "Adventurer" sprite by Elthen. You can get this and lots of other great art at[https://elthen.itch.io/](https://elthen.itch.io/).

![alt](/godot_recipes/img/Adventurer Sprite Sheet v1.1.png)

{{% notice warning %}}
Make sure the images in your spritesheet are laid out in a constant-sized grid. This will enable Godot to automatically slice them. If they're packed irregularly, you will not be able to use the following technique.
{{% /notice %}}

### Node setup

This animation technique uses a `Sprite` node to display the texture, and then we animate the changing frames with `AnimationPlayer`. This can work with any 2D node, but for this demo, we'll use a `KinematicBody2D`.

Add the following nodes to your scene:

- KinematicBody2D ("Player")
  - Sprite
  - CollisionShape2D
  - AnimationPlayer

Drag the spritesheet texture into the _Texture_ property of the `Sprite`. You'll see the entire spritesheet displayed in the viewport. To slice it up into individual frames, expand the "Animation" section in the Inspector and set the _Hframes_ to `13` and _Vframes_ to `8`. _Hframes_ and _Vframes_ are the number of horizontal and vertical frames in your spritesheet.

![alt](/godot_recipes/img/sprite_animation_01.png)

Try changing the _Frame_ property to see the image change. This is the property we’ll be animating.

### Adding animations

Select the `AnimationPlayer` and click the “Animation” button followed by “New"
. Name the new animation “idle”. Set the animation length to `2` and click the “Loop” button so that our animation will repeat (see below).

With the scrubber at time `0`, select the `Sprite` node. Set its _Animation/Frame_ to `0`, then click the key icon next to the value.

![alt](/godot_recipes/img/sprite_animation_02.png)

If you try playing the animation, you'll see it doesn't appear to do anything. That's because the last frame (12) looks the same as the first (0), but we're not seeing any of the frames in-between (1-11). To fix this, change the "Update Mode" of the track from its default value of "Discrete" to "Continuous". You can find this button at the end of the track on the right side.

![alt](/godot_recipes/img/sprite_animation_03.png)

Note that this will only work for spritesheets where the frames are already in order. If they are not, you'll have to keyframe each _Frame_ seperately along the timeline.

![alt](/godot_recipes/img/sprite_animation_04.gif)

Feel free to add the other animations yourself. For example, the "jump" animation is on frames `65` through `70`.

## Related recipes

- [Top-down character](http://kidscancode.org/godot_recipes/2d/topdown_movement/#option-1-8-way-movement)
- [Platform character](http://kidscancode.org/godot_recipes/2d/platform_character/)
- [Controlling animation states](http://kidscancode.org/godot_recipes/animation/animation_state_machine/)