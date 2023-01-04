/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Copyright (c) Architect.io. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext } from "vscode";
import {
  startClient,
  ArchitectioLanguageClientConstructor,
  RuntimeEnvironment,
} from "../extension";
import {
  ServerOptions,
  TransportKind,
  LanguageClientOptions,
  LanguageClient,
} from "vscode-languageclient/node";
import { ArchitectioSchemaCache } from "../cache";

// this method is called when vs code is activated
export async function activate(context: ExtensionContext): Promise<void> {
  // The YAML language server is implemented in node
  const serverModule = context.asAbsolutePath("./dist/languageserver.js");

  // The debug options for the server
  const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  const newArchitectioLanguageClient: ArchitectioLanguageClientConstructor = (
    id: string,
    name: string,
    clientOptions: LanguageClientOptions
  ) => {
    return new LanguageClient(id, name, serverOptions, clientOptions);
  };

  const runtime: RuntimeEnvironment = {
    schemaCache: new ArchitectioSchemaCache(
      context.globalStorageUri.fsPath,
      context.globalState
    ),
  };

  startClient(context, newArchitectioLanguageClient, runtime);
}
