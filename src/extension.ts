/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Adam Voss. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Copyright (c) Architect.io. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";

import { workspace, ExtensionContext, Uri } from "vscode";
import {
  BaseLanguageClient,
  LanguageClientOptions,
  RequestType,
  RevealOutputChannelOn,
} from "vscode-languageclient";
import { getSchemaContent, IArchitectioSchemaCache } from "./content-provider";

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace VSCodeContentRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const type: RequestType<string, string, any> = new RequestType(
    "vscode/content"
  );
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace FSReadFile {
  // eslint-disable-next-line @typescript-eslint/ban-types
  export const type: RequestType<string, string, {}> = new RequestType(
    "fs/readFile"
  );
}
let client: BaseLanguageClient;

export type ArchitectioLanguageClientConstructor = (
  name: string,
  description: string,
  clientOptions: LanguageClientOptions
) => BaseLanguageClient;

export interface RuntimeEnvironment {
  readonly schemaCache: IArchitectioSchemaCache;
}

export async function startClient(
  context: ExtensionContext,
  newArchitectioLanguageClient: ArchitectioLanguageClientConstructor,
  runtime: RuntimeEnvironment
): Promise<BaseLanguageClient> {
  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for on disk and newly created architectio documents
    documentSelector: [{ language: "architectio" }],
    synchronize: {
      // Notify the server about file changes to architectio files contained in the workspace
      fileEvents: [
        workspace.createFileSystemWatcher("**/architect.yaml"),
        workspace.createFileSystemWatcher("**/architect.yml"),
        workspace.createFileSystemWatcher("**/**.architect.yaml"),
        workspace.createFileSystemWatcher("**/**.architect.yml"),
      ],
    },
    revealOutputChannelOn: RevealOutputChannelOn.Never,
  };

  // Create the language client and start it
  client = newArchitectioLanguageClient(
    "architectio",
    "Architect.io",
    clientOptions
  );

  await client.start();

  client.onRequest(VSCodeContentRequest.type, () => {
    return getSchemaContent(runtime.schemaCache);
  });
  client.onRequest(FSReadFile.type, (fsPath: string) => {
    return workspace.fs
      .readFile(Uri.file(fsPath))
      .then((uint8array) => new TextDecoder().decode(uint8array));
  });

  return client;
}

export function logToExtensionOutputChannel(message: string): void {
  client.outputChannel.appendLine(message);
}
