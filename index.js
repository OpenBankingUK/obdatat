const
  fs = require('fs'),
  nJwt = require('njwt'),
  qs = require('qs'),
  request = require('axios'),
  chalk = require('chalk')
  boxen = require('boxen');

console.log(chalk.bold.green(boxen("Open Banking Directory Access Token Acquisition Tool", {
  margin: 1,
  padding: 1,
  style: 'double'
})));
console.log();

// Load Private Key and config from files
const signingKey = fs.readFileSync(`${__dirname}/config/privatekey.pem`); // ES512
const config = JSON.parse(fs.readFileSync(`${__dirname}/config/config.json`));

const claims = {
  iss: config.softwareStatementId,
  sub: config.softwareStatementId,
  scope: config.clientScopes,
  aud: config.tokenUrl
}

const created_jwt = nJwt.create(claims, signingKey, 'RS256');
created_jwt.setHeader('kid', config.keyId);

console.log(chalk.bold.blue("Created JWT:"), created_jwt.compact());
console.log();

// Configure the request to obtain token
const tokenRequestSpec = {
  url: config.tokenUrl,
  method: 'POST',
  data: qs.stringify({
    'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    'grant_type': 'client_credentials',
    'client_id': config.softwareStatementId,
    'client_assertion': created_jwt.compact(),
    'scope': config.clientScopes
  })
}

// Send request to get the token
request(tokenRequestSpec)
  .then((response) => {
    console.log(chalk.bold.blue("Token acquired:"), response.data.access_token);
    console.log();

    // Configure the request for test endpoint - list of TPPs
    const tppRequestSpec = {
      url: config.tppTestUrl,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${response.data.access_token}`
      }
    }

    return request(tppRequestSpec);

  })
  .then((response) => {
    console.log(chalk.bold.blue("TPPs"));

    // Test request to get the list of TPPs
    response.data.Resources.forEach((tpp) => {
      const org = tpp['urn:openbanking:organisation:1.0'];
      console.log("-", org.OrganisationCommonName);
    });

  })
  .catch((err) => {
    // Display errors
    console.log(chalk.bold.red('Error:'), err.response.data);
  })
