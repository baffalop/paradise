#!/usr/bin/env bash

if [[ $# -eq 0 ]]; then
    echo Please provide base image path
    exit 1
fi

iosSizes="Default~iphone:320x480 Default@2x~iphone:640x960 Default-Portrait~ipad:768x1024 Default-Portrait@2x~ipad:1536x2048 Default-Landscape~ipad:1024x768 Default-Landscape@2x~ipad:2048x1536 Default-568h@2x~iphone:640x1136 Default-667h:750x1334 Default-736h:1242x2208"

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
