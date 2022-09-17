---
title: "Understanding tree order"
weight: 1
draft: false
ghcommentid: 9
---

## Problem

You need to understand in what order Godot handles nodes in the scene tree.

## Solution

"Tree order" is mentioned often in the Godot docs and in tutorials. However, it is not always obvious to a beginner what is meant by this. Generally speaking, the order in which nodes are handled in the tree is in *top-down* fashion, starting at the root and going down each branch in turn.

Scene tree order is something that can cause a great deal of confusion for Godot beginners. In this example, we'll illustrate in what order things happen.

Here's our sample node setup:

![alt](/4.x/img/tree_order_01.png)

On each node, we have the following script attached:

```gdscript
extends Node

func _init():
    # Note: a Node doesn't have a "name" yet here.
    print("TestRoot init")

func _enter_tree():
    print(name + " enter tree")

func _ready():
    print(name + " ready")

# This ensures we only print *once* in process().
var test = true
func _process(delta):
    if test:
        print(name + " process")
    test = false
```

Before we talk about the results, let's review what each of these callback functions represents:

* `_init()` is called when the object is first created. It now exists in the computer's memory.

* `_enter_tree()` is called when the node first enters the tree. This can be when instancing or when `add_child()` is used, for example.

* `_ready()` is called when the node *and its children* have all been added to the tree and are ready.

* `_process()` is called every frame (typically 60 times per second) on every node in the tree.

If we ran this on a single node all by itself, the order would be as you might expect:

```
TestRoot init
TestRoot enter tree
TestRoot ready
TestRoot process
```

Once we add children to the mix, it becomes a bit more complex, and probably needs some clarification:

```
TestRoot init
TestChild1 init
TestChild3 init
TestChild2 init

TestRoot enter tree
TestChild1 enter tree
TestChild3 enter tree
TestChild2 enter tree

TestChild3 ready
TestChild1 ready
TestChild2 ready
TestRoot ready

TestRoot process
TestChild1 process
TestChild3 process
TestChild2 process
```

As you can see, all of these nodes printed their messages in tree order, from top to bottom, following branches first - with the exception of the `_ready()` code.

Here's a quote from the [Node reference](https://docs.godotengine.org/en/3.2/classes/class_node.html#class-node-method-ready):

> Called when the node is "ready", i.e. when both the node and its children have entered the scene tree. If the node has children, their `_ready` callbacks get triggered first, and the parent node will receive the ready notification afterwards.

This leads to an important rule-of-thumb to remember when setting up your node structure:

{{% notice tip %}}
Parent nodes should manage their children, **not** vice-versa.
{{% /notice %}}

This means any code in the parent must be able to fully access any data in its children. For that reason, `_ready()` must be processed in *reverse* tree order.

Remember this when trying to access other nodes in `_ready()`. If you need to go up the tree to a parent (or grandparent), you should probably run that code in the parent rather than the child.

## Related recipes

- [Understanding node paths](/3.x/basics/getting_nodes/)