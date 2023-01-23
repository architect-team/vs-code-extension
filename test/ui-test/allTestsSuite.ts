import { extensionUIAssetsTest } from "./extensionUITest";
import { contentAssistSuggestionTest } from "./contentAssistTest";
import { schemaIsSetTest } from "./schemaIsSetTest";
import { autocompletionTest } from "./autocompletionTest";

describe("Architect.io - UI tests", () => {
  extensionUIAssetsTest();
  contentAssistSuggestionTest();
  schemaIsSetTest();
  autocompletionTest();
});
