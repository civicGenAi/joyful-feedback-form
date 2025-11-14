/**
 * Play a celebratory chime sound using Web Audio API
 * Creates a pleasant multi-tone chime effect
 */
export const playChime = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const currentTime = audioContext.currentTime;

    // Create a series of pleasant tones (C major chord)
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      // Envelope for smooth attack and decay
      const startTime = currentTime + (index * 0.1);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.6);
    });

    // Add a higher octave sparkle at the end
    const sparkle = audioContext.createOscillator();
    const sparkleGain = audioContext.createGain();
    
    sparkle.connect(sparkleGain);
    sparkleGain.connect(audioContext.destination);
    
    sparkle.frequency.value = 1046.5; // C6
    sparkle.type = 'sine';
    
    const sparkleStart = currentTime + 0.3;
    sparkleGain.gain.setValueAtTime(0, sparkleStart);
    sparkleGain.gain.linearRampToValueAtTime(0.2, sparkleStart + 0.03);
    sparkleGain.gain.exponentialRampToValueAtTime(0.01, sparkleStart + 0.5);
    
    sparkle.start(sparkleStart);
    sparkle.stop(sparkleStart + 0.5);

    console.log('🎵 Playing celebration chime');
  } catch (error) {
    console.error('Error playing chime:', error);
    // Fail silently - sound is optional
  }
};
