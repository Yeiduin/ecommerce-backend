// ecommerce-backend/routes/ticket.routes.js
import express from "express";
import { protect, admin } from "../middleware/auth.middleware.js";
import {
  createTicket,
  getUserTickets,
  getAllTickets,
  getTicketById,
  replyToTicket,
  updateTicketStatus,
} from "../controllers/ticket.controller.js";

const router = express.Router();

// Rutas de Usuario
router.route("/").post(protect, createTicket);
router.route("/mytickets").get(protect, getUserTickets);
router.route("/:id").get(protect, getTicketById);
router.route("/:id/reply").post(protect, replyToTicket);

// Rutas de Admin
router.route("/").get(protect, admin, getAllTickets);
router.route("/:id/status").put(protect, admin, updateTicketStatus);

export default router;
