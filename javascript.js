//This is the javascript that cars.html uses:

const allowedIP = ["103.141.203.2", "136.158.83.194"]; // company wifi : KMC Solutions IP address & Home wifi

// localStorage.setItem('allowedIP', JSON.stringify(allowedIP));

function showCategory(id){
  document.getElementById('categoriesView').style.display = 'none';
  var pages = document.getElementsByClassName('category-page');
  for(var i = 0; i < pages.length; i++){ pages[i].style.display = 'none'; }
  document.getElementById('page-' + id).style.display = 'block';
}
function showCategories(){
  var pages = document.getElementsByClassName('category-page');
  for(var i = 0; i < pages.length; i++){ pages[i].style.display = 'none'; }
  document.getElementById('categoriesView').style.display = 'grid';
}
function setActiveNav(link){
  var links = document.getElementsByClassName('nav-link');
  for(var i = 0; i < links.length; i++){ links[i].classList.remove('active'); }
  link.classList.add('active');
}

// --- CART LOGIC ---

document.addEventListener('DOMContentLoaded', function() {
    let cartList = JSON.parse(localStorage.getItem('cartList')) || [];
    if (cartList.length > 0) {
        showPopup(cartList.length);
    }
});

function addToCart(buttonElement) {

    const hasVisitedThisTab = sessionStorage.getItem('tabSessionStarted');

    const carName = buttonElement.getAttribute('data-name');
    const carPrice = buttonElement.getAttribute('data-price');
    const carImage = buttonElement.getAttribute('data-image');

    const selectedCar = {
        // Create a unique ID so we can remove specific items easily
        id: Date.now().toString(), 
        name: carName,
        price: parseInt(carPrice),
        image: carImage,
        brand: carName.split(' ')[0] // Extracts "Toyota", "Honda", etc. for the subtitle
    };

    if (!hasVisitedThisTab) { //detects if user visited the site for the first time and clears out any cart items
        
        const cartList = [];
        localStorage.setItem('cartList', JSON.stringify(cartList));
        sessionStorage.setItem('tabSessionStarted', 'true');
    }

    let cartList = JSON.parse(localStorage.getItem('cartList')) || [];
    cartList.push(selectedCar);
    localStorage.setItem('cartList', JSON.stringify(cartList));

    // Open the modal and update the view
    openCartModal();
}

function openCartModal() {
    const overlay = document.getElementById('cart-overlay');
    overlay.classList.add('show');
    renderCartModal();
}

function closeCart(event, forceClose = false) {
    if (forceClose || event.target.id === 'cart-overlay') {
        document.getElementById('cart-overlay').classList.remove('show');
    }
}

