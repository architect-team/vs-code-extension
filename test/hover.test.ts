/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Inc. All rights reserved.
 * Copyright (c) Architect.io. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from "vscode";
import { getDocUri, activate, testHover } from "./helper";
import * as path from "path";
import { YamlConstants } from "./ui-test/common/YAMLConstants";

describe("Hover", () => {
  const hover_uri_yml = getDocUri(
    path.join("hover", YamlConstants.UI_MOCK_FILES.YML)
  );
  const hover_uri_yaml = getDocUri(
    path.join("hover", YamlConstants.UI_MOCK_FILES.YAML)
  );
  const hover_uri_wildcard_yaml = getDocUri(
    path.join("hover", YamlConstants.UI_MOCK_FILES.WILDCARD_YAML)
  );
  const hover_uri_wildcard_yml = getDocUri(
    path.join("hover", YamlConstants.UI_MOCK_FILES.WILDCARD_YML)
  );

  const hover_text =
    "Globally unique friendly reference to the component\\. must contain only lower alphanumeric and single hyphens or underscores in the middle; max length 32\n\n" +
    "Source: [architect.schema.json](https://raw.githubusercontent.com/architect-team/architect-cli/main/src/dependency-manager/schema/architect.schema.json)";

  const expected_hover = [{ contents: [hover_text] }];

  it("Property hover provides schema property detail text - architect.yml", async () => {
    await activate(hover_uri_yml);
    await testHover(hover_uri_yml, new vscode.Position(0, 0), expected_hover);
  });
  it("Property hover provides schema property detail text - architect.yaml", async () => {
    await activate(hover_uri_yaml);
    await testHover(hover_uri_yaml, new vscode.Position(0, 0), expected_hover);
  });
  it("Property hover provides schema property detail text - *.architect.yml", async () => {
    await activate(hover_uri_wildcard_yml);
    await testHover(
      hover_uri_wildcard_yml,
      new vscode.Position(0, 0),
      expected_hover
    );
  });
  it("Property hover provides schema property detail text - *architect.yaml", async () => {
    await activate(hover_uri_wildcard_yaml);
    await testHover(
      hover_uri_wildcard_yaml,
      new vscode.Position(0, 0),
      expected_hover
    );
  });
});
