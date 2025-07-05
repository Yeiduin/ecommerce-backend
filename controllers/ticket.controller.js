// ecommerce-backend/controllers/ticket.controller.js
import Ticket from "../models/Ticket.model.js";
import Order from "../models/Order.model.js";

// @desc    Crear un nuevo ticket de soporte
// @route   POST /api/tickets
export const createTicket = async (req, res) => {
  const { subject, message, orderId } = req.body;

  if (!subject || !message) {
    return res
      .status(400)
      .json({ message: "El asunto y el mensaje son obligatorios." });
  }

  try {
    const ticket = new Ticket({
      user: req.user._id,
      order: orderId || null,
      subject,
      messages: [
        {
          sender: "user",
          text: message,
          name: req.user.name,
        },
      ],
    });

    const createdTicket = await ticket.save();
    res.status(201).json(createdTicket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el ticket", error: error.message });
  }
};

// @desc    Obtener los tickets del usuario logueado
// @route   GET /api/tickets/mytickets
export const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tickets" });
  }
};

// @desc    Obtener todos los tickets (solo admin)
// @route   GET /api/tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tickets" });
  }
};

// @desc    Obtener un ticket por su ID
// @route   GET /api/tickets/:id
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("user", "name email")
      .populate("order", "orderNumber");
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }
    // Asegurarse de que solo el admin o el dueño del ticket pueda verlo
    if (
      req.user.role !== "admin" &&
      ticket.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el ticket" });
  }
};

// @desc    Añadir una respuesta a un ticket
// @route   POST /api/tickets/:id/reply
export const replyToTicket = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    const reply = {
      sender: req.user.role === "admin" ? "admin" : "user",
      text: message,
      name: req.user.name,
    };

    ticket.messages.push(reply);

    // Si un admin responde, el ticket pasa a 'En proceso'
    if (req.user.role === "admin" && ticket.status === "Abierto") {
      ticket.status = "En proceso";
    }

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error al responder al ticket" });
  }
};

// @desc    Actualizar el estado de un ticket (solo admin)
// @route   PUT /api/tickets/:id/status
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    ticket.status = status;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el estado del ticket" });
  }
};
