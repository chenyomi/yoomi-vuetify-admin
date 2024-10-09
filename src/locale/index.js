import { en, zhHans } from 'vuetify/locale'
import en_es from './en'
import zhHans_es from './zh-Hans'
export const messages = {
  'en': {
    ...en_es,
    $vuetify: {
      ...en,
    },
  },
  'zh-Hans': {
    ...zhHans_es,
    $vuetify: {
      ...zhHans,
    },
  },
}
