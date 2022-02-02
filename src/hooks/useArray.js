import { useState } from 'react';

export default function useArray(defaultValue = [], idKey = 'id') {
  const [array, setArray] = useState(defaultValue);

  const push = (element) => {
    setArray((a) => [...a, element]);
  };
  
  const filter = (callback) => {
    setArray((a) => a.filter(callback));
  };

  const update = (id, updatedEl) => {
    setArray((a) =>
      a.map((el) => (el[idKey] === id ? { ...el, ...updatedEl } : el))
    );
  };

  // * Useful Method
  // const insert = (index, newElement) => {
  //   setArray((a) => [
  //     ...a.slice(0, index),
  //     newElement,
  //     ...a.slice(index + 1, a.length),
  //   ]);
  // };

  const remove = (id) => {
    setArray((a) => a.filter((el) => el[idKey] !== id));
  };

  const clear = () => {
    setArray([]);
  };

  return [array, setArray, push, filter, update, remove, clear];
}
