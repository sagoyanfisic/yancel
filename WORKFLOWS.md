# Workflows Explicados

## 🔄 Flujo Simple

```
┌─────────────────────────────────────────────────────────┐
│  1. Fetch Config (Manual o cada 6h)                     │
│                                                          │
│  AWS App Config → Obtener JSON → Commit → Push          │
│                                             ↓            │
│                                   Trigger Deploy         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  2. Deploy (Automático en push o manual)                │
│                                                          │
│  Checkout → Build → Deploy a GitHub Pages               │
└─────────────────────────────────────────────────────────┘
```

## 📝 Workflow 1: fetch-config.yml

**Propósito**: Obtener configuración desde AWS y commitearla

**Triggers**:
- Manual: Actions → "Fetch Config from AWS" → Run workflow
- Automático: Cada 6 horas

**Pasos**:
1. Conecta a AWS App Config
2. Descarga el JSON
3. Aplica cambios a HTML/CSS con `apply-config.sh`
4. Commit + Push
5. Dispara el deploy automáticamente

**Resultado**: Archivos actualizados en el repo

---

## 🚀 Workflow 2: deploy.yml

**Propósito**: Desplegar el sitio a GitHub Pages

**Triggers**:
- Push a `main` (incluye los commits de fetch-config)
- Manual: Actions → "Deploy to GitHub Pages" → Run workflow

**Pasos**:
1. Checkout del código
2. Build del sitio
3. Deploy a GitHub Pages

**Resultado**: Sitio actualizado en `https://usuario.github.io/repo/`

---

## 💡 Ejemplo de Uso

### Cambiar colores:

1. Edita el JSON en AWS App Config:
```json
{
  "primaryColor": "#0077be",
  "secondaryColor": "#00a8e8",
  "siteTitle": "Portfolio Océano",
  "pageTitle": "Mis Proyectos"
}
```

2. Ve a **Actions** → **Fetch Config from AWS** → **Run workflow**

3. Espera ~1 minuto:
   - ✅ Config obtenida desde AWS
   - ✅ Commit creado
   - ✅ Push realizado
   - ✅ Deploy automático iniciado

4. Sitio actualizado con nuevos colores 🎨

---

## ⏰ Automático

El workflow se ejecuta cada 6 horas automáticamente, así que cualquier cambio en AWS se sincroniza solo.

Para cambiar la frecuencia, edita `fetch-config.yml` línea 8:
```yaml
- cron: '0 */6 * * *'  # Cada 6 horas
- cron: '0 */12 * * *' # Cada 12 horas
- cron: '0 0 * * *'    # Diario a medianoche
```
