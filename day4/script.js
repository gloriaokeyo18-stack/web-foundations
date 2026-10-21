// 1. Grab all our HTML elements by their IDs
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

// 2. The main function that updates the numbers and colors
function updateCounts() {
  const text = noteText.value;
  const length = text.length;

  // Calculate words (split text by spaces, if it's completely empty, words = 0)
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  // Update the HTML text
  charCount.textContent = `${length} / 200 characters`;
  wordCount.textContent = `${words} words`;

  // Remove any previous color classes to reset it
  charCount.classList.remove("warning", "over");

  // Add colors back if the text is getting too long
  if (length > 200) {
    charCount.classList.add("over"); // Red and bold
  } else if (length > 180) {
    charCount.classList.add("warning"); // Orange
  }
}

// 3. A helper function to clear everything out
function clearEverything() {
  noteText.value = ""; // Empty the text box
  localStorage.removeItem("draftNote"); // Delete from browser memory
  updateCounts(); // Reset the counters back to 0
}

// 4. Listen for EVERY time the user types a letter
noteText.addEventListener("input", () => {
  updateCounts(); // Update the numbers
  localStorage.setItem("draftNote", noteText.value); // Save the newest text to memory
});

// 5. Listen for the 'Escape' key being pressed inside the textarea
noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearEverything();
  }
});

// 6. Listen for the Clear button click
clearBtn.addEventListener("click", clearEverything);

// 7. Listen for the Theme button click
themeToggle.addEventListener("click", () => {
  // Toggle adds the class if it's missing, or removes it if it's there
  document.body.classList.toggle("dark");

  // Check if the body now has the dark class, and save/update accordingly
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "Light mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "Dark mode";
    localStorage.setItem("theme", "light");
  }
});

// 8. PAGE LOAD LOGIC: What happens immediately when you open the page?

// A. Check memory to see if they were using Dark Mode previously
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "Light mode";
}

// B. Check memory to see if they left a half-finished note
const savedDraft = localStorage.getItem("draftNote");
if (savedDraft) {
  noteText.value = savedDraft; // Put the text back in the box
}

// C. Run the math once so the counters match whatever text was restored
updateCounts();
