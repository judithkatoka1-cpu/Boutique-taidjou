const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Boutique Taidjou - Vente en Ligne</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            body { background-color: #f4f6f9; color: #333; }
            header { background: #111827; color: white; padding: 15px 5%; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            header h1 { color: #f97316; font-size: 1.5rem; }
            .cart-btn { background: #f97316; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: bold; position: relative; }
            .cart-count { background: white; color: #f97316; padding: 2px 6px; border-radius: 50%; font-size: 0.8rem; margin-left: 5px; }
            
            .banner { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 40px 5%; text-align: center; }
            .banner h2 { font-size: 2rem; margin-bottom: 10px; }
            
            .container { padding: 30px 5%; max-width: 1200px; margin: 0 auto; }
            .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 25px; margin-top: 20px; }
            
            .product-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s; position: relative; }
            .product-card:hover { transform: translateY(-5px); }
            .product-img { width: 100%; height: 200px; object-fit: cover; background: #e2e8f0; }
            .product-info { padding: 15px; }
            .badge { position: absolute; top: 10px; right: 10px; background: #ef4444; color: white; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; }
            .price-box { margin: 10px 0; }
            .old-price { text-decoration: line-through; color: #94a3b8; font-size: 0.9rem; margin-right: 8px; }
            .new-price { color: #059669; font-size: 1.3rem; font-weight: bold; }
            
            .btn { display: block; width: 100%; padding: 10px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; text-align: center; margin-top: 8px; text-decoration: none; }
            .btn-primary { background: #f97316; color: white; }
            .btn-whatsapp { background: #25d366; color: white; font-size: 0.9rem; }
            
            /* Admin Panel */
            .admin-section { background: white; padding: 25px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .admin-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px; }
            .admin-form input, .admin-form select { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; }

            /* Cart Modal */
            .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; justify-content: center; align-items: center; }
            .modal-content { background: white; padding: 25px; border-radius: 12px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; }
            .cart-item { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding: 10px 0; }
        </style>
    </head>
    <body>

        <header>
            <h1>🛍️ Boutique Taidjou</h1>
            <button class="cart-btn" onclick="toggleCart()">🛒 Panier <span class="cart-count" id="cartCount">0</span></button>
        </header>

        <section class="banner">
            <h2>Grandes Liquidation & Ventes en Gros</h2>
            <p>Commandez vos vêtements en ligne et recevez votre livraison directement via WhatsApp !</p>
        </section>

        <div class="container">
            <!-- Espace Admin -->
            <details class="admin-section">
                <summary style="font-weight: bold; cursor: pointer;">🔐 Espace d'Administration (Ajouter un produit)</summary>
                <form class="admin-form" id="addProductForm" onsubmit="addNewProduct(event)">
                    <input type="text" id="pName" placeholder="Nom du produit" required>
                    <input type="number" id="pPrice" placeholder="Prix initial ($)" required>
                    <input type="number" id="pDiscount" placeholder="Réduction (%)" value="0">
                    <input type="url" id="pImg" placeholder="Lien d'image (ex: Unsplash)" required>
                    <button type="submit" class="btn btn-primary">Ajouter au catalogue</button>
                </form>
            </details>

            <h3 style="margin-bottom: 15px;">Nos Articles Disponibles</h3>
            <div class="products-grid" id="productGrid">
                <!-- Les produits s'affichent ici -->
            </div>
        </div>

        <!-- Fenêtre Panier -->
        <div class="modal" id="cartModal">
            <div class="modal-content">
                <h3>Votre Panier d'achat</h3>
                <div id="cartItems" style="margin: 15px 0;"></div>
                <h4>Total : <span id="cartTotal" style="color: #059669;">0$</span></h4>
                <br>
                <button class="btn btn-whatsapp" onclick="sendWhatsAppOrder()">📲 Valider et Commander par WhatsApp</button>
                <button class="btn" style="background:#cbd5e1; margin-top:8px;" onclick="toggleCart()">Fermer</button>
            </div>
        </div>

        <script>
            let products = JSON.parse(localStorage.getItem('taidjou_products')) || [
                { id: 1, name: "Chemise en lin", price: 40, discount: 20, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500" },
                { id: 2, name: "Pantalon en jean", price: 60, discount: 30, img: "https://images.unsplash.com/photo-1542272604-780c96856592?w=500" },
                { id: 3, name: "Veste d'hiver", price: 100, discount: 50, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" }
            ];

            let cart = [];

            function renderProducts() {
                const grid = document.getElementById('productGrid');
                grid.innerHTML = products.map(p => {
                    const finalPrice = p.price * (1 - p.discount/100);
                    return `
                        <div class="product-card">
                            ${p.discount > 0 ? <span class="badge">-${p.discount}%</span> : ''}
                            <img src="${p.img}" class="product-img" alt="${p.name}">
                            <div class="product-info">
                                <h4>${p.name}</h4>
                                <div class="price-box">
                                    ${p.discount > 0 ? <span class="old-price">${p.price}$</span> : ''}
                                    <span class="new-price">${finalPrice.toFixed(0)}$</span>
                                </div>
                                <button class="btn btn-primary" onclick="addToCart(${p.id})">Ajouter au panier</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            function addNewProduct(e) {
                e.preventDefault();
                const name = document.getElementById('pName').value;
                const price = parseFloat(document.getElementById('pPrice').value);
                const discount = parseFloat(document.getElementById('pDiscount').value) || 0;
                const img = document.getElementById('pImg').value;

                const newP = { id: Date.now(), name, price, discount, img };
                products.push(newP);
                localStorage.setItem('taidjou_products', JSON.stringify(products));
                renderProducts();
                document.getElementById('addProductForm').reset();
                alert("Produit ajouté avec succès !");
            }

            function addToCart(id) {
                const item = products.find(p => p.id === id);
                cart.push(item);
                document.getElementById('cartCount').innerText = cart.length;
                alert(item.name + " ajouté au panier !");
            }

            function toggleCart() {
                const modal = document.getElementById('cartModal');
                modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
                renderCart();
            }

            function renderCart() {
                const cartItems = document.getElementById('cartItems');
                let total = 0;
                cartItems.innerHTML = cart.map(item => {
                    const price = item.price * (1 - item.discount/100);
                    total += price;
                    return <div class="cart-item"><span>${item.name}</span><b>${price.toFixed(0)}$</b></div>;
                }).join('');
                document.getElementById('cartTotal').innerText = total.toFixed(0) + "$";
            }

            function sendWhatsAppOrder() {
                if(cart.length === 0) return alert("Votre panier est vide !");
                let message = "Bonjour Boutique Taidjou, je souhaite commander :\n";
                cart.forEach(item => {
                    const price = item.price * (1 - item.discount/100);
                    message += `- ${item.name} (${price.toFixed(0)}$)\n`;
                });
                const total = document.getElementById('cartTotal').innerText;
                message += \n*Total : ${total}*;
                
                const phone = "243821336698"; 
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}, '_blank');
            }

            renderProducts();
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
