# Handling Account and Contract State Resets in Hardhat

## How a New User Can Set Up Accounts and Keys for This Project

Follow these steps to get started with your local blockchain, accounts, and MetaMask:

### 1. **Start the Hardhat Node**
- In your project directory, run:
  ```bash
  npx hardhat node
  ```
- This will start a local blockchain and print a list of accounts and their private keys in the terminal.

### 2. **Import an Account into MetaMask**
- Open MetaMask and select "Import Account".
- Copy one of the private keys from the Hardhat node output (e.g., `0x...`).
- Paste it into MetaMask and complete the import.
- Repeat for any additional accounts you want to use (e.g., for buyer/seller scenarios).

### 3. **Connect MetaMask to the Local Network**
- In MetaMask, click the network dropdown and select "Localhost 8545" (or add it if not present).
- Network details:
  - **Network Name:** Localhost 8545
  - **RPC URL:** http://127.0.0.1:8545
  - **Chain ID:** 31337

### 4. **Use the Correct Private Keys in Scripts**
- When running scripts (e.g., to register a car or perform a transaction), use the private key for the account you want to act as (owner, buyer, etc.).
- Example:
  ```js
  const privateKey = "<paste private key here>";
  const wallet = new ethers.Wallet(privateKey, provider);
  ```

### 5. **Deploy Contracts and Register Data**
- Deploy your contracts using the provided scripts.
- Register cars, set approvals, and perform other setup as needed.

### 6. **Update Frontend with Contract Addresses**
- After deployment, update your frontend code with the new contract addresses.
- Restart your frontend app if needed.

### 7. **Troubleshooting**
- If you see errors or missing data, make sure:
  - You are using the correct account in MetaMask.
  - The contract addresses in the frontend match the deployed addresses.
  - The Hardhat node is running and not restarted since your last deployment.

---

When you restart your Hardhat node, all blockchain state—including deployed contracts, registered cars, and account balances—will be reset. This can lead to confusion if you are using different accounts or private keys, or if you expect previously registered data to persist.

## Why Does This Happen?
- **Hardhat runs an in-memory blockchain by default.** When you stop and restart the node, all data is lost.
- **Accounts and private keys are regenerated unless you specify a mnemonic.**
- **Contract addresses and state are reset.**

## Best Practices for Account and State Persistence

### 1. **Use a Custom Mnemonic for Consistent Accounts**
- Specify a mnemonic in your `hardhat.config.js` to ensure the same accounts and private keys are generated every time you start the node.
- Example:
  ```js
  // hardhat.config.js
  module.exports = {
    networks: {
      localhost: {
        accounts: {
          mnemonic: "test test test test test test test test test test test junk"
        }
      }
    }
  };
  ```
- This way, your accounts and private keys will always be the same.

### 2. **Persist Contract Addresses**
- After each deployment, save the contract addresses to a file (e.g., `deployed_addresses.json`).
- Update your frontend to read from this file.
- If you restart the node, you must redeploy contracts and update addresses.

### 3. **Automate Account and Contract Setup**
- Create scripts to:
  - Register test cars
  - Set approvals
  - Transfer ownership
  - Fund accounts if needed
- Run these scripts after every node restart to restore your test environment.

### 4. **Keep Track of Private Keys**
- Always save the private keys for accounts you use in scripts or MetaMask.
- If you use a custom mnemonic, the private keys will be consistent.
- If you use Hardhat's default, they will change on every restart.

### 5. **Handling Frontend Errors**
- If you see errors like `call revert exception` or missing data, it usually means the contract or data does not exist after a reset.
- Register new cars and redeploy contracts as needed.

## Example Workflow After Restart
1. Start Hardhat node with a custom mnemonic.
2. Deploy contracts and save addresses.
3. Register test data (cars, users, etc.) using scripts.
4. Use the correct private keys in your scripts and MetaMask.
5. Update your frontend with new contract addresses if needed.

## Summary Table
| What Resets?         | How to Handle It                |
|----------------------|---------------------------------|
| Accounts/Keys        | Use a custom mnemonic           |
| Contract Addresses   | Redeploy and update addresses   |
| Registered Data      | Run setup scripts               |
| Private Keys         | Save and reuse, or use mnemonic |

## Useful Scripts
- `scripts/registerCar.js` — Register a new car
- `scripts/checkCarIds.js` — Check which car IDs exist
- `scripts/printAccounts.js` — Print all accounts and (if possible) private keys

## Troubleshooting
- **Error: call revert exception** — The car or contract does not exist; redeploy and register again.
- **Account not recognized** — Use the correct private key or mnemonic.
- **Frontend not showing data** — Update contract addresses and register new data.

---

**Tip:** For persistent development, consider using [Hardhat Network forking](https://hardhat.org/hardhat-network/docs/guides/mainnet-forking) or a local persistent chain like Ganache. 