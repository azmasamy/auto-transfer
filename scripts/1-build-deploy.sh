#!/usr/bin/env bash
# exit on first error after this point to avoid redeploying with successful build
set -e

echo --------------------------------------------
echo
echo "building the contract (release build)"
echo
yarn asb --target release

echo --------------------------------------------
echo
echo "deploying the contract"
echo
near deploy --accountId="$CONTRACT" --wasmFile="./build/release/auto-transfer.wasm"

#echo "initalizing the contract"
#echo
#near call "$CONTRACT" init '{}' --accountId "$OWNER"
