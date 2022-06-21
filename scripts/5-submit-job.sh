#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo "Submitting a job"
echo
near call "$CONTRACT" submitJob '{"jobTitle":"title1", "submitedWork":"submitted4@stu.com"}' --account-id=msaudi.testnet --gas=300000000000000 --amount=1