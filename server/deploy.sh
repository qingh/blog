#!/bin/bash
tsc && mkdir -p dist/public/assets/images
cp ./src/public/assets/images/avatar.png ./dist/public/assets/images
cross-env NODE_ENV=production db=mysql pm2 start deploy.json