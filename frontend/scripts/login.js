document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("userEmail").value;
    const password = document.getElementById("userPassword").value;

    try {
        const response = await fetch("https://todo-app-spcu.onrender.com/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Show success message
            // Store the token (Optional: Use localStorage/sessionStorage)
            localStorage.setItem("accessToken", data.accessToken);
            window.location.href = "/home"; // Redirect to home page
        } else {
            alert(data.error || "Login failed. Please try again."); // Show error message
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to login. Please try again.");
    }
});
