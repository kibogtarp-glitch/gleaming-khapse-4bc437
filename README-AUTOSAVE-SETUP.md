# Sauvegarde automatique — guide de configuration

Ce dossier ajoute une vraie sauvegarde automatique à ton site : chaque modification
faite dans l'Admin (règlement, jobs, staff, lore...) est écrite dans **Netlify Blobs**
(le stockage clé/valeur intégré à Netlify) et devient visible pour **tous les
visiteurs** immédiatement — plus besoin de télécharger/réuploader `data.json`.

Coût : **gratuit**. Netlify Blobs est inclus dans le plan gratuit de Netlify pour un
usage de cette taille (un seul petit fichier JSON, peu d'écritures).

## Comment ça marche

- `netlify/functions/data-get.js` : lit les données sauvegardées et les sert à
  n'importe quel visiteur qui charge le site.
- `netlify/functions/data-save.js` : reçoit les modifications depuis l'Admin et les
  enregistre — mais seulement si on lui donne la bonne clé secrète.
- `data.json` reste comme donnée de secours si Netlify Blobs est vide (premier
  déploiement) ou si les fonctions ne sont pas encore configurées.

## 1. Déployer sur Netlify

1. Mets tout ce dossier dans un dépôt Git (GitHub/GitLab), ou utilise la CLI Netlify.
2. Sur Netlify : **Add new site** → connecte ton dépôt. Netlify lit `netlify.toml`,
   exécute `npm install` (pour installer `@netlify/blobs`), et déploie le site et
   les fonctions automatiquement.

## 2. Définir la clé secrète

1. Choisis une clé longue et aléatoire (ex : génère-en une sur
   https://www.uuidgenerator.net/ ou avec ton gestionnaire de mots de passe).
2. Sur Netlify : **Site settings > Environment variables** → ajoute une variable
   `SAVE_SECRET` avec cette valeur.
3. Redéploie le site (Netlify > Deploys > Trigger deploy) pour que la fonction
   voie la nouvelle variable.

Cette clé ne doit **jamais** apparaître dans le code du site (elle n'y est pas —
elle vit uniquement dans les réglages Netlify et dans le navigateur de la
personne qui l'entre).

## 3. Activer la sauvegarde dans l'Admin

1. Ouvre ton site déployé, connecte-toi à l'Admin (code habituel).
2. Va dans l'onglet **Avancé**, colle ta clé dans **"Clé de sauvegarde"**, clique
   **"Enregistrer la clé sur cet appareil"**.
3. Un message vert **"Sauvegardé sur le serveur pour tous les visiteurs"** doit
   apparaître. Si tu vois un message rouge, vérifie que la clé correspond
   exactement à `SAVE_SECRET` et que le site a bien été redéployé après l'avoir
   ajoutée.

À partir de là, toute modification (ajouter un job, éditer une règle, changer le
staff...) se sauvegarde automatiquement pour tout le monde, sans aucune manip
supplémentaire.

## Notes importantes

- La clé n'a besoin d'être entrée **qu'une seule fois par appareil/navigateur**
  (elle reste dans le localStorage). Si tu changes d'ordinateur ou de navigateur
  pour administrer le site, il faudra la recoller.
- **Ne partage cette clé qu'avec les personnes de confiance** qui doivent pouvoir
  modifier le site — c'est elle qui protège réellement les écritures, bien plus
  que le "code admin" visible dans le code source (qui ne fait que masquer
  l'interface, sans vraie sécurité).
- Le bouton **"Télécharger data.json"** reste utile comme sauvegarde locale de
  secours, mais n'est plus nécessaire pour publier tes changements.
- Si tu veux révoquer l'accès à quelqu'un, change la valeur de `SAVE_SECRET` dans
  Netlify et redéploie : son ancienne clé arrêtera de fonctionner.
