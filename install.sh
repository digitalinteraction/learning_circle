#!/bin/sh

echo 'Installing git hooks'
cp -rfv .hooks/* .git/hooks/
git config --local alias.sl '!.bin/gitls'

echo "\033[42mDone!\033[0m"
