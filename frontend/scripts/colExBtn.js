function showSection(sectionId) {
    // hide all sections
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.remove("active");
    });

    // showing selected Section
    document.getElementById(sectionId).classList.add("active");
  }

  const navBtn = document.getElementById("expand-collapse-btn");
  const sidebar = document.getElementById("sidebar");

  navBtn.addEventListener("click", () => {
    // Toggle the sidebar's display between "none" and "block"
    if (sidebar.style.display === "none") {
      sidebar.style.display = "flex"; // Show the sidebar
    } else {
      sidebar.style.display = "none"; // Hide the sidebar
    }
  });