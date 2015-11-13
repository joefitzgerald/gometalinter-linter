# `gometalinter-linter` [![Build Status](https://travis-ci.org/joefitzgerald/gometalinter-linter.svg)](https://travis-ci.org/joefitzgerald/gometalinter-linter) [![Build status](https://ci.appveyor.com/api/projects/status/todoupdateme?svg=true)](https://ci.appveyor.com/project/joefitzgerald/gometalinter-linter)

> **[gometalinter](https://github.com/alecthomas/gometalinter)**
>
> Aggregate and normalise the output of a whole bunch of Go linters.

`gometalinter-linter` is a [Linter](https://atom.io/packages/linter) provider that runs [`gometalinter`](https://github.com/alecthomas/gometalinter) on your file(s). It depends on the following packages, which _**must** be installed for the package to function correctly_:

* [`go-config`](https://atom.io/packages/go-config)
* A consumer of the linter service that this package provides:
  * [`linter`](https://atom.io/packages/linter) (Recommended)
  * [`nuclide-diagnostics`](https://atom.io/packages/nuclide-installer)

## Which Linters Does This Package Run?

Rather than list all the linters that [`gometalinter`](https://github.com/alecthomas/gometalinter) runs here (and let the list get out of date), head over to the [`gometalinter`](https://github.com/alecthomas/gometalinter) repository to find out the current state (it's pretty awesome!):

> https://github.com/alecthomas/gometalinter
