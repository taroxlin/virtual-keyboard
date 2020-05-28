
class Keyboard {
  constructor(keyboardObj, langsArray) {
    this.obj = keyboardObj;
    this.langArr = langsArray;
    this.highlightClass = 'actived';
    this.options = {
      basic: true,
      shift: false,
      caps: false,
      shiftcaps: false,
    };
    this.text = {
      sym: '⬇',
      place: 0,
      value: '',
    };
    this.mouseClicked = [];
    this.initKeyboard();
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      if (!e.repeat) {
        if (e.ctrlKey && e.key === 'l') {
          this.keyFunc('changeLang');
          this.animationClass(e.code);
        } else {
          this.clickHandlerPress(e.code);
        }
      }
    });
    document.addEventListener('keyup', (e) => this.clickHandlerRelase(e.code));
    document.addEventListener('mouseup', () => this.clickHandlerRelase(this.mouseClicked.pop()));
  }

  animationClass(code) {
    const selector = document.getElementsByClassName(code)[0].classList;
    if (Object.values(selector).indexOf(this.highlightClass) > -1) {
      selector.remove(this.highlightClass);
    } else {
      selector.add(this.highlightClass);
    }
  }

  convertCode(code) {
    const selector = document.getElementsByClassName(code)[0];
    let char = Object.keys(this.options);
    for (let i = 0; i < char.length; i += 1) {
      if (this.options[char[i]]) {
        char = char[i];
        break;
      }
    }
    char = selector.getElementsByClassName(char)[0].innerText;
    return char;
  }

  changeView(str) {
    const elements = document.getElementsByClassName(str);
    this.options[str] = !this.options[str];
    for (let i = 0; elements.length > i; i += 1) {
      elements[i].hidden = !elements[i].hidden;
    }
  }

  updateTextArea(char) {
    const area = document.getElementsByTagName('textarea')[0];
    const textArr = this.text.value.split('');
    const newValue = [].concat(textArr.slice(0, this.text.place), char, this.text.sym, textArr.slice(this.text.place, textArr.length)).join('');
    this.text.value = newValue.replace(this.text.sym, '');
    area.value = newValue;
  }

  keyFunc(code) {
    switch (code) {
      case 'ShiftLeft':
      case 'ShiftRight': {
        if (this.options.basic || this.options.shift) {
          this.changeView('basic');
          this.changeView('shift');
        } else if (this.options.caps || this.options.shiftcaps) {
          this.changeView('caps');
          this.changeView('shiftcaps');
        }
        break;
      }
      case 'Enter': {
        this.updateTextArea('\n');
        this.text.place += 1;
        break;
      }
      case 'CapsLock': {
        if (this.options.basic || this.options.caps) {
          this.changeView('basic');
          this.changeView('caps');
        } else if (this.options.shift || this.options.shiftcaps) {
          this.changeView('shift');
          this.changeView('shiftcaps');
        }
        break;
      }
      case 'Backspace': {
        if (this.text.place > 0) {
          this.text.value = this.text.value.slice(0, this.text.place - 1)
        + this.text.value.slice(this.text.place);
          this.text.place -= 1;
        }
        this.updateTextArea();
        break;
      }
      case 'Space': {
        this.updateTextArea(' ');
        this.text.place += 1;
        break;
      }
      case 'ArrowLeft': {
        this.text.place = this.text.place ? this.text.place - 1 : 0;
        this.updateTextArea();
        break;
      }
      case 'ArrowRight': {
        this.text.place = this.text.place === this.text.value.length
          ? this.text.value.length
          : this.text.place + 1;
        this.updateTextArea();
        break;
      }
      case 'changeLang': {
        let langNum = this.langArr.indexOf(localStorage.getItem('SetLang'));
        if (langNum === this.langArr.length - 1) {
          langNum = 0;
        } else {
          langNum += 1;
        }
        localStorage.setItem('SetLang', this.langArr[langNum]);
        document.getElementsByClassName('langCont')[0]
          .innerText = `Click CTRL + l to switch lang (Refresh page to make it work!)\n Active: ${this.langArr[langNum]}`;
        break;
      }
      case 'Delete': {
        this.text.value = this.text.value.slice(0, this.text.place)
        + this.text.value.slice(this.text.place + 1);
        this.updateTextArea();
        break;
      }
      case 'Tab': {
        this.text.place += 2;
        this.updateTextArea('\t');
        break;
      }
      case 'ArrowUp': {
        const placing = this.text.value.slice(0, this.text.place).split('\n');
        if (placing.length > 1) {
          const prevLine = this.text.value.slice(0, this.text.place).lastIndexOf('\n');
          const num = placing.length;
          let lineDiff = placing[num - 2].length - placing[num - 1].length;
          lineDiff = lineDiff < 0 ? 0 : lineDiff;
          this.text.place = prevLine - lineDiff;
        }
        this.updateTextArea();
        break;
      }
      case 'ArrowDown': {
        const placing = this.text.value.slice(this.text.place).split('\n');
        if (placing.length > 1) {
          const controlSum = this.text.value.slice(0, this.text.place).lastIndexOf('\n') + 1;
          let lineDiff = this.text.place - controlSum;
          lineDiff = lineDiff > placing[1].length ? placing[1].length : lineDiff;
          this.text.place += placing[0].length + 1 + lineDiff;
        }
        this.updateTextArea();
        break;
      }
      case 'ControlLeft':
      case 'ControlRight':
      case 'MetaLeft':
      case 'AltLeft':
      case 'AltRight': {
        break;
      }
      default: {
        this.updateTextArea(this.convertCode(code));
        this.text.place += 1;
      }
    }
  }

  clickHandlerPress(code) {
    if (document.getElementsByClassName(code)[0] !== undefined) {
      this.animationClass(code);
      this.keyFunc(code);
    }
  }

  clickHandlerRelase(code) {
    if (
      document.getElementsByClassName(code)[0] !== undefined
      && code !== 'CapsLock'
    ) {
      this.animationClass(code);
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        this.keyFunc(code);
      }
    }
  }

  initKeyboard() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.classList.add('keyboard-board');
    for (let i = 0; Object.keys(this.obj).length > i; i += 1) {
      this.initKeyboardRow(Object.values(this.obj)[i], i);
    }
  }

  initKeyboardRow(objectArr, num) {
    const element = document.createElement('div');
    document.getElementsByClassName('keyboard-board')[0].appendChild(element);
    element.classList.add('keyboard-row');
    for (let i = 0; objectArr.length > i; i += 1) {
      this.initKeyboardElement(objectArr[i], element, num, i);
    }
  }

  initKeyboardElement(obj, parent, num, numRow) {
    const element = document.createElement('div');
    parent.append(element);
    element.classList.add('KeyButton', `${obj.code}`);
    if (!Object.prototype.hasOwnProperty.call(obj, 'alternative')) {
      this.obj[num][numRow].alternative = obj.basic;
    }
    const InnerEleString = `<span class = 'basic'>${obj.basic}</span>
    <span class = 'shift' hidden>${obj.alternative}</span>
    <span class = 'caps' hidden> ${
  obj.code.slice(0, obj.code.length - 1) === 'Key'
    ? obj.alternative
    : obj.basic
}</span>
    <span class = 'shiftcaps' hidden>${
  obj.code.slice(0, obj.code.length - 1) === 'Key'
    ? obj.basic
    : obj.alternative
}</span>`;
    element.innerHTML = InnerEleString;
    element.addEventListener('mousedown', () => {
      this.mouseClicked.push(obj.code);
      this.clickHandlerPress(obj.code);
    });
  }
}

export default Keyboard;
