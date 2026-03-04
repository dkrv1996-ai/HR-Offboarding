const STORAGE_KEY = "offboardingRequests";
function loadRequests() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}
function saveRequests(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function generateId() {
  return "REQ-" + Date.now();
}


