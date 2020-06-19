const fs = require("fs");
const path = require("path");
const flogoGenerator = require("./flogo-generator.js");

module.exports = {
  "generate:before": (generator) => {
    let resourceType = "flow";
    let server = "";

    if (generator.templateParams) {
      if (generator.templateParams["resourceType"] === "stream") {
        resourceType = "stream";
      }
      //if server entered as parameter use it, else set it as null
      let serverFromParam = generator.templateParams["server"];
      server = serverFromParam ? serverFromParam : null;
    }
    const flogoJSON = flogoGenerator(generator.asyncapi, resourceType, server);
    fs.writeFileSync(
      path.resolve(generator.targetDir, `flogo.json`),
      JSON.stringify(flogoJSON, null, 2)
    );
  },
};
