#!/bin/bash

APPDIR=/opt
RESOURCES=/usr/share
EXEDIR=/usr/bin

## Remove symbolic link
if [ -e $EXEDIR/github-pulls ]; then
  rm -r $EXEDIR/github-pulls
fi

## Remove .desktop file
if [ -e $RESOURCES/applications/github-pulls.desktop ]; then
  rm -r $RESOURCES/applications/github-pulls.desktop
fi

## Remove icon
if [ -e $RESOURCES/pixmaps/github-pulls.png ]; then
  rm -r $RESOURCES/pixmaps/github-pulls.png
fi

## Remove application folder
if [ -e $APPDIR/github-pulls-linux64 ]; then
  rm -r $APPDIR/github-pulls-linux64
fi
