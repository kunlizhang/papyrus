import { createTamagui } from '@tamagui/core'
import { themes, tokens } from '@tamagui/themes'

const config = createTamagui({
  themes,
  tokens,
  shorthands: {
    f: 'flex',
    fd: 'flexDirection',
    jc: 'justifyContent',
    ai: 'alignItems',
  },
})

export type AppConfig = typeof config

export default config
