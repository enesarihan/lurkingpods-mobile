import TrackPlayer, { Capability, RepeatMode } from 'react-native-track-player';

export class AudioPlayerService {
  static async initialize() {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
    });
  }

  static async playPodcast(track: any) {
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  }

  static async pause() {
    await TrackPlayer.pause();
  }

  static async stop() {
    await TrackPlayer.stop();
  }
}

export default AudioPlayerService;
