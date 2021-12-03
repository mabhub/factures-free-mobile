# factures-free-mobile

Simple script permettant de télécharger les factures disponibles dans l'espace
abonné d'un compte Free mobile.

- Nécessite NodeJS version **⩾ 16**
- Les fichiers existants dans le dossier ne sont pas re-téléchargés
- Si les serveurs de Free sont surchargés, certains fichiers `.pdf` peuvent
  arriver vides.  
  Il suffit alors de supprimer les fichiers vides et de relancer le script.
- L'identifiant et le mot de passe ne sont pas stockés.  
  Ils ne sont transmis qu'une unique fois (en https) pour la connexion à
  l'espace abonné.

## Utilisation

```shell
$ npx factures-free-mobile
# confirmer l'installation (temporaire) du package (y)
# puis :
$ factures-free-mobile
Identifiant ? <identifiant numérique>
Mot de passe ? <mot de passe du compte>

```

ou bien :

```shell
$ npm i -g factures-free-mobile
# puis :
$ factures-free-mobile
Identifiant ? <identifiant numérique>
Mot de passe ? <mot de passe du compte>
```
