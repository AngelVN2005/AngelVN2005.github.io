// ── Cart Array ─────────────────────────────────────────────────────────────
// Loads the cart from localStorage, or starts with an empty array.
// Each item: { name, pricePerUnit, amount }
 
function loadCart() {
    const stored = localStorage.getItem("wendys-cart");
    return stored ? JSON.parse(stored) : [];
}
 
function saveCart(cart) {
    localStorage.setItem("wendys-cart", JSON.stringify(cart));
}
 
// ── Menu Catalog ───────────────────────────────────────────────────────────
// Source of truth for all dish names and prices.
 
const menuCatalog = [
    // Appetizers
    { name: "Tostones Rellenos",         pricePerUnit: 8.99  },
    { name: "Quipes",                    pricePerUnit: 6.99  },
    { name: "Pastelitos",                pricePerUnit: 5.99  },
    { name: "Yuca Frita",                pricePerUnit: 5.49  },
    { name: "Yaniqueques",               pricePerUnit: 4.99  },
    { name: "Croquetas de Pollo",        pricePerUnit: 6.49  },
    // Main Dishes
    { name: "Sancocho Dominicano",       pricePerUnit: 14.99 },
    { name: "La Bandera",                pricePerUnit: 12.99 },
    { name: "Mofongo",                   pricePerUnit: 13.49 },
    { name: "Locrio",                    pricePerUnit: 11.99 },
    { name: "Pastelón de Plátano Maduro",pricePerUnit: 12.49 },
    { name: "Asopao",                    pricePerUnit: 13.99 },
    // Desserts
    { name: "Tres Leches Casero",        pricePerUnit: 6.99  },
    { name: "Habichuelas con Dulce",     pricePerUnit: 5.99  },
    { name: "Bizcocho Dominicano",       pricePerUnit: 7.49  },
    { name: "Flan",                      pricePerUnit: 5.49  },
    { name: "Arroz con Leche",           pricePerUnit: 4.99  },
    { name: "Pudín de Pan",              pricePerUnit: 5.99  }
];
 
 
// ── Cart Count Badge ───────────────────────────────────────────────────────
// Shows the total number of items in the cart on the nav Cart link.
 
function updateCartCount() {
    const cartLink = document.querySelector(".header-nav a[href*='cart']");
    if (!cartLink) return;
 
    const cart = loadCart();
    const totalItems = cart.reduce((sum, item) => sum + item.amount, 0);
 
    let badge = cartLink.querySelector(".cart-badge");
 
    if (totalItems > 0) {
        if (!badge) {
            badge = document.createElement("span");
            badge.classList.add("cart-badge");
            cartLink.appendChild(badge);
        }
        badge.textContent = totalItems;
    } else {
        if (badge) badge.remove();
    }
}

// ── Add to Cart ────────────────────────────────────────────────────────────
 
function addToCart(dishName) {
    const catalog = menuCatalog.find((item) => (item.name) === (dishName));
    if (!catalog) return;
 
    const cart = loadCart();
    const existing = (cart.find((item) => (item.name) === (dishName)));
 
    if (existing) {
        existing.amount += 1;
    } else {
        cart.push({ name: catalog.name, pricePerUnit: catalog.pricePerUnit, amount: 1 });
    }
 
    saveCart(cart);
    updateCartCount();
}
 
// ── Menu Page: Add to Cart Buttons ─────────────────────────────────────────
 
function initMenuPage() {
    const addButtons = document.querySelectorAll(".dish-item .btn-outline");
 
    addButtons.forEach((button) => {
        const dishNameEl = button.closest(".dish-item").querySelector(".dish-name p");
        if (!dishNameEl) return;
 
        const dishName = dishNameEl.textContent.trim();
 
        button.addEventListener("click", () => {
            addToCart(dishName);
 
            const original = button.textContent;
            button.textContent = "Added!";
            button.disabled = true;
            setTimeout(() => {
                button.textContent = original;
                button.disabled = false;
            }, 1200);
        });
    });
}
 
// ── Home Page: Explore Menu Button ─────────────────────────────────────────
 
