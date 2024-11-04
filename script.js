// ดึงข้อมูลตะกร้าจาก localStorage หรือสร้างอาร์เรย์ใหม่หากไม่มีข้อมูลในตะกร้า
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ฟังก์ชันแสดงโมดัลพร้อมรายละเอียดสินค้า
function showModal(productId) {
    fetch('product.php')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                document.getElementById('modal-title').innerText = product.name;
                document.getElementById('modal-description').innerText = product.description;
                document.getElementById('modal-price').innerText = 'ราคา: ' + product.price + ' บาท';
                document.getElementById('productModal').style.display = "block";

                // ปรับปุ่ม "เพิ่มลงตะกร้า" ในโมดัลเพื่อให้ใช้ราคาที่ถูกต้อง
                const addToCartButton = document.querySelector('#productModal button:nth-child(3)');
                addToCartButton.onclick = function() {
                    addToCart(product.name, product.price);
                };
            } else {
                alert("ไม่พบสินค้าที่คุณเลือก");
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}


// ฟังก์ชันเพิ่มสินค้าในตะกร้า
function addToCart(productName, productPrice) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1; // เพิ่มจำนวนสินค้า
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart)); // เก็บข้อมูลลงใน localStorage
    alert(productName + ' ถูกเพิ่มลงในตะกร้า!');
}



// ฟังก์ชันลบสินค้าในตะกร้า
function removeFromCart(productName) {
    // กรองสินค้าที่ไม่ตรงกับชื่อที่ต้องการลบออก
    cart = cart.filter(item => item.name !== productName);

    // อัปเดตข้อมูลใน localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // อัปเดตการแสดงตะกร้า
    displayCart();
}

// ฟังก์ชันแสดงรายการสินค้าในตะกร้า
function displayCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // ล้างรายการก่อน

    let total = 0; // ตัวแปรสำหรับคำนวณรวมราคา

    cart.forEach(item => {
        const itemName = item.name || 'ไม่ระบุชื่อสินค้า';
        const itemPrice = item.price || 0;
        const itemQuantity = item.quantity || 0;

        const li = document.createElement('li');
        li.innerHTML = `
            ${itemName} (จำนวน: ${itemQuantity}) - ราคา: ${itemPrice} บาท
            <button onclick="decreaseQuantity('${item.name}')">-</button>
            <button onclick="increaseQuantity('${item.name}')">+</button>
            <button onclick="removeFromCart('${item.name}')">ลบ</button>
        `;
        cartList.appendChild(li);

        total += itemPrice * itemQuantity;
    });

    document.getElementById('total-price').textContent = 'รวม: ' + total + ' บาท';
}

function increaseQuantity(productName) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity += 1; // เพิ่มจำนวนสินค้า
    }
    localStorage.setItem('cart', JSON.stringify(cart)); // อัปเดตข้อมูลใน localStorage
    displayCart(); // อัปเดตการแสดงผล
}

// ฟังก์ชันลดจำนวนสินค้า
function decreaseQuantity(productName) {
    const product = cart.find(item => item.name === productName);
    if (product && product.quantity > 1) {
        product.quantity -= 1; 
    } else if (product && product.quantity === 1) {
      
        cart = cart.filter(item => item.name !== productName);
    }
    localStorage.setItem('cart', JSON.stringify(cart)); 
    displayCart(); 
}


function closeModal() {
    document.getElementById('productModal').style.display = "none";
}


window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
}


if (window.location.pathname.includes('shopping.html')) {
    document.addEventListener("DOMContentLoaded", displayCart);
}


document.addEventListener("DOMContentLoaded", function() {
    const buyButton = document.getElementById("buy-button");
    const totalPriceElement = document.getElementById("total-price");
    
    buyButton.addEventListener("click", function() {
        const totalPriceText = totalPriceElement.textContent;
        const totalPrice = parseFloat(totalPriceText.replace("รวม: ", "").replace(" บาท", ""));

        if (totalPrice > 0) {
            // แสดงข้อความยืนยันการชำระเงิน
            alert("คุณต้องการชำระเงินจำนวน " + totalPrice + " บาท");
        } else {
            alert("กรุณาเพิ่มสินค้าในตะกร้าก่อนทำการชำระเงิน");
        }
    });
});



localStorage.removeItem('cart');

document.addEventListener("DOMContentLoaded", function() {
    fetch('product.php')
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            
        })
        .catch(error => console.error('Error fetching products:', error));
});


//เชื่อมตางราง
document.addEventListener("DOMContentLoaded", function() {
    fetchProducts();
});

function fetchProducts() {
    fetch('/Products')
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.querySelector('.grid-container');
            productsContainer.innerHTML = '';

            data.forEach(product => {
                const article = document.createElement('article');
                article.innerHTML = `
                    <h3><a href="#" onclick="showModal('${product.id}')">${product.Name}</a></h3>
                    <img src="img/${product.img}" alt="${product.Name}" class="product-image">
                    <p>Year: ${product.Year}</p>
                    <p>ราคา: ${product.Price} บาท</p>
                    <button onclick="addToCart('${product.Name}', ${product.Price})">เพิ่มลงตะกร้า</button>
                `;
                productsContainer.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}



