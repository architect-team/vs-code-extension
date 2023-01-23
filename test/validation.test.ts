/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Inc. All rights reserved.
 * Copyright (c) Architect.io. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from "vscode";
import { getDocUri, activate, testDiagnostics } from "./helper";
import * as path from "path";
import { YamlConstants } from "./ui-test/common/YAMLConstants";

describe("Validation", () => {
  const validation_uri_yml = getDocUri(
    path.join("validation", YamlConstants.UI_MOCK_FILES.YML)
  );
  const validation_uri_yaml = getDocUri(
    path.join("validation", YamlConstants.UI_MOCK_FILES.YAML)
  );
  const validation_uri_wildcard_yaml = getDocUri(
    path.join("validation", YamlConstants.UI_MOCK_FILES.WILDCARD_YAML)
  );
  const validation_uri_wildcard_yml = getDocUri(
    path.join("validation", YamlConstants.UI_MOCK_FILES.WILDCARD_YML)
  );

  const validation_text =
    "must contain only lower alphanumeric and single hyphens or underscores in the middle; max length 32";

  const expected_validation = [
    {
      message: validation_text,
      range: new vscode.Range(
        new vscode.Position(0, 6),
        new vscode.Position(0, 27)
      ),
      severity: 0,
    },
  ];

  it("Schema validation generates error text - architect.yml", async () => {
    await activate(validation_uri_yml);
    await testDiagnostics(validation_uri_yml, expected_validation);
  });

  it("Schema validation generates error text - *.architect.yml", async () => {
    await activate(validation_uri_wildcard_yml);
    await testDiagnostics(validation_uri_wildcard_yml, expected_validation);
  });

  it("Schema validation generates error text - architect.yaml", async () => {
    await activate(validation_uri_yaml);
    await testDiagnostics(validation_uri_yaml, expected_validation);
  });

  it("Schema validation generates error text - *.architect.yaml", async () => {
    await activate(validation_uri_wildcard_yaml);
    await testDiagnostics(validation_uri_wildcard_yaml, expected_validation);
  });
});
