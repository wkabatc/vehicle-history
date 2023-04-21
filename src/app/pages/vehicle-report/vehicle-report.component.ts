import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-vehicle-report',
  templateUrl: './vehicle-report.component.html',
  styleUrls: ['./vehicle-report.component.css']
})
export class VehicleReportComponent implements OnInit {
  vinNumbers: any;
  basicInfo: any;
  owner: any;
  policy: any;
  photosCIDs: any;
  ownersBlocks: any;
  milesBlocks: any;
  inspectsBlocks: any;
  controlsBlocks: any;
  stealingsBlocks: any;
  damagesBlocks: any;
  ownersEvents: any[] = [];
  milesEvents: any[] = [];
  inspectsEvents: any[] = [];
  controlsEvents: any[] = [];
  stealingsEvents: any[] = [];
  damagesEvents: any[] = [];
  reportForm: FormGroup;

  constructor(private blockchainService: BlockchainService) {
    //tu powinno być raczej coś prostrzego niż formgroup
    this.reportForm = new FormGroup({
      vin: new FormControl()
    });
  }

  ngOnInit(): void {
    this.blockchainService.isConnectedToMM$.subscribe(async (isConnected) => {
      console.log('is connected? ' + isConnected);
      if (isConnected === true) {
        //this.getVehiclesData();
        this.vinNumbers = await this.blockchainService.getVinNumbers();
      }
    });
  }

  async getVehiclesData(vin: string) {
    try {
      this.basicInfo = await this.blockchainService.getBasicVehicleInfo(vin);
      this.owner = await this.blockchainService.getOwnerInfo(vin);
      this.ownersBlocks = await this.blockchainService.getOwnersBlocks(vin);
      this.policy = await this.blockchainService.getPolicyInfo(vin);
      this.photosCIDs = await this.blockchainService.getPhotosHashes(vin);

      let owners: any[] = [];
      for (const bn of this.ownersBlocks) {
        owners.push(
          await this.blockchainService.getOwnersHistory(parseInt(bn))
        );
      }
      this.ownersEvents = owners;
    } catch (error) {
      console.error('Error while getting vehicles data:', error);
    }
  }

  async getMilesData(vin: string) {
    try {
      this.milesBlocks = await this.blockchainService.getMilesBlocks(vin);

      let mileages: any[] = [];
      for (const bn of this.milesBlocks) {
        mileages.push(
          await this.blockchainService.getMilesHistory(parseInt(bn))
        );
      }
      this.milesEvents = mileages;
    } catch (error) {
      console.error('Error while getting mileages data:', error);
    }
  }

  async getInspectsData(vin: string) {
    try {
      this.inspectsBlocks = await this.blockchainService.getInspectsBlocks(vin);

      let inspects: any[] = [];
      for (const bn of this.inspectsBlocks) {
        inspects.push(
          await this.blockchainService.getInspectsHistory(parseInt(bn))
        );
      }
      this.inspectsEvents = inspects;
    } catch (error) {
      console.error('Error while getting inspections data:', error);
    }
  }

  async getControlsData(vin: string) {
    try {
      this.controlsBlocks = await this.blockchainService.getControlsBlocks(vin);

      let controls: any[] = [];
      for (const bn of this.controlsBlocks) {
        controls.push(
          await this.blockchainService.getControlsHistory(parseInt(bn))
        );
      }
      this.controlsEvents = controls;
    } catch (error) {
      console.error('Error while getting controls data:', error);
    }
  }

  async getStealingsData(vin: string) {
    try {
      this.stealingsBlocks = await this.blockchainService.getStealingsBlocks(
        vin
      );

      let stealings: any[] = [];
      for (const bn of this.stealingsBlocks) {
        const steal = await this.blockchainService.getStealingsHistory(
          parseInt(bn)
        );
        const stealArr = steal.split(',');
        stealArr[2] = String(new Date(Number(stealArr[2])));
        stealings.push(stealArr.join(','));
      }
      this.stealingsEvents = stealings;
    } catch (error) {
      console.error('Error while getting stealings data:', error);
    }
  }

  async getDamagesData(vin: string) {
    try {
      this.damagesBlocks = await this.blockchainService.getDamagesBlocks(vin);

      let damages: any[] = [];
      for (const bn of this.damagesBlocks) {
        damages.push(
          await this.blockchainService.getDamagesHistory(parseInt(bn))
        );
      }
      this.damagesEvents = damages;
    } catch (error) {
      console.error('Error while getting damages data:', error);
    }
  }

  genReport() {
    const searchedVin = this.reportForm.value.vin;
    this.getVehiclesData(searchedVin);
    this.getMilesData(searchedVin);
    this.getInspectsData(searchedVin);
    this.getControlsData(searchedVin);
    this.getStealingsData(searchedVin);
    this.getDamagesData(searchedVin);
  }
}
