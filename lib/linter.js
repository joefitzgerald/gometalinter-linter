'use babel'

import {CompositeDisposable} from 'atom'
import path from 'path'

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
    let buffer = editor.getBuffer()
    if (!buffer) {
      return []
    }
    let config = this.golangconfig()
    return config.locator.findTool('gometalinter').then((cmd) => {
      if (!cmd) {
        return []
      }
      let cwd = path.dirname(buffer.getPath())
      let env = config.environment()
      let gopath = config.locator.gopath({
        file: editor.getPath(),
        directory: path.dirname(editor.getPath())
      })
      if (!gopath || gopath === '') {
        return []
      }
      env['GOPATH'] = gopath
      let args = ['./...']
      return config.executor.exec(cmd, args, {cwd: cwd}).then((r) => {
        if (r.stderr && r.stderr.trim() !== '') {
          console.log('gometalinter-linter: (stderr) ' + r.stderr)
        }
        let messages = []
        if (r.stdout && r.stdout.trim() !== '') {
          messages = this.mapMessages(r.stdout, editor, cwd)
        }
        if (!messages || messages.length < 1) {
          return []
        }
        return messages
      }).catch((e) => {
        console.log(e)
        return []
      })
    })
  }

  mapMessages (data, editor, cwd) {
    let pattern = /^(.*?):(\d*?):((\d*?):)?(.*?):\s(.*)$/img
    let messages = []
    let extract = (matchLine) => {
      if (!matchLine) {
        return
      }
      let file = null
      if (matchLine[1] && matchLine[1] !== '') {
        file = matchLine[1]
      }
      let type = matchLine[5]
      let row = matchLine[2]
      let column = matchLine[4]
      let text = matchLine[6]
      let range = null
      if (row && row !== '') {
        row = parseInt(row, 10)
        let r = row
        if (r > 0) {
          r = r - 1
        }
        if (column && column !== '') {
          column = parseInt(column, 10)
          let c = column
          if (c > 0) {
            c = c - 1
          }
          range = [[r, c], [r, c]]
        } else {
          range = [[r, 0], [r, 0]]
        }
      }
      messages.push({type: type, row: row, column: column, text: text, filePath: path.join(cwd, file), range: range})
    }
    let match = null
    do {
      match = pattern.exec(data)
      extract(match)
    } while (match)
    return messages
  }
}
export {GometalinterLinter}
