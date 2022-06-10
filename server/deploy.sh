#!/bin/bash
tsc && mkdir -p dist/public/assets/images
cross-env NODE_ENV=production db=mysql pm2 start deploy.json