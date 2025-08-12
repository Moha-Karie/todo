import { baseUrl } from "./login";

document.addEventListener("DOMContentLoaded", function () {
  getDashboardSummary();
  getTodos("all", 1); // Initially load the first page of all todos
  trackTabVisibility(
    "pending" || "completed" || "overDue" || "dueDate" || "prioritized"
  );
});

// Dashboard Summary
const getDashboardSummary = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      window.location.href = "index.html"; // Redirect if no token
      return;
    }

    const response = await fetch(`${baseUrl}/users/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    // console.log(data)

    if (response) {
      // Display only the count numbers
      document.getElementById("allTodosCount").textContent =
        data.todosStats.totalTodosCount;
      document.getElementById("completedTodosList").textContent =
        data.todosStats.completedTodosCount;
      document.getElementById("pendingTodosList").textContent =
        data.todosStats.pendingTodosCount;
      document.getElementById("overDueTodosList").textContent =
        data.todosStats.overdueTodosCount;
      document.getElementById("dueDateTodosCount").textContent =
        data.todosStats.dueDateTodosCount;
      document.getElementById("prioritizedTodosList").textContent =
        data.todosStats.prioritizedTodosCount;
    } else {
      alert(data.message || "Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    alert("Failed to load dashboard. Please try again.");
  }
};

// Add or Edit Todo
const todoForm = document.querySelector("#todo-form");

todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.querySelector("#id").value;
  const name = document.querySelector("#name").value;
  const description = document.querySelector("#description").value;
  const dueDateInput = document.querySelector("#dueDate").value;
  const dueDate = dueDateInput ? dueDateInput : null;

  // priority options

  const priority = document.querySelector("#todoPriority").value;

  // const priority = prioritySelect ? prioritySelect.value : "Not Prioritized";

  console.log(priority);

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return alert("You are not allowed");
  }

  try {
    if (id) {
      const response = await fetch(
        `${baseUrl}/todos/editTodo/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            todoName: name,
            priority,
            description,
            dueDate,
          }),
        }
      );
      await response.json();

      resetForm();
      getDashboardSummary();
      trackTabVisibility(
        "pending" || "completed" || "overDue" || "dueDate" || "prioritized"
      );
      // getTodos("completed")
    } else {
      const response = await fetch(`${baseUrl}/todos/addTodos1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          todoName: name,
          priority,
          description,
          dueDate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        resetForm();
      } else {
        alert(data.error);
      }

      getDashboardSummary();
    }
    getTodos("all", 1); // Load first page after adding a new todo
    trackTabVisibility(
      "pending" || "completed" || "overDue" || "dueDate" || "prioritized"
    );
  } catch (err) {
    console.log("error => ", err);
  }
});

// Helper function to format date in a user-friendly way (e.g., Sat, Feb 02, 2025)
const formatDate = (dateString) => {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

// Get Todos with Pagination
const getTodos = async (status, page) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("You are not allowed!");
      return;
    }

    let url = `${baseUrl}/todos/viewTodos?page=${page}`;
    // ${baseUrl}/todos/viewTodos?page=1
    if (status === "completed") {
      url = `${baseUrl}/todos/viewTodos/completed?page=${page}`;
    } else if (status === "pending") {
      url = `${baseUrl}/todos/viewTodos/pending?page=${page}`;
    } else if (status === "overDue") {
      url = `${baseUrl}/todos/viewTodos/overDued?page=${page}`;
    } else if (status === "dueDate") {
      url = `${baseUrl}/todos/viewTodos/dueDate?page=${page}`;
    } else if (status === "prioritized") {
      url = `${baseUrl}/todos/viewTodos/prioritized?page=${page}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    let html = "";
    if (data.todos.length == 0 && status == "all") {
      html = `<tr><td colspan="6" style="text-align: center;">No todos created Yet</td></tr>`;
    } else if (data.todos.length === 0) {
      html = `<tr><td colspan="6" style="text-align: center;">No <span style="color: red;">${status}</span> todos found</td></tr>`;
    } else {
      data.todos.forEach((todo) => {
        const todoString = JSON.stringify(todo);
        const buttonText = todo.completed
          ? `<i class="fas fa-hourglass-half" style="color: white;"></i>`
          : `<i class="fas fa-check-square" style="color: white;"></i>`;
        const apiUrl = todo.completed
          ? `${baseUrl}/todos/pendTodo/${todo._id}`
          : `${baseUrl}/todos/completeTodo/${todo._id}`;

        html += `<tr>
          <td style="text-align: left; vertical-align: middle; width: 200px">${
            todo.todoName
          }</td>
          <td>${todo.description}</td>
          <td style="text-align: center; vertical-align: middle; width: 140px">${
            todo.dueDate ? formatDate(todo.dueDate) : "N/A"
          }</td> 
          <td style="width: 60px; text-align: center;"> ${
            todo.priority === "High"
              ? `<i class="fas fa-angles-up" style="color: #dc3545;"></i>`
              : todo.priority === "Medium"
              ? `<i class="fas fa-grip-lines" style="color: #ffc107;"></i>`
              : todo.priority === "Low"
              ? `<i class="fas fa-arrow-down" style="color: #198754;"></i>`
              : `<i class="fas fa-ban" style="color: #6c757d;"></i>`
          }</td>
         <td style="text-align: center; vertical-align: middle; width: 100px">${
           todo.completed
             ? `<span><i class="fas fa-check-square" style="color: green;"></i></span> Completed`
             : todo.dueDate &&
               new Date(todo.dueDate).toDateString() ===
                 new Date().toDateString()
             ? `<span><i class="fas fa-clock" style="color: purple;"></i></span> Today`
             : todo.dueDate &&
               new Date(todo.dueDate).getTime() <
                 new Date().setHours(0, 0, 0, 0) &&
               !todo.completed
             ? `<span><i class="fas fa-exclamation-triangle" style="color: red;"></i></span> OverDue`
             : `<span><i class="fas fa-hourglass-half" style="color: orange;"></i></span> Pending`
         }</td>


          <td style="text-align: center; vertical-align: middle; width: 150px">
            <button class="edit-button" todo='${todoString}'><i class="fas fa-edit"></i></button>
            <button class="delete-button" todo-id="${
              todo._id
            }"><i class="fas fa-trash"></i></button>
            <button class="complete-button" todo-id="${
              todo._id
            }" data-api="${apiUrl}" style="background-color: ${
          todo.completed ? "orange" : "green"
        }">${buttonText}</button>
          </td>
        </tr>`;
      });
    }

    document.querySelector("#todoTableBody").innerHTML = html;

    // Ensure pagination is set per status
    if (data.totalPages > 1) {
      setupPagination(data.totalPages, page, status);
    } else {
      document.querySelector("#paginationContainer").innerHTML = ""; // Remove pagination if not needed
    }

    tableActions();
  } catch (err) {
    console.log("Error fetching todos:", err);
  }
};

