'use babel'

import {CompositeDisposable} from 'atom'
import {GometalinterLinter} from './linter'

export default {
  golangconfig: null,
  subscriptions: null,

  activate () {
    this.subscriptions = new CompositeDisposable()
  },

  deactivate () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
    this.subscriptions = null
    this.goconfig = null
  },

  provide () {
    return this.getLinter()
  },

  getLinter () {
    if (this.linter) {
      return this.linter
    }
    this.linter = new GometalinterLinter(() => { return this.getGoconfig() })
    return this.linter
  },

  getGoconfig () {
    if (this.goconfig) {
      return this.goconfig
    }
    return false
  },

  consumeGoconfig (service) {
    this.goconfig = service
  }
}
