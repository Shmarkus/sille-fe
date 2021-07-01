import { Component } from '@angular/core';
import {IdentifyService} from './services/api/backend-client';
import {Event} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fileToUpload: any;
  originalFile?: File;
  results: Array<string> = [];
  searching = false;
  threshold = 0.899;

  constructor(private identifyService: IdentifyService) {
  }

  handleFileInput(event: any): void {
    // @ts-ignore
    const files = event?.target?.files;
    const fileReader = new FileReader();
    this.results = [];
    const item = files.item(0);
    if (item !== null && item !== undefined) {
      this.originalFile = item;
      if (this.originalFile !== undefined) {
        fileReader.onloadend = e => (this.fileToUpload = fileReader.result);
        fileReader.readAsDataURL(this.originalFile);
      }
    }
  }

  search(): void {
    this.searching = true;
    if (this.fileToUpload) {
      this.identifyService.findFace(this.threshold, { image: this.fileToUpload}).toPromise().then(paths => {
        console.log(paths);
        if (paths.images != null && paths.images.length > 0) {
          this.results = paths.images;
        }
        this.searching = false;
      }).catch(e => {
        console.error(e);
        this.searching = false;
      });
    } else {
      this.searching = false;
      this.results = [];
    }
  }
  changeThreshold(event: any): void {
    this.threshold = event.target.value;
  }

}
