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
}
