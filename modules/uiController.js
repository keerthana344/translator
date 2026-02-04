export class UIController {
    constructor() {
        // Elements
        this.sourceInput = document.getElementById('source-input');
        this.targetOutput = document.getElementById('target-output');
        this.sourceLangSelect = document.getElementById('source-language');
        this.targetLangSelect = document.getElementById('target-language');
        this.translateBtn = document.getElementById('translate-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        this.statusText = document.getElementById('status-text');

        // State
        this.isTranslating = false;
    }

    bindTranslate(handler) {
        this.translateBtn.addEventListener('click', async () => {
            if (this.isTranslating) return;

            const code = this.sourceInput.value;
            const sourceLang = this.sourceLangSelect.value;
            const targetLang = this.targetLangSelect.value;

            if (!code.trim()) {
                this.updateStatus('Please enter some code', 'error');
                return;
            }

            this.setLoading(true);
            this.updateStatus(`Translating ${sourceLang} to ${targetLang}...`);

            try {
                const result = await handler(code, sourceLang, targetLang);
                this.targetOutput.value = result;
                this.updateStatus('Translation complete', 'success');
            } catch (error) {
                this.updateStatus('Translation failed', 'error');
                console.error(error);
            } finally {
                this.setLoading(false);
            }
        });
    }

    setLoading(isLoading) {
        this.isTranslating = isLoading;
        if (isLoading) {
            this.translateBtn.classList.add('loading');
            this.targetOutput.classList.add('loading-pulse');
        } else {
            this.translateBtn.classList.remove('loading');
            this.targetOutput.classList.remove('loading-pulse');
        }
    }

    updateStatus(message, type = 'normal') {
        this.statusText.textContent = message;
        this.statusText.className = type; // simple class switching

        if (type !== 'normal') {
            setTimeout(() => {
                this.statusText.textContent = 'Ready';
                this.statusText.className = '';
            }, 3000);
        }
    }

    initTheme() {
        // Basic theme toggle logic
        this.themeToggle.addEventListener('click', () => {
            // For now just console log, or implement actual light/dark toggle if requested later
            // Currently only Dark Theme is implemented in CSS
            this.updateStatus('Theme toggle clicked (Only Dark Mode available)');
        });

        // Copy buttons
        document.getElementById('copy-source').addEventListener('click', () => this.copyToClipboard(this.sourceInput.value));
        document.getElementById('copy-target').addEventListener('click', () => this.copyToClipboard(this.targetOutput.value));
    }

    async copyToClipboard(text) {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            this.updateStatus('Copied to clipboard!', 'success');
        } catch (err) {
            this.updateStatus('Failed to copy', 'error');
        }
    }
}
