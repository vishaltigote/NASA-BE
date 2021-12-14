const service = require("./service");
const functions = require("../../common/function");
const messages = require("../../common/messages");
const statuscode = require("../../common/statusCode");

const controller = {
  getTodaysDetails: async (req, res, next) => {
    try {
      // Get formatted date for NASA api
      let formattedTodaysDate = await functions.getTodayFormattedDate();

      // Check email is alread exists in the database or not

      let checkExists = await service.nasa().checkExists(formattedTodaysDate);

      if (checkExists.flagCheck == false) {
        let resData;
        let imageUrl;
        // Get axioms data

        let getNasaApiRes = await await service
          .nasa()
          .getNasaApiData(formattedTodaysDate);

        if (
          getNasaApiRes.flagCheck == true &&
          getNasaApiRes.data.media_type == "image"
        ) {
          imageUrl = getNasaApiRes.data.url;
          let imageName = await functions.getFileName(imageUrl);
          // download folder
          let getImageSave = await service
            .nasa()
            .downloadImage(imageUrl, imageName);
          resData = getNasaApiRes.data;

          // save image in local folder
          if (getImageSave.flagCheck == true) {
            let insertData;

            insertData = await service
              .nasa()
              .insertLogs(getNasaApiRes.data, imageUrl, formattedTodaysDate);

            // Insert into DB log response
            if (insertData.flagCheck == true) {
              res
                .status(statuscode.success)
                .send(
                  await functions.responseGenerator(
                    statuscode.success,
                    messages.success,
                    getNasaApiRes.data
                  )
                );
            } else {
              res
                .status(statuscode.error)
                .send(
                  await functions.responseGenerator(
                    statuscode.error,
                    messages.insertionError,
                    getNasaApiRes.data
                  )
                );
            }
          } else {
            res
              .status(statuscode.error)
              .send(
                await functions.responseGenerator(
                  statuscode.error,
                  messages.apiFailed,
                  []
                )
              );
          }
        } else if (getNasaApiRes.flagCheck == false) {
          res
            .status(statuscode.error)
            .send(
              await functions.responseGenerator(
                statuscode.error,
                messages.apiFailed,
                []
              )
            );
        }
      } else if (checkExists.flagCheck == true) {
        let details = await checkExists.data;
        let filterJson = await functions.getFilterJson(details);

        res
          .status(statuscode.success)
          .send(
            await functions.responseGenerator(
              statuscode.success,
              messages.success,
              filterJson
            )
          );
      }
    } catch (error) {
      res
        .status(statuscode.error)
        .send(
          await functions.responseGenerator(
            statuscode.error,
            error.message ? error.message : error,
            []
          )
        );
    }
  },

  getLogs: async (req, res, next) => {
    try {
      let getLogsRes = await service.nasa().getLogs();

      if (getLogsRes.flagCheck == true) {
        let details = await getLogsRes.data;
        let filterJson = await functions.getFilterJson(details);
        res
          .status(statuscode.success)
          .send(
            await functions.responseGenerator(
              statuscode.success,
              messages.success,
              filterJson
            )
          );
      } else {
        res
          .status(statuscode.dbNotFound)
          .send(
            await functions.responseGenerator(
              statuscode.dbNotFound,
              messages.success,
              []
            )
          );
      }
    } catch (error) {
      res
        .status(statuscode.error)
        .send(
          await functions.responseGenerator(
            statuscode.error,
            error.message ? error.message : error,
            []
          )
        );
    }
  },
};

module.exports = controller;
