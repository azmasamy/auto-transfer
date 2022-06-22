#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo "Withdraw Transfer"
echo
near call  "$CONTRACT" withdrawTransfer '{"id":"HTAHIR.TESTNET/1655893135547962041"}'  --account-id="hamzatest.testnet"