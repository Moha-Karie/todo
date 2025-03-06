// Get the theme toggle button
const themeToggleBtn = document.querySelector('.themeToggleBtn');

// Function to toggle themes
function toggleTheme() {
  // Check if dark theme is already applied
  if (document.body.classList.contains('dark-theme')) {
    // Switch to light theme
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeToggleBtn.classList.remove('fa-sun'); // Remove sun icon
    themeToggleBtn.classList.add('fa-moon');  // Add moon icon
    // Save theme preference to localStorage
    localStorage.setItem('theme', 'light');
  } else {
    // Switch to dark theme
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeToggleBtn.classList.remove('fa-moon'); // Remove moon icon
    themeToggleBtn.classList.add('fa-sun');     // Add sun icon
    // Save theme preference to localStorage
    localStorage.setItem('theme', 'dark');
  }
}

// Add event listener to the button to toggle themes
themeToggleBtn.addEventListener('click', toggleTheme);

// Check for previously saved theme in localStorage (optional, to persist theme)
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-theme');
  themeToggleBtn.classList.remove('fa-moon');
  themeToggleBtn.classList.add('fa-sun');
} else {
  document.body.classList.add('light-theme');
  themeToggleBtn.classList.remove('fa-sun');
  themeToggleBtn.classList.add('fa-moon');
}
