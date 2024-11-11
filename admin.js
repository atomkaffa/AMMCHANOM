function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const order = {
        username: localStorage.getItem('username') || 'ไม่ระบุ',
        items: cart, // บันทึกสินค้าที่มีอยู่ในตะกร้า
        totalPrice: totalPrice, // บันทึกราคา
        status: "รอการดำเนินการ" // กำหนดสถานะเริ่มต้น
    };

    // บันทึกคำสั่งซื้อใน localStorage
    localStorage.setItem('order', JSON.stringify(order));

    // ส่งข้อมูลคำสั่งซื้อไปยังเซิร์ฟเวอร์ (ถ้าจำเป็น)
    fetch('http://localhost:3000/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        // ไปยังหน้า order.html หรือ admin.html
        window.location.href = 'order.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert("There was an issue placing your order. Please try again.");
    });
}
