import { Component } from '@angular/core';
import {IdentifyService, Result} from './services/api/backend-client';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer} from "@angular/platform-browser";
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  face?: string = '';
  originalFile?: File;
  results: Array<Result> = [];
  searching = false;
  threshold = 0.899;

  constructor(
    private identifyService: IdentifyService,
    private toastr: ToastrService,
    private domSanitizer: DomSanitizer
  ) { }

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
            .then((result) => {
              this.face = 'data:image/png;base64,' + result
            })
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
    this.results = [];
    this.searching = true;
    if (this.face) {
      this.identifyService.findSimilar(this.threshold, { image: this.face, path: environment.path}).toPromise().then(paths => {
        if (paths.images != null && paths.images.length > 0) {
          paths.images.map(value => {
            if (value.createdDate !== undefined) {
              value.createdDate = Math.floor(value.createdDate) * 1000;
            }
            this.results.push(value);
          });
        }
        this.results.sort((a, b) => {
          if ((a.threshold !== undefined && b.threshold !== undefined) && a.threshold >= b.threshold) {
            return 1;
          } else {
            return -1;
          }
        })
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

  clear(): void {
    this.results = [];
    this.originalFile = undefined;
    this.face = undefined;
  }

  changeThreshold(event: any): void {
    this.threshold = event.target.value;
  }

  getSafeUrl(url: string | undefined): any {
    if (url == undefined) {
      return ""
    }
    return  this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  changeStatus(file: Result, event: any): void {
    file.selected = event.target.checked;
    console.log(file.selected);
  }

  printSelectedPaths(): void {
    console.log(this.results.filter(r => r.selected === true).map(r => `cp ${r.path} $DEST`).join("\n"));
  }
}
