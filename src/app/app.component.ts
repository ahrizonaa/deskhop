import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: string[] = [];
  allTags: string[] = [];
  isloading: boolean = false;

  backgroundImage: string = '';

  constructor(private toast: MatSnackBar) {}

  async setWallpaper() {
    this.isloading = true;
    let result = await (window as any).electronAPI.setWallpaper(this.allTags);
    console.log(result);
    if (result.success) {
      this.backgroundImage = `url(${result.unsplash.regular})`;
    } else {
      this.toast.open('Error setting wallpaper', 'Dismiss', { duration: 2000 });
    }
    this.isloading = false;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.allTags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(index: number): void {
    this.allTags.splice(index, 1);
  }
}
