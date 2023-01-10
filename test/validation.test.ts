/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Inc. All rights reserved.
 * Copyright (c) Architect.io. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from "vscode";
import { getDocUri, activate, testDiagnostics } from "./helper";
import * as path from "path";

describe("Validation", () => {
  const validation_uri = getDocUri(path.join("validation", "architect.yml"));
  const validation_text =
    "must contain only lower alphanumeric and single hyphens or underscores in the middle; max length 32";

  before(async () => {
    await activate(validation_uri);
  });

  it("Schema validation generates error text", async () => {
    await testDiagnostics(validation_uri, [
      {
        message: validation_text,
        range: new vscode.Range(
          new vscode.Position(0, 6),
          new vscode.Position(0, 27)
        ),
        severity: 0,
      },
    ]);
  });
});
