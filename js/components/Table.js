export function renderTable(headers, rows) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = thead.insertRow();
    
    headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        headerRow.appendChild(th);
    });
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    rows.forEach(row => {
        const tr = tbody.insertRow();
        row.forEach(cell => {
            const td = tr.insertCell();
            if (cell instanceof HTMLElement) {
                td.appendChild(cell);
            } else {
                td.textContent = cell;
            }
        });
    });
    table.appendChild(tbody);
    
    return table;
}
