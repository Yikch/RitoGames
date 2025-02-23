# Plantilla para juegos en Phaser

## Instalación

Clonar el repositorio:

```
git clone https://github.com/cleongh/plantillaphaser
```

Podemos modificar el archivo `package.json` para configurar nuestro proyecto (nombre, autor...)

Para iniciar el proyecto (sólo 1 vez) instalamos las dependencias (`parcel`, `phaser`):

```
npm install
```

## Uso

Cada vez que queramos usarlo, tenemos que arrancar el servidor de desarrollo que monitorizará los cambios, procesará el contenido y cambiará la página. Usa [Parcel](https://parceljs.org/).

Para arrancar el servidor de desarrollo:

```
npm start
```

Con esto, solo tenemos que programar y guardar los archivos, Parcel se encargará del resto.

## Distribución

Cuando queramos publicar el juego, podemos crear una *build* de *release*. Parcel optimizará los archivos y, con la configuración que hay en `package.json`, generará en la carpeta `docs/` una versión "pública" de nuestro proyecto.

```
npm run build
```

### En GitHub

Está todo configurado para que se active "GitHub Pages", y se use, en la rama principal (se suele llamar `main`), la carpeta `docs/`. Simplemente hay que activarlo en "Settings" → "Pages" → "Build and deployment".

## VSCode

En la carpeta `.vscode/` hay una configuración para usar Visual Studio Code, tanto para construir el *release* (`npm run build`) como para ejecutar y depurar. Simplemente hay que ejecutar "Run" → "Start debugging..." (or presionar `F5`).

# TODO
 - Hacer opciones en selección de campeón
 - Hacer opciones ingame, "pause": volver a la pantalla de selección
 - Poner animación de inicio de ronda y final de ronda (animacion de morir)
 - Poner UI de revancha al acabar la partida
 - Poner sonidos 
