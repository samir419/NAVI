todos=[
    {
        task:'buy groceries',
        start:'2024-06-01',
        end:'2024-06-02',
        completed:false
    },
    {
        task:'walk the dog',
        start:'2024-06-01',
        end:'2024-06-01',
        completed:true
    }
]
async function fetch_todos(){
    try{
        fetch(`http://${ip}/todos/${sessionStorage.getItem('navi_user_id')}`, {
            method:'GET', 
            headers: { 'Authorization':token,'Content-Type': 'application/json' }
        })
        .then(result => result.json())
        .then(res => {
            todos = res;
            render_todos();
        })
        .catch(e => {
            alert('Error'+e.message);
        });
    }catch(err){
        alert('error:'+err.message);
    }
}
function render_todos(){
    let todo_list=document.getElementById('todo-list');
    todo_list.innerHTML='';
    for(let i=0;i<todos.length;i++){
        todo_list.innerHTML+=`
            <div>
                <p>${todos[i].description}</p>
                <p>${todos[i].start}</p>
                <p>${todos[i].end}</p>
                <button onclick="delete_todo(${i})">delete</button>
            </div>`;
    }
}
async function upload_todo(){
    let description=document.getElementById('todo-name').value;
    let start_date=document.getElementById('todo-start').value;
    let dead_line=document.getElementById('todo-end').value;
    if(!description){
        alert('description required');
        return;
    }
    if(!start_date){
        start_date=new Date().toISOString().split('T')[0];
    }
    if (!dead_line) {
        const d = new Date();
        d.setDate(d.getDate() + 1); // next day
        dead_line = d.toISOString().split('T')[0];
    }
    console.log('uploading todo:'+description+start_date+dead_line);
    try{
        fetch(`http://${ip}/create_todo`, {
            method:'POST', 
            headers: { 'Authorization':token,'Content-Type': 'application/json' },
            body: JSON.stringify({
                description:description,
                userId:sessionStorage.getItem('navi_user_id'),
                start_date:start_date,
                dead_line:dead_line
            })
        })
        .then(result => {
            res = result.json()
            console.log(res)
            alert('todo created')
            fetch_todos();
        })
        .catch(e => {
            alert('Error'+e.message);
        });
    }
    catch(err){
        alert('error:'+err.message);
    }
}
async function delete_todo(index){
    console.log(todos[index])
    let id=todos[index]._id;
    try{
        fetch(`http://${ip}/delete_todo/${id}`, {
            method:'DELETE', 
            headers: { 'Authorization':token,'Content-Type': 'application/json' }
        })
        .then(result => {
            res = result.json()
            console.log(res)
            alert('todo deleted')
            fetch_todos();
        })
        .catch(e => {
            alert('Error'+e.message);
        });
    }catch(err){
        alert('error:'+err.message);
    }
}
