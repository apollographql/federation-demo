// Import required symbols
const { HttpInstrumentation } = require ('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require ('@opentelemetry/instrumentation-express');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { SimpleSpanProcessor, ConsoleSpanExporter, BatchSpanProcessor } = require ("@opentelemetry/sdk-trace-base");
const { Resource } = require('@opentelemetry/resources');
const { GraphQLInstrumentation } = require ('@opentelemetry/instrumentation-graphql');
const { JaegerExporter } = require ('@opentelemetry/exporter-jaeger');
const { JaegerPropagator } = require('@opentelemetry/propagator-jaeger');

// Register server-related instrumentation
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new GraphQLInstrumentation()
  ]
});

// Initialize provider and identify this particular service
// (in this case, we're implementing a federated gateway)
const provider = new NodeTracerProvider({
  resource: Resource.default().merge(new Resource({
    // Replace with any string to identify this service in your system
    "service.name": "inventory",
  })),
});

provider.register({
  propagator: new JaegerPropagator()
});

const options = {
  tags: [], // optional
  // You can use the default UDPSender
  host: process.env.JAEGER_HOST || 'localhost', // optional
  port: 6832, // optional
  // OR you can use the HTTPSender as follows
  // endpoint: 'http://localhost:14268/api/traces',
  maxPacketSize: 65000 // optional
}
const exporter = new JaegerExporter(options);
provider.addSpanProcessor(new BatchSpanProcessor(exporter, {
  scheduledDelayMillis: 100
}));

// Register the provider to begin tracing
provider.register();
