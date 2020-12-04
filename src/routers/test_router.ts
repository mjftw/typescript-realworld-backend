import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => res.send({ msg: "Hello World!" }));

export default router;
