/**
 * Helper client OpenRouter API pour DeepSeek & Fallback Heuristique
 */

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface WeddingContext {
  weddingDate?: string | null;
  coupleNames?: string | null;
  totalBudget?: number;
  totalSpent?: number;
  guestCount?: number;
  vendorCount?: number;
  pendingTasksCount?: number;
}

export async function fetchOpenRouterCompletion(
  messages: AiChatMessage[],
  context?: WeddingContext
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  // Prompt système enrichi avec le contexte réel du mariage
  const systemPrompt = `Tu es l'assistant virtuel expert en organisation de mariage pour l'application "Wedding Planner V2".
Ton rôle est de conseiller le couple avec bienveillance, clarté et précision.
${context ? `
Contexte actuel du mariage :
- Mariés / Titre : ${context.coupleNames || 'Non défini'}
- Date du mariage : ${context.weddingDate || 'Non définie'}
- Budget estimé total : ${context.totalSpent || 0} € dépensés sur un suivi budget de ${context.totalBudget || 0} €
- Nombre d'invités enregistrés : ${context.guestCount || 0}
- Prestataires enregistrés : ${context.vendorCount || 0}
- Tâches en attente : ${context.pendingTasksCount || 0}
` : ''}
Sois toujours concis, chaleureux, et donne des conseils pratiques adaptés aux données fournies. Utilise un formatage Markdown élégant.`;

  const fullMessages: AiChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  if (!apiKey) {
    // Si pas de clé API disponible dans les variables d'environnement, utiliser le fallback local
    return generateHeuristicResponse(messages[messages.length - 1]?.content || '', context);
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wedding-planner-v2.local',
        'X-Title': 'Wedding Planner V2',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      console.warn(`[OpenRouter API Error] ${response.status} ${response.statusText}`);
      return generateHeuristicResponse(messages[messages.length - 1]?.content || '', context);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || generateHeuristicResponse(messages[messages.length - 1]?.content || '', context);
  } catch (error) {
    console.error('[AI Assistant API Error]', error);
    return generateHeuristicResponse(messages[messages.length - 1]?.content || '', context);
  }
}

/**
 * Fallback heuristique local et rapide si l'API externe est indisponible ou sans clé API
 */
export function generateHeuristicResponse(userQuery: string, context?: WeddingContext): string {
  const query = userQuery.toLowerCase();

  if (query.includes('budget') || query.includes('argent') || query.includes('dépense')) {
    const spent = context?.totalSpent || 0;
    return `📊 **Point sur votre Budget** :\nVous avez actuellement dépensé **${spent.toLocaleString('fr-FR')} €**.\n\n*Conseil IA* : Pensez à garder une réserve de 10% pour les impondérés de dernière minute (ex: livraison, pourboires, ajustements de dernière minute).`;
  }

  if (query.includes('tâche') || query.includes('faire') || query.includes('planning') || query.includes('rétroplanning')) {
    const pending = context?.pendingTasksCount || 0;
    return `📅 **Gestion des Tâches & Rétroplanning** :\nVous avez **${pending} tâche(s)** en attente dans votre liste.\n\n*Conseil IA* : Utilisez notre bouton **"Générer mon rétroplanning IA"** dans la section Tâches pour générer automatiquement les échéances clés jusqu'au jour J !`;
  }

  if (query.includes('invité') || query.includes('rsvp') || query.includes('table')) {
    const count = context?.guestCount || 0;
    return `👥 **Suivi des Invités** :\nVous avez enregistré **${count} invité(s)** dans votre liste.\n\n*Conseil IA* : Relancez vos invités pour les réponses RSVP au plus tard 2 mois avant le mariage afin de valider le traiteur et le plan de table.`;
  }

  if (query.includes('prestataire') || query.includes('traiteur') || query.includes('photographe') || query.includes('lieu')) {
    const vCount = context?.vendorCount || 0;
    return `🤝 **Vos Prestataires** :\nVous avez actuellement **${vCount} prestataire(s)** répertorié(s).\n\n*Conseil IA* : Assurez-vous d'avoir signé les contrats et fixé les acompte pour le lieu, le traiteur et le photographe qui sont les postes les plus prisés.`;
  }

  return `✨ **Conseil Mariage IA** :\nPour réussir l'organisation de votre mariage sans stress, privilégiez le traitement des tâches prioritaires une par une. N'hésitez pas à générer votre rétroplanning automatique dans la rubrique Tâches !`;
}
