#!/bin/bash

declare -r SSH_FILE="$(mktemp -u $HOME/.ssh/XXXXX)"
openssl aes-256-cbc -K $encrypted_ca9b4100768e_key -iv $encrypted_ca9b4100768e_iv -in "github_deploy_key.enc" -out "$SSH_FILE" -d
chmod 600 "$SSH_FILE" && printf "%s\n" "Host github.com"  "  IdentityFile $SSH_FILE" "  LogLevel ERROR" >> ~/.ssh/config
npm install
git checkout -B gh-pages
npm run examples
git add -f examples/output/dist
git commit -am "build examples"
git filter-branch -f --prune-empty --subdirectory-filter examples/output/dist
git push -f ssh-remote gh-pages
git checkout -
