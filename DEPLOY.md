# Guia de Deploy a Vercel

Aquest document explica com desplegar WordSchool a Vercel via GitHub.

## Prerequisits

1. Compte de GitHub
2. Compte de Vercel (gratuït)
3. Clau API d'OpenAI (per al sistema d'aprenentatge)

## Pas 1: Preparar el Repositori GitHub

1. Crea un nou repositori a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - WordSchool dashboard"
   git branch -M main
   git remote add origin https://github.com/TU_USUARI/wordschool.git
   git push -u origin main
   ```

2. Assegura't que el fitxer `.env.local` NO estigui al repositori (ja està a `.gitignore`)

## Pas 2: Configurar Variables d'Entorn a Vercel

1. Accedeix a [Vercel](https://vercel.com) i inicia sessió
2. Clica a "Add New Project"
3. Connecta el teu repositori de GitHub
4. Abans de fer deploy, configura les variables d'entorn:

   **A la secció "Environment Variables" afegeix:**

   ```
   OPENAI_API_KEY = sk-... (la teva clau API d'OpenAI)
   NEXT_PUBLIC_API_URL = https://tu-dominio.vercel.app (o deixa buit per producció)
   NODE_ENV = production
   ```

   **Important**: 
   - `OPENAI_API_KEY` ha de ser una variable d'entorn **privada** (no pública)
   - No posis `NEXT_PUBLIC_` davant de `OPENAI_API_KEY` per seguretat

## Pas 3: Configuració del Projecte a Vercel

Vercel detectarà automàticament que és un projecte Next.js. Les configuracions per defecte haurien de funcionar:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (automàtic)
- **Output Directory**: `.next` (automàtic)
- **Install Command**: `npm install` (automàtic)

## Pas 4: Deploy

1. Clica a "Deploy"
2. Vercel construirà i desplegarà el projecte automàticament
3. Un cop completat, tindràs una URL com: `https://wordschool-xxxxx.vercel.app`

## Pas 5: Configurar Variables d'Entorn a Producció

Després del primer deploy:

1. Vés a "Settings" > "Environment Variables"
2. Afegeix les variables necessàries:
   - `OPENAI_API_KEY`: La teva clau API d'OpenAI
   - `NEXT_PUBLIC_API_URL`: URL del teu backend (si és diferent)
3. Clica "Redeploy" per aplicar els canvis

## Configuració de Variables d'Entorn

### Variables Necessàries

| Variable | Descripció | Exemple |
|----------|------------|---------|
| `OPENAI_API_KEY` | Clau API d'OpenAI per al sistema d'aprenentatge | `sk-...` |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend (opcional) | `https://api.wordschool.com` |
| `NODE_ENV` | Entorn d'execució | `production` |

### Variables Futures (quan s'implementin)

- `DATABASE_URL`: URL de connexió a la base de dades
- `NEXTAUTH_SECRET`: Secret per autenticació
- `NEXTAUTH_URL`: URL pública de l'aplicació

## Deploy Automàtic

Un cop configurat, cada push a la branca `main` del repositori GitHub desplegarà automàticament a Vercel.

### Branques

- **Production**: Deploy automàtic des de `main`
- **Preview**: Deploy automàtic per a altres branques i pull requests

## Troubleshooting

### Error: "Environment variable not found"

- Assegura't que has afegit les variables a Vercel
- Verifica que els noms de les variables coincideixen exactament
- Fes un "Redeploy" després d'afegir noves variables

### Error: "Build failed"

- Revisa els logs de build a Vercel
- Assegura't que totes les dependències estan a `package.json`
- Verifica que no hi ha errors de TypeScript

### Error: "OpenAI API Key invalid"

- Verifica que la clau API és correcta
- Assegura't que la clau no està expirada
- Comprova que tens crèdit disponible a OpenAI

## Seguretat

⚠️ **Important**: Mai pugis les claus API al repositori GitHub!

- ✅ Utilitza `.env.local` per desenvolupament local
- ✅ Utilitza Environment Variables de Vercel per producció
- ✅ Asegura't que `.env.local` està a `.gitignore`
- ✅ Utilitza `.env.example` com a plantilla (sense valors reals)

## Actualitzacions

Per actualitzar el projecte:

```bash
git add .
git commit -m "Descripció dels canvis"
git push origin main
```

Vercel desplegarà automàticament la nova versió.

