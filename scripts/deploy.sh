#!/bin/bash

declare -r SSH_FILE="$(mktemp -u $HOME/.ssh/XXXXX)"
openssl aes-256-cbc -K $encrypted_ca9b4100768e_key -iv $encrypted_ca9b4100768e_iv -in "github_deploy_key.enc" -out "$SSH_FILE" -d
chmod 600 "$SSH_FILE" && printf "%s\n" "Host github.com"  "  IdentityFile $SSH_FILE" "  LogLevel ERROR" >> ~/.ssh/config
npm install
npm install @dojo/cli
npm install set-up-ssh
git checkout -B gh-pages
grunt release --pre-release-tag=alpha --dry-run --skip-checks
touch src/examples/main.css
cd src
mv examples src
mkdir examples
mv src examples
cd examples
cp ../../tsconfig.json .
cp ../../package.json .
mv ../../dist/le-grid-*.tgz .
rm src/index.ts
mv src/index.app.html src/index.html
git add .
git commit -am "examples"
cd ../..
git filter-branch -f --prune-empty --subdirectory-filter src/examples
tar -xvzf le-grid-*.tgz
mv package node_modules/le-grid
perl -pi -w -e "s/from '.\/..\//from 'le-grid\//g;" ./src/*
rm -r dist
./node_modules/.bin/dojo build
git add -f dist
git commit -am "built example"
git filter-branch -f --prune-empty --subdirectory-filter dist
git remote add ssh-remote git@github.com:agubler/le-grid.git
git push -f ssh-remote gh-pages
git checkout -
