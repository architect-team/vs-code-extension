/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Adam Voss. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
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
import { SchemaExtensionAPI } from "./schema-extension-api";
import {
  getJsonSchemaContent,
  IJSONSchemaCache,
  JSONSchemaDocumentContentProvider,
} from "./json-schema-content-provider";

import { TextDecoder } from "util";

export interface ISchemaAssociations {
  [pattern: string]: string[];
}

export interface ISchemaAssociation {
  fileMatch: string[];
  uri: string;
}

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

const lsName = "YAML Support";

export type LanguageClientConstructor = (
  name: string,
  description: string,
  clientOptions: LanguageClientOptions
) => CommonLanguageClient;

export interface RuntimeEnvironment {
  readonly schemaCache: IJSONSchemaCache;
}

export function startClient(
  context: ExtensionContext,
  newLanguageClient: LanguageClientConstructor,
  runtime: RuntimeEnvironment
): SchemaExtensionAPI {
  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for on disk and newly created YAML documents
    documentSelector: [{ language: "yaml" }, { pattern: "architect.y(a)ml" }],
    synchronize: {
      // Notify the server about file changes to YAML and JSON files contained in the workspace
      fileEvents: [
        workspace.createFileSystemWatcher("**/architect.?(e)y?(a)ml"),
        workspace.createFileSystemWatcher("**/*.json"),
      ],
    },
    revealOutputChannelOn: RevealOutputChannelOn.Never,
  };

  // Create the language client and start it
  client = newLanguageClient("yaml", lsName, clientOptions);

  const disposable = client.start();

  const schemaExtensionAPI = new SchemaExtensionAPI(client);

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(disposable);
  context.subscriptions.push(
    workspace.registerTextDocumentContentProvider(
      "json-schema",
      new JSONSchemaDocumentContentProvider(
        runtime.schemaCache,
        schemaExtensionAPI
      )
    )
  );

  client.onReady().then(() => {
    client.onRequest(VSCodeContentRequest.type, () => {
      return getJsonSchemaContent(runtime.schemaCache);
    });
    client.onRequest(FSReadFile.type, (fsPath: string) => {
      return workspace.fs
        .readFile(Uri.file(fsPath))
        .then((uint8array) => new TextDecoder().decode(uint8array));
    });
  });

  return schemaExtensionAPI;
}

export function logToExtensionOutputChannel(message: string): void {
  client.outputChannel.appendLine(message);
}
