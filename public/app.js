const movieForm = document.getElementById("movie-form");
const movieList = document.getElementById("movie-list");
const formMessage = document.getElementById("form-message");
const listMessage = document.getElementById("list-message");
const refreshButton = document.getElementById("refresh-btn");
const cardTemplate = document.getElementById("movie-card-template");

function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.style.color = isError ? "#ae2f32" : "#6f5a47";
}

function showListMessage(message, isError = false) {
  listMessage.textContent = message;
  listMessage.style.color = isError ? "#ae2f32" : "#6f5a47";
}

function formatValue(value, fallback = "Not provided") {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return value;
}

function buildPayload(form) {
  const formData = new FormData(form);

  return {
    title: formData.get("title")?.trim(),
    director: formData.get("director")?.trim(),
    genre: formData.get("genre")?.trim(),
    releaseYear: formData.get("releaseYear"),
    rating: formData.get("rating"),
    duration: formData.get("duration"),
    language: formData.get("language")?.trim()
  };
}

async function fetchMovies() {
  showListMessage("Loading movies...");

  try {
    const response = await fetch("/api/movies");
    const movies = await response.json();

    if (!response.ok) {
      throw new Error(movies.message || "Failed to fetch movies");
    }

    renderMovies(movies);
    showListMessage(`${movies.length} movie(s) loaded.`);
  } catch (error) {
    movieList.innerHTML = "";
    showListMessage(error.message, true);
  }
}

function renderMovies(movies) {
  movieList.innerHTML = "";

  if (!movies.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "No movies found yet. Add your first one above.";
    movieList.appendChild(emptyState);
    return;
  }

  movies.forEach((movie) => {
    const fragment = cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".movie-card");
    const deleteButton = fragment.querySelector(".delete-button");
    const editForm = fragment.querySelector(".inline-edit-form");
    const ratingInput = fragment.querySelector(".edit-rating");
    const durationInput = fragment.querySelector(".edit-duration");

    fragment.querySelector(".movie-title").textContent = movie.title;
    fragment.querySelector(".movie-meta").textContent =
      `${movie.director} • Rating: ${formatValue(movie.rating, "N/A")}`;
    fragment.querySelector(".movie-genre").textContent = formatValue(movie.genre);
    fragment.querySelector(".movie-year").textContent = formatValue(movie.releaseYear);
    fragment.querySelector(".movie-language").textContent = formatValue(movie.language);
    fragment.querySelector(".movie-created").textContent = new Date(
      movie.createdAt
    ).toLocaleString();

    ratingInput.value = movie.rating ?? "";
    durationInput.value = movie.duration ?? "";

    deleteButton.addEventListener("click", async () => {
      const confirmed = window.confirm(`Delete "${movie.title}"?`);

      if (!confirmed) {
        return;
      }

      await deleteMovie(movie._id);
    });

    editForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await updateMovie(movie._id, {
        rating: ratingInput.value,
        duration: durationInput.value
      });
    });

    card.dataset.id = movie._id;
    movieList.appendChild(fragment);
  });
}

async function createMovie(event) {
  event.preventDefault();
  showFormMessage("Saving movie...");

  try {
    const response = await fetch("/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildPayload(movieForm))
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not save movie");
    }

    movieForm.reset();
    movieForm.language.value = "English";
    showFormMessage(`"${data.title}" added successfully.`);
    await fetchMovies();
  } catch (error) {
    showFormMessage(error.message, true);
  }
}

async function deleteMovie(id) {
  showListMessage("Deleting movie...");

  try {
    const response = await fetch(`/api/movies/${id}`, {
      method: "DELETE"
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not delete movie");
    }

    showListMessage(data.message);
    await fetchMovies();
  } catch (error) {
    showListMessage(error.message, true);
  }
}

async function updateMovie(id, updates) {
  showListMessage("Saving quick edit...");

  try {
    const response = await fetch(`/api/movies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updates)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not update movie");
    }

    showListMessage(`Updated "${data.title}" successfully.`);
    await fetchMovies();
  } catch (error) {
    showListMessage(error.message, true);
  }
}

movieForm.addEventListener("submit", createMovie);
refreshButton.addEventListener("click", fetchMovies);

fetchMovies();
