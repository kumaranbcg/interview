const axios = require("axios");
var fs = require("fs");
//const img = require("../../frames/face-mask/face-mask.jpg")
//console.log(img.data)
const bitmap1 = fs.readFileSync("../../frames/face-mask/face-mask1.jpg");
const bitmap2 = fs.readFileSync("../../frames/face-mask/face-mask2.jpg");
const bitmap3 = fs.readFileSync("../../frames/face-mask/face-mask3.jpg");
const bitmap4 = fs.readFileSync("../../frames/face-mask/face-mask4.jpg");
const bitmap5 = fs.readFileSync("../../frames/face-mask/face-mask5.jpg");
const bitmap6 = fs.readFileSync("../../frames/face-mask/face-mask6.jpg");
const bitmap7 = fs.readFileSync("../../frames/face-mask/face-mask7.jpg");
const bitmap8 = fs.readFileSync("../../frames/face-mask/face-mask8.jpg");
const bitmap9 = fs.readFileSync("../../frames/face-mask/face-mask9.jpg");
const bitmap10 = fs.readFileSync("../../frames/face-mask/face-mask10.jpg");
const bitmap11 = fs.readFileSync("../../frames/face-mask/face-mask11.jpg");
const bitmap12 = fs.readFileSync("../../frames/face-mask/face-mask12.jpg");
const bitmap13 = fs.readFileSync("../../frames/face-mask/face-mask13.jpg");
const bitmap14 = fs.readFileSync("../../frames/face-mask/face-mask14.jpg");
const bitmap15 = fs.readFileSync("../../frames/face-mask/face-mask15.jpg");
const bitmap16 = fs.readFileSync("../../frames/face-mask/face-mask16.jpg");
const bitmap17 = fs.readFileSync("../../frames/face-mask/face-mask17.jpg");
const bitmap18 = fs.readFileSync("../../frames/face-mask/face-mask18.jpg");
const bitmap19 = fs.readFileSync("../../frames/face-mask/face-mask19.jpg");
const bitmap20 = fs.readFileSync("../../frames/face-mask/face-mask20.jpg");
const bitmap21 = fs.readFileSync("../../frames/face-mask/face-mask21.jpg");
const bitmap22 = fs.readFileSync("../../frames/face-mask/face-mask22.jpg");
const bitmap23 = fs.readFileSync("../../frames/face-mask/face-mask23.jpg");
const bitmap24 = fs.readFileSync("../../frames/face-mask/face-mask24.jpg");
const bitmap25 = fs.readFileSync("../../frames/face-mask/face-mask25.jpg");

const imgs = [
  { img: bitmap1, name: "bitmask1" },
  { img: bitmap2, name: "bitmask2" },
  { img: bitmap3, name: "bitmask3" },
  { img: bitmap4, name: "bitmask4" },
  { img: bitmap5, name: "bitmask5" },
  { img: "bitmap6", name: "bitmask6" },
  { img: bitmap7, name: "bitmask7" },
  { img: bitmap8, name: "bitmask8" },
  { img: bitmap9, name: "bitmask9" },
  { img: bitmap10, name: "bitmask10" },
  { img: bitmap11, name: "bitmask11" },
  { img: bitmap12, name: "bitmask12" },
  { img: "bitmap13", name: "bitmask13" },
  { img: bitmap14, name: "bitmask14" },
  { img: bitmap15, name: "bitmask15" },
  { img: bitmap16, name: "bitmask16" },
  { img: bitmap17, name: "bitmask17" },
  { img: bitmap18, name: "bitmask18" },
  { img: bitmap19, name: "bitmask19" },
  { img: bitmap20, name: "bitmask20" },
  { img: bitmap21, name: "bitmask21" },
  { img: bitmap22, name: "bitmask22" },
  { img: bitmap23, name: "bitmask23" },
  { img: bitmap24, name: "bitmask24" },
  { img: bitmap25, name: "bitmask25" },
];

count = 1;
// imgs.forEach(img => {
//   const img64 = Buffer.from(img.img).toString("base64");
//   axios
//     .post("http://3.134.27.21:8080/api/face_mask", {
//       image: img64
//     })
//     .then(response => {
//       response.data.forEach(res => {
//         console.log({name:img.name,...res.predictions});
//       });
//     });

// })

//const img64 = Buffer.from(bitmap).toString("base64");
function intervalFunc() {
  console.log("start");
  for (let i = 0; i < 25; i++)
    axios.post("http://3.134.27.21:8080/api/face_mask", {
      image: Buffer.from(imgs[i].img).toString("base64")
    });
  console.log("end",count++);
}

setInterval(intervalFunc, 1000);
