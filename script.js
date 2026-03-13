let logs = JSON.parse(localStorage.getItem("immersionLogs")) || [];

function saveLogs(){
localStorage.setItem("immersionLogs", JSON.stringify(logs));
}


//logic sa pag input
function addLog(){

let date=document.getElementById("date").value;
let task=document.getElementById("task").value;
let hours=parseFloat(document.getElementById("hours").value);

if(!date || !task || !hours){
alert("Fill all fields");
return;
}

logs.push({
date:date,
task:task,
hours:hours,
status:"Pending"
});

saveLogs();
displayLogs();
}

function approveLog(index){

logs[index].status="Approved";

saveLogs();
displayLogs();
}

function rejectLog(index){

logs[index].status="Rejected";

saveLogs();
displayLogs();
}

function deleteLog(index){

logs.splice(index,1);

saveLogs();
displayLogs();
}



//displaying logs of user
function displayLogs(){

let table=document.getElementById("logTable");

table.innerHTML="";

let total=0;

logs.forEach((log,index)=>{

if(log.status==="Approved"){
total+=log.hours;
}

let statusClass="status-pending";

if(log.status==="Approved") statusClass="status-approved";
if(log.status==="Rejected") statusClass="status-rejected";

table.innerHTML+=`

<tr>

<td>${log.date}</td>

<td>${log.task}</td>

<td>${log.hours}</td>

<td class="${statusClass}">${log.status}</td>

<td>
<button class="approve" onclick="approveLog(${index})">Approve</button>
<button class="reject" onclick="rejectLog(${index})">Reject</button>
</td>

<td>
<button onclick="deleteLog(${index})">Delete</button>
</td>

</tr>

`;

});

document.getElementById("totalHours").innerText=total;

let percent=(total/80)*100;

if(percent>100) percent=100;

document.getElementById("progress").style.width=percent+"%";
}

displayLogs();




//download 

function downloadPDF(){

let element=document.getElementById("dtr");

let opt={
margin:0.5,
filename:"Work_Immersion_DTR.pdf",
image:{type:'jpeg',quality:0.98},
html2canvas:{scale:2},
jsPDF:{unit:'in',format:'letter',orientation:'portrait'}
};

html2pdf().set(opt).from(element).save();
}