import { Globe } from 'lucide-react';
import { useI18n } from '../../../core/hooks/useI18n.ts';

export function LanguageToggle() {
  const { currentLanguage, changeLanguage } = useI18n();

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    changeLanguage(newLang);
  };

  const getCurrentLanguageLabel = () => {
    return currentLanguage === 'es' ? 'ES' : 'EN';
  };

  return (
    <button
      onClick={toggleLanguage}
      className="btn btn-ghost btn-sm flex items-center gap-2 rounded-full bg-gradient-to-r from-white/40 to-cyan-50/60 backdrop-blur-md border border-white/40 text-slate-700 dark:text-white hover:from-white/60 hover:to-cyan-100/80 hover:shadow-lg transition-all duration-200"
      title={`Cambiar idioma / Switch language`}
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold">{getCurrentLanguageLabel()}</span>
    </button>
  );
}