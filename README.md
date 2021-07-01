# Video NFT Installer
docker-compose based installer to setup video-nft contracts, wyvern-exchange contracts on a selected blockchain. It will help setup video nft marketplace and marketplace-ui hosting and integration with Filecoin storage exposed through nft.storage or textilehub.  
## Quick start


checkout the repo, get the submodules and run the docker-compose.
```
git submodule update --init --recursive
```

### prerequisites

Update the docker-compose to lattest vetsion(v1.29.1)  
https://docs.docker.com/compose/install/

*Note: Make sure you follow docker engine install and post install steps to set the user permissions to run docker containers without sudo mode
### Filecoin storage setup
Get your nft.storage or textilehub credentials and update marketplace_env.list  

https://nft.storage/
```
NFTSTORAGE_API_KEY=
STORAGE_BACKEND=nftstorage
```
Alternately, if you are using textilehub follow the link and obtain the credentials.

https://docs.textile.io/hub/apis/


```
MARKETPLACE_TEXTILE_AUTH_KEY=""
MARKETPLACE_TEXTILE_AUTH_SECRET=""
MARKETPLACE_TEXTILE_THREAD_ID=""
MARKETPLACE_TEXTILE_BUCKET_ROOT_KEY=""
STORAGE_BACKEND=textile
```

### Install the contracts on blockchain

You can start a local testnet or install on Mainnet or testnets


### If you are planning on using  ganache testnet, run the following command

Configure the wallet key for prefunding. Set the wallt mnemonic in .env file
```
# test wallet
MNEMONIC="ship arena salad typical truly found start bind insane six wheel vendor"
```
```
docker-compose up -d ganache
```
**Note the ganache testnet satrted as above runs in background.**

### Deploy Video NFT Token Contract
Set the contract owner and jsin-rpc path to Blockchain by 
modifying  nft-contracts_env.list and set the environment variables:
```
# Local testing ganache at 173.26.0.100
#CUSTOM_RPC="http://173.26.0.100:8545"

#Rinkbey testing
CUSTOM_RPC="https://rinkeby.infura.io/v3/<INFURA PROJECT ID>"

# Contract owner wallet mnemonic or Private key
MNENONIC="0x9312d1929dedd6005d9bfd4b6d51446fa0732958cef08c7592493cd855a2566f"
NFT721_NAME=MyTestNFT
NFT721_SYMBOL=MTNFT
ERC1155_TOKEN_URI_TEMPLATE="http://localhost:3000/tokens/nft1155/{id}.json"

```
Deploy the Video NFT Token contract
```
docker-compose up nft-contracts-deploy
```

### Deploy Wyvern exchange
Set the contract owner and jsin-rpc path to Blockchain by 
modifying  wyvern-contracts_env.list and set the environment variables:

```
# Local testing ganache at 173.26.0.100
#CUSTOM_RPC="http://173.26.0.100:8545"

# Rinkeby testnet
CUSTOM_RPC="https://rinkeby.infura.io/v3/<INFURA PROJECT ID>"

# Contract owner wallet mnemonic or Private key
CUSTPOM_PRIM_KEY="0x9312d1929dedd6005d9bfd4b6d51446fa0732958cef08c7592493cd855a2566f"
```
Deploy the Wyvern exchange contract
```
docker-compose up wyvern-contracts-deploy
```

**Note: If you use the test wallet mnemonic/private key specified in this doc, the generated contract addresses are deterministic, if the contracts are deployed in the order specified in the document due to deterministic nonce update. This will useful for quick testing**

## Run the nft-app and marketplace services

