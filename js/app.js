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

// Función para exportar a PDF (simulada de manera asíncrona)
function exportToPdf() {
    return new Promise((resolve, reject) => {
        // Crear overlay de exportación
        const exportOverlay = document.createElement('div');
        exportOverlay.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div class="animate-pulse text-white text-2xl">
                    Exportando a PDF... 📄
                </div>
            </div>
        `;
        document.body.appendChild(exportOverlay);

        // Simular proceso de exportación
        setTimeout(() => {
            try {
                // Obtener contenido renderizado
                const content = previewSection.innerHTML;

                // En un escenario real, aquí iría la lógica de generación de PDF
                // Por ahora, simularemos la exportación
                if (content && content.trim() !== '') {
                    // Simular descarga
                    const blob = new Blob([content], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'documento_markdown.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    // Eliminar overlay
                    document.body.removeChild(exportOverlay);
                    
                    resolve('Exportación completada');
                } else {
                    throw new Error('Contenido vacío');
                }
            } catch (error) {
                // Eliminar overlay
                document.body.removeChild(exportOverlay);

                // Mostrar mensaje de error
                const errorNotification = document.createElement('div');
                errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg z-50';
                errorNotification.textContent = 'No se pudo generar el PDF';
                document.body.appendChild(errorNotification);

                // Eliminar notificación después de 3 segundos
                setTimeout(() => {
                    document.body.removeChild(errorNotification);
                }, 3000);

                reject(error);
            }
        }, 1500); // Simular tiempo de procesamiento
    });
}

// Crear input de archivo oculto
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.md';
fileInput.style.display = 'none';

// Crear botón de exportación PDF
const exportPdfButton = document.createElement('button');
exportPdfButton.id = 'export-pdf';
exportPdfButton.textContent = 'Exportar PDF';
exportPdfButton.className = 'bg-blue-500 text-white px-5 py-2 font-semibold rounded-md shadow-md hover:bg-blue-400 transition';

// Insertar botón en el header
const header = document.querySelector('header');
header.appendChild(exportPdfButton);

// Evento para abrir selector de archivos
loadFileButton.addEventListener('click', () => {
  fileInput.click();
});

// Manejar carga de archivo
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  // Validar extensión del archivo
  if (!file.name.endsWith('.md')) {
    alert('Por favor, seleccione solo archivos Markdown (.md)');
    return;
  }

  // Crear un overlay de carga
  const loadingOverlay = document.createElement('div');
  loadingOverlay.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div class="animate-pulse text-white text-2xl">
        Cargando... ⏳
      </div>
    </div>
  `;
  document.body.appendChild(loadingOverlay);

  // Leer archivo
  const reader = new FileReader();
  
  reader.onload = (e) => {
    // Eliminar overlay de carga
    document.body.removeChild(loadingOverlay);
    
    // Obtener contenido del archivo
    const fileContent = e.target.result;
    
    // Actualizar input y preview
    markdownInput.value = fileContent;
    
    // Convertir y mostrar HTML
    const html = convertToHtml(fileContent);
    renderPreview(html);
    updateWordCount();
  };
  
  reader.onerror = () => {
    // Eliminar overlay de carga
    document.body.removeChild(loadingOverlay);
    
    console.error('Error en carga de archivo');
    alert('No se pudo cargar el archivo. Verifique que sea un archivo de texto válido.');
  };
  
  // Iniciar lectura del archivo
  reader.readAsText(file);
});

// Evento para actualizar el preview y el contador de palabras en tiempo real
markdownInput.addEventListener("input", function () {
  const text = markdownInput.value;
  const html = convertToHtml(text);
  renderPreview(html);
  updateWordCount();
});

// Evento para limpiar el editor
clearEditorButton.addEventListener("click", clearEditor);

// Agregar evento de exportación
exportPdfButton.addEventListener('click', () => {
    exportToPdf()
        .then(message => {
            console.log(message);
            // Notificación de éxito (opcional)
        })
        .catch(error => {
            console.error('Error en exportación:', error);
        });
});

// Inicializar el contador al cargar la página
updateWordCount();

// Agregar input de archivo al body
document.body.appendChild(fileInput);