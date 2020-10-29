const Birdcontract = artifacts.require("CryptoBirdies");
const Testcontract = artifacts.require("Test");
const Marketcontract = artifacts.require("MarketPlace");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");
var testInstance;
var marketInstance;
var birdInstance;

contract("Testcontract", (accounts) => {
  
  beforeEach(async () => {testInstance = await Testcontract.new("CryptoBird", "CBX")});

  describe("getAllBirdsOfOwner()", () =>{
    it("should return all birds owned by an address", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      await testInstance.createTestBird(202, accounts[1]);
      var testAllBirdsOfOwner = await testInstance.getAllBirdsOfOwner(accounts[1]);
      assert.equal(testAllBirdsOfOwner[1], 2, "Something went wrong");
    });
  });
})

contract("Marketcontract", (accounts) => {

  beforeEach(async () => {
    testInstance = await Testcontract.new("CryptoBird", "CBX");
    marketInstance = await Marketcontract.new(testInstance.address);
  });

  describe("getOffer()", () =>{
    it("should revert, if there is no active offer", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await truffleAssert.reverts(marketInstance.getOffer(1));
    });

    it("should return seller, price, index, tokenId, and status of an offer correcly", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      var offer = await marketInstance.getOffer(1);
      assert.equal(offer.seller, accounts[1], "Seller is wrong");
      assert.equal(offer.price, 1, "Price is wrong");
      assert.equal(offer.index, 0, "Index is wrong");
      assert.equal(offer.tokenId, 1, "TokenId is wrong");
      assert.equal(offer.active, true, "Offer status is wrong");
    });
  });

  describe("getAllTokensOnSale()", () =>{
    it("should return an array with the correct length and ids of offers", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      await testInstance.createTestBird(202, accounts[2]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[2] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      await marketInstance.setOffer(2, 2, { from: accounts[2] });//2 ETH for Bird2
      var arrayOffers = await marketInstance.getAllTokensOnSale();
      assert.equal(arrayOffers.length, 2, "The offer array does NOT have the correct length");
      assert.equal(arrayOffers[0], 1, "Bird1 offer status is wrong");
      assert.equal(arrayOffers[1], 2, "Bird2 offer status is wrong");
    });
  });

  describe("setOffer()", () =>{
    it("should only allow the owner to set an offer", async () => {
      await testInstance.createTestBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true);
      await truffleAssert.reverts(marketInstance.setOffer(1, 1, { from: accounts[1] }));//1 ETH for tokenId1 (birdId1)
    });

    it("should not allow to set a new offer when another already exists", async () => {
      await testInstance.createTestBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true);
      await marketInstance.setOffer(1, 1);//1 ETH for tokenId1 (birdId1)
      await truffleAssert.reverts(marketInstance.setOffer(5, 1));//5 ETH for tokenId1 (birdId1)
    });

    it("should not allow to set an offer, if the Marketcontract is not an approved operator", async () => {
      await testInstance.createTestBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, false);
      await truffleAssert.reverts(marketInstance.setOffer(5, 1));//5 ETH for tokenId1 (birdId1)
    });

    it("should emit a transaction event with correct parameters", async () => {
      await testInstance.createTestBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true);
      var creation = await marketInstance.setOffer(5, 1);
      truffleAssert.eventEmitted(creation, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer created" && ev.owner == accounts[0] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("removeOffer()", () =>{
    it("should only allow the owner to remove an offer", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      await truffleAssert.reverts(marketInstance.removeOffer(1, { from: accounts[0] }));
    });

    it("should set status in the offers array to false", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      await marketInstance.removeOffer(1, { from: accounts[1] });
      var status = await marketInstance.getAllTokensOnSale();
      assert.equal(status.length, 0, "The offers array was not updated correctly");
    });

    it("should delete the entry in the tokenIdToOffer mapping", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      await marketInstance.removeOffer(1, { from: accounts[1] });
      await truffleAssert.reverts(marketInstance.getOffer(1));
    });

    it("should emit a MarketTransaction with correct parameters", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      var removal = await marketInstance.removeOffer(1, { from: accounts[1] });
      truffleAssert.eventEmitted(removal, 'MarketTransaction', (ev) => {
        return ev.TxType == "Offer removed" && ev.owner == accounts[1] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("buyBird()", () =>{
    it("should only work, if there is an active offer", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await truffleAssert.reverts(marketInstance.buyBird(1, { from: accounts[2], value: 1 }));
    });

    it("should only work, if the value offered is equal to the asking price of the offer", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(2, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      await truffleAssert.reverts(marketInstance.buyBird(1, { from: accounts[2], value: 1 }));
    });

    it("should transfer ownership correctly", async () => {
      await testInstance.createTestBird(101, accounts[0]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[0] });
      await marketInstance.setOffer(1, 1, { from: accounts[0] });//1 ETH for tokenId1 (birdId1)
      await marketInstance.buyBird(1, { from: accounts[1], value: 1 });
      var owner = await testInstance.ownerOf(1);
      assert.equal(owner, accounts[1], "Ownership was not updated correctly");
    });

    it("should set the status in the offers array to false", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      await marketInstance.buyBird(1, { from: accounts[2], value: 1 });
      var status = await marketInstance.getAllTokensOnSale();
      assert.equal(status.length, 0, "The offers array was not updated correctly");
    });

    it("should delete the entry in the tokenIdToOffer mapping", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      await marketInstance.buyBird(1, { from: accounts[2], value: 1 });
      await truffleAssert.reverts(marketInstance.getOffer(1));
    });

    it("should emit a MarketTransaction event with correct parameters", async () => {
      await testInstance.createTestBird(101, accounts[1]);
      var marketAddress = await marketInstance.address;
      await testInstance.setApprovalForAll(marketAddress, true, { from: accounts[1] });
      await marketInstance.setOffer(1, 1, { from: accounts[1] });//1 ETH for tokenId1 (birdId1)
      var purchase = await marketInstance.buyBird(1, { from: accounts[2], value: 1 });
      truffleAssert.eventEmitted(purchase, 'MarketTransaction', (ev) => {
        return ev.TxType == "Bird successfully purchased" && ev.owner == accounts[2] && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
    });
  });
})

