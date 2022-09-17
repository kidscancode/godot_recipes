---
title: "Updating AdMob Plugin (3.2.1)"
weight: 13
draft: true
pre: "13. "
---

## Installing

Since we set up mobile ads in [Part 11](/godot_recipes/3.x/games/circle_jump/circle_jump_11/), there have been significant updates to the way Godot handles Android plugins, as well as to the AdMob SDK. If your game is working, you probably don't need to change anything (yet). If you're building a new game, you should follow these steps.

As before we're using the [Shin-NiL Android AdMob Plugin](https://github.com/Shin-NiL/Godot-Android-Admob-Plugin). Download the zip file from the "Releases" tab.

The first step is to install the Android custom build template in your project:

![alt](/godot_recipes/3.x/img/admob_3.2_03.png)

Unzip the plugin and place the `admob-plugin` folder into `res://android/` and the `admob-lib` folder in `res://`.

We need to edit two files:

* `res://android/build/gradle.properties`

Add the following lines:

```
android.useAndroidX=true
android.enableJetifier=true
```

* `res://android/admob-plugin/AndroidManifest.conf`

Paste your AdMob application ID into the `android:value=""/>` line, replacing the sample app-id.

## Configuration

Now we can add the `AdMob` node to the `Main` scene:

![alt](/godot_recipes/3.x/img/admob_3.2_01.png)

Clicking on it, we can see a set of exported properties for configuring the node. This is where we'll paste our ad unit ids and configure real/test ads, etc.

![alt](/godot_recipes/3.x/img/admob_3.2_02.png)

Note that the `AdMob` node provides signals you can connect, notifying you when ads load, close, or fail to load. We're not using "rewarded" ads in this game, but the signals for those enable you to issue the rewards at the appropriate time.


Using the older plugin, we had handled initializing the plugin and showing/hiding ads in the `settings` singleton. We can now remove that code, because the `AdMob` node handles it. Instead, we can replace those calls in `Main` with calls to the `AdMob` node:

```gdscript
onready var admob = $Admob
```

Anywhere we called `settings.hide_ad_banner()`, etc. we can replace with the new equivalent:

```gdscript
admob.show_interstitial()

admob.show_banner()
```