# Integración V3 - Solana + FactorBridge Agent

## Resumen

Este proyecto integra:
1. **Solana blockchain** para transacciones financieras (de V1)
2. **FactorBridge Agent** para análisis crediticio y validación de RUC
3. **PostgreSQL** para datos de negocio (contratos, ofertas, usuarios)

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐│
│  │ Marketplace │  │ Wallet UI   │  │ FactorBridge Agent  ││
│  │ (Contracts) │  │ (Solana)    │  │ Chatbot             ││
│  └─────────────┘  └─────────────┘  └──────────────────────┘│
│                                                               │
└───────┬──────────────────┬──────────────────┬───────────────┘
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ PostgreSQL   │  │ Solana       │  │ FactorBridge     │
│ (Drizzle)    │  │ Vault Program│  │ Agent API (GCP)  │
│              │  │ (devnet)     │  │                  │
│ - Contracts  │  │              │  │ - Validate RUC   │
│ - Offers     │  │ - Deposit    │  │ - Credit Score   │
│ - Users      │  │ - Withdraw   │  │ - Matching       │
│ - Wallets    │  │ - Escrow     │  │                  │
└──────────────┘  └──────────────┘  └──────────────────┘
```

## Componentes Integrados de V1

### 1. Configuración de Solana
**Ubicación:** `src/lib/solana/`

- `solana-client.ts` - Cliente Solana con soporte multi-cluster
- `cluster-context.tsx` - Context para manejar devnet/testnet/mainnet
- `solana-client-context.tsx` - Provider del cliente dinámico
- `explorer.ts` - Helper para enlaces a Solana Explorer

**Clusters soportados:**
- `devnet` - Para desarrollo y pruebas (default)
- `testnet` - Para pruebas pre-producción
- `mainnet` - Para producción
- `localnet` - Para desarrollo local con test-validator

### 2. Wallet Integration
**Ubicación:** `src/lib/solana/wallet/`

- `context.tsx` - Provider de wallet con auto-connect
- `standard.ts` - Integración con Wallet Standard
- `signer.ts` - Creación de signers para transacciones
- `types.ts` - Tipos TypeScript

**Wallets soportados:**
- Phantom
- Solflare
- Backpack
- Cualquier wallet compatible con Wallet Standard

### 3. UI Components
**Ubicación:** `src/ui/components/solana/`

- `cluster-select.tsx` - Selector de red (devnet/mainnet)
- `wallet-button.tsx` - Botón de conexión de wallet

### 4. Programa Anchor Vault
**Ubicación:** `anchor/programs/vault/`

**Programa ID:** `E2ktDEGKW32XkJ9RimNXapE4DKCPnwRnFc33MvrKnqmc`

**Instrucciones:**
- `deposit(amount)` - Depositar SOL al vault personal
- `withdraw()` - Retirar todo el SOL del vault

**Características:**
- Vault único por usuario (PDA derivado de la wallet)
- Protección contra doble depósito
- Validación de monto mínimo (rent-exempt)

## Integración del Agente

### API Endpoint
```
POST https://factor-bridge-agent-197950168142.us-central1.run.app/query
```

### Request Format
```typescript
{
  "message": "Valida el RUC 20512345678",
  "session_id": "user-xyz-1234567890",
  "user_id": "marketplace-user"
}
```

### Response Format
```typescript
{
  "response": "El RUC 20512345678 pertenece a...",
  "agent": "factor_bridge",
  "version": "0.1.0"
}
```

### Capacidades del Agente
1. **Validación de identidad:**
   - Validar DNI (8 dígitos)
   - Validar RUC (11 dígitos)
   - Consulta SUNAT/RENIEC

2. **Evaluación crediticia:**
   - Score crediticio (0-850)
   - Banda de riesgo (VERDE/AMARILLO/ROJO)
   - Detección de morosidad

3. **Matching:**
   - Emparejar facturas con factores
   - Calcular tasas estimadas

4. **Consultas de plataforma:**
   - Listar cedentes/factores
   - Registrar intenciones

## Flujo de Datos

### Caso de Uso: Usuario vende un contrato

1. **Autenticación** (Clerk)
   - Usuario hace sign in
   - Se crea registro en PostgreSQL

2. **Conexión de Wallet** (Solana)
   - Usuario conecta Phantom/Solflare
   - Se obtiene address y balance

3. **Publicación de Contrato** (PostgreSQL)
   - Usuario completa formulario en `/contracts/new`
   - Se guarda en tabla `contracts`
   - Estado inicial: `active`

4. **Validación con Agente** (Opcional)
   - Usuario pregunta en chatbot: "Valida RUC del deudor"
   - Chatbot llama API del agente
   - Agente valida contra SUNAT

5. **Recepción de Oferta** (PostgreSQL)
   - Comprador hace oferta
   - Se crea registro en tabla `offers`
   - Fondos van a `hold` en wallet PostgreSQL

6. **Aceptación y Settlement** (Solana + PostgreSQL)
   - Seller acepta oferta
   - Se ejecuta transferencia en Solana vault
   - Se actualiza estado en PostgreSQL
   - Fondos van a escrow hasta pago del gobierno

## Variables de Entorno

### Solana
```bash
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
NEXT_PUBLIC_PROGRAM_ID=E2ktDEGKW32XkJ9RimNXapE4DKCPnwRnFc33MvrKnqmc
```

### FactorBridge Agent
```bash
NEXT_PUBLIC_AGENT_API_URL=https://factor-bridge-agent-197950168142.us-central1.run.app/query
```

### Database
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/sentinel
```

