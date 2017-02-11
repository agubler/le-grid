#!/bin/bash

#npm install
git checkout -B gh-pages
grunt release --pre-release-tag=alpha --dry-run --skip-checks
cd src
mv examples src
mkdir examples
mv src examples
cd examples
cp ../../tsconfig.json .
cp ../../package.json .
mv ../../dist/le-grid-*.tgz .
rm src/index.ts
git add .
git commit -am "examples"
cd ../..
git filter-branch -f --prune-empty --subdirectory-filter src/examples
tar -xvzf le-grid-*.tgz
mv package node_modules/le-grid
npm install @dojo/cli-build-webpack @dojo/cli
perl -pi -w -e "s/from '.\/..\//from 'le-grid\//g;" ./src/*
#dojo build
#mkdir examples

