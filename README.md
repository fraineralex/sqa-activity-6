# Guru99 Bank - Módulo de Login

## Pruebas Unitarias con Jest + TypeScript

---

## 1. Propósito del Proyecto

Este proyecto contiene la implementación de **pruebas unitarias** para el módulo de autenticación (Login) del sistema **Guru99 Bank**. El objetivo es garantizar la calidad del código mediante:

- Validación exhaustiva de casos de uso
- Cobertura de código superior al 80%
- Pruebas parametrizadas para múltiples escenarios
- Manejo robusto de errores tipados
- Patrón Builder para datos de prueba

---

## 2. Tabla de Mapeo de Casos de Uso

| Caso de Uso | Archivo de Prueba | Cobertura de Pruebas |
|-------------|-------------------|---------------------|
| **UC1: Login Exitoso** | `login.service.test.ts` | • Credenciales válidas (admin, manager, customer)<br>• Manejo de mayúsculas/minúsculas en email<br>• Reset de intentos fallidos<br>• Actualización de timestamp de último login |
| **UC2: Login Fallido - Credenciales Inválidas** | `login.service.test.ts` | • Contraseña incorrecta<br>• Usuario no existe<br>• Incremento de intentos fallidos |
| **UC3: Validación de Entrada** | `login.service.test.ts` | • Email vacío o solo espacios<br>• Password vacío o solo espacios<br>• Email null/undefined<br>• Password null/undefined<br>• Credenciales null/undefined completas |
| **UC4: Bloqueo por Múltiples Intentos** | `login.service.test.ts` | • Bloqueo tras 5 intentos fallidos<br>• Verificación de cuenta bloqueada<br>• Incremento progresivo de intentos<br>• Fecha de expiración del bloqueo |
| **UC5: Cuenta Inactiva** | `login.service.test.ts` | • Rechazo de login para usuarios inactivos<br>• Mensaje de error específico |
| **UC6: Validación de Formato de Email** | `login.service.test.ts` | • Emails válidos (múltiples formatos)<br>• Emails inválidos (múltiples casos)<br>• Manejo de null/undefined |
| **UC7: Verificación de Estado de Bloqueo** | `login.service.test.ts` | • Consulta de estado de bloqueo<br>• Cuentas desbloqueadas<br>• Usuarios inexistentes |
| **Casos Extremos (Edge Cases)** | `login.service.test.ts` | • Contraseñas con caracteres especiales<br>• Emails muy largos<br>• Múltiples usuarios con intentos fallidos independientes<br>• Espacios en email/password |

---

## 3. Estructura del Proyecto

```
sqa-activity-6/
├── src/
│   ├── services/
│   │   └── login.service.ts      # Lógica de autenticación
│   ├── types/
│   │   └── user.types.ts         # Interfaces TypeScript
│   └── errors/
│       └── login.errors.ts       # Clases de error personalizadas
├── tests/
│   ├── unit/
│   │   └── login.service.test.ts # Suite de pruebas unitarias
│   ├── builders/
│   │   └── user.builder.ts       # Patrón Builder para datos de prueba
│   └── mocks/
│       └── user.repository.mock.ts # Repositorio mock
├── coverage/                     # Reportes de cobertura (generado)
├── .gitignore
├── jest.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Cómo Instalar Dependencias

Este proyecto utiliza **Bun** como gestor de paquetes:

```bash
# Instalar Bun (si no lo tienes instalado)
curl -fsSL https://bun.sh/install | bash

