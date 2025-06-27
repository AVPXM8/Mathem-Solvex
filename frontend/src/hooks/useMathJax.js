// // src/hooks/useMathJax.js
// import { useEffect } from 'react';

// const useMathJax = (dependencies) => {
//     useEffect(() => {
//         const typesetMath = () => {
//             if (window.MathJax) {
//                 window.MathJax.typesetPromise().catch((err) =>
//                     console.error('MathJax typeset error:', err)
//                 );
//             }
//         };
//         const timeoutId = setTimeout(typesetMath, 100);
//         return () => clearTimeout(timeoutId);
//     }, dependencies);
// };

// export default useMathJax;
// src/hooks/useMathJax.js
import { useEffect } from 'react';

const useMathJax = (dependencies = []) => {
  useEffect(() => {
    const typeset = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.startup?.promise
          .then(() => window.MathJax.typesetPromise())
          .catch((err) => console.error('MathJax typeset error:', err));
      } else {
        console.warn('MathJax not loaded yet.');
      }
    };

    const timeoutId = setTimeout(typeset, 150); // wait a bit to ensure content is rendered
    return () => clearTimeout(timeoutId); // cleanup on unmount or deps change
  }, dependencies);
};

export default useMathJax;
