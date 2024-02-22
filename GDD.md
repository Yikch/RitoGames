# (Game name) - Game Design Document

### Estudio YIKERV, OS PRESENTAMOS

## Concepto

Es un juego de lucha 1vs1, en 2D donde cada jugador tiene un personaje, tendrá 3 rondas y gana quien consiga 2 victorias

## Caracteristicas principales
Cada personaje tendrá un conjunto de ataques básicos que podrá utilizar en cualquier momento además de las opciones de movimiento básicas: 
	- Salto
	- Andar
	- Agacharse
	- Bloquear

Habrá una mecánica que te permita desbloquear los movimientos mas poderosos o útiles usando un input mas complejo y una forma de ir ciclando estos movimientos.
Se estima que en cada partida cada jugador podrá elegir 5 de estos ataques especiales y que siempre estarán a su disposición 3 de esos 5.

En cada partida habrá como máximo 3 rondas, siendo el ganador aquel que gane 2 de las 3 rondas.
Ganará una ronda el jugador que sea capaz de quitarle todos los puntos de vida a su rival.


## Género

El genero del juego es un juego de lucha 2D con una vista lateral de 1 personaje contra 1 personaje.

## Alcance

PEGI 12

Esto es debido a que aunque sea un juego de lucha y por tanto violencia, no se verá sangre ni ningún contenido explicito.

## Plataforma

Se ejecuta en web sobre pc con teclado "y gamepad" y en la misma máquina, no habrá online.

**enlace:** [GitHub - Yikch/RitoGames](https://github.com/Yikch/RitoGames)



## Mecánicas del juego

| Ataques básicos |         |         |
| --------------- | ------- | ------- |
| **Puñetazos**   | Debiles | Fuertes |
| **Patadas**     | Debiles | Fuertes |
| **Agarres**     | Debiles | Fuertes | -> Revisar y debatir

| Ataques especiales |         |         | -> Revisar y debatir como especificarlo
| ------------------ | ------- | ------- |
| **Puñetazos**      | Debiles | Fuertes |
| **Patadas**        | Debiles | Fuertes |
| **Agarres**        | Debiles | Fuertes |

## Interfaz y controles
	Habrá como _mínimo_ las siguientes interfaces:
		- Inicio del juego
		- Selección de personaje y "mazo de cartas"
		- Menú de opciones y personalización de controles
		- Pantalla de revancha
	Se puede plantear hacer las siguientes escenas:
		- Training room para ver las boxes y probar personajes

	Controles:
		- Se podrá usar teclado y gamepad
		- Se podrán jugar con dos gamepads distintos usando una configuración de controles igual o distinta en los dos gamepads
		- Se podrá jugar con un gamepad y un teclado usando una configuarción distinta en cada uno
		- Se podrá jugar con 1/2 teclados usando una configuración *distinta* en cada uno. Es decir, las teclas para los inputs deben ser distintas debido a que el browser no permite diferenciar teclados.

		Se podrá configurar que teclas usar para los ataques/movimiento

## Personajes principales
	Los personajes seguirán una temática aunque no haya historia para darle cohesión al juego.

	Entre las ideas barajadas están usar arte de itch.io (ver apartado de candidatos a personaje principal)
	Ideas: 
	Lucha de artistas (Habría que hacer el arte):
		> Pintor: de rango alto pero poco daño, puede tirar un proyectil "escupitajo" al suelo y crea una zona de veneno
		> 
		> Escultor: de rango corto, tamaño grande, "agarre" tiene más daño y es más lento. Crear un muro de mármol que bloquee ataques.
	Lucha de Elementales (sacado de itch.io): 
		> Luchador de crystal
		> Arquero de planta

## Candidatos a personaje inicial

[ELEMENTALS](https://itch.io/c/1853936/elementals)

https://ansimuz.itch.io/parallax-forest

## Historia
	No habrá historia. Se podría hacer un simil con el Brawlhalla, el objetivo es pegarse y ya.
	Se puede incluir un minimo contexto de por que se pelean para darle sentido.

## Estilo visual
	Dependerá del tipo de personajes que decidamos usar. 
	Si se elige la temática de personajes elementales, el estilo será pixel art.
	Si se elige la temática de artistas, el estilo será cartoon. (Skull girls, Brawlhalla)

## Música y sonido
	La música se sacará de alguna fuente abierta y habrá como mínimo 2 tracks. Una para la pantalla de inicio y otra para las peleas.
	Los sonidos del juego acompañarán los golpes, ataques, así como el movimiento por los menús y las victorias/derrotas.
	Se usarán en la medida de lo posible recursos gratuitos, dejando la opción a hacerlos nosotros mismos.

	El estilo de la música no está definido, no por ser el juego pixel art deberá ser 8 bits por ejemplo.

## Tiempo de desarrollo y objetivos
	