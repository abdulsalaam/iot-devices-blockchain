import getWeb3 from './utils/web3';
import TruffleContract from 'truffle-contract';
import DeviceManagerArtifact from './artifacts/DeviceManager.json';

let web3;
let DeviceManager = new Promise(function (resolve, reject) {
  getWeb3.then( async results => {
    web3 = results.web3;

    const deviceManager = TruffleContract(DeviceManagerArtifact);
    deviceManager.setProvider(web3.currentProvider);

   /* return deviceManager.deployed().then(instance => {
      console.log('Initiating DeviceManager instance...');
      resolve(instance);
    }).catch(error => {
      reject(error);
    });*/
	
	// Get the contract instance.
      const networkId = await web3.eth.net.getId();
	  console.log('networkId:',networkId);
      const deployedNetwork = DeviceManagerArtifact.networks[networkId];
	   console.log('deployedNetwork:',deployedNetwork);
      const instance = new web3.eth.Contract(
        DeviceManagerArtifact.abi,
        deployedNetwork && deployedNetwork.address,
      );
	  resolve(instance);
	
  }).catch(error => {
    reject(error);
  });
});

export async function getDefaultAccount() {
 const accounts = await web3.eth.getAccounts();
 console.log('default address:',accounts[0])
  return accounts[0];
}

export default DeviceManager;