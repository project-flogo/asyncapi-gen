const { replaceCurlyBracesWith, getRefFromImportUrl } = require("./utils.js");

const importUrl = "github.com/jvanderl/flogo-components/trigger/stomp";
const ref = getRefFromImportUrl(importUrl);

const getHandlerArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map((channelName) => {
    const channel = asyncapi.channels()[channelName];
    const topicName = replaceCurlyBracesWith(channelName, "#");
    const resourceURI = `${resourceType}URI`;

    return {
      settings: {
        source: channel.subscribe() ? topicName : null,
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
          originalSource: "=$.originalSource",
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
              type: "any",
            },
            {
              name: "originalSource",
              type: "string",
            },
          ],
        },
      },
    };
  });
};

const getTriggers = (asyncapi, serverName, resourceType) => {
  return [
    {
      //todo
      id: serverName,
      ref: `#${ref}`,
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
