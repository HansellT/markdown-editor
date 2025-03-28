/**
 * Convierte encabezados Markdown a HTML con Tailwind y mayor espaciado
 */
function convertHeadings(html) {
  html = html.replace(/^# (.+)$/gm, "<h1 class='text-6xl font-bold border-b pb-2 mb-4'>$1</h1>");
  html = html.replace(/^## (.+)$/gm, "<h2 class='text-5xl font-bold border-b pb-2 mb-4'>$1</h2>");
  html = html.replace(/^### (.+)$/gm, "<h3 class='text-4xl font-bold mb-3'>$1</h3>");
  html = html.replace(/^#### (.+)$/gm, "<h4 class='text-3xl font-bold mb-3'>$1</h4>");
  html = html.replace(/^##### (.+)$/gm, "<h5 class='text-2xl font-bold mb-2'>$1</h5>");
  html = html.replace(/^###### (.+)$/gm, "<h6 class='text-xl font-bold mb-2'>$1</h6>");
  return html;
}

/**
 * Transforma contenido en negrita e itálica
 */
function convertTextStyles(html) {
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); // Negrita
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>"); // Itálica
  return html;
}

/**
 * Función de transformación envuelta en promesa con manejo de excepciones
 * @param {string} markdownText - Texto Markdown a convertir
 * @returns {Promise} Promesa que resuelve con HTML o rechaza con error
 */
function transformMarkdownToHtml(markdownText) {
    return new Promise((resolve, reject) => {
        try {
            // Crear un contenedor para capturar posibles errores
            let html = markdownText;

            // Validaciones de sintaxis básicas
            const syntaxErrors = [];

            // Validación de encabezados
            const headingMatches = html.match(/^(#{1,6})\s/gm);
            if (headingMatches) {
                headingMatches.forEach(heading => {
                    if (heading.length > 7) {
                        syntaxErrors.push(`Encabezado inválido: ${heading.trim()}`);
                    }
                });
            }

            // Validación de negrita y cursiva
            const boldItalicMatches = html.match(/(\*{1,2}[^*\n]+\*{1,2})/g);
            if (boldItalicMatches) {
                boldItalicMatches.forEach(match => {
                    const unbalancedStars = (match.match(/\*/g) || []).length;
                    if (unbalancedStars % 2 !== 0) {
                        syntaxErrors.push(`Formato de negrita/cursiva incompleto: ${match}`);
                    }
                });
            }

            // Convertir si no hay errores
            if (syntaxErrors.length === 0) {
                html = convertHeadings(html);
                html = convertLists(html);
                html = convertTextStyles(html);
                html = processCodeBlocks(html);

                resolve({
                    html: html,
                    warnings: []
                });
            } else {
                // Resolver con advertencias si hay errores leves
                resolve({
                    html: markdownText, // Mantener texto original
                    warnings: syntaxErrors
                });
            }
        } catch (error) {
            // Rechazar promesa con error crítico
            reject({
                message: "Error crítico en transformación",
                details: error.message
            });
        }
    });
}

/**
 * Convierte el texto Markdown a HTML
 */
function convertToHtml(text) {
  let html = text;
  html = convertHeadings(html);
  html = convertLists(html);
  html = convertTextStyles(html);
  html = processCodeBlocks(html);
  return html;
}