/**
 * Variables para obtener elementos HTML
 */
const generateHtml = document.querySelector("#generate-html");
const markdownInput = document.querySelector("#markdown-input");
const previewSection = document.querySelector("#preview-section");
const wordCountDisplay = document.createElement("div");

// Estilo del contador de palabras
wordCountDisplay.classList.add("text-sm", "mt-2", "text-gray-300");
markdownInput.parentNode.appendChild(wordCountDisplay);

/**
 * Función para obtener el texto del textarea
 */
function getTextFromTextArea() {
  return markdownInput.value;
}

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
 * Convierte listas Markdown a HTML con espaciado
 */
function convertLists(html) {
  // Manejar listas no ordenadas (- Item)
  html = html.replace(/(?:^|\n)(- .+(?:\n- .+)*)/g, match => {
      let items = match.trim().split("\n").map(item => `<li>${item.replace(/^- /, '')}</li>`).join("");
      return `<ul class="list-disc list-inside mb-2">${items}</ul>`;
  });

  // Manejar listas ordenadas (1. Item)
  html = html.replace(/(?:^|\n)(\d+\..+(?:\n\d+\..+)*)/g, match => {
      let items = match.trim().split("\n").map(item => `<li>${item.replace(/^\d+\.\s/, '')}</li>`).join("");
      return `<ol class="list-decimal list-inside mb-2">${items}</ol>`;
  });

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
 * Convierte el texto Markdown a HTML
 */
function convertToHtml(text) {
  let html = text;
  html = convertHeadings(html);
  html = convertLists(html);
  html = convertTextStyles(html);
  return html;
}

/**
 * Renderiza el HTML generado en la vista previa con espaciado
 */
function renderPreview(html) {
  previewSection.innerHTML = `<div class="space-y-3">${html}</div>`;
}

/**
 * Actualiza el contador de palabras y caracteres
 */
function updateWordCount() {
  const text = markdownInput.value;
  const words = text.match(/\b\w+\b/g) || []; // Contador de palabras
  const characters = text.length;
  wordCountDisplay.textContent = `Palabras: ${words.length} | Caracteres: ${characters}`;
}

// Evento al hacer clic en el botón Generar
generateHtml.addEventListener("click", function () {
  const text = getTextFromTextArea();
  const html = convertToHtml(text);
  renderPreview(html);
});

// Evento para actualizar el contador de palabras en tiempo real
markdownInput.addEventListener("input", updateWordCount);

// Inicializar el contador al cargar la página
updateWordCount();
