const params = new URLSearchParams(window.location.search);
const theatreId = params.get("id");

console.log("theatreId:", theatreId);

import {getTheatreById, updateTheatre, } from "../services/theatresService.js";

document.addEventListener("DOMContentLoaded", async () => {
    const theatre = await getTheatreById(theatreId);


    document.getElementById("numberOfRows").value = theatre.numberOfRows;
    document.getElementById("seatsPerRow").value = theatre.seatsPerRow;
    document.getElementById("editTheatreForm").addEventListener("submit", handleSubmit);
});

async function handleSubmit(event) {
    event.preventDefault();

    const numberOfRows = document.getElementById("numberOfRows").value;
    const seatsPerRow = document.getElementById("seatsPerRow").value;

    try {
        await updateTheatre(theatreId, {theatreId, numberOfRows, seatsPerRow});
        window.location.href = "theatres.html";
    } catch (err) {
        document.getElementById("message").textContent = "Error: " + err.message;
    }
}