function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  // Demo Users (You can change)
  const users = {
    HR: "1234",
    Manager: "1234",
    IT: "1234",
    Admin:"1234",
    Finance: "1234"
  };

  if (users[username] && users[username] === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "dashboard.html";
  } else {
    error.innerText = "Invalid username or password";
  }
}
