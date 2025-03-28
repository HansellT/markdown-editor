function mapListItems(items, transformCallback) {
    return items.map((item, index) => {
        const cleanedItem = item.replace(/^\d+\.\s*/, '').trim();
        return transformCallback(cleanedItem, index + 1);
    });
}

function convertLists(html) {
    // Handle unordered lists (- Item)
    html = html.replace(/(?:^|\n)(- .+(?:\n- .+)*)/g, match => {
        let items = match.trim().split("\n").map(item => 
            `<li>${item.replace(/^- /, '')}</li>`
        ).join("");
        return `<ul class="list-disc list-inside mb-2">${items}</ul>`;
    });
 
    // Handle ordered lists with higher-order function
    html = html.replace(/(?:^|\n)(\d+\..+(?:\n\d+\..+)*)/g, match => {
        const listLines = match.trim().split("\n");
        const transformedItems = mapListItems(listLines, (item, number) => 
            `<li>${item}</li>`
        );
        return `<ol class="list-decimal list-inside mb-2">${transformedItems.join('')}</ol>`;
    });
 
    return html;
}