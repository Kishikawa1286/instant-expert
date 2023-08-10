#!/bin/sh

# Install Firebase CLI
curl -sL https://firebase.tools | bash

# See: https://code.visualstudio.com/remote/advancedcontainers/improve-performance#_use-a-targeted-named-volume
sudo chown node node_modules
pnpm install

cd functions
pnpm install
