const popup = document.querySelector(".popup");
const showPopup = document.querySelector(".new-task");
const form = document.forms[0];
let taskss = document.querySelectorAll(".task");

showPopup.addEventListener("click", () => {
    popup.classList.add("active");
    document.querySelector("#task-name").focus();
});

popup.addEventListener("click", (e) => {
    if (e.target === form) {
        popup.classList.remove("active");
    }
});

document.querySelector(".all").addEventListener("click", (e) => {
    let taskss = document.querySelectorAll(".task");
    taskss.forEach((task) => {
        if (task.style.display === "none") task.style.display = "flex";
    });
    typesFilter.querySelectorAll("span").forEach((ele) => {
        ele.classList.remove("selected");
    });
    e.target.classList.add("selected");
});

// add a task

const tasks = document.querySelector(".tasks");
const typesFilter = document.querySelector(".types");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = document.querySelector("#task-name").value.trim();
    const taskSub = document.querySelector("#task-subject").value.trim();
    const taskType = document.querySelector("#task-type").value.trim();
    const newTask = document.createElement("div");
    newTask.classList.add("task", taskType, "not-completed");
    const headerBox = document.createElement("div");
    headerBox.className = "task-header";
    const h2 = document.createElement("h2");
    h2.textContent = taskName;
    headerBox.append(h2);
    const span1 = document.createElement("span");
    span1.className = "type";
    span1.textContent = taskType;
    headerBox.append(span1);
    newTask.append(headerBox);
    const p = document.createElement("p");
    p.textContent = taskSub;
    newTask.append(p);
    const span2 = document.createElement("span");
    span2.className = "check-circle";
    span2.innerHTML = `<i class='bx bx-check'></i>`;
    newTask.append(span2);
    tasks.prepend(newTask);
    popup.classList.remove("active");

    // add a filter
    let have = false;
    for (let i = 0; i < typesFilter.children.length; i++) {
        if (typesFilter.children[i].textContent.trim() === taskType) {
            have = true;
            break;
        }
    }
    if (have === false) {
        let newFilter = document.createElement("span");
        newFilter.textContent = taskType;
        newFilter.addEventListener("click", () => {
            let taskss = document.querySelectorAll(".task");
            taskss.forEach((task) => {
                if (!task.classList.contains(newFilter.textContent.trim())) {
                    task.style.display = "none";
                } else {
                    if (task.style.display === "none")
                        task.style.display = "flex";
                }
            });
        });
        typesFilter.append(newFilter);
    }
    form.reset();
});

// finish the task
tasks.addEventListener("click", (e) => {
    const checkCircle = e.target.closest(".check-circle");

    if (checkCircle) {
        const icon = checkCircle.querySelector("i");
        const taskCard = checkCircle.closest(".task");
        const taskText = taskCard.querySelector("p");

        icon.classList.toggle("checked");
        taskCard.classList.toggle("completed");

        if (icon.classList.contains("checked")) {
            taskText.style.cssText =
                "text-decoration: line-through; color: gray;";
        } else {
            taskText.style.cssText = "text-decoration: none; color: #000;";
        }
    }
});

for (let i = 0; i < typesFilter.children.length; i++) {
    if (!typesFilter.children[i].classList.contains("all")) {
        typesFilter.children[i].addEventListener("click", (e) => {
            let taskss = document.querySelectorAll(".task");
            typesFilter.querySelectorAll("span").forEach((ele) => {
                ele.classList.remove("selected");
            });
            e.target.classList.add("selected");
            taskss.forEach((task) => {
                if (
                    !task.classList.contains(
                        typesFilter.children[i].textContent.trim(),
                    )
                ) {
                    task.style.display = "none";
                } else {
                    if (task.style.display === "none")
                        task.style.display = "flex";
                }
            });
        });
    }
}

const completedFilter = document.querySelectorAll(".the-filter");

completedFilter.forEach((ele) => {
    ele.addEventListener("click", () => {
        let taskss = document.querySelectorAll(".task");
        taskss.forEach((task) => {
            let value = ele.classList.item(2);
            if (!task.classList.contains(value)) {
                task.style.display = "none";
            } else {
                if (task.style.display === "none") task.style.display = "flex";
            }
        });
    });
});
