// facebookUtils.js

// Hàm để lấy page token
function getPageToken() {
  FB.api("/me/accounts", function (response) {
    if (response && !response.error) {
      console.log("Pages:", response.data);
      // Xử lý page token ở đây
      savePageToken(response.data); // Giả sử mày muốn lưu các page token
    }
  });
}

// Lưu page token vào backend hoặc localStorage
function savePageToken(pages) {
  console.log("Saving page tokens:", pages);
  // Gửi lên backend hoặc lưu vào localStorage
  // Ví dụ:
  // localStorage.setItem('page_tokens', JSON.stringify(pages));
}
