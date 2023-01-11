/* --------------------------------------------------------------------------------------------
 * Copyright (c) Architect.io. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { expect } from "chai";
import {
  WebDriver,
  VSBrowser,
  Key,
  InputBox,
  TextEditor,
  ContentAssist,
  WebElement,
} from "vscode-extension-tester";
import { YamlConstants } from "./common/YAMLConstants";
import { Utilities } from "./Utilities";

/**
 * @author Zbynek Cervinka <zcervink@redhat.com>
 * @author Devin Sag <devin.sag@architect.io>
 */
export function contentAssistSuggestionTest(): void {
  describe("Verify content assist suggests right sugestion", () => {
    it("Content assist suggests right sugestion", async function () {
      this.timeout(30000);

      const driver: WebDriver = VSBrowser.instance.driver;
      await driver.actions().sendKeys(Key.F1).perform();

      const input = await InputBox.create();
      await input.setText(">new file");
      await input.confirm();
      await input.confirm();

      const new_file = new TextEditor();
      await new_file.isDisplayed();
      await driver.actions().sendKeys("nam").perform();

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

      await Utilities.sleep(2000);
      const save_file_editor = new TextEditor();
      const contentAssist = await save_file_editor.toggleContentAssist(true);

      // find if an item with given label is present
      if (contentAssist instanceof ContentAssist) {
        const hasItem = await contentAssist.hasItem("name");
        if (!hasItem) {
          const available_items = await contentAssist.getItems();
          expect.fail(
            `The 'name' string did not appear in the content assist's suggestion list. ${available_items.join(
              ","
            )}`
          );
        }
      } else {
        expect.fail(
          `The 'name' string did not appear in the content assist's suggestion list.`
        );
      }
    });

    afterEach(async function () {
      const utils = new Utilities();
      utils.deleteFileInHomeDir(YamlConstants.UI_MOCK_FILE);
    });
  });
}
