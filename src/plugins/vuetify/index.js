import { messages } from '@/locale'
import { createI18n, useI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import defaults from './defaults'
import { icons } from './icons'
import theme from './theme'
// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export const i18n = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: 'zh-Hans',
  //locale: 'en',
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  missingWarn: false,
  fallbackWarn: false,
  messages,
})
export const vuetify = createVuetify({
  aliases: {
    IconBtn: VBtn,
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  defaults,
  icons,
  theme,
  components: {
    VDateInput,
    VCalendar,
    VTimePicker,
    VNumberInput
  },
})
