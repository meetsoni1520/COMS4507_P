# Account Setup and Troubleshooting Guide

## Initial Setup Issues

### 1. Contract Ownership Issue
**Problem:** Initially encountered "Ownable: caller is not the owner" error when trying to register cars and perform owner-restricted operations.

**Root Cause:** 
- The contracts were owned by the default Hardhat account (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`)
- MetaMask was using a different account (`0x70997970C51812dc3A010C7d01b50e0d17dc79C8`)

**Solution:**
1. Created and executed a script to transfer ownership from the default Hardhat account to the MetaMask account
2. Used the correct private key of the current owner to perform the transfer
3. Verified ownership transfer using a check script

### 2. MetaMask Connection Issues
**Problem:** MetaMask throwing Internal JSON-RPC errors during transaction processing.

**Troubleshooting Steps:**
1. Verify network connection:
   - Connect to Localhost 8545 (Hardhat Network)
   - Network ID should be 31337

2. Reset MetaMask account if needed:
   - Settings → Advanced → Reset Account
   - This clears transaction history and nonce

3. Ensure correct account selection:
   - Use account `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
   - This account now has owner permissions

## Important Account Information

### Default Hardhat Account (Original Owner)
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### MetaMask Account (New Owner)
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

## Contract Addresses
- CarNFT: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- OwnershipTransfer: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- TransactionManager: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

## Best Practices for Account Management

1. **Network Reset:**
   - Always restart the Hardhat node when encountering persistent issues
   - Clear MetaMask state for the local network when needed

2. **Transaction Verification:**
   - Check contract ownership before performing restricted operations
   - Verify you're using the correct account in MetaMask

3. **Security Considerations:**
   - Keep private keys secure and never share them
   - Use different accounts for development and production
   - Reset MetaMask account when switching between different local blockchain instances

## Useful Scripts

1. **Check Contract Owners:**
   ```bash
   npx hardhat run scripts/checkOwners.js --network localhost
   ```

2. **Transfer Ownership:**
   ```bash
   npx hardhat run scripts/transferOwnership.js --network localhost
   ```

## Common Error Messages and Solutions

1. **"Ownable: caller is not the owner"**
   - Verify current contract owner using checkOwners script
   - Ensure you're using the correct account in MetaMask
   - Transfer ownership if needed

2. **"Internal JSON-RPC error"**
   - Reset MetaMask account for the network
   - Restart Hardhat node
   - Reconnect MetaMask to the local network

3. **Transaction Failures**
   - Check gas settings in MetaMask
   - Verify account has sufficient ETH
   - Ensure correct nonce by resetting account if needed

4. **Service Recording Error**
   **Problem:** Error when trying to record a service with message: "function selector was not recognized and there's no fallback function"

   **Root Cause:**
   - The transaction is being sent to an incorrect contract address
   - The function signature might not match the contract's ABI
   - The contract might not be properly deployed or initialized

   **Solution:**
   1. Verify the contract address in your frontend code matches the deployed address:
      - ServiceManager contract should be at: `0x5FC8d32690cc91D4c39d9d3abcBD16989F875707`
   2. Check the function signature in your frontend code:
      - Ensure it matches the contract's ABI
      - Verify all required parameters are being passed correctly
   3. Steps to fix:
      - Restart the Hardhat node
      - Redeploy the contracts if needed
      - Clear MetaMask transaction history
      - Verify the contract's ABI in your frontend code

   **Example Error:**
   ```
   Error: cannot estimate gas; transaction may fail or may require manual gas limit
   Error: Transaction reverted: function selector was not recognized and there's no fallback function
   ```

   **Additional Checks:**
   - Ensure the ServiceManager contract is properly deployed
   - Verify the contract's bytecode matches the deployed version
   - Check if the contract has the required functions implemented
   - Make sure you're using the correct account with proper permissions 