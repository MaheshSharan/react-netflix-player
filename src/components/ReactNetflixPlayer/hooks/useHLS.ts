import { useEffect, useRef, useCallback } from 'react';

// Use dynamic import for HLS.js to handle module resolution issues
const HlsType = require('hls.js');

export interface HLSQualityLevel {
  height: number;
  width: number;
  bitrate: number;
  level: number;
  name: string;
}

export interface HLSSubtitleTrack {
  id: number;
  name: string;
  lang: string;
  default: boolean;
}

export interface UseHLSProps {
  videoElement: HTMLVideoElement | null;
  src: string;
  onQualityLevelsLoaded?: (levels: HLSQualityLevel[]) => void;
  onSubtitleTracksLoaded?: (tracks: HLSSubtitleTrack[]) => void;
  onError?: (error: any) => void;
}

export const useHLS = ({
  videoElement,
  src,
  onQualityLevelsLoaded,
  onSubtitleTracksLoaded,
  onError
}: UseHLSProps) => {
  const hlsRef = useRef<any>(null);

  const isHLSSupported = useCallback(() => {
    return HlsType.isSupported();
  }, []);

  const isHLSUrl = useCallback((url: string) => {
    return url.includes('.m3u8') || url.includes('m3u8');
  }, []);

  const initializeHLS = useCallback(() => {
    if (!videoElement || !isHLSSupported()) {
      return false;
    }

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    const hls = new HlsType({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90,
    });

    hlsRef.current = hls;

    // Handle HLS events
    hls.on(HlsType.Events.MANIFEST_PARSED, () => {
      // Extract quality levels
      const levels: HLSQualityLevel[] = hls.levels.map((level: any, index: number) => ({
        height: level.height,
        width: level.width,
        bitrate: level.bitrate,
        level: index,
        name: `${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`
      }));

      if (onQualityLevelsLoaded) {
        onQualityLevelsLoaded(levels);
      }
    });

    hls.on(HlsType.Events.SUBTITLE_TRACKS_UPDATED, () => {
      // Extract subtitle tracks
      const tracks: HLSSubtitleTrack[] = hls.subtitleTracks.map((track: any, index: number) => ({
        id: index,
        name: track.name || `Track ${index + 1}`,
        lang: track.lang || 'unknown',
        default: track.default || false
      }));

      if (onSubtitleTracksLoaded) {
        onSubtitleTracksLoaded(tracks);
      }
    });

    hls.on(HlsType.Events.ERROR, (event: any, data: any) => {
      console.error('HLS Error:', data);
      if (onError) {
        onError(data);
      }
      
      if (data.fatal) {
        switch (data.type) {
          case HlsType.ErrorTypes.NETWORK_ERROR:
            console.error('Fatal network error encountered, trying to recover...');
            hls.startLoad();
            break;
          case HlsType.ErrorTypes.MEDIA_ERROR:
            console.error('Fatal media error encountered, trying to recover...');
            hls.recoverMediaError();
            break;
          default:
            console.error('Fatal error, cannot recover');
            hls.destroy();
            break;
        }
      }
    });

    hls.loadSource(src);
    hls.attachMedia(videoElement);

    return true;
  }, [videoElement, src, onQualityLevelsLoaded, onSubtitleTracksLoaded, onError, isHLSSupported]);

  const setQualityLevel = useCallback((level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
    }
  }, []);

  const setSubtitleTrack = useCallback((trackId: number) => {
    if (hlsRef.current) {
      hlsRef.current.subtitleTrack = trackId;
    }
  }, []);

  const getCurrentLevel = useCallback(() => {
    return hlsRef.current?.currentLevel ?? -1;
  }, []);

  const getCurrentSubtitleTrack = useCallback(() => {
    return hlsRef.current?.subtitleTrack ?? -1;
  }, []);

  useEffect(() => {
    if (videoElement && src) {
      if (isHLSUrl(src)) {
        const initialized = initializeHLS();
        if (!initialized) {
          // Fallback to native HLS support (Safari)
          if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = src;
          } else {
            console.warn('HLS not supported in this browser');
            if (onError) {
              onError({ type: 'HLS_NOT_SUPPORTED', message: 'HLS not supported in this browser' });
            }
          }
        }
      } else {
        // Regular video source - clean up any existing HLS instance
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        videoElement.src = src;
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoElement, src, initializeHLS, isHLSUrl, onError]);

  return {
    isHLSStream: isHLSUrl(src),
    isHLSSupported: isHLSSupported(),
    setQualityLevel,
    setSubtitleTrack,
    getCurrentLevel,
    getCurrentSubtitleTrack,
    hls: hlsRef.current
  };
};