const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const crypto = require("crypto");
const nonce = require("nonce")();
const querystring = require("querystring");
const request = require("request-promise");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const cookieSession = require("cookie-session");
var session = require("express-session");
const Keygrip = require("keygrip");
const store = require("store");
const { domain } = require("process");
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = "read_products";
const forwardingAddress = "https://93761bf303a9.ngrok.io"; // Replace this with your HTTPS Forwarding address
// https://c20ee7134519.ngrok.io/shopify?shop=smscarttest-shop.myshopify.com
// ngrok http --host-header=rewrite 4200

var AuthObj = require("../classes/authObject");
var shop = "";
var hmac = "";
var code = "";
var state = "";
var authToken = "";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.get("/api/posts", (req, res, next) => {
  const posts = [{ title: "this is a title", content: 123232 }];
  res.status(200).json({ message: "success", posts: posts });
});

// app.listen(process.env.PORT || 3000, () => {
//   console.log("listening on port 3000!");
// });

app.get("/", (req, res) => {
  const shop = req.query.shop;
  if (shop) {
    const state = nonce();
    const redirectUri = forwardingAddress + "/auth/callback";
    const installUrl =
      "https://" +
      shop +
      "/admin/oauth/authorize?client_id=" +
      apiKey +
      "&scope=" +
      scopes +
      "&state=" +
      state +
      "&redirect_uri=" +
      redirectUri;

    res.cookie("state", state);

    console.log("redirecting", installUrl);
    res.redirect(installUrl);
  } else {
    return res
      .status(400)
      .send(
        "You do not have authorization to visit this page. Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request"
      );
  }
});

app.get("/auth/callback", (req, res) => {
  const { shop, hmac, code, state } = req.query;

  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) {
    return res.status(403).send("Request origin cannot be verified");
  }

  if (shop && hmac && code) {
    // DONE: Validate request is from Shopify
    console.log("setting shop property", shop);
    this.shop = shop;
    this.hmac = hmac;
    this.code = code;
    const map = Object.assign({}, req.query);
    delete map["signature"];
    delete map["hmac"];
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, "utf-8");
    const generatedHash = Buffer.from(
      crypto.createHmac("sha256", apiSecret).update(message).digest("hex"),
      "utf-8"
    );
    let hashEquals = false;

    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    } catch (e) {
      hashEquals = false;
    }

    if (!hashEquals) {
      return res.status(400).send("HMAC validation failed");
    }

    //res.status(200).send("HMAC validated");
    // TODO
    // Exchange temporary code for a permanent access token
    // Use access token to make API call to 'shop' endpoint
    const accessTokenRequestUrl =
      "https://" + shop + "/admin/oauth/access_token";
    const accessTokenPayload = {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    };

    request
      .post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then((accessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;
        console.log(
          "Got an access token, let's do something with it",
          accessToken
        );
        if (accessToken !== undefined) {
          res.cookie("accessToken", accessToken, {
            maxAge: 900000,
            domain: "e2c9e32aca00.ngrok.io",
            httpOnly: false,
          });
          this.authToken = accessToken;
          console.log("cookie created successfully!");
        }

        res.status(200).json({
          message: "success. access token granted!",
          posts: accessTokenResponse,
        });
      })
      .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
      });
  } else {
    res.status(400).send("Required parameters missing");
  }
});

app.get("/api/auth", (req, res, next) => {
  res.status(200).json({
    message: "success",
    authObj: new AuthObj(
      this.shop,
      this.hmac,
      this.code,
      this.state,
      this.authToken
    ),
  });
});

module.exports = app;
