import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-police',
  templateUrl: './police.component.html',
  styleUrls: ['./police.component.css']
})
export class PoliceComponent implements OnInit {
  @ViewChild('regControlForm') regControlForm!: NgForm;
  @ViewChild('repStealingForm') repStealingForm!: NgForm;
  // regMileageForm: FormGroup;
  regControlFormGroup: FormGroup;
  repStealingFormGroup: FormGroup;
  vinOptions1: string[] = [];
  vinOptions2: string[] = [];
  filteredVins1!: Observable<string[]>;
  filteredVins2!: Observable<string[]>;
  vin1 = new FormControl('');
  vin2 = new FormControl('');

  constructor(private blockchainService: BlockchainService) {
    // this.regMileageForm = new FormGroup({
    //   //odesparować to jako komponent, bo jest to wspolne dla inspector i police
    //   vin: new FormControl(),
    //   mileage: new FormControl()
    // });
    this.regControlFormGroup = new FormGroup({
      vin: this.vin1,
      regCertStatus: new FormControl(),
      mileage: new FormControl()
    });
    this.repStealingFormGroup = new FormGroup({
      vin: this.vin2,
      place: new FormControl(),
      date: new FormControl(),
      description: new FormControl()
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

  // regMileage() {
  //   this.blockchainService.regMileage(this.regMileageForm);
  // }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((value) => value.toLowerCase().includes(filterValue));
  }

  async regControl() {
    await this.blockchainService.regControl(this.regControlFormGroup.value);
    this.regControlFormGroup.reset();
    this.regControlForm.resetForm();
  }

  async reportStealing() {
    await this.blockchainService.reportStealing(
      this.repStealingFormGroup.value
    );
    this.repStealingFormGroup.reset();
    this.repStealingForm.resetForm();
  }
}
