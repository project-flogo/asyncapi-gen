const {
  replaceCurlyBracesWith,
  substituteVariablesWithValues,
  getRefFromImportUrl,
} = require("./utils.js");

const importUrl = "github.com/project-flogo/contrib/trigger/kafka";
const ref = getRefFromImportUrl(importUrl);

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
          ],
        },
      },
    };
  });
};

//todo: determine the functions to structure the returned object
const getTriggers = (asyncapi, serverName, resourceType) => {
  const currServer = asyncapi.server(serverName);
  let brokerUrl = currServer.url();
  return [
    {
      id: serverName,
      ref: `#${ref}`,
      settings: {
        brokerUrls: substituteVariablesWithValues(
          brokerUrl,
          currServer.variables()
        ),
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
