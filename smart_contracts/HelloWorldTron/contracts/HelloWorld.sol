// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract HelloWorld {
    string public message;

    constructor() public {
        message = "Hello World";
    }

    function setMessage(string memory newMessage) public {
        message = newMessage;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}