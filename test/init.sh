#!/bin/bash

GEN=${PWD}/node_modules/.bin/egg-rpc-generator

# test dir

DIR=${PWD}/test/fixtures/apps
NAMES="sofarpc hardload custom-registry hessian4"

for NAME in $NAMES
do
  echo "Create ${DIR}/${NAME} proxy"
  $GEN -b ${DIR}/${NAME}
  echo "------------------------------------------------"
done

echo "All done"
