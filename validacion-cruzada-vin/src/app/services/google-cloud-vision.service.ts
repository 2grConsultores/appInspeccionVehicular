import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleCloudVisionService {

  constructor(public http: HttpClient) { }
  getLabels(base64Image: any, feature: any) {
    const body = {
      requests: [
        {
          features: [
            {
              type: feature,
              maxResults: 10
            }
          ],
          image: {
            content: base64Image
          }
        }
      ]
    };
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + environment.googleCloudVisionAPIKey, body);
  }
}
