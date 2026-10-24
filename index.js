const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

// Notre liste de départ pour la liquidation des vêtements
let produits = [
  { id: 1, nom: "Chemise en lin", prixInitial: 40, reduction: 20 },
  { id: 2, nom: "Pantalon en jean", prixInitial: 60, reduction: 30 },
  { id: 3, nom: "Veste d'hiver", prixInitial: 100, reduction: 50 }
];

// Page d'accueil : afficher la liste des articles et leurs prix liquidés
app.get('/', (req, res) => {
  let html = `<h1>Boutique de Liquidation - Vêtements</h1>`;
  html += `<ul>;`
  
  produits.forEach(p => {
    let reductionMontant = (p.prixInitial * p.reduction) / 100;
    let prixFinal = p.prixInitial - reductionMontant;
    html += `<li><b>${p.nom}</b> - Prix initial : ${p.prixInitial}$ | Réduction : ${p.reduction}% | <b>Prix liquidé : ${prixFinal}$</b></li>`;
  });
  
  html += `</ul>`;
  html += `<p><em>Vous pourrez bientôt ajouter, modifier ou supprimer des articles ici !</em></p>`;
  res.send(html);
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré ! Ouvrez votre navigateur sur : http://localhost:${PORT}`);
});
