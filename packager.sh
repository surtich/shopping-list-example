#!/bin/bash
# $1 = source directory (contains html and js files)
# $2 = destination directory
# $3 = iris.path file definition
rm -Rf $2
mkdir $2
node iris_packager.js input=$1 output=$2 init=$3
rm -Rf $2
