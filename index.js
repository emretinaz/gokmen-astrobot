// const tw = require("./twitter");

const got = require("got");
const geolib = require("geolib");
const { getCode, getName } = require("country-list");
const nearbyCities = require("nearby-cities");
const nodemailer = require("nodemailer");
const ISSLOCATIONAPI = "http://api.open-notify.org/iss-now.json";
const range = 100;
let mailLocker = 0;
let istanbulMailLocker = 0;
let kocagurMailLocker = 0;
let newyorkMailLocker = 0;
let graftonMailLocker = 0;
let testLocationMailLocker = 0;
const friendList = [
  {
    name: "Istanbul",
    coords: { latitude: 41.109447, longitude: 28.874729 }
  },
  {
    name: "Grafton",
    coords: { latitude: -36.860794, longitude: 174.767913 }
  },
  {
    name: "Kocagur",
    coords: { latitude: 40.355653, longitude: 27.18474 }
  },
  {
    name: "New York",
    coords: { latitude: 40.742337, longitude: -74.00599 }
  },
  {
    name: "TestLocation",
    coords: { latitude: -0.6201, longitude: -125.2706 }
  }
];

// async..await is not allowed in global scope, must use a wrapper
async function main(city) {
  let place = city;
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "",
      pass: ""
    }
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: "gokmenastrobot@gmail.com",
    to: "emretinaz@gmail.com",
    subject: "ISS Gokmen Astrobot @" + place,
    text: "Does it work?",
    html: `Hello ${place}` // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main("biga").catch(console.error);

function loop() {
  got(ISSLOCATIONAPI, { json: true })
    .then(iss => {
      const position = iss.body.iss_position;
      const isClose = function(friend, d) {
        console.log("🛰  is CLOSE to " + friend + " by " + d + " kms");

        // Istanbul
        if (friend === "Istanbul") istanbulMailLocker++;
        if (istanbulMailLocker === 1) console.log("You can send " + " 📧 " + " to " + " 🕌") && istanbulMailLocker++;
        // console.log("isClose istanbulMailLocker: ", istanbulMailLocker);

        // Grafton
        if (friend === "Grafton") graftonMailLocker++;
        if (graftonMailLocker === 1) console.log("You can send " + " 📧 " + " to " + " 🥝") && graftonMailLocker++;
        // console.log("isClose graftonMailLocker: ", graftonMailLocker);

        // New York
        if (friend === "New York") newyorkMailLocker++;
        if (newyorkMailLocker === 1) console.log("You can send " + " 📧 " + " to " + " 🗽 ") && newyorkMailLocker++;
        // console.log("isClose newyorkMailLocker: ", newyorkMailLocker);

        // Kocagur
        if (friend === "Kocagur") kocagurMailLocker++;
        if (kocagurMailLocker === 1) console.log("You can send " + " 📧 " + " to " + " 🏠 ") && kocagurMailLocker++;
        // console.log("isClose kocagurMailLocker: ", kocagurMailLocker);

        // testLocation
        if (friend === "TestLocation") testLocationMailLocker++;
        if (testLocationMailLocker === 1) main("TestLocation").catch(console.error) && console.log("You can send " + " 📧 " + " to " + friend) && testLocationMailLocker++;
        console.log(testLocationMailLocker++);
      };
      const isFar = function(friend, d) {
        // Istanbul
        if (friend === "Istanbul") istanbulMailLocker = 0;
        // console.log("isFar istanbulMailLocker: ", istanbulMailLocker);

        // Grafton
        if (friend === "Grafton") graftonMailLocker = 0;
        // console.log("isFar graftonMailLocker: ", graftonMailLocker);

        // New York
        if (friend === "New York") newyorkMailLocker = 0;
        // console.log("isFar newyorkMailLocker: ", newyorkMailLocker);

        // Kocagur
        if (friend === "Kocagur") kocagurMailLocker = 0;
        // console.log("isFar kocagurMailLocker: ", kocagurMailLocker);

        //testLocation;
        if (friend === "TestLocation") testLocationMailLocker = 0;

        console.log("🛰  is FAR to " + friend + " by " + d + " kms");
      };
      friendList.forEach(friend => {
        const d = Math.floor(geolib.getDistance(friend.coords, position) / 1000);
        return d < range ? isClose(friend.name, d) : isFar(friend.name, d);
      });
    })
    .catch(error => {
      console.log(error);
    });
  console.log("-----------------------------------------");
  setTimeout(loop, 5000);
}
loop();
