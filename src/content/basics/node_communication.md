---
title: "Finding nodes (the right way)"
weight: 2
draft: true
---

{{% notice info %}}
Many thanks to @TheDuriel on the [Godot Discord](https://discord.gg/zH7NUgz) for the [original diagram](https://cdn.discordapp.com/attachments/319225525052899328/585172151913676800/HowToSceneTree.jpg) that inspired this article.
{{% /notice %}}

## Problem

Your project has started getting complex. You have multiple scenes, instances, and a _lot_ of nodes. You've probably found yourself writing code like the following:

```gdscript
get_node("../../SomeNode/SomeOtherNode")
get_parent().get_parent().get_node("SomeNode")
get_tree().get_root().get_node("SomeNode/SomeOtherNode")
```

If you do, you'll soon find that node references like this break easily. As soon as you change one thing about your scene tree, none of those references may be valid anymore.

Communication between nodes and scenes doesn't have to be complicated. There is a better way.

## Solution

As a general rule, nodes should manage their children, not the other way around. If you're using `get_parent()` or `get_node("..")`, then you're headed for trouble. A node or scene may be instanced anywhere in your game, and it should make no assumptions about what its parent is going to be.

We'll go into detailed examples later in this tutorial, but for now, here's the "golden rule" of node communication:

> Get down, signal up.

If a node is calling a child (i.e. going "down" the tree), then `get_node()` is appropriate.

If a node needs to communicate "up" the tree, it should use a signal.

Keep this rule in mind

### Using `get_node()`

### Using signals

### Using groups

### Using `owner`


## Related recipes
