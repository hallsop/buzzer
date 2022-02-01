const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

const title = 'Buffer Buzzer'

let data = {
  users: new Set(),
  buzzes: new Set(),
}

let buzz_status = true;
let buzz_status_text="Buzzers Enabled"

const getData = () => ({
  users: [...data.users],
  buzzes: [...data.buzzes].map(b => {
    const [ name, team ] = b.split('-')
    return { name, team }}
  ),
  enabled: buzz_status_text
})

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index', { title }))
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())))

io.on('connection', (socket) => {
  socket.on('join', (user) => {
    data.users.add(user.id)
    io.emit('active', [...data.users].length);
    console.log(`${user.name} joined!`)
  })

  socket.on('buzz', (user) => {
    if (buzz_status) {
      data.buzzes.add(`${user.name}-Team ${user.team}`)
      io.emit('buzzes', [...data.buzzes])
      let num = user.team;
      io.emit('buzz_noise', num)
      console.log(`${user.name} buzzed in! - number ${num}`)
    }
  })

  socket.on('clear', () => {
    data.buzzes = new Set()
    io.emit('buzzes', [...data.buzzes])
    console.log(`Clear buzzes`)
  })

  socket.on('disable', () => {
    if (buzz_status) {
      buzz_status = false;
      buzz_status_text = "Buzzers Disabled";
      io.emit('enable_text', buzz_status_text);
    }else{
      buzz_status = true;
      buzz_status_text = "Buzzers Enabled";
      io.emit('enable_text', buzz_status_text);
    }
  })
})

server.listen(8090, () => console.log('Listening on 8090'))
