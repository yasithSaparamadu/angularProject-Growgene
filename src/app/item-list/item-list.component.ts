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
  selectedCardDetails: string | null = null;
  hoursData: any[] = [];
  unitOfMeasure: string[] = [];
  subTitle: string[] = [];
  selectedHourCardIndex: number | null = null;
  selectedHourCardUnitPrice: number | null = null;

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
          this.hoursData = response.data.items
            .map((item: any) => item.items)
            .map((items: any[]) => items.sort((a, b) => a.sort - b.sort)); // Store the hours for each card
          this.unitOfMeasure = response.data.items
            .map((item: any) =>
              item.items.map((hour: any) => hour.unitOfMeasure)
            )
            .flat();
          this.subTitle = this.getAllSubTitle(response.data.items);
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

  // Function to fetch all unitOfMeasure values
  getAllUnitOfMeasures(items: any[]): string[] {
    const unitOfMeasures: string[] = [];
    items.forEach((item) => {
      item.items.forEach((subItem: any) => {
        unitOfMeasures.push(subItem.unitOfMeasure);
      });
    });
    return unitOfMeasures;
  }

  // Function to fetch all substitles values
  getAllSubTitle(items: any[]): string[] {
    const subTitle: string[] = [];
    items.forEach((item) => {
      item.items.forEach((subItem: any) => {
        subTitle.push(subItem.subTitle);
      });
    });
    return subTitle;
  }

  selectImage(imageNumber: number) {
    if (this.selectedImage === imageNumber) {
      // Clicking on the same image card again, unselect it
      this.selectedImage = null;
      this.selectedHourCardIndex = null;
      this.selectedHourCardUnitPrice = null;
    } else {
      // Clicking on a different image card, select it and reset the hour card
      this.selectedImage = imageNumber;
      this.selectedCardDetails = `${this.cardNumbers[this.selectedImage - 1]} Cleaner,`;
      this.selectedHourCardIndex = null;
      this.selectedHourCardUnitPrice = 0;
    }
  }

  // Function to get the selected card's hours
  getSelectedCardHours(index: number): {
    hour: string;
    unitPrice: number;
    minutes: number;
    unitOfMeasure: string;
    subTitle: string;
  }[] {
    if (this.hoursData && this.hoursData[index - 1]) {
      const selectedCardItems = this.hoursData[index - 1];
      return selectedCardItems.map((items: any) => {
        return {
          hour: items.itemName,
          unitPrice: items.unitPrice,
          minutes: items.minutes,
          unitOfMeasure: items.unitOfMeasure,
          subTitle: items.subTitle,
        };
      });
    }
    return [];
  }

  getHourlyPrice(unitPrice: number, minutes: number): number {
    const hours = minutes / 60;
    return +(unitPrice / hours).toFixed(2);
  }

  selectHourCard(
    unitPrice: number,
    displayText: string,
    itemName: string,
    index: number
  ) {
    this.selectedHourCardUnitPrice = unitPrice;
    this.selectedImage = +displayText; // Convert displayText from string to number
    this.selectedHourCardIndex = index;
    this.selectedCardDetails = `${displayText} Cleaner, ${itemName}`;
  }

  selectedHourCard(index: number) {
    this.selectedHourCardIndex = index;
  }
}
