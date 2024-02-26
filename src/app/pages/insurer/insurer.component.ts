import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { IpfsService } from 'src/app/services/ipfs.service';

@Component({
  selector: 'app-insurer',
  templateUrl: './insurer.component.html',
  styleUrls: ['./insurer.component.css']
})
export class InsurerComponent implements OnInit {
  @ViewChild('enterPolicyForm') enterPolicyForm!: NgForm;
  @ViewChild('enterDamageForm') enterDamageForm!: NgForm;
  enterPolicyFormGroup: FormGroup;
  enterDamageFormGroup: FormGroup;
  vinOptions1: string[] = [];
  vinOptions2: string[] = [];
  filteredVins1!: Observable<string[]>;
  filteredVins2!: Observable<string[]>;
  vin1 = new FormControl('');
  vin2 = new FormControl('');

  isChecked = true;
  selectedFiles: any;

  constructor(
    private blockchainService: BlockchainService,
    private ipfsService: IpfsService
  ) {
    this.enterPolicyFormGroup = new FormGroup({
      vin: this.vin1,
      policyNum: new FormControl(),
      oc: new FormControl(true),
      ac: new FormControl(),
      nnw: new FormControl(),
      assistance: new FormControl(),
      validFrom: new FormControl(),
      validTo: new FormControl()
    });
    this.enterDamageFormGroup = new FormGroup({
      vin: this.vin2,
      date: new FormControl(),
      place: new FormControl(),
      description: new FormControl(),
      damageVal: new FormControl(),
      mileage: new FormControl(),
      photos: new FormControl()
    });
  }

  ngOnInit(): void {
    this.blockchainService.isConnectedToMM$.subscribe(async (isConnected) => {
      console.log('is connected? ' + isConnected);
      if (isConnected === true) {
        const vins = await this.blockchainService.getVinNumbers();
        this.vinOptions1 = vins;
        this.vinOptions2 = vins;
      }
    });
    this.filteredVins1 = this.vin1.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(<string>value || '', this.vinOptions1))
    );
    this.filteredVins2 = this.vin2.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(<string>value || '', this.vinOptions2))
    );
  }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((value) => value.toLowerCase().includes(filterValue));
  }

  async enterPolicy() {
    await this.blockchainService.enterPolicy(this.enterPolicyFormGroup.value);
    this.enterPolicyForm.resetForm();
    this.enterPolicyFormGroup.reset({ oc: true });
  }

  async enterDamage() {
    await this.ipfsService.uploadFile(this.selectedFiles);

    const photosHashes = this.ipfsService.getPhotoHashes();
    await this.blockchainService.regDamage(
      this.enterDamageFormGroup.value,
      photosHashes
    );

    this.enterDamageForm.resetForm();
    this.enterDamageFormGroup.reset();
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = event.target.files;
      for (const f of this.selectedFiles) {
        console.log(f);
      }
    } else {
      this.selectedFiles = null;
    }
    console.log(this.selectedFiles);
  }
}
