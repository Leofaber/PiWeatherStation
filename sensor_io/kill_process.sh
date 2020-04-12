#!/bin/bash

typeset -i pid=$(cat save_pid.txt)

kill -9 $pid
