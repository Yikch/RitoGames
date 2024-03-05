# (Game name) - Game Design Document

### Estudio YIKERV, OS PRESENTAMOS

## Concepto

Es un juego de lucha `1vs1`, en 2D donde cada jugador tiene un personaje, tendrá 3 rondas y gana quien consiga 2 victorias

## Caracteristicas principales

Cada personaje tendrá un conjunto de ataques básicos que podrá utilizar en cualquier momento además de las opciones de movimiento básicas: 

- Salto

- Andar

- Agacharse

- Bloquear

- Dash o "roll"

Habrá una mecánica que te permita desbloquear los movimientos mas poderosos o útiles usando un input mas complejo y una forma de ir ciclando estos movimientos.
Se estima que en cada partida cada jugador podrá elegir 5 de estos ataques especiales y que siempre estarán a su disposición 3 de esos 5.

En cada partida habrá como máximo 3 rondas, siendo el ganador aquel que gane 2 de las 3 rondas.
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

| Movimientos básicos |         |         |
| ------------------- | ------- | ------- |
| **Puñetazos**       | Debiles | Fuertes |
| **Salto**           | Simple  | "Doble" |
| **Bloqueo**         | Simple  |         |
| **Dash/Roll**       | Simple  |         |

| Ataques especiales |     |
| ------------------ | --- |
| Carta 1            |     |
| Carta 2            |     |
| Carta 3            |     |
| Carta 4            |     |
| Carta 5            |     |

## Interfaz y controles

Habrá como _mínimo_ las siguientes interfaces:

- Inicio del juego

- Selección de personaje y "mazo de cartas"

- Menú de opciones y personalización de controles

- Pantalla de revancha

Se puede plantear hacer las siguientes escenas:

- Training room para ver las boxes y probar personajes

**Controles:**

- Se podrá usar teclado y gamepad

- Se podrán jugar con dos gamepads distintos usando una configuración de controles igual o distinta en los dos gamepads

- Se podrá jugar con un gamepad y un teclado usando una configuarción distinta en cada uno

- Se podrá jugar con 1/2 teclados usando una configuración *distinta* en cada uno. Es decir, las teclas para los inputs deben ser distintas debido a que el browser no permite diferenciar teclados.

- Se podrá configurar que teclas usar para los ataques/movimiento

## Personajes principales

Los personajes seguirán una temática aunque no haya historia para darle cohesión al juego.

Entre las ideas barajadas están usar arte de itch.io (ver apartado de candidatos a personaje principal)
Ideas: 
Lucha de artistas (Habría que hacer el arte):

- Pintor: de rango alto pero poco daño, puede tirar un proyectil "escupitajo" al suelo y crea una zona de veneno

- Escultor: de rango corto, tamaño grande, "agarre" tiene más daño y es más lento. Crear un muro de mármol que bloquee ataques.

Lucha de Elementales (sacado de itch.io): 

- **Luchador de crystal**

![Alt Text](https://img.itch.zone/aW1nLzk3MDQ4MzQuZ2lm/original/o8JO%2Fj.gif)

- **Arquero de planta**

![Alt Text](https://img.itch.zone/aW1nLzkwMTIyMzIuZ2lm/original/BLk6Hw.gif)

- **Shinobi ninja**

![ninja](https://img.itch.zone/aW1nLzgzMjgyMzYuZ2lm/original/yySo5B.gif)

- **Hechicera de agua**

![wizard](https://img.itch.zone/aW1nLzY1NzM5NTAuZ2lm/original/3lANZ7.gif)

- **Monje de piedra**

![monje](https://img.itch.zone/aW1nLzg3MjU0MDUuZ2lm/original/M%2FqyHe.gif)

- **Garen de fuego**

![garen](https://img.itch.zone/aW1nLzcwMzM3MjcuZ2lm/original/03hMDn.gif)

## Candidatos a personaje inicial

> **Enlaces:**
> 
> [ELEMENTALS](https://itch.io/c/1853936/elementals)
> 
> [Parallax Forest by ansimuz](https://ansimuz.itch.io/parallax-forest)

> ##### Crystal

- [x] Run

![](https://img.itch.zone/aW1nLzk3MDQ4NDQuZ2lm/original/20MVrz.gif)

- [x] Jump

![](https://img.itch.zone/aW1nLzk3MDQ4NTEuZ2lm/original/ymMPNY.gif)

- [ ] Roll

![](https://img.itch.zone/aW1nLzk3MDQ4NzEuZ2lm/original/caBuJ%2F.gif)

- [x] Defend

![](https://img.itch.zone/aW1nLzk3MDQ4OTguZ2lm/original/ZxQTS%2B.gif)

- [ ] Atack

![](https://img.itch.zone/aW1nLzk3MDQ4ODUuZ2lm/original/mSWIzV.gif)

- [ ] SP_atack_1

![](https://img.itch.zone/aW1nLzk3MDQ4OTQuZ2lm/original/TeCva6.gif)

- [ ] SP_atack_2

![](https://img.itch.zone/aW1nLzk3MDQ4OTcuZ2lm/original/7xcND0.gif)

- [ ] Take hit 

![](https://img.itch.zone/aW1nLzk3MDQ5MDAuZ2lm/original/fCMe3T.gif)

- [ ] Death

![](https://img.itch.zone/aW1nLzk3MDQ5MDEuZ2lm/original/nyoDn2.gif)



> ##### Arquero de planta

- [ ] Run

![](https://img.itch.zone/aW1nLzkwMTIyNDQuZ2lm/original/sdY5dT.gif)

- [ ] Jump

![](https://img.itch.zone/aW1nLzkwMTIyNDcuZ2lm/original/Y5XxPU.gif)

- [ ] Roll

![](https://img.itch.zone/aW1nLzkwMTIyNTguZ2lm/original/CeJlwt.gif)

- [ ] Defend

![](https://img.itch.zone/aW1nLzkwMTIyNzguZ2lm/original/oADQR3.gif)

- [ ] Atack

![](https://img.itch.zone/aW1nLzkwMTIyNjAuZ2lm/original/NwXILb.gif)

- [ ] Atack_2

![](https://img.itch.zone/aW1nLzkwMTIyNjUuZ2lm/original/d3Tfic.gif)

- [ ] SP_atack_1

![](https://img.itch.zone/aW1nLzkwMTIyNjkuZ2lm/original/Ja9zVQ.gif)

- [ ] SP_atack_2

![](https://img.itch.zone/aW1nLzkwMTIyNzMuZ2lm/original/WiYZa1.gif)

- [ ] SP_atack_3

![](https://img.itch.zone/aW1nLzkwMTIyNzcuZ2lm/original/sGgw4r.gif)

- [ ] Take hit

![](https://img.itch.zone/aW1nLzkwMTIyODEuZ2lm/original/m8tBPi.gif)

- [ ] Death

![](https://img.itch.zone/aW1nLzkwMTIyODMuZ2lm/original/IrvbT8.gif)

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