import Order from "../models/Order.js";

export const weeklyDeliveryStats = async (req, res) => {
  const today = new Date();
  const sevenAgo = new Date(); sevenAgo.setDate(today.getDate() - 6);

  const pipeline = [
    { $match: { deliveredAt: { $gte: sevenAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$deliveredAt" } },
        count: { $sum: 1 },
        revenue: { $sum: "$amountSettled" },
        meters: { $sum: { $sum: "$items.meters" } } // simple attempt; alternative: unwind then sum
      }
    },
    { $sort: { _id: 1 } }
  ];

  const rows = await Order.aggregate(pipeline);

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0,10);
    const found = rows.find(r => r._id === key);
    days.push({
      date: key,
      count: found ? found.count : 0,
      revenue: found ? found.revenue : 0
    });
  }
  res.json(days);
};
