/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Inc. All rights reserved.
 * Copyright (c) Architect.io. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from "vscode";
import { getDocUri, activate, testHover } from "./helper";
import * as path from "path";

describe("Hover", () => {
  const hover_uri = getDocUri(path.join("hover", "architect.yml"));
  const hover_text =
    "#### architect\\.yml\n\nGlobally unique friendly reference to the component\\. must contain only lower alphanumeric and single hyphens or underscores in the middle; max length 32\n\n" +
    "Source: [architect.schema.json](https://raw.githubusercontent.com/architect-team/architect-cli/main/src/dependency-manager/schema/architect.schema.json)";

  before(async () => {
    await activate(hover_uri);
  });

  it("Property hover provides schema property detail text", async () => {
    await testHover(hover_uri, new vscode.Position(0, 0), [
      {
        contents: [hover_text],
      },
    ]);
  });
});
