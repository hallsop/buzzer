const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')
const disable = document.querySelector('.js-disable')
const enabled_text = document.querySelector('.js-enabled_text');
const buzzer1 = new Audio('buzzer1.wav');
const buzzer2 = new Audio('buzzer2.wav');

// socket.on('active', (numberActive) => {
//   active.innerText = `${numberActive} joined`
// })

socket.on('enable_text', (text) => {
    enabled_text.innerText = text;
    enabled_text_current = text;
    }
)

socket.on('buzzes', (buzzes) => {
    buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-')
      return { name: p[0], team: p[1] }
    })
    .map(user => `<li>${user.name} - ${user.team}</li>`)
    .join('')
})

socket.on('buzz_noise', (num) => {
    if (num === '1') {
        buzzer1.play();
    } else if (num === '2'){
        buzzer2.play();
    }
})

clear.addEventListener('click', () => {
    socket.emit('clear')
})

disable.addEventListener('click', () => {
    socket.emit('disable')
})