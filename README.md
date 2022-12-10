# Mint your PFP as an NFT

This is a simple app to update a Twitter text record in your ENS (Ethereum Name Service). It will also notify [Twittens.xyz](https://www.twittens.xyz) to udpate your address if you are in any of the supported NFT collections.

It interacts directly with the ENS Public Resolver contract of the `setText` function: [see the contract on etherscan.io](https://etherscan.io/address/0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41)


This is a modified project of forked repository of my fren @gregskril. He created a project to easily update your ENS avatar, which is super-cool: [mintyourpfp.xyz](https://mintyourpfp.xyz/)!

## Getting Started

- Run `cp .env.example .env.local` and enter your Infura key
- Run `yarn` to install dependencies
- Run `yarn dev` to start the development server
