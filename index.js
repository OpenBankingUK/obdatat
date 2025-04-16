import fs from 'fs';
import nJwt from 'njwt';
import qs from 'qs';
import request from 'axios';
import chalk from 'chalk';
import https from 'https';
import boxen from 'boxen';
import path from 'path';

console.log(
  chalk.green.bold(
    boxen('Open Banking Directory Access Token Acquisition Tool', {
      margin: 1,
      padding: 1,
      style: 'double',
    })
  )
);
console.log();

// Load Private Key and config from files
const __dirname = path.resolve();
const config = JSON.parse(fs.readFileSync(`${__dirname}/config/config.json`));
const signingCert = fs.readFileSync(`${__dirname}/${config.signingCert}`);
const signingKey = fs.readFileSync(`${__dirname}/${config.signingKey}`); // ES512
const transportCert = fs.readFileSync(`${__dirname}/${config.transportCert}`);
const transportKey = fs.readFileSync(
  `${__dirname}/${config.transportKey}`
); // ES512
if (!["production", "sandbox"].includes(config.environment)) {
  throw new Error(`Invalid environment ${config.environment}, use either "sandbox" or "production"`);
}
const tokenUrl = config.environment === "production" ?
  "https://matls-sso.openbanking.org.uk/as/token.oauth2" :
  "https://matls-sso.openbankingtest.org.uk/as/token.oauth2";
const tppTestUrl = config.environment === "production" ?
  "https://matls-api.openbanking.org.uk/scim/v2/participants" :
  "https://matls-api.openbankingtest.org.uk/scim/v2/participants/";
const aud = config.environment === "production" ?
  "https://matls-sso.openbanking.org.uk/as/token.oauth2" :
  "https://matls-sso.openbankingtest.org.uk/as/token.oauth2";

// Node doesn't support concatenated CAs in a single PEM
// Read both files into the globalAgents file one at a time.
const trustedCa = [
  `${__dirname}/config/${config.environment}/root.pem`,
  `${__dirname}/config/${config.environment}/issuingca.pem`,
  `${__dirname}/config/${config.environment}/signingca.pem`,
];

const claims = {
  iss: config.softwareStatementId,
  sub: config.softwareStatementId,
  scope: config.clientScopes,
  aud: aud,
};
const created_jwt = nJwt.create(
  claims,
  {
    key: signingKey,
    passphrase:
      config.signingCert_passphrase === null
        ? undefined
        : config.signingCert_passphrase,
  },
  'RS256'
);
created_jwt.setHeader('kid', config.keyId);
const compacted_jwt = created_jwt.compact();

console.log(chalk.bold.blue('Created JWT:'), compacted_jwt);
console.log();

//Blank the CA list and load only the MA ones
var httpsAgent = https.globalAgent;
https.globalAgent.options.ca = [];
for (const ca of trustedCa) {
  https.globalAgent.options.ca.push(fs.readFileSync(ca));
  httpsAgent = new https.Agent({
    cert: transportCert,
    key: transportKey,
    passphrase:
      config.transportCert_passphrase === null
        ? undefined
        : config.transportCert_passphrase,
    ca: https.globalAgent.options.ca,
    rejectUnauthorized: true,
  });
}

// Configure the request to obtain token
const tokenRequestSpec = {
  url: tokenUrl,
  httpsAgent: httpsAgent,
  method: 'POST',
  data: qs.stringify({
    client_assertion_type:
      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    grant_type: 'client_credentials',
    client_id: config.softwareStatementId,
    client_assertion: compacted_jwt,
    scope: config.clientScopes,
  }),
};

console.log(chalk.bold.blue('Requesting Access Token...'));
console.log();

const errorHandler = function (error) {
  console.log(chalk.red.bold(error));
  console.log(chalk.blue.bold('Response body:'));
  console.log(error.response?.data);
  console.log(error.response?.status);
};

// Send request to get the token
request(tokenRequestSpec)
  .then((response) => {
    console.log(chalk.bold.blue('Token acquired:'), response.data.access_token);
    console.log();

    // Configure the request for test endpoint - list of Participants
    const tppRequestSpec = {
      url: tppTestUrl,
      httpsAgent: httpsAgent,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    };

    return request(tppRequestSpec);
  })
  .then((response) => {
    // Test request to get the list of Participants
    response.data.Resources.forEach((participant) => {
      const org = participant['urn:openbanking:organisation:1.0'];
      const auth =
        participant['urn:trustframework:competentauthorityclaims:1.1'];
      const authorisation =
        participant[
        'urn:trustframework:competentauthorityclaims:1.1.Authorisations'
        ];

      console.log('-', org.OrganisationCommonName, '-', auth.Authorisations);
    });
  })
  .catch(errorHandler);
