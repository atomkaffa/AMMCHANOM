// summary.js

// Function to save an order
function saveOrder() {
  const paymentMethod = document.getElementById('payment') ? document.getElementById('payment').value : 'ไม่ระบุ';
  const username = localStorage.getItem('username') || 'ไม่ระบุ'; // ดึงชื่อผู้ใช้จาก localStorage หรือใช้ค่าเริ่มต้น
  const items = JSON.parse(localStorage.getItem('orderItems')) || []; // ดึงรายการสินค้า
  const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0; // ดึงราคาทั้งหมดหรือใช้ค่าเริ่มต้น

  // สร้างออบเจ็กต์คำสั่งซื้อ
  const order = {
    username: username,
    paymentMethod: paymentMethod,
    items: items,
    totalPrice: totalPrice,
    status: "รอการดำเนินการ" // กำหนดสถานะเริ่มต้นเป็น Pending
  };

  // บันทึกข้อมูล order ลงใน localStorage
  localStorage.setItem('order', JSON.stringify(order));

  // ส่งคำสั่งซื้อไปยังเซิร์ฟเวอร์
  fetch('http://localhost:3000/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Order saved:', data);
      // หลังจากบันทึกข้อมูลสำเร็จแล้ว ให้ไปยังหน้า order.html
      window.location.href = 'order.html';
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to load reviews from localStorage and display them
function loadReviews() {
  const reviewContainer = document.getElementById("review-container");
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  
  reviewContainer.innerHTML = "";

  reviews.forEach((review, index) => {
    const reviewCard = document.createElement("div");
    reviewCard.classList.add("review-card");

    reviewCard.innerHTML = `
      <div class="profile-pic">
        <img src="${review.profilePicURL}" alt="Profile Picture">
      </div>
      <div class="review-content">
        <h3>${review.name}</h3>
        <div class="stars">${review.rating}</div>
        <p>${review.comment}</p>
        <button onclick="deleteReview(${index})">Delete</button>
      </div>
    `;

    reviewContainer.appendChild(reviewCard);
  });
}

// Function to add a new review
function addReview() {
  const name = document.getElementById("name").value;
  const profilePicInput = document.getElementById("profile-pic");
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  if (!name || !profilePicInput.files.length || !comment) {
    alert("Please fill out all fields and select an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const profilePicURL = e.target.result;
    const newReview = { name, profilePicURL, rating, comment };

    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push(newReview);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    loadReviews();

    document.getElementById("name").value = "";
    document.getElementById("profile-pic").value = "";
    document.getElementById("rating").value = "★★★★★";
    document.getElementById("comment").value = "";
  };

  reader.readAsDataURL(profilePicInput.files[0]);
}

// Function to delete a review
function deleteReview(index) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.splice(index, 1);
  localStorage.setItem("reviews", JSON.stringify(reviews));
  loadReviews();
}
