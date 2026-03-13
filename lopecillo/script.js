let tasks = [];

const addBtn = document.getElementById("addBtn");
const search = document.getElementById("search");
const refreshBtn = document.getElementById("refreshBtn");
const taskInput = document.getElementById("taskInput");

addBtn.addEventListener("click", handleAddTask);
refreshBtn.addEventListener("click", refreshTasks);
search.addEventListener("input", filterTasks);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleAddTask();
});

function addTask(text) {
    if (!text.trim()) {
        showNotification("Please enter a task", "warning");
        return false;
    }

    const task = {
        text: text,
        timeLeft: 60,
        intervalId: null,
        expired: false
    };

    tasks.push(task);
    renderTasks();
    startTaskTimer(tasks.length - 1);
    return true;
}

function startTaskTimer(index) {
    const task = tasks[index];

    task.intervalId = setInterval(() => {
        task.timeLeft--;
        renderTasks();

        if (task.timeLeft <= 0) {
            clearInterval(task.intervalId);
            task.expired = true;
            showNotification("Task expired", "warning");
            renderTasks();
        }
    }, 1000);
}

function renderTasks() {
    const list = document.getElementById("taskList");
    const searchTerm = search.value.toLowerCase();
    const taskCount = document.getElementById("taskCount");

    list.innerHTML = "";
    let visibleCount = 0;

    tasks.forEach((task, index) => {
        if (!task.text.toLowerCase().includes(searchTerm)) {
            return;
        }

        visibleCount++;

        const li = document.createElement("li");
        let min = Math.floor(task.timeLeft / 60);
        let sec = task.timeLeft % 60;
        sec = sec < 10 ? "0" + sec : sec;

        const textWrapper = document.createElement("div");
        textWrapper.className = "task-text-wrapper";

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const timer = document.createElement("span");
        timer.className = "task-timer";
        timer.textContent = `${min}:${sec}`;

        textWrapper.appendChild(taskText);
        textWrapper.appendChild(timer);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(index);

        li.appendChild(textWrapper);
        li.appendChild(deleteBtn);

        if (task.expired) {
            li.classList.add("expired");
        }

        list.appendChild(li);
    });

    taskCount.textContent = visibleCount;
}

function filterTasks() {
    renderTasks();
}

function deleteTask(index) {
    clearInterval(tasks[index].intervalId);
    tasks.splice(index, 1);
    renderTasks();
    showNotification("Task deleted", "success");
}

function handleAddTask() {
    const input = document.getElementById("taskInput");
    const btn = document.getElementById("addBtn");

    if (!input.value.trim()) {
        showNotification("Please enter a task", "warning");
        return;
    }

    btn.disabled = true;
    btn.classList.add("loading");

    setTimeout(() => {
        if (addTask(input.value)) {
            input.value = "";
            showNotification("✓ Task added successfully!", "success");
        }

        btn.disabled = false;
        btn.classList.remove("loading");
    }, 1000);
}

function refreshTasks() {
    renderTasks();
    showNotification("Tasks refreshed", "success");
}

function showNotification(message, type) {
    const container = document.getElementById("notifications");
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showNotification(message,type="success"){

const notification=document.createElement("div");

notification.className="notification "+type;

notification.innerText=message;

document.getElementById("notifications").appendChild(notification);

setTimeout(()=>{

notification.remove();

},3000);

}

function refreshTasks(){

const btn=document.getElementById("refreshBtn");

btn.disabled=true;

showNotification("Refreshing tasks...","warning");

setTimeout(()=>{

tasks=[
{text:"Study",timeLeft:60},
{text:"Exercise",timeLeft:60},
{text:"Clean Room",timeLeft:60}
];

renderTasks();

btn.disabled=false;

showNotification("Tasks refreshed!","success");

},2000);

}

    function deleteTask(index){

    clearInterval(tasks[index].intervalId);

    tasks.splice(index,1);

    renderTasks();

showNotification("Task deleted","success");

}

function debounce(func,delay){

let timeout;

return function(...args){

clearTimeout(timeout);

timeout=setTimeout(()=>{

func.apply(this,args);

},delay);

};

}

function filterTasks(text){

const filtered=tasks.filter(task=>
task.text.toLowerCase().includes(text.toLowerCase())
);

const list=document.getElementById("taskList");

list.innerHTML="";

filtered.forEach(task=>{

const li=document.createElement("li");

li.innerText=task.text;

list.appendChild(li);

});

}

search.addEventListener("input",

debounce((e)=>{

filterTasks(e.target.value);

},300)

);s

//1. What happens if you don't call clearInterval when a task is deleted? How would you fix this?
//If clearInterval isn’t called, the timer keeps running even after the task is deleted. 
//This wastes memory and can slow down the program. To fix it, always clear the interval before removing the task.


//2. Why is debouncing useful for search inputs?
//Debouncing prevents the search function from running on 
// every keystroke. It waits for the user to stop typing before running 
// the search, improving performance.

//3. Difference between debouncing and throttling?
// Debouncing delays the function execution until the user stops triggering it. 
// Throttling limits how often a function can run within a time period.
//  Debouncing is good for search inputs, while throttling is useful for

//4. How do loading states improve user experience?
//Loading states inform users that the system is processing their request.
// Without them, users may think the application is not working and may click multiple times.