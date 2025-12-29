# Guia de Configuració Inicial

## Pas 1: Clonar i Instal·lar

```bash
# Clonar el repositori (o crear nou projecte)
git clone https://github.com/TU_USUARI/wordschool.git
cd wordschool

# Instal·lar dependències
npm install
```

## Pas 2: Configurar Variables d'Entorn

### Desenvolupament Local

1. Crea un fitxer `.env.local`:

```bash
cp .env.example .env.local
```

2. Edita `.env.local` i afegeix la teva clau API d'OpenAI:

```env
OPENAI_API_KEY=sk-proj-... (la teva clau real)
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

**On obtenir la clau API d'OpenAI:**
1. Vés a [platform.openai.com](https://platform.openai.com)
2. Crea un compte o inicia sessió
3. Vés a "API Keys"
4. Crea una nova clau API
5. Copia la clau (només es mostra una vegada!)

## Pas 3: Executar en Desenvolupament

```bash
npm run dev
```

Obre [http://localhost:3000](http://localhost:3000) al navegador.

## Pas 4: Preparar per Deploy

### Opció A: Deploy Manual a Vercel

1. Crea un compte a [Vercel](https://vercel.com)
2. Instal·la Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Desplega:
   ```bash
   vercel
   ```

### Opció B: Deploy via GitHub (Recomanat)

1. Crea un repositori a GitHub
2. Puja el codi:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARI/wordschool.git
   git push -u origin main
   ```
3. Connecta el repositori a Vercel (veure [DEPLOY.md](./DEPLOY.md))

## Verificació

Després del deploy, verifica que:

- ✅ El dashboard carrega correctament
- ✅ Les estadístiques es mostren
- ✅ Els filtres de nivell funcionen
- ✅ No hi ha errors a la consola del navegador

## Troubleshooting

### Error: "OPENAI_API_KEY not found"

- Assegura't que has creat `.env.local`
- Verifica que la clau està ben escrita (sense espais)
- Reinicia el servidor de desenvolupament (`npm run dev`)

### Error: "Module not found"

- Executa `npm install` de nou
- Assegura't que estàs a la carpeta correcta del projecte

### Error al deploy a Vercel

- Verifica que has afegit `OPENAI_API_KEY` a les variables d'entorn de Vercel
- Revisa els logs de build a Vercel
- Assegura't que totes les dependències estan a `package.json`

