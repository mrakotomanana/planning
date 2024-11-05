import express from 'express';
const routerAPP = express.Router();

import artistesRoutes from './artistsRoutes.mjs';
routerAPP.use(express.json());

/* afaka atao tsirairai
const songRoutes = require("./song");
const albumRoutes = require("./album");

router.use("/songs", songRoutes);
router.use("/albums", albumRoutes);
*/

routerAPP.use('/artists', artistesRoutes);

export default routerAPP;