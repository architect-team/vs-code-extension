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
  WebElement,
} from "vscode-extension-tester";
import { YamlConstants } from "./common/YAMLConstants";
import { Utilities } from "./Utilities";

/**
 * @author Zbynek Cervinka <zcervink@redhat.com>
 * @author Devin Sag <devin.sag@architect.io>
 */
export function autocompletionTest(): void {
  describe("Verify autocompletion completes what should be completed", () => {
    it("Autocompletion works as expected - *.architect.yml", async function () {
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
      await save_input.setText(YamlConstants.UI_MOCK_PATHS.WILDCARD_YML);
      await save_input.confirm();

      await Utilities.sleep(1000);

      // wait until the schema is set and prepared
      (await VSBrowser.instance.driver.wait(async () => {
        this.timeout(10000);
        const utils = new Utilities();
        return await utils.getSchemaLabel(YamlConstants.UI_MOCK_LANGUAGE);
      }, 10000)) as WebElement | undefined;

      await Utilities.sleep(1000);
      const save_file_editor = new TextEditor();
      await save_file_editor.toggleContentAssist(true);
      await driver.actions().sendKeys(Key.TAB).perform();

      const editor = new TextEditor();
      const text = await editor.getText();

      if (text != "name: ") {
        expect.fail(`The 'name: ' string has not been autocompleted.`);
      }
    });

    it("Autocompletion works as expected - architect.yml", async function () {
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
      await save_input.setText(YamlConstants.UI_MOCK_PATHS.YML);
      await save_input.confirm();

      await Utilities.sleep(1000);

      // wait until the schema is set and prepared
      (await VSBrowser.instance.driver.wait(async () => {
        this.timeout(10000);
        const utils = new Utilities();
        return await utils.getSchemaLabel(YamlConstants.UI_MOCK_LANGUAGE);
      }, 10000)) as WebElement | undefined;

      await Utilities.sleep(1000);
      const save_file_editor = new TextEditor();
      await save_file_editor.toggleContentAssist(true);
      await driver.actions().sendKeys(Key.TAB).perform();

      const editor = new TextEditor();
      const text = await editor.getText();

      if (text != "name: ") {
        expect.fail(`The 'name: ' string has not been autocompleted.`);
      }
    });

    it("Autocompletion works as expected - architect.yaml", async function () {
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
      await save_input.setText(YamlConstants.UI_MOCK_PATHS.YAML);
      await save_input.confirm();

      await Utilities.sleep(1000);

      // wait until the schema is set and prepared
      (await VSBrowser.instance.driver.wait(async () => {
        this.timeout(10000);
        const utils = new Utilities();
        return await utils.getSchemaLabel(YamlConstants.UI_MOCK_LANGUAGE);
      }, 10000)) as WebElement | undefined;

      await Utilities.sleep(1000);
      const save_file_editor = new TextEditor();
      await save_file_editor.toggleContentAssist(true);
      await driver.actions().sendKeys(Key.TAB).perform();

      const editor = new TextEditor();
      const text = await editor.getText();

      if (text != "name: ") {
        expect.fail(`The 'name: ' string has not been autocompleted.`);
      }
    });

    it("Autocompletion works as expected - *.architect.yaml", async function () {
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
      await save_input.setText(YamlConstants.UI_MOCK_PATHS.WILDCARD_YAML);
      await save_input.confirm();

      await Utilities.sleep(1000);

      // wait until the schema is set and prepared
      (await VSBrowser.instance.driver.wait(async () => {
        this.timeout(10000);
        const utils = new Utilities();
        return await utils.getSchemaLabel(YamlConstants.UI_MOCK_LANGUAGE);
      }, 10000)) as WebElement | undefined;

      await Utilities.sleep(1000);
      const save_file_editor = new TextEditor();
      await save_file_editor.toggleContentAssist(true);
      await driver.actions().sendKeys(Key.TAB).perform();

      const editor = new TextEditor();
      const text = await editor.getText();

      if (text != "name: ") {
        expect.fail(`The 'name: ' string has not been autocompleted.`);
      }
    });

    afterEach(async function () {
      const utils = new Utilities();
      utils.deleteFileInHomeDir(YamlConstants.UI_MOCK_FILES.WILDCARD_YAML);
      utils.deleteFileInHomeDir(YamlConstants.UI_MOCK_FILES.YAML);
      utils.deleteFileInHomeDir(YamlConstants.UI_MOCK_FILES.WILDCARD_YML);
      utils.deleteFileInHomeDir(YamlConstants.UI_MOCK_FILES.YML);
    });
  });
}
