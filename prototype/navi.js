let dialog_box=document.getElementById('text-box');
let custom_api_key=null;
function chat(message,num){
    let elem = document.createElement('div')
    if(num==1){
        elem.className='user-msg';
        elem.innerHTML=`<p class="chat user-msg">you:${message}</p>`
    }else if(num==2){
        elem.className='bot-msg';
        elem.innerHTML=`<p class="chat bot-msg">${message}</p>`
    }
    dialog_box.appendChild(elem)
}

let conversations = []

async function talk(){
    let loading = document.createElement('div')
    loading.textContent = 'loading message...'
    document.getElementById('text-box').appendChild(loading)
    api_token = await get_api_key()
    if(!api_token){
        if(custom_api_key){
            api_token = custom_api_key
        }else{
            chat('Please set your API key in options to use this feature.',2)
            document.getElementById('text-box').removeChild(loading)
            return
        }
    }
    const res = await fetch(`https://router.huggingface.co/v1/chat/completions`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${api_token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model:"deepseek-ai/DeepSeek-V3-0324",
        messages:conversations
    })
    })
    let data = await res.json()
    console.log(data)
    if (!res.ok) {
        let err = await res.text()
        throw new Error(`HTTP ${res.status}: ${err}`)
        chat(`Error: ${err}`,2)
        document.getElementById('text-box').removeChild(loading)
        return;
    }
    let reply = data.choices[0].message.content
    conversations.push({ role: 'assistant', content: reply })
    chat(reply,2)
    document.getElementById('text-box').removeChild(loading)

}
function send_message(){
    let msg = document.getElementById('navi-message-input').value
    chat(msg,1)
    conversations.push({role:'user',content:`message: ${msg} | userdata: todos=${JSON.stringify(todos)}, notes=${JSON.stringify(notes)} current data=${Date.now()}`})
    talk()
    document.getElementById('navi-message-input').value = ''
    
}

async function save_conversation(){
    try{
        fetch(`http://${ip}/save_conversation`, {
            method:'POST', 
            headers: { 'Authorization':token,'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId:sessionStorage.getItem('navi_user_id'),
                data:conversations
            })
        })
        .then(result => {
            res = result.json()
            console.log(res)
            alert('data saved')
        })
        .catch(e => {
            alert('Error'+e.message);
        });
    }catch{
        alert('error:'+err.message);
    }
}

async function get_api_key() {
    try {
        const res = await fetch(`http://${ip}/get_api_key`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        if(data.api_key){
            return data.api_key
        }else{
            return null
        }
        
    } catch (e) {
        console.log('Error: ' + e.message)
        return null
    }
}

function set_api_key(){
    let input_key = document.getElementById('api-key-input').value
    if(input_key){
        custom_api_key = input_key
        alert('API key set locally for this session.')
        close_overlay()
    }
}
