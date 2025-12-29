# Funcionalitat de Pujada d'Exàmens

## Descripció

Sistema complet per pujar examens com a arxius d'imatge (JPG, JPEG, PNG) amb validació, drag & drop, i processament automàtic.

## Components Creats

### 1. `ExamUpload.tsx`
Component principal de pujada amb les següents característiques:

- **Drag & Drop**: Arrossega i deixa anar fitxers directament
- **Selecció de Fitxer**: Clic per seleccionar des del sistema
- **Validació en Temps Real**:
  - Tipus de fitxer (només JPG, JPEG, PNG)
  - Mida màxima (10MB)
- **Barra de Progrés**: Mostra el progrés de la pujada
- **Missatges d'Estat**: Èxit, error, i informació
- **Instruccions**: Guia visual per obtenir millors resultats d'OCR

### 2. Pàgina `/upload`
Pàgina dedicada per pujar examens amb:
- Filtre de nivell (opcional)
- Interfície neta i intuïtiva
- Redirecció automàtica després de pujar

### 3. API Route `/api/exam-submissions/upload`
Endpoint que gestiona:
- Recepció del fitxer
- Validació de tipus i mida
- Emmagatzematge al servidor
- Generació de nom únic
- Preparació per processament OCR

## Característiques

### Validacions Implementades

✅ **Tipus de Fitxer**:
- Només accepta: `image/jpeg`, `image/jpg`, `image/png`
- Rebutja altres tipus amb missatge d'error clar

✅ **Mida Màxima**:
- Límit: 10MB per fitxer
- Validació tant a client com a servidor

✅ **Seguretat**:
- Noms de fitxer únics (timestamp + random)
- Emmagatzematge a directori segur
- Validació de permisos

### Interfície d'Usuari

- **Zona de Drag & Drop** amb feedback visual
- **Vista prèvia** del fitxer seleccionat
- **Barra de progrés** durant la pujada
- **Missatges clars** d'èxit i error
- **Instruccions** per millorar qualitat OCR

## Estructura de Fitxers

```
public/
└── uploads/
    └── exams/
        └── .gitkeep  # Directori creat, però no es pugen les imatges
```

**Nota**: Les imatges pujades NO es pugen a GitHub (estan a `.gitignore`)

## Flux de Treball

1. **Usuari selecciona/puja fitxer**
   ↓
2. **Validació a client (tipus i mida)**
   ↓
3. **Pujada al servidor amb progrés**
   ↓
4. **Validació a servidor**
   ↓
5. **Emmagatzematge amb nom únic**
   ↓
6. **Resposta amb submissionId i URL**
   ↓
7. **TODO: Processament OCR asíncron** (quan s'implementi)

## Integració al Dashboard

El dashboard inclou un botó "Pujar Examen" al header que enllaça a `/upload`.

## Ús

### Des del Dashboard
1. Clic a "Pujar Examen" al header
2. Selecciona o arrossega el fitxer
3. Opcional: Selecciona nivell d'examen
4. Clic a "Pujar Examen"
5. Espera a que es processi

### Des de la Pàgina de Pujada
1. Navega a `/upload`
2. Selecciona nivell (opcional)
3. Puja el fitxer
4. Redirecció automàtica al dashboard

## Configuració

### Variables d'Entorn
No calen variables d'entorn especials per la pujada bàsica. Per al processament OCR, es necessitarà:
- `OPENAI_API_KEY` (quan s'implementi OCR amb LLM)

### Next.js Config
El `next.config.js` inclou:
```js
experimental: {
  serverActions: {
    bodySizeLimit: '10mb',
  },
}
```

## Pròxims Passos

- [ ] Integrar processament OCR real
- [ ] Afegir compressió d'imatges abans de guardar
- [ ] Implementar pujada múltiple
- [ ] Afegir vista prèvia de la imatge abans de pujar
- [ ] Integrar amb base de dades per guardar metadades
- [ ] Afegir notificacions quan l'OCR estigui complet

## Troubleshooting

### Error: "Tipus de fitxer no permès"
- Assegura't que el fitxer és JPG, JPEG o PNG
- Verifica l'extensió del fitxer

### Error: "El fitxer és massa gran"
- Redueix la mida de la imatge
- Utilitza un compressor d'imatges
- Màxim: 10MB

### Error: "No s'ha pujat cap fitxer"
- Assegura't que has seleccionat un fitxer
- Torna a intentar la pujada

### El fitxer es puja però no es veu
- Verifica que el directori `public/uploads/exams` existeix
- Comprova els permisos del directori
- Revisa els logs del servidor

