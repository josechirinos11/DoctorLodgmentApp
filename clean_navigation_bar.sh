#!/bin/bash

# Script para remover todas las configuraciones de NavigationBar
# Ya que expo edge-to-edge está deshabilitado, no necesitamos estas configuraciones

echo "Removiendo configuraciones de NavigationBar de todos los archivos..."

# Lista de archivos a limpiar
files=(
    "src/screens/SignUp.tsx"
    "src/screens/ChangePassword.tsx"
    "src/screens/MyPhotos.tsx"
    "src/screens/Privacy.tsx"
    "src/screens/EditProfile.tsx"
    "src/screens/Subscription.tsx"
)

# Para cada archivo, remover las líneas de NavigationBar
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Limpiando $file..."
        
        # Remover import de NavigationBar
        sed -i '/import \* as NavigationBar from/d' "$file"
        
        # Remover useEffect con NavigationBar
        sed -i '/useEffect(() => {/,/}, \[\]);/c\
        // NavigationBar configuration removed - now handled by app.json' "$file"
        
        echo "✅ $file limpiado"
    else
        echo "❌ $file no encontrado"
    fi
done

echo "🎉 Limpieza completada!"
