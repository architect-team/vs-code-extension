/* eslint-disable @typescript-eslint/explicit-function-return-type */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext } from "vscode";
import { LanguageClientOptions } from "vscode-languageclient";
import {
  startClient,
  ArchitectioLanguageClientConstructor,
  RuntimeEnvironment,
} from "../extension";
import { LanguageClient } from "vscode-languageclient/browser";
import { IArchitectioSchemaCache } from "../content-provider";

// this method is called when vs code is activated
export async function activate(context: ExtensionContext): Promise<void> {
  const extensionUri = context.extensionUri;
  const serverMain = extensionUri.with({
    path: extensionUri.path + "/dist/languageserver-web.js",
  });
  try {
    const worker = new Worker(serverMain.toString());
    const newArchitectioLanguageClient: ArchitectioLanguageClientConstructor = (
      id: string,
      name: string,
      clientOptions: LanguageClientOptions
    ) => {
      return new LanguageClient(id, name, clientOptions, worker);
    };

    const architectSchemaCache: IArchitectioSchemaCache = {
      getETag: () => undefined,
      getSchema: () => undefined,
      putSchema: () => Promise.resolve(),
    };

    const runtime: RuntimeEnvironment = {
      schemaCache: architectSchemaCache,
    };
    startClient(context, newArchitectioLanguageClient, runtime);
  } catch (e) {
    console.log(e);
  }
}
