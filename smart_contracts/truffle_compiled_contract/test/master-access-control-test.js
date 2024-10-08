// File: test/MasterAccessControl.test.js
const truffleAssert = require('truffle-assertions');

const MasterAccessControl = artifacts.require("MasterAccessControl");

const NFTAccessControl = artifacts.require("NFTAccessControl");
const NFTMetadata = artifacts.require("NFTMetadata");
const NFTContract = artifacts.require("NFTContract");

contract("MasterAccessControl", accounts => {
  let masterAccessControl;
  let nftAccessControl;
  let nftMetadata;
  let nftContract;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  beforeEach(async () => {
    masterAccessControl = await MasterAccessControl.new({ from: owner });

    nftAccessControl  = await NFTAccessControl.new(masterAccessControl.address, { from: owner });
    nftMetadata       = await NFTMetadata.new(masterAccessControl.address, nftAccessControl.address, { from: owner });
    nftContract       = await NFTContract.new(masterAccessControl.address, nftAccessControl.address, nftMetadata.address, { from: owner });


    await masterAccessControl.grantAccess(masterAccessControl.address, owner, { from: owner });
    await masterAccessControl.grantAccess(nftAccessControl.address, nftContract.address, { from: owner });
    await masterAccessControl.grantAccess(nftMetadata.address, nftContract.address, { from: owner });

  });

  it("should grant access to the deployer", async () => {
    const hasAccess = await masterAccessControl.hasAccess(masterAccessControl.address, owner);
    assert.isTrue(hasAccess, "Deployer should have access");
  });

  it("should allow granting and revoking access", async () => {
    await masterAccessControl.grantAccess(masterAccessControl.address, user1, { from: owner });
    let hasAccess = await masterAccessControl.hasAccess(masterAccessControl.address, user1);
    assert.isTrue(hasAccess, "User1 should have access after granting");

    await masterAccessControl.revokeAccess(masterAccessControl.address, user1, { from: owner });
    hasAccess = await masterAccessControl.hasAccess(masterAccessControl.address, user1);
    assert.isFalse(hasAccess, "User1 should not have access after revoking");
  });

  it("should not allow unauthorized access", async () => {
    await truffleAssert.reverts(
      masterAccessControl.grantAccess(masterAccessControl.address, user2, { from: user1 }),
      "MasterAccessControl: Not authorized"
    );
  });

  it("should grant NFTContract access to NFTAccessControl in MasterAccessControl", async () => {
    const hasAccess = await masterAccessControl.hasAccess(nftAccessControl.address, nftContract.address);
    assert.isTrue(hasAccess, "NFTContract should have access to NFTAccessControl");
  });

  it("should grant NFTContract access to NFTMetadata in MasterAccessControl", async () => {
    const hasAccess = await masterAccessControl.hasAccess(nftMetadata.address, nftContract.address);
    assert.isTrue(hasAccess, "NFTContract should have access to NFTMetadata");
  });

});
