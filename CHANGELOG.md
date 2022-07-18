# Change Log

All notable changes to the "unsaved-files-vscode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 1.4.3 - 2022-07-19

### Added

- Also released on [github.com](https://github.com/wraith13/open-in-github-desktop-vscode/releases)
- VSIX download link in README.md

### Security

- npm audit fix

## 1.4.2 - 2021-06-20

### Changed

- Updated internal package.

### Security

- npm audit fix

## 1.4.1 - 2020-12-03

### Changed

- `activationEvents`: `*` -> `onStartupFinished`

## 1.4.0 - 2020-11-22

### Changed

- Changed the warning message from modal to non-modal.

## 1.3.0 - 2020-11-05

### Added

- `openInGithubDesktop.diagnosticWarning` setting
- `openInGithubDesktop.unsavedWarning` setting

## 1.2.1 - 2020-10-22

### Fixed

- Fixed an issue that did not work if the active document did not exist on the file system.

## 1.2.0 - 2019-10-02

### Added

- '.git/config' is searched from parent folders of the currently open text file.

### Changed

- Changed that 'traversalSearchGitConfig' setting take effect immediately. ( Does not requires a restart to take effect. )

## 1.1.2 - 2019-07-18

### Removed

- Removed the description of [Does not work at all with VS Code v1.36](https://github.com/wraith13/open-in-github-desktop-vscode/issues/1) from REAME.

## 1.1.1 - 2019-07-08

### Added

- Describe to REAMDE about [Does not work at all with VS Code v1.36](https://github.com/wraith13/open-in-github-desktop-vscode/issues/1).

## 1.1.0 - 2019-06-21

### Added

- '.git/config' is also searched from parent folders.

### Fixed

- Fixed application keys in README.

## 1.0.2 - 2019-06-19

### Fixed

- Fixed some words in README.

## 1.0.1 - 2019-06-19

### Fixed

- Fixed image URLs in README.

## 1.0.0 - 2019-06-19

### Added

- Initial release of `Open In GitHub Desktop`.

## [Unreleased]

## 0.0.0 - 2019-06-17

### Added

- Start this project.
