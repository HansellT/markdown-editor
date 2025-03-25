/**
 * Variables para obtener elementos HTML
 */
const markdownInput = document.querySelector("#markdown-input");
const previewSection = document.querySelector("#preview-section");
const wordCountDisplay = document.createElement("div");
const clearEditorButton = document.querySelector("#clear-editor");

// Estilo del contador de palabras
wordCountDisplay.classList.add("text-sm", "mt-2", "text-gray-300");
markdownInput.parentNode.appendChild(wordCountDisplay);

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

/**
 * Limpia el editor y la vista previa
 */
function clearEditor() {
  markdownInput.value = ''; // Limpiar texto del input
  previewSection.innerHTML = '<p class="text-gray-400">Vista previa del Markdown...</p>'; // Restaurar texto inicial
  updateWordCount(); // Actualizar contador
}

// Evento para actualizar el preview y el contador de palabras en tiempo real
markdownInput.addEventListener("input", function () {
  const text = markdownInput.value;
  const html = convertToHtml(text);
  renderPreview(html);
  updateWordCount();
});

// Evento para limpiar el editor
clearEditorButton.addEventListener("click", clearEditor);

// Inicializar el contador al cargar la página
updateWordCount();