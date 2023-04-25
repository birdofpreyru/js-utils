[React Utils]: https://github.com/birdofpreyru/react-utils

# JS Utils

[_TODO: Latest NPM version / Link to NPM package page_]
[_TODO: NPM monthly downloads count / Link to NPM package page_]
[_TODO: CircleCI status of primary branch build / Link to CircleCI project page_]
[![GitHub repo stars](https://img.shields.io/github/stars/birdofpreyru/js-utils?style=social)](https://github.com/birdofpreyru/js-utils)

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
Consumers of that NPM package thus will have access to both TS (`/ts` folder)
and JS (`/js` folder) version of the library.
