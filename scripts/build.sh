#!/usr/bin/env bash

npm run build

# generate icons
iconDst='res/icon/'
iosIconFile="${iconDst}/icon-ios.png"
if [[ "$iosIconFile" -nt "${iconDst}/icon-ios-1024@1x.png" ]]; then
    scripts/generate_icons.sh "$iosIconFile" "$iconDst"
else
    echo No need to generate icons
fi

# generate splashscreen
screenDst='res/screen/'
screenFile="${screenDst}/splashscreen.png"
if [[ "$screenFile" -nt "${screenDst}/Default~iphone.png" ]]; then
    scripts/generate_splashscreen.sh "$screenFile" "$screenDst"
else
    echo No need to generate splashscreen
fi
