const convertCurlyBracesToHashtag = (path) => {
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
        acc + forwardSlash + "#" + eachWord.substring(1, eachWord.length - 1)
      );
    }
    return acc + forwardSlash + eachWord;
  }, "");
};

module.exports = {
  convertCurlyBracesToHashtag,
};
