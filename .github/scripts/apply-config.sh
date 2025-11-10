#!/bin/bash

###############################################################################
# Script simple para aplicar configuración desde AWS App Config
# Lee un JSON y reemplaza valores en los archivos
###############################################################################

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🎨 Aplicando configuración...${NC}\n"

# Buscar el archivo de configuración
CONFIG_FILE=""
if [ -f "config.json" ]; then
    CONFIG_FILE="config.json"
elif [ -f "config.example.json" ]; then
    CONFIG_FILE="config.example.json"
    echo -e "${YELLOW}⚠️  Usando config.example.json (sin AWS App Config)${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontró configuración, usando valores por defecto${NC}"
    exit 0
fi

echo "📋 Usando: $CONFIG_FILE"

# Leer valores del JSON usando grep y sed (sin jq para simplificar)
PRIMARY_COLOR=$(grep -o '"primaryColor"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/.*"\(#[^"]*\)".*/\1/')
SECONDARY_COLOR=$(grep -o '"secondaryColor"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/.*"\(#[^"]*\)".*/\1/')
SITE_TITLE=$(grep -o '"siteTitle"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/.*":[[:space:]]*"\([^"]*\)".*/\1/')
PAGE_TITLE=$(grep -o '"pageTitle"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | sed 's/.*":[[:space:]]*"\([^"]*\)".*/\1/')

# Aplicar cambios si existen valores
if [ ! -z "$PRIMARY_COLOR" ]; then
    echo "🎨 Color primario: $PRIMARY_COLOR"
    sed -i.bak "s/--primary-color: #[0-9a-fA-F]\{6\};/--primary-color: $PRIMARY_COLOR;/" style.css
    sed -i.bak "s/--bg-gradient-start: #[0-9a-fA-F]\{6\};/--bg-gradient-start: $PRIMARY_COLOR;/" style.css
fi

if [ ! -z "$SECONDARY_COLOR" ]; then
    echo "🎨 Color secundario: $SECONDARY_COLOR"
    sed -i.bak "s/--secondary-color: #[0-9a-fA-F]\{6\};/--secondary-color: $SECONDARY_COLOR;/" style.css
    sed -i.bak "s/--bg-gradient-end: #[0-9a-fA-F]\{6\};/--bg-gradient-end: $SECONDARY_COLOR;/" style.css
fi

if [ ! -z "$SITE_TITLE" ]; then
    echo "📝 Título: $SITE_TITLE"
    sed -i.bak "s|<title>.*</title>|<title>$SITE_TITLE</title>|" index.html
fi

if [ ! -z "$PAGE_TITLE" ]; then
    echo "📝 Título de página: $PAGE_TITLE"
    sed -i.bak "s|<h2>Mis Repositorios</h2>|<h2>$PAGE_TITLE</h2>|" index.html
fi

# Limpiar archivos de respaldo
rm -f style.css.bak index.html.bak

echo -e "\n${GREEN}✅ Configuración aplicada!${NC}"
