// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');
const { getConfigPath } = require('./private/_helpers');
const { getIbcApp } = require('./private/_vibc-helpers.js');

async function main() {
    const accounts = await hre.ethers.getSigners();
    const config = require(getConfigPath());
    const sendConfig = config.sendPacket;

    const networkName = hre.network.name;
    // Get the contract type from the config and get the contract
    const ibcApp = await getIbcApp(networkName);

    // Do logic to prepare the packet
    const channelId = sendConfig[`${networkName}`]["channelId"];
    const channelIdBytes = hre.ethers.encodeBytes32String(channelId);
    const timeoutSeconds = sendConfig[`${networkName}`]["timeout"];
    


    // await ibcApp.connect(accounts[0]).randomMint(
    //   accounts[0].address
    // );
    // await ibcApp.connect(accounts[0]).funMint();
    // data = 
    // // console.log(await ibcApp.connect(accounts[0]).p_mintInterval());
    // console.log(await ibcApp.connect(accounts[0]).setMintInterval(120n));
    // // console.log(await ibcApp.connect(accounts[0]).p_mintInterval());

    // console.log(await ibcApp.connect(accounts[0])._lastFunMint(accounts[0]));
    // console.log(await ibcApp.connect(accounts[0]).devMintTo("100000000000000000000000000000", "0x7BF1d902687d2cEC827105Db478123aB26E97B23"));
    console.log(await ibcApp.connect(accounts[0]).devMintTo("100000000000000000000000000000", "0xe7A4e35c1db4Ff3b65bfBd8599E4caC2A4e941F2"));

    console.log(await ibcApp.connect(accounts[0])._canFunMint(accounts[0]));
    console.log(await ibcApp.connect(accounts[0]).funMint());
    // 0xAA597BBD271778ae560FF20979d8Ed6C27E3D0D8
    // console.log(await ibcApp.connect(accounts[0])._lastFunMint(accounts[0]));
    // console.log(await ibcApp.connect(accounts[0])._currentTimeStamp(accounts[0]));
    // console.log(await ibcApp.connect(accounts[0])._canFunMint(accounts[0]));


    // console.log(await ibcApp.connect(accounts[0]).));
    // Send the packet
    // await ibcApp.connect(accounts[0]).sendPacket(
    //     channelIdBytes,
    //     timeoutSeconds,
    //     // Define and pass optionalArgs appropriately or remove if not needed    
    //     );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});