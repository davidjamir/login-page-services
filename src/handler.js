const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
const FB_APP_VERSION = "v25.0";

console.log(FB_APP_ID);

window.fbAsyncInit = function () {
  FB.init({
    appId: FB_APP_ID, // Thay thế bằng App ID từ Facebook Developer Console
    cookie: true, // Enable cookies for session tracking
    xfbml: true, // Parse social plugins
    version: FB_APP_VERSION, // Specify the Graph API version
  });

  // Check login status on page load
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response); // Handle login status
  });
};

// Callback function to handle login status
function statusChangeCallback(response) {
  console.log("statusChangeCallback");

  if (response.status === "connected") {
    // User is logged in
    document.getElementById("status").innerHTML = "Logged in successfully!";
    testAPI(response.authResponse.accessToken); // Fetch user information after successful login
  } else {
    // User is not logged in
    document.getElementById("status").innerHTML =
      "Please log into this webpage.";
  }
}

// Called when the login button is clicked, checks the login status
function checkLoginState() {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response); // Pass the response to the callback function
  });
}

// Function to fetch user data from the Facebook API
function testAPI(accessToken) {
  console.log("Fetching user information....");

  // Fetch user data
  FB.api("/me", { access_token: accessToken }, function (response) {
    console.log("Successful login for: " + response.name);
    document.getElementById("status").innerHTML =
      "Thanks for logging in, " + response.name + "!";
    // Here you can call additional functions to work with page tokens or other Facebook data
    extendUserToken(accessToken, response.name); // Get page tokens for further actions
  });
}

function extendUserToken(shortTermToken, username) {
  FB.api(
    `/oauth/access_token`,
    {
      grant_type: "fb_exchange_token",
      client_id: FB_APP_ID,
      client_secret: FB_APP_SECRET,
      fb_exchange_token: shortTermToken,
    },
    function (response) {
      if (response && !response.error) {
        const longTermUserToken = response.access_token; // User token dài hạn
        document.getElementById("userTokenDisplay").outerHTML =
          `<div class="user-token-wrapper"><div>${shortenToken(longTermUserToken)}</div>
                <button class="copy-mini copy-btn" type="button" data-copy="${longTermUserToken}" title="Copy">
                    ${copySvg()}
                </button></div>
                `;
        // Hiện nút lưu page token khi có token
        document.getElementById("savePageTokenButton").style.display =
          "inline-block";
        // Sau khi có token dài hạn của người dùng, có thể lấy page token dài hạn
        getPageTokens(longTermUserToken, username);
      } else {
        console.error(
          "Error exchanging for long-term user token:",
          response.error,
        );
      }
    },
  );
}

function shortenToken(token) {
  // Kiểm tra nếu token có đủ dài (tối thiểu 6 ký tự)
  if (token && token.length > 6) {
    const firstPart = token.slice(0, 5); // Lấy 3 ký tự đầu
    const lastPart = token.slice(-5); // Lấy 3 ký tự cuối
    return `${firstPart}...${lastPart}`; // Kết hợp và thêm "..."
  } else {
    // Nếu token quá ngắn, trả về nguyên vẹn token
    return token;
  }
}

function copySvg() {
  // simple "copy" icon
  return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V7zm2 0v10h8V7h-8z"></path>
            <path d="M6 17a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2h10a1 1 0 1 1 0 2H7v10a1 1 0 0 1-1 1z"></path>
            </svg>
        `;
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  if (type === "error") {
    toast.classList.add("error");
  }

  toast.innerText = message;

  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300); // Wait for animation before removing
  }, 3000);
}

// Hàm lưu page token vào API của bạn
function savePageToken(payload) {
  const apiUrl = "/api/saved-page-tokens"; // Relative URL

  // Gửi yêu cầu POST đến API backend (relative URL)
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      // Xử lý phản hồi từ API
      if (data.success) {
        showToast("Page token saved successfully!", "success");
      } else {
        showToast("Failed to save page token.", "error");
      }
    })
    .catch((error) => {
      console.error("Error saving page token:", error);
      showToast("An error occurred while saving the page token.", "error");
    });
}

// Function to get page tokens (if user manages any pages)
function getPageTokens(accessToken, username) {
  console.log("Fetching pages the user manages...");

  // Fetch the pages the user manages
  FB.api("/me/accounts", { access_token: accessToken }, function (response) {
    if (response && !response.error) {
      let pageListHtml = "";

      if (response.data && response.data.length > 0) {
        // If there are pages
        response.data.forEach((page, index) => {
          console.log("Page ID: " + page);

          pageListHtml += `
                    <tr class="row-hover">
                        <td class="nowrap">${index + 1}</td>
                        <td>${page.id}</td>
                        <td>${page.name}</td>
                        <td>
                            <div class="inline-copy">
                                <div class="cell-text">${shortenToken(page.access_token)}</div>
                                <button class="copy-mini copy-btn" type="button" data-copy="${page.access_token}" title="Copy">
                                    ${copySvg()}
                                </button>
                            </div>
                        </td>
                    </tr>
                    `;
        });

        const payload = response.data.map((item) => ({
          source: username,
          ...item,
        }));

        document.getElementById("savePageTokenButton").onclick = function () {
          savePageToken(payload); // Gọi hàm để lưu page token
        };
      } else {
        // If no pages found
        pageListHtml = `<div class="muted center">No pages found.</div>`;
      }

      // Chèn danh sách vào div với id "page-list"
      document.getElementById("page-list").innerHTML = pageListHtml;
    } else {
      console.error("Error fetching pages:", response.error);
    }
  });
}
