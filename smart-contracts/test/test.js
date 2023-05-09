const { expect, assert  } = require("chai");

contract("StknICO", (accounts) => {
  let ico;
  let token;
  let accounts;

  beforeEach(async () => {
    // Deploy a new ERC20 token contract
    token = await ethers.getContractFactory("STKN");

    // Deploy a new StknICO contract
    ico = await ethers.getContractFactory("ICO");

    accounts = await ethers.getSigners();
    
    // Set ICO state to RUNNING
    await token.deployed();
  });

  it("allows investors to invest in the ICO", async () => {
    const investment = web3.utils.toWei("0.02", "ether"); // Invest 0.02 ether

    // Investor 1 invests in the ICO
    await ico.deposit({ from: investor1, value: investment });

    // Check investor 1 balance
    const purchasedAmount1 = await ico.purchasedAmountOf(investor1);
    assert.equal(purchasedAmount1.toString(), investment.toString());

    // Check ICO balance
    const raisedAmount = await ico.raisedAmount();
    assert.equal(raisedAmount.toString(), investment.toString());

    // Check ICO token balance
    const expectedTokens = investment / ico.tokenPrice() * 1e18;
    const icoTokenBalance = await ico.getICOTokenBalance();
    assert.equal(icoTokenBalance.toString(), expectedTokens.toString());
  });

  it("allows investors to withdraw their investment if the ICO fails", async () => {
    const investment = web3.utils.toWei("0.02", "ether"); // Invest 0.02 ether

    // Investor 1 invests in the ICO
    await ico.deposit({ from: investor1, value: investment });

    // Fail the ICO
    await ico.failed({ from: admin });

    // Investor 1 withdraws their investment
    const balanceBefore = await web3.eth.getBalance(investor1);
    await ico.withdraw({ from: investor1 });
    const balanceAfter = await web3.eth.getBalance(investor1);

    // Check investor 1 balance
    const expectedBalance = new web3.utils.BN(balanceBefore).add(new web3.utils.BN(investment));
    assert.equal(balanceAfter.toString(), expectedBalance.toString());

    // Check investor 1 balance on the ICO contract
    const purchasedAmount1 = await ico.purchasedAmountOf(investor1);
    assert.equal(purchasedAmount1.toString(), "0");

    // Check ICO balance
    const raisedAmount = await ico.raisedAmount();
    assert.equal(raisedAmount.toString(), "0");
  });

  it("allows investors to claim their tokens if the ICO succeeds", async () => {
    const investment = web3.utils.toWei("0.02", "ether"); // Invest 0.02 ether

    // Investor 1 invests in the ICO
    await ico.deposit({ from: investor1, value: investment });

    // Succeed the ICO
    await ico.successed({ from: admin });

    // Investor 1 claims their tokens
    const tokensBefore = await token.balanceOf(investor1);
    await ico.claim({ from: investor1, value: investment });
    const tokensAfter = await token.balanceOf(investor1);

    // Check investor 1 token balance
    const expectedTokens = investment / ico.tokenPrice() * 1e18;
    assert.equal(tokensAfter.toString(), expectedTokens.toString());

    // Check investor 1 balance on the ICO contract
    const purchasedAmount1 = await ico.purchasedAmountOf(investor1);
    assert.equal(purchasedAmount1.toString(), "0");

    // Check ICO token balance
    const icoTokenBalance = await ico.getICOTokenBalance();
    assert.equal(icoTokenBalance.toString(), "0");
  });
});