contract("Birdcontract", (accounts) => {

  beforeEach(async () => {birdInstance = await Birdcontract.new("CryptoBird", "CBX")});

  describe("getContractOwner()", () =>{
    it("should the owner of the smart contract", async () => {
      var owner = await birdInstance.getContractOwner();
      assert.equal(owner, accounts[0], "The owner was not returned correctly");
    });
  });

  describe("breed()", () =>{
    it("should execute only, if both parents are owned by msg.sender", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.createBirdGen0(202);
      var dadOwner = await birdInstance.ownerOf(2);
      var mumOwner = await birdInstance.ownerOf(1);
      assert.equal(dadOwner && mumOwner, accounts[0], "The parents are not owned by msg.sender");
      await birdInstance.breed(2, 1);
    });

    it("should call _mixDna() and create a new 17-digit DNA string", async () => {
      await birdInstance.createBirdGen0("11223344556677889");
      await birdInstance.createBirdGen0("98877665544332211");
      var birdy = await birdInstance.breed(2, 1);
      truffleAssert.eventEmitted(birdy, 'Birth', (ev) => {
        var helper = ev.genes;
        return helper.toString().length == 17;
      }, "There was no new 17-digit DNA string created by _mixDna()");
    });

    it("should emit a birth event with correct parameters", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.createBirdGen0(202);
      var birdy = await birdInstance.breed(2, 1);
      truffleAssert.eventEmitted(birdy, 'Birth', (ev) => {
        return ev.owner == accounts[0] && ev.birdId == 3 && ev.mumId == 1 && ev.dadId == 2;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("supportsInterface()", () =>{
    it("should check, if the contract supports IERC721", async () => {
      var testIERC721 = await birdInstance.supportsInterface("0x80ac58cd");
      assert.equal(testIERC721, true, "The contract does not support IERC721");
    });

    it("should check, if the contract supports IERC165", async () => {
      var testIERC721 = await birdInstance.supportsInterface("0x01ffc9a7");
      assert.equal(testIERC721, true, "The contract does not support IERC721");
    });
  });

  describe("createBirdGen0()", () =>{
    it("should only allow the owner of the contract to create a bird", async () => {
      await truffleAssert.reverts(birdInstance.createBirdGen0(101, { from: accounts[1] }));
    });

    it("should only allow a maximum of 10 Gen0 birds to be created", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.createBirdGen0(102);
      await birdInstance.createBirdGen0(103);
      await birdInstance.createBirdGen0(104);
      await birdInstance.createBirdGen0(105);
      await birdInstance.createBirdGen0(106);
      await birdInstance.createBirdGen0(107);
      await birdInstance.createBirdGen0(108);
      await birdInstance.createBirdGen0(108);
      await birdInstance.createBirdGen0(110);
      await truffleAssert.reverts(birdInstance.createBirdGen0(111));
    });

    it("should call _createBird() and _transfer() and emit a birth event with correct parameters", async () => {
      var birdy = await birdInstance.createBirdGen0(101);
      truffleAssert.eventEmitted(birdy, 'Birth', (ev) => {
        return ev.owner == accounts[0] && ev.birdId == 1 && ev.mumId == 0 && ev.dadId == 0 && ev.genes == 101;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getBird()", () =>{
    it("should return the correct genes of a bird", async () => {
      await birdInstance.createBirdGen0(101);
      var result = await birdInstance.getBird(1);
      assert.equal(result.genes, 101, "The genes are incorrect");
    });

    it("should return the correct birthTime of a bird", async () => {
      var startTime = Date.now();
      await birdInstance.createBirdGen0(101);
      var endTime = Date.now();
      var result = await birdInstance.getBird(1);
      assert(startTime/1000 <= result.birthTime <= endTime/1000, "The birthTime is incorrect");
    });

    it("should return the correct mumId of a bird", async () => {
      await birdInstance.createBirdGen0(101);
      var result = await birdInstance.getBird(1);
      assert.equal(result.mumId, 0, "The id for the mum is incorrect");
    });

    it("should return the correct dadId of a bird", async () => {
      await birdInstance.createBirdGen0(101);
      var result = await birdInstance.getBird(1);
      assert.equal(result.dadId, 0, "The id for the dad is incorrect");
    });

    it("should return the correct generation of a bird", async () => {
      await birdInstance.createBirdGen0(101);
      var result = await birdInstance.getBird(1);
      assert.equal(result.generation, 0, "The generation is not zero");
    });

    it("should revert, if the bird does not exist", async () => {
      await truffleAssert.reverts(birdInstance.getBird(5));
    });
  });

  describe("balanceOf()", () =>{
    it("should return the correct balance of tokens owned by an address", async () => {
      var numberTokens = await birdInstance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 0, "The record of tokens is flawed and can't be trusted");
      await birdInstance.createBirdGen0(101);
      numberTokens = await birdInstance.balanceOf(accounts[0]);
      assert.equal(numberTokens, 1, "The record of tokens is flawed and can't be trusted");
    });
  });

  describe("totalSupply()", () =>{
  it("should record the total supply of tokens", async () => {
    await birdInstance.createBirdGen0(101);
    var supply = await birdInstance.totalSupply();
    assert.equal(supply, 2, "The record of total supply is flawed and can't be trusted");
  });
});

  describe("name()", () =>{
    it("should return the name of the native token 'CryptoBird'", async () => {
      var testName = await birdInstance.name();
      assert.equal(testName, "CryptoBird", "Token wasn't constructed correctly");
    });
  });

  describe("symbol()", () =>{
    it("should return the ticker symbol 'CBX'", async () => {
      var testSymbol = await birdInstance.symbol();
      assert.equal(testSymbol, "CBX", "Symbol wasn't constructed correctly");
    });
  });

  describe("ownerOf()", () =>{
    it("should return the correct owner of the token", async () => {
      await birdInstance.createBirdGen0(101);
      var testOwner = await birdInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "The owner of the token is incorrect");
    });

    it("should revert, if the ID does not exist", async () => {
      await truffleAssert.reverts(birdInstance.ownerOf(5));
    });
  });

  describe("transfer()", () =>{
    it("should not allow transfer to the burn address", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await birdInstance.createBirdGen0(101);
      var testOwner = await birdInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
      await truffleAssert.reverts(birdInstance.transfer(zeroAddress, 0));
    });
  
    it("should not allow transfer to the contract address", async () => {
      const contractAddress = await birdInstance.address;
      await birdInstance.createBirdGen0(101);
      var testOwner = await birdInstance.ownerOf(1);
      assert.equal(testOwner, accounts[0], "Owner is not msg.sender");
      await truffleAssert.reverts(birdInstance.transfer(contractAddress, 0));
    });
  
    it("should emit a transfer event when a transfer was successful", async () => {
      await birdInstance.createBirdGen0(101);
      var testTransfer = await birdInstance.transfer(accounts[1], 1);
      truffleAssert.eventEmitted(testTransfer, 'Transfer', (ev) => {
      return ev.from == accounts[0] && ev.to == accounts[1] && ev.tokenId == 1;
      }, "Transfer event should have been emitted with correct parameters");
    });
  
    it("should check balances and transfer a token from one account to another", async () => {
      await birdInstance.createBirdGen0(101);

      var numberTokensSender = await birdInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 1, "Token balance is incorrect");
      var numberTokensRecipient = await birdInstance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipient, 0, "Token balance is incorrect");

      await birdInstance.transfer(accounts[1], 1);

      numberTokensSender = await birdInstance.balanceOf(accounts[0]);
      assert.equal(numberTokensSender, 0, "Token balance is incorrect");
      numberTokensRecipient = await birdInstance.balanceOf(accounts[1]);
      assert.equal(numberTokensRecipient, 1, "Token balance is incorrect");
    });
  });

  describe("approve()", () =>{
    it("should set operator approval for one bird and emit the correct event", async () => {
      await birdInstance.createBirdGen0(101);
      var marketAddress = await marketInstance.address;
      var approval = await birdInstance.approve(marketAddress, 1);
      truffleAssert.eventEmitted(approval, 'Approval', (ev) => {
        return ev.owner == accounts[0] && ev.approved == marketAddress && ev.tokenId == 1;
        }, "Event was NOT emitted with correct parameters");
        //genes can not be tested as they are randomized
    });
  });

  describe("setApprovalForAll()", () =>{
    it("should set operator approval for all birds of an owner and emit the correct event", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.createBirdGen0(202);
      var marketAddress = await marketInstance.address;
      var approvalForAll = await birdInstance.setApprovalForAll(marketAddress, true);
      truffleAssert.eventEmitted(approvalForAll, 'ApprovalForAll', (ev) => {
        return ev.owner == accounts[0] && ev.operator == marketAddress && ev.approved == true;
        }, "Event was NOT emitted with correct parameters");
    });
  });

  describe("getApproved()", () =>{
    it("should return the approved operator for a bird", async () => {
      await birdInstance.createBirdGen0(101);
      var marketAddress = await marketInstance.address;
      await birdInstance.approve(marketAddress, 1);
      var approvedOperator = await birdInstance.getApproved(1);
      assert.equal(approvedOperator, marketAddress, "The operator was NOT returned correctly");
    });
  });

  describe("isApprovedForAll()", () =>{
    it("should return approved status for an operator", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.createBirdGen0(202);
      var marketAddress = await marketInstance.address;
      await birdInstance.setApprovalForAll(marketAddress, true);
      var hasApprovalForAll = await birdInstance.isApprovedForAll(accounts[0], marketAddress);
      assert.equal(hasApprovalForAll, true, "The status was NOT returned correctly");
    });
  });

  describe("safeTransferFrom()", () =>{//uses transfer(), so basic functionality doesn't have to be retested
    it("should check, if the from address is msg.sender", async () => {
      await birdInstance.createBirdGen0(101);
      await truffleAssert.passes(birdInstance.safeTransferFrom(accounts[0], accounts[1], 1, {from: accounts[0]}));
    });

    it("should check, if msg.sender has operator approval for this token", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.approve(accounts[2], 1);
      await truffleAssert.passes(birdInstance.safeTransferFrom(accounts[0], accounts[1], 1, {from: accounts[2]}));
    });

    it("should check, if msg.sender has general operator approval for this owner", async () => {
      await birdInstance.createBirdGen0(101);
      await birdInstance.setApprovalForAll(accounts[2], true);
      await truffleAssert.passes(birdInstance.safeTransferFrom(accounts[0], accounts[1], 1, {from: accounts[2]}));
    });

    it("should check, if the from address is the owner of the bird", async () => {
      await birdInstance.createBirdGen0(101);
      await truffleAssert.reverts(birdInstance.safeTransferFrom(accounts[2], accounts[1], 1, {from: accounts[0]}));
    });

    it("should not allow a transfer to the zero address", async () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await birdInstance.createBirdGen0(101);
      await truffleAssert.reverts(birdInstance.safeTransferFrom(accounts[0], zeroAddress, 1));
    });

    it("should not allow a transfer of a token that doesn't exist", async () => {
      await truffleAssert.reverts(birdInstance.safeTransferFrom(accounts[0], accounts[1], 1));
    });

    it("should only allow transfer to a contract that does support ERC721", async () => {
      marketInstance = await Marketcontract.new(birdInstance.address);
      await birdInstance.createBirdGen0(101);
      await birdInstance.createBirdGen0(101);
      await truffleAssert.reverts(birdInstance.safeTransferFrom(accounts[0], marketInstance.address, 1));
    });
  });

//transferFrom has same requirements as safeTransferFrom()

})