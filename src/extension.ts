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
  CommonLanguageClient,
  LanguageClientOptions,
  RequestType,
  RevealOutputChannelOn,
} from "vscode-languageclient";
import { getSchemaContent, IArchitectioSchemaCache } from "./content-provider";
import { TextDecoder } from "util";

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

let client: CommonLanguageClient;

export type ArchitectioLanguageClientConstructor = (
  name: string,
  description: string,
  clientOptions: LanguageClientOptions
) => CommonLanguageClient;

export interface RuntimeEnvironment {
  readonly schemaCache: IArchitectioSchemaCache;
}

export function startClient(
  context: ExtensionContext,
  newArchitectioLanguageClient: ArchitectioLanguageClientConstructor,
  runtime: RuntimeEnvironment
): void {
  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for on disk and newly created YAML documents
    documentSelector: [
      {
        language: "yaml",
      },
      {
        language: "architectio",
      },
      {
        pattern: "(.)architect.y(a)ml",
      },
    ],
    synchronize: {
      // Notify the server about file changes to YAML files contained in the workspace
      fileEvents: [
        workspace.createFileSystemWatcher("**/architect.y?(a)ml"),
        workspace.createFileSystemWatcher("**/*.architect.y?(a)ml"),
      ],
    },
    revealOutputChannelOn: RevealOutputChannelOn.Never,
  };

  // Create the language client and start it
  client = newArchitectioLanguageClient(
    "Architect.io",
    "Architect.io",
    clientOptions
  );

  const disposable = client.start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable);

  client.onReady().then(() => {
    client.onRequest(VSCodeContentRequest.type, () => {
      return getSchemaContent(runtime.schemaCache);
    });
    client.onRequest(FSReadFile.type, (fsPath: string) => {
      return workspace.fs
        .readFile(Uri.file(fsPath))
        .then((uint8array) => new TextDecoder().decode(uint8array));
    });
  });
}

export function logToExtensionOutputChannel(message: string): void {
  client.outputChannel.appendLine(message);
}
