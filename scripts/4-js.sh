#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo "Validate Transfer"
echo
near call  "$CONTRACT" validateTransfer '{}'  --account-id="$OWNER"