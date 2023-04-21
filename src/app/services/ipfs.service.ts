import { Injectable } from '@angular/core';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import { Observable, Subject } from 'rxjs';

const secret = require('environment/secrets.json');

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  private ipfsClient: any;
  private photoHashes: string[] = [];

  constructor() {
    const projectId = secret.projectId;
    const projectSecret = secret.projectSecret;

    const auth =
      'Basic ' +
      Buffer.from(projectId + ':' + projectSecret).toString('base64');

    this.ipfsClient = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth
      }
    });
  }

  async uploadFile(uploadedFiles: any) {
    if (uploadedFiles) {
      for (const f of uploadedFiles) {
        const file = await this.ipfsClient.add(f);
        const hash = file.path;
        console.log(`The file ${hash} has been uploaded to IPFS`);
        this.photoHashes.push(hash);
      }
    } else {
      console.warn('No files selected to upload!');
    }
  }

  getPhotoHashes() {
    return this.photoHashes;
  }
}
