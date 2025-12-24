 function change_theme(theme){
    const root = document.documentElement;
    if(theme=='dark'){
        root.style.setProperty('--primary-bg-color', '#1c475aff');
        root.style.setProperty('--secondary', '#33518cff');
        root.style.setProperty('--accent', 'rgba(191, 207, 254, 1)');
    }else{
        root.style.setProperty('--primary-bg-color', '#eefaff');
        root.style.setProperty('--secondary', '#bad1ff');
        root.style.setProperty('--accent', 'rgb(22, 22, 99)');
    }
}