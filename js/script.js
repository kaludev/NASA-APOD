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