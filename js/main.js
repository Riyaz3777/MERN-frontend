const API_BASE = "https://mern-backend-w4a1.onrender.com/api";

// Login Form
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Error logging in");
    }
  });
}

// Register Form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) window.location.href = "login.html";
    } catch (err) {
      alert("Error registering");
    }
  });
}

// Forgot Password Form
const resetForm = document.getElementById("resetForm");
if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) window.location.href = "login.html";
    } catch (err) {
      alert("Error resetting password");
    }
  });
}

// Dashboard
if (document.getElementById("welcomeMsg")) {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "login.html";

  fetch(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("welcomeMsg").innerText = `Welcome, ${data.name}`;
    });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}
// Dashboard logic
if (document.getElementById("welcomeMsg")) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
  } else {
    // Fetch profile
    fetch("https://mern-backend-w4a1.onrender.com/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.name) {
          document.getElementById("welcomeMsg").innerText = `Welcome, ${data.name}`;

          // If user is admin, fetch all users
          if (data.role === "admin") {
            fetch("https://mern-backend-w4a1.onrender.com/api/users", {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then(res => res.json())
              .then(users => {
                const usersListContainer = document.getElementById("usersListContainer");
                const usersList = document.getElementById("usersList");
                usersListContainer.style.display = "block";
                usersList.innerHTML = "";
                users.forEach(u => {
                  const li = document.createElement("li");
                  li.innerText = `${u.name} (${u.email})`;
                  usersList.appendChild(li);
                });
              })
              .catch(err => console.error("Error fetching users:", err));
          }
        } else {
          alert("Failed to load profile, please login again.");
          window.location.href = "login.html";
        }
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        alert("Error loading dashboard.");
      });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
}


