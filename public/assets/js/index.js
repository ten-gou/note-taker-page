let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes.html') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

//generates note id;
const noteID = () => {
  let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

//DONE?
const getNotes = () => 
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

//DONE
const saveNote = (note) => {
  fetch(`/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  })
}

const deleteNote = (noteValueSet) => {
  fetch(`/api/notes?title=${noteValueSet.title}&text=${noteValueSet.text}&noteID=${noteValueSet.noteID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

//DONE
const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.noteID) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

//DONE
const handleNoteSave = () => {

  const noteIDValue = noteID();
  
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
    noteID: noteIDValue,
  };

  console.log('Successful POST request:', newNote);
  saveNote(newNote)
  getAndRenderNotes().then(renderActiveNote())
};

// Delete the clicked note DONE
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;

  const noteBox = note.closest("li[class='list-group-item']");

  const noteValueSet = JSON.parse(noteBox.attributes[1].value);

  if (activeNote.title = noteValueSet.title) {
    activeNote = {};
  }

  noteBox.remove(note);

  deleteNote(noteValueSet);
  getAndRenderNotes().then(renderActiveNote());
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote(activeNote);
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
    show(newNoteBtn);
  } else {
    show(saveNoteBtn);
    hide(newNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (db) => {
  let jsonNote = await db.json();

  console.log(jsonNote)
  if (window.location.pathname === '/notes.html') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }
  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNote.length === 0) {
    noteListItems.push(createLi('No saved Notes', true));
  }

  jsonNote.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);
    li.setAttribute("noteID", note.noteID)

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes.html') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
  
};

// Gets notes from the db and renders them to the sidebar
//getNotes(data).then(renderNoteList(data));

if (window.location.pathname === '/notes.html') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

const getAndRenderNotes = () => getNotes().then(renderNoteList);

getAndRenderNotes();