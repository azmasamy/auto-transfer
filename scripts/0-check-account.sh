#!/usr/bin/env bash

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable"
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable"
[ -z "$SENDER" ] && echo "Missing \$OWNER environment variable"
[ -z "$RECIEVER" ] && echo "Missing \$OWNER environment variable"

echo "deleting $CONTRACT $OWNER $SENDER $RECIEVER and setting $OWNER as beneficiary"
echo
near delete $CONTRACT $OWNER $SENDER $RECIEVER

echo "Creating contract"
echo
near create-account "$CONTRACT" --masterAccount "$OWNER" --initialBalance 1

echo "Creating sender"
echo
near create-account "$SENDER" --masterAccount "$OWNER" --initialBalance 1

echo "Creating reciever"
echo
near create-account "$RECIEVER" --masterAccount "$OWNER" --initialBalance 1

# exit on first error after this point to avoid redeploying with successful build
set -e