// Pagination setup
const setupPagination = (totalPages, currentPage, status) => {
  const paginationContainer = document.querySelector("#paginationContainer");
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return; // No pagination needed if only one page

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("pagination-button");

    if (i === currentPage) {
      pageButton.classList.add("active");
      pageButton.disabled = true;
    }

    pageButton.addEventListener("click", () => {
      getTodos(status, i); // Load the correct status page
    });

    paginationContainer.appendChild(pageButton);
  }
};

// Delete Todo
const deleteTodo = async (id, activeTab) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return alert("You are not authorized");
  }

  const response = await fetch(
    `${baseUrl}/todos/deleteTodo/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  await response.json();
  resetForm();
  getDashboardSummary();
  trackTabVisibility(
    "pending" || "completed" || "overDue" || "dueDate" || "prioritized"
  );
  // Reload the todos for the current active tab (passed as a parameter)
  getTodos(activeTab, 1); // activeTab indicates whether it's "completed", "pending", or "overdue"

  alert("Deleted Successfully");
};

// Table Actions (Edit, Delete, Mark as Complete/Pending)
const tableActions = () => {
  const deleteBtns = document.querySelectorAll(".delete-button");

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("todo-id");
      deleteTodo(id, activeTab);
    });
  });

  const editBtns = document.querySelectorAll(".edit-button");

  // Function to format ISO date to yyyy-MM-dd
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Parse the ISO string
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
    const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`; // Format as yyyy-MM-dd
  };

  editBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const todo = JSON.parse(btn.getAttribute("todo"));

      document.querySelector("#id").value = todo._id;
      document.querySelector("#name").value = todo.todoName;
      document.querySelector("#description").value = todo.description;
      document.querySelector("#todoPriority").value = todo.priority;
      // Format the dueDate before assigning it to the input
      const formattedDueDate = formatDate(todo.dueDate);
      document.querySelector("#dueDate").value = formattedDueDate;

      document.querySelector("#submit-btn").value = "UPDATE";
    });
  });

  const completeBtns = document.querySelectorAll(".complete-button");

  completeBtns.forEach((completeBtn) => {
    completeBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const id = completeBtn.getAttribute("todo-id");
      const apiUrl = completeBtn.getAttribute("data-api");
      const token = localStorage.getItem("accessToken");

      if (!id) {
        console.error("Todo ID is missing!");
        return;
      }

      if (!token) {
        alert("You are not authorized");
        return;
      }

      try {
        const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          const newButtonText =
            completeBtn.textContent.trim() === "Complete" ? "Pend" : "Complete";
          completeBtn.textContent = newButtonText;

          alert(
            `Todo marked as ${
              newButtonText === "Pend" ? "Pending" : "Completed"
            }!`
          );
          getTodos("all", 1); // Refresh the list
          getDashboardSummary();
          trackTabVisibility(
            "pending" || "completed" || "overDue" || "dueDate" || "prioritized"
          );
        } else {
          alert(data.message || "Failed to update todo status");
        }
      } catch (error) {
        console.error("Error updating todo:", error);
        alert("Something went wrong. Try again.");
      }
    });
  });
};

