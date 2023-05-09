// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StknICO {
    //Administration Details
    address public admin;
    address payable public ICOWallet;

    //Token
    ERC20 public token;

    //ICO Details
    uint public tokenPrice = 0.001 ether;
    uint public softcap = 0.1 ether;
    uint public hardCap = 1 ether;
    uint public raisedAmount;
    uint public minPurchase = 0.01 ether;
    uint public maxPurchase = 0.05 ether;
    uint public icoStartTime = 1689292800;
    uint public icoEndTime = 1689379200;

    //Investor
    mapping(address => uint) public purchasedAmountOf;

    //ICO State
    enum State {
        BEFORE,
        RUNNING,
        END,
        SUCCESSED,
        FAILED
    }
    State public ICOState;

    //Events
    event Deposit(
        address indexed from,
        address indexed to,
        uint value,
        uint tokens
    );
    event Withdraw(
        address indexed from,
        uint value
    );
    event Claim(
        address indexed from,
        uint value
    );

    //Initialize Variables
    constructor(address payable _icoWallet, address _token) {
        admin = msg.sender;
        ICOWallet = _icoWallet;
        token = ERC20(_token);
    }

    //Access Control
    modifier onlyAdmin() {
        require(msg.sender == admin, "Admin Only function");
        _;
    }

    //Receive Ether Directly
    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }

    /* Functions */

    //Get ICO State
    function getICOState() external view returns (string memory) {
        if (ICOState == State.BEFORE) {
            return "Not Started";
        } else if (ICOState == State.RUNNING) {
            return "Running";
        } else if (ICOState == State.END) {
            return "End";
        } else if (ICOState == State.SUCCESSED){
            return "Successed";
        } else {
            return "Failed";
        }
    }

    /* Admin Functions */

    //Set ICO State
    function startICO() external onlyAdmin {
        require(ICOState == State.BEFORE, "ICO isn't in before state");
        require(block.timestamp >= icoStartTime, "ICO should not be started yet");

        ICOState = State.RUNNING;
    }
    
    function endIco() public {
        require(ICOState == State.RUNNING, "ICO Should be in Running State");
        require(
            block.timestamp > icoEndTime || raisedAmount >= hardCap,
            "ICO Hardcap or timelimit not reached"
        );
        ICOState = State.END;
    }

    function successed() public {
        require(ICOState == State.END, "ICO Should End");
        require(raisedAmount >= softcap, "ICO has not reached softCap");
        ICOState = State.SUCCESSED;
    }

    function failed() public {
        require(ICOState == State.END, "ICO Should End");
        require(raisedAmount < softcap, "ICO has reached softCap");
        ICOState = State.FAILED;
    }

    //Change ICO Wallet
    function changeICOWallet(address payable _newICOWallet) external onlyAdmin {
        ICOWallet = _newICOWallet;
    }
    
    //Change Admin
    function changeAdmin(address _newAdmin) external onlyAdmin {
        admin = _newAdmin;
    }

    /* User Function */
    
    //Deposit
    function deposit() public payable returns (bool) {
        require(ICOState == State.RUNNING, "ICO isn't running");
        require(
            msg.value >= minPurchase && msg.value <= maxPurchase,
            "Check Min and Max Purchase"
        );
        require(
            purchasedAmountOf[msg.sender] + msg.value <= maxPurchase,
            "Investor reached maximum Purchase Amount"
        );

        require(
            raisedAmount + msg.value <= hardCap,
            "Send within hardcap range"
        );
        require(
            block.timestamp <= icoEndTime,
            "ICO already Reached Maximum time limit"
        );

        raisedAmount += msg.value;
        purchasedAmountOf[msg.sender] += msg.value;

        (bool transferSuccess, ) = ICOWallet.call{value: msg.value}("");
        require(transferSuccess, "Failed to Invest");

        uint tokens = (msg.value / tokenPrice) * 1e18;
        bool saleSuccess = token.transfer(msg.sender, tokens);
        require(saleSuccess, "Failed to Invest");

        emit Deposit(address(this), msg.sender, msg.value, tokens);
        return true;
    }

    function withdraw() public {
        require(ICOState == State.FAILED, "ICO has not FAILED");
        
        emit Withdraw(msg.sender, purchasedAmountOf[msg.sender]);
        
        payable(msg.sender).transfer(purchasedAmountOf[msg.sender]);
        purchasedAmountOf[msg.sender] = 0;
    }

    function claim() public payable {
        require(ICOState == State.SUCCESSED, "ICO has not SUCCESSED");
        require(purchasedAmountOf[msg.sender] >= msg.value, "Have not this amount");

        purchasedAmountOf[msg.sender] -= msg.value;

        emit Claim(msg.sender, msg.value);

        payable(msg.sender).transfer(msg.value);
    }

    //Check ICO Contract Token Balance
    function getICOTokenBalance() external view returns (uint) {
        return token.balanceOf(address(this));
    }

    //Check ICO Contract Investor Token Balance
    function purchaseBalanceOf(address _purchase) external view returns (uint) {
        return token.balanceOf(_purchase);
    }
}
