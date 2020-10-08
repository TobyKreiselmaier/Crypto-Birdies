// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Migrations {
  address public _owner = msg.sender;
  uint public _last_completed_migration;

  modifier restricted() {
    require(
      msg.sender == _owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  function setCompleted(uint _completed) public restricted {
    _last_completed_migration = _completed;
  }
}
