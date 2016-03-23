'use babel'

import {CompositeDisposable} from 'atom'
import os from 'os'
import path from 'path'

class GometalinterLinter {
  constructor (goconfigFunc, gogetFunc) {
    this.goget = gogetFunc
    this.goconfig = goconfigFunc
    this.subscriptions = new CompositeDisposable()

    this.name = 'gometalinter'
    this.grammarScopes = ['source.go']
    this.scope = 'project'
    this.lintOnFly = false
    this.toolCheckComplete = false
    this.subscriptions.add(atom.commands.add('atom-workspace', 'golang:updatelinters', () => {
      this.updateTools()
    }))
  }

  dispose () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
    this.subscriptions = null
    this.goget = null
    this.goconfig = null
    this.name = null
    this.grammarScopes = null
    this.lintOnFly = null
    this.toolCheckComplete = null
  }

  ready () {
    if (!this.goconfig) {
      return false
    }
    let config = this.goconfig()
    if (!config) {
      return false
    }

    return true
  }

  lint (editor) {
    if (!this.ready() || !editor) {
      return []
    }
    let buffer = editor.getBuffer()
    if (!buffer) {
      return []
    }
    let args = atom.config.get('gometalinter-linter.args')
    if (!args || args.constructor !== Array || args.indexOf('--json') === -1) {
      args = ['--vendor', '--fast', '--json', './...']
    }
    if (args.indexOf('--json') === -1) {
      args.unshift('--json')
    }

    let config = this.goconfig()
    let options = this.getLocatorOptions(editor)
    return config.locator.findTool('gometalinter', options).then((cmd) => {
      if (!cmd) {
        this.checkForTool(editor)
        return []
      }

      let options = this.getExecutorOptions(editor)
      return config.executor.exec(cmd, args, options).then((r) => {
        if (r.stderr && r.stderr.trim() !== '') {
          console.log('gometalinter-linter: (stderr) ' + r.stderr)
        }
        let messages = []
        if (r.stdout && r.stdout.trim() !== '') {
          messages = this.mapMessages(r.stdout, editor, options.cwd)
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

  checkForTool (editor = atom.workspace.getActiveTextEditor()) {
    let config = this.goconfig()
    let options = this.getLocatorOptions(editor)
    return config.locator.findTool('gometalinter', options).then((cmd) => {
      if (!cmd && !this.toolCheckComplete) {
        this.toolCheckComplete = true
        let goget = this.goget()
        if (!goget) {
          return
        }
        goget.get({
          name: 'gometalinter-linter',
          packageName: 'gometalinter',
          packagePath: 'github.com/alecthomas/gometalinter',
          type: 'missing' // TODO check whether missing or outdated
        }).then((r) => {
          if (!r.success) {
            return false
          }
          return this.updateTools(editor)
        }).catch((e) => {
          console.log(e)
        })
      }
    })
  }

  getLocatorOptions (editor = atom.workspace.getActiveTextEditor()) {
    let options = {}
    if (editor) {
      options.file = editor.getPath()
      options.directory = path.dirname(editor.getPath())
    }
    if (!options.directory && atom.project.paths.length) {
      options.directory = atom.project.paths[0]
    }

    return options
  }

  getExecutorOptions (editor = atom.workspace.getActiveTextEditor()) {
    let o = this.getLocatorOptions(editor)
    let options = {}
    if (o.directory) {
      options.cwd = o.directory
    }
    let config = this.goconfig()
    if (config) {
      options.env = config.environment(o)
    }
    if (!options.env) {
      options.env = process.env
    }
    return options
  }

  updateTools (editor = atom.workspace.getActiveTextEditor()) {
    if (!this.ready()) {
      return Promise.resolve(false)
    }
    let config = this.goconfig()
    let options = this.getLocatorOptions(editor)
    return config.locator.findTool('gometalinter', options).then((cmd) => {
      if (!cmd) {
        return false
      }

      let args = ['--install', '--update']
      let notification = atom.notifications.addInfo('gometalinter', {
        dismissable: false,
        icon: 'cloud-download',
        description: 'Running `gometalinter --install --update` to install and update tools.'
      })
      let options = this.getExecutorOptions(editor)
      return config.executor.exec(cmd, args, options).then((r) => {
        notification.dismiss()
        let detail = r.stdout + os.EOL + r.stderr

        if (r.exitcode !== 0) {
          atom.notifications.addWarning('gometalinter', {
            dismissable: true,
            icon: 'cloud-download',
            detail: detail.trim()
          })
          return r
        }
        if (r.stderr && r.stderr.trim() !== '') {
          console.log('gometalinter-linter: (stderr) ' + r.stderr)
        }
        atom.notifications.addSuccess('gometalinter', {
          dismissable: true,
          icon: 'cloud-download',
          detail: detail.trim(),
          description: 'The tools were installed and updated.'
        })
        return r
      })
    })
  }

  mapMessages (data, editor, cwd) {
    let messages = []
    try {
      messages = JSON.parse(data)
    } catch (e) {
      console.log(e)
    }

    if (!messages || messages.length < 1) {
      return []
    }
    messages.sort((a, b) => {
      if (!a && !b) {
        return 0
      }
      if (!a && b) {
        return -1
      }
      if (a && !b) {
        return 1
      }

      if (!a.path && b.path) {
        return -1
      }
      if (a.path && !b.path) {
        return 1
      }
      if (a.path === b.path) {
        if (a.line - b.line === 0) {
          return a.row - b.row
        }
        return a.line - b.line
      } else {
        return a.path.localeCompare(b.path)
      }
    })

    let results = []

    for (let message of messages) {
      let range
      if (message.col && message.col >= 0) {
        range = [[message.line - 1, message.col - 1], [message.line - 1, 1000]]
      } else {
        range = [[message.line - 1, 0], [message.line - 1, 1000]]
      }
      results.push({name: message.linter, type: message.severity, row: message.line, column: message.col, text: message.message + ' (' + message.linter + ')', filePath: path.join(cwd, message.path), range: range})
    }

    return results
  }
}
export {GometalinterLinter}
