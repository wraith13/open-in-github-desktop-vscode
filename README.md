# Open In GitHub Desktop README

[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/version/wraith13.open-in-github-desktop.svg) ![installs](https://vsmarketplacebadge.apphb.com/installs/wraith13.open-in-github-desktop.svg) ![rating](https://vsmarketplacebadge.apphb.com/rating/wraith13.open-in-github-desktop.svg)](https://marketplace.visualstudio.com/items?itemName=wraith13.open-in-github-desktop)

Open in [GitHub Desktop](https://desktop.github.com/) from VS Code.

## Features

* Open in GitHub Desktop from command pallete.
* Open in GitHub Desktop from status bar.

![screen shot](https://raw.githubusercontent.com/wraith13/open-in-github-desktop-vscode/master/images/screenshot.png)

## Requirements

* [GitHub Desktop](https://desktop.github.com/) has been installed.

## Tutorial

### 0. ⬇️ Install `Open In GitHub Desktop`

Show extension side bar within VS Code(Mac:<kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>, Windows and Linux: <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>), type `open-in-github-desktop` and press <kbd>Enter</kbd> and click <kbd>Install</kbd>. Restart VS Code when installation is completed.

### 1. ➡️ Open In GitHub Desktop

Click item( see screen shot above ) in statub bar or launch Command Palette(Mac:<kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>P</kbd>, Windows and Linux: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Ctrl</kbd>+<kbd>P</kbd>), Execute `Open In GitHub Desktop` command.

### 2. 🔧 Next step

You can change [settings](#extension-settings) by `settings.json`.

Enjoy!

## Commands

* `Open In GitHub Desktop` : Open in GitHub Desktop from VS Code.

## Extension Settings

This extension contributes the following settings by [`settings.json`](https://code.visualstudio.com/docs/customization/userandworkspace#_creating-user-and-workspace-settings)( Mac: <kbd>Command</kbd>+<kbd>,</kbd>, Windows / Linux: <kbd>File</kbd> -> <kbd>Preferences</kbd> -> <kbd>User Settings</kbd> ):

* `open-in-github-desktop.traverseSearchGitConfig`: '.git/config' is also searched from parent folders. Requires a restart to take effect.
* `open-in-github-desktop.statusBar.Label`: Label on status bar. Requires a restart to take effect.
* `open-in-github-desktop.statusBar.Alignment`: Alignment on status bar. Requires a restart to take effect.

You can embed icons in the label text by leveraging the syntax:

`My text $(icon-name) contains icons like $(icon'name) this one.`

Where the icon-name is taken from the [octicon](https://octicons.github.com) icon set, e.g. `light-bulb`, `thumbsup`, `zap` etc.

You can specify unicode characters ( include emoji ) as label text too.

## Keyboard shortcut Settings

In default, Open In GitHub Desktop's commands doesn't apply keyboard shortcuts. Althogh,
you can apply keyboard shortcuts by [`keybindings.json`](https://code.visualstudio.com/docs/customization/keybindings#_customizing-shortcuts)
( Mac: <kbd>Code</kbd> -> <kbd>Preferences</kbd> -> <kbd>Keyboard Shortcuts</kbd>, Windows / Linux: <kbd>File</kbd> -> <kbd>Preferences</kbd> -> <kbd>Keyboard Shortcuts</kbd>).

Command name on `keybindings.json` is diffarent from on Command Pallete. See below table.

|on Command Pallete|on keybindings.json|
|-|-|
|`Open In GitHub Desktop`|`open-in-github-desktop`|

## Release Notes

see ChangLog on [marketplace](https://marketplace.visualstudio.com/items/wraith13.open-in-github-desktop/changelog) or [github](https://github.com/wraith13/open-in-github-desktop-vscode/blob/master/CHANGELOG.md)

## Support

[GitHub Issues](https://github.com/wraith13/open-in-github-desktop-vscode/issues)

## License

[Boost Software License](https://github.com/wraith13/open-in-github-desktop-vscode/blob/master/LICENSE_1_0.txt)
