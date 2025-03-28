/*
 * Función para resaltado de código básico
 * @param {string} code - Contenido del código
 * @param {string} [language=''] - Lenguaje del código
 * @returns {string} Código HTML con resaltado básico
 */
function highlightCode(code, language = '') {
    // Escapar caracteres HTML
    const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
  
    // Palabras clave básicas por lenguaje (puedes expandir esta lista)
    const keywords = {
        javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'],
        python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'for', 'while'],
        html: ['<!DOCTYPE', '<html', '<head', '<body', '<div', '<span', '<a'],
        css: ['@media', 'body', 'div', 'span', 'color', 'background']
    };
  
    // Función para aplicar resaltado básico
    function applyBasicHighlighting(code, languageKeywords) {
        // Resaltar strings
        code = code.replace(/('|").*?\1/g, match => 
            `<span class="string">${match}</span>`
        );
  
        // Resaltar comentarios de una línea
        code = code.replace(/\/\/.*$/gm, match => 
            `<span class="comment">${match}</span>`
        );
  
        // Resaltar palabras clave
        languageKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, match => 
                `<span class="keyword">${match}</span>`
            );
        });
  
        return code;
    }
  
    // Seleccionar keywords del lenguaje o usar un conjunto vacío
    const languageKeywords = keywords[language.toLowerCase()] || [];
   
    // Aplicar resaltado
    const highlightedCode = applyBasicHighlighting(escapedCode, languageKeywords);
    return `<pre><code class="language-${language}">${highlightedCode}</code></pre>`;
  }
  
  /*
   * Convierte bloques de citas en Markdown a HTML
   */
  function convertBlockquotes(html) {
    html = html.replace(/^> (.+)$/gm, "<blockquote class='border-l-4 border-gray-400 pl-4 italic'>$1</blockquote>");
    return html;
  }
  
  /*
   * Procesar bloques de código en el texto Markdown
   * @param {string} html - Texto HTML a procesar
   * @returns {string} HTML con bloques de código resaltados
   */
  function processCodeBlocks(html) {
    return html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, codeContent) => {
        return highlightCode(codeContent.trim(), language);
    });
  }