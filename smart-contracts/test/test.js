const { expect } = require("chai");

describe("Token contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
    
        const [owner, user] = await ethers.getSigners();
        const userAddress = await user.getAddress();
        const ownerAddress = await owner.getAddress();
        const userAmount = 10
        console.log("Deploying STKN Contract...");
        const STKNFactory = await ethers.getContractFactory("STKN");
        const stkn = await STKNFactory.deploy();

        //STKNICO
        console.log("Deploying stknICO Contract...");
        const StknICOFactory = await ethers.getContractFactory("StknICO");
        const stknICO = await StknICOFactory.deploy(
        ownerAddress,
        stkn.address
        );
        console.log("Deployed stknICO:", stknICO.address);
        await stkn.mint(stknICO.address, 5000)
        
        await stknICO.startICO();
        
        const stknICOWithOwner = await stknICO.connect(ownerAddress);
        const ownerBalance = await stknICOWithOwner.getICOTokenBalance();
        console.log("Owner balance is ", ownerBalance);
        
        const stknICOWithUser = await stknICO.connect(user);
        await stknICOWithUser.deposit({value: ethers.utils.parseEther((0.001 * userAmount).toString()),});
        console.log("success transfer: ", {value: ethers.utils.parseEther((0.001 * userAmount).toString()),});
        const userBalance = await stknICO.purchaseBalanceOf(ownerAddress);
        console.log("User balance is ", userBalance);
    });

    /* test startICO */

    //test startICO

    /* test deposit */

    // test minPurchase

    // test maxPurchase

    // test hardCap

    /* test endICO */

    // test endICO

    /* test withdraw */

    // test withdraw

    /* test claim */

    // test minPurchase

    // test claim

});
