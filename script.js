// script.js

// Utility to get from localStorage safely
function getStored(key) {
  return localStorage.getItem(key) || "N/A";
}

// Store selected value and redirect
function storeAndRedirect(key, value, url) {
  if (!value) {
    alert("Please select a valid option.");
    return;
  }
  localStorage.setItem(key, value);
  window.location.href = url;
}

// Movie data per location with posters and showtimes
const movieData = {
  Hyderabad: [
    { name: "RRR", poster: "images/rrr.jpeg", showTimes: ["10:00 AM", "3:00 PM", "7:30 PM"] },
    { name: "KGF", poster: "images/kgf.jpeg", showTimes: ["11:30 AM", "4:00 PM", "8:00 PM"] },
    { name: "Pushpa", poster: "images/pushpa.jpeg", showTimes: ["12:00 PM", "5:00 PM", "9:00 PM"] },
  ],
  Bangalore: [
    { name: "Inception", poster: "images/inception.jpg", showTimes: ["10:30 AM", "2:30 PM", "6:30 PM"] },
    { name: "Avatar", poster: "images/avatar.jpeg", showTimes: ["11:00 AM", "3:30 PM", "7:00 PM"] },
    { name: "The Batman", poster: "images/batman.jpeg", showTimes: ["1:00 PM", "5:00 PM", "9:00 PM"] },
  ],
  Chennai: [
    { name: "Vikram", poster: "images/vikram.jpeg", showTimes: ["9:30 AM", "1:30 PM", "6:00 PM"] },
    { name: "Jailer", poster: "images/jailer.jpg", showTimes: ["12:30 PM", "4:30 PM", "8:30 PM"] },
    { name: "Leo", poster: "images/leo.jpg", showTimes: ["11:15 AM", "3:45 PM", "7:15 PM"] },
  ],
};

// Theater data: theaters per movie
const theaterData = {
  RRR: ["PVR Cinemas", "INOX", "Cinepolis"],
  KGF: ["PVR Cinemas", "INOX"],
  Pushpa: ["Cinepolis", "Carnival Cinemas"],
  Inception: ["PVR Cinemas", "IMAX"],
  Avatar: ["IMAX", "INOX"],
  "The Batman": ["PVR Cinemas", "Cinepolis"],
  Vikram: ["Carnival Cinemas", "Cinepolis"],
  Jailer: ["PVR Cinemas", "INOX"],
  Leo: ["IMAX", "Carnival Cinemas"],
};

// Theater posters mapping
const theaterPosters = {
  "PVR Cinemas": "images/pvr.jpg",
  INOX: "images/inox.jpg",
  Cinepolis: "images/cinepolis.jpeg",
  "Carnival Cinemas": "images/carnival.jpeg",
  IMAX: "images/imax.jpeg",
};

// Utility to get next 3 dates starting today formatted like "Aug 3"
function getNextThreeDates() {
  const dates = [];
  const options = { month: "short", day: "numeric" };
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toLocaleDateString(undefined, options));
  }
  return dates;
}

