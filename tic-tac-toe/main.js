'use strict';

let flag = true;
let isWinner = false;
let field = document.querySelector('.field');
let btn = document.querySelector('.new_game');

function fillField() {
  for (let i = 0; i < 9; i++) {
    let div = document.createElement('div');
    div.className = 'field-items';
    field.append(div);
  }
}

function handlerField(event) {
  let target = event.target;
  if (isWinner) {
    createMessage(`Игра окончена. Для начала новой нажмите кнопку Новая игра`, 'error');
    return;
  }
  if (target.textContent !== '') {
    return;
  }
  target.textContent = flag ? 'X' : 'O';
  flag = !flag;
    horizCheck();
    verticalCheck();
    diagonalCheck();
    diagonal2Check();

}

function horizCheck() {
  let items = field.querySelectorAll('.field-items');
  for (let i = 0; i < 3; i++) {
    let count = 0;
    for (let j = 0; j < 2; j++) {
      if (items[i * 3 + j].textContent === '') {
        break;
      }
      if (items[i * 3 + j].textContent === items[i * 3 + j + 1].textContent) {
        count++;
      }
    }
    if (count == 2) {
        isWinner = true;
        createMessage(`Победил ${!flag ? 'X' : 'O'}`, 'success');
    }
  }
}
function diagonalCheck() {
  let items = field.querySelectorAll('.field-items');

  if (
    items[0].textContent === items[4].textContent &&
    items[4].textContent === items[8].textContent &&
    items[0].textContent !== ''
  ) {
    isWinner = true;
    createMessage(`Победил ${!flag ? 'X' : 'O'}`, 'success');
  }
}

function diagonal2Check() {
  let items = field.querySelectorAll('.field-items');

  if (
    items[2].textContent === items[4].textContent &&
    items[4].textContent === items[6].textContent &&
    items[4].textContent !== ''
  ) {
    isWinner = true;
    createMessage(`Победил ${!flag ? 'X' : 'O'}`, 'success');
  }
}

function verticalCheck() {
  let items = field.querySelectorAll('.field-items');
  if (
    (items[0].textContent === items[3].textContent &&
      items[3].textContent === items[6].textContent &&
      items[0].textContent !== '') ||
    (items[1].textContent === items[4].textContent &&
      items[4].textContent === items[7].textContent &&
      items[1].textContent !== '') ||
    (items[2].textContent === items[5].textContent &&
      items[5].textContent === items[8].textContent &&
      items[2].textContent !== '')
  ) {
    isWinner = true;
    createMessage(`Победил ${!flag ? 'X' : 'O'}`, 'success');
  }
}

function clean() {
  let items = field.querySelectorAll('.field-items');
  for (let i = 0; i < items.length; i++) {
    items[i].textContent = '';
  }
  isWinner = false;
  flag = true;
}

function createMessage(textMessage, type) {
    const message = document.querySelector('.message');
    message.textContent = textMessage;
    message.classList.add(type);
    message.classList.toggle('hidden');
    setTimeout(()=>{
        message.classList.toggle('hidden');
        message.classList.toggle(type);
    },1000)

}

field.addEventListener('click', handlerField);
btn.addEventListener('click', clean);

fillField();