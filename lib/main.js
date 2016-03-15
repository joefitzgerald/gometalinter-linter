'use babel'

import {CompositeDisposable} from 'atom'
import {GometalinterLinter} from './linter'

export default {
  dependenciesInstalled: null,
  goget: null,
  goconfig: null,
  linter: null,
  subscriptions: null,

  activate () {
    this.subscriptions = new CompositeDisposable()
    require('atom-package-deps').install('gometalinter-linter').then(() => {
      this.dependenciesInstalled = true
      return this.dependenciesInstalled
    }).catch((e) => {
      console.log(e)
    })
  },

  deactivate () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
    this.subscriptions = null
    this.goget = null
    this.goconfig = null
    this.linter = null
    this.dependenciesInstalled = null
  },

  provide () {
    let linter = this.getLinter()
    return linter
  },

  getLinter () {
    if (this.linter) {
      return this.linter
    }
    this.linter = new GometalinterLinter(
      () => { return this.getGoconfig() },
      () => { return this.getGoget() }
    )
    this.subscriptions.add(this.linter)
    return this.linter
  },

  getGoconfig () {
    if (this.goconfig) {
      return this.goconfig
    }
    return false
  },

  getGoget () {
    if (this.goget) {
      return this.goget
    }
    return false
  },

  consumeGoconfig (service) {
    this.goconfig = service
  },

  consumeGoget (service) {
    this.goget = service
  }
}
