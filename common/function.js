async function getTodayFormattedDate() {
  let newDate = new Date().toISOString();
  var splittedDate = await newDate.split("T");
  return splittedDate[0];
}

async function getFileName(imageUrl) {
  let url = imageUrl;
  let splitArray = await url.split("/");
  let fileName = await splitArray[splitArray.length - 1];
  return fileName;
}

async function getFilterJson(json) {
  json.forEach(async (element) => {
    element["details"] = (await element.details)
      ? JSON.parse(element.details)
      : [];
    return element;
  });
  return await json;
}

async function responseGenerator(statusCode, message, data = []) {
  var details = await {
    statusCode: statusCode,
    message: message,
    data: data,
  };

  return details;
}

module.exports = {
  getTodayFormattedDate,
  getFileName,
  getFilterJson,
  responseGenerator,
};
