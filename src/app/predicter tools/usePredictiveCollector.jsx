import { useEffect, useRef } from 'react';

const usePredictiveCollector = (text, delay = 1000) => {
  const timeoutRef = useRef();
  const lastTextRef = useRef('');

  useEffect(() => {
    if (!text.trim()) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const prev = lastTextRef.current;
      if (text === prev) return; 

      const newPart = text.slice(prev.length);
      lastTextRef.current = text;

      const cleaned = newPart.replace(/[^\w\s]/g, '').toLowerCase();
      const words = cleaned.split(/\s+/).filter(Boolean);

      if (!words.length) return;

      const nGrams = [];
      for (let i = 0; i < words.length; i++) {
        for (let j = i + 1; j <= words.length && j - i <= 3; j++) {
          const ngram = words.slice(i, j).join(' ');
          nGrams.push(ngram);
        }
      }

      const storedData = JSON.parse(localStorage.getItem('phraseStats') || '{}');

      nGrams.forEach(ngram => {
        storedData[ngram] = (storedData[ngram] || 0) + 1;
      });

      localStorage.setItem('phraseStats', JSON.stringify(storedData));

    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [text, delay]);
};

export default usePredictiveCollector;