// File: migrations/3_deploy_nft_metadata.js
const MasterAccessControl = artifacts.require("MasterAccessControl");
const NFTAccessControl = artifacts.require("NFTAccessControl");
const NFTMetadata = artifacts.require("NFTMetadata");
const fs = require('fs');
const path = require('path');



// Helper functions (add these to each file)
function getAddressesPath(network) {
    return path.resolve(__dirname, '..', 'build', 'contractAddresses', `${network}_addresses.json`);
  }
  
  function saveAddresses(network, addresses) {
    const buildPath = path.resolve(__dirname, '..', 'build', 'contractAddresses');
    if (!fs.existsSync(buildPath)) {
      fs.mkdirSync(buildPath, { recursive: true });
    }
    fs.writeFileSync(getAddressesPath(network), JSON.stringify(addresses, null, 2));
    console.log(`Addresses saved to ${network}_addresses.json`);
  }





  module.exports = async function(deployer, network) {
    const deployedAddresses = JSON.parse(fs.readFileSync(getAddressesPath(network), 'utf8'));
  
    // Deploy NFTMetadata
    const masterAccessControlAddress = deployedAddresses.MasterAccessControl;
    const nftAccessControlAddress = deployedAddresses.NFTAccessControl;
    await deployer.deploy(NFTMetadata, masterAccessControlAddress, nftAccessControlAddress);
    const nftMetadata = await NFTMetadata.deployed();
    console.log("NFTMetadata deployed at:", nftMetadata.address);
    deployedAddresses.NFTMetadata = nftMetadata.address;
  
    // Grant access to NFTMetadata in MasterAccessControl
    const masterAccessControl = await MasterAccessControl.at(masterAccessControlAddress);
    await masterAccessControl.grantAccess(nftMetadata.address, nftMetadata.address);
    console.log("Granted access to NFTMetadata in MasterAccessControl");
  
    // Grant access to NFTMetadata in NFTAccessControl
    const nftAccessControl = await NFTAccessControl.at(nftAccessControlAddress);
    await nftAccessControl.grantAccess(0, 0, nftMetadata.address, 6); // Granting AbsoluteOwnership
    console.log("Granted access to NFTMetadata in NFTAccessControl");
  
    // Save updated addresses to file
    saveAddresses(network, deployedAddresses);
  };