import { setAudioModeAsync, createAudioPlayer } from 'expo-audio';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const AUDIO_URL =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';
const ARTWORK_URL =
  'https://dummyimage.com/512x512/111827/ffffff.png&text=Expo+Audio';

export default function App() {
  const audioPlayerRef = useRef(createAudioPlayer(AUDIO_URL));
  const [audioPlaying, setAudioPlaying] = useState(false);

  const videoPlayer = useVideoPlayer(
    {
      uri: VIDEO_URL,
      metadata: {
        title: 'Expo Video Repro',
        artist: 'Android 12 test',
        artwork: ARTWORK_URL,
      },
    },
    player => {
      player.staysActiveInBackground = true;
      player.showNowPlayingNotification = true;
    },
  );
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    void setAudioModeAsync({
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
      playsInSilentMode: true,
    });

    const audioPlayer = audioPlayerRef.current;
    audioPlayer.setActiveForLockScreen(
      true,
      {
        title: 'Expo Audio Repro',
        artist: 'Android 12 test',
        albumTitle: 'Lock screen controls',
        artworkUrl: ARTWORK_URL,
      },
      {
        showSeekBackward: true,
        showSeekForward: true,
      },
    );

    const audioSub = audioPlayer.addListener('playbackStatusUpdate', status => {
      setAudioPlaying(status.playing);
    });
    const videoSub = videoPlayer.addListener('playingChange', ({ isPlaying }) => {
      setVideoPlaying(isPlaying);
    });

    return () => {
      audioSub.remove();
      videoSub.remove();
      audioPlayer.clearLockScreenControls();
      audioPlayer.release();
      videoPlayer.pause();
      videoPlayer.showNowPlayingNotification = false;
      videoPlayer.staysActiveInBackground = false;
    };
  }, [videoPlayer]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Expo Media Controls Android 12 Repro</Text>
        <Text style={styles.subtitle}>Platform: {Platform.OS}</Text>
        <Text style={styles.body}>
          Expected: Android media notification shows transport buttons.
        </Text>
        <Text style={styles.body}>
          Actual on Android 12: notification may show metadata/progress but no
          play, pause, or seek buttons.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Audio via expo-audio</Text>
          <Text style={styles.body}>
            Uses `setAudioModeAsync(...doNotMix...)` and
            `setActiveForLockScreen`.
          </Text>
          <View style={styles.row}>
            <Button
              title={audioPlaying ? 'Pause Audio' : 'Play Audio'}
              onPress={() => {
                const audioPlayer = audioPlayerRef.current;
                if (audioPlayer.playing) {
                  audioPlayer.pause();
                } else {
                  audioPlayer.play();
                }
              }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Video via expo-video</Text>
          <Text style={styles.body}>
            Uses `showNowPlayingNotification = true`.
          </Text>
          <VideoView
            style={styles.video}
            player={videoPlayer}
            nativeControls
            allowsPictureInPicture
          />
          <View style={styles.row}>
            <Button
              title={videoPlaying ? 'Pause Video' : 'Play Video'}
              onPress={() => {
                if (videoPlayer.playing) {
                  videoPlayer.pause();
                } else {
                  videoPlayer.play();
                }
              }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to test</Text>
          <Text style={styles.body}>1. Start audio or video.</Text>
          <Text style={styles.body}>2. Background the app.</Text>
          <Text style={styles.body}>3. Expand the media notification.</Text>
          <Text style={styles.body}>
            4. On Android 12, observe whether transport controls are missing.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0f172a',
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 20,
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  body: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    alignItems: 'flex-start',
  },
  video: {
    aspectRatio: 16 / 9,
    backgroundColor: '#020617',
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
});
