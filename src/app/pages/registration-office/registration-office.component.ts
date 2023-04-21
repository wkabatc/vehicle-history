import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-registration-office',
  templateUrl: './registration-office.component.html',
  styleUrls: ['./registration-office.component.css']
})
export class RegistrationOfficeComponent implements OnInit {
  @ViewChild('addVehForm') addVehForm!: NgForm;
  @ViewChild('ownerForm') ownerForm!: NgForm;
  addVehFormGroup: FormGroup;
  ownerFormGroup: FormGroup;
  vinOptions: string[] = [];
  // selected: string = '';
  filteredVins!: Observable<string[]>;
  vin = new FormControl('');

  public mmConnected$ = this.blockchainService.isConnectedToMM$;

  constructor(private blockchainService: BlockchainService) {
    this.ownerFormGroup = new FormGroup({
      vin: this.vin,
      regNum: new FormControl(),
      owner: new FormControl(),
      co_owner: new FormControl(),
      regProvince: new FormControl()
    });
    this.addVehFormGroup = new FormGroup({
      vin: new FormControl(),
      brand: new FormControl(),
      model: new FormControl(),
      regNum: new FormControl(),
      owner: new FormControl(),
      co_owner: new FormControl(),
      regProvince: new FormControl()
    });
  }

  ngOnInit(): void {
    this.mmConnected$.subscribe(async (isConnected) => {
      console.log('is connected? ' + isConnected);
      if (isConnected === true) {
        this.vinOptions = await this.blockchainService.getVinNumbers();
        // this.selected = this.vinOptions[0];
      }
    });
    this.filteredVins = this.vin.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptionr(<string>value || '', this.vinOptions))
    );
  }

  private filterOptionr(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((value) => value.toLowerCase().includes(filterValue));
  }

  async addVehicle() {
    await this.blockchainService.addVehicle(this.addVehFormGroup.value);
    this.addVehFormGroup.reset();
    this.addVehForm.resetForm();
  }

  async changeOwner() {
    await this.blockchainService.setOwner(this.ownerFormGroup.value);
    this.ownerFormGroup.reset();
    this.ownerForm.resetForm();
  }
}
