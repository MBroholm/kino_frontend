import {getSeatsForShowing} from "../services/seatsService.js";
import {renderSeatMap} from "../seatmap.js";
import {createReservation} from "../services/reservationService.js";

const MAX_TICKETS_PER_BOOKING = 9;

async function render(container, params) {
    const showingId = params.get("showingId");
    let selectedIds = new Set();
    let allSeats = [];
    let maxTickets = 2;

    container.innerHTML = `
        <a href="#/">← Back to Movies</a>
        <header>
            <h3>Booking</h3>
        </header>

        <main class="booking-layout">
            <aside id="sidebar">
                <label for="ticketCount">Select number of tickets:</label>
                <select id="ticketCount"></select>
                <p id="summary"></p>
                <button id="confirmBtn" disabled>Confirm selection</button>
            </aside>

            <section id="seatMapContainer">Loading seats...</section>
        </main>

        <div id="overlay">
            <div id="confirmationPanel">
                <h2>Confirm Your Booking</h2>
                <div id="confirmationDetails"></div>
                <button id="finalizeBtn">Finalize Booking</button>
                <button id="cancelBtn">Cancel</button>
            </div>
        </div>
    `;

    const ticketSelect = document.getElementById("ticketCount");
    const seatMapContainer = document.getElementById("seatMapContainer");
    const summary = document.getElementById("summary");
    const confirmBtn = document.getElementById("confirmBtn");
    const overlay = document.getElementById("overlay");
    const confirmationPanel = document.getElementById("confirmationPanel");
    const confirmationDetails = document.getElementById("confirmationDetails");
    const finalizeBtn = document.getElementById("finalizeBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    // Populate dropdown
    for (let i = 1; i <= MAX_TICKETS_PER_BOOKING; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        if (i === maxTickets) option.selected = true;
        ticketSelect.appendChild(option);
    }

    ticketSelect.addEventListener("change", (e) => {
        maxTickets = parseInt(e.target.value);
        while (selectedIds.size > maxTickets) {
            selectedIds.delete(selectedIds.values().next().value);
        }
        refresh();
    });

    try {
        allSeats = await getSeatsForShowing(showingId);
        refresh();
    } catch (err) {
        seatMapContainer.textContent = "Could not load seats: " + err.message;
    }

    function toggleSeat(seatId) {
        if (selectedIds.has(seatId)) {
            selectedIds.delete(seatId);
        } else if (selectedIds.size < maxTickets) {
            selectedIds.add(seatId);
        }
        refresh();
    }

    function refresh() {
        renderSeatMap(seatMapContainer, allSeats, selectedIds, toggleSeat);
        summary.textContent = `${selectedIds.size} of ${maxTickets} seats selected`;
        confirmBtn.disabled = selectedIds.size !== maxTickets;
    }

    confirmBtn.addEventListener("click", () => {
        overlay.style.display = "flex";
        confirmationPanel.style.display = "block";

        const selectedSeats = allSeats.filter(seat => selectedIds.has(seat.seatId));
        const seatList = selectedSeats
            .map(seat => `<li>Row ${seat.rowNumber}, Seat ${seat.seatNumber}</li>`)
            .join("");

        confirmationDetails.innerHTML = `<ul>${seatList}</ul>`;
    });

    cancelBtn.addEventListener("click", () => {
        overlay.style.display = "none";
        confirmationPanel.style.display = "none";
    });

    finalizeBtn.addEventListener("click", async () => {
        try {
            const data = {
                showingId: parseInt(showingId),
                seatIds: Array.from(selectedIds)
            };
            const reservation = await createReservation(data);

            confirmationPanel.innerHTML = `
                <h2>Booking Confirmed!</h2>
                <p>Your reference number is:</p>
                <h3>${reservation.referenceNumber}</h3>
                <p>Movie: ${reservation.movieTitle}</p>
                <p>Start: ${reservation.startTime}</p>
                <p>Theatre: ${reservation.theatreNumber}</p>
                <ul>
                    ${reservation.seats.map(seat => `<li>Row ${seat.rowNumber}, Seat ${seat.seatNumber}</li>`).join("")}
                </ul>
                <button id="done-btn">Back to Movies</button>
            `;
            document.getElementById("done-btn").addEventListener("click", () => {
                window.location.hash = "#/";
            });
        } catch (err) {
            confirmationPanel.innerHTML = `
                <h2>Booking Failed</h2>
                <p>${err.message}</p>
                <button id="retry-btn">Go back</button>
            `;
            document.getElementById("retry-btn").addEventListener("click", () => {
                 overlay.style.display = "none";
                 confirmationPanel.style.display = "none";
                 // Re-render confirm layout
                 render(container, params); 
            });
        }
    });
}

export default { render };
