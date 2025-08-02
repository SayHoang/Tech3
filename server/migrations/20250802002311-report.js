import { ObjectId } from "mongodb";

export default {
  async up(db, client) {
    // User ID đã có trong hệ thống
    const userId = new ObjectId("688c761793184092ff501323");

    // Lấy một số product IDs để tạo orders
    const products = await db
      .collection("products")
      .find({})
      .limit(10)
      .toArray();
    const productIds = products.map((p) => p._id);

    // Tạo dữ liệu orders cho 3 tháng gần đây
    const orders = [];
    const now = new Date();

    // Generate orders cho 90 ngày gần đây
    for (let i = 0; i < 90; i++) {
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - i);

      // Random số lượng orders mỗi ngày (0-5 orders)
      const ordersPerDay = Math.floor(Math.random() * 6);

      for (let j = 0; j < ordersPerDay; j++) {
        const orderId = new ObjectId();

        // Random 1-3 products per order
        const itemsCount = Math.floor(Math.random() * 3) + 1;
        let totalAmount = 0;
        const orderItems = [];

        for (let k = 0; k < itemsCount; k++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          const price = product.price;
          const itemTotal = price * quantity;
          totalAmount += itemTotal;

          orderItems.push({
            productId: product._id,
            productName: product.name,
            quantity: quantity,
            price: price,
            total: itemTotal,
          });
        }

        orders.push({
          _id: orderId,
          userId: userId,
          items: orderItems,
          totalAmount: totalAmount,
          status: "completed", // completed, pending, cancelled
          createdAt: orderDate,
          updatedAt: orderDate,
        });
      }
    }

    // Insert orders vào database
    if (orders.length > 0) {
      await db.collection("orders").insertMany(orders);
      console.log(`✅ Inserted ${orders.length} sample orders for analytics`);
    }

    // Tạo thêm một số orders với status khác nhau
    const additionalOrders = [
      {
        _id: new ObjectId(),
        userId: userId,
        items: [
          {
            productId: productIds[0],
            productName: products[0].name,
            quantity: 1,
            price: products[0].price,
            total: products[0].price,
          },
        ],
        totalAmount: products[0].price,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        userId: userId,
        items: [
          {
            productId: productIds[1],
            productName: products[1].name,
            quantity: 2,
            price: products[1].price,
            total: products[1].price * 2,
          },
        ],
        totalAmount: products[1].price * 2,
        status: "cancelled",
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
        updatedAt: new Date(),
      },
    ];

    await db.collection("orders").insertMany(additionalOrders);
    console.log(
      `✅ Inserted ${additionalOrders.length} additional orders with different statuses`
    );
  },

  async down(db, client) {
    // Remove all orders created by this migration
    const userId = new ObjectId("688c761793184092ff501323");
    const result = await db.collection("orders").deleteMany({ userId: userId });
    console.log(`🗑️ Removed ${result.deletedCount} orders`);
  },
};
