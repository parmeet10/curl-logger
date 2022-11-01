const fs = require("fs");
const os = require("os");

let createFileParams = {};

class Curl {
  constructor(params) {
    if (typeof params == "object") {
      Object.assign(createFileParams, params);
    }
  }

  logCurl(req, res, next) {
    let curlParams = {};
    curlParams.url =
      req.protocol +
      "://" +
      (req.headers.host || req.hostname) +
      req.originalUrl;
    curlParams.method = req.method.toUpperCase();
    req.headers ? (curlParams.headers = req.headers) : null;
    req.body ? (curlParams.body = req.body) : null;

    console.log(new Curl().#createCurl(curlParams));

    next();
  }

  #createCurl(params) {
    try {
      if (!params.url) {
        throw new Error("Input missing: URL");
      }

      if (!params.method) {
        throw new Error("Input missing: HTTP METHOD");
      }

      if (Object.keys(createFileParams).length > 1) {
        throw new Error("AUTHORISATION FAIL: NO MORE THAN ONE OPTION ALLOWED");
      }

      if (Object.keys(createFileParams).length > 0) {
        try {
          if (
            typeof createFileParams["createFile"] !== "boolean" ||
            !createFileParams.hasOwnProperty("createFile")
          ) {
            throw new Error("INVALID OPTION");
          }
        } catch (err) {
          throw err;
        }
      }

      let _headers = "";
      let _body = "";

      if (params.headers) {
        if (params.headers["content-length"]) {
          delete params.headers["content-length"];
        }

        for (let key in params.headers) {
          _headers += `-H '${key}:${params.headers[key]}' `;
        }

        if (params.body) {
          if (
            params.headers &&
            params.headers["content-type"] &&
            params.headers["content-type"] === "application/json"
          ) {
            _body += `-d '${JSON.stringify(params.body)}' `;
          } else {
            for (let key in params.body) {
              _body += `-d '${key}=${params.body[key]}' `;
            }
          }
        }

        _headers.length
          ? (_headers = _headers.substring(0, _headers.length - 1))
          : null;
        _body.length ? (_body = _body.substring(0, _body.length - 1)) : null;

        let curl = `curl ${_headers} -X ${params.method.toUpperCase()} '${
          params.url
        }' ${_body}`;

        if (createFileParams.createFile == true) {
          if (fs.existsSync("./curlLog.txt")) {
            fs.appendFileSync("./curlLog.txt", `${curl}${os.EOL}`);
          } else {
            fs.writeFileSync("./curlLog.txt", `${curl}${os.EOL}`);
          }
        }

        return curl;
      }
    } catch (e) {
      return { curl: null, message: e };
    }
  }
}
module.exports = Curl;