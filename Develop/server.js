
const express = require('express');
const input = require('./db/db.json');
const path = require('path');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const { text } = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// filter by query code
function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;
  if (query.title) {
    filteredResults = filteredResults.filter(notes => notes.title === query.title);
  }
  if (query.text) {
    filteredResults = filteredResults.filter(notes => notes.text === query.text);
  }
  if (query.noteID) {
    filteredResults = filteredResults.filter(notes => notes.noteID === query.noteID);
  }
  return filteredResults;
}

// GET request get notes
app.get('/api/notes', (req, res) => {

  res.clearCookie(this.cookie, { path: '/api/notes' });
  // Send a message to the client

  let results = input;
  if (req.query) {
    results = filterByQuery(req.query, results);
    res.json(results);
  }
  else {
    res.json(results);
  }  

  // Log our request to the terminal
  console.info(`${req.method} request received to get reviews`);
  
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

app.delete('/api/notes', (req, res) => {
  console.log("DELETE Request Called for /api endpoint")
   res.send("DELETE Request Called")
   console.log(req.query.title)
   console.log(typeof req.query)

   fs.readFile(`./db/db.json`, function read(err, data) {
    if (err) {
        throw err;
    }

    var noteInfo =  `
    ,{"title":"${req.query.title}","text":"${req.query.text}","noteID":"${req.query.noteID}"}`;
    console.log(noteInfo.length);

    var position2 = data.indexOf(`,{"title":"${req.query.title}","text":"${req.query.text}","noteID":"${req.query.noteID}"}`);
    console.log(position2);


    var file_content = data.toString();

    console.log(file_content.length);
    var file = fs.openSync('./db/db.json','w+');

    var bufferText = file_content.replace(noteInfo, '');
    console.log(bufferText)
    console.log(bufferText.length)

    fs.writeSync(file, bufferText, err => {
      if (err) throw new Error(err);
   });

    fs.close(file);
    
    
    //data.replace(`,{"title":"${req.query.title}","text":"${req.query.text}","noteID":"${req.query.noteID}"}`, '');
});
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});