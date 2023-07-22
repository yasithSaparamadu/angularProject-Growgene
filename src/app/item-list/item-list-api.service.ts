import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl =
    "https://us-central1-yellochat-12b69.cloudfunctions.net/sampleTestData"; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getDetails(): Observable<any> {
    return this.http.get<any>(this.apiUrl); 
  }
}