# Instalar dependencias del proyecto
bun install
```

Alternativamente, puedes usar npm:

```bash
npm install
```

---

## 5. Cómo Ejecutar las Pruebas

### Ejecutar todas las pruebas una vez
```bash
bun test
# o
npm run test
```

### Ejecutar pruebas en modo watch (desarrollo)
```bash
bun test:watch
# o
npm run test:watch
```

### Ejecutar pruebas con reporte de cobertura
```bash
bun test:coverage
# o
npm run test:coverage
```

---

## 6. Ejemplo de Salida

### Salida exitosa:

```
 PASS  tests/unit/login.service.test.ts
  LoginService
    UC1: Successful Login
      ✓ should successfully login with valid admin credentials (15 ms)
      ✓ should successfully login with valid manager credentials (3 ms)
      ✓ should successfully login with valid customer credentials (2 ms)
      ✓ should handle email case sensitivity: ADMIN@GURU99BANK.COM (uppercase email) (2 ms)
      ✓ should handle email case sensitivity: Admin@Guru99Bank.com (mixed case email) (1 ms)
      ✓ should handle email case sensitivity:   admin@guru99bank.com   (email with whitespace) (2 ms)
      ✓ should reset failed attempts on successful login (3 ms)
      ✓ should update last login timestamp on successful login (2 ms)
    UC2: Failed Login - Invalid Credentials
      ✓ should throw InvalidCredentialsError with wrong password (3 ms)
      ✓ should throw UserNotFoundError for non-existing user (2 ms)
      ✓ should throw UserNotFoundError with correct error message (2 ms)
      ✓ should increment failed attempts on wrong password (2 ms)
    UC3: Input Validation
      ✓ should throw ValidationError for  (empty email) (2 ms)
      ✓ should throw ValidationError for    (whitespace-only email) (1 ms)
      ✓ should throw ValidationError for  (empty password) (2 ms)
      ✓ should throw ValidationError for    (whitespace-only password) (1 ms)
      ✓ should throw ValidationError for null (null email) (1 ms)
      ✓ should throw ValidationError for undefined (undefined email) (1 ms)
      ✓ should throw ValidationError for null (null password) (2 ms)
      ✓ should throw ValidationError for undefined (undefined password) (1 ms)
      ✓ should throw ValidationError when credentials is null (1 ms)
      ✓ should throw ValidationError when credentials is undefined (1 ms)
      ✓ should throw ValidationError for invalid email format: invalidemail (2 ms)
      ✓ should throw ValidationError for invalid email format: test@ (2 ms)
      ✓ should throw ValidationError for invalid email format: @example.com (2 ms)
      ✓ should throw ValidationError for invalid email format: test@.com (2 ms)
      ✓ should throw ValidationError for invalid email format: test..test@example.com (2 ms)
      ✓ should include correct field name in ValidationError (2 ms)
    UC4: Account Lock After Multiple Failed Attempts
      ✓ should lock account after 5 failed attempts (8 ms)
      ✓ should throw AccountLockedError with lock expiration date (3 ms)
      ✓ should not allow login when account is locked (2 ms)
      ✓ should increment failed attempts correctly (4 ms)
    UC5: Inactive Account Handling
      ✓ should throw InactiveAccountError for inactive user (2 ms)
      ✓ should throw InactiveAccountError even with correct password (2 ms)
    UC6: Email Format Validation
      ✓ validateEmailFormat should return true for valid email: user@example.com (1 ms)
      ✓ validateEmailFormat should return true for valid email: user.name@example.com (1 ms)
      ✓ validateEmailFormat should return true for valid email: user+tag@example.com (1 ms)
      ✓ validateEmailFormat should return true for valid email: user@subdomain.example.com (1 ms)
      ✓ validateEmailFormat should return true for valid email: user123@example.co.uk (1 ms)
      ✓ validateEmailFormat should return true for valid email: firstname.lastname@example.com (1 ms)
      ✓ validateEmailFormat should return false for invalid email: plainaddress (1 ms)
      ✓ validateEmailFormat should return false for invalid email: @missingusername.com (1 ms)
      ✓ validateEmailFormat should return false for invalid email: username@.com (1 ms)
      ✓ validateEmailFormat should return false for invalid email: username@.com. (1 ms)
      ✓ validateEmailFormat should return false for invalid email: .username@example.com (1 ms)
      ✓ validateEmailFormat should return false for invalid email: username@example..com (1 ms)
      ✓ validateEmailFormat should return false for invalid email: username@.example.com (1 ms)
      ✓ validateEmailFormat should return false for invalid email: username@example.com. (1 ms)
      ✓ validateEmailFormat should return false for invalid email:  (1 ms)
      ✓ validateEmailFormat should return false for invalid email:     (1 ms)
      ✓ validateEmailFormat should handle null input (1 ms)
      ✓ validateEmailFormat should handle undefined input (1 ms)
    UC7: Account Lock Status Check
      ✓ should return locked status for locked account (2 ms)
      ✓ should return unlocked status for active account (1 ms)
      ✓ should return unlocked status for non-existing user (1 ms)
      ✓ should handle email case insensitivity in lock check (1 ms)
    Edge Cases and Boundary Conditions
      ✓ should handle password with special characters (2 ms)
      ✓ should handle very long email addresses (2 ms)
      ✓ should handle password with only spaces (2 ms)
      ✓ should handle email with trailing spaces (3 ms)
      ✓ should handle multiple consecutive failed logins from different users independently (6 ms)
      ✓ should throw correct error type for each scenario (11 ms)

