import { defineStore } from "pinia"

export const useStore = defineStore('store', {
  state: () => {
    return {
      view: true,
      message: null,
      process: {}
    }
  },
  actions: {
    setMessage(msg) {
      this.message = msg
    },
    setProcess(msg) {
      this.process = Object.assign(this.process, msg)
    },
  },
})
