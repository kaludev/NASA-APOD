
const APIKey = 'y4JhDYAjezUydDB6XxJUqJVT8FizAqOffEegcVlV'

async function APICall(URL){
    try{
        const response = await fetch(URL)
        if(!response.ok) throw new Error("Couldn't connect to nasa API")
        const data = await response.json();
        return (data.media_type ==='video')?data.thumbnail_url:data.hdurl||data.url;
    }catch{
        console.log("Error hapened :( URL:")
        console.log(URL)
    }
}
let planets = [];
let currentImage = document.querySelector('#currentImage')
let currDate = new Date()
class Planet{
    constructor(img,top,left,angle,speed){
        this.img = img;
        this.top = top;
        this.left = left;
        this.angle = angle;
        this.speed = speed;
    }
    move(){
        this.top+= Math.sin(this.angle)*this.speed;
        this.left += Math.cos(this.angle)*this.speed;
        if(this.top<-this.img.naturalHeight || this.top>(window.innerHeight+this.img.naturalHeight) || this.left<-this.img.naturalHeight || this.left>(window.innerWidth+this.img.naturalHeight)){
            return true;
        }
        this.img.style.top = `${this.top}px`;
        this.img.style.left = `${this.left}px`;
        return false;
    }
    display(){
        document.body.appendChild(this.img)
    }
}
document.addEventListener('DOMContentLoaded',async () =>{
    document.body.style.backgroundImage = 'url(\''+await APICall(`https://api.nasa.gov/planetary/apod?api_key=${APIKey}&&thumbs=true&date=2022-11-01`)+'\')'
    const URL = `https://api.nasa.gov/planetary/apod?api_key=${APIKey}&&thumbs=true&date=${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()}`
    console.log(URL)
    currentImage.src = await APICall(URL)

});
let hold;
let scale = 50;
let currentIndex = 0;
let currentPlanet; 
let srcs = ['mercury.png','venus.png','earth.png','mars.png','jupyter.png','saturn.png','uranus.png','neptun.png']

window.addEventListener('mousedown',(event) =>{
    if(!hold){
        currentPlanet = document.createElement('img');
        currentPlanet.classList.add('planet')
        if(Math.random()<0.02){
            currentPlanet.src = './img/Easter egg.png'
        }else{
            currentPlanet.src = './img/'+srcs[currentIndex];
        }
        currentPlanet.style.top = `${event.pageY-140}px`;
        currentPlanet.style.left = `${event.pageX-140}px`;
        currentPlanet.style.transform = `scale(${scale}%)`
        currentPlanet = new Planet(currentPlanet,event.pageY-140,event.pageX-140,Math.random()*6.28,1.5);
        currentPlanet.display();
        hold  = setInterval(() =>{
            currentPlanet.img.style.transform = `scale(${scale}%)`
            if(scale <100){
                scale+= 0.3;
            }
            
        },5)
        currentIndex++;
        currentIndex = currentIndex%8;
    }
})
window.addEventListener('mouseup',(event) =>{
    if(hold){
        clearInterval(hold)
        scale = 50;
        planets.push(currentPlanet)
        hold = undefined;
        currentPlanet = undefined;
    }
})


setInterval(() =>{
    for(let i = 0; i<planets.length;i++){
        let planet = planets[i];
        let out = planet.move();
        if(out){
            planet.img.remove();
            planets.splice(i,1);
        }
    }
    
},5)

async function toDataURL(url) {
    const blob = await fetch("https://api.codetabs.com/v1/proxy?quest="+ url).then(res => res.blob());
    return URL.createObjectURL(blob);
}

async function download(URL) {
    const a = document.createElement("a");
    a.href = await toDataURL(await APICall(`https://api.nasa.gov/planetary/apod?api_key=${APIKey}&&thumbs=true&date=${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()}`));
    a.download = "myImage.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.querySelector('#download').addEventListener('click',() =>{
    download()
})

