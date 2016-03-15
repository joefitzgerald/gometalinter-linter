'use babel'
/* eslint-env jasmine */

describe('gometalinter-linter', () => {
  let mainModule = null

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage('go-config').then(() => {
        return atom.packages.activatePackage('gometalinter-linter')
      }).then((pack) => {
        mainModule = pack.mainModule
      })
    })

    waitsFor(() => {
      return mainModule.getGoconfig() !== false
    })
  })

  describe('when the go-metalinter package is activated', () => {
    it('activates successfully', () => {
      expect(mainModule).toBeDefined()
      expect(mainModule).toBeTruthy()
      expect(mainModule.getLinter).toBeDefined()
      expect(mainModule.getGoconfig).toBeDefined()
      expect(mainModule.consumeGoconfig).toBeDefined()
      expect(mainModule.getGoconfig()).toBeTruthy()
      expect(mainModule.getLinter()).toBeTruthy()
    })
  })
})
