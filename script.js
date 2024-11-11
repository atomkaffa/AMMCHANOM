let cart = [];
let totalPrice = 0;

// Fetch menu from backend
fetch('http://localhost:3000/menu')
  .then(response => response.json())
  .then(data => {
    const productsList = document.getElementById('products-list');
    data.forEach(product => {
      const productItem = document.createElement('div');
      productItem.innerHTML = `
        <div style="text-align: center;"> <!-- จัดให้อยู่ตรงกลาง -->
    <img src="${product.image}" alt="${product.name}" style="width:150px; height:auto;">
    <h3>${product.name}</h3><br>
    <p>${product.price} บาท</p>
</div>

        <br>
        <label for="sweetness-${product.id}">Sweetness Level:</label>
        <select id="sweetness-${product.id}">
          <option value="0">0%</option>
          <option value="25">25%</option>
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="100" selected>100%</option>
          <option value="125">125%</option>
        </select>
        <br>
        <button onclick="addToCart(${product.id})">สั่งซื้อสินค้า</button>
      `;
      productsList.appendChild(productItem);
    });
  });

// Add selected product to cart with sweetness level
function addToCart(productId) {
  fetch('http://localhost:3000/menu')
    .then(response => response.json())
    .then(data => {
      const product = data.find(p => p.id === productId);
      const sweetnessLevel = document.getElementById(`sweetness-${productId}`).value;

      // Add sweetness level selected by the user
      const productWithSweetness = {
        ...product,
        sweetness: sweetnessLevel
      };

      // Check for "buy1get1" promotion
      if (product.promotion === "buy1get1") {
        // Add product twice to cart for "Buy 1 Get 1 Free" promotion
        cart.push(productWithSweetness, { ...productWithSweetness });
      } else {
        cart.push(productWithSweetness);
      }

      updateCart();
    });
}

// Update cart display
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');
  
  cartItems.innerHTML = '';
  totalPrice = 0;

  cart.forEach((item, index) => {
    const cartItem = document.createElement('li');
    cartItem.innerText = `${item.name} - ${item.price} บาท (Sweetness: ${item.sweetness}%)`;

    // Create a remove button
    const removeButton = document.createElement('button');
    removeButton.innerText = '×'; // Change text to a small cross symbol
    removeButton.onclick = () => removeFromCart(index); // Call removeFromCart with the item's index

    // Style the remove button
    removeButton.style.backgroundColor = 'red';
    removeButton.style.color = 'white';
    removeButton.style.border = 'none';
    removeButton.style.padding = '0px 5px';
    removeButton.style.cursor = 'pointer';
    removeButton.style.float = 'right';
    removeButton.style.fontSize = '12px';

    // Append the remove button to the cart item
    cartItem.appendChild(removeButton); 
    cartItems.appendChild(cartItem);

    // Add item price only once if it's part of a "buy1get1" promotion
    if (item.promotion === "buy1get1") {
      if (index % 2 === 0) { // Only add price for every second item (1 out of 2)
        totalPrice += item.price;
      }
    } else {
      totalPrice += item.price;
    }
  });

  totalPriceElement.innerText = totalPrice.toFixed(2);
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1); // Remove item from cart using its index
  updateCart(); // Update the cart display
}

// Handle checkout process
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const order = {
    items: cart,
    total: totalPrice
  };

  // Save order to localStorage to display in order.html
  localStorage.setItem('order', JSON.stringify(order));

  fetch('http://localhost:3000/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
    .then(response => response.json())
    .then(data => {
      // Redirect to order.html after successful order placement
      window.location.href = 'order.html';
    })
    .catch(error => {
      console.error('Error:', error);
      alert("There was an issue placing your order. Please try again.");
    });
}

// เข้าสู่ระบบ
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
      await client.connect();
      const database = client.db("users");
      const collection = database.collection("users");

      const user = await collection.findOne({ username: username });

      if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
              res.json({
                  success: true,
                  message: "เข้าสู่ระบบสำเร็จ",
                  username: username // ส่งคืนชื่อผู้ใช้เมื่อเข้าสู่ระบบสำเร็จ
              });
          } else {
              res.json({
                  success: false,
                  message: "เข้าสู่ระบบล้มเหลว",
              });
          }
      } else {
          res.json({
              success: false,
              message: "เข้าสู่ระบบล้มเหลว",
          });
      }
  } catch (error) {
      res.json({
          success: false,
          message: "เข้าสู่ระบบล้มเหลว",
      });
  } finally {
      await client.close();
  }
});


