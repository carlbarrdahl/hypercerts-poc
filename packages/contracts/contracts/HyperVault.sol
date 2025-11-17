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
    string metadataURI;
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
 * @dev Supports pillar => sub-pillar => pathway hierarchy with upstream value distribution
 */
contract HyperVault is Initializable, ERC4626Upgradeable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    Config public config;

    // Track child vaults for tree navigation
    mapping(address => bool) public isChildVault;
    address[] public childVaults;

    // Track upstream value sent
    uint256 public totalUpstreamSent;

    // Max percent is 10000 (100%)
    uint256 public constant MAX_PERCENT = 10000;

    event Funded(
        address indexed sender,
        address indexed receiver,
        uint256 assets,
        uint256 assetsToParent
    );

    event ValuePushedUpstream(address indexed parent, uint256 amount);

    event ChildVaultRegistered(address indexed child);

    event SharesMinted(address indexed recipient, uint256 shares);

    event DepositedToVault(
        address indexed targetVault,
        uint256 assets,
        uint256 shares
    );

    constructor() {
        _disableInitializers();
    }

    function initialize(Config memory config_) public initializer {
        __ERC20_init("Hypercert", "cert");
        __ERC4626_init(config_.asset);

        require(config_.percent <= MAX_PERCENT, "HyperVault: percent too high");

        config = config_;

        // Register with parent if exists
        if (address(config_.parent) != address(0)) {
            config_.parent.registerChild();
        }

        if (config_.shares > 0) {
            _mint(config_.owner, config_.shares);
            emit Deposit(config_.owner, config_.owner, 0, config_.shares);
        }
    }

    /**
     * @notice Register a child vault (called by child during initialization)
     */
    function registerChild() external {
        require(!isChildVault[msg.sender], "HyperVault: already registered");
        isChildVault[msg.sender] = true;
        childVaults.push(msg.sender);
        emit ChildVaultRegistered(msg.sender);
    }

    /**
     * @notice Mint shares directly to a contributor (owner only)
     * @dev Allows vault owner to reward contributors for their work without requiring asset deposit
     * @param recipient Address to receive the shares
     * @param shares Number of shares to mint
     */
    function mintShares(address recipient, uint256 shares) external {
        require(msg.sender == config.owner, "HyperVault: only owner");
        require(recipient != address(0), "HyperVault: zero address");
        require(shares > 0, "HyperVault: zero shares");

        _mint(recipient, shares);
        emit SharesMinted(recipient, shares);
    }

    /**
     * @notice Deposit assets from this vault to another vault
     * @dev Owner can distribute funds to other vaults (e.g., from region to projects)
     * @param targetVault Address of the vault to deposit to
     * @param assets Amount of assets to deposit
     */
    function depositToVault(
        address targetVault,
        uint256 assets
    ) external nonReentrant {
        require(msg.sender == config.owner, "HyperVault: only owner");
        require(targetVault != address(0), "HyperVault: zero address");
        require(
            targetVault != address(this),
            "HyperVault: cannot deposit to self"
        );
        require(assets > 0, "HyperVault: zero assets");
        require(
            assets <= IERC20(asset()).balanceOf(address(this)),
            "HyperVault: insufficient balance"
        );

        // Approve the target vault to spend our assets
        IERC20(asset()).approve(targetVault, assets);

        // Call fund on the target vault, receiving shares to this vault
        HyperVault(targetVault).fund(assets, address(this));
    }

    /**
     * @notice Fund this vault and optionally push value upstream based on percent
     * @param assets Amount to fund
     * @param receiver Address to emit in event (for tracking)
     * @return Total assets added to the vault system
     */
    function fund(
        uint256 assets,
        address receiver
    ) external nonReentrant returns (uint256) {
        require(assets > 0, "HyperVault: zero assets");

        // Transfer underlying from caller into vault
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), assets);

        // Calculate upstream amount if parent exists
        uint256 upstreamAmount = 0;
        if (address(config.parent) != address(0) && config.percent > 0) {
            upstreamAmount = (assets * config.percent) / MAX_PERCENT;
            _pushValueUpstream(upstreamAmount);
        }

        uint256 localAssets = assets - upstreamAmount;

        emit Funded(msg.sender, receiver, localAssets, upstreamAmount);

        return assets;
    }

    /**
     * @notice Push value to parent vault recursively
     * @dev This benefits all holders in the parent vault and continues up the tree
     */
    function _pushValueUpstream(uint256 amount) internal {
        if (address(config.parent) == address(0) || amount == 0) return;

        // Approve parent vault to take assets
        IERC20(asset()).approve(address(config.parent), amount);

        // Recursively push upstream by calling parent's fund function
        config.parent.fund(amount, address(this));

        totalUpstreamSent += amount;
        emit ValuePushedUpstream(address(config.parent), amount);
    }

    /**
     * @notice Get the parent vault address
     * @return Address of the parent vault (zero address if root)
     */
    function getParent() external view returns (address) {
        return address(config.parent);
    }

    /**
     * @notice Get this vault's level in the tree
     * @return level 0 for root (pillar), 1 for sub-pillar, 2 for pathway, etc.
     */
    function getTreeLevel() external view returns (uint256 level) {
        HyperVault parent = config.parent;

        while (address(parent) != address(0)) {
            level++;
            address nextParent = parent.getParent();
            if (nextParent == address(0)) break;
            parent = HyperVault(nextParent);
            // Safety check to prevent infinite loops
            if (level > 100) break;
        }
        return level;
    }

    /**
     * @notice Get all child vault addresses
     * @return Array of child vault addresses
     */
    function getChildVaults() external view returns (address[] memory) {
        return childVaults;
    }

    /**
     * @notice Get the number of child vaults
     * @return Count of child vaults
     */
    function getChildVaultCount() external view returns (uint256) {
        return childVaults.length;
    }
}
