const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'daughter enable choose rent warrior lottery marine monkey cash grab trend robot',
  'https://rinkeby.infura.io/v3/44c521d6a98d42dc8ebbc5f04b3f760a'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
console.log(interface);
  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '6000000', from: accounts[0] });
  console.log(interface);
  console.log('Contract deployed to', result.options.address);
};
deploy();
