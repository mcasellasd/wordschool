/**
 * Configuració i utilitats per a OpenAI API
 * Assegura't que OPENAI_API_KEY està configurada a les variables d'entorn
 */

export function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'OPENAI_API_KEY no està configurada. Configura-la a les variables d\'entorn de Vercel.'
      );
    }
    console.warn(
      '⚠️ OPENAI_API_KEY no està configurada. Crea un fitxer .env.local amb la teva clau API.'
    );
  }

  return {
    apiKey: apiKey || '',
    isConfigured: !!apiKey,
  };
}

/**
 * Valida que la clau API d'OpenAI estigui configurada
 */
export function validateOpenAIConfig(): boolean {
  const { isConfigured } = getOpenAIConfig();
  return isConfigured;
}

