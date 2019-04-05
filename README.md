# Access Token Acquisition Tool (MATLS)

For non-MATLS (old) version of this tool check `non-matls` branch.

## Installation
- Clone this repository if you want to make changes
- Create new Software Statement in the OB DFI
- Generate 2 keypairs for the Signing and Transport certs
- Make sure you follow the instructions for generating CSRs 
- Update `config/*.key` and `config/*.pem` files with private keys generated with CSR and PEM files downloaded from DFI
- Update `config/config.json` with the required data
- Run `npm i` from installation folder

## Usage
- Install Node package dependencies running `npm i` via the command line
- Run `npm start` from installation folder

Copyright 2017 Open Banking Limited. All rights reserved.
The software provided has no warranty, it is provided “as is”. It is your responsibility to validate the behavior of the routines and their accuracy using the source code provided, or to purchase support and warranties from commercial redistributors.
