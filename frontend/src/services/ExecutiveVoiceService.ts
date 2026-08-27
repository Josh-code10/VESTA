export class ExecutiveVoiceService {
  private static instance: ExecutiveVoiceService;
  private recognition: any = null;
  private isListening: boolean = false;

  private constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  public static getInstance(): ExecutiveVoiceService {
    if (!ExecutiveVoiceService.instance) {
      ExecutiveVoiceService.instance = new ExecutiveVoiceService();
    }
    return ExecutiveVoiceService.instance;
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    onTranscriptUpdate: (transcript: string, isFinal: boolean) => void,
    onError?: (err: string) => void,
    onEnd?: () => void
  ) {
    if (!this.recognition) {
      if (onError) onError('Speech Recognition is not supported in this browser.');
      return;
    }

    this.isListening = true;

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const text = final || interim;
      onTranscriptUpdate(text, !!final);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      if (onError) onError(event.error || 'Speech recognition error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceService = ExecutiveVoiceService.getInstance();
