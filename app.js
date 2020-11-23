const express = require("express");
const path = require("path");
const fs = require("fs");


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const port = 3000;
var maxId = 0;

app.get("/api/notes", (req, res) => {
    var notes = fs.readFileSync("db/db.json", "utf8");
    console.log(notes)
    if (!notes) {
        return res.json([])
    }
    else {
        var jsonNotes = JSON.parse(notes);
        console.log(jsonNotes);
        return res.json(jsonNotes);
    }
});

app.post("/api/notes", (req, res) => {
    console.log(req.body)
    var note = req.body;
    var noteId = maxId;
    maxId++;
    console.log(note)
    var newNote = {
        title: note.title,
        text: note.text,
        id: noteId
    };

    var notes = fs.readFileSync("db/db.json", "utf8");
    var jsonNotes = JSON.parse(notes);
    jsonNotes.push(newNote)

    var stringNotes = JSON.stringify(jsonNotes);
    fs.writeFileSync("db/db.json", stringNotes);
    return res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
    var targetId = req.params.id

    var notes = fs.readFileSync("db/db.json", "utf8");
    var jsonNotes = JSON.parse(notes);

    updatedNotes = jsonNotes.filter(x => !x.id == targetId);

    var stringNotes = JSON.stringify(updatedNotes);
    fs.writeFileSync("db/db.json", stringNotes);
    
    return res
});

app.get("/notes", (req, res) => {
    var options = {
        root: path.join(__dirname, "public")
    }
    res.sendFile("notes.html", options)
});

app.get("*", (req, res) => {
    var options = {
        root: path.join(__dirname, "public")
    }
    res.sendFile("index.html", options)
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});