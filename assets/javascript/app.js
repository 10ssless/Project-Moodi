/*
    loop thru an array of sound IDs
    pass each ID to getSound() to create new audio player
    ---need to create objs for each sound to store credits, volume, etc
    create play/pause buttons for each sound
    ---need data-state=play or pause attr
*/


$(document).ready(function () {
    // clear page first
    $(".main-content").hide()
    $(".welcome").hide()
    $(".details").hide()
    $(".create").hide()
    $("#credits").hide()
    $("#header-icon").hide()

    // global array of IDs for pre-selected sounds from freesound API 
    var ids = ["95548", "353501", "22384", "24511", "398160", "416027", "425173"]

    //  bank of names, volume levels, play states to help initialize page
    var ref = {
        0: ["fire", 0.5, "pause"],
        1: ["wind", 0.2, "pause"],
        2: ["earth", 1, "pause"],
        3: ["water", 0.3, "pause"],
        4: ["youth", 0.75, "pause"],
        5: ["city", 0.5, "pause"],
        6: ["rain", 0.2, "pause"],
        x: ["error", 0, "pause"],
    }

    // combos.fire.water
    // bank of img ids for all the different combinations of sounds
    var combos = {
        fire: {
            fire: "1061640",
            wind: "431722",
            earth: "51951",
            water: "2637996",
            youth: "1251796",
            city: "2347011",
            rain: "2308671",
        },
        wind: {
            wind: "2221515",
            fire: "431722",
            earth: "721993",
            water: "1698618",
            youth: "2162454",
            city: "1108402",
            rain: "2100253",
        },
        earth: {
            earth: "917494",
            fire: "51951",
            wind: "721993",
            water: "927414",
            youth: "699558",
            city: "1018478",
            rain: "1463530",
        },
        water: {
            water: "1480807",
            fire: "2637996",
            wind: "1698618",
            earth: "927414",
            youth: "2516017",
            city: "270186",
            rain: "2423959",
        },
        youth: {
            youth: "754769",
            fire: "1251796",
            wind: "2162454",
            earth: "699558",
            water: "707185",
            city: "1309611",
            rain: "1564828",
        },
        city: {
            city: "378570",
            fire: "2347011",
            wind: "1108402",
            earth: "1018478",
            water: "270186",
            youth: "1309611",
            rain: "1455993",
        },
        rain: {
            rain: "459451",
            fire: "2308671",
            wind: "2100253",
            earth: "1463530",
            water: "2423959",
            youth: "1564828",
            city: "950223",
        }
    }
    
    // now_playing array to track history of selected sounds
    // empty array to store sound objects in
    var now_playing = []    
    var sounds = []         

    // renames & creates buttons for each sound, and adds to html page
    function render(snd) {
        let btn = $("<button>")
        let key = snd.tag
        let name = ref[key.substring(7)][0]
        // let img = img_search[key.substring(7)]
        let vol = ref[key.substring(7)][1]
        snd.audio.volume = vol
        // console.log(name+" "+vol)
        btn.addClass("player")
        btn.attr("data-tag", key)
        // btn.attr("data-name",img)
        btn.attr("data-state", "pause")
        btn.text(name)
        $(".main-content").append(btn)
    }

    // loads credits for each sound from stored info in sound object
    function credits(snd) {
        let name = snd.creator
        let key = snd.tag
        let title = ref[key.substring(7)][0]
        let nameLink = $("<a>").attr("href", snd.url).attr("target", "_blank")
        nameLink.addClass("detail-name").text(name + ": " + title)
        $(".details").append(nameLink)
    }

    // main AJAX call to retrieve sounds from freesound.org
    // creates new sound object with relevant info
    // stores in sounds array, calls functions to render buttons and load credits
    // includes catch for when API returns an error
    function getSound(id, i) {
        // API parameters   
        var api_key = ["zpYw9os3gddk5YShY8pJFMyYJbfQmcJQ5HbEqCer", "gHsTMrTQ9mdPAwY5kawYD9ilwE8awIeNHhKKy0Aa"]
        var queryURL = "https://freesound.org/apiv2/sounds/" + id + "/?descriptors=lowlevel.mfcc,rhythm.bpm&token=" + api_key[1]
        $.ajax({
            type: "GET",
            url: queryURL,
            dataType: "JSON",
        }).then(function (response) {
            // console.log(response)
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

    // The pexel api ajax call
    // get sound id or combo id to request img from API 
    function getBg(id) {
        // var apiKey = '563492ad6f91700001000001f9b725e5839c427983b9e3dab63fd890';
        // var apiKey = '563492ad6f91700001000001de035b34feb64a7d880dad502e38a23f';
        var apiKey = "563492ad6f9170000100000166ec2901806241929301869b3f72545c";
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

    // function colorize() {
    //     for (var i = 0; i < 7; i++) {
    //         let tag = ".player-" + i
    //         if (ref[i][2] == "play") {
    //             $(tag).css("color", "white")
    //         }
    //         else {
    //             $(tag).css("color", "black")
    //         }
    //     }
    // }

    function findCombo(arr){
        if (arr.length > 2) {
            let one = arr[arr.length - 2]
            let two = arr[arr.length - 1]
            np = [one, two]
            return combos[np[0]][np[1]]
        }
        else if (arr.length > 1) {
            np = arr
            return combos[np[0]][np[1]]
        }
        // else if (arr.length > 0){
        //     np = [arr[0], arr[0]]
        //     return combos[np[0]][np[1]]
        // }
        else {
            np = [arr[0], arr[0]]
            return combos[np[0]][np[1]]
        }
    }



    // fill sounds array with new sound objects
    // where ajax function is called
    for (var i = 0; i < ids.length; i++) {
        getSound(ids[i], i);
    }


    // click button to play/pause 
    // reference sounds array to find which sound was selected
    $(document.body).on("click", ".player", function () {

        // get info stored in button
        let btn_tag = $(this).attr("data-tag")
        let btn_name = $(this).text()
        let state = $(this).attr("data-state")
        let mp3, combo_id;
        for (var i = 0; i < sounds.length; i++) {
            if (sounds[i].tag == btn_tag) {
                mp3 = sounds[i].audio
            }
        }

        // play-pause code
        if (state == "pause" && now_playing.length < 2) {
            mp3.play()
            $(this).attr("data-state", "play").css("color", "white")
            ref[btn_tag.substring(7)][2] = "play"
            now_playing.push(btn_name)              // add name of sound to now_playing array
            console.log(now_playing)
            combo_id = findCombo(now_playing)
            getBg(combo_id)         // background image API call
            // colorize()           // assign black & white color only to now playing
        }
        else {
            mp3.pause()
            $(this).attr("data-state", "pause").css("color", "black")
            ref[btn_tag.substring(7)][2] = "pause"
            let name = ref[btn_tag.substring(7)][0]
            for (var i = now_playing.length - 1; i >= 0; i--) {     // remove name from now_playing
                if (now_playing[i] == name) {
                    now_playing.splice(i, 1)
                }
            }
            console.log(now_playing)
            // if(now_playing > 0){
            combo_id = findCombo(now_playing)
            getBg(combo_id)         // background image API call
            // }
                // colorize()           // assign black & white color only to now playing
            
        }
    })


    // click to display credit info with links to original url
    $("#credits").click(function () {
        let state = $(".details").attr("data-state")
        if (state == "hidden") {
            $(".details").fadeIn(1000)
            $(".details").attr("data-state", "visible")
            $("footer").css("color", "rgba(0, 0, 0)")
        }
        else {
            $(".details").fadeOut(1000)
            $(".details").attr("data-state", "hidden")
            $("footer").css("color", "rgba(0, 0, 0, 0.445)")
        }
    })


    // fading elements
    var iconFade = setTimeout(function () {
        $("#header-icon").fadeIn(1000)
    }, 300)

    var iconBlink = setInterval(function () {
        $("#header-icon").fadeToggle(1500)
    }, 1500)

    var welcome = setTimeout(function () {
        $(".welcome").fadeIn(1500).delay(2000).fadeOut(1500)
    }, 1000)

    var create = setTimeout(function () {
        $(".create").fadeIn(1500).delay(1000).fadeOut(1500)
    }, 6000)

    var loadIn = setTimeout(function () {
        $(".main-content").fadeIn(3000)
        $("#credits").delay(1000).fadeIn(3000)
    }, 10000)

})