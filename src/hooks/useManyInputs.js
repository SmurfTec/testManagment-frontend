import { useState } from 'react';

const useManyInputs = (initialState) => {
  const [state, setState] = useState(initialState);

  //* it will take all the inputs type='text'/'number'
  const handleTxtChange = (e) => {
    setState((st) => ({ ...st, [e.target.name]: e.target.value }));
  };

  //* used for switch/button/dialog
  const handleToggleChange = (e) => {
    setState((st) => ({
      ...st,
      [e.target.name]: !st[e.target.name],
    }));
  };

  //* used for custom-change
  const changeInput = (key, value) => {
    setState((st) => ({ ...st, [key]: value }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return [
    state,
    handleTxtChange,
    handleToggleChange,
    changeInput,
    resetState,
    setState,
  ];
};

export default useManyInputs;
