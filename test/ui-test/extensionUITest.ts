/* --------------------------------------------------------------------------------------------
 * Copyright (c) Architect.io. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { expect } from "chai";
import { YamlConstants } from "./common/YAMLConstants";
import {
  ActivityBar,
  ExtensionsViewItem,
  ExtensionsViewSection,
  SideBarView,
  ViewControl,
} from "vscode-extension-tester";

/**
 * @author Ondrej Dockal <odockal@redhat.com>
 * @author Devin Sag <devin.sag@architect.io>
 */
export function extensionUIAssetsTest(): void {
  describe("Verify extension's base assets available after install", () => {
    let view: ViewControl;
    let sideBar: SideBarView;
    let section: ExtensionsViewSection;

    beforeEach(async function () {
      this.timeout(10000);
      view = await new ActivityBar().getViewControl("Extensions");
      sideBar = await view.openView();
      const content = sideBar.getContent();
      section = (await content.getSection(
        "Installed"
      )) as ExtensionsViewSection;
    });

    it("Architect.io extension is installed", async function () {
      this.timeout(20000);
      const item = (await section.findItem(
        `@installed ${YamlConstants.UI_MOCK_LANGUAGE}`
      )) as ExtensionsViewItem;
      expect(item).not.undefined;
      expect(await item.getTitle()).to.equal(YamlConstants.UI_MOCK_LANGUAGE);
    });

    afterEach(async function () {
      this.timeout(10000);
      if (sideBar && (await sideBar.isDisplayed())) {
        sideBar = await (
          await new ActivityBar().getViewControl("Extensions")
        ).openView();
        const titlePart = sideBar.getTitlePart();
        const actionButton = await titlePart.getAction(
          "Clear Extensions Search Results"
        );
        if (actionButton.isEnabled()) {
          await actionButton.click();
        }
      }
    });

    after(async () => {
      if (sideBar && (await sideBar.isDisplayed()) && view) {
        await view.closeView();
      }
    });
  });
}
