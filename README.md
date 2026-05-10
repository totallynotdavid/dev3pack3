# Sentinel V3 - Government Contract Factoring Marketplace

Sistema completo de factoraje de contratos gubernamentales con integración de **Solana blockchain** y **FactorBridge AI Agent**.

## 🎯 Características Principales

### Marketplace de Factoring

- ✅ Publicación de contratos gubernamentales
- ✅ Sistema de ofertas y contraofertas
- ✅ Negociación con deadline de 7 días
- ✅ Escrow de fondos (PostgreSQL + preparado para Solana)
- ✅ Risk grading automático (Low/Medium/High)
- ✅ Dashboard de usuario con historial

### Integración Solana

- ✅ Multi-cluster support (devnet/testnet/mainnet/localnet)
- ✅ Wallet connection (Phantom, Solflare, Backpack)
- ✅ Balance en tiempo real con WebSocket
- ✅ Programa Anchor Vault para escrow
- ✅ Airdrop integrado para testing en devnet
- ✅ UI completa de administración de vault

### FactorBridge AI Agent

- ✅ Validación de RUC/DNI (SUNAT/RENIEC)
- ✅ Credit scoring (0-850)
- ✅ Banda de riesgo (VERDE/AMARILLO/ROJO)
- ✅ Matching de facturas con factores
- ✅ Chatbot en español integrado en marketplace

## 🚀 Quick Start

### 1. Requisitos

- Node.js 18+ o Bun
- PostgreSQL o cuenta de Supabase
- Cuenta de Clerk (auth)
- Cuenta de Stripe (pagos fiat)
- Wallet de Solana (Phantom/Solflare)

### 2. Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd dev3pack3

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves

# Inicializar base de datos
bun db:push
bun db:seed

# Ejecutar en desarrollo
bun dev
```

### 3. Configuración de Variables de Entorno

```bash
# Database
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Solana
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
NEXT_PUBLIC_PROGRAM_ID=E2ktDEGKW32XkJ9RimNXapE4DKCPnwRnFc33MvrKnqmc

# FactorBridge Agent
NEXT_PUBLIC_AGENT_API_URL=https://factor-bridge-agent-197950168142.us-central1.run.app/query
```

## 📱 Funcionalidades por Pantalla

### `/marketplace`

- Listado de contratos activos
- Filtros por riesgo y monto
- Chatbot FactorBridge AI
- Selector de red Solana (devnet/mainnet)
- Wallet connection

### `/contracts/new`

- Formulario de publicación de contratos
- Upload de documentos (Vercel Blob)
- Validación de campos
- Preview antes de publicar

### `/marketplace/[id]`

- Detalles del contrato
- Panel de ofertas
- Formulario para hacer oferta
- Historial de negociación

### `/dashboard`

- Resumen de contratos propios
- Resumen de ofertas realizadas
- Estadísticas de actividad

### `/dashboard/wallet`

- **Balance Fiat** (Stripe)
  - Depósito con tarjeta
  - Historial de transacciones

- **Balance Solana**
  - Wallet address y balance en SOL
  - Airdrop para testing (devnet)
  - Deposit to Vault (próximamente)
  - Withdraw from Vault (próximamente)
  - Selector de cluster
  - Link a explorer

### `/dashboard/contracts/[id]`

- Gestión de contrato propio
- Ver todas las ofertas recibidas
- Aceptar/Rechazar/Contrariar ofertas
- Cancelar contrato

## 🔗 Integración Solana

### Wallet Connection

El sistema detecta automáticamente las wallets instaladas:

```tsx
// Conectar wallet
<WalletButton />;

// Usar en componentes
const { wallet, status, connect, disconnect } = useWallet();
const balance = useBalance(wallet?.account.address);
```

### Cluster Selection

```tsx
const { cluster, setCluster } = useCluster();

// Cambiar entre devnet/mainnet/testnet/localnet
setCluster("devnet");
```

### Airdrop (Solo Devnet/Testnet)

```tsx
const { requestAirdrop, isAirdropping } = useAirdrop();

// Solicitar 1 SOL
await requestAirdrop(address, 1_000_000_000n);
```

### Vault Operations (En Desarrollo)

```tsx
const { deposit, isDepositing } = useVaultDeposit();
const { withdraw, isWithdrawing } = useVaultWithdraw();

// Depositar 0.5 SOL al vault
await deposit(500_000_000n);

// Retirar todo del vault
await withdraw();
```

## 🤖 Integración FactorBridge Agent

### API Endpoint

```typescript
POST https://factor-bridge-agent-197950168142.us-central1.run.app/query

