export const dscEngineABI = [
  {
    "type": "constructor",
    "inputs": [
      { "name": "_collateralTokens", "type": "address[]", "internalType": "address[]" },
      { "name": "_priceFeeds", "type": "address[]", "internalType": "address[]" },
      { "name": "_dsc", "type": "address", "internalType": "address" }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "burnDSC",
    "inputs": [{ "name": "_amount", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositCollateral",
    "inputs": [
      { "name": "_token", "type": "address", "internalType": "address" },
      { "name": "_amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositCollateralAndMintDsc",
    "inputs": [
      { "name": "_token", "type": "address", "internalType": "address" },
      { "name": "_collateralAmount", "type": "uint256", "internalType": "uint256" },
      { "name": "_dscAmount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAccountInformation",
    "inputs": [],
    "outputs": [
      { "name": "", "type": "uint256", "internalType": "uint256" },
      { "name": "", "type": "uint256", "internalType": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCollateral",
    "inputs": [
      { "name": "_user", "type": "address", "internalType": "address" },
      { "name": "_token", "type": "address", "internalType": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCollateralDeposit",
    "inputs": [{ "name": "_token", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCollateralTokenPriceFeed",
    "inputs": [{ "name": "token", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCollateralUSDValue",
    "inputs": [{ "name": "user", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getHealthFactor",
    "inputs": [{ "name": "_user", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMaxMintableDsc",
    "inputs": [
      { "name": "_token", "type": "address", "internalType": "address" },
      { "name": "_amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getStablecoin",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUSDValue",
    "inputs": [
      { "name": "_priceFeedAddress", "type": "address", "internalType": "address" },
      { "name": "_amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "liquidate",
    "inputs": [
      { "name": "_insolvetUser", "type": "address", "internalType": "address" },
      { "name": "_collateralAddress", "type": "address", "internalType": "address" },
      { "name": "_dscToBurn", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "mintDSC",
    "inputs": [{ "name": "_amount", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "redeemCollateral",
    "inputs": [
      { "name": "_collateral", "type": "address", "internalType": "address" },
      { "name": "_amount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "redeemCollateralAndBurnDsc",
    "inputs": [
      { "name": "_token", "type": "address", "internalType": "address" },
      { "name": "_collateralAmount", "type": "uint256", "internalType": "uint256" },
      { "name": "_dscAmount", "type": "uint256", "internalType": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "CollateralDeposited",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "token", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CollateralRedeemed",
    "inputs": [
      { "name": "user", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "token", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DSCBurned",
    "inputs": [
      { "name": "burner", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DSCMinted",
    "inputs": [
      { "name": "minter", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Liquidation",
    "inputs": [
      { "name": "liquidator", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "insolventUser", "type": "address", "indexed": true, "internalType": "address" }
    ],
    "anonymous": false
  },
  { "type": "error", "name": "DSCEngine__AmountMustBePositive", "inputs": [] },
  { "type": "error", "name": "DSCEngine__HealthFactorOk", "inputs": [] },
  {
    "type": "error",
    "name": "DSCEngine__InsufficientCollateral",
    "inputs": [{ "name": "healthFactor", "type": "uint256", "internalType": "uint256" }]
  },
  { "type": "error", "name": "DSCEngine__MintingFailed", "inputs": [] },
  { "type": "error", "name": "DSCEngine__TokenAddressMustBeValid", "inputs": [] },
  { "type": "error", "name": "DSCEngine__TransferFailed", "inputs": [] },
  { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }
] as const;