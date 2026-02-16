export function speak(text: string, lang: string = 'tr-TR') {
    if (typeof window === 'undefined') return;

    if (!text || text.trim() === '') {
        console.warn('TTS: Empty text ignored');
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find a Turkish voice
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find(v => v.lang.includes('tr')) || voices.find(v => v.lang.includes('TR'));

    if (trVoice) {
        utterance.voice = trVoice;
        console.log('TTS: Using Turkish voice:', trVoice.name);
    } else {
        console.warn('TTS: No Turkish voice found, using default.');
    }

    utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        console.error('TTS Error:', e);
    };

    window.speechSynthesis.speak(utterance);
}
