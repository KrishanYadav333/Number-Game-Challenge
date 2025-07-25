let next = 0;
let score = 0;
let streak = 0;
let timeLeft = 0;
let timerInterval = null;
let gameActive = false;
const audioFiles = ['one.wav', 'two.wav', 'three.wav', 'four.wav', 'five.wav', 
                   'six.wav', 'seven.wav', 'eight.wav', 'nine.wav', 'ten.wav'];

function startGame() {
    const level = document.getElementById('level').value;
    gameActive = true;
    
    switch(level) {
        case 'easy':
            startEasyGame();
            timeLeft = 15;
            break;
        case 'medium':
            startMediumGame();
            timeLeft = 12;
            break;
        case 'hard':
            startHardGame();
            timeLeft = 10;
            break;
        case 'expert':
            startExpertGame();
            timeLeft = 8;
            break;
    }
    
    startTimer();
    document.getElementById('status').textContent = '🤔 Make your choice';
    document.getElementById('status').className = '';
    updateCount();
    
    document.getElementById('startBtn').disabled = true;
    document.getElementById('continueBtn').disabled = false;
    document.getElementById('doneBtn').disabled = false;
}

function startEasyGame() {
    const ran = Math.floor(Math.random() * 55);
    if (ran < 10) next = 1;
    else if (ran < 19) next = 2;
    else if (ran < 27) next = 3;
    else if (ran < 34) next = 4;
    else if (ran < 40) next = 5;
    else if (ran < 45) next = 6;
    else if (ran < 49) next = 7;
    else if (ran < 52) next = 8;
    else if (ran < 54) next = 9;
    else next = 10;
    
    playAudio(audioFiles[next - 1]);
}

function startMediumGame() {
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';
    
    if (operation === '+') {
        next = num1 + num2;
        playAudio(audioFiles[num1 - 1]);
        setTimeout(() => playAudio(audioFiles[num2 - 1]), 1500);
        document.getElementById('status').textContent = `🧮 ${num1} + ${num2} = ?`;
    } else {
        next = Math.max(0, num1 - num2);
        playAudio(audioFiles[num1 - 1]);
        setTimeout(() => playAudio(audioFiles[num2 - 1]), 1500);
        document.getElementById('status').textContent = `🧮 ${num1} - ${num2} = ?`;
    }
}

function startHardGame() {
    const count = Math.floor(Math.random() * 3) + 2;
    let total = 0;
    
    for (let i = 0; i < count; i++) {
        const num = Math.floor(Math.random() * 5) + 1;
        total += num;
        setTimeout(() => playAudio(audioFiles[num - 1]), i * 1200);
    }
    
    next = total;
    document.getElementById('status').textContent = `🎵 Add all numbers you hear`;
}

function startExpertGame() {
    const target = Math.floor(Math.random() * 8) + 3;
    const current = Math.floor(Math.random() * 5) + 1;
    next = target - current;
    
    playAudio(audioFiles[current - 1]);
    document.getElementById('status').textContent = `🎯 How many MORE to reach ${target}?`;
}

