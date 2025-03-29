/**
 * Variables para obtener elementos HTML
 */
const markdownInput = document.querySelector("#markdown-input");
const previewSection = document.querySelector("#preview-section");
const wordCountDisplay = document.createElement("div");
const clearEditorButton = document.querySelector("#clear-editor");
const loadFileButton = document.querySelector("#load-file");

// Estilo del contador de palabras
wordCountDisplay.classList.add("text-sm", "mt-2", "text-gray-300", "word-count");
markdownInput.parentNode.appendChild(wordCountDisplay);

// Key for localStorage
const LOCAL_STORAGE_KEY = 'markdown-editor-content';

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

// Function to save content to localStorage
function saveToLocalStorage() {
    const text = markdownInput.value;
    localStorage.setItem(LOCAL_STORAGE_KEY, text);
}

// Function to restore content from localStorage
function restoreFromLocalStorage() {
    const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedContent) {
        markdownInput.value = savedContent;
       
        // Convert and show HTML
        const html = convertToHtml(savedContent);
        renderPreview(html);
        updateWordCount();
    }
}

// Function to clear saved content
function clearSavedContent() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
   
    // Optional: Clear editor and preview
    clearEditor();
   
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white p-4 rounded-lg z-50';
    notification.textContent = 'Contenido guardado eliminado';
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Function to download Markdown file
function downloadMarkdownFile() {
    const text = markdownInput.value;

    // Validate if there's content to download
    if (!text.trim()) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50';
        notification.textContent = 'No hay contenido para descargar';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
        return;
    }

    // Generate filename with current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/[:\.]/g, '-');
    const filename = `markdown-${formattedDate}.md`;

    // Create a Blob with the Markdown content
    const blob = new Blob([text], { type: 'text/markdown' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;

    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg z-50';
    notification.textContent = `Archivo ${filename} descargado`;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Function for exporting to PDF (from original code)
function exportToPdf() {
    return new Promise((resolve, reject) => {
        // Create overlay of export
        const exportOverlay = document.createElement('div');
        exportOverlay.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div class="animate-pulse text-white text-2xl">
                    Exportando a PDF... 📄
                </div>
            </div>
        `;
        document.body.appendChild(exportOverlay);

        // Simulate export process
        setTimeout(() => {
            try {
                // Get rendered content
                const content = previewSection.innerHTML;

                // In a real scenario, PDF generation logic would go here
                // For now, we'll simulate the export
                if (content && content.trim() !== '') {
                    // Simulate download
                    const blob = new Blob([content], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                   
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'documento_markdown.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    // Remove overlay
                    document.body.removeChild(exportOverlay);
                   
                    resolve('Exportación completada');
                } else {
                    throw new Error('Contenido vacío');
                }
            } catch (error) {
                // Remove overlay
                document.body.removeChild(exportOverlay);

                // Show error notification
                const errorNotification = document.createElement('div');
                errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50';
                errorNotification.textContent = 'No se pudo generar el PDF';
                document.body.appendChild(errorNotification);

                // Remove notification after 3 seconds
                setTimeout(() => {
                    document.body.removeChild(errorNotification);
                }, 3000);
                reject(error);
            }
        }, 1500); // Simulate processing time
    });
}

// Create hidden file input
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.md';
fileInput.style.display = 'none';

// Create download Markdown button
const downloadMarkdownButton = document.createElement('button');
downloadMarkdownButton.id = 'download-markdown';
downloadMarkdownButton.textContent = 'Descargar MD';
downloadMarkdownButton.className = 'bg-purple-500 text-white px-5 py-2 font-semibold rounded-md shadow-md hover:bg-purple-400 transition';

// Add clear saved content button
const clearSavedContentButton = document.createElement('button');
clearSavedContentButton.id = 'clear-saved-content';
clearSavedContentButton.textContent = 'Limpiar Guardado';
clearSavedContentButton.className = 'bg-red-500 text-white px-5 py-2 font-semibold rounded-md shadow-md hover:bg-red-400 transition';

// Create PDF export button
const exportPdfButton = document.createElement('button');
exportPdfButton.id = 'export-pdf';
exportPdfButton.textContent = 'Exportar PDF';
exportPdfButton.className = 'bg-blue-500 text-white px-5 py-2 font-semibold rounded-md shadow-md hover:bg-blue-400 transition';

// Insert buttons in the header
const header = document.querySelector('header');
header.appendChild(downloadMarkdownButton);
header.appendChild(clearSavedContentButton);
header.appendChild(exportPdfButton);

// Event to open file selector
loadFileButton.addEventListener('click', () => {
  fileInput.click();
});

// Handle file upload
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
 
  // Validate file extension
  if (!file.name.endsWith('.md')) {
    alert('Por favor, seleccione solo archivos Markdown (.md)');
    return;
  }

  // Create a loading overlay
  const loadingOverlay = document.createElement('div');
  loadingOverlay.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div class="animate-pulse text-white text-2xl">
        Cargando... ⏳
      </div>
    </div>
  `;
  document.body.appendChild(loadingOverlay);

  // Read file
  const reader = new FileReader();
 
  reader.onload = (e) => {
    // Remove loading overlay
    document.body.removeChild(loadingOverlay);
   
    // Get file content
    const fileContent = e.target.result;
   
    // Update input and preview
    markdownInput.value = fileContent;
   
    // Convert and show HTML
    const html = convertToHtml(fileContent);
    renderPreview(html);
    updateWordCount();
  };
 
  reader.onerror = () => {
    // Remove loading overlay
    document.body.removeChild(loadingOverlay);
   
    console.error('Error en carga de archivo');
    alert('No se pudo cargar el archivo. Verifique que sea un archivo de texto válido.');
  };
 
  // Start file reading
  reader.readAsText(file);
});

// Event to update preview and word count in real-time
markdownInput.addEventListener("input", function () {
  const text = markdownInput.value;
  const html = convertToHtml(text);
  renderPreview(html);
  updateWordCount();
});

// Event to clear the editor
clearEditorButton.addEventListener("click", clearEditor);

// Add download event
downloadMarkdownButton.addEventListener('click', downloadMarkdownFile);

// Add export event
exportPdfButton.addEventListener('click', () => {
    exportToPdf()
        .then(message => {
            console.log(message);
            // Optional success notification
        })
        .catch(error => {
            console.error('Error en exportación:', error);
        });
});

// Event listeners for auto-save and restore
markdownInput.addEventListener('input', saveToLocalStorage);
clearSavedContentButton.addEventListener('click', clearSavedContent);

// Restore content when page loads
document.addEventListener('DOMContentLoaded', restoreFromLocalStorage);

// Initialize word count on page load
updateWordCount();

// Add file input to body
document.body.appendChild(fileInput);