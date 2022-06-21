#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo "Listing all transfers"
echo
near view  "$CONTRACT" getAllTransfers