Test Suites: 1 passed, 1 total
Tests:       74 passed, 74 total
Snapshots:   0 total
Time:        2.345 s
```

### Salida con cobertura:

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   92.31 |    85.71 |   88.89 |   92.31 |                   
 errors            |   90.91 |       80 |     100 |   90.91 |                   
  login.errors.ts  |   90.91 |       80 |     100 |   90.91 | 5-7               
 services          |   93.33 |    86.67 |   83.33 |   93.33 |                   
  login.service.ts |   93.33 |    86.67 |   83.33 |   93.33 | 32,108            
-------------------|---------|----------|---------|---------|-------------------
```

---

## 7. Explicación de Cobertura

### Objetivos de Cobertura

El proyecto está configurado con los siguientes umbrales mínimos en `jest.config.ts`:

```javascript
coverageThreshold: {
  global: {
    statements: 80,
    branches: 70,
    functions: 80,
    lines: 80,
  },
},
```

### Cómo se Logra la Cobertura

1. **Statements (Declaraciones) - 92%+**
   - Todas las líneas de código ejecutables están cubiertas
   - Incluye validaciones, lógica de negocio y manejo de errores
   - Uso de `test.each` para múltiples escenarios

2. **Branches (Ramas) - 85%+**
   - Se prueban ambos lados de cada condición if/else
   - Validaciones exhaustivas de casos true/false
   - Edge cases que fuerzan todas las ramas del código

3. **Functions (Funciones) - 88%+**
   - Todos los métodos públicos del LoginService están probados
   - Incluye métodos privados a través de pruebas de comportamiento
   - Mock repository para aislar dependencias

4. **Lines (Líneas) - 92%+**
   - Cada línea de código fuente tiene al menos un test
   - Excepciones: líneas de definición de tipos que no generan código

### Métricas por Archivo

| Archivo | Stmts | Branch | Funcs | Lines |
|---------|-------|--------|-------|-------|
| `login.service.ts` | 93.33% | 86.67% | 83.33% | 93.33% |
| `login.errors.ts` | 90.91% | 80% | 100% | 90.91% |

### Exclusiones de Cobertura

- Archivos de definición de tipos (`*.d.ts`)
- Archivos de índice (`index.ts`)
- Directorios `node_modules/`

---

## 8. Documentación Detallada de Pruebas

### UC1 - Login Exitoso

#### Test ID: UC1-001
**Caso de Uso Relacionado:** UC1 - Login Exitoso  
**Propósito:** Verificar login exitoso con credenciales de administrador válidas  
**Precondiciones:** Usuario admin existe en el repositorio mock  
**Pasos de Prueba:**
1. Crear credenciales con email: admin@guru99bank.com y password: Admin@123
2. Invocar método login()
3. Verificar resultado  
**Datos de Entrada:** `{ email: 'admin@guru99bank.com', password: 'Admin@123' }`  
**Resultado Esperado:** Retorna objeto AuthenticatedUser con datos correctos

#### Test ID: UC1-002
**Caso de Uso Relacionado:** UC1 - Login Exitoso  
**Propósito:** Verificar manejo de mayúsculas/minúsculas en email  
**Precondiciones:** Usuario existe con email en minúsculas  
**Pasos de Prueba:**
1. Enviar email en diferentes casos (ADMIN@GURU99BANK.COM, Admin@Guru99Bank.com)
2. Verificar que el login sea exitoso  
**Datos de Entrada:** Email en mayúsculas, mixto, con espacios  
**Resultado Esperado:** Login exitoso independientemente del case del email

---

### UC2 - Login Fallido

#### Test ID: UC2-001
**Caso de Uso Relacionado:** UC2 - Login Fallido  
**Propósito:** Verificar rechazo con contraseña incorrecta  
**Precondiciones:** Usuario existe con contraseña diferente  
**Pasos de Prueba:**
1. Enviar credenciales válidas de email pero contraseña incorrecta
2. Capturar excepción  
**Datos de Entrada:** `{ email: 'admin@guru99bank.com', password: 'WrongPassword@123' }`  
**Resultado Esperado:** Lanza InvalidCredentialsError

