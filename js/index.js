let tasks = document.querySelectorAll(".task");
let isTasksCompleted = "all";
let tasksType = "all";

window.onload = () => {
    if (localStorage.getItem("tasks")) {
        let loadedTasks = JSON.parse(localStorage.getItem("tasks"));
        loadedTasks.forEach((task) => {
            creatTask(
                task.taskName,
                task.taskDescription,
                task.taskType,
                task.isTaskCompleted,
                false,
            );
        });
    }
};

// filtering by complete logic

const filtersByCompleted = document.querySelectorAll(".filter");

filtersByCompleted.forEach((filter) => {
    let filterChild = filter.querySelector("span");

    filterChild.addEventListener("click", () => {
        isTasksCompleted = filter.dataset.completed;
        upsdateTasks();

        filtersByCompleted.forEach((filter) => {
            filter.classList.remove("selected");
        });
        filter.classList.add("selected");
    });
});

// filtering by type logic

const FiltersByTypeParent = document.querySelector(".filters-by-type");
let FiltersByType = FiltersByTypeParent.querySelectorAll("span");
const allType = FiltersByTypeParent.querySelector("[data-type='all']");

allType.addEventListener("click", () => {
    if (!allType.classList.contains("selected")) {
        tasksType = allType.dataset.type;
        upsdateTasks();

        FiltersByType.forEach((filter) => {
            filter.classList.remove("selected");
        });
        allType.classList.add("selected");
    }
});

// show and hidde add task popup logic

const newTaskBtn = document.querySelector(".new-task-btn");
const popup = document.querySelector(".popup");
newTaskBtn.addEventListener("click", () => {
    popup.classList.add("show");
});

const form = document.forms[0];
form.addEventListener("click", (e) => {
    if (e.target === form) popup.classList.remove("show");
});

// add task logic
// const addBtn = document.querySelector(".add-task");
// addBtn.addEventListener("click", (e) => {
//     e.preventDefault();

//     const taskName = document.getElementById("name").value;
//     const taskDescription = document.getElementById("description").value;
//     const taskType = document.getElementById("type").value;

//     if (taskName !== "" && taskDescription !== "" && taskType !== "")
//         creatTask(taskName, taskDescription, taskType);

//     popup.classList.remove("show");
//     form.reset();
// });

document.forms[0].addEventListener("submit", (e) => {
    e.preventDefault();

    const taskName = document.getElementById("name").value;
    const taskDescription = document.getElementById("description").value;
    const taskType = document.getElementById("type").value;

    if (taskName !== "" && taskDescription !== "" && taskType !== "") {
        creatTask(taskName, taskDescription, taskType);

        upsdateTasks();

        saveData();
    }

    popup.classList.remove("show");
    form.reset();
});

// project functions //

// for check if task should show or not
function filteringTask(task) {
    const taskType = task.querySelector(".task-type").textContent.toLowerCase();
    const isTaskCompleted = task.dataset.completed;

    task.classList.remove("show");

    if (
        (tasksType === taskType && isTasksCompleted === isTaskCompleted) ||
        (tasksType === "all" && isTasksCompleted === "all") ||
        (tasksType === "all" && isTasksCompleted === isTaskCompleted) ||
        (isTasksCompleted === "all" && tasksType === taskType)
    )
        task.classList.add("show");
}

function typeCheck(currentTask) {
    tasks = document.querySelectorAll(".task");
    const result = [...tasks].some((task) => {
        const taskType = task
            .querySelector(".task-type")
            .textContent.toLowerCase();
        if (task !== currentTask)
            return (
                taskType ===
                currentTask
                    .querySelector(".task-type")
                    .textContent.toLowerCase()
            );
    });
    return result;
}

function creatTask(
    taskName,
    taskDescription,
    taskType,
    isTaskCompleted = "false",
    filtersChange = true,
) {
    // create add the task
    const markUp = `<div class="head">
                        <h2 class="task-name"></h2>
                        <div class="right-side">
                            <span class="task-type"></span>
                            <div class="delete-task">X</div>
                        </div>
                    </div>
                    <div class="foot">
                        <p class="task-description"></p>
                        <div class="check-circle">
                            <i class='bx bx-check'></i>
                        </div>
                    </div>`;
    const newTask = document.createElement("div");
    newTask.classList.add("task", "show");
    newTask.setAttribute("data-completed", isTaskCompleted);
    newTask.innerHTML = markUp;
    newTask.querySelector(".task-name").textContent = taskName;
    newTask.querySelector(".task-type").textContent = taskType;
    newTask.querySelector(".task-description").textContent = taskDescription;
    document.querySelector(".tasks-area").prepend(newTask);

    // create and add the type filter if it not found
    if (!typeCheck(newTask)) {
        const newFiltertype = document.createElement("span");
        newFiltertype.textContent = taskType.toLowerCase();
        newFiltertype.setAttribute("data-type", newFiltertype.textContent);
        FiltersByTypeParent.append(newFiltertype);

        if (filtersChange === true) {
            tasksType = newFiltertype.dataset.type;
            isTasksCompleted = "false";

            FiltersByType = FiltersByTypeParent.querySelectorAll("span");
            FiltersByType.forEach((filter) => {
                filter.classList.remove("selected");
            });
            newFiltertype.classList.add("selected");

            filtersByCompleted.forEach((filter) => {
                let filterChild = filter.querySelector("span");
                if (filterChild.textContent === "Not Completed") {
                    filter.classList.add("selected");
                } else {
                    filter.classList.remove("selected");
                }
            });
        }

        newFiltertype.addEventListener("click", () => {
            if (!newFiltertype.classList.contains("selected")) {
                tasksType = newFiltertype.dataset.type;
                FiltersByType = FiltersByTypeParent.querySelectorAll("span");

                FiltersByType.forEach((filter) => {
                    filter.classList.remove("selected");
                });
                newFiltertype.classList.add("selected");

                upsdateTasks();
            }
        });
    }

    // add the complete task logic
    newTask.querySelector(".check-circle").addEventListener("click", () => {
        newTask.dataset.completed =
            newTask.dataset.completed === "true" ? "false" : "true";
        filteringTask(newTask);
        saveData();
    });

    // add the delete logic
    newTask.querySelector(".delete-task").addEventListener("click", () => {
        newTask.remove();
        if (!typeCheck(newTask)) {
            const Content = (ele) => ele.textContent.toLowerCase();
            FiltersByType.forEach((filter) => {
                if (
                    Content(filter) === taskType.toLowerCase() &&
                    Content(filter) !== "all"
                )
                    filter.remove();
                allType.classList.add("selected");
                tasksType = "all";
                upsdateTasks();
            });
        }
        saveData();
    });
}

function upsdateTasks() {
    tasks = document.querySelectorAll(".task");
    tasks.forEach((task) => {
        filteringTask(task);
    });
}

function saveData() {
    let tasksData = [];
    tasks.forEach((task) => {
        tasksData.unshift({
            taskName: task.querySelector(".task-name").textContent,
            taskType: task.querySelector(".task-type").textContent,
            taskDescription:
                task.querySelector(".task-description").textContent,
            isTaskCompleted: task.dataset.completed,
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasksData));
}
