const mqtt = require("./mqtt.js");
const kafka = require("./kafka.js");
const http = require("./http.js");
const ws = require("./ws.js");
const stomp = require("./stomp.js");

const getConverter = (protocolName) => {
  switch (protocolName) {
    case "kafka":
    case "kafka-secure":
      return kafka;
    case "http":
      return http;
    case "https":
      return http;
    case "ws":
    case "wss":
      return ws;
    case "stomp":
      return stomp;
    case "mqtt":
      return mqtt;
    default:
      return null;
  }
};
module.exports = getConverter;
