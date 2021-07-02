import { Component } from '@angular/core';
import {IdentifyService} from './services/api/backend-client';
import {ToastrService} from 'ngx-toastr';

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

  constructor(private identifyService: IdentifyService, private toastr: ToastrService) {
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
        fileReader.onloadend = e => {
          // @ts-ignore
          this.identifyService.detectFace({image: fileReader.result}).toPromise()
            .then(() => (this.fileToUpload = fileReader.result))
            .catch(err => {
              if (err.code === 404) {
                this.toastr.warning('No faces found in uploaded photo. Please try another!', 'No faces', {positionClass: 'toast-bottom-full-width'});
              }
            });
        };
        fileReader.readAsDataURL(this.originalFile);
      }
    }
  }

  search(): void {
    this.searching = true;
    if (this.fileToUpload) {
      this.identifyService.findSimilar(this.threshold, { image: this.fileToUpload}).toPromise().then(paths => {
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
