export function reRenderMathJax() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise().catch((err) =>
      console.error('MathJax re-render error:', err)
    );
  }
}
