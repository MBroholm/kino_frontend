import { getSeatsForShowing} from "../services/seatsService.js";
import {renderSeatMap} from "../seatmap.js";

// URLSearchParams(window.location.search) is a built-in script
// window.location accesses the current URL of the page, and .search
// gets the query string part of the URL (the part after the ?).
const params = new URLSearchParams(window.location.search);
const showingId = params.get("showingId");

// let, because we need to modify the array of seats
// let, because we default to 2 tickets, but
// can change based on user input in dropdown menu
// how many seats the user is allowed to select
const selectedIds = new Set();
let allSeats = [];
let maxTickets = 2;

//
document.addEventListener("DOMContentLoaded", async () => {
    populateTicketDropdown();

    document.getElementById("ticketCount")
        .addEventListener("change", element => {
            maxTickets = parseInt(element.target.value);
            while (selectedIds.size > maxTickets) {
                selectedIds.delete(selectedIds.values().next().value);
            }
            refresh();
        });

    try {
        allSeats = await getSeatsForShowing(showingId);
        refresh();
    } catch (err) {
        document.getElementById("seatMapContainer").textContent =
            "Could not load seats: " + err.message;
    }
});

function toggleSeat(seatId) {
    if (selectedIds.has(seatId)) {
        selectedIds.delete(seatId);
    } else if (selectedIds.size < maxTickets) {
        selectedIds.add(seatId);
    }
    refresh();
}

function refresh() {
    renderSeatMap(
        document.getElementById("seatMapContainer"),
        allSeats,
        selectedIds,
        toggleSeat
    );
    updateSummary();
}

function populateTicketDropdown(){
    const select = document.getElementById("ticketCount");
    for (let i = 1; i <= 9; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        if (i === maxTickets) option.selected = true;
        select.appendChild(option);
    }
}

function updateSummary(){
    const summary = document.getElementById("summary");
    const btn = document.getElementById("confirmBtn")
    const count = selectedIds.size;
    summary.textContent = `${count} of ${maxTickets} seats selected`;
    btn.disabled = count !== maxTickets;
}
