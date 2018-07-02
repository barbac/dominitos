import React from 'react';

export default function Button({ text, onClick }) {
  return (
    <span className="macro-button" onClick={onClick}>
      {text}
    </span>
  );
}
