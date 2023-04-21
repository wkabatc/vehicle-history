declare let window: any;
import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { FormGroup, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import addresses from 'environment/contract-address.json';
import Vehicles from 'blockchain/artifacts/blockchain/contracts/Vehicles.sol/Vehicles.json';
import Owners from 'blockchain/artifacts/blockchain/contracts/Owners.sol/Owners.json';
import Mileages from 'blockchain/artifacts/blockchain/contracts/Mileages.sol/Mileages.json';
import Inspections from 'blockchain/artifacts/blockchain/contracts/Inspections.sol/Inspections.json';
import Controls from 'blockchain/artifacts/blockchain/contracts/Controls.sol/Controls.json';
import Stealings from 'blockchain/artifacts/blockchain/contracts/Stealings.sol/Stealings.json';
import Policies from 'blockchain/artifacts/blockchain/contracts/Policies.sol/Policies.json';
import Damages from 'blockchain/artifacts/blockchain/contracts/Damages.sol/Damages.json';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private provider: any;
  public signer: any;
  private vehiclesContract: any;
  private ownersContract: any;
  private mileagesContract: any;
  private inspectContract: any;
  private controlsContract: any;
  private stealingsContract: any;
  private policiesContract: any;
  private damagesContract: any;
  private isConnectedSubj = new BehaviorSubject<boolean>(false);
  public isConnectedToMM$ = this.isConnectedSubj.asObservable();

  constructor() {}

  async connectToMetamask() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        //await window.ethereum.enable();
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.provider = new ethers.providers.Web3Provider(
          window.ethereum,
          'any'
        );

        this.provider.on('network', (newNetwork: any, oldNetwork: any) => {
          if (oldNetwork) {
            window.location.reload();
          }
        });

        this.signer = this.provider.getSigner();

        this.signer.getChainId().then((chainId: Number) => {
          if (chainId !== 43113) {
            alert(
              'Please Change your network to avalanche testnet! FROM SERVICE'
            );
          } else {
            //odseparować trowrzenie kontraktów do nowej funkcji
            this.vehiclesContract = new ethers.Contract(
              addresses.vehiclesContract,
              Vehicles.abi,
              this.signer
            );
            this.ownersContract = new ethers.Contract(
              addresses.ownersContract,
              Owners.abi,
              this.signer
            );
            this.mileagesContract = new ethers.Contract(
              addresses.mileagesContract,
              Mileages.abi,
              this.signer
            );
            this.inspectContract = new ethers.Contract(
              addresses.inspectionsContract,
              Inspections.abi,
              this.signer
            );
            this.controlsContract = new ethers.Contract(
              addresses.controlsContract,
              Controls.abi,
              this.signer
            );
            this.stealingsContract = new ethers.Contract(
              addresses.stealingsContract,
              Stealings.abi,
              this.signer
            );
            this.policiesContract = new ethers.Contract(
              addresses.policiesContract,
              Policies.abi,
              this.signer
            );
            this.damagesContract = new ethers.Contract(
              addresses.damagesContract,
              Damages.abi,
              this.signer
            );

            this.isConnectedSubj.next(true);

            console.log('MetaMask connected...');
          }
        });
      } catch (error) {
        console.error('Error connecting to MetaMask: ', error);
      }
    } else {
      console.error(
        'MetaMask is not available. Refresh the page after logging to MetaMask.'
      );
    }
  }

  async addVehicle(formValue: any) {
    console.log(formValue);

    let coOwner = formValue.co_owner;

    if (coOwner === null) {
      coOwner = '';
    }

    const tx = await this.vehiclesContract.addVehicle(
      formValue.vin,
      [formValue.brand, formValue.model],
      [formValue.regNum, formValue.owner, coOwner, formValue.regProvince],
      addresses.ownersContract
    );
    console.log(tx);
    await tx.wait();

    // window.location.reload(); jak bedzie na oddzielnej stronie raport, to moze nie warto odswiezac tutaj
  }

  async setOwner(formValue: any) {
    console.log(formValue);

    let coOwner = formValue.co_owner;

    if (coOwner === null) {
      coOwner = '';
    }

    const tx = await this.ownersContract.setOwnerInfo(
      formValue.vin,
      formValue.regNum,
      formValue.owner,
      coOwner,
      formValue.regProvince,
      addresses.vehiclesContract
    );
    console.log(tx);
    await tx.wait();

    //window.location.reload();
  }

  async regMileage(formValue: any) {
    //const formValue = form.value;

    console.log(formValue);
    console.log(addresses.vehiclesContract);

    const tx = await this.mileagesContract.regMileage(
      formValue.vin,
      formValue.mileage,
      addresses.vehiclesContract
    );
    console.log(tx);
    await tx.wait();

    //form.reset();
    //window.location.reload();
  }

  async regInspection(formValue: any) {
    console.log(formValue);
    console.log(addresses.inspectionsContract);

    const tx = await this.inspectContract.regInspection(
      formValue.vin,
      formValue.result,
      formValue.mileage,
      addresses.vehiclesContract,
      addresses.mileagesContract
    );
    console.log(tx);
    await tx.wait();

    //form.reset();
  }

  async regControl(formValue: any) {
    console.log(formValue);
    console.log(addresses.controlsContract);

    const tx = await this.controlsContract.regControl(
      formValue.vin,
      formValue.regCertStatus,
      formValue.mileage,
      addresses.vehiclesContract,
      addresses.mileagesContract
    );
    console.log(tx);
    await tx.wait();
  }

  async reportStealing(formValue: any) {
    console.log(formValue);
    console.log(addresses.stealingsContract);

    console.log(Date.parse(formValue.date));

    const tx = await this.stealingsContract.reportStealing(
      formValue.vin,
      formValue.place,
      Date.parse(formValue.date),
      formValue.description,
      addresses.vehiclesContract
    );
    console.log(tx);
    await tx.wait();
  }

  async enterPolicy(formValue: any) {
    console.log(formValue);
    console.log(addresses.policiesContract);

    const tx = await this.policiesContract.enterPolicy(
      formValue.vin,
      formValue.policyNum,
      formValue.oc,
      formValue.ac,
      formValue.nnw,
      formValue.assistance,
      Date.parse(formValue.validFrom),
      Date.parse(formValue.validTo),
      addresses.vehiclesContract
    );
    console.log(tx);
    await tx.wait();
  }

  async regDamage(formValue: any, photosHashes: String[]) {
    console.log(formValue);
    console.log(addresses.damagesContract);
    console.warn('Hashe do transakcji:');
    console.warn(photosHashes);

    const tx = await this.damagesContract.regDamage(
      formValue.vin,
      Date.parse(formValue.date),
      formValue.place,
      formValue.description,
      formValue.damageVal,
      formValue.mileage,
      photosHashes,
      addresses.vehiclesContract,
      addresses.mileagesContract
    );
    console.log(tx);
    await tx.wait();
  }

  async getVinNumbers() {
    return await this.vehiclesContract.getVinNumbers();
  }

  async getBasicVehicleInfo(vin: string) {
    return await this.vehiclesContract.getBasicVehicleInfo(vin);
  }

  async getOwnerInfo(vin: string) {
    return await this.ownersContract.getOwnerInfo(vin);
  }

  async getPolicyInfo(vin: string) {
    return await this.policiesContract.getPolicyInfo(vin);
  }

  async getPhotosHashes(vin: string) {
    return await this.damagesContract.getPhotosHashes(vin);
  }

  async getOwnersBlocks(vin: string) {
    return await this.ownersContract.getBlocksNums(vin);
  }

  async getOwnersHistory(blockNum: number) {
    const events = await this.ownersContract.queryFilter(
      'OwnerChanged',
      blockNum,
      blockNum
    );

    const blockData = await this.provider.getBlock(events[0].blockNumber);
    const date = new Date(blockData.timestamp * 1000);

    return `${events[0].args} ${date}`;
  }

  async getMilesBlocks(vin: string) {
    return await this.mileagesContract.getBlocksNums(vin);
  }

  async getMilesHistory(blockNum: number) {
    const events = await this.mileagesContract.queryFilter(
      'MileageChanged',
      blockNum,
      blockNum
    );

    const blockData = await this.provider.getBlock(events[0].blockNumber);
    const date = new Date(blockData.timestamp * 1000);

    return `${events[0].args} ${date}`;
  }

  async getInspectsBlocks(vin: string) {
    return await this.inspectContract.getBlocksNums(vin);
  }

  async getInspectsHistory(blockNum: number) {
    const events = await this.inspectContract.queryFilter(
      'InspectionDone',
      blockNum,
      blockNum
    );

    const blockData = await this.provider.getBlock(events[0].blockNumber);
    const date = new Date(blockData.timestamp * 1000);

    return `${events[0].args} ${date}`;
  }

  async getControlsBlocks(vin: string) {
    return await this.controlsContract.getBlocksNums(vin);
  }

  async getControlsHistory(blockNum: number) {
    const events = await this.controlsContract.queryFilter(
      'ControlDone',
      blockNum,
      blockNum
    );

    const blockData = await this.provider.getBlock(events[0].blockNumber);
    const date = new Date(blockData.timestamp * 1000);

    return `${events[0].args} ${date}`;
  }

  async getStealingsBlocks(vin: string) {
    return await this.stealingsContract.getBlocksNums(vin);
  }

  async getStealingsHistory(blockNum: number) {
    const events = await this.stealingsContract.queryFilter(
      'StealingReported',
      blockNum,
      blockNum
    );

    const blockData = await this.provider.getBlock(events[0].blockNumber);
    const date = new Date(blockData.timestamp * 1000);

    return `${events[0].args} ${date}`;
  }

  async getDamagesBlocks(vin: string) {
    return await this.damagesContract.getBlocksNums(vin);
  }

  async getDamagesHistory(blockNum: number) {
    const events = await this.damagesContract.queryFilter(
      'DamageRegistered',
      blockNum,
      blockNum
    );

    const blockData = await this.provider.getBlock(events[0].blockNumber);
    const date = new Date(blockData.timestamp * 1000);

    return `${events[0].args} ${date}`;
  }
}
