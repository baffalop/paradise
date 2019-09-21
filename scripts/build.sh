#!/usr/bin/env bash

npm run build

# generate icons
iconDst='res/icon/'
iconSrcFile="${iconDst}/icon-src.png"
if [[ "$iconSrcFile" -nt "${iconDst}/icon-ios-1024@1x.png" || "$iconSrcFile" -nt "${iconDst}/icon-android-ldpi.png" ]]; then
    scripts/generate_icons.sh "$iconSrcFile" "$iconDst"
else
    echo No need to generate icons
fi

# generate splashscreen
screenDst='res/screen/'
screenFile="${screenDst}/splashscreen.png"
if [[ "$screenFile" -nt "${screenDst}/Default@2x~universal~anyany.png" || "$screenFile" -nt "${screenDst}/android-port-xhdpi.png" ]]; then
    scripts/generate_splashscreen.sh "$screenFile" "$screenDst"
else
    echo No need to generate splashscreen
fi
