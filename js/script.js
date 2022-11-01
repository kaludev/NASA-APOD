
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
        this.img.style.top = `${this.top-70}px`;
        this.img.style.left = `${this.left-70}px`;
        return false;
    }
    display(){
        document.body.appendChild(this.img)
    }
}
document.addEventListener('DOMContentLoaded',async () =>{
    document.body.style.backgroundImage = 'url(\''+await APICall(`https://api.nasa.gov/planetary/apod?api_key=${APIKey}&&thumbs=true`)+'\')'
});
let hold;
let scale = 50;
let currentIndex = 0;
let currentPlanet; 
let srcs = ['mercury.png','venus.png','earth.png','mars.png','jupyter.png','saturn.png','uranus.png','neptun.png']

window.addEventListener('mousedown',(event) =>{
    currentPlanet = document.createElement('img');
    currentPlanet.classList.add('planet')
    currentPlanet.src = './img/'+srcs[currentIndex];
    currentPlanet.style.top = `${event.pageY}px`;
    currentPlanet.style.left = `${event.pageX}px`;
    currentPlanet.style.transform = `scale(${scale}%)`
    currentPlanet = new Planet(currentPlanet,event.pageY,event.pageX,Math.random()*6.28,1);
    currentPlanet.display();
    hold  = setInterval(() =>{
        currentPlanet.img.style.transform = `scale(${scale}%)`
        scale+= 0.1;
    },5)
    currentIndex++;
    currentIndex = currentIndex%8;
})
window.addEventListener('mouseup',(event) =>{
    clearInterval(hold)
    scale = 50;
    planets.push(currentPlanet)
    hold = undefined;
    currentPlanet = undefined;
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