Configure the marketplace and nft-app with the token contract, wyvern exchange contract addresses generated in the previous steps. Take the contract addresses output under custom network option.
### Marketplace env variables
```
# select ipfs/filoecoin storate infra
STORAGE_BACKEND=nftstorage
#STORAGE_BACKEND=textile

# nft.storage credentials
NFTSTORAGE_API_KEY=

# textilehub credentials
TEXTILE_AUTH_KEY=
TEXTILE_AUTH_SECRET=
TEXTILE_THREAD_ID=
TEXTILE_BUCKET_ROOT_KEY=


# videonft oracle parameters
ERC721_CONTRACT_ADDRESS=0xa7b3d9092b87fd73f98d0b9ea1be9332deafada8
ERC721_AUCTION_CONTRACT_ADDRESS=0xda563d7c33d08ec19b094fb253c4cc31cc8bc0e5

# Contract owner wallet key file
ERC721_CONTRACT_KEY='{"address":"3393facca448b53b509306c53d2ee1980725a0a0","crypto":{"cipher":"aes-128-ctr","ciphertext":"9e1059dae28e760dbdeb11c1ae80d3a08d4a37615661728faab7f9ec161b898d","cipherparams":{"iv":"2d03e1f35c1119373bf752ed0bba7101"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"d40a13f97124764eafdd460b09bd4d9e66de3abf59c0f41144943ac194446025"},"mac":"d9bcdd1596506ce2e6b4f7d0cec2f8d5c18d027d7850b445682c08631cd60980"},"id":"e829aa11-5ddd-4772-9c45-bb4bbf86aa04","version":3}'
ERC721_CONTRACT_KEY_PASS=testkey

# Local testnet
BLOCKCHAIN_URL=http://ganache:8545
BLOCKCHAIN_SCAN_FROM=0

# Rinkeby testnet
#BLOCKCHAIN_SCAN_FROM=8856470
#BLOCKCHAIN_URL="https://rinkeby.infura.io/v3/<INFURA PROJECT ID>"

```
nft-app env variables
```
# Contract owner wallet(test key)
MNEMONIC="ship arena salad typical truly found start bind insane six wheel vendor"

# env for nft-app
# marketplace api endpoint
REACT_APP_BASE_URL='http://localhost:8088/api/v1'
#Allowed network for nft-app

# Video NFT token contract address
REACT_APP_TOKEN_ADDRESS=0xA7b3d9092b87Fd73F98d0B9EA1bE9332deAFAda8

# Local testnet
REACT_APP_NETWORKS=1337
REACT_APP_CUSTOM_PROVIDER_URL=http://localhost:8545

# Rinkeby
#REACT_APP_NETWORKS=4
#REACT_APP_CUSTOM_PROVIDER_URL="https://rinkeby.infura.io/v3/XXXXXXXXXXXXXXXXXXXXX"

REACT_APP_API_BASE_CUSTOM='http://localhost:8088'
REACT_APP_SITE_HOST_CUSTOM=

# Wyvern contract addresses
REACT_APP_WYVERN_EXCHANGE=0xda563d7c33d08ec19b094fb253c4cc31cc8bc0e5
REACT_APP_WYVERN_PROXY_REGISTRY=0xC3d023E14416a1167AF0D774ecAEC06eCB1D3494
REACT_APP_WYVERN_ATOMICIZER=0x1D095A09917dB45837B681721B1aDB082F0eA882
REACT_APP_WYVERN_TOKEN_TRANSFER_PROXY=0xa8D2960b266b5Dfd5F17786049e524e3E48Ed4b0

REACT_APP_WYVERN_DAO=0x04f9b61Feea12E6F60ddCcB8a4ca260F770B4154
REACT_APP_WYVERN_TOKEN=0x26FbFA40B26aEdfE2548746634f386204D7682e3
REACT_APP_CUSTOM_FEE_RECIPIENT=0x3393faCcA448B53B509306c53D2Ee1980725A0A0
```

Run the postgres, marketplace and nft-app hosting service
```
docker-compose up -d postgres
docker-compose up marketplace nft-app
```
## Open the browser and launch the aft-app.
```
http://localhost:8080/
```

Following is the test wallet used for deploying contracts. Use it Metamask with "Localhost 8545" Netowork or testnetwork json-rpc path to access or test the contracts
```
Test Wallet Private Key: 0x9312d1929dedd6005d9bfd4b6d51446fa0732958cef08c7592493cd855a2566f
Account: 0x3393faCcA448B53B509306c53D2Ee1980725A0A0
```

Open Lightweight Block Explorer
```
http://localhost:8090/
```

Bringdown the Video NFT Devnet
```
docker-compose down -v
```
**Note: If you are going to run the video-nft-devnetwork again after shutting down, flush your browser cache to remove the stale authentication tokens of of nft-app from the previous session.**

### Check integrity and DRM

* Retrieve the drm data from the token URI
* Use the [Ownership Proof Tool](ownership-proof-tool) decrypt the drm data. You need to supply the private key corresponding to the public key used for creating DRM data.
* This step outputs the content encryption key.
* Use the content encryption key to decode the encrypted video asset using ffmpeg.

Decrypt the content using the encryption key obtained in the previous step.
```
ffmpeg  -decryption_key <decryption key> -i encrypted_firstfilm.mp4 -c:v copy -c:a copy test_dec.mp4
```

## VideoNFT Marketplace Components
Docker-compose based devnet that includes the following services:
* NFT-APP(Video NFT Frontend)
* Marketplace(API Backend)
* Postgres(Database for userinfo)
* Blockchain (Local testnet, remote testnet, Mainnet)
* Explorer(Lightweight Block Explorer)
* Token Contracts(Contract deployer)
* Wyvern Exchange Contracts

![Video NFT Devenet](./docs/devnet.drawio.svg)



The above components are configurable. The Video NFT GUI installer obtains the configuration parameters and configures the components. The configuration options of each component are listed below for reference.

## nft-app
VideoCoin NFT Frontend
Source repo: [https://github.com/videocoin/nft-app-ext](https://github.com/videocoin/nft-app-ext)
## Marketplace
This service provides the backend API for the VideoCoin NFT.
Source repo: [https://github.com/videocoin/marketplace](https://github.com/videocoin/marketplace)
## Blockchain
Test network, VideoCoin network or Ethereum Mainnet
## Token Contracts
Video NFT Token Contracts
Source repo: [https://github.com/videocoin/videocoin-nft](https://github.com/videocoin/videocoin-nft)
## Wyvern Exchange Contracts
Wyvern exchange

Source repo: [https://github.com/videocoin/wyvern-ethereum](https://github.com/videocoin/wyvern-ethereum)
## Explorer
An open source Lightweight Block Explorer
It can show the status of blockchain and can be replaced with any Ethereum blockchain. It is useful if a local test chain such as Ganache is used.

https://github.com/Alethio/ethereum-lite-explorer

