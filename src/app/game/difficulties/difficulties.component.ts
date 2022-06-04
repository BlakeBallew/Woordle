import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-difficulties',
  templateUrl: './difficulties.component.html',
  styleUrls: ['./difficulties.component.css'],
})
export class DifficultiesComponent {
  @Output() messageEvent = new EventEmitter<number>();
  @Input() wordLength: number = 5;
  private disabled: number = 1;

  sendDifficultyChange(message: number, id: number) {
    this.disabled = id;
    this.messageEvent.emit(message);
  }

  isDisabled(id: number): boolean {
    if (id === this.disabled && this.wordLength < 15) {
      return true;
    }

    return false;
  }

  filterInput(message: number, id: number): void {
    const width = window.innerWidth;
    if (width < 410 && message >= 7) {
      alert('Please use a larger screen to play this mode');
    } else if (width < 550 && message >= 9) {
      alert('Please use a larger screen to play this mode');
    } else if (width < 780 && message == 11) {
      alert('Please use a larger screen to play this mode');
    } else {
      this.sendDifficultyChange(message, id);
    }
  }
}
