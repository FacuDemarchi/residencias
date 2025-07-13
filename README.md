# 🏠 Residencias - Aplicación Web

Una aplicación web moderna para la gestión y búsqueda de residencias estudiantiles, desarrollada con React, TypeScript y Tailwind CSS.

## ✨ Características

- **Autenticación con Google** - Integración completa con Supabase Auth
- **Gestión de publicaciones** - ABM completo de residencias
- **Sistema de reservas** - Reservas temporales con expiración automática
- **Contratos de alquiler** - Gestión completa de alquileres
- **Pagos automáticos** - Integración con plataformas de pago externas
- **Interfaz moderna** - Diseño responsive con Tailwind CSS

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Functions)
- **Autenticación**: Google OAuth
- **Pagos**: Integración con plataformas externas
- **Build Tool**: Vite

## 📋 Casos de Uso

### Para Clientes:
- Ver publicaciones de residencias
- Reservar publicaciones temporalmente
- Alquilar residencias con contrato completo
- Gestionar perfil personal
- Ver historial de reservas y alquileres

### Para Residencias:
- Registrar y gestionar publicaciones (ABM)
- Activar/pausar publicaciones
- Gestionar contratos de alquiler
- Ver historial de alquileres

### Automatizado:
- Generación de pagos recurrentes
- Expiración automática de reservas

## 🗄️ Base de Datos

### Entidades principales:
- **user**: Autenticación de Google (Supabase)
- **user_data**: Datos adicionales del usuario
- **publicacion**: Publicaciones de residencias
- **reserva**: Reservas temporales
- **alquiler**: Contratos de alquiler
- **pago**: Pagos asociados a alquileres

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/residencias.git
   cd residencias
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📁 Estructura del Proyecto

```
residencias/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── context/       # Contextos de React
│   ├── hooks/         # Hooks personalizados
│   ├── pages/         # Páginas de la aplicación
│   ├── services/      # Servicios y APIs
│   └── diagrams/      # Diagramas UML (PlantUML)
├── public/            # Archivos estáticos
└── docs/             # Documentación adicional
```

## 🎨 Diseño y UI

La aplicación utiliza un diseño moderno con:
- **Gradientes** y efectos visuales atractivos
- **Responsive design** para todos los dispositivos
- **Animaciones suaves** y transiciones
- **Paleta de colores** azul, púrpura e índigo

## 🔧 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción
npm run lint         # Ejecutar ESLint
```

## 📊 Diagramas UML

El proyecto incluye diagramas UML completos en formato PlantUML:
- **Casos de uso** - Funcionalidades principales
- **Entidad-Relación** - Modelo de base de datos
- **Estados** - Máquinas de estado para entidades
- **Clases** - Arquitectura del backend

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Desarrollador**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **LinkedIn**: [tu-linkedin]

---

⭐ Si te gusta este proyecto, ¡dale una estrella!
