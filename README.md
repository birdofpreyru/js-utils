[React Utils]: https://github.com/birdofpreyru/react-utils

# JS Utils

[![Latest NPM Release](https://img.shields.io/npm/v/@dr.pogodin/js-utils.svg)](https://www.npmjs.com/package/@dr.pogodin/js-utils)
[![NPM Downloads](https://img.shields.io/npm/dm/@dr.pogodin/js-utils.svg)](https://www.npmjs.com/package/@dr.pogodin/js-utils)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/birdofpreyru/js-utils/tree/master.svg?style=shield)](https://app.circleci.com/pipelines/github/birdofpreyru/js-utils)
[![GitHub repo stars](https://img.shields.io/github/stars/birdofpreyru/js-utils?style=social)](https://github.com/birdofpreyru/js-utils)
[![Dr. Pogodin Studio](https://raw.githubusercontent.com/birdofpreyru/js-utils/master/.README/logo-dr-pogodin-studio.svg)](https://dr.pogodin.studio/docs/js-utils)

The aim for this repo/package is to move in from the [React Utils] the pieces
which are not React-specific, thus are also useful cross non-React projects,
and thus having them in a dedicated package will faciliate their re-use
in generic JavaScript (and TypeScript) projects.

At least for the first time, all stuff moved in here will still be exposed from
[React Utils] the same  way as before, and the documentation for these pieces
will be still kept at https://dr.pogodin.studio/docs/react-utils/index.html.
Maybe later, time permitting, this will be documented as a stand-alone library,
but prior to that it will be maintained and used as a stand-alone lib, but not
very well documented as such.

Yeah, the source code will be written in TypeScript, and for the library
version released to NPM it will be also compiled into plain JavaScript.
Consumers of that NPM package thus will have access to both TS (`/src` folder)
and JS (`/build` folder) version of the library.

[![Sponsor](https://raw.githubusercontent.com/birdofpreyru/js-utils/master/.README/sponsor.svg)](https://github.com/sponsors/birdofpreyru)

## Content

The library currently exports (links below lead to [React Utils] docs,
but the same stuff can be imported from this `@dr.pogodin/js-utils`,
and used in the same way):

### Constants
- [SEC_MS](https://dr.pogodin.studio/docs/react-utils/docs/api/utils/time#sec_ms)
  &mdash; One second expressed in milliseconds.
- [MIN_MS](https://dr.pogodin.studio/docs/react-utils/docs/api/utils/time#min_ms)
  &mdash; One minute expressed in milliseconds.
- [HOUR_MS](https://dr.pogodin.studio/docs/react-utils/docs/api/utils/time#hour_ms)
  &mdash; One hour expressed in milliseconds.
- [DAY_MS](https://dr.pogodin.studio/docs/react-utils/docs/api/utils/time#day_ms)
  &mdash; One day expressed in milliseconds.
- [YEAR_MS](https://dr.pogodin.studio/docs/react-utils/docs/api/utils/time#year_ms)
  &mdash; One year expressed in milliseconds.

### Functions
- [timer()] &mdash; Creates a [Barrier] which resolves after the specified timeout.
- [withRetries()] &mdash; Attempts a given action multiple times until its succeeds.

### Classes
- [Barrier] &mdash; A [Promise] with **resolve()** and **reject()** exposed as
  instance methods.

- `Cached` &mdash; Implements a cache of (a)synchronously retrieved items with
  timestamp-based expiration. _To be documented_.

- [Emitter](https://dr.pogodin.studio/docs/react-utils/docs/api/classes/Emitter)
  &mdash; Simple listeneable data emitter.
- [Semaphore](https://dr.pogodin.studio/docs/react-utils/docs/api/classes/Semaphore)
  &mdash; Synchronization primitive.
- `Timer` &mdash; The core implementation of [timer()] functionality, allowing
  to create further customized timer objects. _To be documented_.

---
Repository of this library also hosts some documents, to be referenced from
other projects, as needed:
- [The Common Sense Versioning](./docs/common-sense-versioning.md) &mdash;
  a lax description of a lax approach to product versioning that makes more
  sense than [SemVer](https://semver.org).

<!-- References -->

[Barrier]: https://dr.pogodin.studio/docs/react-utils/docs/api/classes/Barrier
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[timer()]: https://dr.pogodin.studio/docs/react-utils/docs/api/utils/time#timer
[withRetries()]: https://dr.pogodin.studio/docs/react-utils/docs/api/functions/withretries
