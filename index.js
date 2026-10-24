const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boutique Taidjou - Vente en Gros & Détail</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
        body { background-color: #f4f6f8; color: #333; }
        header { background: #111827; color: white; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; color: #f97316; }
        .container { max-width: 1200px; margin: 20px auto; padding: 0 15px; }
        .hero { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 40px 20px; border-radius: 8px; text-align: center; margin-bottom: 25px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 15px; display: flex; flex-direction: column; justify-content: space-between; }
        .price { font-size: 18px; color: #ea580c; font-weight: bold; }
        .btn { background: #f97316; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; text-align: center; font-weight: bold; width: 100%; margin-top: 10px; }
        .btn:hover { background: #ea580c; }
        .cart-box { background: white; padding: 20px; border-radius: 8px; margin-top: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <header>
        <div class="logo">Boutique Taidjou</div>
        <div>Panier (<span id="cartCount">0</span>)</div>
    </header>

    <div class="container">
        <div class="hero">
            <h1>Bienvenue sur Boutique Taidjou</h1>
            <p>Votre plateforme de commerce en gros et détail</p>
        </div>

        <h2>Produits disponibles</h2>
        <br>
        <div class="grid" id="productGrid"></div>

        <div class="cart-box">
            <h2>Votre Panier / Devis</h2>
            <div id="cartItems">Aucun article dans le panier.</div>
            <h3>Total : <span id="cartTotal">0</span> $</h3>
            <button class="btn" onclick="sendWhatsAppOrder()">Commander via WhatsApp</button>
        </div>
    </div>

    <script>
        var products = [
            { id: 1, name: "Vêtements de Mode", price: 12.50 },
            { id: 2, name: "Accessoires Électroniques", price: 25.00 },
            { id: 3, name: "Articles Maison", price: 8.00 }
        ];

        var cart = [];

        function renderProducts() {
            var grid = document.getElementById("productGrid");
            grid.innerHTML = products.map(function(p) {
                return '<div class="card">' +
                    '<h3>' + p.name + '</h3>' +
                    '<div class="price">' + p.price + ' $</div>' +
                    '<button class="btn" onclick="addToCart(' + p.id + ')">Ajouter au panier</button>' +
                '</div>';
            }).join('');
        }

        function addToCart(id) {
            var product = products.find(function(p) { return p.id === id; });
            cart.push(product);
            document.getElementById("cartCount").innerText = cart.length;
            renderCart();
        }

        function renderCart() {
            var container = document.getElementById("cartItems");
            if (cart.length === 0) {
                container.innerHTML = "Aucun article dans le panier.";
                document.getElementById("cartTotal").innerText = "0";
                return;
            }
            var total = 0;
            container.innerHTML = cart.map(function(item) {
                total += item.price;
                return '<div>- ' + item.name + ' (' + item.price + ' $)</div>';
            }).join('');
            document.getElementById("cartTotal").innerText = total.toFixed(2);
        }

        function sendWhatsAppOrder() {
            if (cart.length === 0) return alert("Votre panier est vide !");
            var message = "Bonjour Boutique Taidjou, je souhaite commander :\\n";
            var total = 0;
            cart.forEach(function(item) {
                total += item.price;
                message += "- " + item.name + " (" + item.price + " $)\\n";
            });
            message += "Total : " + total.toFixed(2) + " $";
            var phone = "243821336698";
            window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(message), "_blank");
        }

        renderProducts();
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});
