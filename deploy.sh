#!/bin/sh

pnpm run build

cd functions
pnpm run build
cd ..

firebase deploy
