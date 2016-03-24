# `gometalinter-linter` [![Build Status](https://travis-ci.org/joefitzgerald/gometalinter-linter.svg?branch=master)](https://travis-ci.org/joefitzgerald/gometalinter-linter) [![Build status](https://ci.appveyor.com/api/projects/status/u94yqsase23bydtb/branch/master?svg=true)](https://ci.appveyor.com/project/joefitzgerald/gometalinter-linter/branch/master)

> **[gometalinter](https://github.com/alecthomas/gometalinter)**
>
> Aggregate and normalise the output of a whole bunch of Go linters.

`gometalinter-linter` is a [Linter](https://atom.io/packages/linter) provider that runs [`gometalinter`](https://github.com/alecthomas/gometalinter) on your file(s). It depends on the following packages:

* [`go-config`](https://atom.io/packages/go-config)
* [`go-get`](https://atom.io/packages/go-get)
* A consumer of the linter service that this package provides:
  * [`linter`](https://atom.io/packages/linter) (Recommended)
  * [`nuclide-diagnostics`](https://atom.io/packages/nuclide-installer)

## Which Linters Does This Package Run?

Rather than list all the linters that [`gometalinter`](https://github.com/alecthomas/gometalinter) runs here (and let the list get out of date), head over to the [`gometalinter`](https://github.com/alecthomas/gometalinter) repository to find out the current state (it's pretty awesome!):

> https://github.com/alecthomas/gometalinter

## Configuration

[`gometalinter`](https://github.com/alecthomas/gometalinter) has [many flags](https://github.com/alecthomas/gometalinter#details) that can be used for customization. You can use flags to enable or disable specific linters. The `--json` flag will always be added if it is missing. The defaults used for this package are:

#### When Viewed In The Package Settings Dialog

This is helpful if you would like to copy-paste the settings in as a starting point for further customization.

```
--vendor, --disable-all, --enable=vet, --enable=vetshadow, --enable=golint, --enable=ineffassign, --enable=goconst, --tests, --json, .
```

#### When You Open Your Atom Config File (`config.cson` / `config.json`)

`config.cson`
```cson
"gometalinter-linter":
  args: [
    "--vendor"
    "--disable-all"
    "--enable=vet"
    "--enable=vetshadow"
    "--enable=golint"
    "--enable=ineffassign"
    "--enable=goconst"
    "--tests"
    "--json"
    "."
  ]
```

`config.json`
```json
"gometalinter-linter": {
  "args": [
    "--vendor",
    "--disable-all",
    "--enable=vet",
    "--enable=vetshadow",
    "--enable=golint",
    "--enable=ineffassign",
    "--enable=goconst",
    "--tests",
    "--json",
    "."
  ]
}
```
