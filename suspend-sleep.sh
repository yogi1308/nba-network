#!/bin/bash
# suspends sleep so that the fetch can run overnight
systemd-inhibit --what=sleep:idle --why="running nba-network fetch script" ./retry_fetch.sh
