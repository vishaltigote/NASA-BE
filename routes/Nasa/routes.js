var express = require("express");
var router = express.Router();
const controller = require("./controller");

var config = require("../../config");

/* GET users listing. */
// router.get("/", function (req, res, next) {
//   var axios = require("axios");

//   var config = {
//     method: "get",
//     url: `https://api.nasa.gov/planetary/apod?api_key=${}&date=${formattedDate}`,
//     headers: {},
//   };

//   axios(config)
//     .then(function (response) {
//       console.log(JSON.stringify(response.data));

//       axios({
//         method: "get",
//         url: "https://apod.nasa.gov/apod/image/2112/auroraemeteors_boardman_1080.jpg",
//         responseType: "stream",
//       }).then(function (res) {
//         console.log("Res", res);
//         res.data.pipe(fs.createWriteStream("./public/images/my.jpg"));
//       });
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
//   res.send("respond with a resource");
// });

router.get("/getTodaysDetails", controller.getTodaysDetails);

router.get("/getLogs", controller.getLogs);

module.exports = router;
