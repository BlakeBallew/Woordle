import { Component, HostListener } from '@angular/core';
var wordpool = require('../wordpool.json');
var validwords = require('../validwords.json');

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  //general game data
  private wordLength: number = 5;
  private id: number = 0;
  private current: number = 0;
  private guessed: number = 0;
  private emphasized: number = -1;
  private board: number[][] = this.generateBoard();
  private gameData: string[] = this.generateGameData(this.wordLength * 6);
  private keys: string[] = this.generateKeys();
  private done: boolean = true;
  private gameOver: boolean = false;
  private restartCooldown: boolean = false;
  private word: string = this.generateWord();
  private toDisplay: string[] = this.generateGameData(this.wordLength);
  private displayEmphasis: number = -1;
  private enterKeyDisabled: boolean = false;
  private secretGameMode: boolean = false;
  private unsentKeys!: string;
  private newKeyboardKeys!: string;

  //GETTERS
  getWordLength(): number {
    return this.wordLength;
  }

  getEmphasized(): number {
    return this.emphasized;
  }

  getDisplayEmphasized(): number {
    return this.displayEmphasis;
  }

  getBoard(): number[][] {
    return this.board;
  }

  getGameData(): string[] {
    return this.gameData;
  }

  getCooldownStatus(): boolean {
    return this.restartCooldown;
  }

  getDisplay(): string[] {
    return this.toDisplay;
  }

  getSecretStatus(): boolean {
    return this.secretGameMode;
  }

  getKeyboardKeys(): string {
    return this.newKeyboardKeys;
  }

  //functions associated with game changes
  receiveDifficultyChange($event: any) {
    this.wordLength = $event;
    this.gameReset();
  }

  receiveKeyClick($event: any) {
    this.handleEvent($event);
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.handleEvent(event.key);
  }

  //handles events such as backspace, enter, letter entry
  handleEvent(key: string): void {
    if (
      key === 'Backspace' &&
      this.current > this.guessed &&
      !this.enterKeyDisabled
    ) {
      this.gameData[this.current - 1] = '';
      this.keys[this.current - 1] = 'NG';
      this.current -= 1;
    }

    if (
      key === 'Enter' &&
      this.current - this.wordLength === this.guessed &&
      this.done &&
      !this.enterKeyDisabled
    ) {
      let data = this.gameData.slice(
        this.current - this.wordLength,
        this.current
      );

      if (this.checkValidEntry(data)) {
        let processed = this.processGuess(data);
        this.emphasized = this.guessed;
        this.keys[this.emphasized] = processed[0];
        this.guessed = this.current;
        this.displayCorrect(processed);
      } else {
        this.handleInvalidEntry();
      }
    }
    if (
      key.toUpperCase() !== key.toLowerCase() &&
      key.length === 1 &&
      !this.gameOver &&
      (this.current % this.wordLength !== 0 ||
        this.current === this.guessed ||
        this.current === 0)
    ) {
      this.gameData[this.current] = key.toUpperCase();
      this.keys[this.current] = 'NF';
      this.current += 1;
    }

    if (key === '?') {
      this.secretGameMode = !this.secretGameMode;
    }
  }

  checkValidEntry(guess: string[]): boolean {
    let len = this.wordLength.toString();
    let toCheck = guess.join('').toString().toLowerCase();
    return validwords[len].includes(toCheck);
  }

  //functions for generating items for the game
  generateWord(): string {
    let rand = Math.floor(Math.random() * (500 + 1)).toString();
    let len = this.wordLength.toString();

    return wordpool[len][rand].toUpperCase();
  }

  generateBoard(): number[][] {
    let counter: number = 0;
    let output: number[][] = [];
    for (let i = 0; i < 6; i++) {
      let sublist: number[] = [];
      for (let j = 0; j < this.wordLength; j++) {
        sublist.push(counter);
        counter += 1;
      }
      output.push(sublist);
    }
    return output;
  }

  generateGameData(N: number): string[] {
    let output: string[] = [];
    for (let i = 0; i < N; i++) {
      output.push('');
    }
    return output;
  }

  generateKeys(): string[] {
    let output: string[] = [];
    let N: number = this.wordLength * 6;
    for (let i = 0; i < N; i++) {
      output.push('NG');
    }
    return output;
  }

  //functions responsible for displaying data
  giveColor(id: number): string {
    if (typeof this.keys[id] === 'undefined') {
      if (id < this.current) {
        return 'NF';
      }
      return 'NG';
    }
    return this.keys[id];
  }

  displayCorrect(newGameData: string[]): void {
    this.handleBtnCooldown();
    this.done = false;
    let limit = this.guessed;
    let i = 1;
    let uniqueGuessInfo = new Set(newGameData);
    const limitedInterval = setInterval(() => {
      this.emphasized += 1;
      this.keys[this.emphasized] = newGameData[i];
      i += 1;
      if (this.emphasized >= limit) {
        this.newKeyboardKeys = this.unsentKeys;
        clearInterval(limitedInterval);
        this.done = true;
        this.emphasized = -1;
        if (uniqueGuessInfo.size === 1 && uniqueGuessInfo.has('C')) {
          this.handleGameOver(true);
        } else if (this.guessed === 6 * this.wordLength) {
          this.handleGameOver(false);
        }
      }
    }, 350);
  }

  handleDisplayData(): void {
    let i = 0;
    const limitedInterval = setInterval(() => {
      this.displayEmphasis += 1;
      i += 1;
      if (this.displayEmphasis >= this.toDisplay.length) {
        clearInterval(limitedInterval);
      }
    }, 250);
  }

  handleBtnCooldown(): void {
    this.restartCooldown = true;
    setInterval(() => {
      this.restartCooldown = false;
    }, 7000);
  }

  handleInvalidEntry(): void {
    this.enterKeyDisabled = true;
    let lowerBound = this.current - this.wordLength;
    let upperBound = this.current;
    let flashes = 0;
    const limitedInterval = setInterval(() => {
      this.colorBoardRed(lowerBound, upperBound);
      flashes += 1;
      if (flashes > 3) {
        clearInterval(limitedInterval);
        setTimeout(() => {
          this.enterKeyDisabled = false;
        }, 500);
      }
    }, 130);
  }

  colorBoardRed(lowerBound: number, upperBound: number): void {
    let i = lowerBound;
    while (i < upperBound) {
      if (this.keys[i] !== 'invalid') {
        this.keys[i] = 'invalid';
      } else {
        this.keys[i] = 'NF';
      }

      i += 1;
    }
  }

  //processes user guess and returns the correct coloring of spaces
  processGuess(guess: string[]): string[] {
    let wordAsArray = this.word.split('');
    let K = this.wordLength;
    let output: string[] = this.generateGameData(K);
    let trackKeys: string = '';

    const countOccurrences = (arr: any, val: any) =>
      arr.reduce((a: any, v: any) => (v === val ? a + 1 : a), 0);
    let mapping = new Map();

    for (let i = 0; i < this.wordLength; i++) {
      mapping.set(guess[i], countOccurrences(wordAsArray, guess[i]));
    }

    for (let i = 0; i < K; i++) {
      let current = guess[i];
      if (current === wordAsArray[i]) {
        output[i] = 'C';
        mapping.set(current, mapping.get(current) - 1);
        trackKeys += guess[i] + ':' + output[i] + ' ';
      }
    }
    for (let i = 0; i < K; i++) {
      let current = guess[i];
      if (
        wordAsArray.includes(current) &&
        mapping.get(current) > 0 &&
        output[i] === ''
      ) {
        output[i] = 'WP';
        mapping.set(current, mapping.get(current) - 1);
        trackKeys += guess[i] + ':' + output[i] + ' ';
      }
    }

    for (let i = 0; i < K; i++) {
      if (output[i] === '') {
        output[i] = 'NF';
        trackKeys += guess[i] + ':' + output[i] + ' ';
      }
    }

    this.unsentKeys = trackKeys;
    return output;
  }

  //functions that are called when game ends
  handleGameOver(userWonGame: boolean): void {
    this.gameOver = true;
    if (userWonGame) {
      this.toDisplay = ['W', 'I', 'N', 'N', 'E', 'R', '!'];
    } else {
      this.toDisplay = this.word.split('');
    }
    setTimeout(() => {
      this.handleDisplayData();
    }, 400);
  }

  gameReset(): void {
    this.gameOver = false;
    this.id = 0;
    this.current = 0;
    this.guessed = 0;
    this.displayEmphasis = -1;
    this.board = this.generateBoard();
    this.gameData = this.generateGameData(this.wordLength * 6);
    this.keys = this.generateKeys();
    this.word = this.generateWord();
    this.toDisplay = this.generateGameData(this.wordLength);
    this.newKeyboardKeys = '-1';
  }

  callSecretMode(): void {
    this.wordLength = 15;
    this.gameReset();
    this.secretGameMode = false;
  }
}
