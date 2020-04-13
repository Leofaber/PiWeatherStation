#!/bin/bash

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

rm -rf /var/www/weather_station/

#mkdir -p /var/www/weather_station/public_html

#cp -r $script_dir/front_end/* /var/www/weather_station/public_html

node node_server/index.js
