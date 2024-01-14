

document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('task-button')) {
        const action = event.target.getAttribute('button-action');
        
        if (action === 'create') {
            const taskType = event.target.getAttribute('data-task-type');
            createTask();
        } 
        else if (action === 'delete') {
            const taskId = event.target.getAttribute('data-task-id');
            deleteTask(taskId);
        }
        
    }

    else if (event.target && event.target.classList.contains('penalty_button')) {
        const action = event.target.getAttribute('button-action');

        if (action === 'penalty') {
            createPenalty();
        }
    }
});

function createTask() {
    const name = document.getElementById('name').value;
    const content = document.getElementById('content').value;
    const expiration_time = document.getElementById('expiration_time').value;
    const type = document.getElementById('type').value;
    const reward = document.getElementById('reward').value;
    const penalty = document.getElementById('penalty').value;
    const penalty_induced = document.getElementById('penalty_induced').value;
    
    body_content = JSON.stringify({
        name: name,
        content: content,
        expiration_time: expiration_time,
        type: type,
        reward: reward,
        penalty: penalty,
        penalty_induced: penalty_induced
    })
    path = '/button_create_task'
    post_method(body_content,path,updateTaskList)
}

function createPenalty() {

    const content = document.getElementById('content').value;
    const type = document.getElementById('type').value;
    const place = document.getElementById('place').value;
    
    
    body_content = JSON.stringify({
        content: content,
        type: type,
        place: place,
    })
    path = '/button_create_penalty'
    post_method(body_content,path,updatePenaltyList)
}

function updatePenaltyList(data){
    console.log(data)
    document.getElementById('penaltyForm').reset()
  
}

function updateTaskList(data){
    const task = JSON.parse(data.task);
    const taskList = document.getElementById('taskList');
    const newTaskDiv = document.createElement('div');
    newTaskDiv.innerHTML = `<p>${task.title} - ${task.task_type} - ${task.expiration_time} - reward : ${task.reward} - penalty : ${task.penalty} </p>`;
    taskList.appendChild(newTaskDiv);
    document.getElementById('taskForm').reset();  // Get a reference to the form

}

function post_method(body_content,path,return_func) {
    fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body_content
    })
    .then(response => response.json())  // Assuming your server responds with JSON
    .then(data => {
        if (data) {
            return_func(data)            
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}