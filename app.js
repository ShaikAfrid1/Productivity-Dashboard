function updateTime() {
  const now = new Date();

  const time = now.toLocaleTimeString();

  const date = now.toLocaleDateString();

  document.getElementById(`current-time`).textContent = time;
  document.getElementById("current-date").textContent = date;
}

setInterval(updateTime, 1000);

let quotes = [];

async function fetchQuotes() {
  try {
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const targetUrl = "https://zenquotes.io/api/quotes";
    const finalUrl = proxyUrl + encodeURIComponent(targetUrl);

    const res = await fetch(finalUrl);
    const data = await res.json();

    quotes = JSON.parse(data.contents);
    getRandomQuote();
  } catch (err) {
    console.error("Fetch failed:", err);
    document.getElementById("quote-text").textContent =
      "Unable to fetch Quotes...";
  }
}

function getRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById("quote-text").textContent = `"${quote.q}"`;
  document.getElementById("quote-author").textContent = quote.a
    ? `— ${quote.a}`
    : "— Unknown";
}

fetchQuotes();

const apiKey = "ad524db4dffa2652e1f697cbf593b090";

async function getWeather(city = "Chennai") {
  try {
    // Step 1: Get coordinates for the city
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city},IN&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();

    if (!geoData.length) {
      document.getElementById("weather").textContent = "❌ City not found.";
      return;
    }

    const { lat, lon, name: cityName, state, country } = geoData[0];

    // Step 2: Get weather using coordinates
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherRes.json();

    const temp = weatherData.main.temp;
    const desc = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;

    // Step 3: Display full info
    document.getElementById("weather").innerHTML = `
      <h4>📍 ${cityName}, ${state || country}</h4>
      <strong>${temp}°C</strong> - ${
      desc.charAt(0).toUpperCase() + desc.slice(1)
    }
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" style="vertical-align: middle;" />
    `;
  } catch (error) {
    document.getElementById("weather").textContent =
      "⚠ Error fetching weather.";
    console.error(error);
  }
}

getWeather();

const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-todo");
const list = document.getElementById("todo-list");

window.onload = () => {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  savedTodos.forEach((todo) => {
    createTodo(todo.text, todo.completed);
  });
};

addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") return;

  createTodo(text, false);
  saveTodo(text, false);
  input.value = ""; 
});

function createTodo(text, completed) {
  const li = document.createElement("li");
  li.innerText = text;
  if (completed) {
    li.classList.add("completed");
  }

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateLocalStorage();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Font Awesome trash icon
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent toggle when deleting
    li.remove();
    updateLocalStorage();
  });

  li.appendChild(deleteBtn);

  list.appendChild(li);
}

function saveTodo(text, completed) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push({ text, completed });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateLocalStorage() {
  const allTodos = [];
  document.querySelectorAll("#todo-list li").forEach((li) => {
    allTodos.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("todos", JSON.stringify(allTodos));
}
