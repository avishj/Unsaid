import { useEffect, useState } from 'react';
import { useSessionStore } from '@store/useSessionStore';

export const useAudioVisualizer = () => {
  const [rms, setRms] = useState(0);
  const isRecording = useSessionStore((s) => s.isRecording);

  useEffect(() => {
    if (!isRecording) {
      setRms(0);
      return;
    }

    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let source: MediaStreamAudioSourceNode;
    let animationFrame: number;

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      const update = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setRms(average / 128);
        animationFrame = requestAnimationFrame(update);
      };
      update();
    };

    start();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (audioContext) audioContext.close();
    };
  }, [isRecording]);

  return rms;
};
