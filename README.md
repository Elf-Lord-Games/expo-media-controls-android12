# Expo Media Controls Android 12 Repro

Minimal repro for an Android 12 media-notification issue with:

- `expo-audio@55.0.8`
- `expo-video@55.0.9`
- `expo@55.0.2`

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
cd repros/expo-media-controls-android12
pnpm install
pnpm android
```

## Test steps

1. Tap `Play Audio` or `Play Video`.
2. Background the app.
3. Open the Android media notification.
4. Expand it if needed.
5. Observe whether the transport buttons are missing on Android 12.

## Expected

The Android media notification should show transport controls.

## Actual

On Android 12, the notification may show metadata and/or progress but no playback buttons.

## Notes

- This repro intentionally avoids app-specific state, navigation, analytics, downloads, and custom native code.
- It is meant to isolate Expo media-session behavior as much as possible.
