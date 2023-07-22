import { Component, OnInit } from "@angular/core";
import { ApiService } from "./item-list-api.service";

@Component({
  selector: "app-item-list",
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.css"],
})
export class ItemListComponent implements OnInit {
  cleanersText: string = "";
  selectedImage: number | null = null;
  imagePath1: string = "assets/1person.png";
  imagePath2: string = "assets/2people.png";
  imagePath3: string = "assets/3people.png";

  constructor(public apiService: ApiService) {}

  ngOnInit() {
    this.getCleanersText();
  }

  getCleanersText() {
    this.apiService.getCleanersText().subscribe(
      (response) => {
        this.cleanersText = response.data.title;
      },
      (error) => {
        console.error("Error fetching text:", error);
      }
    );
  }

  selectImage(imageNumber: number) {
    this.selectedImage = imageNumber;
  }
}
