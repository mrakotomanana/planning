import express from 'express';
const router = express.Router();

// Tous les artistes
router.get("/", (req, res) => {
  res.end('mandeha');
});

// Détails d'un artiste
router.get("/:id", (req, res) => {

});

// Créer un artiste
router.post("/", (req, res) => {
  // ...
});

// Modifier un artiste
router.put("/:id", (req, res) => {
  // ...
});

// Supprimer un artiste
router.delete("/:id", (req, res) => {
  // ...
});

export default router;
