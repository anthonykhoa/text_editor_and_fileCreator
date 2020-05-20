const express = require('express')
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/assetExercise', express.static('app_srcs'))

//statically host created files
app.use('/assetExercise/userUploads', express.static('uploads'))

//makes folder on server startup
fs.mkdir(__dirname + '/uploads', (err) => {
	if (err) return ;
})

//write to file
app.post('/assetExercise/api/files', (req, res) => {
	fs.writeFile(__dirname + `/uploads/${req.body.name}`, req.body.content, (err) => {
		if (err) throw err;
	})
	//deletes each file after 5 minutes
	setTimeout(() => {
		fs.unlink(__dirname + `/uploads/${req.body.name}`, (err) => {
			if (err) throw err;
		})
	}, 300000)
	res.status(201).send('SUCCESSFUL CREATION OF FILE')
})

//returns arr of file names
app.get('/assetExercise/api/files', (req, res) => {
	fs.readdir(__dirname + '/uploads', (err, files) => res.json(files))
});

//returns content of a file
app.get('/assetExercise/api/files/:file', (req, res) => {
	fs.readFile(__dirname + `/uploads/${req.params.file}`, 'utf8', (err, data) => {
  		if (err) return res.status(400).send('file not found');
  		res.json(data)
	});
});

//main page
app.get('/assetExercise', (req, res) => {
	// fs.unlink(__dirname + `/uploads/amazing.html`, (err) => {
	// 	if (err) throw err;
	// })
	res.sendFile('index.html');
});

app.listen(process.env.PORT || 8123);
