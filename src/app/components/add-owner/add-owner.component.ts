declare let window: any;
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent implements OnInit {
  ownerForm: FormGroup;

  constructor(private blockchainService: BlockchainService) {
    this.ownerForm = new FormGroup({
      vin: new FormControl(),
      regNum: new FormControl(),
      owner: new FormControl(),
      co_owner: new FormControl(),
      regProvince: new FormControl()
    });
  }

  ngOnInit(): void {}

  changeOwner() {
    //this.blockchainService.setOwner(this.ownerForm);
  }
}
