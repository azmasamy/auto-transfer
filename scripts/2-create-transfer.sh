#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo "Creating a transfer"
echo
near call  "$CONTRACT" transferAfterDate '{"receiver":"$RECIEVER","amount":"5","date":"2020-07-10 15:00:00.000"}' --account-id="$OWNER"