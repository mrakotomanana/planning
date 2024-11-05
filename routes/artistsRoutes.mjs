import express from 'express';
const router = express.Router();

import {  list, read,  create,  update,  remove } from '../controllers/artistController.mjs';

// Tous les artistes
router.get("/", list);

// Détails d'un artiste
router.get("/:id", read);

// Créer un artiste
router.post("/", create);

// Modifier un artiste
router.put("/:id", update);

// Supprimer un artiste
router.delete("/:id", remove);

export default router;
