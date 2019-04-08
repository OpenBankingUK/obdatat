# Access Token Acquisition Tool (MATLS)

For non-MATLS (old) version of this tool check `non-matls` branch.

## Installation
- Clone this repository if you want to make changes
- Create new Software Statement in the OB DFI
- Generate 2 keypairs for the Signing and Transport certs
- Make sure you follow the instructions for generating CSRs 
- Create Transport and Signing certificates using the DFI
- Get the PEMs and rename them and the associated `.key` to match the files in `/config` (CSRs can be discarded)
- Replace `config/*.key` and `config/*.pem` files with newly generated and renamed private keys and PEM files
- Update `config/config.json` with the required data
- Take a copy of the `config` folder for later reuse when switching between directory and sandbox

## Installing brew and npm if required (OSX)
- Install `brew` package manager using `$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- Install node package manager using `$ brew install node`
- Run `npm i` from installation folder

## Usage
- Run `npm start` from installation folder

Copyright 2017 Open Banking Limited. All rights reserved.
The software provided has no warranty, it is provided “as is”. It is your responsibility to validate the behavior of the routines and their accuracy using the source code provided, or to purchase support and warranties from commercial redistributors.
