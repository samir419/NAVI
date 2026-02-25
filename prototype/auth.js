const token = sessionStorage.getItem('navi_jwt_token');
const ip = sessionStorage.getItem('navi_server_ip');
let user_data
if (!token) {
    alert('No token found, redirecting to login');
    window.location.href = '/';
}
console.log(token)
fetch(`http://${ip}/authenticate`, {
    method:'POST', 
    headers: { 'Authorization':token,'Content-Type': 'application/json' },
    body: JSON.stringify({userId:sessionStorage.getItem('navi_user_id')})
})
.then(r => r.json())
.then(data => {
if (data){
    console.log(data);
    if(data.status=='fail'){
        alert(data.message)
        window.location.href = '/';
    }else{
        user_data=data.user
    }
}
else alert('Not authenticated');
})
.catch(e => {
alert('Error authenticating:'+e.message);
});