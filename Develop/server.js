
const express = require('express');
const input = require('./db/db.json');
const path = require('path');
const PORT = 3001;
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request get notes
app.get('/api/notes', (req, res) => {

  let database = JSON.stringify(input);
  // Send a message to the client
  res.json(database);

  // Log our request to the terminal
  //console.info(`${req.method} request received to get reviews`);
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a review`);

  const { title, text, noteID } = req.body;

  if (title && text && noteID) {
    const newNote = {
      title,
      text,
      noteID,
    }

    const response = {
      status: 'Success!',
      body: newNote,
    }
  
    console.log(response);
    res.json(response);

    // Convert the data to a string so we can save it
    const noteString = `
    ,` + JSON.stringify(newNote);


    fs.readFile(`./db/db.json`, function read(err, data) {
      if (err) {
          throw err;
      }
      var position = data.indexOf(']') - 1


      var file_content = data.toString();
      file_content = file_content.substring(position);
      var file = fs.openSync('./db/db.json','r+');
      var bufferedText = new Buffer.from(noteString+file_content);
      fs.writeSync(file, bufferedText, 0, bufferedText.length, position);
      fs.close(file);

      err
      ? console.error(err)
      : console.log(
          `Note has been written to JSON file`
        )
  });
  }
  else {
    res.json('Error in adding a note!');  
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});