var express = require('express'),
app = express(),
server = require('http').Server(app),
io = require('socket.io')(server),
bodyParser = require('body-parser'),
escape = require('escape-htmlandmongo'),
validator = require('validator'),
confi = require('./confi.json')

app.use(bodyParser.json({limit: '30mb'}))
app.set('view engine', 'ejs')
app.use(express.static('./public'))

// objeto que va alojando actualización de fotos y fecha
var respuesta = {}

app.get('/', (req, res) => {
	res.render('index',{respuesta})
});

app.post('/a/f', (req, res) => {
	if ( Object.keys(req.body).length == 2 && escape.esc(req.body.c) == confi.contrasena) {
		// escapar contraseña, comprobar que coinciden.
		// c , f is base64
		if ( validator.isBase64(req.body.fo) ) {
			
			// actualizar variables de foto y fecha
			respuesta.fe = Date.now()
			respuesta.fo = req.body.fo

			// enviar por socket
			io.emit('a',{respuesta})



			var response = {"error": false}
			res.json(response)
		} else {
			var response = {"error": true}
			res.json(response)
		}
	} else {
		var response = {"error": true};
		res.json(response)
	}
});


server.listen(confi.puerto, () => console.log('La magia sucede en http://localhost:'+ confi.puerto))
