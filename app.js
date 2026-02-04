import { TranslationService } from './modules/translationService.js';
import { UIController } from './modules/uiController.js';

document.addEventListener('DOMContentLoaded', () => {
    const translationService = new TranslationService();
    const ui = new UIController();

    // Initialize UI
    ui.initTheme();

    // Bind Translation Logic
    ui.bindTranslate(async (code, sourceLang, targetLang) => {
        return await translationService.translate(code, sourceLang, targetLang);
    });

    console.log('Polyglot Translator Initialized');
});
