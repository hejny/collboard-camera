# Sample of Collboard module with tool, art, and attributes

Simple sample module for [Collboard.com](https://collboard.com/) created via [@collboard/modules-sdk](https://www.npmjs.com/package/@collboard/modules-sdk).



<a class="github-button" href="https://github.com/collboard/module-sample-objects/generate" data-icon="octicon-repo-template" aria-label="Use this template collboard/module-sample-objects on GitHub">Use this template</a>

[![Use this template](https://raw.githubusercontent.com/collboard/docs/main/buttons/use-this-template.button.png)](https://github.com/collboard/module-sample-objects/generate)
[![Gitpod ready-to-code](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

<!--TODO: Other badges like Use as template, tests, likes, Collboard working, open in Collboard,... + make it visually nicer -->



To start work, first `npm install` dependencies and then run `colldev` CLI util:

```bash
# Linux, WSL
colldev

# Windows, PowerShell
npx colldev
```

Colldev will automatically look into the [package.json](./package.json) find **main** entry _(it can be typescript or javascript file)_. And watch, build and serve changes to Collboard in development mode.

Then you open [Collboard in developer mode - dev.collboard.com](https://dev.collboard.com) and there you will see modules that you are working on.

Most of the modules make sense on the board (not the homepage) **so you will probably need to create a new board**.

These modules will be automatically installed & hot reloaded _(uninstalled+installed)_ as you go.

Notice that boards+its contents created under development mode will be automatically erased after some time.

## Types of modules in Collboard

You can create pretty much anything as a module as long as it follows some [basic rules](https://github.com/collboard/modules-sdk#3-create-the-main-file). We have, however, prepaired a list of few most common module types which you should start with:

### Arts

We call art anything, that gets synchronized to all users on a single board. Art can be anything including the more obvious ones, like [freehand drawing](src/SampleArt.tsx), images or HTML content all the way to the less obvious ones, like chat messages, module syncers, information about connected users or a [cornerstone art](https://collboard.github.io/modules-sdk/classes/cornerstoneart.html), which keeps basic information about each board.

All arts must extend a [`AbstractArt`](https://collboard.github.io/modules-sdk/classes/abstractart.html) class or one of the more specific ones, like [`Abstract2dBoxArt`](https://collboard.github.io/modules-sdk/classes/abstract2dboxart.html) (see Hierarchy).

Some art types get rendered (everything extending `Abstract2dArt` will get rendered as a part of board canvas), some only hold information for the application (eg. [cornerstone art](https://collboard.github.io/modules-sdk/classes/cornerstoneart.html)) and don't get rendered by default. You can, however, create your own renderers for a specific group of arts.

When you decide to create your first art module, you should decide, which kind of art you plan to implement and that should lead to a decision on which class you should extend.

To turn your class into a module, use [`makeArtModule`](https://collboard.github.io/modules-sdk/modules.html#makeartmodule) maker. You only need to specify the class itself and a unique `name` identifier used for serialization.

**Important:** Please create a prefix for your art module names since they need to be unique across the whole system. If the name is not unique, it may cause confusion and the system may not work correctly!

_See [SampleArt](src/SampleArt.tsx) for a sample art module._

### Attributes

You can imagine attributes as fancy getters and setters for arts. Every `AbstractPlacedArt` holds information about [attributes the specific art supports](https://collboard.github.io/modules-sdk/classes/abstractplacedart.html#acceptedattributes). This list of accepted attributes is used in order to render the floating menu above selection. You can use some internal, premade attributes, such as `color`, line `weight`, `fontSize`, `fontStyle` or `listStyle` as well as create your own.

While the floating menu gets rendered automatically from accepted attributes, a submenu for tools needs to be constructed manualy. You can use `attributesSystem.inputRender('attribute name')` for that purpose.

[Manifest](src/DashpatternAttribute.tsx) for a attribute module takes few basic keys:

-   `attribute` describing the attribute properties, such as
    -   `name` - unique identifier of a attribute used in [`AbstractPlacedArt.acceptedAttributes`](https://collboard.github.io/modules-sdk/classes/abstractplacedart.html#acceptedattributes) or [`AttributesSystem.inputRender`](https://collboard.github.io/modules-sdk/classes/attributessystem.html#inputrender)
    -   `type` - value type (one of `string`, `number`, `boolean`, `object`)
    -   `defaultValue`
-   `inputRender` containing a function returning JSX.Element with a attribute menu

**Important:** Please create a prefix for your attribute module names since they need to be unique across the whole system. If the name is not unique, it may cause confusion and the system may not work correctly!

_See [DashpatternAttribute](src/DashpatternAttribute.tsx) for a sample attribute module._

### Tools

Tools are modules closest to an average Collboard user. They allow users to interact with a board, create new arts or modify existing ones. Basically all the icons you can see in the toolbar at the bottom of te UI are tools.

In the Collboard sense, you can imagine tools as a module activated by icon - hence the maker name [`makeIconModuleOnModule`](https://collboard.github.io/modules-sdk/modules.html#makeiconmoduleonmodule).

In [manifest](src/SampleTool.tsx), you specify few things:

-   `toolbar` is the place where icons get placed. You can choose from the [toolbars](https://collboard.github.io/modules-sdk/enums/toolbarname.html) already present on Collboard
-   `icon` can be either static object, or a function taking [systemsContainer](https://collboard.github.io/modules-sdk/interfaces/isystems.html) as an only argument. You specify not only the visuals of the icon, but also a layout of submenu displayed, when icon is selected.
-   `moduleActivatedByIcon` can be any other module manifest (or a module factory) of the tool itself

We suggest using `touchController` system for capturing user actions on board and taking appropriate actions when the module is active.

_See [SampleTool](src/SampleTool.tsx) for a sample tool module._
