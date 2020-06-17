const getConverter = require("./protocols");

const FLOGO_APP_MODEL = "1.1.0";

const flogoGenerator = (asyncapi, resourceType, server) => {
  //if server passed in is not "", use it, else use all servers in the document
  let servers = server
    ? [server]
    : Object.keys(asyncapi.servers());

  const imports = [`github.com/project-flogo/${resourceType}`];
  const triggers = [];
  const resources = [];

  servers.forEach((eachServer) => {
    console.log(eachServer);
    let currentProtocol = asyncapi.server(eachServer).protocol();
    const generateFlogo = getConverter(currentProtocol);
    const result = generateFlogo(asyncapi, eachServer, resourceType);
    imports.push(...result.imports);
    triggers.push(...result.triggers);
    resources.push(...result.resources);
  });

  return {
    name: asyncapi.info().title(),
    type: "flogo:app",
    version: asyncapi.info().version(),
    appModel: FLOGO_APP_MODEL,
    description: asyncapi.info().description().split(/\n/g)[0],
    imports,
    triggers,
    resources,
  };
};

module.exports = flogoGenerator;
