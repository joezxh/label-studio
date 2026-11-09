import { defineManifest } from "../../ds-manifest";

export default defineManifest({
  name: "LanguageSwitcher",
  tier: 2,
  exports: ["LanguageSwitcher"],
  intent: [],
  use_when: "The language switcher that toggles the UI between English and Simplified Chinese.",
  never_when: [],
  replaces: [],
});
