# GitHub Portfolio

Portafolio moderno que muestra tus repositorios de GitHub con modo oscuro, búsqueda y filtros.

## Características

- 🌓 **Modo Oscuro/Claro** con persistencia
- 🔍 **Búsqueda en tiempo real** por nombre o descripción
- 🏷️ **Filtros** por lenguaje y ordenamiento
- 📱 **Responsive** - funciona en móviles
- ⚡ **Caché inteligente** (5 minutos)
- 🎨 **Animaciones suaves**

## Instalación Rápida

### 1. Configura tu usuario

Edita [script.js](script.js) línea 3:
```javascript
username: 'tu-usuario-github',
```

### 2. Habilita GitHub Pages

1. **Settings** → **Pages**
2. **Source**: `GitHub Actions`
3. Push a `main`

Tu sitio: `https://tu-usuario.github.io/nombre-repo/`

---

## AWS App Config (Opcional)

Cambia colores sin tocar código. **2 workflows separados:**

### Workflow 1: Fetch Config
Trae JSON desde AWS → Commit → Push

### Workflow 2: Deploy
Despliega a GitHub Pages

```json
{
  "primaryColor": "#ff6b6b",
  "secondaryColor": "#ee5a6f",
  "siteTitle": "Mi Portfolio",
  "pageTitle": "Mis Proyectos"
}
```

<details>
<summary><b>📋 Setup (expandir)</b></summary>

### 1. Crear en AWS:
```bash
# App
aws appconfig create-application --name "github-portfolio" --region us-east-1

# Entorno
aws appconfig create-environment --application-id <APP_ID> --name "production" --region us-east-1

# Perfil
aws appconfig create-configuration-profile --application-id <APP_ID> --name "config" --location-uri "hosted" --region us-east-1

# Subir JSON
aws appconfig create-hosted-configuration-version \
  --application-id <APP_ID> \
  --configuration-profile-id <PROFILE_ID> \
  --content-type "application/json" \
  --content fileb://config.example.json \
  --region us-east-1
```

### 2. Secrets en GitHub:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_APPCONFIG_APPLICATION_ID`
- `AWS_APPCONFIG_CONFIGURATION_PROFILE_ID`

**Nota**: Ya no necesitas `ENVIRONMENT_ID`, el workflow obtiene el último deployment automáticamente.

### 3. Usar:
- **Actions** → **Fetch Config from AWS** → **Run workflow**
- Automático: Se ejecuta cada 6 horas

</details>

---

## Desarrollo Local

```bash
python3 -m http.server 8080
```

Abre: `http://localhost:8080`

---

## Personalización

### Cambiar Colores (sin AWS)
[style.css](style.css) líneas 2-3:
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
```

### Esquemas Pre-hechos

**Océano** 🌊: `#0077be` / `#00a8e8`
**Atardecer** 🌅: `#ff6b6b` / `#ee5a6f`
**Bosque** 🌲: `#26de81` / `#20bf6b`
**Nocturno** 🌙: `#5f27cd` / `#341f97`

---

## Estructura

```
yancel/
├── .github/
│   ├── scripts/
│   │   └── apply-config.sh         # Aplica config a archivos
│   └── workflows/
│       ├── fetch-config.yml        # Trae config de AWS
│       └── deploy.yml              # Despliega a Pages
├── index.html
├── style.css
├── script.js
├── config.example.json
└── README.md
```

---

## Stack

- HTML5, CSS3, JavaScript ES6+
- GitHub API
- GitHub Actions
- AWS App Config (opcional)

---

⭐ Dale una estrella si te fue útil!
