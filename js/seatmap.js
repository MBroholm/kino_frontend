export function renderSeatMap(container, seats, selectedIds, onToggle) {
    // clears the container/canvas for the seat map
    // before each render, to re-render with updated data.
    container.innerHTML = "";

    // creates the screen element and appends it to the container
    // refers css class "screen" for styling the "screen" element in the seat map.
    const screen = document.createElement("div");
    screen.classList.add("screen");
    container.appendChild(screen);

    // rows is a map where each key is a row number
    // each value paired is an array of seats
    // groupByRow is a helper function
    const rows = groupByRow(seats);

    rows.forEach((rowSeats, rowNumber) => {
        const rowElement = document.createElement("div");
        rowElement.classList.add("seat-row");

        //ultimately adds a row number label per row on the left of the map
        rowElement.appendChild(createRowLabel(rowNumber));

        // render each seat in the row and its occupied/selected state
        rowSeats.forEach(seat => {
            const btn = document.createElement("button");
            btn.classList.add("seat");

            if (seat.occupied) {
                btn.classList.add("occupied");
                btn.disabled = true;
            } else if (selectedIds.has(seat.seatId)) {
                btn.classList.add("selected");
            }

            // adds a tooltip that appears when hovering over the seat.
            // solely a User Experience feature.
            btn.title = `Row ${seat.rowNumber}, Seat ${seat.seatNumber}`;

            // calls onToggle with the seatId when the button is clicked,
            // which toggles the selection of the seat.
            btn.addEventListener("click", () => onToggle(seat.seatId));


            // place the rendered seat button in the row element
            rowElement.appendChild(btn);
        })

        //ultimately adds a row number label per row on the right of the map
        rowElement.appendChild(createRowLabel(rowNumber));

        container.appendChild(rowElement)
    });
}

// helper function used in renderSeatMap
// which creates a reusable row number label element
// and adds it to the left and right of the seat map.
function createRowLabel(rowNumber) {
    const span = document.createElement("span");
    span.classList.add("row-label");
    span.textContent = rowNumber;
    return span;
}

// helper function used in renderSeatMap
// creates a map with row numbers as keys and arrays of seats as values
// iterates through each seat in a flat array one by one and groups them by their row number
// if a row number doesn't exist yet, create it with an empty array.
// gets the array for the row number and pushes the seat into it.
function groupByRow(seats) {
    const map = new Map();
    seats.forEach(seat => {
        if (!map.has(seat.rowNumber)) map.set(seat.rowNumber, []);
        map.get(seat.rowNumber).push(seat);
    })

    // unpacks all map entries into a regular array so we can sort them
    // sorts the entries by row number (the key of the map) in ascending order (left to right)
    // places the now sorted array of entries into a map
    const entries = [...map.entries()];
    entries.sort((a, b) => a[0] - b[0]);
    const sorted = new Map(entries);

    sorted.forEach(rowSeats => rowSeats.sort((a, b) => a.seatNumber - b.seatNumber));
    return sorted;

}

//


