services=(accounts inventory products reviews )

for service in "${services[@]}"
do
   : 
   pushd services/${service}
   flyctl deploy
   popd
done
pushd fly-gateway
flyctl deploy
popd
