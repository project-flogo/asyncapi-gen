const {
  replaceCurlyBracesWith,
  getValueFromVariable,
  getRefFromImportUrl,
} = require("./utils.js");
const importUrl = "github.com/project-flogo/contrib/trigger/rest";
const ref = getRefFromImportUrl(importUrl);

const getHandlerArr = (asyncapi, resourceType) => {
  return asyncapi.channelNames().map((channelName) => {
    const channel = asyncapi.channels()[channelName];
    const pathValue = replaceCurlyBracesWith(channelName, ":");
    const resourceURI = `${resourceType}URI`;

    const channelMethod = channel.publish()
      ? channel.publish()
      : channel.subscribe();
    const hasBindings = channelMethod.bindings() ? true : false;
    let httpBinding = null;
    if (hasBindings) {
      httpBinding = channelMethod.binding("http") || null;
    }

    return {
      settings: {
        //check if http binding exists and has method value use it, else use POST or GET based on whether the channel method is publish or subscribe respectively
        method:
          httpBinding && httpBinding.method
            ? httpBinding.method
            : channel.publish()
            ? "POST"
            : "GET",
        path: pathValue,
      },
      action: {
        ref: `#${resourceType}`,
        settings: {
          [resourceURI]: `res://${resourceType}:${channelMethod.id()}`,
        },
        input: {
          pathParams: "=$.pathParams",
          queryParams: "=$.queryParams",
          headers: "=$.headers",
          method: "=$.method",
          content: "=$.content",
        },
        output: {
          code: "=$.code",
          data: "=$.data",
          headers: "=$.headers",
          cookies: "=$.cookies",
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
              name: "pathParams",
              type: "params",
            },
            {
              name: "queryParams",
              type: "params",
            },
            {
              name: "headers",
              type: "params",
            },
            {
              name: "method",
              type: "string",
            },
            {
              name: "content",
              type: "any",
            },
          ],
          output: [
            {
              name: "code",
              type: "int",
            },
            {
              name: "data",
              type: "any",
            },
            {
              name: "headers",
              type: "params",
            },
            {
              name: "cookies",
              type: "array",
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

  return [
    {
      id: serverName,
      ref: `#${ref}`,
      settings: {
        port: getValueFromVariable(currServer.variables(), "port") || null,
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
