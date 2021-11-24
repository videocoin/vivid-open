# Videcoin NFT Marketplace installation with Polygon-Matic

This document gives instructions for using VideoCoin NFT Marketplace with Polygon_Matic blockchain

Topics covered in this document:

* HW Configuration used for testing
* Install Docker Engine and Docker Compose
* Matic Accounts and Blockchain Access
  * QuickNode For Blockchain Access
  * Configure Metamask
  * Setup Contract Owner, Operator and Test accounts
* Installation of Contracts on Polygon-Matic
  * Setup eth-Brownie: contract deployment tool
  * Install VideoCoin NFT Contract on Polygon-Matic
  * Install Wyvern Exchange Contracts on Polygon-Matic
* Prepare Configuration Files for Marketplace/UI
* Run the Marketplace
.

## HW Configuration used for testing
The installation is tested on a GCP Instance, N2-Standard 16vCPU and 64GB, 100GB SSD Persistent Disc. Enable security setting "Allow HTTP Traffic".  
OS: Ubuntu 20.04

## Install Docker Engine and Docker Compose
Refer https://docs.docker.com/engine/install/ for instructions on installing Docker Engine.

```
sudo apt-get update

sudo apt-get install apt-transport-https  ca-certificates  curl gnupg  lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo groupadd docker

sudo usermod -aG docker $USER

newgrp docker

docker run hello-world
```


Refer https://docs.docker.com/compose/install/ for instruction on installing docker-compose.

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version
```

## Matic Accounts and Blockchain Access
### QuickNode For Blockchain Access
You need an RPC endpoint to access Polygon_matic blockchain. There are several free and public rpc endpoints available. For better response times you may setup a paid setup endpoint such as from QuickNode https://www.quicknode.com/

We used a QuickNode endpoint for testing the NFT Marketplace.
Configure Metamask
You can use the metamask wallet directly to  transfer  funds  between Matic accounts. You  can also use Polygon Wallet/Bridge on top of Metamask to transfer funds natively or using bridge.

Refer the following link configuring Polygon for Metamask

https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/

### Stup Contract Owner, Operator and Test accounts
Obtain a prefunded account with Matic: Matic is required to install contracts and mint NFT on Polygon-Matic blockchain. 
There are several methods to obtain the Matic :
Obtain the matic using Crypto exchanges. 
Move or convert funds from other networks such as Ethereum. https://wallet.polygon.technology/


Create the following accounts and fund with Matic:

- Create an owner account that can be used for installing contracts.
- Create an Operator account that can be used by the Marketplace backend to transfer NFTs between accounts and pay the transaction fees.
- Create two test accounts that can be used to test your newly installed Marketplace.

## Installation of Contracts on Polygon-Matic
Setup eth-Brownie: contract deployment tool

Refer https://eth-brownie.readthedocs.io/en/stable/install.html for installation instructions.

### Install eth_brownie
```
python3 -m pip install --user pipx
python3 -m pipx ensurepath
pipx install eth-brownie
```


Prepare a configuration file for matic
matic-config.yaml
```
live:
- name: Polygon
  networks:
    - name: Mainnet
      chainid: 137
      id: polygon-main
      host: <blockchain-rpc-endpoint>
      explorer: https://api.polygonscan.com/api
```

Import Matic network into Brownie
```
brownie networks import matic-config.yaml
```


Install VideoCoin NFT Contract on Polygon-Matic

Create a brownie-config.yaml to set the dependencies and solidity version.

videocoin-nft-installer/videocoin-nft/brownie-config.yaml
```
dependencies:
  - OpenZeppelin/openzeppelin-contracts@3.4.0

compiler:
  minify_source: false
  solc:
    version: 0.7.6
    optimizer:
            enabled: true
            runs: 1
    remappings:
            - "@openzeppelin/contracts=OpenZeppelin/openzeppelin-contracts@3.4.0/contracts"
```


Compile and installNFT contracts
```
brownie console --network polygon-main

accounts.load("owner-account-key-file-path")
#Enter password for owner-account:

accounts.load("operator-account-keyfile-path")
#Enter password foroperator-account:

nft=NFT721.deploy("VNFT", "VNFT", owner-account,  {'from': owner-account, 'gas_price': '50 gwei'})


