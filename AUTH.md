# Sistema d'Autenticació

Sistema d'autenticació implementat amb NextAuth.js per protegir l'accés només als professors.

## Credencials per Defecte

Per començar, hi ha un usuari de prova configurat:

- **Email**: `professor@wordschool.com`
- **Contrasenya**: `professor123`

⚠️ **Important**: Aquestes credencials són només per desenvolupament. En producció, hauràs de:
1. Connectar a una base de dades
2. Hashear les contrasenyes
3. Implementar gestió d'usuaris

## Configuració

### Variables d'Entorn

Afegeix al teu `.env.local` (desenvolupament) o a Vercel (producció):

```env
NEXTAUTH_SECRET=genera-un-secret-aleatori-aqui
NEXTAUTH_URL=http://localhost:3000  # En producció, posa la URL de Vercel
```

### Generar NEXTAUTH_SECRET

Per generar un secret segur:

```bash
openssl rand -base64 32
```

O utilitza qualsevol generador de secrets aleatoris.

## Funcionament

1. **Middleware**: Protegeix totes les rutes excepte `/login` i `/api/auth`
2. **Pàgina de Login**: `/login` - Interfície d'inici de sessió
3. **Sessió**: Utilitza JWT per gestionar les sessions
4. **Logout**: Disponible al menú d'usuari al header

## Afegir Més Usuaris

Per afegir més professors, edita `src/app/api/auth/[...nextauth]/route.ts` i afegeix més entrades a l'array `USERS`:

```typescript
const USERS = [
  {
    id: '1',
    email: 'professor@wordschool.com',
    password: 'professor123',
    name: 'Professor Principal',
    role: 'teacher',
  },
  {
    id: '2',
    email: 'nou.professor@wordschool.com',
    password: 'nova_contrasenya',
    name: 'Nou Professor',
    role: 'teacher',
  },
];
```

## Pròxims Passos

- [ ] Connectar a base de dades (PostgreSQL, MongoDB, etc.)
- [ ] Implementar hash de contrasenyes (bcrypt)
- [ ] Afegir gestió d'usuaris (crear, editar, eliminar)
- [ ] Implementar recuperació de contrasenya
- [ ] Afegir autenticació de dos factors (2FA)
- [ ] Implementar rols i permisos més detallats

## Seguretat

⚠️ **Recorda**:
- Mai pugis les contrasenyes en text pla al codi
- Utilitza sempre HTTPS en producció
- Genera un `NEXTAUTH_SECRET` únic i segur
- Hashea les contrasenyes abans de guardar-les a la base de dades

