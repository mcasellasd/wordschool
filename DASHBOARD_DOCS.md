# Documentació del Dashboard de Gestió

## Vista General

El dashboard de gestió ofereix una visió completa del sistema de correcció d'exàmens, amb estadístiques en temps real, gestió d'exàmens pendents i activitat recent.

## Estructura del Dashboard

### 1. Header Superior
- **Títol**: "Dashboard de Gestió"
- **Subtítol**: "Acadèmia d'Idiomes - Sistema de Correcció d'Exàmens"
- **Filtre de Nivells**: Permet filtrar per A2, B1, B2 o veure tots

### 2. Pestanyes de Navegació
- **📊 Vista General**: Estadístiques i resum
- **📝 Exàmens**: Llista completa d'exàmens
- **👥 Alumnes**: Gestió d'alumnes (en desenvolupament)
- **🤖 Aprenentatge**: Dashboard d'aprenentatge del model (en desenvolupament)

### 3. Targetes d'Estadístiques (Vista General)

Cinc targetes que mostren:
- **Exàmens Totals**: Nombre total d'exàmens al sistema
- **Pendents de Corregir**: Exàmens que esperen correcció (amb indicador urgent si n'hi ha)
- **Correccions Completades**: Nombre d'exàmens ja corregits
- **Alumnes**: Nombre total d'alumnes registrats
- **Professors**: Nombre de professors actius

Cada targeta inclou:
- Icona representativa
- Valor numèric destacat
- Indicador de canvi (percentatge o estat)

### 4. Gràfic d'Exàmens per Nivell

Gràfic de barres que mostra:
- **Eix X**: Nivells (A2, B1, B2)
- **Eix Y**: Nombre d'exàmens
- **Barres**: 
  - Verdes: Exàmens corregits
  - Grogues: Exàmens pendents

Sota el gràfic, tres targetes resum amb:
- Color identificatiu del nivell
- Nombre total d'exàmens
- Nombre de pendents

### 5. Activitat Recent

Llista d'activitats recents del sistema:
- **Tipus d'activitat**:
  - 📝 Examen creat
  - ✅ Examen corregit
  - 📤 Examen pujat
  - ✨ OCR completat

Cada activitat mostra:
- Icona del tipus
- Descripció de l'activitat
- Usuari que l'ha realitzat
- Temps transcorregut (ex: "fa 15 minuts")

### 6. Llista d'Exàmens Pujats

Taula amb tots els examens pujats pels alumnes:

**Filtres disponibles**:
- Tots
- Pendents
- Revisar OCR
- Corregits

**Informació mostrada per cada examen**:
- Títol de l'examen
- Nom de l'alumne
- Data de pujada
- Confiança OCR (amb codi de colors)
- Puntuació (si està corregit)
- Estat (badge colorit)

**Estats possibles**:
- 🟡 **Pendent**: Esperant correcció
- 🟢 **Corregit**: Ja corregit
- 🟠 **Revisió OCR**: Necessita revisió manual del text extret
- 🔵 **Processant OCR**: OCR en curs

**Accions disponibles**:
- Veure imatge de l'examen
- Botó "Corregir" o "Veure Correcció"

## Característiques de Disseny

### Esquema de Colors per Nivells
- **A2**: Verd (#2ecc71) - Usuari Bàsic
- **B1**: Taronja (#f39c12) - Usuari Independent
- **B2**: Vermell (#e74c3c) - Usuari Independent Avançat

### Responsive Design
- **Desktop**: Layout de 3 columnes, gràfics amplis
- **Tablet**: Layout de 2 columnes
- **Mòbil**: Layout d'1 columna, components apilats

### Interactivitat
- Hover effects en targetes i botons
- Transicions suaus
- Loading states amb spinners
- Filtres dinàmics que actualitzen la vista

## Funcionalitats Futures

### Pestanya d'Alumnes
- Llista d'alumnes amb nivell assignat
- Historial de progressió
- Estadístiques individuals
- Assignació de nivells

### Pestanya d'Aprenentatge
- Perfil d'aprenentatge del professor
- Estadístiques de correcció
- Preferències detectades
- Evolució del model

### Funcionalitats Addicionals
- Exportació de dades
- Filtres avançats
- Cerques
- Notificacions en temps real
- Gràfics de tendències temporals

## API Endpoints Utilitzats

- `GET /api/dashboard` - Obtenir estadístiques del dashboard
- `GET /api/exam-submissions` - Llista d'exàmens pujats
  - Query params: `level`, `status`

## Estat Actual

✅ **Completat**:
- Estructura bàsica del dashboard
- Components d'estadístiques
- Gràfics per nivells
- Llista d'exàmens pendents
- Activitat recent
- Filtres per nivell

🚧 **En desenvolupament**:
- Gestió d'alumnes
- Dashboard d'aprenentatge
- Integració amb backend real
- Autenticació

📋 **Pendent**:
- Sistema de correcció amb OCR
- Aprenentatge personalitzat
- Notificacions
- Exportació de dades

