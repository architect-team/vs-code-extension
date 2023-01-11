/* --------------------------------------------------------------------------------------------
 * Copyright (c) Architect.io. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import {
  WebDriver,
  VSBrowser,
  Key,
  InputBox,
  TextEditor,
  WebElement,
} from "vscode-extension-tester";
import { YamlConstants } from "./common/YAMLConstants";
import { Utilities } from "./Utilities";

/**
 * @author Zbynek Cervinka <zcervink@redhat.com>
 * @author Devin Sag <devin.sag@architect.io>
 */
export function schemaIsSetTest(): void {
  describe("Verify that the schema has been loaded", () => {
    it("The language and schema has been loaded for architect.yml files", async function () {
      this.timeout(30000);

      const driver: WebDriver = VSBrowser.instance.driver;
      await driver.actions().sendKeys(Key.F1).perform();

      const input = await InputBox.create();
      await input.setText(">new file");
      await input.confirm();
      await input.confirm();

      const new_file = new TextEditor();
      await new_file.isDisplayed();

      const save_input = await new_file.saveAs();
      await save_input.isDisplayed();
      await save_input.setText(YamlConstants.UI_MOCK_PATH);
      await save_input.confirm();
      await Utilities.sleep(1000);

      // wait until the schema is set and prepared
      (await VSBrowser.instance.driver.wait(async () => {
        this.timeout(10000);
        const utils = new Utilities();
        return await utils.getSchemaLabel(YamlConstants.UI_MOCK_LANGUAGE);
      }, 10000)) as WebElement | undefined;
    });

    afterEach(async function () {
      const utils = new Utilities();
      utils.deleteFileInHomeDir(YamlConstants.UI_MOCK_FILE);
    });
  });
}