{
  "message": "Valida el RUC 20512345678",
  "session_id": "user-123-1234567890",
  "user_id": "marketplace-user"
}
```

### Uso en Chatbot

El chatbot está preintegrado en `/marketplace`:

```tsx
// Preguntas rápidas disponibles:
-"¿Qué contratos de bajo riesgo hay?" -
  "Evalúa el RUC 20512345678" -
  "¿Cómo funciona el factoraje?";
```

### Capacidades del Agente

1. **Validación de Identidad**
   - DNI (8 dígitos)
   - RUC (11 dígitos)
   - Consulta SUNAT/RENIEC

2. **Evaluación Crediticia**
   - Score 0-850
   - Banda de riesgo
   - Detección de morosidad
   - Lista negra SBS

3. **Matching**
   - Emparejar facturas con factores
   - Calcular tasas estimadas
   - Recomendar mejores opciones

4. **Consultas de Plataforma**
   - Listar cedentes disponibles
   - Listar factores activos
   - Registrar intenciones

## 🗄️ Estructura de Base de Datos

### Tablas del Marketplace

```sql
-- Usuarios (Clerk ID)
users {
  id: text (clerk_id)
  fullName: text
  email: text
  walletBalance: bigint (centavos)
  createdAt: timestamp
}

-- Contratos
contracts {
  id: uuid
  sellerId: text -> users.id
  debtorName: text
  faceValue: bigint (centavos)
  currency: varchar(3)
  dueDate: date
  documentUrl: text
  riskCategory: low|medium|high
  status: active|under_negotiation|sold|expired|cancelled
  createdAt: timestamp
}

-- Ofertas
offers {
  id: uuid
  contractId: uuid -> contracts.id
  buyerId: text -> users.id
  amount: bigint
  counterAmount: bigint
  status: pending|countered|accepted|rejected|expired|withdrawn
  expiresAt: timestamp
}

-- Transacciones
wallet_transactions {
  id: uuid
  userId: text -> users.id
  amount: bigint
  type: deposit|hold|release|settle|withdraw
  offerId: uuid -> offers.id
  stripePaymentIntentId: text
  createdAt: timestamp
}
```

### Tablas del Agente

```sql
-- Documentos validados
documentos {
  id: uuid
  tipoDocumento: dni|ruc
  numero: varchar(20)
  nombre: text
  estado: varchar(50)
  condicion: varchar(50)
  fuenteValidacion: varchar(50)
}

-- Credit scores
credit_scores {
  id: uuid
  documento: varchar(20)
  score: integer (0-850)
  bandaRiesgo: VERDE|AMARILLO|ROJO
  morosidadActiva: boolean
  listaNegraSBS: boolean
  sunatNoHabido: boolean
  detalleRiesgos: jsonb
}

-- Cedentes (vendedores de facturas)
cedentes {
  id: uuid
  ruc: varchar(11)
  razonSocial: text
  sector: varchar(100)
  facturasPendientes: integer
  montoPromedio: bigint
  scorePromedio: integer
}

-- Factores (compradores de facturas)
factores {
  id: uuid
  ruc: varchar(11)
  razonSocial: text
  apetitoRiesgo: conservador|moderado|agresivo
  sectoresPreferidos: jsonb
  montoMinimoInversion: bigint
  montoMaximoInversion: bigint
  plazosPreferidos: jsonb
}

-- Intenciones (matching)
intenciones {
  id: uuid
  actorRole: cedente|factor
  actorDocument: varchar(20)
  payload: jsonb
  estado: pendiente|procesada|cancelada
}
```

## 🧪 Testing

### Testing en Devnet

1. **Configurar Wallet**
   - Instalar Phantom: https://phantom.app/
   - Cambiar a Devnet en settings
   - Conectar en la app

2. **Obtener SOL de prueba**
   - Método 1: Click "Request 1 SOL Airdrop" en wallet dropdown
   - Método 2: Click botón en `/dashboard/wallet`
   - Método 3: https://faucet.solana.com/

3. **Probar Chatbot**
   - Ir a `/marketplace`
   - Escribir: "Valida el RUC 20512345678"
   - Ver respuesta del agente real

4. **Crear Contrato**
   - Ir a `/contracts/new`
   - Llenar formulario
   - Publicar contrato
   - Ver en marketplace

5. **Hacer Oferta**
   - Conectar con otra cuenta Clerk
   - Ver contrato en `/marketplace/[id]`
   - Hacer oferta
   - Negociar

## 📚 Stack Tecnológico

```
Frontend:
- Next.js 16.2.4 (App Router)
- React 19
- TypeScript 5.3
- Tailwind CSS 3.4

