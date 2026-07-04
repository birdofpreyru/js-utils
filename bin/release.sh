#/bin/sh

set -e # Interrupt the deployment if any command fails.

export NPM_ID_TOKEN=$(circleci run oidc get --claims '{"aud": "npm:registry.npmjs.org"}')
npm publish --access public
