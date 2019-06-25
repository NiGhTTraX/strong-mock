#!/usr/bin/env bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

# nyc will create the report relative to cwd so we need to be in root.
cd ..

rm -rf tests/node/results .nyc_output

# --silent so we don't get the npm err epilogue.
npm run test:node:coverage --silent

node_modules/.bin/nyc report
node_modules/.bin/nyc check-coverage
