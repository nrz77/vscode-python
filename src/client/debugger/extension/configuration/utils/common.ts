/* eslint-disable @typescript-eslint/no-explicit-any */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { WorkspaceFolder, window, TextEditor, WorkspaceEdit, workspace } from 'vscode';
import { getWorkspaceFolder } from './workspaceFolder';

/**
 * @returns whether the provided parameter is a JavaScript String or not.
 */
function isString(str: any): str is string {
    if (typeof str === 'string' || str instanceof String) {
        return true;
    }

    return false;
}

export function resolveVariables(
    value: string | undefined,
    rootFolder: string | undefined,
    folder: WorkspaceFolder | undefined,
): string | undefined {
    if (value) {
        const workspaceFolder = folder ? getWorkspaceFolder(folder.uri) : undefined;
        const variablesObject: { [key: string]: any } = {};
        variablesObject.workspaceFolder = workspaceFolder ? workspaceFolder.uri.fsPath : rootFolder;

        const regexp = /\$\{(.*?)\}/g;
        return value.replace(regexp, (match: string, name: string) => {
            const newValue = variablesObject[name];
            if (isString(newValue)) {
                return newValue;
            }
            return match && (match.indexOf('env.') > 0 || match.indexOf('env:') > 0) ? '' : match;
        });
    }
    return value;
}

export function getActiveTextEditor(): TextEditor | undefined {
    const { activeTextEditor } = window;
    return activeTextEditor;
}

export function applyEdit(edit: WorkspaceEdit): Thenable<boolean> {
    return workspace.applyEdit(edit);
}
