const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
let isCartShowing = false;

// Хранилище таймеров для каждой кнопки
const buttonTimers = new Map();

const products = [
    {
        id: 1,
        name: "Vanilla Cupcakes (6 Pack)",
        price: 12.99,
        category: "Cupcake",
    },
    {
        id: 2,
        name: "French Macaron",
        price: 3.99,
        category: "Macaron",
    },
    {
        id: 3,
        name: "Pumpkin Cupcake",
        price: 3.99,
        category: "Cupcake",
    },
    {
        id: 4,
        name: "Chocolate Cupcake",
        price: 5.99,
        category: "Cupcake",
    },
    {
        id: 5,
        name: "Chocolate Pretzels (4 Pack)",
        price: 10.99,
        category: "Pretzel",
    },
    {
        id: 6,
        name: "Strawberry Ice Cream",
        price: 2.99,
        category: "Ice Cream",
    },
    {
        id: 7,
        name: "Chocolate Macarons (4 Pack)",
        price: 9.99,
        category: "Macaron",
    },
    {
        id: 8,
        name: "Strawberry Pretzel",
        price: 4.99,
        category: "Pretzel",
    },
    {
        id: 9,
        name: "Butter Pecan Ice Cream",
        price: 2.99,
        category: "Ice Cream",
    },
    {
        id: 10,
        name: "Rocky Road Ice Cream",
        price: 2.99,
        category: "Ice Cream",
    },
    {
        id: 11,
        name: "Vanilla Macarons (5 Pack)",
        price: 11.99,
        category: "Macaron",
    },
    {
        id: 12,
        name: "Lemon Cupcakes (4 Pack)",
        price: 12.99,
        category: "Cupcake",
    },
];

products.forEach(({ name, id, price, category }) => {
    dessertCards.innerHTML += `
      <div class="dessert-card">
        <h2>${name}</h2>
        <p class="dessert-price">$${price.toFixed(2)}</p>
        <p class="product-category">Category: ${category}</p>
        <button id="${id}" class="btn add-to-cart-btn">Add to cart</button>
      </div>
    `;
});

class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.taxRate = 8.25;
    }

    addItem(id, products) {
        const product = products.find((item) => item.id === id);
        this.items.push(product);
        this.updateProductDisplay();
        this.updateCartDisplay();
    }

    removeItem(id) {
        this.items = this.items.filter((item) => item.id !== id);
        this.updateProductDisplay();
        this.updateCartDisplay();
    }

    changeQuantity(id, increment) {
        const product = products.find((item) => item.id === id);
        if (increment) {
            this.items.push(product);
        } else {
            const index = this.items.findIndex((item) => item.id === id);
            if (index !== -1) {
                this.items.splice(index, 1);
            }
        }
        this.updateProductDisplay();
        this.updateCartDisplay();
    }

    updateProductDisplay() {
        const totalCountPerProduct = {};
        this.items.forEach((dessert) => {
            totalCountPerProduct[dessert.id] = (totalCountPerProduct[dessert.id] || 0) + 1;
        });

        productsContainer.innerHTML = "";
        Object.keys(totalCountPerProduct).forEach((id) => {
            const product = products.find((item) => Number(item.id) === Number(id));
            const count = totalCountPerProduct[id];
            productsContainer.innerHTML += `
              <div id="dessert${id}" class="product">
                <div class="product-left">
                  <p>
                    <span class="product-count" id="product-count-for-id${id}">${count}x</span> ${product.name}
                  </p>
                </div>
                <div class="product-right">
                  <p>$${(product.price * count).toFixed(2)}</p>
                  <div class="quantity-controls">
                    <button class="quantity-btn" data-id="${id}" data-action="decrease">–</button>
                    <span>${count}</span>
                    <button class="quantity-btn" data-id="${id}" data-action="increase">+</button>
                  </div>
                  <button class="remove-btn" data-id="${id}" title="Remove">×</button>
                </div>
              </div>
            `;
        });

        this.attachEventListeners();
    }

    attachEventListeners() {
        const quantityButtons = document.querySelectorAll(".quantity-btn");
        const removeButtons = document.querySelectorAll(".remove-btn");

        quantityButtons.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const id = Number(event.target.dataset.id);
                const action = event.target.dataset.action;
                this.changeQuantity(id, action === "increase");
            });
        });

        removeButtons.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const id = Number(event.target.dataset.id);
                this.removeItem(id);
            });
        });
    }

    getCounts() {
        return this.items.length;
    }

    clearCart() {
        if (!this.items.length) {
            alert("Your shopping cart is already empty");
            return;
        }

        const isCartCleared = confirm("Are you sure you want to clear all items from your shopping cart?");
        if (isCartCleared) {
            this.items = [];
            productsContainer.innerHTML = "";
            this.updateCartDisplay();
        }
    }

    calculateTaxes(amount) {
        return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
    }

    calculateTotal() {
        const subTotal = this.items.reduce((total, item) => total + item.price, 0);
        const tax = this.calculateTaxes(subTotal);
        this.total = subTotal + tax;
        return { subTotal, tax, total: this.total };
    }

    updateCartDisplay() {
        const { subTotal, tax, total } = this.calculateTotal();
        totalNumberOfItems.textContent = this.getCounts();
        cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
        cartTaxes.textContent = `$${tax.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

const cart = new ShoppingCart();
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

[...addToCartBtns].forEach((btn) => {
    btn.addEventListener("click", (event) => {
        const id = Number(event.target.id);
        cart.addItem(id, products);
        // Очищаем предыдущий таймер для этой кнопки
        if (buttonTimers.has(btn)) {
            clearTimeout(buttonTimers.get(btn));
        }
        // Анимация галочки
        btn.classList.add("clicked");
        const originalText = btn.textContent;
        btn.textContent = "✓";
        const timer = setTimeout(() => {
            btn.classList.remove("clicked");
            btn.textContent = originalText;
            buttonTimers.delete(btn);
        }, 500);
        buttonTimers.set(btn, timer);
    });
});

cartBtn.addEventListener("click", () => {
    isCartShowing = !isCartShowing;
    showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
    cartContainer.style.display = isCartShowing ? "block" : "none";
});

clearCartBtn.addEventListener("click", cart.clearCart.bind(cart));
