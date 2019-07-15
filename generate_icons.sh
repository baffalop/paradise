#!/usr/bin/env bash

iosSizes="20x1 20x2 20x3 29x1 29x2 29x3 40x1 40x2 40x3 60x2 60x3 76x1 76x2 83.5x2 1024x1"

if [[ $# -eq 0 ]]; then
    echo Please provide base logo image path
    exit 1
fi

source=$1
dst=${2:-.}

# iOS
for s in $iosSizes;do
    size=${s%x*}
    scale=${s##*x}
    resize=$( bc <<< ${size}*${scale} )
    convert "$source" -resize ${resize}x${resize}! -unsharp 1x4 "$dst/Icon-App-${size}x${size}@${scale}x.png"
done

# android
convert "$base" -resize 36x36!    "Icon-ldpi.png"
convert "$base" -resize 48x48!    "Icon-mdpi.png"
convert "$base" -resize 72x72!    "Icon-hdpi.png"
convert "$base" -resize 96x96!    "Icon-xhdpi.png"
convert "$base" -resize 144x144!  "Icon-xxhdpi.png"
convert "$base" -resize 192x192!  "Icon-xxxhdpi.png"
