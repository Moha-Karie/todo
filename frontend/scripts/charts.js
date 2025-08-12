// const baseUrl = "https://todo-app-p99r.onrender.com/api";

// Function to fetch data and update the chart and text elements
async function fetchData() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("You are not logged in. Please sign in.");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/users/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = "/index.html";
        return;
      }
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Update text content based on API response, rounded to nearest integer
    document.getElementById("allTodosCount").textContent = Math.round(
      data.todosStats.totalTodosCount
    );
    document.getElementById("completedTodosList").textContent = Math.round(
      data.todosStats.completedTodosCount
    );
    document.getElementById("pendingTodosList").textContent = Math.round(
      data.todosStats.pendingTodosCount
    );
    document.getElementById("overDueTodosList").textContent = Math.round(
      data.todosStats.overdueTodosCount
    );
    document.getElementById("dueDateTodosCount").textContent = Math.round(
      data.todosStats.dueDateTodosCount
    );
    document.getElementById("prioritizedTodosList").textContent = Math.round(
      data.todosStats.prioritizedTodosCount
    );

    // Update the chart data dynamically
    updateBarChart(data.todosStats);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

// Function to update the bar chart with new data
function updateBarChart(todosStats) {
  const todosData = {
    allTodos: Math.round(todosStats.totalTodosCount),
    dueDateTodos: Math.round(todosStats.dueDateTodosCount),
    pendingTodos: Math.round(todosStats.pendingTodosCount),
    completedTodos: Math.round(todosStats.completedTodosCount),
    overdueTodos: Math.round(todosStats.overdueTodosCount),
    prioritizedTodos: Math.round(todosStats.prioritizedTodosCount),
  };

  const ctx = document.getElementById("todosBarGraph").getContext("2d");

  const uniqueColors = [
    "lightskyblue", // Lighter Blue (CSS color name)
    "mediumpurple", // Lighter Purple (CSS color name)
    "peachpuff", // Lighter Red (CSS color name)
    "mediumseagreen", // Lighter Green (CSS color name)
    "lightsalmon", // Lighter Orange (CSS color name)
    "paleturquoise", // Lighter Teal (CSS color name)
  ];

  // Create or update the chart
  if (window.todosBarChart) {
    // If chart already exists, update it
    window.todosBarChart.data.datasets[0].data = [
      todosData.allTodos,
      todosData.dueDateTodos,
      todosData.pendingTodos,
      todosData.completedTodos,
      todosData.overdueTodos,
      todosData.prioritizedTodos,
    ];
    window.todosBarChart.data.datasets[0].backgroundColor = uniqueColors; // Set unique colors
    window.todosBarChart.update(); // Redraw the chart with updated data
  } else {
    // Otherwise, create a new chart
    window.todosBarChart = new Chart(ctx, {
      type: "bar", // Bar chart
      data: {
        labels: [
          "All Todos",
          "Today Todos",
          "Pending Todos",
          "Completed Todos",
          "OverDue Todos",
          "Prioritized Todos",
        ], // Labels for the X-axis
        datasets: [
          {
            label: "Todos stats", // Label for the data
            data: [
              todosData.allTodos,
              todosData.dueDateTodos,
              todosData.pendingTodos,
              todosData.completedTodos,
              todosData.overdueTodos,
              todosData.prioritizedTodos,
            ], // Y-axis data with rounded values
            backgroundColor: uniqueColors, // Unique colors for each bar
            borderColor: "rgba(54, 162, 235, 1)", // Border color
            borderWidth: 1, // Bar border width
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true, // Start the Y-axis from 0
            ticks: {
              stepSize: 1, // Ensure that ticks are in whole numbers
            },
          },
        },
      },
    });
  }
}

// Run after page loads
document.addEventListener("DOMContentLoaded", fetchData);
