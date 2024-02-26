import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-vehicle-report',
  templateUrl: './vehicle-report.component.html',
  styleUrls: ['./vehicle-report.component.css']
})
export class VehicleReportComponent implements OnInit {
  basicInfo: any;
  owner: any;
  policy: any;
  photosCIDs: string[] = [];
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
  allEvents: any[] = [];
  groupedEvents: any[] = [];

  mileages: number[] = [];
  milesRegDate: Date[] = [];

  reportForm: FormGroup;
  vinOptions: string[] = [];
  filteredVins!: Observable<string[]>;
  vin = new FormControl('');

  constructor(private blockchainService: BlockchainService) {
    //tu powinno być raczej coś prostrzego niż formgroup
    this.reportForm = new FormGroup({
      vin: this.vin
    });
  }

  ngOnInit(): void {
    this.blockchainService.isConnectedToMM$.subscribe(async (isConnected) => {
      console.log('is connected? ' + isConnected);
      if (isConnected === true) {
        this.vinOptions = await this.blockchainService.getVinNumbers();
      }
    });
    this.filteredVins = this.vin.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(<string>value || '', this.vinOptions))
    );
  }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((value) => value.toLowerCase().includes(filterValue));
  }

  private orderVehicleData() {
    console.log('GRUPOWANIE...');
    this.allEvents = [];
    this.mileages = [];

    for (const oe of this.ownersEvents) {
      const oeSplitted = oe.split(',');
      let owners = `${oeSplitted[2]}, ${oeSplitted[3]}`;
      if (owners.trim().endsWith(',')) {
        owners = owners.slice(0, -2);
      }

      this.allEvents.push({
        type: 'OE',
        date: new Date(oeSplitted[5] * 1000),
        info: `Numer rejestracyjny: ${oeSplitted[1]}
        Właściciel(e): ${owners}
        Województwo: ${oeSplitted[4]}`
        // regNum: oeSplitted[1],
        // owner: oeSplitted[2],
        // co_owner: oeSplitted[3],
        // regProvince: oeSplitted[4]
      });
    }
    for (const me of this.milesEvents) {
      const meSplitted = me.split(',');
      this.mileages.push(parseInt(meSplitted[1]));
      this.milesRegDate.push(new Date(meSplitted[2] * 1000));

      this.allEvents.push({
        type: 'ME',
        date: new Date(meSplitted[2] * 1000),
        info: `Przebieg: ${meSplitted[1]}`
        //mileage: parseInt(meSplitted[1])
      });
    }
    for (const ie of this.inspectsEvents) {
      const ieSplitted = ie.split(',');
      let inspectResult = 'pozytywny';
      if (ieSplitted[1] === 'N') {
        inspectResult = 'negatywny';
      }
      this.allEvents.push({
        type: 'IE',
        date: new Date(ieSplitted[2] * 1000),
        info: `Wynik badania: ${inspectResult}`
        // result: ieSplitted[1]
      });
    }
    for (const ce of this.controlsEvents) {
      const ceSplitted = ce.split(',');
      let regStatus = 'ważny';
      if (ceSplitted[1] === 'I') {
        regStatus = 'zatrzymany';
      }
      this.allEvents.push({
        type: 'CE',
        date: new Date(ceSplitted[2] * 1000),
        info: `Status dowodu rej.: ${regStatus}`
        // regCertStatus: ceSplitted[1]
      });
    }
    for (const se of this.stealingsEvents) {
      const seSplitted = se.split(',');
      const dateOfSteal = new Date(Number(seSplitted[2]));

      this.allEvents.push({
        type: 'SE',
        date: new Date(seSplitted[4] * 1000),
        info: `Miejsce: ${seSplitted[1]}
        Data: ${dateOfSteal.toLocaleDateString('pl-PL')}, ${dateOfSteal
          .toLocaleTimeString('pl-PL')
          .slice(0, -3)}
        Opis: ${seSplitted[3]}`,
        // place: seSplitted[1],
        dateOfSteal: new Date(Number(seSplitted[2]))
        // description: seSplitted[3]
      });
    }
    for (const de of this.damagesEvents) {
      console.log(de);

      const deSplitted = de.split(',');
      const dateOfDamage = new Date(Number(deSplitted[1]));

      this.allEvents.push({
        type: 'DE',
        date: new Date(deSplitted[deSplitted.length - 1] * 1000),
        info: `Miejsce: ${deSplitted[2]}
        Data: ${dateOfDamage.toLocaleDateString('pl-PL')}, ${dateOfDamage
          .toLocaleTimeString('pl-PL')
          .slice(0, -3)}
        Przebieg: ${deSplitted[4]}
        Wartość szkody: ${deSplitted[5]} PLN`,
        dateOfDamage: new Date(Number(deSplitted[1]))
        // place: deSplitted[2],
        // description: deSplitted[3],
        // mileage: parseInt(deSplitted[4]),
        // damageVal: deSplitted[5]
      });
    }
  }

  groupObjectsByYear(objects: any[]) {
    const groups = new Map<number, any[]>();

    objects.forEach((obj) => {
      let year;
      if (obj.dateOfDamage) {
        year = new Date(obj.dateOfDamage).getFullYear();
      } else if (obj.dateOfSteal) {
        year = new Date(obj.dateOfSteal).getFullYear();
      } else {
        year = new Date(obj.date).getFullYear();
      }

      if (!groups.has(year)) {
        groups.set(year, []);
      }
      groups.get(year)?.push(obj);
    });

    const sortedKeys = Array.from(groups.keys()).sort((a, b) => b - a);

    this.groupedEvents = sortedKeys.map((key) => ({
      year: key,
      items: groups
        .get(key)
        ?.sort((a, b) => a.date.getTime() - b.date.getTime())
        .reverse()
    }));
  }

  async getVehBasicData(vin: string) {
    try {
      //zobaczyc w orderData czy tak samo nie dalo sie odwoływac w szablonie jak np do basicInfo
      this.basicInfo = await this.blockchainService.getBasicVehicleInfo(vin);
      // console.log('basicInfo');
      // console.log(this.basicInfo);
      this.owner = await this.blockchainService.getOwnerInfo(vin);
      // console.log('owner');
      // console.log(this.owner);
      this.ownersBlocks = await this.blockchainService.getOwnersBlocks(vin);
      this.policy = await this.blockchainService.getPolicyInfo(vin);
      console.log('policy');
      console.log(this.policy);
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

      let miles: any[] = [];
      for (const bn of this.milesBlocks) {
        miles.push(await this.blockchainService.getMilesHistory(parseInt(bn)));
      }
      this.milesEvents = miles;
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
        // const steal = await this.blockchainService.getStealingsHistory(
        //   parseInt(bn)
        // );
        // const stealArr = steal.split(',');
        // stealArr[2] = String(new Date(Number(stealArr[2])));
        // stealings.push(stealArr.join(','));
        stealings.push(
          await this.blockchainService.getStealingsHistory(parseInt(bn))
        );
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

  async genReport() {
    const searchedVin = this.reportForm.value.vin;
    await this.getVehBasicData(searchedVin);
    await this.getMilesData(searchedVin);
    await this.getInspectsData(searchedVin);
    await this.getControlsData(searchedVin);
    await this.getStealingsData(searchedVin);
    await this.getDamagesData(searchedVin);
    this.orderVehicleData();
    this.groupObjectsByYear(this.allEvents);
    this.photosCIDs = await this.blockchainService.getPhotosHashes(searchedVin);
    console.log('Liczba zgrupowanych eventów:');
    console.log(this.groupedEvents.length);
    console.log('Przebiegi:');
    console.log(this.mileages);
    console.log(this.photosCIDs);
  }
}
