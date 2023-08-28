const taskList = document.getElementById("task-list");
function onLoad(){
    fetch("http://localhost:3000/todos", {
        method: "GET"
    }).then((res) => {
        res.json().then((data) => {
            data.forEach((task) => {
                const listItem = document.createElement("li");
                listItem.textContent = `
                Title: ${data.title}
                Description: ${data.description}
                Completed: ${data.completed}
                `;

                taskList.appendChild(listItem);
            });
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    });
}

onLoad();