# Access Token Acquisition Tool (MATLS)

This tool demonstrates how to acquire an access token and use it to perform an API call using Node.js.
For non-MATLS (old) version of this tool check `non-matls` branch.

## Before you start
- Latest version of OpenSSL and latest LTS version of Node.js are installed on your computer

## Setup
1. Clone this repository
1. [Create new Software Statement in the OB DFI](https://openbanking.atlassian.net/wiki/spaces/DZ/pages/3242196993/Open+Banking+Directory+Usage+-+eIDAS+release+Production+-+v2.5#OpenBankingDirectoryUsage-eIDASrelease(Production)-v2.5-6.CreateSoftwareStatements)
1. [Generate 2 keypairs for the Signing and Transport certs and create CSRs](https://openbanking.atlassian.net/wiki/spaces/DZ/pages/3242196993/Open+Banking+Directory+Usage+-+eIDAS+release+Production+-+v2.5#OpenBankingDirectoryUsage-eIDASrelease(Production)-v2.5-7.CreateaCertificateSigningRequest(CSR)forOpenBankingnon-ETSIcertificates)
1. [Generate certificates and download their PEM files](https://openbanking.atlassian.net/wiki/spaces/DZ/pages/3242196993/Open+Banking+Directory+Usage+-+eIDAS+release+Production+-+v2.5#OpenBankingDirectoryUsage-eIDASrelease(Production)-v2.5-9.GenerateandmanageTransportandSigningCertificatesforOpenBankingETSIcertificates(OBWACandOBSeal))
1. Copy both keys and certificates to the `config` folder
1. Update `config/config.json` file with the required data (reference below)
1. Run `npm install` from installation folder

## Usage
- Run `npm start` from installation folder

## Configuration
- softwareStatementId - ID of a software statement you are requesting the token for
- clientScopes - scopes that will be included in the token (can be blank)
- keyId - ID of a signing certificate key you are using
- signingCert_passphrase - if signing cert key is encrypted (password was provided during generation) provide decryption password, otherwise `null`
- transportCert_passphrase - if transport cert key is encrypted (password was provided during generation) provide decryption password, otherwise `null`
- environment - "sandbox" or "production"
- signingCert - path to the signing certificate (relative to project root)
- signingKey - path to the signing key (relative to project root)
- transportCert - path to the transport certificate (relative to project root)
- transportKey - path to the transport key (relative to project root)

Copyright 2017 Open Banking Limited. All rights reserved.
The software provided has no warranty, it is provided “as is”. It is your responsibility to validate the behavior of the routines and their accuracy using the source code provided, or to purchase support and warranties from commercial redistributors.