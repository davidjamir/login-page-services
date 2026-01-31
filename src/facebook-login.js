// facebookLogin.js
window.fbAsyncInit = function () {
  FB.init({
    appId: process.env.FB_APP_ID, // Thay YOUR_APP_ID bằng app ID của mày từ Facebook Developer Console
    cookie: true,
    xfbml: true,
    version: "v24.0", // Sử dụng phiên bản API phù hợp
  });

  FB.getLoginStatus(function (response) {
    // Called after the JS SDK has been initialized.
    statusChangeCallback(response); // Returns the login status.
  });
};

// Kiểm tra trạng thái đăng nhập
function statusChangeCallback(response) {
  console.log("statusChangeCallback");
  console.log(response); // Log trạng thái đăng nhập của người dùng
  if (response.status === "connected") {
    testAPI(); // Nếu người dùng đăng nhập thành công, gọi hàm testAPI() để lấy thông tin người dùng
  } else {
    document.getElementById("status").innerHTML =
      "Please log into this webpage."; // Nếu chưa đăng nhập
  }
}

function checkLoginState() {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response); // Kiểm tra lại trạng thái đăng nhập
  });
}

// Lấy thông tin người dùng sau khi đăng nhập thành công
function testAPI() {
  console.log("Welcome! Fetching your information.... ");
  FB.api("/me", function (response) {
    console.log("Successful login for: " + response.name);
    document.getElementById("status").innerHTML =
      "Thanks for logging in, " + response.name + "!";
  });
}
