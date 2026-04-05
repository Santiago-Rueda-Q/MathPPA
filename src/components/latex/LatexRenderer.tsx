import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  latex: string;
  fontSize?: number;
  color?: string;
  center?: boolean;
}

export default function LatexRenderer({ latex, fontSize = 16, color = '#FFFFFF', center = false }: Props) {
  const [height, setHeight] = useState(fontSize * 3);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" crossorigin="anonymous">
      <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js" crossorigin="anonymous"></script>
      <style>
        body { 
          background-color: transparent; 
          color: ${color}; 
          font-size: ${fontSize}px; 
          margin: 0;
          padding: 8px;
          display: flex;
          justify-content: ${center ? 'center' : 'flex-start'};
          align-items: center;
          overflow: hidden;
        }
        #math { width: 100%; word-break: break-all; }
        .katex-display { margin: 0; }
      </style>
    </head>
    <body>
      <div id="math"></div>
      <script>
        function checkAndRender() {
          if (typeof katex !== 'undefined') {
            try {
              const content = \`${latex.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
              if (!content) {
                window.ReactNativeWebView.postMessage("0");
                return;
              }
              katex.render(content, document.getElementById('math'), {
                throwOnError: false,
                displayMode: true
              });
              setTimeout(() => {
                window.ReactNativeWebView.postMessage(String(document.documentElement.scrollHeight));
              }, 50);
            } catch (e) {
              document.getElementById('math').innerText = e.message;
            }
          } else {
            setTimeout(checkAndRender, 50);
          }
        }
        window.onload = checkAndRender;
      </script>
    </body>
    </html>
  `;

  return (
    <View style={[styles.container, { minHeight: fontSize * 2, height: height }]}>
      <WebView 
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        backgroundColor="transparent"
        scrollEnabled={false}
        onMessage={(event) => {
          const contentHeight = parseInt(event.nativeEvent.data);
          if (!isNaN(contentHeight) && contentHeight > 0) {
            // Only update if change is significant to avoid feedback loops
            if (Math.abs(contentHeight - height) > 5) {
              setHeight(contentHeight + 5);
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  webview: {
    backgroundColor: 'transparent',
  }
});
