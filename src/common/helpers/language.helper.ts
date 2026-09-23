import en from '../../common/lang/en.json';
import vi from '../../common/lang/vi.json';

type LanguageParams = Record<string, string | number | boolean>;

export const getLanguageValue = (
  language: string = 'vi',
  key: string,
  params?: LanguageParams,
): string => {
  const languageSource: Record<string, string> = language === 'vi' ? vi : en;

  let message: string = languageSource[key] ?? key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      const regex = new RegExp(`{${paramKey}}`, 'g');
      message = message.replace(regex, String(paramValue));
    });
  }

  return message;
};
