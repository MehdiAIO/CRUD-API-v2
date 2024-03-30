const fs = require("fs");
const equipes = require("./equipes.json");
const express = require("express");

const app = express();

app.use(express.json());

// saving that from the memory to a file in JSON format
function saveData() {
  fs.writeFile("./equipes.json", JSON.stringify(equipes, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data saved successfully");
    }
  });
}

app.listen(4000, () => {
  console.log("connected");
});

// get
app.get("/equipes", async (req, res) => {
  res.status(200).json(equipes);
});

// add
app.post("/equipes", (req, res) => {
  equipes.push(req.body);
  res.status(200).json(equipes);
  saveData();
});

// get one user
app.get("/equipes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const equipe = equipes.find((equipe) => equipe.id === id);
    if (!equipe) {
      res.status(400).json({ message: "Equipe not found" });
    }
    res.status(200).json(equipe);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// update
app.put("/equipes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const equipe = equipes.find((equipe) => equipe.id === id);
    if (!equipe) {
      return res.status(404).json({ message: "Not found" });
    }
    equipe.name = req.body.name || equipe.name;
    equipe.age = req.body.age || equipe.age;
    equipe.gender = req.body.gender || equipe.gender;
    res.status(200).json(equipe);
    saveData();
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// delete
app.delete("/equipes/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const equipeIndex = equipes.findIndex((equipe) => equipe.id === id);
    if (equipeIndex === -1) {
      return res.status(400).json({ message: "equipe introuvable" });
    }
    equipes.splice(equipeIndex, 1);
    res.status(200).json(equipes);
    saveData();
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Route qui affiche tous les jouers d'une équipe
app.get("/equipes/joueurs/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const equipe = equipes.filter((equipe) => equipe.idEquipe === id);
    res.status(200).json(equipe);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Route qui affiche l'equipe d'un joueur en fonction de son id
app.get("/equipes/equipe/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const equipe = equipes.find((equipe) => equipe.id === id);
    if (!equipe) {
      return res.status(400).json({ message: "Equipe Introuvable" });
    }
    const equipeJoueur = equipe.equipeNom;
    res.status(200).json(equipeJoueur);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Route qui affiche un joueur en fonction de son nom
app.get("/equipes/joueur/:nom", (req, res) => {
  try {
    const nom = (req.params.nom).toLowerCase();
    const joueur = equipes.find((equipe) => equipe.nom === nom);
    if (!joueur) {
      return res.status(400).json({ message: "Le joueur est introuvable" });
    }
    res.status(200).json(joueur);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

