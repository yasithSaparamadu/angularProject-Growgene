import { Component, OnInit } from "@angular/core";
import { ApiService } from "./item-list-api.service";

@Component({
  selector: "app-item-list",
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.css"],
})
export class ItemListComponent implements OnInit {
  cleanersText: string = "";
  hoursText: string = "";
  selectedImage: number | null = null;
  imageUrls: string[] = [];
  cardNumbers: string[] = [];
  imagePath1: string = "assets/1person.png";
  imagePath2: string = "assets/2people.png";
  imagePath3: string = "assets/3people.png";
  hoursData: any[] = []; // Updated data structure to hold hours for each card

  constructor(public apiService: ApiService) {}

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.apiService.getDetails().subscribe(
      (response) => {
        if (response && response.data && response.data.title) {
          this.cleanersText = response.data.title;
          this.imageUrls = response.data.items.map(
            (item: { image: any }) => item.image
          );
          this.cardNumbers = response.data.items.map(
            (item: { displayText: any }) => item.displayText
          );
          this.hoursText = response.data.itemTitle;
          this.hoursData = response.data.items.map((item: any) => item.items); // Store the hours for each card
        } else {
          console.error("Invalid API response format: title not found.");
        }
        console.log("API Response Data:", response);
      },
      (error) => {
        console.error("Error fetching text:", error);
      }
    );
  }

  selectImage(imageNumber: number) {
    this.selectedImage = imageNumber;
  }

  // Function to get the selected card's hours
   getSelectedCardHours(index: number) {
    if (this.hoursData[index - 1]) {
      const selectedCardItems = this.hoursData[index - 1];
      return selectedCardItems.map((item: any) => item.itemName);
    }
    return [];
  }
}
