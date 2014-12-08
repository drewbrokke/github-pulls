#!/bin/bash

APPDIR=/opt
RESOURCES=/usr/share
EXEDIR=/usr/bin

## Place application folder in /opt
if [ -e $APPDIR/github-pulls-linux64 ]; then
  rm -r $APPDIR/github-pulls-linux64
fi

mv ../github-pulls-linux64 $APPDIR

## Install .desktop file
if [ -e $RESOURCES/applications/github-pulls.desktop ]; then
  rm $RESOURCES/applications/github-pulls.desktop
fi

mv resources/github-pulls.desktop $RESOURCES/applications

## Install icon
if [ -e $RESOURCES/pixmaps/github-pulls.png ]; then
  rm $RESOURCES/pixmaps/github-pulls.png
fi

mv resources/github-pulls.png $RESOURCES/pixmaps

## Create symbolic link
if [ -e $EXEDIR/github-pulls ]; then
  rm $EXEDIR/github-pulls
fi

ln -s $APPDIR/github-pulls-linux64/github-pulls $EXEDIR
