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
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .badge-discount { background-color: #ef4444; color: white; font-weight: bold; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 flex flex-col min-h-screen">

    <!-- En-tête -->
    <header class="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-3 cursor-pointer" onclick="showPage('catalog')">
                <i class="fa-solid fa-store text-orange-500 text-2xl"></i>
                <span class="font-bold text-xl tracking-wide">Boutique <span class="text-orange-500">Taidjou</span></span>
            </div>
            <div class="flex items-center space-x-4">
                <button onclick="openAdminModal()" class="text-slate-300 hover:text-white text-sm font-medium flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    <i class="fa-solid fa-lock text-xs text-orange-400"></i> Admin
                </button>
                <button onclick="toggleCart()" class="relative bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span id="cartCount" class="bg-white text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">0</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Bannière Promotionnelle -->
    <section class="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-8 px-4 text-center shadow-inner">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl md:text-4xl font-extrabold mb-2">Grand Arrivage & Vente en Gros / Détail</h1>
            <p class="text-orange-100 text-sm md:text-base mb-4">Commandez directement vos vêtements et articles en ligne avec livraison à Kinshasa.</p>
            <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium">
                <i class="fa-brands fa-whatsapp text-green-400 text-base"></i> Commande Instantanée via WhatsApp
            </div>
        </div>
    </section>

    <!-- Barres de Recherche & Filtres -->
    <main class="max-w-7xl mx-auto px-4 py-6 flex-grow">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div class="relative w-full md:w-80">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" id="searchInput" oninput="filterProducts()" placeholder="Rechercher un produit..." class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            </div>
            <div class="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0" id="categoryFilters">
                <button onclick="setCategory('all')" class="cat-btn bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">Tous</button>
                <button onclick="setCategory('Vêtements')" class="cat-btn bg-white border text-slate-600 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">Vêtements</button>
                <button onclick="setCategory('Électronique')" class="cat-btn bg-white border text-slate-600 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">Électronique</button>
                <button onclick="setCategory('Maison')" class="cat-btn bg-white border text-slate-600 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">Maison</button>
            </div>
        </div>

        <!-- Grille des Produits -->
        <div id="productsGrid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"></div>
    </main>

    <!-- Modal Panier / Checkout -->
    <div id="cartModal" class="fixed inset-0 bg-black/50 z-50 hidden flex justify-end">
        <div class="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div class="p-4 bg-slate-900 text-white flex justify-between items-center">
                <h2 class="font-bold text-lg"><i class="fa-solid fa-basket-shopping text-orange-500"></i> Votre Panier</h2>
                <button onclick="toggleCart()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div id="cartItems" class="p-4 flex-grow overflow-y-auto space-y-3"></div>
            <div class="p-4 border-t bg-slate-50">
                <div class="flex justify-between font-bold text-lg mb-4">
                    <span>Total :</span>
                    <span id="cartTotal" class="text-orange-600">0.00 $</span>
                </div>
                <div class="space-y-2 mb-4">
                    <input type="text" id="clientName" placeholder="Votre Nom complet *" class="w-full p-2 text-sm border rounded">
                    <input type="tel" id="clientPhone" placeholder="Téléphone WhatsApp *" class="w-full p-2 text-sm border rounded">
                    <input type="text" id="clientAddress" placeholder="Commune & Adresse de livraison *" class="w-full p-2 text-sm border rounded">
                </div>
                <button onclick="sendOrderWhatsApp()" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                    <i class="fa-brands fa-whatsapp text-xl"></i> Valider sur WhatsApp
                </button>
            </div>
        </div>
    </div>

    <!-- Modal Espace Admin -->
    <div id="adminModal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
            <div class="p-4 bg-slate-900 text-white flex justify-between items-center">
                <h3 class="font-bold"><i class="fa-solid fa-user-shield text-orange-500"></i> Espace Administrateur</h3>
                <button onclick="closeAdminModal()" class="text-slate-400 hover:text-white"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div id="adminAuth" class="p-6">
                <p class="text-sm text-slate-600 mb-4">Veuillez entrer votre mot de passe administrateur :</p>
                <input type="password" id="adminPass" placeholder="Mot de passe" class="w-full p-2 border rounded mb-4">
                <button onclick="loginAdmin()" class="w-full bg-orange-500 text-white py-2 rounded font-bold">Se Connecter</button>
            </div>
            <div id="adminPanel" class="p-6 hidden max-h-[80vh] overflow-y-auto space-y-4">
                <h4 class="font-bold text-slate-800 border-b pb-2">Ajouter un nouveau produit</h4>
                <form id="addProductForm" onsubmit="handleAddProduct(event)" class="space-y-3">
                    <input type="text" id="pName" placeholder="Nom du produit" required class="w-full p-2 text-sm border rounded">
                    <div class="grid grid-cols-2 gap-2">
                        <input type="number" step="0.01" id="pPrice" placeholder="Prix ($)" required class="w-full p-2 text-sm border rounded">
                        <input type="number" id="pDiscount" placeholder="Réduction (%)" class="w-full p-2 text-sm border rounded">
                    </div>
                    <select id="pCategory" class="w-full p-2 text-sm border rounded">
                        <option value="Vêtements">Vêtements</option>
                        <option value="Électronique">Électronique</option>
                        <option value="Maison">Maison</option>
                    </select>
                    <input type="url" id="pImg" placeholder="Lien de l'image (URL)" class="w-full p-2 text-sm border rounded">
                    <button type="submit" class="w-full bg-slate-900 text-white py-2 rounded text-sm font-bold">Enregistrer le Produit</button>
                </form>
            </div>
        </div>
    </div>

    <footer class="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-auto">
        <p>&copy; 2026 Boutique Taidjou - Tous droits réservés. Kinshasa, RDC.</p>
    </footer>

    <script>
        const initialProducts = [
            { id: 1, name: "Robe de Soirée Élégante", price: 25.00, discount: 10, category: "Vêtements", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400" },
            { id: 2, name: "Chemise Homme Coton Premium", price: 18.00, discount: 0, category: "Vêtements", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400" },
            { id: 3, name: "Écouteurs Sans Fil Bluetooth", price: 15.00, discount: 15, category: "Électronique", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400" },
            { id: 4, name: "Ensemble Ustensiles Cuisine", price: 30.00, discount: 0, category: "Maison", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400" }
        ];

        let products = JSON.parse(localStorage.getItem('taidjou_products')) || initialProducts;
        let cart = [];
        let selectedCategory = 'all';

        function renderProducts() {
            const grid = document.getElementById('productsGrid');
            const search = document.getElementById('searchInput').value.toLowerCase();
            
            const filtered = products.filter(p => {
                const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
                const matchSearch = p.name.toLowerCase().includes(search);
                return matchCat && matchSearch;
            });

            grid.innerHTML = filtered.map(p => {
                const finalPrice = p.discount > 0 ? (p.price * (1 - p.discount / 100)).toFixed(2) : p.price.toFixed(2);
                return \`
                    <div class="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                        <div class="relative">
                            <img src="\${p.img}" alt="\${p.name}" class="w-full h-40 object-cover">
                            \${p.discount > 0 ? \`<span class="absolute top-2 right-2 badge-discount">-\${p.discount}%</span>\` : ''}
                        </div>
                        <div class="p-3 flex-grow flex flex-col justify-between">
                            <div>
                                <h4 class="font-bold text-slate-800 text-sm mb-1">\${p.name}</h4>
                                <div class="text-xs text-slate-500 mb-2">\${p.category}</div>
                            </div>
                            <div>
                                <div class="flex items-center gap-2 mb-3">
                                    <span class="font-extrabold text-orange-600 text-base">\${finalPrice} $</span>
                                    \${p.discount > 0 ? \`<span class="text-xs text-slate-400 line-through">\${p.price} $</span>\` : ''}
                                </div>
                                <button onclick="addToCart(\${p.id})" class="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition">
                                    Ajouter au panier
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');
        }

        function addToCart(id) {
            const prod = products.find(p => p.id === id);
            cart.push(prod);
            document.getElementById('cartCount').innerText = cart.length;
            renderCart();
        }

        function toggleCart() {
            document.getElementById('cartModal').classList.toggle('hidden');
        }

        function renderCart() {
            const container = document.getElementById('cartItems');
            if (cart.length === 0) {
                container.innerHTML = '<p class="text-center text-slate-400 text-sm py-8">Votre panier est vide.</p>';
                document.getElementById('cartTotal').innerText = '0.00 $';
                return;
            }
            let total = 0;
            container.innerHTML = cart.map((item, index) => {
                const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
                total += price;
                return \`
                    <div class="flex justify-between items-center border-b pb-2 text-sm">
                        <div>
                            <div class="font-semibold text-slate-800">\${item.name}</div>
                            <div class="text-xs text-slate-500">\${price.toFixed(2)} $</div>
                        </div>
                        <button onclick="removeFromCart(\${index})" class="text-red-500 hover:text-red-700 text-xs">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                \`;
            }).join('');
            document.getElementById('cartTotal').innerText = total.toFixed(2) + ' $';
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            document.getElementById('cartCount').innerText = cart.length;
            renderCart();
        }

        function sendOrderWhatsApp() {
            if (cart.length === 0) return alert('Votre panier est vide !');
            const name = document.getElementById('clientName').value;
            const phone = document.getElementById('clientPhone').value;
            const address = document.getElementById('clientAddress').value;

            if (!name || !phone || !address) return alert('Veuillez remplir tous les champs de livraison.');

            let msg = \`*NOUVELLE COMMANDE - BOUTIQUE TAIDJOU*\\n\\n\`;
            msg += \`*Nom:* \${name}\\n*Téléphone:* \${phone}\\n*Adresse:* \${address}\\n\\n*Articles:*\\n\`;
            
            let total = 0;
            cart.forEach(item => {
                const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
                total += price;
                msg += \`- \${item.name} (\${price.toFixed(2)} $)\\n\`;
            });

            msg += \`\\n*Total:* \${total.toFixed(2)} $\`;
            
            const targetPhone = "243821336698";
            window.open(\`https://wa.me/\${targetPhone}?text=\${encodeURIComponent(msg)}\`, '_blank');
        }

        function openAdminModal() { document.getElementById('adminModal').classList.remove('hidden'); }
        function closeAdminModal() { document.getElementById('adminModal').classList.add('hidden'); }

        function loginAdmin() {
            const pass = document.getElementById('adminPass').value;
            if (pass === 'taidjou2026') {
                document.getElementById('adminAuth').classList.add('hidden');
                document.getElementById('adminPanel').classList.remove('hidden');
            } else {
                alert('Mot de passe incorrect.');
            }
        }

        function handleAddProduct(e) {
            e.preventDefault();
            const newP = {
                id: Date.now(),
                name: document.getElementById('pName').value,
                price: parseFloat(document.getElementById('pPrice').value),
                discount: parseFloat(document.getElementById('pDiscount').value) || 0,
                category: document.getElementById('pCategory').value,
                img: document.getElementById('pImg').value || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
            };
            products.push(newP);
            localStorage.setItem('taidjou_products', JSON.stringify(products));
            renderProducts();
            alert('Produit ajouté !');
            closeAdminModal();
        }

        function setCategory(cat) {
            selectedCategory = cat;
            renderProducts();
        }

        function filterProducts() { renderProducts(); }

        renderProducts();
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.listen(PORT, () => {
    console.log('Serveur démarré sur le port ' + PORT);
});
