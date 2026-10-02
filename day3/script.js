let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  // Convert the search word to lowercase
  const searchWord = word.toLowerCase();

  // Filter the array to only keep notes where the lowercased text includes the lowercased word
  return notes.filter((note) => note.text.toLowerCase().includes(searchWord));
}

// --- searchNotes Tests ---
// Normal case: Searching for a word we know is there (and testing case insensitivity)
console.log("Search 'javascript':", searchNotes("javascript"));
// Expected output: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

// Edge case: Searching for a word that does not exist
console.log("Search 'apple':", searchNotes("apple"));
// Expected output: []

function longestNote() {
  // 1. Handle the empty array first: if there are no notes, return null
  if (notes.length === 0) {
    return null;
  }

  // 2. Start by assuming the very first note is the longest
  let longest = notes[0];

  // 3. Loop through the rest of the notes to compare lengths
  for (let i = 1; i < notes.length; i++) {
    // If the current note's text is longer than our saved 'longest' note's text...
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i]; // ...replace it as the new longest note
    }
  }

  return longest;
}

// --- longestNote Tests ---
// Normal case: Finds the longest string in our standard array
console.log("Longest note:", longestNote());
// Expected output: { id: 3, text: "Email the project report to Grace", category: "work" }

// Edge case: What happens if there are no notes at all?
// (We will temporarily empty the array, test the function, and put them back)
const savedNotes = notes; // Save our notes
notes = []; // Empty the array completely
console.log("Longest note (when array is empty):", longestNote());
// Expected output: null
notes = savedNotes; // Put our notes back for the next functions

// --- Function 3: countByCategory ---
function countByCategory() {
  let counts = {}; // Create an empty object to hold our tallies

  for (let i = 0; i < notes.length; i++) {
    let category = notes[i].category;

    // If we have seen this category before, add 1. If not, start it at 1.
    if (counts[category]) {
      counts[category]++;
    } else {
      counts[category] = 1;
    }
  }
  return counts;
}

// --- countByCategory Tests ---
// Normal case: Counts the categories in our standard array
console.log("Category counts:", countByCategory());
// Expected output: { personal: 2, study: 2, work: 1 }

// Edge case: Empty array should return an empty object
const savedForCount = notes;
notes = [];
console.log("Category counts (empty array):", countByCategory());
// Expected output: {}
notes = savedForCount; // Restore notes

// --- Function 4: getSummary ---
function getSummary() {
  const counts = countByCategory(); // Run our previous function to get the math
  const total = notes.length;

  // Rule for exactly one note
  const word = total === 1 ? "note" : "notes";

  // Get counts, defaulting to 0 if a category doesn't exist yet
  const personal = counts.personal || 0;
  const work = counts.work || 0;
  const study = counts.study || 0;

  // Build the sentence using a template literal (backticks)
  return `${total} ${word}: ${personal} personal, ${work} work, ${study} study.`;
}

// --- getSummary Tests ---
// Normal case: Testing the plural "notes" with multiple items
console.log("Summary:", getSummary());
// Expected output: "5 notes: 2 personal, 1 work, 2 study."

// Edge case: Testing the singular "note" grammar rule
const savedForSummary = notes;
notes = [{ id: 1, text: "Just one thing", category: "work" }]; // Fake array with 1 note
console.log("Summary (single note):", getSummary());
// Expected output: "1 note: 0 personal, 1 work, 0 study."
notes = savedForSummary; // Restore notes

// --- Function 5: isDuplicate ---
function isDuplicate(text) {
  // Clean up the text we are checking: remove extra spaces and make it lowercase
  const cleanText = text.trim().toLowerCase();

  // .some() returns true if AT LEAST ONE note matches our condition
  return notes.some((note) => note.text.trim().toLowerCase() === cleanText);
}

// --- isDuplicate Tests ---
// Normal case: Check a note we know is there (testing weird spacing/capitalization)
console.log("Is duplicate ('  CALL MUM  '):", isDuplicate("  CALL MUM  "));
// Expected output: true

// Edge case: Check a brand new note
console.log("Is duplicate ('Walk the dog'):", isDuplicate("Walk the dog"));
// Expected output: false

// --- Function 6: addNote ---
function addNote(text, category) {
  // Rule 1: Check length (1 to 200 characters)
  if (text.length < 1 || text.length > 200) {
    console.log("Failed: Note must be between 1 and 200 characters.");
    return false;
  }

  // Rule 2: Check category
  if (category !== "personal" && category !== "work" && category !== "study") {
    console.log("Failed: Category must be personal, work, or study.");
    return false;
  }

  // Rule 3: Check for duplicates using our previous function
  if (isDuplicate(text)) {
    console.log("Failed: This note already exists.");
    return false;
  }

  // If it passes all rules, figure out the next ID and add the note!
  const nextId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;

  notes.push({
    id: nextId,
    text: text,
    category: category,
  });

  return true;
}

// --- addNote Tests ---
// Normal case: Adding a perfectly valid note
console.log("Add valid note:", addNote("Walk the dog", "personal"));
// Expected output: true

// Edge case 1: Breaking the duplicate rule
console.log("Add duplicate note:", addNote("Call mum", "personal"));
// Expected output: Failed: This note already exists. (followed by false)

// Edge case 2: Breaking the category rule
console.log("Add bad category:", addNote("Buy groceries", "home"));
// Expected output: Failed: Category must be personal, work, or study. (followed by false)
