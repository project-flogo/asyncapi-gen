# Flogo JSON template for the AsyncAPI Generator

- [Project Flogo repo](https://github.com/project-flogo/core)
- [AsyncAPI Generator repo](https://github.com/asyncapi/generator)

## Usage

```
ag asyncapi.yml project-flogo/asyncapi-gen -o output
```

If you don't have the AsyncAPI Generator installed, you can install it like this:

```
npm install -g @asyncapi/generator
```

## Supported parameters

| Name         | Description                                                                                                   | Required | Example      |
| ------------ | ------------------------------------------------------------------------------------------------------------- | -------- | ------------ |
| server       | The server you want to use in the Flogo app. If not specified defaults to the first server that can be found. | No       | `production` |
| resourceType | The Flogo resource type to generate. Defaults to `flow`.                                                      | No       | `flow`       |

## Supported protocols

- HTTP (`http`, `https`)
- Kafka (`kafka`, `kafka-secure`)
- MQTT (`mqtt`)
- Stomp (`stomp`)
- WebSockets (`ws`, `wss`)

## Supported Flogo resource types

- [Flow](https://github.com/project-flogo/flow) (`flow`)
- [Stream](https://github.com/project-flogo/stream) (`stream`)