function startTimer() {
    document.getElementById('timer').textContent = `⏱️ ${timeLeft}s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `⏱️ ${timeLeft}s`;
        
        if (timeLeft <= 3) {
            document.getElementById('timer').classList.add('timer-warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (gameActive) {
                document.getElementById('status').textContent = '⏰ Time\'s up!';
                document.getElementById('status').className = 'wrong';
                playLaughSound();
                streak = 0;
                resetGame();
            }
        }
    }, 1000);
}

function continueGame() {
    if (!gameActive) return;
    
    playBuzzerSound();
    
    next--;
    if (next < 0) {
        document.getElementById('status').textContent = '❌ Wrong! Should have stopped';
        document.getElementById('status').className = 'wrong';
        playLaughSound();
        streak = 0;
        resetGame();
    } else {
        updateCount();
    }
}

function checkAnswer() {
    if (!gameActive) return;
    
    gameActive = false;
    clearInterval(timerInterval);
    
    if (next > 0) {
        document.getElementById('status').textContent = '💥 Oops! Should have continued';
        document.getElementById('status').className = 'wrong';
        createExplosion();
        playLaughSound();
        streak = 0;
    } else {
        const messages = ['🎉 Amazing!', '🌟 Perfect!', '🚀 Incredible!', '💎 Brilliant!', '🔥 On fire!'];
        document.getElementById('status').textContent = messages[Math.floor(Math.random() * messages.length)];
        document.getElementById('status').className = 'correct';
        createCelebration();
        playSound('correct');
        streak++;
        const bonus = streak > 1 ? streak * 5 : 0;
        score += 10 + bonus + timeLeft;
        document.getElementById('score').textContent = score;
        
        if (streak === 5) {
            setTimeout(() => {
                alert('🎊 STREAK MASTER! 5 in a row! 🎊');
            }, 1000);
        }
    }
    resetGame();
}

function createCelebration() {
    const emojis = ['🎉', '🌟', '✨', '🎊', '💫', '🎈', '🎁', '🏆'];
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * window.innerWidth + 'px';
            emoji.style.top = window.innerHeight + 'px';
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 3000);
        }, i * 200);
    }
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 200) + 'px';
            particle.style.top = (window.innerHeight / 2) + 'px';
            particle.style.background = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 5)];
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }, i * 50);
    }
}

function createExplosion() {
    const sadEmojis = ['💥', '😵', '🤯', '😱', '💔'];
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.className = 'floating-emoji';
            emoji.textContent = sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
            emoji.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 100) + 'px';
            emoji.style.top = (window.innerHeight / 2) + 'px';
            document.body.appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 3000);
        }, i * 100);
    }
}

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    } else {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

let buzzerAudioContext = null;

function initBuzzerSound() {
    buzzerAudioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playBuzzerSound() {
    if (!buzzerAudioContext) {
        initBuzzerSound();
    }
    
    const oscillator = buzzerAudioContext.createOscillator();
    const gainNode = buzzerAudioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(buzzerAudioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, buzzerAudioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, buzzerAudioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.5, buzzerAudioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, buzzerAudioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(buzzerAudioContext.currentTime + 0.3);
}

function playLaughSound() {
    // Create laugh sound using speech synthesis
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('ha ha ha ha ha');
        utterance.rate = 2;
        utterance.pitch = 1.5;
        utterance.volume = 0.3;
        speechSynthesis.speak(utterance);
    } else {
        // Fallback to generated laugh sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400 + Math.random() * 200, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(300 + Math.random() * 100, audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }, i * 100);
        }
    }
}

function updateCount() {
    if (streak > 0) {
        const streakEmojis = ['🔥', '⚡', '💥', '🌟', '🚀'];
        const emoji = streakEmojis[Math.min(streak - 1, 4)];
        document.getElementById('streak').textContent = `${emoji} Streak: ${streak}x`;
    }
}

function resetGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    setTimeout(() => {
        document.getElementById('startBtn').disabled = false;
        document.getElementById('continueBtn').disabled = true;
        document.getElementById('doneBtn').disabled = true;
        document.getElementById('timer').textContent = '';
        document.getElementById('timer').classList.remove('timer-warning');
        document.getElementById('status').textContent = '🎵 Click Start to begin';
        document.getElementById('status').className = '';
    }, 2500);
}

function playAudio(filename) {
    const audio = new Audio('audio/' + filename);
    audio.play().catch(e => console.log('Audio failed:', e));
}

// Initialize event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('continueBtn').addEventListener('click', continueGame);
    document.getElementById('doneBtn').addEventListener('click', checkAnswer);
    
    // Pre-initialize audio context on first user interaction
    document.body.addEventListener('click', function() {
        if (!buzzerAudioContext) {
            initBuzzerSound();
        }
    }, { once: true });
});