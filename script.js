let logs = JSON.parse(localStorage.getItem("immersionLogs")) || [];
let isAdmin = false;

function saveLogs() {
  localStorage.setItem("immersionLogs", JSON.stringify(logs));
}

function addLog() {
  const date = document.getElementById("date").value;
  const task = document.getElementById("task").value.trim();
  const hours = parseFloat(document.getElementById("hours").value);

  if (!date || !task || isNaN(hours) || hours <= 0) {
    alert("Please fill all fields correctly.\n• Date required\n• Task required\n• Hours must be greater than 0");
    return;
  }

  logs.push({
    date: date,
    task: task,
    hours: hours,
    status: "Pending"
  });

  saveLogs();
  displayLogs();

  // Optional: clear inputs after adding
  document.getElementById("date").value = "";
  document.getElementById("task").value = "";
  document.getElementById("hours").value = "";
}

function approveLog(index) {
  if (!isAdmin) return;
  logs[index].status = "Approved";
  saveLogs();
  displayLogs();
}

function rejectLog(index) {
  if (!isAdmin) return;
  logs[index].status = "Rejected";
  saveLogs();
  displayLogs();
}

function deleteLog(index) {
  if (!isAdmin) return;
  if (confirm("Are you sure you want to delete this log?")) {
    logs.splice(index, 1);
    saveLogs();
    displayLogs();
  }
}

function displayLogs() {
  const table = document.getElementById("logTable");
  table.innerHTML = "";

  let total = 0;

  logs.forEach((log, index) => {
    if (log.status === "Approved") {
      total += log.hours;
    }

    const statusClass = 
      log.status === "Approved"  ? "status-approved" :
      log.status === "Rejected"  ? "status-rejected" :
      "status-pending";

    const actionCell = isAdmin ? `
      <td class="admin-only">
        <button class="approve" onclick="approveLog(${index})">Approve</button>
        <button class="reject" onclick="rejectLog(${index})">Reject</button>
        <button onclick="deleteLog(${index})">Delete</button>
      </td>
    ` : `<td></td>`;

    const teacherCell = isAdmin ? `<td class="admin-only">Pending Review</td>` : `<td></td>`;

    table.innerHTML += `
      <tr>
        <td>${log.date}</td>
        <td>${log.task}</td>
        <td>${log.hours}</td>
        <td class="${statusClass}">${log.status}</td>
        ${teacherCell}
        ${actionCell}
      </tr>
    `;
  });

  document.getElementById("totalHours").innerText = total.toFixed(1);

  let percent = (total / 80) * 100;
  if (percent > 100) percent = 100;
  document.getElementById("progress").style.width = percent + "%";



  //Toggle admin columns visibility
  if (isAdmin) {
    document.body.classList.add("admin-visible");
  } else {
    document.body.classList.remove("admin-visible");
  }
}


//Admin login
document.getElementById("adminBtn").addEventListener("click", () => {
  const password = prompt("Enter teacher password:");
  if (password === "admin123") {
    isAdmin = true;
    alert("Welcome, Teacher! Admin controls enabled.");
    document.getElementById("adminPanel").style.display = "block";
    displayLogs();
  } else if (password !== null) {
    alert("Incorrect password.");
  }
});

function logoutAdmin() {
  isAdmin = false;
  document.getElementById("adminPanel").style.display = "none";
  displayLogs();
  alert("Logged out from teacher mode.");
}

//PDF Download
function downloadPDF() {
  const element = document.getElementById("dtr");
  const opt = {
    margin:       0.5,
    filename:     'Work_Immersion_DTR.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

//Load table on page open
displayLogs();