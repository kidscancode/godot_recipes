---
title: "Organize your project"
weight: 1
draft: true
---

## Problem

You're starting a new project. Soon, your project folder will be full of scenes, assets, scripts, and more. How do you keep it all organized?

## Solution

There are as many solutions to this problem as there are game projects. A lot will depend on the nature of your game and resources it needs. However, there are a few common guidelines to follow.

### Organize by type

Often, beginners will organize their projects like this:

```markdown
- res://
    - scenes
    - scripts
    - images
    - ...
```

**Don't do this!** Putting all your `.gd` files in the same folder may seem like it's organized, but as your project grows, it will become difficult to find what you're looking for in a folder full of scripts.

### Organize by category

One common solution is to divide your project files into a hierarchy folders based on their game function. Your folders might look something like this:

```markdown
- res://
    - assets
        - textures
        - sounds
        - models
    - objects
        - entities
            - player
            - enemy
        - maps
    - UI
    - ...
```

In this system, you place any files that share a common purpose in the same location. In a large project, this can be vital, as the number of files can grow too large to manage otherwise.

### Planning for reusability

The drawback of the above method is a lack of portability. If you want to use your "Player" object in another project, you'll have to copy individual files from multiple folders. Instead, if everything related to your player - scenes, scripts, assets - is under the same folder, then you can move it between projects and everything stays together.
