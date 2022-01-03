import { App as Application } from 'vue'

// @ts-ignore
import SpMnemonic from './SpMnemonic.vue'

import { registerComponent } from './../../utils/plugins/index'

export const Plugin = {
  install(vue: Application): void {
    registerComponent(vue, SpMnemonic)
  }
}

export default SpMnemonic
