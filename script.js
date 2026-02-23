console.log("Welcome to Spotify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let currentTimeDisplay = document.getElementById('currentTime');
let totalDurationDisplay = document.getElementById('totalDuration');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let searchInput = document.getElementById('searchInput');
let volumeSlider = document.getElementById('volumeSlider');
let volumeIcon = document.getElementById('volumeIcon');

let songs = [
    { songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg" },
    { songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg" },
    { songName: "DEAF KEV - Invincible [NCS Release]", filePath: "songs/3.mp3", coverPath: "covers/3.jpg" },
    { songName: "Different Heaven & EH!DE - My Heart", filePath: "songs/4.mp3", coverPath: "covers/4.jpg" },
    { songName: "Janji-Heroes-Tonight", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
    { songName: "Heroes Tonight", filePath: "songs/6.mp3", coverPath: "covers/6.jpg" },
    { songName: "Invincible", filePath: "songs/7.mp3", coverPath: "covers/7.jpg" },
    { songName: "Sky High", filePath: "songs/8.mp3", coverPath: "covers/8.jpg" },
    { songName: "Heroes Tonight", filePath: "songs/9.mp3", coverPath: "covers/9.jpg" },
    { songName: "Symbolism", filePath: "songs/10.mp3", coverPath: "covers/10.jpg" },
]

// Initialize song list UI
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
})

// Helper functions for updating UI
const updatePlayIcon = (isPlaying) => {
    if (isPlaying) {
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
}

const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    })
}

const updateListIcon = (index, isPlaying) => {
    makeAllPlays();
    if (isPlaying) {
        let currentIcon = document.getElementById(index.toString());
        if (currentIcon) {
            currentIcon.classList.remove('fa-play-circle');
            currentIcon.classList.add('fa-pause-circle');
        }
    }
}

const playSong = () => {
    audioElement.play();
    updatePlayIcon(true);
    updateListIcon(songIndex, true);
}

const pauseSong = () => {
    audioElement.pause();
    updatePlayIcon(false);
    updateListIcon(songIndex, false);
}

const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) { sec = `0${sec}` };
    return `${min}:${sec}`;
}

// Handle master play/pause click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        playSong();
    }
    else {
        pauseSong();
    }
})

// Listen to Events
audioElement.addEventListener('timeupdate', () => {
    // Update Seekbar value
    let progress = (audioElement.currentTime / audioElement.duration) * 100;
    if (!isNaN(progress)) {
        myProgressBar.value = progress;
        // Dynamically color the filled vs unfilled portion
        myProgressBar.style.background = `linear-gradient(to right, var(--primary-color) ${progress}%, #535353 ${progress}%)`;
    }

    // Update Timers
    currentTimeDisplay.innerText = formatTime(audioElement.currentTime);
})

// When metadata loads, set total duration
audioElement.addEventListener('loadedmetadata', () => {
    totalDurationDisplay.innerText = formatTime(audioElement.duration);
});

// Auto-advance when song ends
audioElement.addEventListener('ended', () => {
    document.getElementById('next').click();
});

// Use 'input' instead of 'change' for smoother real-time scrubbing without needing a full click release
myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
})

Array.from(document.getElementsByClassName('songItem')).forEach((element, i) => {
    element.addEventListener('click', (e) => {
        // Ignore clicks on the play icon itself, we handle that elsewhere or we can let this handle the whole row
        // Actually, the previous implementation relied on clicking the icon. Let's make the whole row clickable!
        let clickedIndex = i;

        // If clicking the currently playing song's row, toggle it
        if (clickedIndex === songIndex) {
            if (audioElement.paused) {
                playSong();
            } else {
                pauseSong();
            }
        } else {
            // New song selected
            songIndex = clickedIndex;
            audioElement.src = `songs/${songIndex + 1}.mp3`;
            masterSongName.innerText = songs[songIndex].songName;
            audioElement.currentTime = 0;
            playSong();
        }
    })
})

const playNext = () => {
    if (songIndex >= 9) {
        songIndex = 0
    }
    else {
        songIndex += 1;
    }
    audioElement.src = `songs/${songIndex + 1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    playSong();
}

document.getElementById('next').addEventListener('click', playNext);

document.getElementById('previous').addEventListener('click', () => {
    if (audioElement.currentTime > 3) {
        // If more than 3 sec in, just replay song
        audioElement.currentTime = 0;
    } else {
        if (songIndex <= 0) {
            songIndex = 9; // loop to end
        }
        else {
            songIndex -= 1;
        }
        audioElement.src = `songs/${songIndex + 1}.mp3`;
        masterSongName.innerText = songs[songIndex].songName;
    }
    audioElement.currentTime = 0;
    playSong();
})

// Search Logic
searchInput.addEventListener('input', (e) => {
    let filter = e.target.value.toLowerCase();
    songItems.forEach((element, i) => {
        let text = songs[i].songName.toLowerCase();
        if (text.includes(filter)) {
            element.style.display = "flex";
        } else {
            element.style.display = "none";
        }
    });
});

// Volume Initialization
audioElement.volume = volumeSlider.value / 100;
volumeSlider.style.background = `linear-gradient(to right, var(--primary-color) ${volumeSlider.value}%, #535353 ${volumeSlider.value}%)`;

// Volume Control Logic
volumeSlider.addEventListener('input', (e) => {
    let volume = e.target.value / 100;
    audioElement.volume = volume;
    volumeSlider.style.background = `linear-gradient(to right, var(--primary-color) ${e.target.value}%, #535353 ${e.target.value}%)`;

    if (volume === 0) {
        volumeIcon.className = "fas fa-volume-mute";
    } else if (volume < 0.5) {
        volumeIcon.className = "fas fa-volume-down";
    } else {
        volumeIcon.className = "fas fa-volume-up";
    }
});

let isMuted = false;
let previousVolume = 100;

volumeIcon.addEventListener('click', () => {
    if (isMuted) {
        audioElement.volume = previousVolume / 100;
        volumeSlider.value = previousVolume;
        volumeSlider.style.background = `linear-gradient(to right, var(--primary-color) ${previousVolume}%, #535353 ${previousVolume}%)`;
        volumeIcon.className = previousVolume < 50 ? "fas fa-volume-down" : "fas fa-volume-up";
        isMuted = false;
    } else {
        previousVolume = volumeSlider.value;
        audioElement.volume = 0;
        volumeSlider.value = 0;
        volumeSlider.style.background = `linear-gradient(to right, var(--primary-color) 0%, #535353 0%)`;
        volumeIcon.className = "fas fa-volume-mute";
        isMuted = true;
    }
});
