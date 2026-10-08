import { useMemo, useState } from 'react';

const buttonLayout = [
  ['C', 'DEL', '/', '*'],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '='],
  ['0', '.', '00'],
];

const operators = ['+', '-', '*', '/'];

function App() {
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const flattenedButtons = useMemo(
    () => buttonLayout.flat(),
    []
  );

  const handleButtonClick = (value) => {
    if (value === 'C') {
      setExpression('');
      setDisplay('0');
      setJustEvaluated(false);
      return;
    }

    if (value === 'DEL') {
      const nextExpression = expression.slice(0, -1);
      setExpression(nextExpression);
      setDisplay(nextExpression || '0');
      setJustEvaluated(false);
      return;
    }

    if (value === '=') {
      if (!expression) {
        return;
      }

      try {
        const result = Function(`"use strict"; return (${expression})`)();

        if (!Number.isFinite(result)) {
          throw new Error('Invalid expression');
        }

        const nextValue = Number(result.toFixed(10)).toString();
        setExpression(nextValue);
        setDisplay(nextValue);
        setJustEvaluated(true);
      } catch {
        setExpression('');
        setDisplay('Error');
        setJustEvaluated(false);
      }
      return;
    }

    if (operators.includes(value)) {
      if (!expression) {
        if (value === '-') {
          setExpression('-');
          setDisplay('-');
          setJustEvaluated(false);
        }
        return;
      }

      if (justEvaluated) {
        setExpression(`${display}${value}`);
        setDisplay(value);
        setJustEvaluated(false);
        return;
      }

      if (operators.includes(expression.slice(-1))) {
        setExpression(expression.slice(0, -1) + value);
        setDisplay(value);
        return;
      }

      setExpression(expression + value);
      setDisplay(value);
      return;
    }

    if (value === '.') {
      const lastNumberPart = expression.split(/[+\-*/]/).pop() || '';

      if (lastNumberPart.includes('.')) {
        return;
      }

      const nextExpression = expression && !operators.includes(expression.slice(-1))
        ? `${expression}.`
        : `${expression || '0'}.`;

      setExpression(nextExpression);
      setDisplay(nextExpression);
      setJustEvaluated(false);
      return;
    }

    if (value === '00') {
      if (justEvaluated) {
        setExpression('0');
        setDisplay('0');
        setJustEvaluated(false);
        return;
      }

      if (expression === '0') {
        return;
      }

      const nextExpression = expression + value;
      setExpression(nextExpression);
      setDisplay(nextExpression);
      setJustEvaluated(false);
      return;
    }

    if (justEvaluated) {
      setExpression(value);
      setDisplay(value);
      setJustEvaluated(false);
      return;
    }

    const nextExpression = expression === '0' ? value : expression + value;
    setExpression(nextExpression);
    setDisplay(nextExpression);
  };

  return (
    <div className="app-shell">
      <div className="calculator">
        <div className="display-panel">
          <div className="expression">{expression || '0'}</div>
          <div className="result">{display}</div>
        </div>

        <div className="keypad">
          {flattenedButtons.map((button) => {
            const operatorButton = ['+', '-', '*', '/'].includes(button);
            const equalsButton = button === '=';
            const clearButton = button === 'C';
            const deleteButton = button === 'DEL';

            return (
              <button
                key={button}
                className={[
                  'key',
                  operatorButton ? 'operator' : '',
                  equalsButton ? 'equals' : '',
                  clearButton ? 'clear' : '',
                  deleteButton ? 'delete' : '',
                ].join(' ')}
                onClick={() => handleButtonClick(button)}
              >
                {button}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
