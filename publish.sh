#!/bin/sh

rover subgraph introspect http://localhost:4001 | rover subgraph publish starstuff@fed2 --name accounts --routing-url https://accounts.demo.starstuff.dev --schema -
rover subgraph introspect http://localhost:4002 | rover subgraph publish starstuff@fed2 --name reviews --routing-url https://reviews.demo.starstuff.dev --schema -
rover subgraph introspect http://localhost:4003 | rover subgraph publish starstuff@fed2 --name products --routing-url https://products.demo.starstuff.dev --schema -
rover subgraph introspect http://localhost:4004 | rover subgraph publish starstuff@fed2 --name inventory --routing-url https://inventory.demo.starstuff.dev --schema -