// Load movies for selected location with dates and showtimes dropdown
function loadMovies() {
  const location = getStored("location");
  const list = document.getElementById("movieList");
  if (!movieData[location]) {
    list.innerHTML = "<p>No movies found for this location.</p>";
    return;
  }
  list.innerHTML = "";
  const dates = getNextThreeDates();

  movieData[location].forEach((movie) => {
    const card = document.createElement("div");
    card.className = "movie-card";

    // Create date options HTML
    const dateOptions = dates
      .map((date) => `<option value="${date}">${date}</option>`)
      .join("");
    // Create showtimes dropdown options HTML
    const showTimeOptions = movie.showTimes
      .map((time) => `<option value="${time}">${time}</option>`)
      .join("");

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.name}">
      <p>${movie.name}</p>

      <label for="dateSelect_${movie.name}">Select Date:</label><br/>
      <select id="dateSelect_${movie.name}" class="date-select">
        <option value="">-- Select Date --</option>
        ${dateOptions}
      </select>

      <label for="timeSelect_${movie.name}">Select Show Time:</label><br/>
      <select id="timeSelect_${movie.name}" class="date-select">
        <option value="">-- Select Time --</option>
        ${showTimeOptions}
      </select>

      <button onclick="
        const selectedDate = document.getElementById('dateSelect_${movie.name}').value;
        const selectedTime = document.getElementById('timeSelect_${movie.name}').value;
        if(!selectedDate) {
          alert('Please select a date.');
          return;
        }
        if(!selectedTime) {
          alert('Please select a show time.');
          return;
        }
        localStorage.setItem('movie', '${movie.name}'.trim());
        localStorage.setItem('movieDate', selectedDate);
        localStorage.setItem('movieTime', selectedTime);
        window.location.href='theaters.html';
      ">Select</button>
    `;

    list.appendChild(card);
  });
}

// Load theaters for selected movie with posters
function loadTheaters() {
  const movie = getStored("movie").trim();
  console.log("Retrieved movie:", getStored("movie"));
  console.log("Setting movie:", movie.name);
  const list = document.getElementById("theaterList");
  if (!theaterData[movie]) {
    list.innerHTML = "<p>No theaters found for this movie.</p>";
    return;
  }
  list.innerHTML = "";
  theaterData[movie].forEach((theater) => {
    const card = document.createElement("div");
    card.className = "theater-card";
    const poster = theaterPosters[theater] || "images/theater_placeholder.jpg";
    card.innerHTML = `
      <img src="${poster}" alt="${theater}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;margin-bottom:8px;">
      <p>${theater}</p>
      <button onclick="storeAndRedirect('theater', '${theater}', 'booking.html')">Select</button>
    `;
    list.appendChild(card);
  });
}

// --- Seat booking logic for booking.html ---
if (window.location.pathname.endsWith("booking.html")) {
  const selectedMovie = getStored("movie");
  const selectedTheater = getStored("theater");
  const movieDate = getStored("movieDate") || "N/A";
  const movieTime = getStored("movieTime") || "N/A";

  // Show movie, theater, date and showtime in #bookingInfo container
  const bookingInfo = document.getElementById("bookingInfo");
  if (bookingInfo) {
    bookingInfo.innerHTML = `
      <strong>Movie:</strong> ${selectedMovie}<br>
      <strong>Theater:</strong> ${selectedTheater}<br>
      <strong>Date:</strong> ${movieDate}<br>
      <strong>Show Time:</strong> ${movieTime}
    `;
  }

  // Set background to selected movie poster with dark overlay
  function findPosterByMovie(name) {
    for (const loc in movieData) {
      const movie = movieData[loc].find((m) => m.name === name);
      if (movie) return movie.poster;
    }
    return null;
  }
  const posterUrl = findPosterByMovie(selectedMovie);
  if (posterUrl) {
    document.body.style.backgroundImage = `url('${posterUrl}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundRepeat = "no-repeat";

    // Dark overlay behind content for readability
    let overlay = document.getElementById("darkOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "darkOverlay";
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "rgba(0,0,0,0.65)";
      overlay.style.zIndex = "-1";
      document.body.appendChild(overlay);
    }
  }

  const seatMap = document.getElementById("seatMap");
  const selectedSeatsDisplay = document.getElementById("selectedSeatsDisplay");
  const totalSeats = 40; // number of seats
  const bookedSeatsKey = `bookedSeats_${selectedMovie}_${selectedTheater}`;
  let bookedSeats = JSON.parse(localStorage.getItem(bookedSeatsKey)) || [];
  let selectedSeats = [];

  function updateSelectedSeatsDisplay() {
    if (selectedSeatsDisplay) {
      selectedSeatsDisplay.textContent = selectedSeats.length
        ? selectedSeats.sort((a, b) => a - b).join(", ")
        : "None";
    }
  }

  function renderSeats() {
    if (!seatMap) return;
    seatMap.innerHTML = "";
    for (let i = 1; i <= totalSeats; i++) {
      const seat = document.createElement("div");
      seat.className = "seat";
      seat.dataset.seatNumber = i;
      if (bookedSeats.includes(i)) seat.classList.add("booked");
      if (selectedSeats.includes(i)) seat.classList.add("selected");
      seat.addEventListener("click", () => {
        if (seat.classList.contains("booked")) return;
        if (seat.classList.contains("selected")) {
          seat.classList.remove("selected");
          selectedSeats = selectedSeats.filter((s) => s !== i);
        } else {
          seat.classList.add("selected");
          selectedSeats.push(i);
        }
        updateSelectedSeatsDisplay();
      });
      seatMap.appendChild(seat);
    }
    updateSelectedSeatsDisplay();
  }

  window.confirmBooking = function () {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    const userName =
      document.getElementById("userName").value.trim() || "Guest";

    bookedSeats = Array.from(new Set([...bookedSeats, ...selectedSeats]));
    localStorage.setItem(bookedSeatsKey, JSON.stringify(bookedSeats));
    localStorage.setItem("user", userName);
    localStorage.setItem("seats", selectedSeats.sort((a, b) => a - b).join(", "));

    // Store date and time for receipt
    localStorage.setItem("movieDate", movieDate);
    localStorage.setItem("movieTime", movieTime);

    // Redirect to payment page instead of receipt
    window.location.href = "payment.html";
  };

  window.resetSelection = function () {
    selectedSeats = [];
    document.getElementById("userName").value = "";
    renderSeats();
  };

  renderSeats();
}
