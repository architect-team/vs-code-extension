/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Inc. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from "vscode";
import {
  getDocUri,
  activate,
  testCompletion,
  testCompletionNotEmpty,
} from "./helper";
import * as path from "path";

describe("Completion", () => {
  const completion_uri = getDocUri(path.join("completion", "architect.yml"));

  before(async () => {
    await activate(completion_uri);
  });

  it("completion generates value select options", async () => {
    await testCompletionNotEmpty(completion_uri, new vscode.Position(0, 0));
  });

  it("completion suggests a selection choice from schema properties", async () => {
    await testCompletion(completion_uri, new vscode.Position(0, 0), {
      items: [
        {
          label: "architect.yml",
          kind: vscode.CompletionItemKind.Class,
        },
        {
          label: "artifact_image",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "author",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "dependencies",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "description",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "homepage",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "interfaces",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "keywords",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "name",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "outputs",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "parameters",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "secrets",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "services",
          kind: vscode.CompletionItemKind.Property,
        },
        {
          label: "tasks",
          kind: vscode.CompletionItemKind.Property,
        },
      ],
    });
  });
});
