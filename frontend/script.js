const API_URL = "https://books-api-wg2u.onrender.com/api/books";

const connection = document.getElementById("connection");
const connectionText = document.getElementById("connectionText");
const bookCount = document.getElementById("bookCount");
const apiStatus = document.getElementById("apiStatus");
const booksList = document.getElementById("books");
const notice = document.getElementById("notice");
const noticeTitle = document.getElementById("noticeTitle");
const noticeMessage = document.getElementById("noticeMessage");
const retryButton = document.getElementById("retryButton");
const refreshButton = document.getElementById("refreshButton");

let requestController;

function setConnection(isOnline) {
connection.classList.toggle("online", isOnline);
connection.classList.toggle("offline", !isOnline);

connectionText.textContent = isOnline
? "API Connected"
: "API Unavailable";

apiStatus.textContent = isOnline ? "Online" : "Offline";
}

function showNotice(title, message, type = "info", canRetry = false) {
notice.hidden = false;
notice.classList.toggle("error", type === "error");
noticeTitle.textContent = title;
noticeMessage.textContent = message;
retryButton.hidden = !canRetry;

const icon = notice.querySelector(".notice-icon");

icon.textContent =
type === "error" ? "!" : type === "empty" ? "▤" : "◌";

booksList.hidden = true;
}

function renderBooks(books) {
booksList.replaceChildren();

books.forEach((book, index) => {
const card = document.createElement("article");
card.className = "book-card";


const number = document.createElement("div");
number.className = "book-number";
number.textContent = `BOOK ${String(index + 1).padStart(2, "0")}`;

const title = document.createElement("h3");
title.textContent = book.title || "Untitled";

const authorLabel = document.createElement("span");
authorLabel.className = "author-label";
authorLabel.textContent = "Written by";

const author = document.createElement("p");
author.textContent = book.author || "Unknown author";

card.append(number, title, authorLabel, author);
booksList.appendChild(card);

});

bookCount.textContent = books.length;
notice.hidden = true;
booksList.hidden = books.length === 0;

if (books.length === 0) {
showNotice(
"Your shelf is waiting",
"There are no books in the collection yet. Check back when books become available.",
"empty"
);
}
}

async function loadBooks() {
if (requestController) {
requestController.abort();
}

requestController = new AbortController();

refreshButton.disabled = true;
bookCount.textContent = "—";
setConnection(false);

showNotice(
"Loading your collection",
"Connecting to the Books API. Please wait."
);

try {
const response = await fetch(API_URL, {
signal: requestController.signal,
headers: {
Accept: "application/json"
}
});

if (!response.ok) {
  throw new Error(`API returned status ${response.status}`);
}

const data = await response.json();

if (!Array.isArray(data.books)) {
  throw new Error("Unexpected API response");
}

setConnection(true);
renderBooks(data.books);

} catch (error) {
  if (error.name === "AbortError") {
    return;
  }

  console.error("Books API request failed:", error);

  bookCount.textContent = "—";
  setConnection(false);

  showNotice(
    "API unavailable",
    "We couldn't connect to the Books API. Check your connection and try again.",
    "error",
    true
  );
} finally {
  refreshButton.disabled = false;
}
}

retryButton.addEventListener("click", loadBooks);
refreshButton.addEventListener("click", loadBooks);

loadBooks();
