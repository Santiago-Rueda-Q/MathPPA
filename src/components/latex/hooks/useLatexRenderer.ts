import { useState } from 'react';
import { generateKatexHtml } from '../utils/katexTemplate';

export const useLatexRenderer = (latex: string, fontSize: number, color: string, center: boolean) => {
  const [height, setHeight] = useState(fontSize * 3);
  
  const html = generateKatexHtml(latex, fontSize, color, center);

  const handleMessage = (event: any) => {
    const contentHeight = parseInt(event.nativeEvent.data);
    if (!isNaN(contentHeight) && contentHeight > 0) {
      if (Math.abs(contentHeight - height) > 5) {
        setHeight(contentHeight + 5);
      }
    }
  };

  return { height, html, handleMessage };
};
