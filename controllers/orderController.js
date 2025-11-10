import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, items, estimatedDelivery, notes } = req.body;

    // compute total
    let total = 0;
    for (const it of items) {
      const p = await Product.findById(it.product);
      const price = p ? p.pricePerMeter : it.pricePerMeter || 0;
      total += price * it.meters;
      it.pricePerMeter = price;
    }

    const order = new Order({
      customerName,
      customerEmail,
      items,
      totalAmount: total,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      notes
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  const orders = await Order.find().sort({ placedAt: -1 }).populate("items.product");
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const o = await Order.findById(req.params.id).populate("items.product");
  if (!o) return res.status(404).json({ message: "Order not found" });
  res.json(o);
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, amountSettled, deliveredAt } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Not found" });

    if (status) order.status = status;
    if (amountSettled !== undefined) order.amountSettled = amountSettled;
    if (deliveredAt) order.deliveredAt = new Date(deliveredAt);

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
