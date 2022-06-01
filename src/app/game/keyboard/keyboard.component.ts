import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css'],
})
export class KeyboardComponent {
  @Output() messageEvent = new EventEmitter<string>();
  @Input() newKeyPairs: string = '';
  ngOnChanges() {
    this.processNewKeys();
  }

  private keyboard: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['?', 'Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
  ];

  private keyboardKeys: Map<string, string> = new Map([
    ['Q', 'NG'],
    ['W', 'NG'],
    ['E', 'NG'],
    ['R', 'NG'],
    ['T', 'NG'],
    ['Y', 'NG'],
    ['U', 'NG'],
    ['I', 'NG'],
    ['O', 'NG'],
    ['P', 'NG'],
    ['A', 'NG'],
    ['S', 'NG'],
    ['D', 'NG'],
    ['F', 'NG'],
    ['G', 'NG'],
    ['H', 'NG'],
    ['J', 'NG'],
    ['K', 'NG'],
    ['L', 'NG'],
    ['Z', 'NG'],
    ['X', 'NG'],
    ['C', 'NG'],
    ['V', 'NG'],
    ['B', 'NG'],
    ['N', 'NG'],
    ['M', 'NG'],
    ['?', 'NG'],
  ]);

  sendKeyClick(message: string) {
    this.messageEvent.emit(message);
  }

  //GETTERS
  getKeyboard(): string[][] {
    return this.keyboard;
  }

  getKeyboardKeys(): Map<string, string> {
    return this.keyboardKeys;
  }

  processNewKeys(): void {
    if (typeof this.newKeyPairs == 'undefined') return;

    if (this.newKeyPairs === '-1') {
      for (let i = 0; i < 3; i++) {
        let len = this.keyboard[i].length;
        for (let j = 0; j < len; j++) {
          this.keyboardKeys.set(this.keyboard[i][j], 'NG');
        }
      }
      return;
    }

    let unprocessed = this.newKeyPairs
      .slice(0, this.newKeyPairs.length - 1)
      .split(' ');
    for (let pair of unprocessed) {
      let keyPair = pair.split(':');
      //here
      let mightRideover = this.keyboardKeys.get(keyPair[0]);

      if (mightRideover === 'C') {
        continue;
      } else if (mightRideover === 'NG') {
        this.keyboardKeys.set(keyPair[0], keyPair[1]);
      } else if (keyPair[1] !== 'NF') {
        this.keyboardKeys.set(keyPair[0], keyPair[1]);
      }
    }
  }

  giveKeyColor(keyLetter: string): string {
    return this.keyboardKeys.get(keyLetter)!;
  }
}
