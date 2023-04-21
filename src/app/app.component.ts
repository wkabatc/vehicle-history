import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // public mmConnected$ = this.blockchainService.isConnectedToMM$;

  constructor(private blockchainService: BlockchainService) {}

  ngOnInit(): void {
    this.blockchainService.connectToMetamask();
  }
}
