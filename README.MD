# Sistema de Gestión de Estacionamiento - Frontend



## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Interfaz de Usuario](#interfaz-de-usuario)
- [Interfaz de Administrador](#interfaz-de-administrador)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Tecnologías](#tecnologías)

---

## 📝 Descripción

El sistema cuenta con dos interfaces web independientes:

### 1. **User Interface (Interfaz de Usuario)**
Diseñada para pantallas táctiles externas donde los usuarios solicitan espacios de estacionamiento.

### 2. **Admin Interface (Interfaz de Administrador)**
Panel de control para gestionar espacios, usuarios, incidentes y visualizar reportes.

---

## 🔧 Requisitos

- Node.js 16.0 o superior
- npm 8.0 o superior
- Backend corriendo en `http://localhost:8000`

---

## 📁 Estructura del Proyecto

```
frontend/
├── user-interface/          # Aplicación para usuarios
│   ├── src/
│   │   ├── components/
│   │   │   ├── ParkingGrid.jsx
│   │   │   ├── ParkingGrid.css
│   │   │   ├── AssignmentModal.jsx
│   │   │   ├── AssignmentModal.css
│   │   │   ├── EmployeeLogin.jsx
│   │   │   ├── EmployeeLogin.css
│   │   │   ├── ErrorModal.jsx
│   │   │   └── ErrorModal.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── README.md
│
└── admin-interface/         # Aplicación para administradores
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Login.css
    │   │   ├── Sidebar.jsx
    │   │   ├── Sidebar.css
    │   │   ├── Dashboard.jsx
    │   │   ├── Dashboard.css
    │   │   ├── ConfirmModal.jsx
    │   │   └── ConfirmModal.css
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── README.md
```

---

## 🖥️ Interfaz de Usuario

### Características

- ✅ **Pantalla Principal:** Tres botones de acción principales
- ✅ **Solicitar Lugar:** Para usuarios normales (espacios no reservados)
- ✅ **Soy Docente:** Para usuarios con espacios reservados
- ✅ **Solicitar Ayuda:** Botón preparado para futuras funcionalidades
- ✅ **Teclado Numérico:** Para ingreso de CI de docentes
- ✅ **Grid Visual:** Muestra 20 espacios (4 filas × 5 columnas)
- ✅ **Modal de Confirmación:** Muestra el espacio asignado con cierre automático
- ✅ **Actualizaciones en Tiempo Real:** Los espacios se actualizan cada 5 segundos

### Flujo de Usuario Normal

1. Usuario presiona "Solicitar Lugar"
2. Sistema busca espacio libre (no reservado)
3. Aparece modal mostrando el grid completo
4. Espacio asignado resaltado en verde
5. Modal se cierra automáticamente en 60 segundos

### Flujo de Usuario Docente

1. Usuario presiona "Soy Docente"
2. Aparece teclado numérico para ingresar CI
3. Sistema verifica CI en base de datos
4. Si existe, asigna espacio reservado disponible
5. Muestra confirmación con espacio asignado
6. Si no existe o no hay espacios, muestra error

### Códigos de Color

- 🟢 **Verde:** Espacio asignado al usuario actual
- ⚪ **Gris:** Espacio libre normal
- 🟡 **Amarillo:** Espacio reservado (libre)
- 🔴 **Rojo:** Espacio ocupado


## 🎛️ Interfaz de Administrador

### Características

- ✅ **Autenticación:** Login seguro para administradores
- ✅ **Dashboard Interactivo:** Vista general del sistema
- ✅ **Gestión de Espacios:** Visualización y control de todos los espacios
- ✅ **Liberar Espacios:** Individual o todos a la vez
- ✅ **Editar Reservas:** Marcar/desmarcar espacios como reservados
- ✅ **Estadísticas en Tiempo Real:** Actualización cada 3 segundos
- ✅ **Sidebar de Navegación:** Acceso a diferentes módulos
- ✅ **Modales de Confirmación:** Para acciones críticas

### Módulos

#### 1. Dashboard (Principal)
**Funcionalidades:**
- 4 tarjetas de estadísticas (Total, Disponibles, Ocupados, Reservados)
- Grid de 20 espacios con estado visual
- Botón "Liberar" en cada espacio ocupado
- Botón "Liberar Todos los Espacios"
- Botón "Editar Reservas"

**Estadísticas Mostradas:**
- Total de espacios
- Espacios disponibles
- Espacios ocupados
- Espacios reservados

**Modo Edición de Reservas:**
1. Clic en "Editar Reservas"
2. Aparece banner informativo
3. Click en espacios para marcar/desmarcar como reservados
4. Checkbox visible en cada espacio
5. Colores cambian dinámicamente:
   - 🟡 Amarillo: Será reservado
   - ⚪ Gris: Será normal
6. Botones "Cancelar" y "Guardar Cambios"

#### 2. Usuarios (Próximamente)
Gestión de usuarios con derecho a reserva.

#### 3. Reportes (Próximamente)
Visualización de reportes y estadísticas históricas.

#### 4. Configuración (Próximamente)
Configuración del sistema y parámetros.

### Códigos de Color (Vista Normal)

- 🟢 **Verde claro:** Espacio libre normal
- 🔴 **Rojo claro:** Espacio ocupado
- 🟡 **Amarillo claro:** Espacio reservado (libre)

### Códigos de Color (Modo Edición)

- 🟡 **Amarillo:** Marcado como reservado
- ⚪ **Gris:** Marcado como normal

---