Backend:
- Next.js API Routes
- Drizzle ORM
- PostgreSQL (Supabase)

Blockchain:
- Solana Web3.js
- @solana/kit 6.3.0
- Anchor 0.32.1
- Wallet Standard

Auth & Payments:
- Clerk 7.2.2
- Stripe

AI/ML:
- FactorBridge Agent (FastAPI)
- Qwen 2.5 7B (HuggingFace)
- Supabase PostgreSQL

UI/UX:
- Radix UI
- Iconify
- Sonner (Toasts)
```

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐│
│  │Marketplace│ │Dashboard │  │Contracts │  │Wallet        ││
│  │          │  │          │  │          │  │              ││
│  │- List    │  │- My      │  │- New     │  │- Fiat (Stripe)││
│  │- Detail  │  │Contracts │  │- Detail  │  │- SOL (Solana)││
│  │- Chatbot │  │- My      │  │- Offers  │  │- Vault       ││
│  │          │  │Offers    │  │          │  │              ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘│
│                                                               │
└─────┬──────────────┬────────────────┬─────────────┬─────────┘
      │              │                │             │
      ▼              ▼                ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐
│PostgreSQL│  │  Clerk   │  │   Stripe     │  │ Solana   │
│(Supabase)│  │  Auth    │  │   Payments   │  │ Devnet   │
│          │  │          │  │              │  │          │
│- users   │  │- Sign In │  │- Deposits    │  │- Wallet  │
│- contracts│ │- Sign Up │  │- Webhooks    │  │- Vault   │
│- offers  │  │- Session │  │              │  │- Airdrop │
│- txs     │  │          │  │              │  │          │
│          │  │          │  │              │  │          │
│- agent   │  │          │  │              │  │          │
│  tables  │  │          │  │              │  │          │
└──────────┘  └──────────┘  └──────────────┘  └─────┬────┘
                                                     │
                                                     ▼
                                            ┌────────────────┐
                                            │ Anchor Program │
                                            │    (Vault)     │
                                            │                │
                                            │- deposit()     │
                                            │- withdraw()    │
                                            └────────────────┘

                ┌─────────────────────────────────────┐
                │   FactorBridge Agent (GCP)          │
                ├─────────────────────────────────────┤
                │                                     │
                │  - Validate RUC/DNI                 │
                │  - Credit Scoring                   │
                │  - Invoice Matching                 │
                │  - Platform Queries                 │
                │                                     │
                │  API: POST /query                   │
                └─────────────────────────────────────┘
```

## 📖 Documentación Adicional

- [INTEGRACION.md](./INTEGRACION.md) - Guía completa de integración
- [anchor/programs/vault/](./anchor/programs/vault/) - Programa Solana Vault
- [FactorBridge Agent Docs](../factor_bridge/docs/) - Documentación del agente

## 🔐 Seguridad

- ✅ Autenticación con Clerk (OAuth)
- ✅ HTTPS en producción
- ✅ Validación de inputs
- ✅ SQL injection protection (Drizzle ORM)
- ✅ XSS protection (React)
- ✅ CORS configurado
- ✅ Rate limiting en API
- ⚠️ Vault en desarrollo (auditoría pendiente)

## 🚦 Estado del Proyecto

```
✅ Completado:
- Marketplace de contratos
- Sistema de ofertas/negociación
- Wallet fiat (Stripe)
- Integración Solana (wallet, cluster, balance)
- Chatbot con FactorBridge Agent
- Dashboard completo
- Airdrop en devnet
- UI de vault

🚧 En Desarrollo:
- Vault deposit/withdraw (instrucciones Anchor)
- Settlement on-chain automático
- Integración completa escrow Solana

📋 Roadmap:
- Desplegar programa Anchor a devnet
- Generar IDL y tipos TypeScript
- Conectar offers con vault PDAs
- Sistema de ratings
- Notificaciones en tiempo real
- Mobile app (React Native)
```

## 🤝 Contribuir

Este es un proyecto privado. Para acceso, contactar al equipo.

## 📄 Licencia

Propietario - Todos los derechos reservados

## 📞 Soporte

Para soporte técnico:

- Email: support@sentinel.com
- Discord: [Sentinel Community](#)
- GitHub Issues: [Ver Issues](#)

---

**Sentinel V3** - Better business decisions, settled in minutes. 🚀