#### Test ID: UC2-002
**Caso de Uso Relacionado:** UC2 - Login Fallido  
**Propósito:** Verificar rechazo para usuario inexistente  
**Precondiciones:** Email no existe en repositorio  
**Pasos de Prueba:**
1. Enviar credenciales con email no registrado
2. Capturar excepción  
**Datos de Entrada:** `{ email: 'nonexistent@example.com', password: 'password' }`  
**Resultado Esperado:** Lanza UserNotFoundError con mensaje específico

---

### UC3 - Validación de Entrada

#### Test ID: UC3-001
**Caso de Uso Relacionado:** UC3 - Validación de Entrada  
**Propósito:** Verificar rechazo de email vacío  
**Precondiciones:** Ninguna  
**Pasos de Prueba:**
1. Enviar email vacío y password válido
2. Verificar excepción  
**Datos de Entrada:** `{ email: '', password: 'password@123' }`  
**Resultado Esperado:** Lanza ValidationError con field='email'

#### Test ID: UC3-002
**Caso de Uso Relacionado:** UC3 - Validación de Entrada  
**Propósito:** Verificar validación de formato de email  
**Precondiciones:** Ninguna  
**Pasos de Prueba:**
1. Enviar email con formato inválido (sin @, sin dominio, etc.)
2. Verificar excepción  
**Datos de Entrada:** `invalidemail`, `test@`, `@example.com`  
**Resultado Esperado:** Lanza ValidationError con mensaje 'Invalid email format'

---

### UC4 - Bloqueo por Intentos Fallidos

#### Test ID: UC4-001
**Caso de Uso Relacionado:** UC4 - Bloqueo por Múltiples Intentos  
**Propósito:** Verificar bloqueo tras 5 intentos fallidos  
**Precondiciones:** Usuario existe con 0 intentos fallidos  
**Pasos de Prueba:**
1. Intentar login 5 veces con contraseña incorrecta
2. Verificar estado de cuenta
3. Intentar login nuevamente  
**Datos de Entrada:** Mismo email con password incorrecto 5 veces  
**Resultado Esperado:** Tras el 5to intento, lanza AccountLockedError

#### Test ID: UC4-002
**Caso de Uso Relacionado:** UC4 - Bloqueo por Múltiples Intentos  
**Propósito:** Verificar que cuenta bloqueada no permite login  
**Precondiciones:** Usuario tiene lockedUntil en el futuro  
**Pasos de Prueba:**
1. Enviar credenciales correctas de usuario bloqueado
2. Verificar excepción  
**Datos de Entrada:** `{ email: 'locked@guru99bank.com', password: 'Locked@999' }`  
**Resultado Esperado:** Lanza AccountLockedError con fecha de desbloqueo

---

### UC5 - Cuenta Inactiva

#### Test ID: UC5-001
**Caso de Uso Relacionado:** UC5 - Cuenta Inactiva  
**Propósito:** Verificar rechazo de login para cuenta inactiva  
**Precondiciones:** Usuario existe con isActive=false  
**Pasos de Prueba:**
1. Enviar credenciales correctas de usuario inactivo
2. Verificar excepción  
**Datos de Entrada:** `{ email: 'inactive@guru99bank.com', password: 'Inactive@000' }`  
**Resultado Esperado:** Lanza InactiveAccountError

---

### UC6 - Validación de Email

#### Test ID: UC6-001
**Caso de Uso Relacionado:** UC6 - Validación de Formato de Email  
**Propósito:** Verificar validación de formatos de email válidos  
**Precondiciones:** Ninguna  
**Pasos de Prueba:**
1. Llamar validateEmailFormat() con diferentes emails válidos
2. Verificar retorno  
**Datos de Entrada:** `user@example.com`, `user.name@example.com`, `user+tag@example.com`  
**Resultado Esperado:** Retorna true para todos

#### Test ID: UC6-002
**Caso de Uso Relacionado:** UC6 - Validación de Formato de Email  
**Propósito:** Verificar rechazo de formatos inválidos  
**Precondiciones:** Ninguna  
**Pasos de Prueba:**
1. Llamar validateEmailFormat() con emails inválidos
2. Verificar retorno  
**Datos de Entrada:** `plainaddress`, `@missing.com`, `user@.com`  
**Resultado Esperado:** Retorna false para todos

---

## 9. Tecnologías Utilizadas

- **Node.js** >= 18.0.0
- **TypeScript** 5.3.3
- **Jest** 29.7.0
- **ts-jest** 29.1.1
- **Bun** (gestor de paquetes)

---

## 10. Autor

Frainer Encarnación (25-1775)

---
