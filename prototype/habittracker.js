let habits =  [
    {name:'gym',complete:true,dates:["2026-02-22","2026-02-24"]}
];
//let today = new Date().toDateString();
let today = new Date()
let todayString = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

function render_habits(date){
    let list = document.getElementById("habits");
    list.innerHTML="";

    habits.forEach((habit,index)=>{
        let div = document.createElement("div");
        let title = document.createElement('h3')
        title.textContent=habit.name
        title.onclick=()=>{
            let today = new Date()
            let todayString = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

            if(!habit.dates.includes(todayString)){
                toggleHabit(index)
            }
            
        }
        div.append(title)
        let now = new Date(date)
        let year = now.getFullYear()
        let month = now.getMonth()

        let daysInMonth = new Date(year, month + 1, 0).getDate()

        for(let j = 1; j <= daysInMonth; j++){
            let elem = document.createElement('span')

            let monthFormatted = String(month + 1).padStart(2, '0')
            let dayFormatted = String(j).padStart(2, '0')

            let dateString = `${year}-${monthFormatted}-${dayFormatted}`
            elem.textContent = dateString

            if(habit.dates.includes(dateString)){
                elem.style.color = 'red'
            }

            elem.onclick = () => {
                let today = new Date()
                let todayString = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

                if(todayString === dateString){
                    if(!habit.dates.includes(todayString)){
                        habit.dates.push(todayString)
                    }
                    render_habits(todayString);
                }
            }

            div.append(elem)
        }
        
        list.appendChild(div);
    });
}

function render_habit_calendar(){
    let elem = document.getElementById("habit calendar");
}

function create_habit(){
    let input = document.getElementById("habitInput");
    if(!input.value.trim()) return;

    habits.push({
        name: input.value,
        completed:false,
        dates:[]
    });

    input.value="";
    render_habits(todayString);
}

function toggleHabit(index){
    let habit = habits[index];

    if(!habit.completed){
        habit.completed = true;
        let d = new Date()
        habit.dates.push(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`);
    } else {
        habit.completed = false;
        habit.dates.pop()
    }

    render_habits(todayString);
}

function deleteHabit(index){
    habits.splice(index,1);
    render_habits(todayString);
}



function prev_month(){
    if((today.getMonth()+1)<3)return
    today = new Date(`${today.getFullYear()}-${String((today.getMonth()+1)-1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`)
    todayString = `${today.getFullYear()}-${String(today.getMonth()).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    render_habits(todayString);
}
function next_month(){
    if((today.getMonth()+1)>11)return
    today = new Date(`${today.getFullYear()}-${String((today.getMonth()+1)+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`)
    todayString = `${today.getFullYear()}-${String(today.getMonth()).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    render_habits(todayString);
}


render_habits(todayString);