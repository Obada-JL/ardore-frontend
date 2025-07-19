import { getRequestConfig } from 'next-intl/server';
import path from 'path';
import { promises as fs } from 'fs';

export default getRequestConfig(async ({ locale }) => {
    // Handle case where locale might be undefined - default to Turkish
    const safeLocale = locale || 'tr';

    try {
        // Load messages from local files instead of dynamic import
        const messagesPath = path.join(process.cwd(), 'messages', safeLocale, 'common.json');
        const messagesJSON = await fs.readFile(messagesPath, 'utf8');
        const messages = JSON.parse(messagesJSON);

        return {
            locale: safeLocale,
            messages
        };
    } catch (error) {
        console.error(`Error loading messages for locale ${safeLocale}:`, error);

        // Fallback to Turkish if there's an error and the locale wasn't already Turkish
        if (safeLocale !== 'tr') {
            try {
                const fallbackPath = path.join(process.cwd(), 'messages', 'tr', 'common.json');
                const fallbackJSON = await fs.readFile(fallbackPath, 'utf8');
                return {
                    locale: 'tr',
                    messages: JSON.parse(fallbackJSON)
                };
            } catch (fallbackError) {
                console.error('Failed to load fallback messages:', fallbackError);
            }
        }

        // Return minimal messages to avoid crashing the app
        return {
            locale: 'tr',
            messages: { common: { direction: 'ltr' } }
        };
    }
}); 