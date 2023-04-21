declare let window: any;
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {
  addVehForm: FormGroup;
  signerAddress: string = '';

  regMileageForm: FormGroup;

  constructor(private blockchainService: BlockchainService) {
    this.addVehForm = new FormGroup({
      vin: new FormControl(),
      brand: new FormControl(),
      model: new FormControl(),
      regNum: new FormControl(),
      owner: new FormControl(),
      co_owner: new FormControl(),
      regProvince: new FormControl()
    });
    this.regMileageForm = new FormGroup({
      //zobaczyc czy jakos inaczej mozna ogarnac te formularze, jakos prosciel
      vin: new FormControl(),
      mileage: new FormControl()
    });
  }

  ngOnInit(): void {
    // if (this.blockchainService.connectedToMM === true) {
    //   this.blockchainService.signer.getAddress().then((address: string) => {
    //     console.log(address);
    //     this.signerAddress = address;
    //   });
    // } else {
    //   setTimeout(() => {
    //     this.blockchainService.signer.getAddress().then((address: string) => {
    //       console.log(address);
    //       this.signerAddress = address;
    //     });
    //   }, 100);
    // }
    this.blockchainService.signer.getAddress().then((address: string) => {
      this.signerAddress = address;
    });
  }

  addVehicle() {
    //this.blockchainService.addVehicle(this.addVehForm);
  }
}
