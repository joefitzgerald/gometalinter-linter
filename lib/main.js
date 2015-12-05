'use babel'

import {CompositeDisposable} from 'atom'
import {GometalinterLinter} from './linter'

export default {
  golangconfig: null,
  subscriptions: null,
  dependenciesInstalled: null,

  activate () {
    this.subscriptions = new CompositeDisposable()
    require('atom-package-deps').install('gometalinter-linter').then(() => {
      this.dependenciesInstalled = true
    }).catch((e) => {
      console.log(e)
    })
  },

  deactivate () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
    this.subscriptions = null
    this.goconfig = null
    this.dependenciesInstalled = null
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
