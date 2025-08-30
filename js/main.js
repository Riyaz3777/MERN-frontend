const API_BASE = "https://mern-backend-w4a1.onrender.com/api";

// ---------- REGISTER ----------
if (document.getElementById("registerForm")) {
  const registerForm = document.getElementById("registerForm");
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
      console.error(err);
      alert("Error registering user.");
    }
  });
}

// ---------- LOGIN ----------
if (document.getElementById("loginForm")) {
  const loginForm = document.getElementById("loginForm");
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
      if (!res.ok) {
        alert(data.message);
        return;
      }
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);
      alert("Login error.");
    }
  });
}

// ---------- FORGOT / UPDATE PASSWORD ----------
if (document.getElementById("forgotForm")) {
  const forgotForm = document.getElementById("forgotForm");
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      window.location.href = "login.html";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) window.location.href = "login.html";
    } catch (err) {
      console.error(err);
      alert("Error updating password.");
    }
  });
}

// ---------- DASHBOARD ----------
if (document.getElementById("welcomeMsg")) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
  } else {
    // Fetch profile
    fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name) {
          document.getElementById("welcomeMsg").innerText = `Welcome, ${data.name}`;

          // If admin, fetch all users
          if (data.role === "admin") {
            fetch(`${API_BASE}/users`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.json())
              .then((users) => {
                const usersListContainer = document.getElementById("usersListContainer");
                const usersList = document.getElementById("usersList");
                usersListContainer.style.display = "block";
                usersList.innerHTML = "";
                users.forEach((u) => {
                  const li = document.createElement("li");
                  li.innerText = `${u.name} (${u.email})`;
                  usersList.appendChild(li);
                });
              })
              .catch((err) => console.error("Error fetching users:", err));
          }
        } else {
          alert("Failed to load profile, please login again.");
          window.location.href = "login.html";
        }
      })
      .catch((err) => {
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
