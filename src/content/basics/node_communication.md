---
title: "Node communication (the right way)"
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

If you do this, you'll soon find that node references like this break easily. As soon as you change one thing about your scene tree, none of those references may be valid anymore.

Communication between nodes and scenes doesn't have to be complicated. There is a better way.

## Solution

As a general rule, nodes should manage their children, not the other way around. If you're using `get_parent()` or `get_node("..")`, then you're probably headed for trouble. Node paths like this are *brittle*, meaning they can break easily. The two main problems with this arrangement:

1. You can't test a scene independently. If you run the scene by itself or in a test scene that doesn't have the *exact* same node setup, `get_node()` will cause a crash.
2. You can't change things easily. If you decide to rearrange or redesign your tree, paths will no longer be valid.

A node or scene should be able to be instanced anywhere in your game, and it should make no assumptions about what its parent is going to be.

We'll go into detailed examples later in this tutorial, but for now, here's the "golden rule" of node communication:

> Get down, signal up.

If a node is calling a child (i.e. going "down" the tree), then `get_node()` is appropriate.

If a node needs to communicate "up" the tree, it should probably use a signal.

If you keep this rule in mind when designing your scene setup, you'll be well on your way to a maintainable, well-organized project.

### Using `get_node()`

See [Understanding node paths](/godot_recipes/basics/getting_nodes/)

### Using signals

### Using groups

Groups are another way to decouple, especially when you have a lot of similar objects that need to do the same thing.

#### Group example

asdf

### Using `owner`

`owner` is a `Node` property that's set automatically when you save a scene. Every node in that scene will have its `owner` set to the scene's root node. This makes for a convenient way to connect child signals up to the main node.



## Related recipes
