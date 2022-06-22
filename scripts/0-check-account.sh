#!/usr/bin/env bash

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable"
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable"

echo "deleting $CONTRACT $OWNER and setting $OWNER as the master account"
echo
near delete $CONTRACT $OWNER

echo "Creating contract"
echo
near create-account "$CONTRACT" --masterAccount "$OWNER" --initialBalance 1
set -e