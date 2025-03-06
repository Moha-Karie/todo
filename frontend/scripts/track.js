document.addEventListener("DOMContentLoaded", () => {
  trackBtnVisibility();
  const themeToggle = document.getElementById("themToggle");
  const currentTheme = localStorage.getItem("theme");

  // applying the saved theme on page load
  if (currentTheme) {
    document.body.classList.add(currentTheme);
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
  });

  // save the selected theme to the local storage

  const newTheme = document.body.classList.contains("dark-mode")
    ? "dark-mode"
    : "ligh-mode";
  localStorage.setItem("theme", newTheme);
});

const trackBtnVisibility = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("You are not allowed");
    return;
  }

  let url = `https://todo-app-spcu.onrender.com/api/todos/viewTodos`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("error");
    }

    const data = await response.json();
    console.log(data);

    let filterBtns = document.getElementById("filterBtns");

    if (data.todos.length > 0 && filterBtns) {
      let allBtn = document.createElement("button");
      allBtn.innerHTML = `<i class="fas fa-list icon"></i> All`;
      allBtn.classList.add("allBtn");

      if (!document.querySelector(".allBtn")) {
        filterBtns.appendChild(allBtn);
      }
    } else if (filterBtns) {
      let noTodosMsg = document.createElement("p");
      noTodosMsg.textContent = "No Todos created Yet.";
      noTodosMsg.classList.add("noTodosMsg");

      if (!document.querySelector(".noTodosMsg")) {
        filterBtns.appendChild(noTodosMsg);
      }
      console.log("No Todos created Yet.");
    }

    const todayTodos = data.todos.filter(
      (todo) =>
        !todo.completed &&
        new Date(todo.dueDate).toDateString() === new Date().toDateString()
    );

    if (todayTodos.length > 0 && filterBtns) {
      let todayBtn = document.createElement("button");
      todayBtn.innerHTML = `<i class="fas fa-clock icon"></i> Today`;
      todayBtn.classList.add("todayBtn");

      if (!document.querySelector(".todayBtn")) {
        filterBtns.appendChild(todayBtn);
      }
    } else {
      console.log("No today todos Found.");
    }

    const hasCompletedTodo = data.todos.some((todo) => todo.completed);

    if (hasCompletedTodo && filterBtns) {
      let completedBtn = document.createElement("button");
      completedBtn.innerHTML = `<i class="fas fa-check-square icon"></i> Completed`;
      completedBtn.classList.add("completedBtn");

      if (!document.querySelector(".completedBtn")) {
        filterBtns.appendChild(completedBtn);
      }
    } else {
      console.log("No completed Todos Found.");
    }

    const hasPendingTodo = data.todos.some((todo) => !todo.completed);
    if (hasPendingTodo && filterBtns) {
      let pendingBtn = document.createElement("button");
      pendingBtn.innerHTML = `<i class="fas fa-hourglass-half icon"></i> Pending`;
      pendingBtn.classList.add("pendingBtn");

      if (!document.querySelector(".pendingBtn")) {
        filterBtns.appendChild(pendingBtn);
      }
    } else {
      console.log("No pending Todos Found.");
    }

    const overdueTodos = data.todos.filter(
      (todo) =>
        !todo.completed &&
        new Date(todo.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
    );

    if (overdueTodos.length > 0 && filterBtns) {
      let overDueBtn = document.createElement("button");
      overDueBtn.innerHTML = `<i class="fas fa-exclamation-triangle icon"></i> OverDue`;
      overDueBtn.classList.add("overDueBtn");

      if (!document.querySelector(".overDueBtn")) {
        filterBtns.appendChild(overDueBtn);
      }
    } else {
    }
  } catch (err) {
    alert("Error while fetching data!");
  }
};

// Correct way to handle dynamically created buttons

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("allBtn")) {
    e.preventDefault();
    console.log("All Todos Btn clicked");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("todayBtn")) {
    e.preventDefault();
    console.log("Today Btn is clicked");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("pendingBtn")) {
    e.preventDefault();
    console.log("Pending Btn is clicked.");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("completedBtn")) {
    e.preventDefault();
    console.log("Completed Btn is clicked");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("overDueBtn")) {
    e.preventDefault();
    console.log("OverDue Btn is clicked");
  }
});