function initHomePage() {
    const exploreBtn = document.querySelector(".intro-buttons .btn-solid");
    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            window.location.href = "../projects/menu.html";
        });
    }
 
    // "See in menu" buttons on dish cards — redirect to the right section
    const dishButtons = document.querySelectorAll("#dishes .dish-item .btn-outline");
    dishButtons.forEach((button) => {
        const dishNameEl = button.closest(".dish-item").querySelector(".dish-name p");
        if (!dishNameEl) return;
 
        const dishName = dishNameEl.textContent.trim();
        const catalog = menuCatalog.find((item) => (item.name) === (dishName));
        if (!catalog) return;
 
        // Determine which section this dish belongs to
        const appetizers = ["Tostones Rellenos","Quipes","Pastelitos","Yuca Frita","Yaniqueques","Croquetas de Pollo"];
        const mains      = ["Sancocho Dominicano","La Bandera","Mofongo","Locrio","Pastelón de Plátano Maduro","Asopao"];
 
        let section = "#deserts";
        if (appetizers.includes(dishName)) section = "#appetizers";
        else if (mains.includes(dishName)) section = "#main-dishes";
 
        button.addEventListener("click", () => {
            window.location.href = `../projects/menu.html${section}`;
        });
    });
}

// ── Cart Page Rendering ───────────────────────────────────────────────

function renderCartPage() {
    const container = document.getElementById("cart-container");
    const totalEl = document.getElementById("cart-total-price");

    if (!container || !totalEl) return;

    const cart = loadCart();

    // Empty cart case
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalEl.textContent = "$0.00";
        return;
    }

    let total = 0;

    container.innerHTML = "";

    cart.forEach((item, index) => {
        const itemTotal = item.pricePerUnit * item.amount;
        total += itemTotal;

        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.pricePerUnit.toFixed(2)}</div>
            <div class="cart-item-qty">
                <button data-index="${index}" class="decrease">-</button>
                <span>${item.amount}</span>
                <button data-index="${index}" class="increase">+</button>
            </div>
            <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
        `;

        container.appendChild(div);
    });

    totalEl.textContent = `$${total.toFixed(2)}`;

    attachCartEvents();
}

function attachCartEvents() {
    const cart = loadCart();

    document.querySelectorAll(".increase").forEach((btn) => {
        btn.addEventListener("click", () => {
            const i = btn.dataset.index;
            cart[i].amount += 1;
            saveCart(cart);
            renderCartPage();
            updateCartCount();
        });
    });

    document.querySelectorAll(".decrease").forEach((btn) => {
        btn.addEventListener("click", () => {
            const i = btn.dataset.index;
            cart[i].amount -= 1;

            if (cart[i].amount <= 0) {
                cart.splice(i, 1);
            }

            saveCart(cart);
            renderCartPage();
            updateCartCount();
        });
    });

    const clearBtn = document.getElementById("clear-cart");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            saveCart([]);
            renderCartPage();
            updateCartCount();
        });
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "../projects/checkout.html";
        });
    }
}
 
// ── Checkout Page ─────────────────────────────────────────────

function renderCheckoutPage() {
    const container = document.getElementById("summary-items");
    const totalEl = document.getElementById("summary-total-price");

    if (!container || !totalEl) return;

    const cart = loadCart();

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalEl.textContent = "$0.00";
        return;
    }

    let total = 0;
    container.innerHTML = "";

    cart.forEach((item) => {
        const itemTotal = item.pricePerUnit * item.amount;
        total += itemTotal;

        const div = document.createElement("div");
        div.classList.add("summary-item");

        div.innerHTML = `
            <span>${item.name} x${item.amount}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;

        container.appendChild(div);
    });

    totalEl.textContent = `$${total.toFixed(2)}`;
}

function initCheckoutForm() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!name || !email || !address || !phone) {
            alert("Please fill out all fields.");
            return;
        }

        // Simulate order placement
        alert("Order placed successfully!");

        // Clear cart
        saveCart([]);
        updateCartCount();

        // Redirect to home
        window.location.href = "../projects/index.html";
    });
}

// ── Contact Page ─────────────────────────────────────────

function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const subject = form.subject.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !subject || !message) {
            alert("Please fill out all fields.");
            return;
        }

        // Simulate sending message
        alert("Message sent successfully! We'll get back to you soon.");

        form.reset();
    });
}

// ── Init ───────────────────────────────────────────────────────────────────
 
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
 
   
     if (document.querySelector("#intro")) initHomePage();
    if (document.querySelector("#appetizers")) initMenuPage();
    if (document.querySelector("#cart-page")) renderCartPage();
    if (document.querySelector("#checkout-page")) {
        renderCheckoutPage();
        initCheckoutForm();
    }
    if (document.querySelector("#contact-page")) {
        initContactForm();
    }
});