const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const axios = require("axios");
const qs = require("query-string");
const dotenv = require("dotenv").config();
const infoHadler = require("./routes/infoRoute");

app.use(cors());
app.use(express.json());

const url = process.env.DB_URL;

//mongoose connetion
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connecting Successfully"))
  .catch(() => console.log("DB Connection Failed"));

//application route
app.use("/information", infoHadler);

// Constand
const urlToGetLinkedInAccessToken =
  "https://www.linkedin.com/oauth/v2/accessToken";
const urlToGetUserProfile =
  "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))";
const urlToGetUserEmail =
  "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))";

app.get("/getUserCredentials", async function (req, res) {
  try {
    const user = {};
    const code = req.query.code;
    const accessToken = await getAccessToken(code);
    console.log(accessToken);
    const token = process.env.TOKEN;
    const userProfile = getUserProfile(token);
    const userEmail = getUserEmail(token);
    let resStatus = 400;
    if (!(accessToken === null || userProfile === null || userEmail === null)) {
      user = userBuilder(userProfile, userEmail);
      resStatus = 200;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
});

async function getAccessToken(code) {
 
  let accessToken = null;
  const config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  const parameters = {
    grant_type: "authorization_code",
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECERT,
    code: code,
  };
  const result = await axios.post(
    urlToGetLinkedInAccessToken,
    qs.stringify(parameters),
    config
  );

  return result.data["access_token"];
}

function getUserProfile(accessToken) {
  let userProfile = null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  axios
    .get(urlToGetUserProfile, config)
    .then((response) => {
      userProfile.firstName = response.data["localizedFirstName"];
      userProfile.lastName = response.data["localizedLastName"];
      userProfile.profileImageURL =
        response.data.profilePicture[
          "displayImage~"
        ].elements[0].identifiers[0].identifier;
    })
    .catch((error) => console.log("Error grabbing user profile"));
  return userProfile;
}

function getUserEmail(accessToken) {
  const email = null;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  axios
    .get(urlToGetUserEmail, config)
    .then((response) => {
      email = response.data.elements[0]["handle~"];
    })
    .catch((error) => console.log("Error getting user email"));

  return email;
}

function userBuilder(userProfile, userEmail) {
  return {
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    profileImageURL: userProfile.profileImageURL,
    email: userEmail,
  };
}

app.listen(3001, function () {
  console.log(`Node server running...`);
});
