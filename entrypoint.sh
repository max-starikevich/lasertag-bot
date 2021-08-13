#!/bin/bash

mkdir -p /var/log/nginx/healthd
chown -R nginx:nginx /var/log/nginx

exec "$@"