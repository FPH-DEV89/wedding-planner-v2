'use server';

import prisma from '@/lib/prisma';
import { fetchOpenRouterCompletion, AiChatMessage, WeddingContext } from '@/lib/ai/openrouter';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';




/**
 * Action Serveur pour poser une question à l'Assistant IA
 */
export async function askAiAssistantAction(messages: AiChatMessage[]) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    let context: WeddingContext = {};

    if (userId) {
      // Récupération des données du mariage pour enrichir le contexte
      const [settings, vendors, guests, tasks, purchases] = await Promise.all([
        prisma.setting.findMany({ where: { userId } }),
        prisma.vendor.findMany({ where: { userId } }),
        prisma.guest.findMany({ where: { userId } }),
        prisma.task.findMany({ where: { userId } }),
        prisma.purchase.findMany({ where: { userId } })
      ]);

      const weddingDate = settings.find(s => s.key === 'wedding_date')?.value || null;
      const coupleNames = settings.find(s => s.key === 'couple_names')?.value || null;
      const totalBudgetSetting = settings.find(s => s.key === 'total_budget')?.value;
      const totalBudget = totalBudgetSetting ? parseFloat(totalBudgetSetting) : 0;

      const vendorsTotal = vendors.reduce((acc, v) => acc + (v.price || 0), 0);
      const purchasesTotal = purchases.reduce((acc, p) => acc + ((p.price || 0) * (p.quantity || 1)), 0);
      const totalSpent = vendorsTotal + purchasesTotal;

      const pendingTasksCount = tasks.filter(t => t.status !== 'DONE').length;

      context = {
        weddingDate,
        coupleNames,
        totalBudget,
        totalSpent,
        guestCount: guests.length,
        vendorCount: vendors.length,
        pendingTasksCount
      };
    }

    const reply = await fetchOpenRouterCompletion(messages, context);
    return { success: true, reply };
  } catch (error) {
    console.error('Error in askAiAssistantAction:', error);
    return { 
      success: false, 
      reply: "Désolé, une erreur s'est produite lors de la connexion avec l'assistant IA." 
    };
  }
}

/**
 * Modèle de tâches pour le rétroplanning automatique
 */
interface ScheduleTemplateTask {
  title: string;
  description: string;
  daysBeforeWedding: number; // Nombre de jours avant le mariage
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
}

const DEFAULT_SCHEDULE_TEMPLATES: ScheduleTemplateTask[] = [
  {
    title: 'Définir le budget global et le style du mariage',
    description: 'Fixer la limite budgétaire globale et le thème souhaité.',
    daysBeforeWedding: 365,
    priority: 'HIGH',
    type: 'BUDGET'
  },
  {
    title: 'Réserver le lieu de la réception & cérémonie',
    description: 'Visiter et signer le contrat d\'engagement avec le domaine/salle.',
    daysBeforeWedding: 330,
    priority: 'HIGH',
    type: 'VENDOR'
  },
  {
    title: 'Sélectionner et réserver le Traiteur',
    description: 'Faire des dégustations et valider le menu du mariage.',
    daysBeforeWedding: 300,
    priority: 'HIGH',
    type: 'VENDOR'
  },
  {
    title: 'Réserver le Photographe / Vidéaste',
    description: 'Valider le style d\'images et bloquer la date.',
    daysBeforeWedding: 270,
    priority: 'HIGH',
    type: 'VENDOR'
  },
  {
    title: 'Établir la première liste d\'invités',
    description: 'Lister la famille, amis et collègues à inviter.',
    daysBeforeWedding: 240,
    priority: 'MEDIUM',
    type: 'GUEST'
  },
  {
    title: 'Essayages de la tenue des mariés',
    description: 'Sélectionner la robe de mariée, le costume et faire les retouches.',
    daysBeforeWedding: 180,
    priority: 'HIGH',
    type: 'SHOPPING'
  },
  {
    title: 'Envoyer les Faire-part / Save the Date',
    description: 'Envoyer les invitations formelles avec demande de réponse RSVP.',
    daysBeforeWedding: 150,
    priority: 'HIGH',
    type: 'GUEST'
  },
  {
    title: 'Réserver le DJ / Groupe de musique & Animation',
    description: 'Définir la playlist de la soirée et les temps forts.',
    daysBeforeWedding: 120,
    priority: 'MEDIUM',
    type: 'VENDOR'
  },
  {
    title: 'Commander les alliances',
    description: 'Choisir et faire graver les anneaux de mariage.',
    daysBeforeWedding: 90,
    priority: 'HIGH',
    type: 'SHOPPING'
  },
  {
    title: 'Finaliser le plan de table et valider le traiteur',
    description: 'Régler les régimes alimentaires et transmettre le nombre définitif.',
    daysBeforeWedding: 30,
    priority: 'HIGH',
    type: 'GUEST'
  },
  {
    title: 'Derniers détails & Planning de la journée J',
    description: 'Briefing final avec tous les prestataires et témoins.',
    daysBeforeWedding: 7,
    priority: 'HIGH',
    type: 'TASK'
  }
];

/**
 * Action Serveur pour générer automatiquement le rétroplanning de tâches
 */
export async function generateAutoScheduleAction() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: 'Non autorisé' };
    }

    // Récupérer la date du mariage dans les Settings
    const settingWeddingDate = await prisma.setting.findFirst({
      where: { userId, key: 'wedding_date' }
    });

    // Date par défaut : dans 1 an si non configurée
    const targetWeddingDate = settingWeddingDate?.value
      ? new Date(settingWeddingDate.value)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const createdTasks = [];

    for (const item of DEFAULT_SCHEDULE_TEMPLATES) {
      // Calcul de la date d'échéance dueDate = weddingDate - X jours
      const dueDate = new Date(targetWeddingDate.getTime() - item.daysBeforeWedding * 24 * 60 * 60 * 1000);

      const newTask = await prisma.task.create({
        data: {
          userId,
          title: item.title,
          description: item.description,
          dueDate,
          priority: item.priority,
          status: 'TODO',
          type: item.type
        }
      });
      createdTasks.push(newTask);
    }

    revalidatePath('/tasks');
    revalidatePath('/dashboard');

    return { 
      success: true, 
      count: createdTasks.length,
      message: `${createdTasks.length} tâches clés ont été générées avec succès dans votre rétroplanning !` 
    };
  } catch (error) {
    console.error('Error generating auto schedule:', error);
    return { success: false, error: 'Impossible de générer le rétroplanning' };
  }
}
