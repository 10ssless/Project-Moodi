# Project-Moodi

Moodi is a minimalist image and sound-based relaxation application.
Click on any name to go to a different sonic environment. Click a second sound to evoke an entirely new space.
Explore the possibilities and find easter eggs as you listen and relax.

Users are introduced to the app by slow flashing messages that fade in and out to recalibrate the user.
CSS stylesheets use various color properties in the blue-green family to relax the psyche and soothe the eyes.
New backgrounds fade as you slowly transport to your new environment.
HTML/CSS contain simple button elements and minimalist typograpy to better immerse the user in the audio and visual.
JavaScript retrieves sounds from Freesound API on load, stores the sound object, renders the buttons, updates the credits list.
2 main on("click") functions toggling the play/pause of each sound and updating background, and toggling the credits display.

Below are key elements to the functionality of the application.

## HTML Elements

This HTML snippet holds key links to external stylesheets and libraries

```html
  <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=DM+Serif+Display:400,400i&display=swap" rel="stylesheet">
    <link rel="icon" href="assets/images/teal.png" type="image/png" sizes="16x16">
    <link rel="stylesheet" type="text/css" href="assets/css/style.css">
    <title>moodi.</title>
```

## CSS Elements
 This code snippet sets the background that is intially displayed.

```css
/* background content */
body {
    background: rgb(34, 209, 178);
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    font-family: 'DM Serif Display', serif;
    transition-property: background;
    transition-duration: 2.5s;
}
```
This code snippet manipulates the brand icon and soothing blink displayed upon start up

```css
#header-icon {
    border: 1px solid white;
    width: 16px;
    height: 16px;
    margin-right: 5px;
    box-shadow: 0px 0px 6px ghostwhite;
    position: relative;
    top: -3px;
}
```
This allows the buttons to change color to white on hover, making them easier to identify
```css
button {
    font-family: 'DM Serif Display', serif;
    font-size: 45px;
    text-transform: uppercase;
    border: none;
    background: none;
    margin: 30px;
}
button:hover {
    color: rgba(255, 255, 255);  
}
```

## JavaScript & jQuery Elements

This  function contains the AJAX call used to gather the necessary sounds from the Freesound API, store them in a global array, render the play/pause buttons to html, and add an entry to the credits list. All actions manipulating the DOM needed to be called within the AJAX .then() function to prevent async errors later on. 
```js
    function getSound(id, i) {
         
        var api_key = ["yourAPIkey"]
        var queryURL = "https://freesound.org/apiv2/sounds/" + id + "/?descriptors=lowlevel.mfcc,rhythm.bpm&token=" + api_key[0]
        $.ajax({
            type: "GET",
            url: queryURL,
            dataType: "JSON",
        }).then(function (response) {
            
            let sound = {
                name: response.name,
                audio: new Audio(response.previews["preview-hq-mp3"]),
                creator: response.username,
                tag: "player-" + i,
                url: response.url
            }
            sounds.push(sound)
            render(sound)
            credits(sound)
        }).catch(function (err) {
            console.log("Error " + err)
            let sound = {
                creator: "unknown",
                tag: "player-x",
            }
            sounds.push(sound)
            render(sound)
            credits(sound)
        })
    }
```
Then we created a generic click function to play/pause the selected sound, and call a helper function to get a unique photo id based on the sounds currently playing, and update the background image.
```JS
  $(document.body).on("click", ".player", function () {
     
        let btn_tag = $(this).attr("data-tag")
        let btn_name = $(this).text()
        let state = $(this).attr("data-state")
        let mp3, combo_id;
        for (var i = 0; i < sounds.length; i++) {
            if (sounds[i].tag == btn_tag) {
                mp3 = sounds[i].audio
            }
        }
        if (state == "pause" && now_playing.length < 2) {
            mp3.play()
            $(this).attr("data-state", "play").css("color", "white")
            ref[btn_tag.substring(7)][2] = "play"
            now_playing.push(btn_name)              
            console.log(now_playing)
            combo_id = findCombo(now_playing)
            getBg(combo_id)         
           
        }
        else {
            mp3.pause()
            $(this).attr("data-state", "pause").css("color", "black")
            ref[btn_tag.substring(7)][2] = "pause"
            let name = ref[btn_tag.substring(7)][0]
            for (var i = now_playing.length - 1; i >= 0; i--) {    
                if (now_playing[i] == name) {
                    now_playing.splice(i, 1)
                }
            }
            console.log(now_playing)
            
            combo_id = findCombo(now_playing)
            getBg(combo_id)         
          
            
        }
    })
  ```

This function contains the XHR request to source the background images from the Pexels API
```js
function getBg(id) {
       
        var apiKey = "yourAPIkey";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "https://api.pexels.com/v1/photos/" + id, true);
        xhr.setRequestHeader('Authorization', apiKey);
        xhr.responseType = 'json';
        xhr.send();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var resp = xhr.response;
                console.log(resp);
                let img_url = JSON.stringify(resp.src.landscape);
                // $("body").css("background-image", "url(" + img_url + ")").;
                $("body").css("background-image", "url(" + img_url + ")")
            }
        }
    }
```

