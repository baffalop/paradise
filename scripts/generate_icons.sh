#!/usr/bin/env bash

iosSizes="20x1 20x2 20x3 29x1 29x2 29x3 40x1 40x2 40x3 60x2 60x3 76x1 76x2 83.5x2 1024x1"

if [[ $# -eq 0 ]]; then
    echo Please provide base logo image path
    exit 1
fi

source=$1
name=${source%.*}
dst=${2:-.}

# iOS
for s in $iosSizes; do
    size=${s%x*}
    scale=${s##*x}
    resize=$( bc <<< ${size}*${scale} )
    convert "$source" -resize ${resize}x${resize}! -unsharp 1x4 "$dst/${name}-${size}@${scale}x.png"
done

# android
# convert "$source" -resize 36x36!   -unsharp 1x4 "Icon-ldpi.png"
# convert "$source" -resize 48x48!   -unsharp 1x4 "Icon-mdpi.png"
# convert "$source" -resize 72x72!   -unsharp 1x4 "Icon-hdpi.png"
# convert "$source" -resize 96x96!   -unsharp 1x4 "Icon-xhdpi.png"
# convert "$source" -resize 144x144! -unsharp 1x4 "Icon-xxhdpi.png"
# convert "$source" -resize 192x192! -unsharp 1x4 "Icon-xxxhdpi.png"
