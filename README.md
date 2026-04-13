# Expo Media Controls Android 12 Repro

Minimal repro for an Android 12 media-notification issue with:

- `expo-audio@55.0.13`
- `expo-video@55.0.9`
- `expo@55.0.15`

## Symptom

On Android 12, the media notification appears and may show metadata and a progress bar, but transport controls are missing:

- no play/pause button
- no seek backward button
- no seek forward button

This repro includes both:

- audio playback using `expo-audio` with `setActiveForLockScreen(...)`
- video playback using `expo-video` with `showNowPlayingNotification = true`

## Run

```bash
pnpm install
pnpm android
```

## Test steps

1. Tap `Play Audio` or `Play Video`.
2. Open the Android media notification.
3. Observe whether the transport buttons are missing on Android 12.

This was tested on an Android 12 emulator running a development build of the app with pnpm as the package manager.

## Expected

The Android media notification should show transport controls.

## Actual

On Android 12, the notification may show metadata and/or progress but no playback buttons.

## Notes

- This repro intentionally avoids app-specific state, navigation, analytics, downloads, and custom native code.
- It is meant to isolate Expo media-session behavior as much as possible.
- Although this issue was observed on Android 12, it is likely present on other older versions of Android
