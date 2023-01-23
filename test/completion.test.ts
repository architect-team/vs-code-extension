/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Inc. All rights reserved.
 * Copyright (c) Architect.io. All rights reserved.
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
import { YamlConstants } from "./ui-test/common/YAMLConstants";

describe("Completion", () => {
  const completion_uri_yml = getDocUri(
    path.join("completion", YamlConstants.UI_MOCK_FILES.YML)
  );
  const completion_uri_yaml = getDocUri(
    path.join("completion", YamlConstants.UI_MOCK_FILES.YAML)
  );
  const completion_uri_wildcard_yaml = getDocUri(
    path.join("completion", YamlConstants.UI_MOCK_FILES.WILDCARD_YAML)
  );
  const completion_uri_wildcard_yml = getDocUri(
    path.join("completion", YamlConstants.UI_MOCK_FILES.WILDCARD_YML)
  );

  const expected_completion = {
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
  };

  it("completion generates value select options - architect.yml", async () => {
    await activate(completion_uri_yml);
    await testCompletionNotEmpty(completion_uri_yml, new vscode.Position(0, 0));
  });

  it("completion generates value select options - architect.yaml", async () => {
    await activate(completion_uri_yaml);
    await testCompletionNotEmpty(
      completion_uri_yaml,
      new vscode.Position(0, 0)
    );
  });

  it("completion generates value select options - *.architect.yml", async () => {
    await activate(completion_uri_wildcard_yml);
    await testCompletionNotEmpty(
      completion_uri_wildcard_yml,
      new vscode.Position(0, 0)
    );
  });

  it("completion generates value select options - *.architect.yaml", async () => {
    await activate(completion_uri_wildcard_yaml);
    await testCompletionNotEmpty(
      completion_uri_wildcard_yaml,
      new vscode.Position(0, 0)
    );
  });

  it("completion suggests a selection choice from schema properties - architect.yml", async () => {
    await testCompletion(
      completion_uri_yml,
      new vscode.Position(0, 0),
      expected_completion
    );
  });

  it("completion suggests a selection choice from schema properties - architect.yaml", async () => {
    await testCompletion(
      completion_uri_yaml,
      new vscode.Position(0, 0),
      expected_completion
    );
  });

  it("completion suggests a selection choice from schema properties - *.architect.yml", async () => {
    await testCompletion(
      completion_uri_wildcard_yml,
      new vscode.Position(0, 0),
      expected_completion
    );
  });

  it("completion suggests a selection choice from schema properties - *.architect.yaml", async () => {
    await testCompletion(
      completion_uri_wildcard_yaml,
      new vscode.Position(0, 0),
      expected_completion
    );
  });
});
