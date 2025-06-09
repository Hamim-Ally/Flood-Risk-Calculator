import { FloodRisk, FRILevel, LogFRI } from "./FRI.js";

let x = new FloodRisk(0.9, 0.9, 0.8, 1, 1);
LogFRI(FRILevel(x.calculateRisk()));