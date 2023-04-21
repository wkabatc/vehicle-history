import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-vehicle-inspector',
  templateUrl: './vehicle-inspector.component.html',
  styleUrls: ['./vehicle-inspector.component.css']
})
export class VehicleInspectorComponent implements OnInit {
  @ViewChild('regMileageForm') regMileageForm!: NgForm;
  @ViewChild('regInspectForm') regInspectForm!: NgForm;
  regMileageFormGroup: FormGroup;
  regInspectFormGroup: FormGroup;
  vinOptions1: string[] = [];
  vinOptions2: string[] = [];
  filteredVins1!: Observable<string[]>;
  filteredVins2!: Observable<string[]>;
  vin1 = new FormControl('');
  vin2 = new FormControl('');

  public mmConnected$ = this.blockchainService.isConnectedToMM$;

  constructor(private blockchainService: BlockchainService) {
    this.regMileageFormGroup = new FormGroup({
      //zobaczyc czy jakos inaczej mozna ogarnac te formularze, jakos prosciej
      vin: this.vin1,
      mileage: new FormControl()
    });
    this.regInspectFormGroup = new FormGroup({
      vin: this.vin2,
      result: new FormControl(),
      mileage: new FormControl()
    });
  }

  ngOnInit(): void {
    this.mmConnected$.subscribe(async (isConnected) => {
      console.log('is connected? ' + isConnected);
      if (isConnected === true) {
        const vins = await this.blockchainService.getVinNumbers();
        this.vinOptions1 = vins;
        this.vinOptions2 = vins;
        // this.selected = this.vinOptions[0];
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

  async regMileage() {
    await this.blockchainService.regMileage(this.regMileageFormGroup.value);
    this.regMileageFormGroup.reset();
    this.regMileageForm.resetForm();
  }

  async regInspection() {
    await this.blockchainService.regInspection(this.regInspectFormGroup.value);
    this.regInspectFormGroup.reset();
    this.regInspectForm.resetForm();
  }
}
