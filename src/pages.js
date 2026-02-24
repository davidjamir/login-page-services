const { getDb } = require("../database/db"); // MongoDB client

async function savePages(payload) {
  try {
    // Kết nối đến cơ sở dữ liệu MongoDB
    const db = await getDb();
    const col = db.collection("pages");

    // Tạo một mảng các thao tác update (upsert)
    const operations = payload.map((item) => {
      const filter = { pageId: item.pageId }; // Điều kiện lọc theo pageId
      const update = {
        $set: {
          ...item, // Lưu nguyên gói item vào database
          updatedAt: new Date(), // Cập nhật thời gian thay đổi
        },
        $setOnInsert: {
          createdAt: new Date(), // Thêm createdAt khi insert lần đầu
        },
      };

      return col.findOneAndUpdate(filter, update, {
        upsert: true, // Chèn mới nếu không có, hoặc update nếu có
        returnDocument: "after", // Trả về tài liệu sau khi cập nhật
      });
    });

    // Chờ tất cả các update (hoặc insert) hoàn thành
    await Promise.all(operations);
    return {
      success: true,
      message: "Pages successfully saved/updated.",
    };
  } catch (error) {
    // In lỗi ra console để kiểm tra
    console.error("Error while saving pages:", error);

    // Trả về lỗi cho người dùng
    return {
      success: false,
      message: "An error occurred while saving pages. Please try again later.",
      error: error.message,
    };
  }
}

module.exports = { savePages };
