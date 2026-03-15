import {getSeatsForShowing} from "../services/seatsService.js";
import {renderSeatMap} from "../seatmap.js";

import {createReservation} from "../services/reservationService.js";

// URLSearchParams(window.location.search) is a built-in script
// window.location accesses the current URL of the page, and .search
// gets the query string part of the URL (the part after the ?).
const params = new URLSearchParams(window.location.search);
const showingId = params.get("showingId");

// let, because we need to modify the array of seats
// let, because we default to 2 tickets, but
// can change based on user input in dropdown menu
// how many seats the user is allowed to select
const MAX_TICKETS_PER_BOOKING = 9
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

    // confirmBtn is the button in the HTML that opens the confirmation panel when clicked.
    document.getElementById("confirmBtn").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "flex";
        document.getElementById("confirmationPanel").style.display = "block";

        const selectedSeats = allSeats.filter(seat => selectedIds.has(seat.seatId));

        // Build the HTML content for the confirmation panel
        // transforms the array of selected seats into a list of HTML list items,
        // and then joins them into a single string
        const seatList = selectedSeats
            .map(seat => `<li>Row ${seat.rowNumber}, Seat ${seat.seatNumber}</li>`)
            .join("");

        // Populate the confirmation details paragraph
        document.getElementById("confirmationDetails").innerHTML =
            ` <ul>${seatList}</ul> `;
    });
    // cancelBtn is the button in the HTML that closes the confirmation panel when clicked.
    document.getElementById("cancelBtn").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("confirmationPanel").style.display = "none";
    });

    // When the finalize button is clicked, attempt to create a reservation
    document.getElementById("finalizeBtn").addEventListener("click", async () => {
        // async because we need to await the backend response
        try {
            // Build the request object matching CreateReservationRequest in backend
            // showingId comes from the URL parameter, seatIds converted from Set to Array
            // since JSON doesn't support Sets, only Arrays
            const data = {
                showingId: showingId,
                seatIds: Array.from(selectedIds)
            };

            // Send POST request to backend, await the ReservationDTO response
            // postJson serializes data to JSON, backend deserializes it back to Java object
            const reservation = await createReservation(data);

            // On success, replace panel content with booking confirmation
            // using template literals to inject reservation fields from the returned DTO
            // map each seat in the returned DTO to an HTML list item
            // reload the page to reset seat map to updated occupied state
            document.getElementById("confirmationPanel").innerHTML = `
            <h2>Booking Confirmed!</h2>
            <p>Your reference number is:</p>
            <h3>${reservation.referenceNumber}</h3>
            <p>Movie: ${reservation.movieTitle}</p>
            <p>Start: ${reservation.startTime}</p>
            <p>Theatre: ${reservation.theatreNumber}</p>
            <ul>
                ${reservation.seats.map(seat => `<li>Row ${seat.rowNumber}, Seat ${seat.seatNumber}</li>`).join("")}
            </ul>
            <button onclick="window.location.reload()">Back to seat map</button>
        `;
        } catch (err) {
            // On error (eg. seats already taken), replace panel with error message
            // err.message contains the error text returned by the backend
            document.getElementById("confirmationPanel").innerHTML = `
            <h2>Booking Failed</h2>
            <p>${err.message}</p>
            <button id="cancelBtn">Go back</button>
        `;
        }
    });
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

function populateTicketDropdown() {
    const select = document.getElementById("ticketCount");
    for (let i = 1; i <= MAX_TICKETS_PER_BOOKING; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        if (i === maxTickets) option.selected = true;
        select.appendChild(option);
    }
}

function updateSummary() {
    const summary = document.getElementById("summary");
    const btn = document.getElementById("confirmBtn")
    const count = selectedIds.size;
    summary.textContent = `${count} of ${maxTickets} seats selected`;
    btn.disabled = count !== maxTickets;
}
