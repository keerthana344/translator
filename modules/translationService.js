export class TranslationService {
    constructor() {
        this.delay = 1500; // Simulate network latency
    }

    async translate(code, sourceLang, targetLang) {
        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    sourceLang: sourceLang,
                    targetLang: targetLang
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.translatedCode;
        } catch (error) {
            console.error('Translation error:', error);
            throw error;
        }
    }
}
