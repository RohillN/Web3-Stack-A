$(function () {
    console.log("Statics route for scripts loaded!");
});


//Reference @https://www.youtube.com/watch?v=QKcVjdLEX_s
function submit_entry() 
{
    var name = document.getElementById("name");
    
    var entry = {
        name: name.value
    };

    //console.log(entry);

    fetch(`${window.origin}/postCountries`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(function(response) 
    {
        if (response.status != 200)
        {
            console.log(`Response status was not 200: ${response.status}`);
            return ;
        }

        response.json().then(function(data)
        {
            console.log(data);
        })
    })
}
