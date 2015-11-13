'use babel'

import {CompositeDisposable} from 'atom'

class GometalinterLinter {
  constructor (golangconfigFunc) {
    this.golangconfig = golangconfigFunc
    this.subscriptions = new CompositeDisposable()

    this.name = 'gometalinter'
    this.grammarScopes = ['source.go']
    this.scope = 'project'
    this.lintOnFly = false
  }

  dispose () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
    this.subscriptions = null
  }

  ready () {
    if (!this.golangconfig) { // TODO: Check It Is A Function
      return false
    }
    let config = this.golangconfig()
    if (!config) {
      return false
    }
    return true
  }

  lint (editor) {
    if (!this.ready()) {
      return []
    }

    let config = this.golangconfig()
    return Promise.resolve().then(() => {
      config.executor.exec()
      return [{
        type: 'Error',
        text: 'Something went wrong',
        range: [[0, 0], [0, 1]],
        filePath: editor.getPath()
      }]
    })
  }
}
export {GometalinterLinter}
