#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo "Creating a transfer"
echo
near call  "$CONTRACT" transferAfterDate '{"receiver":"hamzatest.testnet","amount":"5","date":"2020-06-10 15:00:00.000"}' --account-id="htahir.testnet" --amount=1