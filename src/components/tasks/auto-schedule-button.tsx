'use client';

import { useState } from 'react';
import { Sparkles, Calendar, Check, Loader2 } from 'lucide-react';
import { generateAutoScheduleAction } from '@/app/actions/ai-assistant';
import { toast } from 'sonner';

export function AutoScheduleButton() {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateAutoScheduleAction();
      if (res.success) {
        toast.success(res.message || 'Rétroplanning généré avec succès !');
      } else {
        toast.error(res.error || 'Erreur lors de la génération du rétroplanning.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-medium text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4 text-amber-200" />
      )}
      <span>Générer Rétroplanning IA</span>
    </button>
  );
}
