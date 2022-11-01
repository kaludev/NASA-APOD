const { makeId } = require("maildev/lib/utils");

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

document.addEventListener('DOMContentLoaded',async () =>{
    document.body.style.backgroundImage = 'url(\''+await APICall(`https://api.nasa.gov/planetary/apod?api_key=${APIKey}&&thumbs=true`)+'\')'
});
let hold;
let time = 0;
window.addEventListener('mousedown',() =>{
    time = 0
    hold = setInterval(() =>{
        time++
    },1)
})
window.addEventListener('mouseup',() =>{
    clearInterval(hold)
    console.log(time)
    time = 0;
    hold = undefined;
})