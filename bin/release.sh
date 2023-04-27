#/bin/sh

set -e # Interrupt the deployment if any command fails.

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
npm publish --access public
