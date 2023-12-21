// Функция определения приоритета оператора
function priority(operation) {
    // Если оператор + или -, возвращаем приоритет 1, иначе 2
    if (operation === '+' || operation === '-') {
        return 1;
    } else {
        return 2;
    }
}

// Функция проверки, является ли строка числом
function isNumeric(str) {
    // Проверяем, соответствует ли строка паттерну числа с десятичной частью
    return /^\d+(\.\d+){0,1}$/.test(str);
}

// Функция проверки, является ли строка одной цифрой
function isDigit(str) {
    // Проверяем, соответствует ли строка паттерну одной цифры
    return /^\d{1}$/.test(str);
}

// Функция проверки, является ли строка оператором
function isOperation(str) {
    // Проверяем, соответствует ли строка паттерну оператора (+, -, *, /)
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция разделения строки с выражением на токены (числа, операторы, скобки)
function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    // Итерируем по символам в строке
    for (char of str) {
        // Если символ - цифра или точка, добавляем его к числу
        if (isDigit(char) || char === '.') {
            lastNumber += char;
        } else {
            // Если символ не цифра или точка, добавляем число к токенам и сбрасываем lastNumber
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        // Если символ - оператор или скобка, добавляем его к токенам
        if (isOperation(char) || char === '(' || char === ')') {
            tokens.push(char);
        } 
    }
    // Добавляем последнее число (если оно есть) к токенам
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция компиляции выражения в обратную польскую нотацию (ОПН)
function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        // Если токен - число, добавляем его к выходной строке
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            // Если токен - оператор, перемещаем операторы с более высоким приоритетом в выходную строку
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token === '(') {
            // Если токен - открывающая скобка, добавляем ее в стек
            stack.push(token);
        } else if (token === ')') {
            // Если токен - закрывающая скобка, перемещаем операторы из стека в выходную строку до открывающей скобки
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                out.push(stack.pop());
            }
            stack.pop(); // Удаляем открывающую скобку из стека
        }
    }
    // Перемещаем оставшиеся операторы из стека в выходную строку
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция вычисления значения выражения в ОПН
function evaluate(str) {
    let stack = [];
    const tokens = str.split(' ');

    for (const token of tokens) {
        // Если токен - число, добавляем его в стек
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else if (isOperation(token)) {
            // Если токен - оператор, выполняем операцию над последними двумя числами из стека
            const operand2 = stack.pop();
            const operand1 = stack.pop();
            let result = 0;

            switch (token) {
                case '+':
                    result = operand1 + operand2;
                    break;
                case '-':
                    result = operand1 - operand2;
                    break;
                case '*':
                    result = operand1 * operand2;
                    break;
                case '/':
                    result = operand1 / operand2;
                    break;
                default:
                    break;
            }

            stack.push(result); // Добавляем результат обратно в стек
        }
    }

    return stack.pop().toFixed(2); // Возвращает результат вычисления с округлением до двух знаков после запятой
}

// Обработчик события клика по кнопкам калькулятора
function clickHandler(event) {
    const screen = document.querySelector('.screen');

    if (event.target.classList.contains('digit') || event.target.classList.contains('operation') || event.target.classList.contains('bracket')) {
        // Если нажата кнопка с цифрой, оператором или скобкой, добавляем ее текст на экран
        screen.textContent += event.target.textContent;
    } else if (event.target.classList.contains('clear')) {
        // Если нажата кнопка "Clear", очищаем экран
        screen.textContent = '';
    } else if (event.target.classList.contains('result')) {
        // Если нажата кнопка "=", вычисляем результат выражения
        const expression = screen.textContent.trim();
        const rpnExpression = compile(expression);
        const result = evaluate(rpnExpression);
        screen.textContent = result;
    }
}

window.onload = function () {
    // Добавление обработчика события клика на всё окно документа
    document.addEventListener('click', clickHandler);
};
