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
({
    "none": undefined,
    "left": vscode.StatusBarAlignment.Left,
    "right": vscode.StatusBarAlignment.Right,
});
const hasError = () => vscode.languages.getDiagnostics().some
(
    f => f[1].some(d => vscode.DiagnosticSeverity.Error === d.severity)
);
const hasErrorOrWarning = () => vscode.languages.getDiagnostics().some
(
    f => f[1].some
    (
        d =>
            vscode.DiagnosticSeverity.Error === d.severity ||
            vscode.DiagnosticSeverity.Warning === d.severity
    )
);
const hasUnsavedExistingFiles = () => 0 < vscode.workspace.textDocuments
    .filter(i => i.isDirty && !i.isUntitled).length;
const hasUnsavedFiles = () => 0 < vscode.workspace.textDocuments
    .filter(i => i.isDirty || i.isUntitled).length;
const diagnosticWarningObject = Object.freeze
({
    "none": async () => true,
    "error": async () => ! hasError() ||
        "Continue" === await locale.showWarningMessage
        (
            { map: "You have error.", },
            "Continue",
            "Cancel",
        ),
    "error or warning": async () =>  ! hasErrorOrWarning() ||
        "Continue" === await locale.showWarningMessage
        (
            { map: "You have error or warning.", },
            "Continue",
            "Cancel"
        ),
});
const unsavedWarningObject = Object.freeze
({
    "none": async () => true,
    "unsaved existing files": async () =>  ! hasUnsavedExistingFiles() ||
        "Continue" === await locale.showWarningMessage
        (
            { map: "You have unsaved existing files.", },
            "Continue",
            "Cancel"
        ),
    "unsaved files": async () => ! hasUnsavedFiles() ||
        "Continue" === await locale.showWarningMessage
        (
            { map: "You have unsaved files.", },
            "Continue",
            "Cancel"
        ),
});
module Config
{
    export const root = vscel.config.makeRoot(packageJson);
    export const traversalSearchGitConfig = root.makeEntry<boolean>("openInGithubDesktop.traversalSearchGitConfig", "active-workspace");
    export const traversalSearchGitConfigForCurrentDocument = root.makeEntry<boolean>("openInGithubDesktop.traversalSearchGitConfigForCurrentDocument", "active-workspace");
    export module statusBar
    {
        export const label = root.makeEntry<string>("openInGithubDesktop.statusBar.Label", "root-workspace");
        export const alignment = root.makeMapEntry("openInGithubDesktop.statusBar.Alignment", "root-workspace", alignmentObject);
    }
    export const diagnosticWarning = root.makeMapEntry("openInGithubDesktop.diagnosticWarning", "active-workspace", diagnosticWarningObject);
    export const unsavedWarning = root.makeMapEntry("openInGithubDesktop.unsavedWarning", "active-workspace", unsavedWarningObject);
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
    const searchForDocument = activeTextEditor && isDocumentOnFileSystem(activeTextEditor.document) && Config.traversalSearchGitConfigForCurrentDocument.get("default-scope");
    const gitConfigPath =
        ((activeTextEditor && searchForDocument) ? await searchGitConfig(getParentDir(activeTextEditor.document.fileName), true): null) ||
        (vscode.workspace.rootPath ? await searchGitConfig(vscode.workspace.rootPath, Config.traversalSearchGitConfig.get("default-scope")): null);
    if (null === gitConfigPath)
    {
        if (searchForDocument || vscode.workspace.rootPath)
        {
            await locale.showErrorMessage({ map: "openInGithubDesktop.notFoundGitConfig", });
        }
        else
        {
            await locale.showErrorMessage({ map: "openInGithubDesktop.notOpenFolderInThisWindow", });
        }
    }
    else
    {
        const { err, data } = await fx.readFile(gitConfigPath);
        if (err || !data)
        {
            await locale.showErrorMessage({ map: "openInGithubDesktop.canNotReadGitConfig", });
        }
        else
        {
            const gitConfigSource = data.toString();
            const gitConfig = parseGitConifg(gitConfigSource);
            const repositoryUrl = (gitConfig["remote \"origin\""] || { })["url"];
            if (!repositoryUrl)
            {
                await locale.showErrorMessage({ map: "openInGithubDesktop.notFoundRemoteOriginUrlInGitConfig", });
            }
            else
            if
            (
                await Config.diagnosticWarning.get("default-scope")() &&
                await Config.unsavedWarning.get("default-scope")()
            )
            {
                await openExternal(`x-github-client://openRepo/${repositoryUrl}`);
            }
        }
    }
};
export const activate = (context: vscode.ExtensionContext) =>
{
    context.subscriptions.push(vscode.commands.registerCommand('openInGithubDesktop', openInGithubDesktop));
    const alignment = Config.statusBar.alignment.get("default-scope");
    if (alignment)
    {
        context.subscriptions.push
        (
            vscel.statusbar.createItem
            ({
                alignment,
                text: Config.statusBar.label.get("default-scope"),
                command: `openInGithubDesktop`,
                tooltip: locale.map("openInGithubDesktop.title"),
                withShow: true,
            })
        );
    }
    // context.subscriptions.push
    // (
    //     vscode.workspace.onDidChangeConfiguration
    //     (
    //         async (event) =>
    //         {
    //             if
    //             (
    //                 event.affectsConfiguration("openInGithubDesktop")
    //             )
    //             {
    //                 Config.root.entries.forEach(i => i.clear());
    //             }
    //         }
    //     )
    // );
};
export const deactivate = () => { };
