notes=[
    {
        title:'note 1',
        body:'lorem ipsum',
        date_created:'2024-06-01',
        date_modified:'2024-06-01'
    },
    {
        title:'note 2',
        body:'dolor sit amet',
        date_created:'2024-06-02',
        date_modified:'2024-06-02'
    }
]
async function fetch_notes(){
    try{
        fetch(`http://${ip}/notes/${sessionStorage.getItem('navi_user_id')}`, {
            method:'GET', 
            headers: { 'Authorization':token,'Content-Type': 'application/json' }
        })
        .then(result => result.json())
        .then(res => {
            notes = res;
            render_notes();
        })
        .catch(e => {
            alert('Error'+e.message);
        });
    }catch(err){
        alert('error:'+err.message);
    }
}
function render_notes(){
    let notes_container=document.getElementById('notes-list');
    notes_container.innerHTML='';
    for(let i=0;i<notes.length;i++){
        notes_container.innerHTML+=`<div class="quarter scalable container">
                <div class="container sub">
                    <h3>${notes[i].title}</h3>
                    <p>${notes[i].body.substring(0,30)}...</p>
                    <button onclick="open_note(${i})">open</button>
                    <button onclick="delete_note(${i})">delete</button>
                </div>
            </div>`;
    }
}
function open_note(index){
    open_overlay(document.getElementById('notes-viewer'))
    document.getElementById('note_title').innerHTML+=``
    document.getElementById('note_body').innerHTML+=``
    let current_note = notes[index]
    document.getElementById('note_title').textContent=current_note.title;
    document.getElementById('note_body').textContent=current_note.body
    document.getElementById('note_body').innerHTML+=`<div>${current_note.created_at}</div>`
}

async function upload_note(){
    let title = document.getElementById('note-title').value
    let body = document.getElementById('note-body').value
    if(!title||!body){
        alert('complete form')
        return;
    }
    try{
        fetch(`http://${ip}/create_note`, {
            method:'POST', 
            headers: { 'Authorization':token,'Content-Type': 'application/json' },
            body: JSON.stringify({
                title:title,
                body:body,
                userId:sessionStorage.getItem('navi_user_id'),
            })
        })
        .then(result => {
            res = result.json()
            console.log(res)
            alert('note created')
            fetch_notes();
        })
        .catch(e => {
            alert('Error'+e.message);
        });
    }
    catch(err){
        alert('error:'+err.message);
    }
    document.getElementById('note-title').value=''
    document.getElementById('note-body').value=''
}

async function delete_note(index){
    let id=notes[index]._id;
    try{
        fetch(`http://${ip}/delete_note/${id}`, {
            method:'DELETE', 
            headers: { 'Authorization':token,'Content-Type': 'application/json' }
        })
        .then(result => {
            res = result.json()
            console.log(res)
            alert('note deleted')
            fetch_notes();
        })
        .catch(e => {
            alert('Error'+e.message);
        });
    }catch(err){
        alert('error:'+err.message);
    }
}