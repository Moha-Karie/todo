document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const fullName = document.getElementById("userFullName").value;
    const email = document.getElementById("userEmail").value;
    const password = document.getElementById("userPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    try {
      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Show success message

        window.location.href = "/login"; // Redirect to home page
      } else {
        alert(data.error || "An error occurred"); // Display only the error message
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to register user. Please try again.");
    }
  });