// Reset Form
const resetForm = () => {
  document.querySelector("#id").value = "";
  document.querySelector("#name").value = "";
  document.querySelector("#description").value = "";
  document.querySelector("#dueDate").value = "";
  document.querySelector("#submit-btn").value = "ADD";
  document.querySelector("#todoPriority").selectedIndex = 0;
};

// Filter Tabs Event Listeners

let activeTab = "all"; // Default tab
document.getElementById("all-tab").addEventListener("click", () => {
  activeTab = "all"; // Set status to "all"
  getTodos(activeTab, 1);
});

const trackTabVisibility = async (status) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("You are not allowed!");
      return;
    }

    const statuses = [
      "completed",
      "pending",
      "overDue",
      "dueDate",
      "prioritized",
    ];
    let todosData = {};

    // Fetch todos data for all statuses
    for (const stat of statuses) {
      let url = `${baseUrl}/todos/viewTodos`;
      if (stat === "completed") {
        url = `${baseUrl}/todos/viewTodos/completed`;
      } else if (stat === "pending") {
        url = `${baseUrl}/todos/viewTodos/pending`;
      } else if (stat === "overDue") {
        url = `${baseUrl}/todos/viewTodos/overDued`;
      } else if (stat === "dueDate") {
        url = `${baseUrl}/todos/viewTodos/dueDate`;
      } else if (stat === "prioritized") {
        url = `${baseUrl}/todos/viewTodos/prioritized`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      todosData[stat] = data.todos.length;
    }

    const completedTab = document.getElementById("completed-tab");
    const pendingTab = document.getElementById("pending-tab");
    const overDueTab = document.getElementById("overDue-tab");
    const dueDateTab = document.getElementById("dueDate-tab");
    const prioritizedTab = document.getElementById("prioritized-tab");

    console.log(todosData);
    // Dynamically show/hide tabs based on the status count

    if (todosData.dueDate === 0) {
      dueDateTab.style.display = "none";
    } else {
      dueDateTab.style.display = "inline";
    }

    if (todosData.completed === 0) {
      completedTab.style.display = "none";
    } else {
      completedTab.style.display = "inline";
    }

    if (todosData.pending === 0) {
      pendingTab.style.display = "none";
    } else {
      pendingTab.style.display = "inline";
    }

    if (todosData.overDue === 0) {
      overDueTab.style.display = "none";
    } else {
      overDueTab.style.display = "inline";
    }
    if (todosData.prioritized === 0) {
      prioritizedTab.style.display = "none";
    } else {
      prioritizedTab.style.display = "inline";
    }

    // Event listeners for tab click
    dueDateTab.addEventListener("click", (e) => {
      e.preventDefault();
      activeTab = "dueDate";
      getTodos(activeTab, 1);
    });

    completedTab.addEventListener("click", (e) => {
      e.preventDefault();
      activeTab = "completed";
      getTodos(activeTab, 1);
    });
    pendingTab.addEventListener("click", (e) => {
      e.preventDefault();
      activeTab = "pending";
      getTodos(activeTab, 1);
    });
    overDueTab.addEventListener("click", (e) => {
      e.preventDefault();
      activeTab = "overDue";
      getTodos(activeTab, 1);
    });

    prioritizedTab.addEventListener("click", (e) => {
      e.preventDefault();
      activeTab = "prioritized";
      getTodos(activeTab, 1);
    });
  } catch (e) {
    console.log("Error fetching todos:", e);
  }
};
trackTabVisibility(
  "pending" || "completed" || "overDue" || "dueDate" || "prioritized"
);