nft.addOperator(operator-account, {'from':owner-account, 'gas_price': '50 gwei'})
```



Install Wyvern Exchange Contracts on Polygon-Matic

Create a brownie-config.yaml to set the dependencies and solidity version.

videocoin-nft-installer/wyvern-ethereum/brownie-config.yaml
```
dependencies:
  - OpenZeppelin/openzeppelin-contracts@1.10.0

compiler:
  minify_source: false
  solc:
    version: 0.4.23
    optimizer:
            enabled: true
            runs: 1
    remappings:
            - "openzeppelin-solidity/contracts=OpenZeppelin/openzeppelin-contracts@1.10.0/contracts"
```


Compile and install Wyvern Exchange contracts
```
brownie console --network polygon-main

accounts.load("key file")
# Supply password for the account

WyvernAtomicizer.deploy({'from': accounts[0], 'gas_price': '50 gwei'})
# outputs WyvernAtomicizerAddress

WyvernProxyRegistry.deploy({'from': accounts[0], 'gas_price': '50 gwei'})
# outputs ProxyRegistryAddress

WyvernTokenTransferProxy.deploy(ProxyRegistryAddress, {''from': accounts[0], 'gas_price': '50 gwei'})
# outputs TokenTransferProxyAddress

WyvernExchange.deploy(ProxyRegistryAddress, TokenTransferProxyAddress, <DAO Address>', <protocol fee address>,  {''from': accounts[0], 'gas_price': '50 gwei'})
```

Prepare Configuration Files for Marketplace/UI

marketplace_env.list
```
### Filecoin Storage
NFTSTORAGE_API_KEY=<API-KEY>
STORAGE_BACKEND=nftstorage

### videonft oracle parameters
ERC721_CONTRACT_ADDRESS=0x123456b74afcF96D54df3E584802e1cfa88350c8
ERC721_AUCTION_CONTRACT_ADDRESS=0x549BCD277d0aF1758dC21dAcAD59385570Ded1B0
ERC721_CONTRACT_KEY=<key-file>
ERC721_CONTRACT_KEY_PASS=<password>

### blockchain
BLOCKCHAIN_SCAN_FROM=21290483
BLOCKCHAIN_URL=<Polygon-Matic RPC Endpoint>

DBURI="host=postgres port=5432 dbname=marketplace sslmode=disable"
```


nft-app_env.list
```
# marketplace api endpoint
REACT_APP_BASE_URL='http://35.199.175.19:8088/api/v1'
#Allowed network for nft-app

# Video NFT token contract address
REACT_APP_TOKEN_ADDRESS=0x123456b74afcf96d54df3e584802e1cfa88350c8

REACT_APP_NETWORKS=137
REACT_APP_CUSTOM_PROVIDER_URL=<Polygon-Matic RPC Endpoint>

REACT_APP_API_BASE_CUSTOM='http://35.199.175.19:8088'
REACT_APP_SITE_HOST_CUSTOM=

# Wyvern contract addresses
REACT_APP_WYVERN_EXCHANGE=0x549BCD277d0aF1758dC21dAcAD59385570Ded1B0
REACT_APP_WYVERN_PROXY_REGISTRY=0xB476deEe59ADb4fD319e05DBFA6bEe75938053B7
REACT_APP_WYVERN_ATOMICIZER=0xE69A2bB28ECe415AF8ed519fD125A5028bfd0f14
REACT_APP_WYVERN_TOKEN_TRANSFER_PROXY=0x4aA6A818172D72837461E60e3A9CF062d8e2806e

REACT_APP_WYVERN_DAO=0x6bfb2292c5a25661b31dec0e141817ecea9cbb1f
REACT_APP_WYVERN_TOKEN=0x28b9790b9dc31bfbd35856021a4a001d150229cd
REACT_APP_CUSTOM_FEE_RECIPIENT=0x3393faCcA448B53B509306c53D2Ee1980725A0A0
```


## Run the Marketplace
Run the docker-compose script to launch the marketplace and marketplace-UI hosting. 
```
cd videocoin-nft-installer
docker-compose up marketplace nft-app
```


Run the marketplace UI from a browser (with Metamask extension installed).

Example URL:
http://35.199.175.19:8080
