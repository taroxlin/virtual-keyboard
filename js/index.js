import Keyboard from './keyboard.js';
import keyLang from './langs.js';

const globalLang = localStorage.getItem('SetLang') === null
  ? Object.keys(keyLang)[0]
  : localStorage.getItem('SetLang');


class MainContainer {
  constructor() {
    this.parent = document.getElementsByTagName('body');
    this.child = [];
    this.lang = globalLang;
  }

  initTextArea() {
    const text = document.createElement('textarea');
    text.disabled = true;
    this.parent[0].appendChild(text);
    text.classList.add('textarea-style');
  }

  initLangDesc() {
    const langCont = document.createElement('div');
    this.parent[0].appendChild(langCont);
    langCont.classList.add('langCont');
    langCont.innerText = `Click CTRL + l to switch lang (Refresh page to make it work!)\nActive: ${this.lang}`;
  }

  initKeyboard() {
    const keyboardBoard = new Keyboard(keyLang[this.lang], Object.keys(keyLang));
    this.child.push(keyboardBoard);
  }

  init() {
    this.initTextArea();
    this.initLangDesc();
    this.initKeyboard();
  }
}

const board = new MainContainer();
board.init();
