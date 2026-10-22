// 1. Select all required elements
const loadUsersBtn = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusText = document.getElementById("status");
const usersList = document.getElementById("users-list");

// Array to store the fetched users in memory so we don't have to fetch them again to filter
let allUsers = [];

// 2. Fetch function using async/await and try/catch/finally
async function loadUsers() {
  try {
    // Disable button and show loading status
    loadUsersBtn.disabled = true;
    statusText.textContent = "Loading users...";
    statusText.style.color = "blue";

    // Fetch data from the API
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON data
    allUsers = await response.json();

    // Show success status
    statusText.textContent = `Success! Loaded ${allUsers.length} users.`;
    statusText.style.color = "green";

    // Draw the users on the screen
    renderUsers(allUsers);
  } catch (error) {
    // Handle any errors (like a broken URL or network failure)
    statusText.textContent = `Error loading users: ${error.message}`;
    statusText.style.color = "red";
  } finally {
    // Re-enable the button regardless of success or failure
    loadUsersBtn.disabled = false;
  }
}

// 3. Render function to draw the list
function renderUsers(list) {
  // Clear the current list
  usersList.textContent = "";

  // Check for empty filter results
  if (list.length === 0 && allUsers.length > 0) {
    const noMatchLi = document.createElement("li");
    noMatchLi.textContent = "No users match your filter.";
    usersList.appendChild(noMatchLi);
    return;
  }

  // Create elements for each user
  list.forEach((user) => {
    const li = document.createElement("li");
    li.style.marginBottom = "10px";

    // The API returns nested objects for address and company
    const userInfo = `Name: ${user.name} | Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;

    li.textContent = userInfo;
    usersList.appendChild(li);
  });
}

// 4. Filter event listener
filterInput.addEventListener("input", () => {
  const searchTerm = filterInput.value.toLowerCase().trim();

  // Filter the stored array without making a new network request
  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm),
  );

  renderUsers(filteredUsers);
});

// 5. Attach click event to the Load button
loadUsersBtn.addEventListener("click", loadUsers);