document.querySelector('#Date').addEventListener('click',() =>{
    
    let overlay = document.querySelector('.calendar-bg')
    overlay.style.display = 'flex'

})
const febDays = (year) =>{
    if(year%400===0){
        return 29;
    }else if(year%100===0){
        return 28;
    }else if(year%4 ===0){
        return 29;
    }else{
        return 28;
    }
}
let days = [31,febDays(currDate.getFullYear()),31,30,31,30,31,30,30,31,30,31]
const months = ['JAN','FEB','MAR','APR','MAJ','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const fullMonths = ['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar']
let year = document.querySelector('.year')
let meseci = document.querySelector('.calendar-months');
let dani = document.querySelector('.calendar-days')
let curMoY = document.querySelector('.curMoY');
let curDay = document.querySelector('.curDay')
const DateChanged = async () =>{
    curMoY.textContent = fullMonths[currDate.getMonth()]+'-'+currDate.getFullYear()
    curDay.textContent = currDate.getDate();
    const URL = `https://api.nasa.gov/planetary/apod?api_key=${APIKey}&&thumbs=true&date=${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()}`
    const src = await APICall(URL)
    console.log(URL)
    console.log(src)
    currentImage.src = './img/Empty.png';
    currentImage.src = src;
    document.querySelector('.calendar-photo').style.backgroundImage = `url("${src}")`
}
const deleteDays = () =>{
    while (dani.firstChild) {
        dani.removeChild(dani.firstChild);
    }
}
const removeActiveM = () =>{
    let monthses = document.querySelectorAll('.activeMonth')
    console.log(monthses)
    monthses.forEach(month =>{
        month.classList.remove('activeMonth')
    })
}
const removeActiveD = () =>{
    document.querySelectorAll('.activeDay').forEach(day =>{
        day.classList.remove('activeDay')
    })
}
const changeDate = (elem) =>{
    removeActiveD();
    currDate.setDate(elem.textContent)
    elem.classList.add('activeDay')
    
}
const changeMonth = async (elem) =>{
    if(currDate.getDate()> days[months.indexOf(elem.textContent)])
        currDate.setDate(days[months.indexOf(elem.textContent)]);
    currDate.setMonth(months.indexOf(elem.textContent))
    removeActiveM();
    elem.classList.add('activeMonth')
    generateDays();
    
}
const changeMonthByNum = (num) =>{
    if(currDate.getDate()> days[num])
        currDate.setDate(days[num]);
    currDate.setMonth(num)

    removeActiveM();
    document.querySelectorAll('.calendar-months div').forEach(month =>{
        if(month.textContent == months[num]){
            month.classList.add('activeMonth')
            
        }
    })
    generateDays();
    
}
const generateDays = () =>{
    days[1] = febDays()
    deleteDays();
    for(let i = 0; i<(currDate.getDay());i++){
        let elem = document.createElement('div');
        elem.textContent = days[(12+currDate.getMonth()-1)%12]-currDate.getDay()+i+1;
        elem.classList.add('prevDays')
        elem.addEventListener('click',() =>{
            
           if(!currDate.getMonth()){
            currDate.setFullYear(currDate.getFullYear()-1)
            year.textContent = `${currDate.getFullYear()}`;
           }
             changeMonthByNum((12+currDate.getMonth()-1)%12)
            currDate.setDate(elem.textContent);
            generateDays()
            DateChanged();
        })
        dani.appendChild(elem)

    }
    for(let i = 0;i<days[currDate.getMonth()];i++){
        let elem = document.createElement('div');
        elem.textContent = i+1;
        if(currDate.getDate() === i+1){
            elem.classList.add('activeDay')
        }
        elem.addEventListener('click',async event =>{
            await changeDate(event.target);
            DateChanged()
        })
        dani.appendChild(elem)
    }
}


for(let i = 0;i<12;i++){
    let currentMonth = document.createElement('div');
    currentMonth.textContent = months[i];
    if(currDate.getMonth() === i){
        currentMonth.classList.add('activeMonth')
    }
    currentMonth.addEventListener('click',async event =>{
        await changeMonth(event.target);
        DateChanged()
    })
    meseci.appendChild(currentMonth)
}

const changeYear = (yearChange) =>{
    currDate.setFullYear(yearChange)
    year.textContent = `${currDate.getFullYear()}`;
    generateDays();
}

changeYear(currDate.getFullYear())
document.querySelector('.year-prev').addEventListener('click',() =>{
    changeYear(currDate.getFullYear()-1);
    DateChanged()
})

document.querySelector('.year-next').addEventListener('click',() =>{
    changeYear(currDate.getFullYear()+1);
    DateChanged()
})

document.querySelector('.closeCalendar').addEventListener('click',() =>{
    let overlay = document.querySelector('.calendar-bg')
    overlay.style.display = 'none'
})

document.querySelector('#reset').addEventListener('click',async () =>{
    let today =new Date()
    await changeYear(today.getFullYear());
    await meseci.querySelectorAll('div').forEach(async month =>{
        if(month.textContent == months[today.getMonth()]){
            await changeMonth(month)
        }
    })
    await currDate.setDate(today.getDate())
    await generateDays()
    DateChanged()
    

})
