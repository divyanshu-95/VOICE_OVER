if ('webkitSpeechRecognition' in window && 'speechSynthesis' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    const startSpeechToTextButton = document.getElementById('start-speech-to-text-btn');
    const stopSpeechToTextButton = document.getElementById('stop-speech-to-text-btn');
    const clearTextButton = document.getElementById('clear-text-btn');
    const resultTextArea = document.getElementById('result');
    const statusText = document.getElementById('status');

    recognition.onstart = function() {
        statusText.textContent = 'Listening for speech...';
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        resultTextArea.value = transcript;
        statusText.textContent = 'Speech recognized successfully!';
    };

    recognition.onend = function() {
        statusText.textContent = 'Speech recognition stopped.';
    };

    recognition.onerror = function(event) {
        statusText.textContent = 'Error: ' + event.error;
    };

    startSpeechToTextButton.addEventListener('click', function() {
        recognition.start();
    });

    stopSpeechToTextButton.addEventListener('click', function() {
        recognition.stop();
    });

    clearTextButton.addEventListener('click', function() {
        resultTextArea.value = '';
    });

    // Text-to-Speech Setup
    const startTextToSpeechButton = document.getElementById('start-text-to-speech-btn');
    const stopTextToSpeechButton = document.getElementById('stop-text-to-speech-btn');
    const voiceSelect = document.getElementById('voice-select');
    const volumeSlider = document.getElementById('volume-slider');
    const rateSlider = document.getElementById('rate-slider');
    const pitchSlider = document.getElementById('pitch-slider');

    let voices = [];

    function populateVoiceList() {
        voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';
        voices.forEach((voice, i) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = i;
            voiceSelect.appendChild(option);
        });
    }

    function speakText() {
        const text = resultTextArea.value;
        if (!text) {
            statusText.textContent = 'No text to read.';
            return;
        }

        // Stop any ongoing speech before starting new
        if (speechSynthesis.speaking || speechSynthesis.paused) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        const selectedVoiceIndex = voiceSelect.value;
        if (voices[selectedVoiceIndex]) {
            utterance.voice = voices[selectedVoiceIndex];
        }
        utterance.volume = parseFloat(volumeSlider.value);
        utterance.rate = parseFloat(rateSlider.value);
        utterance.pitch = parseFloat(pitchSlider.value);

        utterance.onstart = function() {
            statusText.textContent = 'Reading the text...';
        };

        utterance.onend = function() {
            statusText.textContent = 'Finished reading the text.';
        };

        utterance.onerror = function() {
            statusText.textContent = 'Error during speech synthesis.';
        };

        speechSynthesis.speak(utterance);
    }

    function loadVoices() {
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
        } else {
            populateVoiceList();
        }
    }

    startTextToSpeechButton.addEventListener('click', speakText);

    stopTextToSpeechButton.addEventListener('click', function() {
        if (speechSynthesis.speaking || speechSynthesis.paused) {
            speechSynthesis.cancel();
            statusText.textContent = 'Speech stopped.';
        }
    });

    loadVoices();
} else {
    document.getElementById('status').textContent = 'Sorry, your browser does not support speech recognition or text-to-speech.';
}
