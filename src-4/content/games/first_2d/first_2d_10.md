---
title: "Starting and Ending the Game"
weight: 10
draft: false
pre: "10. "
---

Our last step is to add a start button and a "game over" state to the game.

## Starting the game

Currently when we run the game, it starts immediately. Let's add a button to start it.

In `Main` as a child of the `CanvasLayer`, add a {{< gd-icon CenterContainer >}}`CenterContainer` and set its layout to **Full Rect**. Then add a {{< gd-icon TextureButton >}}`TextureButton` child. Name this button `Start` and add the `START (48 x 8).png` image as its **Normal** texture.

Add a reference at the top of the script:

```gdscript
@onready var start_button = $CanvasLayer/CenterContainer/Start
```

Connect this button's `pressed` texture to `Main` and add this code:

```gdscript
func _on_start_pressed():
    start_button.hide()
    new_game()
```

The `new_game()` function handles starting the game, so change `_ready()` so that it no longer spawns enemies, but just ensures the button is showing:

```gdscript
func _ready():
    start_button.show()
#	spawn_enemies()
```

Now add the `new_game()` function:

```gdscript
func new_game():
    score = 0
    $CanvasLayer/UI.update_score(score)
    $Player.start()
    spawn_enemies()
```

Now the button should show when you run the scene, and pressing it starts the game.

## Ending the game

Add a {{< gd-icon TextureRect >}}`TextureRect` as a child of the `CenterContainer` and name the node `GameOver`. Use the `GAME_OVER (72 x 8).png` image. It will overlap with the start button, but that's ok, we're only ever going to show one at a time.

Add another reference at the top of the script:

```gdscript
@onready var game_over = $CanvasLayer/CenterContainer/GameOver
```

And add `game_over.hide()` to `_ready()`.

Connect the player's `died` signal in `Main`.

```gdscript
func _on_player_died():
    get_tree().call_group("enemies", "queue_free")
    game_over.show()
    await get_tree().create_timer(2).timeout
    game_over.hide()
    start_button.show()
```

This will show the "game over" image for 2 seconds, then switch back to the start button so you can play again. Try it out and see if you can play a few games.

| {{% button href="/godot_recipes/4.x/games/first_2d/first_2d_09/" icon="fas fa-arrow-left" %}}Prev{{% /button %}} | {{% button href="/godot_recipes/4.x/games/first_2d/first_2d_end/" icon="fas fa-arrow-right" icon-position="right" %}}Next{{% /button %}} |
|------|------:|
