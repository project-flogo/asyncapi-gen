const { convertCurlyBracesToHashtag } = require("./utils.js");

const getHandlerArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map((channelName) => {
    const channel = asyncapi.channels()[channelName];
    const topicName = convertCurlyBracesToHashtag(channelName);
    const resourceURI = `${resourceType}URI`;
    //todo: determine the functions to structure the returned object
    return {
      settings: {
        method: `<The method name>`,
        path: channelName,
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
      },
    };
  });
};

const getResourcesArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map((channelName, index) => {
    const channel = asyncapi.channels()[channelName];
    return {
      id: `${resourceType}:${
        channel.publish() ? channel.publish().id() : channel.subscribe().id()
      }`,
      data: {},
    };
  });
};

//todo: determine the functions to structure the returned object
const getHandlersFromServers = (asyncapi, serverName, resourceType) => {
  const currServer = asyncapi.server(serverName);
  let brokerUrl = currServer.url();
  let protocol = currServer.protocol();
  return [
    {
      id: serverName,
      ref: `#${protocol}`,
      settings: {
        port: brokerUrl.replace(
          "{port}",
          currServer.variable("port").defaultValue()
        ),
      },
      handlers: getHandlerArr(asyncapi, resourceType, protocol),
    },
  ];
};

const getImports = () => {
  return ["github.com/project-flogo/contrib/trigger/rest"];
};

const generateJson = (asyncapi, serverName, resourceType) => {
  return {
    triggers: getHandlersFromServers(asyncapi, serverName, resourceType),
    resources: getResourcesArr(asyncapi, resourceType),
    imports: getImports(),
  };
};

module.exports = generateJson;
