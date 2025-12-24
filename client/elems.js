let current_overlay=null
function switch_tab(tab_name){
    let tabs=document.getElementsByClassName('tab');
    for(let i=0;i<tabs.length;i++){
        tabs[i].style.display='none';
    }
    document.getElementById(tab_name).style.display='flex';
    if(tab_name=='notes'){
        render_notes();
    }
    if(tab_name=='todo'){
        render_todos();
    }
}
function open_overlay(elem){
    if(current_overlay!=null){
        current_overlay.style.display='none';
    }
    elem.style.display='flex';
    current_overlay=elem;
}
function close_overlay(){
    if(current_overlay!=null){
        current_overlay.style.display='none';
    }
}

function open_navbar(){
    document.getElementById('nav-mobile-links').style.display='flex'
}
function close_navbar(){
    document.getElementById('nav-mobile-links').style.display='none'
}