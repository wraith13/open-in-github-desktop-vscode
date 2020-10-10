import * as vscode from 'vscode';
import * as fs from 'fs';
import * as process from 'process';
import * as vscel from '@wraith13/vscel';
import packageJson from "../package.json";
import localeEn from "../package.nls.json";
import localeJa from "../package.nls.ja.json";
const locale = vscel.locale.make(localeEn, { "ja": localeJa });
const isWindows = "win32" === process.platform;
const alignmentObject = Object.freeze
(
    {
        "none": undefined,
        "left": vscode.StatusBarAlignment.Left,
        "right": vscode.StatusBarAlignment.Right,
    }
);
module config
{
    export const root = vscel.config.makeRoot(packageJson);
    export const traversalSearchGitConfig = root.makeEntry<boolean>("openInGithubDesktop.traversalSearchGitConfig");
    export const traversalSearchGitConfigForCurrentDocument = root.makeEntry<boolean>("openInGithubDesktop.traversalSearchGitConfigForCurrentDocument");
    export module statusBar
    {
        export const label = root.makeEntry<string>("openInGithubDesktop.statusBar.Label");
        export const alignment = root.makeMapEntry("openInGithubDesktop.statusBar.Alignment", alignmentObject);
    }
}
module fx
{
    export const exists = (path: string): Thenable<boolean> => new Promise
    (
        resolve => fs.exists
        (
            path,
            exists => resolve(exists)
        )
    );
    export const readFile = (path: string): Thenable<{ err : NodeJS.ErrnoException | null, data : Buffer }> => new Promise
    (
        resolve => fs.readFile
        (
            path,
            (err : NodeJS.ErrnoException | null, data : Buffer) => resolve({ err, data })
        )
    );
}
const parseGitConifg = (gitConfigSource: string): { [section:string]: { [key:string]: string } } =>
{
    const result: { [section:string]: { [key:string]: string } } = { };
    const sectionRegExp = /^\[(.*)\]\s*$/;
    const keyValueRegExp = /^\s*([^=\s]*)\s*=\s*(.*)\s*$/;
    let section = "";
    gitConfigSource
        .replace(/\r\n/, "\n")
        .replace(/\r/, "\n")
        .split("\n")
        .filter(i => 0 < i.trim().length)
        .forEach
        (
            line =>
            {
                if (sectionRegExp.test(line))
                {
                    section = line.replace(sectionRegExp, "$1");
                    result[section] = result[section] || { };
                }
                else
                if (keyValueRegExp.test(line))
                {
                    const key = line.replace(keyValueRegExp, "$1");
                    const value = line.replace(keyValueRegExp, "$2");
                    if (undefined === result[section][key]) // なんらかのパーズエラーにより、本来別の section となるべき後方に出現する値で上書きしてしまわないようにする為のチェック
                    {
                        result[section][key] = value;
                    }
                }
                else
                {
                    console.error(`open-in-github-desktop:parseGitConifg: unknown line format in .git/config: ${line}`);
                }
            }
        );
    return result;
};
const regulateDirPath = (folder: string) => folder.replace(isWindows ? /\\$/: /\/$/,"");
const isRootDir = (folder: string) => isWindows ?
    (
        /^\w+\:$/.test(regulateDirPath(folder)) ||
        /^\\\\[^\\]+\\[^\\]+$/.test(regulateDirPath(folder))
    ):
    "" === regulateDirPath(folder);
const getParentDir = (folder: string) => regulateDirPath(folder).replace(isWindows ? /\\[^\\]*$/: /\/[^\/]*$/, "");
const searchGitConfig = async (folder: string, traversalSearch: boolean): Promise<string | null> =>
{
    const gitConfigPath = `${folder}/.git/config`;
    if (await fx.exists(gitConfigPath))
    {
        return gitConfigPath;
    }
    if (!isRootDir(folder) && traversalSearch)
    {
        return await searchGitConfig(getParentDir(folder), traversalSearch);
    }
    return null;
};
export const openExternal = (uri: string) => vscode.env.openExternal(vscode.Uri.parse(uri));
export const isDocumentOnFileSystem = (document: vscode.TextDocument) => "file" === document.uri.scheme;
export const openInGithubDesktop = async () =>
{
    const activeTextEditor = vscode.window.activeTextEditor;
    const searchForDocument = activeTextEditor && isDocumentOnFileSystem(activeTextEditor.document) && config.traversalSearchGitConfigForCurrentDocument.get("");
    const gitConfigPath =
        ((activeTextEditor && searchForDocument) ? await searchGitConfig(getParentDir(activeTextEditor.document.fileName), true): null) ||
        (vscode.workspace.rootPath ? await searchGitConfig(vscode.workspace.rootPath, config.traversalSearchGitConfig.get("")): null);
    if (null === gitConfigPath)
    {
        if (searchForDocument || vscode.workspace.rootPath)
        {
            await vscode.window.showErrorMessage(locale.map("openInGithubDesktop.notFoundGitConfig"));
        }
        else
        {
            await vscode.window.showErrorMessage(locale.map("openInGithubDesktop.notOpenFolderInThisWindow"));
        }
    }
    else
    {
        const { err, data } = await fx.readFile(gitConfigPath);
        if (err || !data)
        {
            await vscode.window.showErrorMessage(locale.map("openInGithubDesktop.canNotReadGitConfig"));
        }
        else
        {
            const gitConfigSource = data.toString();
            const gitConfig = parseGitConifg(gitConfigSource);
            const repositoryUrl = (gitConfig["remote \"origin\""] || { })["url"];
            if (!repositoryUrl)
            {
                await vscode.window.showErrorMessage(locale.map("openInGithubDesktop.notFoundRemoteOriginUrlInGitConfig"));
            }
            else
            {
                await openExternal(`x-github-client://openRepo/${repositoryUrl}`);
            }
        }
    }
};
export const activate = (context: vscode.ExtensionContext) =>
{
    context.subscriptions.push(vscode.commands.registerCommand('openInGithubDesktop', openInGithubDesktop));
    const alignment = config.statusBar.alignment.get("");
    if (alignment)
    {
        const statusBarButton = vscode.window.createStatusBarItem(alignment);
        statusBarButton.text = config.statusBar.label.get("");
        statusBarButton.command = `openInGithubDesktop`;
        statusBarButton.tooltip = locale.map("openInGithubDesktop.title");
        context.subscriptions.push(statusBarButton);
        statusBarButton.show();
    }
    context.subscriptions.push
    (
        vscode.workspace.onDidChangeConfiguration
        (
            async (event) =>
            {
                if
                (
                    event.affectsConfiguration("openInGithubDesktop")
                )
                {
                    config.root.entries.forEach(i => i.clear());
                }
            }
        )
    );
};
export const deactivate = () => { };
