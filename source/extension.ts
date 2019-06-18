import * as vscode from 'vscode';
import * as fs from 'fs';

module fx
{
    export function readdir(path : string)
        : Thenable<{ error : NodeJS.ErrnoException | null, files : string[] }>
    {
        return new Promise
        (
            resolve => fs.readdir
            (
                path,
                (error : NodeJS.ErrnoException | null, files : string[]) => resolve
                (
                    {
                        error,
                        files
                    }
                )
            )
        );
    }

    export function exists(path : string) : Thenable<boolean>
    {
        return new Promise
        (
            resolve => fs.exists
            (
                path,
                exists => resolve(exists)
            )
        );
    }

    export function readFile(path : string)
        : Thenable<{ err : NodeJS.ErrnoException | null, data : Buffer }>
    {
        return new Promise
        (
            resolve => fs.readFile
            (
                path,
                (err : NodeJS.ErrnoException | null, data : Buffer) => resolve({ err, data })
            )
        );
    }
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

export const openInGithubDesktop = async () =>
{
    if (vscode.workspace.rootPath)
    {
        const gitConfigPath = `${vscode.workspace.rootPath}/.git/config`;
        if (await fx.exists(gitConfigPath))
        {
            const { err, data } = await fx.readFile(gitConfigPath);
            if (!err && data)
            {
                const gitConfigSource = data.toString();
                const gitConfig = parseGitConifg(gitConfigSource);
                const repositoryUrl = (gitConfig["remote \"origin\""] || { })["url"];
                if (repositoryUrl)
                {
                    vscode.env.openExternal(vscode.Uri.parse(`x-github-client://openRepo/${repositoryUrl}`));
                }
                else
                {
                    vscode.window.showErrorMessage(".git/config 内に [remote \"origin\"]/url の情報が見つかりません。");
                }
            }
            else
            {
                vscode.window.showErrorMessage(".git/config を読み込めません。");
            }
        }
        else
        {
            vscode.window.showErrorMessage(".git/config が見つかりません。");
        }
    }
    else
    {
        vscode.window.showErrorMessage("このウィンドウではフォルダが開かれてません。");
    }
};

const applicationKey = "openInGithubDesktop";
class Config<valueT>
{
    public constructor
    (
        public name: string,
        public defaultValue: valueT,
        public validator?: (value: valueT) => boolean,
        public minValue?: valueT,
        public maxValue?: valueT
    )
    {

    }

    regulate = (rawKey: string, value: valueT): valueT =>
    {
        let result = value;
        if (this.validator && !this.validator(result))
        {
            // settings.json をテキストとして直接編集してる時はともかく GUI での編集時に無駄にエラー表示が行われてしまうので、エンドユーザーに対するエラー表示は行わない。
            //vscode.window.showErrorMessage(`${rawKey} setting value is invalid! Please check your settings.`);
            console.error(`${rawKey} setting value is invalid! Please check your settings.`);
            result = this.defaultValue;
        }
        else
        {
            if (undefined !== this.minValue && result < this.minValue)
            {
                result = this.minValue;
            }
            else
            if (undefined !== this.maxValue && this.maxValue < result)
            {
                result = this.maxValue;
            }
        }
        return result;
    }
    public get = (): valueT =>
    {
        let result = <valueT>vscode.workspace.getConfiguration(applicationKey)[this.name];
        if (undefined === result)
        {
            result = this.defaultValue;
        }
        else
        {
            result = this.regulate(`${applicationKey}.${this.name}`, result);
        }
        return result;
    }
}
const makeEnumValidator = (valueList: string[]): (value: string) => boolean => (value: string): boolean => 0 <= valueList.indexOf(value);
const alignmentObject = Object.freeze
(
    {
        "none": undefined,
        "left": vscode.StatusBarAlignment.Left,
        "right": vscode.StatusBarAlignment.Right,
    }
);

export const activate = (context: vscode.ExtensionContext) =>
{
    context.subscriptions.push(vscode.commands.registerCommand('openInGithubDesktop', openInGithubDesktop));

    const statusBarAlignment = new Config<keyof typeof alignmentObject>("statusBarAlignment", "right", makeEnumValidator(Object.keys(alignmentObject)));
    const alignment = alignmentObject[statusBarAlignment.get()];
    if (alignment)
    {
        const statusBarLabel = new Config("statusBarLabel", "$(arrow-right)$(mark-github)", text => undefined !== text && null !== text && "" !== text);
        const statusBarButton = vscode.window.createStatusBarItem(alignment);
        statusBarButton.text = statusBarLabel.get();
        statusBarButton.command = `openInGithubDesktop`;
        statusBarButton.tooltip = "Open In GitHub Desktop";
        context.subscriptions.push(statusBarButton);
        statusBarButton.show();
    }
};

export function deactivate() {}
