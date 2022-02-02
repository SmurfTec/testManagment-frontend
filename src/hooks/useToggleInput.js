import { useState } from 'react';

const useToggleInput = (initialState = false) => {
  const [state, setState] = useState(initialState);

  const toggleInput = (e) => {
    setState((st) => !st);
  };

  const resetState = () => {
    setState(initialState);
  };

  return [state, toggleInput, resetState];
};

export default useToggleInput;
