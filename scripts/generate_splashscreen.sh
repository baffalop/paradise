#!/usr/bin/env bash

if [[ $# -eq 0 ]]; then
    echo Please provide base image path
    exit 1
fi

iosSizes="Default@2x~universal~anyany:2732x2732 Default@2x~universal~comany:1278x2732 Default@2x~universal~comcom:1334x750 Default@3x~universal~anyany:2208x2208 Default@3x~universal~anycom:2208x1242 Default@3x~universal~comany:1242x2208"

source=$1
dst=${2:-.}

set -x

for s in $iosSizes; do
    name=${s%:*}
    dim=${s#*:}
    w=${dim%x*}
    h=${dim#*x}

    # if landscape, flip dimensions to portrait and then rotate
    if [[ $w -gt $h ]]; then
        convert "$source" -resize "x${w}" -unsharp 1x4 -gravity center -crop "${h}x${w}+0+0" +repage -rotate '-90' "$dst/$name.png"
    else
        convert "$source" -resize "x${h}" -unsharp 1x4 -gravity center -crop "${w}x${h}+0+0" +repage "$dst/$name.png"
    fi
done

androidSizes='ldpi:200x320 mdpi:320x480 hdpi:480x800 xhdpi:720x1280'

for s in $androidSizes; do
    name=${s%:*}
    dim=${s#*:}
    w=${dim%x*}
    h=${dim#*x}

    # portrait
    convert "$source" -resize "x${h}" -unsharp 1x4 -gravity center -crop "${w}x${h}+0+0" +repage "${dst}/android-port-${name}.png"
    # landscape
    convert "$source" -resize "x${h}" -unsharp 1x4 -gravity center -crop "${w}x${h}+0+0" +repage -rotate '-90' "${dst}/android-land-${name}.png"
done
