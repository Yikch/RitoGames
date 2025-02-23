# Bellum Primordia - Game Design Document

### Estudio YIKERV, OS PRESENTAMOS

## Concepto

Es un juego de lucha `1vs1`, en 2D donde cada jugador tiene un personaje, tendrá 3 rondas y gana quien consiga 2 victorias

## Caracteristicas principales

Cada personaje tendrá un conjunto de ataques básicos que podrá utilizar en cualquier momento además de las opciones de movimiento básicas: 

- Salto

- Andar

- Bloquear


En cada partida habrá por defecto como máximo 3 rondas, siendo el ganador aquel que gane 2 de las 3 rondas.
El número de rondas y el tiempo que dura cada una de ellas se podrá modificar en la selección de personaje.
Ganará una ronda el jugador que sea capaz de quitarle todos los puntos de vida a su rival.


## Género

El genero del juego es un juego de lucha 2D con una vista lateral de 1 personaje contra 1 personaje.

## Alcance

`PEGI 12`

Esto es debido a que aunque sea un juego de lucha y por tanto violencia, no se verá sangre ni ningún contenido explicito.

## Plataforma

Se ejecuta en web sobre pc con teclado "y gamepad" y en la misma máquina, no habrá online.

**enlace:** [GitHub - Yikch/RitoGames](https://github.com/Yikch/RitoGames)

## Mecánicas del juego

(Los controles para estos movimientos se especifican mas adelante)
| Movimientos básicos |         |         |
| ------------------- | ------- | ------- |
| **Ataques**       | Debiles | Fuertes |
| **Salto**           | Simple  |         |
| **Bloqueo**         | Simple  |         |

| Ataques especiales |  Input   |
| ------------------ | --- |
| Ataque1         |  Semicirculo adelante + Ataque Débil   |
| Ataque2         |  Semicirculo adelante + Ataque Fuerte  |
| Ataque3             |  Semicirculo atrás + Ataque Débil   |

## Interfaz y controles

Habrá como _mínimo_ las siguientes interfaces:

- Inicio del juego

- Selección de personaje

- Menú de opciones y personalización de controles

- Pantalla de pelea
  - Se mostrará el tiempo restante de la ronda arriba en el centro
  - La vida del jugador 1 arriba a la izquierda y la del jugador 2 arriba a la derecha
  - Las rondas de cada jugador se mostrarán debajo de las barras de vida  

- Pantalla de revancha


**Controles:**

- Se podrá usar teclado y gamepad

- Se podrán jugar con dos gamepads distintos usando una configuración de controles igual en los dos gamepads

- Se podrá jugar con un gamepad y un teclado usando una configuarción distinta en cada uno

- Se podrá jugar con 1/2 teclados usando una configuración *distinta* en cada uno. Es decir, las teclas para los inputs deben ser distintas debido a que el browser no permite diferenciar teclados.

- La distribución de controles será:
  
|  Teclado            | Jugador1| Jugador2|
| ------------------- | ------- | ------- |
| **Puñetazo Debil**  |    Q    |    Z    |
| **Puñetazo Fuerte** |    E    |    X    |
| **Moverse Derecha** |    D    |    Flecha Derecha    |
| **Moverse Izquierda** |    A    |    Flecha Izquierda    |
| **Salto**           |    W    |    Flecha Arriba    |
| **Bloqueo**         |    Moverse Hacia Atrás    |    Moverse Hacia Atrás    |


|  Mando              | Controles|
| ------------------- | ------- |
| **Puñetazo Debil**  |    X    |
| **Puñetazo Fuerte** |    Y    |
| **Moverse Derecha** |    Joystick    |
| **Moverse Izquierda** |    Joystick    |
| **Salto**           |    A    | 
| **Bloqueo**         |    Moverse Hacia Atrás (joystick)    |

## Personajes principales

Los personajes seguirán una temática aunque no haya historia para darle cohesión al juego.
La temática será la lucha de maestros de elementos, donde cada personaje tendrá un elemento temático y sus habilidades seguirán esa temática.
Cada personaje tendrá animaciones para cada una de sus mecánicas y además tendrá animaciones especificas para recibir un ataque y para morir.

Lucha de Elementales (sacado de itch.io): 

- **Arquero de planta**

![Alt Text](https://img.itch.zone/aW1nLzkwMTIyMzIuZ2lm/original/BLk6Hw.gif)

- **Shinobi ninja**

![ninja](https://img.itch.zone/aW1nLzgzMjgyMzYuZ2lm/original/yySo5B.gif)

- ** Fondos **
  
- Fondo de pelea
> [Parallax Forest by ansimuz](https://ansimuz.itch.io/parallax-forest)

> ##### Arquero de planta

- [ ] Run

![](https://img.itch.zone/aW1nLzkwMTIyNDQuZ2lm/original/sdY5dT.gif)

- [ ] Jump

![](https://img.itch.zone/aW1nLzkwMTIyNDcuZ2lm/original/Y5XxPU.gif)

- [ ] Defend

![](https://img.itch.zone/aW1nLzkwMTIyNzguZ2lm/original/oADQR3.gif)

- [ ] Atack

![](https://img.itch.zone/aW1nLzkwMTIyNjAuZ2lm/original/NwXILb.gif)

- [ ] Atack_2

![](https://img.itch.zone/aW1nLzkwMTIyNjUuZ2lm/original/d3Tfic.gif)

- [ ] SP_atack_3

![](https://img.itch.zone/aW1nLzkwMTIyNzcuZ2lm/original/sGgw4r.gif)

- [ ] Take hit

![](https://img.itch.zone/aW1nLzkwMTIyODEuZ2lm/original/m8tBPi.gif)

- [ ] Death

![](https://img.itch.zone/aW1nLzkwMTIyODMuZ2lm/original/IrvbT8.gif)

## Historia

No habrá historia. Se podría hacer un simil con el Brawlhalla, el objetivo es pegarse y ya.

## Estilo visual

El estilo será Pixelart debido a su gran variedad de recursos libres y gratuitos.

## Música y sonido

La música se sacará de alguna fuente abierta y habrá como mínimo 2 tracks. Una para la pantalla de inicio y otra para las peleas.
Los sonidos del juego acompañarán los golpes, ataques, así como el movimiento por los menús y las victorias/derrotas.
Se usarán en la medida de lo posible recursos gratuitos, dejando la opción a hacerlos nosotros mismos.

El estilo de la música no está definido, no por ser el juego pixel art deberá ser 8 bits por ejemplo.

## Tiempo de desarrollo y objetivos
