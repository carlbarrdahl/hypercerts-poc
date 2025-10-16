// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC4626Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

struct Config {
    IERC20 asset;
    HyperVault parent;
    address owner;
    uint256 percent;
    uint256 shares;
    string metadata;
}

contract HyperVaultFactory {
    event Created(address indexed id, Config config);

    address public immutable implementation;

    constructor() {
        implementation = address(new HyperVault());
    }

    function create(Config memory config) external returns (HyperVault) {
        address clone = Clones.clone(implementation);
        HyperVault(clone).initialize(config);
        emit Created(clone, config);
        return HyperVault(clone);
    }
}

/**
 * @title HyperVault
 * @notice ERC4626 vault that can have a parent vault, creating a tree structure
 * @dev Each vault has its own token, but pushes value to parent
 */
contract HyperVault is Initializable, ERC4626Upgradeable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    Config public config;

    event Funded(
        address indexed sender,
        address indexed owner,
        uint256 assets
        // uint256 assetsToParent
    );

    constructor() {
        _disableInitializers();
    }

    function initialize(Config memory config_) public initializer {
        __ERC20_init("Hypercert", "cert");
        __ERC4626_init(config_.asset);

        config = config_;

        if (config_.shares > 0) {
            _mint(config_.owner, config_.shares);
            emit Deposit(config_.owner, config_.owner, 0, config_.shares);
        }
    }

    function fund(
        uint256 assets,
        address receiver
    ) external nonReentrant returns (uint256) {
        require(assets > 0, "HyperVault: zero assets");

        // Transfer underlying from caller into vault
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), assets);

        emit Funded(msg.sender, receiver, assets);

        // Return assets to keep signature/return shape similar to deposit (deposit returns shares,
        // but fund does not mint shares so we return the assets transferred).
        return assets;
    }
}