### Auth & Payments
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
```

## Setup Rápido

### 1. Instalar dependencias
```bash
bun install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus claves
```

### 3. Inicializar base de datos
```bash
bun db:push
bun db:seed
```

### 4. Compilar programa Anchor (opcional)
```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet
```

### 5. Ejecutar desarrollo
```bash
bun dev
```

## Testing en Devnet

### 1. Conectar wallet a Devnet
- En el header, seleccionar "devnet" en el cluster selector
- Conectar wallet (Phantom/Solflare)
- Asegurarse de que la wallet esté en Devnet

### 2. Obtener SOL de prueba
- Ir a https://faucet.solana.com/
- Pegar tu address
- Solicitar 2 SOL

### 3. Probar depósito en Vault
```typescript
// En consola del navegador
const amount = 0.5 * 1_000_000_000; // 0.5 SOL
await deposit(amount);
```

### 4. Probar agente
- Ir a `/marketplace`
- Abrir chatbot
- Escribir: "Valida el RUC 20512345678"
- Ver respuesta del agente

## Próximos Pasos

### Conectar transacciones del marketplace con Solana
Actualmente las transacciones usan:
- PostgreSQL para tracking
- Stripe para pagos fiat

**Objetivo:** Integrar Solana vault para:
1. Depositar fondos en SOL
2. Escrow automático en offers
3. Settlement on-chain cuando gobierno paga

### Implementar
1. Hook `useVaultDeposit()` en dashboard/wallet
2. Actualizar offer flow para transferir a escrow PDA
3. Agregar settlement instruction cuando se confirma pago

## Estructura de Archivos Clave

```
src/
├── lib/
│   └── solana/
│       ├── cluster-context.tsx          # Context de red
│       ├── solana-client.ts             # Cliente Solana
│       ├── solana-client-context.tsx    # Provider
│       ├── explorer.ts                  # Helper explorer
│       ├── lamports.ts                  # Conversiones SOL
│       ├── providers.tsx                # Providers wrapper
│       ├── hooks/
│       │   └── use-balance.ts           # Hook balance
│       └── wallet/
│           ├── context.tsx              # Wallet provider
│           ├── standard.ts              # Wallet standard
│           ├── signer.ts                # Transaction signer
│           └── types.ts                 # Types
├── ui/components/
│   ├── solana/
│   │   ├── cluster-select.tsx           # Network selector
│   │   └── wallet-button.tsx            # Wallet connect button
│   └── marketplace/
│       └── chatbot.tsx                  # Agente integrado
├── app/
│   ├── layout.tsx                       # Root layout con providers
│   └── (main)/
│       └── marketplace/page.tsx         # Con chatbot
└── anchor/
    └── programs/vault/
        └── src/lib.rs                   # Programa Solana
```

## Recursos

- [Solana Devnet Explorer](https://explorer.solana.com/?cluster=devnet)
- [Solana Faucet](https://faucet.solana.com/)
- [FactorBridge Agent Docs](../factor_bridge/docs/)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Kit Docs](https://solana.com/docs)

## Troubleshooting

### Error: "Wallet not connected"
- Verificar que la wallet esté en la red correcta (devnet)
- Refrescar la página
- Reconectar la wallet

### Error: "Insufficient funds"
- Obtener SOL del faucet
- Verificar balance en el wallet button

### Error: "Agent API timeout"
- Verificar que el endpoint esté accesible
- Revisar console del navegador para errores CORS
- El agente puede tardar 5-10s en responder la primera vez

### Error: "Program not found"
- Verificar que el PROGRAM_ID sea correcto
- Asegurarse de estar en devnet
- Redesplegar el programa si es necesario

## Contacto

Para soporte técnico o preguntas:
- Revisar issues en GitHub
- Consultar documentación del agente en `factor_bridge/docs/`
