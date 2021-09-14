pragma solidity 0.8.7;

import "./IERC165.sol";
import "./ownable.sol";

interface registry is IERC165 {
    function register(string calldata contract_name) external view returns (address);
    function update_register(string calldata contract_name, address location) external;
}

contract has_registry is ownable {
    registry public reg;

    modifier isRegistry(address registry_candidate) {
        require(registry(registry_candidate).supportsInterface(calculateSelector()),
         "has_registry: registry candidate not complient with registry interface");
        _;
    }

    constructor(address registry_address) ownable() {
        update_registry(registry_address);
    }

    function update_registry(address new_registry_address) public onlyOwner isRegistry(new_registry_address) {
        reg = registry(new_registry_address);
    }

    function calculateSelector() private view returns (bytes4) {
        return reg.register.selector ^ reg.update_register.selector;
    }
}