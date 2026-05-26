---
"@spraxium/components": patch
---

`@spraxium/components` add `@ModalParams()` and `@ModalPayload()` parameter decorators for modal handlers, with `ModalService.buildWithParams()` and `buildWithPayload()` to produce the matching custom IDs. Modal payloads are auto-deleted after a successful handler run. `@ButtonHandler` and `@SelectHandler` now accept `@DynamicButton` and `@DynamicStringSelect` components directly, making `@DynamicButtonHandler` and `@DynamicSelectHandler` optional aliases. `PayloadService` is now injected into `ModalService` via DI instead of being instantiated inline. Internal: `ResolvedModalHandler.customId` renamed to `baseId`; custom-ID codec re-exported from `utils/custom-id`.
