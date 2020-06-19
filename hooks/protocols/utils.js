const replaceCurlyBracesWith = (path, replacement) => {
  return path.split("/").reduce((acc, eachWord, index) => {
    let forwardSlash = "";
    if (index > 0) {
      forwardSlash = "/";
    }
    if (
      eachWord.charAt(0) === "{" &&
      eachWord.charAt(eachWord.length - 1) === "}"
    ) {
      return (
        acc +
        forwardSlash +
        replacement +
        eachWord.substring(1, eachWord.length - 1)
      );
    }
    return acc + forwardSlash + eachWord;
  }, "");
};

const getVariablesArray = (url) => {
  let result = [],
    array;
  const regEx = /{([^}]+)}/g;

  while ((array = regEx.exec(url)) !== null) {
    result.push([array[0], array[1]]);
  }
  return result;
};

const getValueFromVariable = (object, variable) => {
  const keyValue = object[variable]._json;
  if (keyValue) return keyValue.default || (keyValue.enum && keyValue.enum[0]);
};

const substituteVariablesWithValues = (url, serverVariables) => {
  const urlVariables = getVariablesArray(url);
  const declaredVariables = urlVariables.filter((el) =>
    serverVariables.hasOwnProperty(el[1])
  );

  if (urlVariables.length !== 0 && declaredVariables.length !== 0) {
    let value;
    let newUrl = url;

    urlVariables.forEach((e) => {
      value = getValueFromVariable(serverVariables, e[1]);

      if (value) {
        newUrl = newUrl.replace(e[0], value);
      }
    });
    return newUrl;
  }
  return url;
};

module.exports = {
  replaceCurlyBracesWith,
  substituteVariablesWithValues,
  getValueFromVariable,
};
