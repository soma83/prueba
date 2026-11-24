# Proyecto de React + TypeScript + Vite
# Prueba


## Instalación

### Prerequisitos

- **Node.js** ≥ 18
- **pnpm** ≥ 8 (se puede instalar con `corepack enable pnpm` o `npm install -g pnpm`)

### Inicio rápido

```bash
# Clonar el repositorio
git clone https://github.com/soma83/prueba
cd prueba

# Instalar dependencias
pnpm install

# Variables de entorno
Actualizar el archivo `.env.example` con la ruta al api y renombrarlo como `.env`. El contenido quedaría:
`VITE_API_BASE_URL=https://jsonplaceholder.typicode.com`.

# Iniciar el servidor de desarrollo
pnpm dev

# Abrir el navegador y pegar la ruta
http://localhost:5173
```

## Nota 
Por defecto el proyecto se abrirá en el puerto 5173, si es necesario usar otro puerto se puede hacer de varias maneras:
* ejecutar el proyecto como `pnpm dev --port 3000`
* en el package.json cambiar el script de ejecución de `"dev": "vite"` a `"dev": "vite --port 3000"`
* o cambiando el archivo `vite.config.ts` de

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

a

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

plugins: [react(), tailwindcss()],
server: {
    port: 3000,
    strictPort: true,
  }
```
