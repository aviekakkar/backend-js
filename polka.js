const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider('wss://rpc.polkadot.io');

async function main() {

  const api = await ApiPromise.create({ provider });

//Get chain name
  const chain = await api.rpc.system.chain();
//Get latest block header
  const lastHeader = await api.rpc.chain.getHeader();

//check for arguments
let args = process.argv.slice(2);
let max = args.length===0 ? 0 : Number(args[0]);
if (max === 0) {
  console.log("Displaying block information till manually exited");
} else {
  console.log(`Displaying block information for the next ${max} blocks`);
}

  let count = 0;
  // Subscribe to the new headers
  const unsubHeads = await api.rpc.chain.subscribeNewHeads((lastHeader) => {
    console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);

    if (++count === max) {
      unsubHeads();
      process.exit();
    }
  });

}


main();
