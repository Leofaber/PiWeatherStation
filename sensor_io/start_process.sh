#!/bin/bash

script_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

nohup python -u $script_dir/sensor_capture.py > output.log   &

echo $! > save_pid.txt
