/* Những việc cần làm
    1. Render songs
    2. Scroll top
    3. Play / pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / Repeat when ended
    8. Active
    9. Scroll active song intro view
    10. Play song when click
*/

const main = document.querySelector('.main'),
    listSongWrap = main.querySelector('.songs-list__songs'),
    songImg = main.querySelector('.cd-thumb'),
    songName = main.querySelector('.disc-wrap__name'),
    songAuthor = main.querySelector('.disc-wrap__author'),
    mainAudio = main.querySelector('#main-audio'),
    playBtn = main.querySelector('.play'),
    pauseBtn = main.querySelector('.pause'),
    backBtn = main.querySelector('.back'),
    nextBtn = main.querySelector('.next'),
    progressArea = main.querySelector('.progress-area'),
    progressBar = main.querySelector('.progress-bar')


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1)

window.addEventListener('load', () => {
    loadMusic(musicIndex)
    playingNow()
    scrollActiveSongToView()

    // Love Loved
    const love = document.querySelectorAll('.love')
    love.forEach(luv=>{
        luv.addEventListener('click', ()=>{
            luv.classList.toggle('active')
        })
    })

    // Volume Bar
    const volBtn = main.querySelector('.vol')
    volBtn.onclick = ()=>{
        volBtn.classList.toggle('active')
    }

    // Nav Change Tab
    const navA = document.querySelectorAll('.nav__list-item-link')
    navA.forEach(a => {
        a.onclick = () => {
            navA.forEach(a => {
                if (a.classList.contains('active')) {
                    a.classList.remove('active')
                }
            })
            a.classList.add('active')
        }
    })
})

//Render number of songs
const headingArea = main.querySelector('.main-area__heading')
headingArea.innerHTML = `
    <h3>Most Popular</h3>
    <span>
        ${allMusic.length} (<a href="https://soundcloud.com">© SoundCloud</a>)
    </span>
`

//Render Music Into Web
function renderMusic() {
    const arrRender = []
    for(var i = 0 ; i < allMusic.length ; i++) {
        var htmls = `
        <div class="song">
            <div class="song-info" div-index='${i + 1}' onclick='clicked(this)'>
                <div class="thumb" style="background-image: url('${allMusic[i].img}')">
                </div>
                <span class="song-info__number">${i + 1}</span>
                <span class="song-info__author">${allMusic[i].author}</span>
                <span class="song-info__dash">-</span>
                <span class="song-info__name">${allMusic[i].name}</span>
            </div>
            <i class="ri-heart-fill love"></i>
        </div>
        `
        arrRender.push(htmls)
    }
    listSongWrap.innerHTML = arrRender.join('')
}
//<img src="/assets/image/song_img/${allMusic[i].img}" alt="${allMusic[i].img}">
// Load Music To Disc Function
function loadMusic(indexNum) {
    songName.innerText = allMusic[indexNum - 1].name
    songAuthor.innerText = allMusic[indexNum - 1].author
    songImg.style.backgroundImage = `url('${allMusic[indexNum - 1].img}')`
    // songImg.alt = `${allMusic[indexNum - 1].src}`
    mainAudio.src = `${allMusic[indexNum - 1].src}`
}

//CD Rotate
const cdAnimate = songImg.animate([
    { transform: 'rotate(360deg)'}
], {
    duration: 10000,
    iterations: Infinity
})
cdAnimate.pause()

//Play , Pause function
function playMusic() {
    playBtn.classList.add('active')
    mainAudio.play()
    cdAnimate.play()
}

function pauseMusic() {
    playBtn.classList.remove('active')
    mainAudio.pause()
    cdAnimate.pause()
}

//Back , Next Music function
function backMusic() {
    musicIndex--
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex
    loadMusic(musicIndex)
    playMusic()
}

function nextMusic() {
    musicIndex++
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex
    loadMusic(musicIndex)
    playMusic()
}

//Play , Pause Btn Event
playBtn.addEventListener('click', () => {
    const isMusicPause = playBtn.classList.contains('active')
    if(!isMusicPause) {
        playMusic()
    }
})

pauseBtn.addEventListener('click', () => {
    const isMusicPlay = playBtn.classList.contains('active')
    if(isMusicPlay) {
        pauseMusic()
    }
})

//Back , Next Btn Event
backBtn.addEventListener('click' , () => {
    backMusic()
    playingNow()
    scrollActiveSongToView()
    
})

nextBtn.addEventListener('click' , () => {
    nextMusic()
    playingNow()
    scrollActiveSongToView()
})

//Progress bar current time and update time
mainAudio.addEventListener('timeupdate', (e) => {
    const currentTime = e.target.currentTime
    const duration = e.target.duration //duration là thời lượng audio

    let progressWidth = (currentTime * 100 / duration)
    progressBar.style.width = `${progressWidth}%`

    let musicCurrentTime = main.querySelector('.current')
    let musicDuration = main.querySelector('.duration')

    mainAudio.addEventListener('loadeddata', () => {
        //Duration update
        let audioDuration = mainAudio.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if(totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`
    })

    //Current time update
    let currentMin = Math.floor(currentTime / 60)
    let currentSec = Math.floor(currentTime % 60)

    if(currentSec < 10) {
        currentSec = `0${currentSec}`
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})

//Progress bar UPDATE TIME when click
progressArea.addEventListener('click', (e) => {
    let progressWidthValue = progressArea.clientWidth
    let clickOffSetX = e.offsetX
    let songDuration = mainAudio.duration

    mainAudio.currentTime = (clickOffSetX * songDuration / progressWidthValue)
    playMusic()
})

//Song repeat , shuffle
const repeatBtn = main.querySelector('.repeat')
repeatBtn.addEventListener('click' , () => {
    let getText = repeatBtn.innerText

    switch(getText) {
        case 'repeat':
            repeatBtn.innerText = 'repeat_one'
            break
        case 'repeat_one':
            repeatBtn.innerText = 'shuffle'
            break
        case 'shuffle':
            repeatBtn.innerText = 'repeat'
            break
    }
})

mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText
    switch(getText) {
        case 'repeat':
            nextMusic()
            playingNow()
            scrollActiveSongToView()
            break
        case 'repeat_one':
            mainAudio.currentTime = 0
            loadMusic(musicIndex)
            playMusic()
            break
        case 'shuffle':
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            }
            while (musicIndex === randIndex)

            musicIndex = randIndex
            loadMusic(musicIndex)
            playingNow()
            scrollActiveSongToView()
            playMusic()
            break
    }
})

//Change volume
function setVolume() {
    const volRange = main.querySelector('.volume-bar__range')
    mainAudio.volume = volRange.value / 100
}

renderMusic()


//Set class 'playing'
const allSong = listSongWrap.querySelectorAll('div.song')
const allSongInfo = listSongWrap.querySelectorAll('div.song-info')
function playingNow() {
    for (let j = 0; j < allSongInfo.length; j++) {
        if (allSong[j].classList.contains('playing')) {
            allSong[j].classList.remove('playing')
        }
        if (allSongInfo[j].getAttribute('div-index') == musicIndex) {
            allSong[j].classList.add('playing')
        }
    }
}

// Play Song When Click
function clicked(element) {
    let getDivIndex = element.getAttribute('div-index')
    musicIndex = getDivIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}

// Scroll Into View
function scrollActiveSongToView() {
    setTimeout(()=>{
        main.querySelector('.song.playing').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })
    }, 300)
}

