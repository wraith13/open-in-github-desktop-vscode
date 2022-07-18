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

* `openInGithubDesktop.traversalSearchGitConfig`: '.git/config' is also searched from parent folders.
* `openInGithubDesktop.traversalSearchGitConfigForCurrentDocument`: '.git/config' is searched from parent folders of the currently open text file.
* `openInGithubDesktop.statusBar.Label`: Label on status bar. Requires a restart to take effect.
* `openInGithubDesktop.statusBar.Alignment`: Alignment on status bar. Requires a restart to take effect.
* `openInGithubDesktop.diagnosticWarning`: Warning display when there are error or warning.
* `openInGithubDesktop.unsavedWarning`: Warning display when there are unsaved existing files.

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
|`Open In GitHub Desktop`|`openInGithubDesktop`|

## Release Notes

see ChangLog on [marketplace](https://marketplace.visualstudio.com/items/wraith13.open-in-github-desktop/changelog) or [github](https://github.com/wraith13/open-in-github-desktop-vscode/blob/master/CHANGELOG.md)

## Support

[GitHub Issues](https://github.com/wraith13/open-in-github-desktop-vscode/issues)

## License

[Boost Software License](https://github.com/wraith13/open-in-github-desktop-vscode/blob/master/LICENSE_1_0.txt)

## Download VSIX file ( for VS Code compatible softwares )

[Releases · wraith13/open-in-github-desktop-vscode](https://github.com/wraith13/open-in-github-desktop-vscode/releases)

## Other extensions of wraith13's work

|Icon|Name|Description|
|---|---|---|
|![](https://wraith13.gallerycdn.vsassets.io/extensions/wraith13/bracket-lens/1.0.0/1603272166087/Microsoft.VisualStudio.Services.Icons.Default) |[Bracket Lens](https://marketplace.visualstudio.com/items?itemName=wraith13.bracket-lens)|Show bracket header on closing bracket.|
|![](https://wraith13.gallerycdn.vsassets.io/extensions/wraith13/background-phi-colors/3.1.0/1581619161244/Microsoft.VisualStudio.Services.Icons.Default) |[Background Phi Colors](https://marketplace.visualstudio.com/items?itemName=wraith13.background-phi-colors)|This extension colors the background in various ways.|
|![](https://wraith13.gallerycdn.vsassets.io/extensions/wraith13/zoombar-vscode/1.2.1/1563089420894/Microsoft.VisualStudio.Services.Icons.Default) |[Zoom Bar](https://marketplace.visualstudio.com/items?itemName=wraith13.zoombar-vscode)|Zoom UI in status bar for VS Code.|

See all wraith13's  expansions: <https://marketplace.visualstudio.com/publishers/wraith13>
