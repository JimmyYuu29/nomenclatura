#!/bin/sh
nginx -g 'daemon on;'
exec node /app/server/dist/index.js
