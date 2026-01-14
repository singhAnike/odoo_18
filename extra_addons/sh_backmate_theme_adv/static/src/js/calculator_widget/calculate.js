/* eslint-disable no-eval */
/* eslint-disable no-eval */

document.addEventListener('DOMContentLoaded', function () {
  
  var displayBox = document.getElementById('display');
  
  // If calculator display doesn't exist on this page, don't initialize
  if (!displayBox) {
    return;
  }
  
  var hasEvaluated = false;

  // CHECK IF 0 IS PRESENT. IF IT IS, OVERRIDE IT, ELSE APPEND VALUE TO DISPLAY
  function clickNumbers(val) {
    console.log("values",val);
    
    if (displayBox.innerHTML === '0' || (hasEvaluated === true && !isNaN(displayBox.innerHTML))) {
      displayBox.innerHTML = val;
    } else {
      displayBox.innerHTML += val;
    }
    hasEvaluated = false;
  }

  // PLUS MINUS
  const plusMinusBtn = document.getElementById('plus_minus');
  if (plusMinusBtn) {
    plusMinusBtn.addEventListener('click', function () {
      if (eval(displayBox.innerHTML) > 0) {
        displayBox.innerHTML = '-' + displayBox.innerHTML;
      } else {
        displayBox.innerHTML = displayBox.innerHTML.replace('-', '');
      }
    });
  }

  // ON CLICK ON NUMBERS
  document.getElementById('clear').addEventListener('click', function () {
    displayBox.innerHTML = '0';
    // Reset button states
    var buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
      button.disabled = false;
    });
  });

  // Number buttons (1-9 and 0)
  document.getElementById('one').addEventListener('click', function () {
    console.log("one clicked");
    
    checkLength(displayBox.innerHTML);
    console.log("after length check");
    
    clickNumbers(1);
    console.log("after click numbers");
    
  });
  document.getElementById('two').addEventListener('click', function () {
    checkLength(displayBox.innerHTML);
    clickNumbers(2);
  });
  document.getElementById('three').addEventListener('click', function () {
    checkLength(displayBox.innerHTML);
    clickNumbers(3);
  });
  document.getElementById('four').addEventListener('click', function () {
    checkLength(displayBox.innerHTML);
    clickNumbers(4);
  });
  document.getElementById('five').addEventListener('click', function () {
    checkLength(displayBox.innerHTML);
    clickNumbers(5);
  });
  document.getElementById('six').addEventListener('click', function () {
    checkLength(displayBox.innerHTML);
    clickNumbers(6);
  });
  document.getElementById('seven').addEventListener('click', function () {
    checkLength(displayBox.innerHTML);
    clickNumbers(7);
  });
  document.getElementById('eight').addEventListener('click', function () {
    checkLength(displayBox.innerHTML);
    clickNumbers(8);
  });
  document.getElementById('nine').addEventListener('click', function () {
    checkLength(displayBox.innerHTML);
    clickNumbers(9);
  });
  document.getElementById('zero').addEventListener('click', function () {
    checkLength(displayBox.innerHTML);
    clickNumbers(0);
  });

  // Decimal button
  document.getElementById('decimal').addEventListener('click', function () {
    if (displayBox.innerHTML.indexOf('.') === -1 ||
      (displayBox.innerHTML.indexOf('.') !== -1 && displayBox.innerHTML.indexOf('+') !== -1) ||
      (displayBox.innerHTML.indexOf('.') !== -1 && displayBox.innerHTML.indexOf('-') !== -1) ||
      (displayBox.innerHTML.indexOf('.') !== -1 && displayBox.innerHTML.indexOf('×') !== -1) ||
      (displayBox.innerHTML.indexOf('.') !== -1 && displayBox.innerHTML.indexOf('÷') !== -1)) {
      clickNumbers('.');
    }
  });

  // OPERATORS
  document.getElementById('add').addEventListener('click', function () {
    evaluate();
    checkLength(displayBox.innerHTML);
    displayBox.innerHTML += '+';
  });
  document.getElementById('subtract').addEventListener('click', function () {
    evaluate();
    checkLength(displayBox.innerHTML);
    displayBox.innerHTML += '-';
  });
  document.getElementById('multiply').addEventListener('click', function () {
    evaluate();
    checkLength(displayBox.innerHTML);
    displayBox.innerHTML += '×';
  });
  document.getElementById('divide').addEventListener('click', function () {
    evaluate();
    checkLength(displayBox.innerHTML);
    displayBox.innerHTML += '÷';
  });

  // SQUARE ROOT and SQUARE
  document.getElementById('square').addEventListener('click', function () {
    var num = Number(displayBox.innerHTML);
    num = num * num;
    checkLength(num);
    displayBox.innerHTML = num;
  });

  document.getElementById('sqrt').addEventListener('click', function () {
    var num = parseFloat(displayBox.innerHTML);
    num = Math.sqrt(num);
    displayBox.innerHTML = Number(num.toFixed(5));
  });

  // Equals button
  document.getElementById('equals').addEventListener('click', function () {
    evaluate();
    hasEvaluated = true;
  });

  // EVAL FUNCTION
  function evaluate() {
    displayBox.innerHTML = displayBox.innerHTML.replace(',', '');
    displayBox.innerHTML = displayBox.innerHTML.replace('×', '*');
    displayBox.innerHTML = displayBox.innerHTML.replace('÷', '/');
    if (displayBox.innerHTML.indexOf('/0') !== -1) {
      displayBox.style.fontSize = '70px';
      displayBox.style.marginTop = '124px';
      var buttons = document.querySelectorAll('button');
      buttons.forEach(function(button) {
        button.disabled = false;
      });
      document.querySelector('.clear').disabled = false;
      displayBox.innerHTML = 'Division by 0 is undefined!';
    }
    var evaluate = eval(displayBox.innerHTML);
    if (evaluate.toString().indexOf('.') !== -1) {
      evaluate = evaluate.toFixed(5);
    }
    checkLength(evaluate);
    displayBox.innerHTML = evaluate;
  }

  // CHECK FOR LENGTH & DISABLING BUTTONS
  function checkLength(num) {
    if (num.toString().length > 7 && num.toString().length < 14) {
      // Do something with display styling (if needed)
    } else if (num.toString().length > 16) {
      num = 'Infinity';
      var buttons = document.querySelectorAll('button');
      buttons.forEach(function(button) {
        button.disabled = true;
      });
      document.querySelector('.clear').disabled = false;
    }
  }

  // TRIM IF NECESSARY
  function trimIfNecessary() {
    var length = displayBox.innerHTML.length;
    if (length > 7 && length < 14) {
      // Do something with display styling (if needed)
    } else if (length > 14) {
      displayBox.innerHTML = 'Infinity';
      var buttons = document.querySelectorAll('button');
      buttons.forEach(function(button) {
        button.disabled = true;
      });
      document.querySelector('.clear').disabled = false;
    }
  }
});

