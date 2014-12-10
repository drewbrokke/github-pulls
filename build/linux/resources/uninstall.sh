#!/bin/bash

BGreen='\e[1;32m'       # Green
BWhite='\e[1;37m'       # White
Color_Off='\e[0m'       # Text Reset

function alert () {
	if (( $# )); then
		echo -e "$BGreen> $BWhite$1$Color_Off"
	fi
}

APPDIR=/opt
RESOURCES=/usr/share
EXEDIR=/usr/bin

alert "Removing symbolic link..."

## Remove symbolic link
if [ -e $EXEDIR/github-pulls ]; then
  rm -r $EXEDIR/github-pulls
fi

alert "Removing .desktop file..."

## Remove .desktop file
if [ -e $RESOURCES/applications/github-pulls.desktop ]; then
  rm -r $RESOURCES/applications/github-pulls.desktop
fi

alert "Removing icon..."

## Remove icon
if [ -e $RESOURCES/pixmaps/github-pulls.png ]; then
  rm -r $RESOURCES/pixmaps/github-pulls.png
fi

alert "Removing application folder..."

## Remove application folder
if [ -e $APPDIR/github-pulls-linux64 ]; then
  rm -r $APPDIR/github-pulls-linux64
fi

alert "Github Pulls uninstalled :)"