const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts','main.sol');
const source = fs.readFileSync(inboxPath,'utf8');
// console.log(inboxPath);
// console.log(solc.compile(source, 1));
// console.log(solc.compile(source, 1).contracts[':UserAccount']);
console.log(solc.compile(source, 1).contracts[':FolderTree']);
// module.exports = solc.compile(source, 1).contracts[':BlockStore'];
