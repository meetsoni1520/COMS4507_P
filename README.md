# AutoProof - Vehicle History Management System

A blockchain-based system for tracking vehicle history, ownership, and service records.

## Quick Start

1. Clone the repository:
```bash
git clone <your-repo-url>
cd autoproof
```

2. Install dependencies:
```bash
npm install
```

3. Start the Hardhat node:
```bash
npx hardhat node
```

4. In a new terminal, run the setup script:
```bash
npm run setup
```

5. Start the server:
```bash
npm start
```

6. Open the application in your browser:
```
http://localhost:3010
```

7. Follow the instructions in SETUP_GUIDE.md to:
   - Add the Hardhat network to MetaMask
   - Import the universal test account

## Universal Test Account

The project uses a single universal test account that everyone can use. This account has:
- 10,000 ETH for testing
- Full permissions to:
  - Register cars
  - Add service records
  - Transfer ownership
  - Create transactions

## Project Structure

- `contracts/`: Smart contracts
- `public/`: Frontend files
- `scripts/`: Deployment and setup scripts
- `server.js`: Backend server
- `SETUP_GUIDE.md`: Detailed setup instructions

## Available Scripts

- `npm run setup`: Deploys contracts and sets up the environment
- `npm start`: Starts the server
- `npm run compile`: Compiles smart contracts
- `npm run test`: Runs tests
- `npm run deploy`: Deploys contracts manually

## Troubleshooting

If you encounter any issues:
1. Make sure MetaMask is installed and connected to the Hardhat Local network
2. Check that the Hardhat node is running
3. Verify that the server is running
4. Check the browser console for any errors
5. Make sure you've imported the universal test account 