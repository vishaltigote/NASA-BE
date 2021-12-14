const dbConn = require("../../common/mysql");
const util = require("util");
const query = util.promisify(dbConn.query).bind(dbConn);
const fs = require("fs");
var axios = require("axios");
var configdata = require("../../config");

class Nasa {
  async checkExists(formattedDate) {
    return new Promise(async function (resolve, reject) {
      // select * from nasa_logs
      let q = `select * from nasa_logs where date='${formattedDate}'`;
      let result = await query(q);
      if (result.length) {
        resolve({ flagCheck: true, data: result });
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }

  async getNasaApiData(formattedDate) {
    return new Promise(async function (resolve, reject) {
      var config = {
        method: "get",
        url: `https://api.nasa.gov/planetary/apod?api_key=${configdata.API_KEY}&date=${formattedDate}`,
        headers: {},
      };
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          resolve({ flagCheck: true, data: response.data });
        })
        .catch(function (error) {
          resolve({ flagCheck: false, data: [] });
        });
    });
  }

  async downloadImage(imageurl, imageName) {
    return new Promise((resolve, reject) => {
      //   "https://apod.nasa.gov/apod/image/2112/auroraemeteors_boardman_1080.jpg";
      axios({
        method: "get",
        url: imageurl,
        responseType: "stream",
      }).then(function (res) {
        console.log("Res", res);
        if (res.status == 200) {
          res.data.pipe(fs.createWriteStream(`./public/images/${imageName}`));
          resolve({ flagCheck: true, data: res });
        } else {
          resolve({ flagCheck: false, data: [] });
        }
      });
    });
  }

  async insertLogs(imageRes, imageUrl, formattedDate) {
    return new Promise(async function (resolve, reject) {
      let details = [];
      details.push(imageRes);
      let insertQuery = `insert into nasa_logs(date,details,image_url) values('${formattedDate}','${JSON.stringify(
        details
      ).replace(/[\/\(\)\']/g, "&apos;")}','${imageUrl}');`;
      let result = await query(insertQuery);
      if (result.affectedRows == 1) {
        resolve({ flagCheck: true, data: result.recordset });
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }

  async getLogs() {
    return new Promise(async function (resolve, reject) {
      // select * from nasa_logs
      let q = `select * from nasa_logs`;
      let result = await query(q);
      if (result.length) {
        resolve({ flagCheck: true, data: result });
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }
}

module.exports = {
  nasa: function () {
    return new Nasa();
  },
};
