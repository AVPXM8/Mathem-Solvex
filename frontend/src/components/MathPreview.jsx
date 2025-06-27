// src/components/MathPreview.jsx
import React from 'react';
import useMathJax from '../hooks/useMathJax';

const MathPreview = ({ latexString, className = '', style = {} }) => {
  useMathJax([latexString]);

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: latexString }}
    />
  );
};

export default MathPreview;
