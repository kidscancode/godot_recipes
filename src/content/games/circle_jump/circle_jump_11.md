---
title: "Mobile ads"
weight: 11
draft: false
pre: "11. "
---

## About ads

When building a free-to-play mobile game, you have two choices when it comes to monetization: in-app purchases and advertisement. In this part, we'll look at how to integrate a mobile ad platform (Admob) into your game.

Ads can be unpopular and whether to use them is a decision for the individual game developer to make. We're not making a decision on the pros and cons in this tutorial - we're here to show you how to put ads in your game *if you want them*.

## Set up Admob

Head over to [Admob](https://www.admob.com/) and create an account.

In the AdMob manager, create a new app - ours is titled "Circle Jump" - and specify the "Android" platform (we'll discuss iOS later).

In the "Circle Jump" app, you'll need to create three "Ad Units". These are the types of ads that you can show in your game. For this tutorial, we'll need a "Banner" and an "Interstitial". Each ad unit will have an "Ad Unit ID", a long string of characters - we'll need that later in the game.

![alt](/godot_recipes/img/cj_11_01.png)

## Using Godot modules

Godot doesn't include ad services by default, so it's necessary to use an engine module, or plugin, to add that functionality. You can find the module we'll be using here: [godot-admob](https://github.com/kloder-games/godot-admob).
On that page, you'll see a list of the methods provided by the plugin.

To use a custom engine module, the engine has to be recompiled. In the case of mobile platforms, that means recompiling the export templates because the default ones we downloaded from Godot weren't compiled with this module.

Compiling export templates is not difficult, but it does require setting up a build environment on your computer - downloading the required programs and libraries needed to build Godot. If you're new to this concept and interested in learning about it, see the [Compiling](https://docs.godotengine.org/en/latest/development/compiling/introduction_to_the_buildsystem.html) section of the official docs.

Fortunately, we won't need to compile custom export templates, because it's already been done for us. Head over to the [godot-custom-mobile-templates](https://github.com/Shin-NiL/godot-custom-mobile-template) Github repo. Click on "Releases" and download the version of the export templates that matches your version of Godot.

{{% notice warning %}}
The export template version **must** match the Godot editor version. If you're using a custom-built editor, you will also have to build the templates from the same code branch.
{{% /notice %}}

Unzip the templates somewhere on your computer (don't put them in the Circle Jump project folder).

## Configuring export

Back in the Godot editor, we need to make some changes to the export configuration. First, open _Project -> Project Settings_ and find the "Android" section. In the _Modules_ property is where you list the module(s) you want to use in your code. The module name is listed on the `godot-admob` page: "org/godotengine/godot/GodotAdMob". If you have more than one module, separate them with commas.

In the _Project -> Export_menu, we need to tell Godot to use the custom templates we downloaded. These are set in the "Custom Package" section. Click the folder icon and navigate to where you unzipped the templates. Make sure to add both the "Debug" and "Release" templates.

![alt](/godot_recipes/img/cj_11_02.png)

## Code

Now when we run the game (on Android), it will load that module. It's accessed via an engine singleton. Open `settings.gd` and add the following:

```gdscript
var admob = null
var real_ads = false
var banner_top = false
# Fill these from your AdMob account:
var ad_banner_id = ""
var ad_interstitial_id = ""
var enable_ads = true
```

These are our settings variables for the module. `real_ads` set to `false` puts us in "Test Ad" mode. You shouldn't change this to `true` until you're ready to release your game. `banner_top` toggles whether the banner ad should be shown at the top or bottom of the screen.

`ad_banner_id` and `ad_interstitial_id` should be filled with _your_ ad unit values from your AdMob account.

We need to initialize the module:

```gdscript
func _ready():
    if Engine.has_singleton("AdMob"):
        admob = Engine.get_singleton("AdMob")
        admob.init(real_ads, get_instance_id())
        admob.loadBanner(ad_banner_id, banner_top)
        admob.loadInterstitial(ad_interstitial_id)
```

We first check that the module singleton exists. If it's found, we can initialize the module and load the ad units.

```gdscript
func show_ad_banner():
    if admob and enable_ads:
        admob.showBanner()

func hide_ad_banner():
    if admob:
        admob.hideBanner()
```

Next, we have functions to let us show/hide the banner. We only want it showing in the menu screens, not during actual gameplay.

```gdscript
func show_ad_interstitial():
    if admob and enable_ads:
        admob.showInterstitial()
```

We'll use this function to show the interstitial ad at the end of a game.

```gdscript
func _on_interstitial_close():
    if admob and enable_ads:
        show_ad_banner()
```

The module looks for this callback to run any code when the interstitial ad closes. Since we'll be at the end of a game and going back to the menu, we'll show the banner again.

Now we need to call these functions from the game. Open `Main.gd` and add the following:

- In `new_game()`, add `settings.hide_ad_banner()`.
- At the end of `_on_Jumper_died()` add `settings.show_ad_interstitial()`.

Run the game on your device, and you should see the test ad appear:

![alt](/godot_recipes/img/cj_11_03.jpg)

## Disabling ads

Many games allow ads to be disabled, whether via in-app purchases, reaching a certain level, etc. In our case, we'll add it as a button on the "Settings" screen.

First, we'll change the `enable_ads` to give it a setter function:

```gdscript
var enable_ads = true setget set_enable_ads
```
And add the setter function:

```gdscript
func set_enable_ads(value):
    enable_ads = value
    if enable_ads:
        show_ad_banner()
    if !enable_ads:
        hide_ad_banner()
```

This will cause the banner add to appear/disappear instantly when pressing the button.

To add the button, we'll need a third row of buttons. Open the `BaseScreen` scene and duplicate the first HBoxContainer.

In the `SettingsScreen` scene add a `Button` called "Ads" to the middle row. Set its text to "Disable Ads", its _Custom Font_ (a size of 48 works well), and set its _Custom Styles_ all to "New StyleBoxEmpty". Don't forget to add the button to the "buttons" group.

In `Screens.gd`, add the following to the `match` statement that processes the buttons:

```gdscript
match button.name:
    "Ads":
        settings.enable_ads = !settings.enable_ads
        if settings.enable_ads:
            button.text = "Disable Ads"
        else:
            button.text = "Enable Ads"
```

![alt](/godot_recipes/img/cj_11_04.png)

Run the game on your device and verify that you can enable/disable ads.

----------

#### Follow this project on Github:

[https://github.com/kidscancode/circle_jump](https://github.com/kidscancode/circle_jump)

#### Do you prefer video?

{{< youtube 8SOw_Tmw2OI6qclA >}}
