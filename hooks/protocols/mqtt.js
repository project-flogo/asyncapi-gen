const {
  replaceCurlyBracesWith,
  substituteVariablesWithValues,
  getValueFromVariable,
} = require("./utils.js");

const importUrl = "github.com/project-flogo/edge-contrib/trigger/mqtt";
const splitImportUrl = importUrl.split("/");
const ref = splitImportUrl[splitImportUrl.length - 1];

const getHandlerArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map((channelName) => {
    const channel = asyncapi.channels()[channelName];
    const topicName = replaceCurlyBracesWith(channelName, "#");
    const resourceURI = `${resourceType}URI`;

    return {
      settings: {
        topic: topicName,
      },
      action: {
        ref: `#${resourceType}`,
        settings: {
          [resourceURI]: `res://${resourceType}:${
            channel.publish()
              ? channel.publish().id()
              : channel.subscribe().id()
          }`,
        },
        input: {
          message: "=$.message",
          topic: "=$.topic",
          topicParams: "=$.topicParams",
        },
        output: {
          data: "=$.data",
        },
      },
    };
  });
};

const getResources = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map((channelName, index) => {
    const channel = asyncapi.channels()[channelName];
    return {
      id: `${resourceType}:${
        channel.publish() ? channel.publish().id() : channel.subscribe().id()
      }`,
      data: {
        metadata: {
          input: [
            {
              name: "message",
              type: "string",
            },
            {
              name: "topic",
              type: "string",
            },
            {
              name: "topicParams",
              type: "params",
            },
          ],
          output: [
            {
              name: "data",
              type: "object",
            },
          ],
        },
      },
    };
  });
};

const getTriggers = (asyncapi, serverName, resourceType) => {
  const currServer = asyncapi.server(serverName);
  let brokerUrl = currServer.url();
  let mqttBinding = currServer.bindings() ? currServer.binding("mqtt") : null;
  return [
    {
      id: serverName,
      ref: `#${ref}`,
      settings: {
        broker: substituteVariablesWithValues(
          brokerUrl,
          currServer.variables()
        ),
        id: mqttBinding && mqttBinding.clientId ? mqttBinding.clientId : null,
      },
      handlers: getHandlerArr(asyncapi, resourceType),
    },
  ];
};

const getImports = () => {
  return [importUrl];
};

const generateJson = (asyncapi, serverName, resourceType) => {
  return {
    triggers: getTriggers(asyncapi, serverName, resourceType),
    resources: getResources(asyncapi, resourceType),
    imports: getImports(),
  };
};

module.exports = generateJson;
