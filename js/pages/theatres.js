import {getTheatres, createTheatre,deleteTheatre } from "../services/theatresService.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadTheatres();
    document.getElementById("theatreForm").addEventListener("submit", handleSubmit);
});


async function loadTheatres() {
    const theatres = await getTheatres();
    const container = document.getElementById("theatresContainer");
    container.innerHTML = "";
    theatres.forEach(theatre => {
        const theatreDiv = document.createElement("div");
        theatreDiv.classList.add("theatre");
        theatreDiv.innerHTML = `
            <h3>Theatre ${theatre.theatreNumber}</h3>
            <p>Number of rows: ${theatre.numberOfRows}</p>
            <p>Seats per row: ${theatre.seatsPerRow}</p>
        `;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => handleDelete(theatre.theatreId));
        theatreDiv.appendChild(deleteButton);
        container.appendChild(theatreDiv);
    });
}

async function handleSubmit(event) {
    event.preventDefault();

    const theatreNumber = document.getElementById("theatreNumber").value;
    const numberOfRows = document.getElementById("numberOfRows").value;
    const seatsPerRow = document.getElementById("seatsPerRow").value;

    try {
        await createTheatre({theatreNumber, numberOfRows, seatsPerRow, cinemaId: 1});
        const message = document.getElementById("message");
        message.textContent = "Theatre created!";
        message.style.color = "green";
        await loadTheatres();
    } catch (err) {
        const message = document.getElementById("message");
        message.textContent = "Error: " + err.message;
        message.style.color = "red";
    }
}

async function handleDelete(theatreId) {
    const confirmed = confirm("Are you sure you want to delete this theatre?");

    if (!confirmed) {
        return; // user cancelled
    }

    try {
        await (deleteTheatre(theatreId));
        window.location.href = "theatres.html";
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}
