---
"kosmesis": minor
---

`kosmesis init` now asks before touching pre-existing file content instead of silently keeping or
discarding it:

- If your global CSS file or `@praxisjs/css` theme module already has content, you're asked
  whether to erase it before Kosmesis adds its tokens.
- For `@praxisjs/css` projects, the create-praxisjs template's default stylesheet (a separate file
  from the theme module) gets the same treatment, since it's otherwise never touched.
- For `@praxisjs/css` projects, `init` also asks for your root component's path and automatically
  wires `@Themed(KosmesisTokens, LightTheme, { persist: true, syncTabs: true })` above
  `@Component()` — previously this was left as a manual note.
