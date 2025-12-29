# WordSchool - Sistema de Gestió i Correcció d'Exàmens

Sistema web per a acadèmies d'idiomes que permet als professors corregir examens pujats pels alumnes en format JPG, utilitzant OCR i aprenentatge automàtic per adaptar-se a l'estil de correcció de cada professor.

## Característiques Principals

- 📝 **Gestió d'Exàmens**: Creació i gestió d'exàmens per nivells (A2, B1, B2 segons estàndards Oxford)
- 📷 **Pujada d'Imatges**: Els alumnes poden pujar els seus examens en format JPG
- 🔍 **OCR Automàtic**: Extracció de text de les imatges utilitzant OCR
- 🤖 **Aprenentatge Personalitzat**: El sistema aprèn de l'estil de correcció de cada professor
- 📊 **Dashboard de Gestió**: Vista completa de l'estat del sistema, estadístiques i activitat recent
- 🎯 **Filtres per Nivell**: Visualització i gestió per nivells d'anglès

## Stack Tecnològic

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Visualització**: Recharts per gràfics
- **Icones**: Lucide React

## Instal·lació

```bash
# Instal·lar dependències
npm install

# Configurar variables d'entorn
cp .env.example .env.local
# Edita .env.local i afegeix la teva OPENAI_API_KEY

# Executar en mode desenvolupament
npm run dev

# Compilar per producció
npm run build

# Executar en producció
npm start
```

## Configuració d'Entorn

Crea un fitxer `.env.local` amb les següents variables:

```env
OPENAI_API_KEY=sk-... (la teva clau API d'OpenAI)
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

**Important**: El fitxer `.env.local` no es pujarà a GitHub (està a `.gitignore`).

## Deploy a Vercel

Veure [DEPLOY.md](./DEPLOY.md) per instruccions completes de deploy a Vercel via GitHub.

## Estructura del Projecte

```
wordschool/
├── src/
│   ├── app/              # Pàgines i API routes (Next.js App Router)
│   ├── components/       # Components React
│   │   └── dashboard/   # Components del dashboard
│   └── types/           # Definicions TypeScript
├── public/              # Fitxers estàtics
└── package.json
```

## Components del Dashboard

- **Dashboard**: Component principal amb navegació per pestanyes
- **StatsCards**: Targetes amb estadístiques principals
- **ExamsByLevel**: Gràfic de barres mostrant exàmens per nivell
- **PendingExamsList**: Llista d'exàmens pendents de correcció
- **RecentActivity**: Activitat recent del sistema
- **LevelFilter**: Filtre per nivells d'anglès

## Deploy a Vercel

El projecte està configurat per deployar automàticament a Vercel via GitHub.

### Configuració Ràpida

1. **Crea un repositori a GitHub** i puja el codi
2. **Connecta el repositori a Vercel**:
   - Vés a [vercel.com](https://vercel.com)
   - Clica "Add New Project"
   - Connecta el teu repositori de GitHub
3. **Configura les variables d'entorn a Vercel**:
   - `OPENAI_API_KEY`: La teva clau API d'OpenAI
   - `NEXT_PUBLIC_API_URL`: URL del backend (opcional)
   - `NODE_ENV`: `production`
4. **Deploy**: Vercel desplegarà automàticament

Veure [DEPLOY.md](./DEPLOY.md) per instruccions detallades.

### Variables d'Entorn

Crea un fitxer `.env.local` per desenvolupament local:

```bash
cp .env.example .env.local
# Edita .env.local i afegeix la teva OPENAI_API_KEY
```

**Important**: Mai pugis `.env.local` a GitHub (ja està a `.gitignore`).

## Pròxims Passos

- [ ] Implementar backend complet amb base de dades
- [ ] Integració amb servei OCR (Tesseract.js o Google Cloud Vision)
- [ ] Sistema d'aprenentatge amb LLM
- [ ] Autenticació i autorització
- [ ] Gestió d'alumnes i professors
- [ ] Sistema de notificacions

## Llicència

Privat - Acadèmia d'Idiomes

