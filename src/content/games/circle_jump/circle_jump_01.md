+++
title = "Project setup"
date = 2019-04-09T20:23:50-07:00
weight = 1
draft = true
pre = "01. "
+++

Where to start? Depending on the game, and how fleshed-out your idea is, the
answer might be very different. In our case, I've cheated a little bit by making
a prototype of the game already and working out a few of the ideas ahead of time.
Still, it diverged a bit from my initial idea, and so might this series - time
will tell.

In a bigger project, you might start with **design document**, which could be
as simple as a page of notes or as complex as a 500-page treatise laying out
every detail of your game's world, plot, and mechanics. We've no need of anything
so involved here, so let's just go over the gameplan.

## Gameplan

In this game, the player controls a "ship" that jumps from circle to circle.
Jumping is initiated by a click or touch, and if you don't hit another circle,
you lose. The score is related to how long you survive, and the difficulty will
increase over time with circles that move, shrink, and/or expire. The idea is
fast-paced, short games with a "top that" feel. As much as possible, the art
will remain simple and clean, with visual and audio effects to add appeal.

## Getting started

Let's start with the project settings. We need to define our screen size/
behavior. We want this to be a mobile game so it's going to need to be portrait
mode and able to adjust to variable screen sizes, since there are so many
phone resolutions available.

Open Project Settings and find the _Display/Window_ section. Set the screen size
to `(480, 854)`, the _Handheld/Orientation_ to "Portrait", the _Stretch/Mode_
to "2d", and the _Stretch/Aspect_ to "Keep".

Next, in _Input Devices/Pointing_ enable "Emulate Touch From Mouse". This will
let us write the code only using screen touch events, but still play by using
the mouse on PC platforms.

### Project organization

To keep things organized, we're going to make folders for the game objects,
and under those folders additional folders to hold the assets that object
will need.

![alt](/godot_lessons/img/cj_01_01.png?width=200)

{{% notice note %}}
Organizing things this way takes a little more setup in the beginning, but will
result in a much more flexible project.
{{% /notice %}}