function renderCartModal() {
    const container = document.getElementById('modal-cart-items');
    let cartList = JSON.parse(localStorage.getItem('cartList')) || [];
    
    container.innerHTML = '';
    let total = 0;
 
    if (cartList.length === 0) {
        container.innerHTML = '<p style="color:#000; text-align:center; margin-top:20px;">Your cart is empty.</p>';
        document.getElementById('modal-total-price').innerText = '₱0.00';
        return;
    }

    // Build the item cards
    cartList.forEach((car, index) => {
        total += car.price;
        
        const cardHTML = `
            <div class="cart-item-card">
                <img src="${car.image}" alt="${car.name}">
                <div class="item-details">
                    <h4>${car.name}</h4>
                    <p>${car.brand}</p>
                    <strong>₱${car.price.toLocaleString()}/day</strong>
                </div>
                <button class="remove-btn" onclick="removeItem('${car.id}')">Remove</button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    document.getElementById('modal-total-price').innerText = `₱${total.toLocaleString()}.00`;
}

function removeItem(carId) {
    let cartList = JSON.parse(localStorage.getItem('cartList')) || [];
    // Keep everything EXCEPT the car with the matching ID
    cartList = cartList.filter(car => car.id !== carId);
    
    localStorage.setItem('cartList', JSON.stringify(cartList));
    renderCartModal(); // Refresh the modal instantly
}

function clearCart() {
    if(confirm("Are you sure you want to empty your cart?")) {
        localStorage.removeItem('cartList');
        renderCartModal();
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // 1. Check if the user just completed an order
    if (localStorage.getItem('orderStatus') === 'completed') {
        const successPopup = document.getElementById('order-success-popup');
        successPopup.style.display = 'flex';
        
        // Remove the flag so it doesn't pop up again if they refresh the page
        localStorage.removeItem('orderStatus');

        let secondsLeft = 10;
        const countdownElement = document.getElementById('success-countdown');
        
        const timerInterval = setInterval(function() {
            secondsLeft--;
            countdownElement.innerText = secondsLeft;
            
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                successPopup.style.display = 'none'; // Hide popup after 10s
            }
        }, 1000);
    }
});


//checkout.html :
        document.getElementById('checkout-form').addEventListener('submit', async function(e) {
            e.preventDefault(); 

            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;

            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const zip = document.getElementById('zip').value;
            const country = document.getElementById('country').value;

            const cardName = document.getElementById('card-name').value;
            const cardNumber = document.getElementById('card-number').value;
            const expiry = document.getElementById('expiry').value;
            const cvc = document.getElementById('cvc').value;
            
            let cartList = JSON.parse(localStorage.getItem('cartList')) || [];
            let orderItemsText = "";
            let subtotal = 0;

            cartList.forEach((car) => {
                subtotal += car.price;
                orderItemsText += `- ${car.name} (${car.brand}): ₱${car.price.toLocaleString()}/day\n`;
            });
            
            const tax = subtotal * 0.12;
            const grandTotal = subtotal + tax;

            const maskedCard = cardNumber.length >= 4 
                ? "**** **** **** " + cardNumber.slice(-4) 
                : "****";

            const receiptMessage = `Thank you so much for making a purchase on our website! Here is your receipt:

            CUSTOMER DETAILS:
            Name: ${firstName} ${lastName}
            Email: ${email}

            SHIPPING ADDRESS:
            ${address}
            ${city}, ${state} ${zip}
            ${country}

            ORDER SUMMARY:
            ${orderItemsText}
            Subtotal: ₱${subtotal.toLocaleString()}.00
            Tax (12%): ₱${tax.toLocaleString()}.00
            Grand Total: ₱${grandTotal.toLocaleString()}.00

            PAYMENT INFO:
            Card Name: ${cardName}
            Card Number: ${maskedCard}`;

            console.log(receiptMessage);

            emailjs.init("h1pJrdHJ7bsjOBTjE");
            await emailjs.send("service_kqi61hb", "template_ooiivmh", {
                send_to: email,
                to_name: firstName,
                message: receiptMessage ,
                reply_to: "no-reply@mywebsite.com"
            }).then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                    // Empty the cart
                localStorage.removeItem('cartList');
                
                // Set a flag so cars.html knows an order was just placed
                localStorage.setItem('orderStatus', 'completed');
                
                // Redirect to cars page instantly
                window.location.href = "cars.html";
            }, function(error) {
                console.log('FAILED...', error);
                    // Empty the cart
                localStorage.removeItem('cartList');
                
                // Set a flag so cars.html knows an order was just placed
                localStorage.setItem('orderStatus', 'completed');
                
                // Redirect to cars page instantly
                window.location.href = "cars.html";
            });

            
        });

        // 2. Load Cart Data
        document.addEventListener('DOMContentLoaded', function() {
            renderCheckoutCart();
        });

        function renderCheckoutCart() {
            const container = document.getElementById('checkout-cart-items');
            let cartList = JSON.parse(localStorage.getItem('cartList')) || [];

            if (cartList.length === 0) {
                container.innerHTML = '<p style="color:#a7a5a5; text-align:center; margin: 20px 0;">Your cart is empty.</p>';
                document.getElementById('checkout-subtotal').innerText = '₱0.00';
                document.getElementById('checkout-tax').innerText = '₱0.00';
                document.getElementById('checkout-total').innerText = '₱0.00';
                return;
            }

            container.innerHTML = '';
            let subtotal = 0;

            cartList.forEach(function(car) {
                subtotal += car.price;

                const itemHTML = `
                    <div style="display:flex; align-items:center; margin-bottom:15px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                        <img src="${car.image}" alt="${car.name}" style="width:80px; height:60px; object-fit:cover; border-radius:4px; border: 1px solid #d3a44b;">
                        <div style="margin-left:15px; flex-grow:1; color:#ffffff;">
                            <h4 style="margin:0 0 5px 0; color:#d3a44b;">${car.name}</h4>
                            <p style="margin:0; font-size:12px; color:#a7addc;">Qty: 1 Day</p>
                        </div>
                        <span style="font-weight:bold; color:#ffffff;">₱${car.price.toLocaleString()}.00</span>
                    </div>
                `;
                container.innerHTML += itemHTML;
            });

            const tax = subtotal * 0.12;
            const grandTotal = subtotal + tax;

            document.getElementById('checkout-subtotal').innerText = `₱${subtotal.toLocaleString()}.00`;
            document.getElementById('checkout-tax').innerText = `₱${tax.toLocaleString()}.00`;
            document.getElementById('checkout-total').innerText = `₱${grandTotal.toLocaleString()}.00`;
        }



//contact.html:
    document.getElementById('contact-form').addEventListener('submit', async function(e) {
                e.preventDefault(); 

                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                const Message = `${subject} 

                Name: ${name}
                Email: ${email}

                Message:
                ${message}`;

                emailjs.init("h1pJrdHJ7bsjOBTjE");
                await emailjs.send("service_lzo121i", "template_wb6jj39", {
                    to_name: name,
                    message: Message,
                    reply_to: "no-reply@mywebsite.com"
                }).then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    document.getElementById('contact-success').style.display = 'flex'; // Show success popup
                    this.reset(); 
                }, function(error) {
                    console.log('FAILED...', error);
                    document.getElementById('contact-success').style.display = 'flex'; // Show success popup
                    this.reset(); 
                });

                
            });




    































