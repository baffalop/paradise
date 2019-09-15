#!/usr/bin/env bash

if [[ $# -eq 0 ]]; then
    echo Please provide base logo image path
    exit 1
fi

iosSizes="20x1 20x2 20x3 29x1 29x2 29x3 40x1 40x2 40x3 60x2 60x3 76x1 76x2 83.5x2 1024x1"

source=$1
dst=${2:-.}

set -x

# iOS
for s in $iosSizes; do
    size=${s%x*}
    scale=${s##*x}
    resize=$( bc <<< ${size}*${scale} )

    convert "$source" -resize ${resize}x${resize}! -unsharp 1x4 "$dst/icon-ios-${size}@${scale}x.png"
done

# android
androidSizes="ldpi:36 mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192"

for s in $androidSizes; do
    name=${s%:*}
    size=${s#*:}

    convert "$source" -resize "${size}x${size}!" -unsharp 1x4 "$dst/icon-android-${name}.png"
done
