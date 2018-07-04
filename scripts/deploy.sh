#!/bin/bash

npm install
git checkout -B gh-pages
npm run examples
git add -f examples/output/dist
git commit -am "build examples"
git filter-branch -f --prune-empty --subdirectory-filter examples/output/dist
git remote add ssh-remote git@github.com:agubler/le-grid.git
git push -f ssh-remote gh-pages
git checkout -
