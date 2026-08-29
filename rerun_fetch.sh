#!/bin/bash
while true; do
    echo "$(date): starting fetch_data.py"
    if python3 src/fetch_data.py; then
        echo "$(date): fetch_data.py finished successfully, exiting loop"
        break
    fi
    echo "$(date): fetch_data.py crashed, retrying in 15 minutes"
    sleep 900
done
