# Guía Completa: Repara Cualquier Memoria USB Dañada

### Curso práctico de reparación de memorias USB, microSD y discos duros a nivel de firmware
**Por D-Tech USB**

---

## Introducción

Si estás leyendo esto es porque tienes en tus manos una memoria USB, una microSD o un disco duro que ya diste por muerto. O peor: te dedicas a reparar dispositivos de almacenamiento para otros y quieres dejar de improvisar. Bienvenido.

Llevo más de 15 años reparando memorias USB. En ese tiempo he visto pasar por mis manos cientos de miles de pendrives, discos duros y tarjetas microSD con absolutamente todos los problemas imaginables: USB que no se reconocen, que piden formato, que dicen "protegido contra escritura", que muestran "inserte un disco en unidad USB", discos duros con miles de sectores dañados, memorias falsificadas que prometen 2 TB y en realidad tienen 8 GB... Todo eso lo vas a aprender a diagnosticar y a reparar en esta guía.

### Por qué se dañan las memorias USB

La mayoría de la gente cree que cuando una USB "se rompe" es un problema físico, que el chip se quemó, que ya no sirve, que hay que tirarla a la basura. Y en el 90% de los casos eso es falso. Lo que ocurre realmente es que **el controlador se dañó a nivel de firmware**.

Toda memoria USB, sin excepción, tiene dentro un pequeño chip llamado **controlador**, que es el que gestiona cómo se organiza y se accede a la memoria flash donde están guardados tus archivos. Ese controlador tiene su propio firmware, una especie de "sistema operativo" interno de la USB. Cuando ese firmware se corrompe (por una mala extracción, un corte de corriente durante una escritura, sectores defectuosos de fábrica, uso prolongado, etc.), el sistema operativo de tu computadora deja de poder comunicarse correctamente con la memoria. Y ahí aparecen los síntomas: formato RAW, "Windows no puede completar el formato", protección contra escritura fantasma, "inserte un disco en unidad USB", o simplemente que la USB desaparece del explorador.

### Qué significa "reparar a nivel de controlador" (y por qué NO es lo mismo que formatear)

Aquí está la diferencia fundamental entre lo que hace la mayoría de la gente y lo que vas a aprender a hacer tú.

Cuando alguien tiene una USB dañada, lo primero que intenta es formatearla desde Windows. A veces funciona, sobre todo si el daño es leve. Pero en la mayoría de los casos donde el controlador está afectado, Windows ni siquiera te deja completar el formato, o el formato "funciona" pero la USB se vuelve a dañar al poco tiempo.

Formatear solo reescribe la tabla de archivos (el índice de dónde está cada cosa). **Reparar a nivel de controlador** es distinto: usas una herramienta específica, hecha por el propio fabricante del chip controlador (o filtrada de sus círculos técnicos), que le habla directamente al chip por debajo del sistema operativo, reinicializa su firmware, reconstruye su tabla de traducción de bloques y, en muchos casos, hace un formateo de bajísimo nivel de toda la memoria flash. Es la diferencia entre limpiarle el polvo a un motor y desarmarlo para repararlo desde adentro.

Esto es exactamente lo que vas a aprender a hacer en esta guía, siguiendo siempre el mismo proceso de tres pasos que uso yo en cada reparación:

1. **Diagnosticar** el controlador exacto de la USB con ChipGenius.
2. **Elegir** la herramienta de reparación correspondiente a ese controlador exacto.
3. **Ejecutar** esa herramienta como administrador y dejar que reconstruya el firmware.

### Qué vas a aprender en esta guía

- Cómo usar ChipGenius para identificar cualquier controlador de USB, microSD o disco duro externo en segundos.
- Las familias de herramientas de reparación según marca de controlador (Phison, Chipsbank, Alcor Micro, SMI, Innostor, FirstChip, entre otras) y cómo usarlas correctamente.
- Soluciones paso a paso para cada síntoma específico: RAW, "Windows no puede completar el formato", protección contra escritura, "inserte un disco", "no hay medios", USB no reconocida.
- Cómo recuperar tus archivos ANTES de reparar, para no perder nada importante.
- Reparación de discos duros con sectores dañados y de tarjetas microSD, que son procesos distintos a los de una USB.
- Cómo detectar memorias USB y discos duros falsificados antes de comprarlos (o después, para pedir tu reembolso a tiempo).
- Un flujo de decisión completo para que sepas, ante cualquier síntoma, exactamente qué hacer.

Este no es un manual de consulta para ir saltando de capítulo en capítulo. Está pensado como un curso progresivo: cada capítulo se apoya en el anterior. Así que te recomiendo leerlo en orden, aunque una vez que lo domines, sí podrás usarlo como referencia rápida para cada reparación futura.

Vamos a ello.

---

## Capítulo 1: El diagnóstico lo es todo — Domina ChipGenius

Antes de tocar cualquier herramienta de reparación, tienes que entender esto: **nunca, jamás, intentes reparar una USB sin identificar primero su controlador**. Es el error número uno que cometen los principiantes, y es la razón por la que el 90% de los tutoriales que encuentras por ahí terminan en fracaso: usan una herramienta al azar, "a ver si funciona", en lugar de usar la herramienta exacta que le corresponde a ese chip.

### Qué es ChipGenius

ChipGenius es un programa gratuito, muy liviano, que lee la información interna de cualquier dispositivo conectado por USB: memorias, discos duros externos, tarjetas microSD por adaptador, incluso mouse y teclados (aunque a esos no les interesan). Es la herramienta base, el punto de partida obligatorio de absolutamente todas las reparaciones que vas a hacer.

Su funcionamiento es sencillo: lo descargas, lo descomprimes, localizas el ejecutable y lo abres **siempre como administrador** (clic derecho, "Ejecutar como administrador"). No necesita instalación.

### La interfaz de ChipGenius

Al abrirlo verás dos paneles principales:

- **Panel superior**: lista todos los dispositivos conectados a tu computadora por interfaz USB. Ahí verás tu mouse, tu teclado, y también tu memoria USB o disco duro externo. Tienes que seleccionar el dispositivo que quieres diagnosticar.
- **Panel inferior**: aquí es donde está toda la información técnica del dispositivo seleccionado.

### Los datos que realmente importan

De toda la información que muestra ChipGenius, hay tres datos que son innegociables y que vas a tener que anotar cada vez que hagas un diagnóstico:

**1. Controller Vendor (Chip Controlador)**

Es el fabricante del chip controlador. Los que vas a ver una y otra vez en este curso son: Phison, Alcor Micro, SMI (Silicon Motion), Chipsbank, Innostor, FirstChip, Solid State System, Appotech, Asolid, Skymedi, Silicon Go, Huayi, ITE/USBest, entre otros. Este dato es el que te dice, a grandes rasgos, qué *familia* de herramienta vas a necesitar.

**2. Controller Part Number (número de controlador)**

Es el número de modelo exacto dentro de esa familia. Por ejemplo, dentro de Alcor Micro puedes tener un AU6989SN o un AU6987; dentro de Phison puedes tener un PS2251-07, un PS2251-32, un PS2251-68, etc. Este número puede empezar con letras características del fabricante (los de Phison suelen empezar con "P", por ejemplo). Este dato es crítico porque **la misma marca de controlador puede tener decenas de variantes**, y no todas usan exactamente la misma herramienta o configuración.

**3. Flash ID**

Es el identificador del chip de memoria flash real que tiene la USB por dentro (SanDisk, Kioxia/Toshiba, Micron, Hynix, Samsung, Intel, etc.). Muchas herramientas de reparación necesitan saber también el Flash ID porque el proceso de reparación varía según qué memoria flash hay detrás del controlador. Es común encontrar el mismo número de controlador con distintos Flash ID, y cada combinación puede requerir una versión distinta de la herramienta.

Además de estos tres, verás datos adicionales como el **VID (Vendor ID)** y el **PID (Product ID)**, que son códigos numéricos únicos del fabricante y del producto. Estos dos son especialmente importantes para controladores Alcor Micro, como verás en el capítulo siguiente, porque en ciertos casos vas a tener que introducirlos manualmente en la herramienta de reparación para forzar el reconocimiento de la USB. También puedes ver la fecha aproximada de fabricación del controlador y la capacidad detectada.

### Regla de oro: los datos tienen que coincidir exactamente

Este es el punto más importante de todo el capítulo, así que léelo dos veces si hace falta.

Cada video, cada guía, cada tutorial de reparación de una USB específica fue probado con una combinación **exacta** de controlador + número de controlador + Flash ID. Si tu USB tiene el mismo chip controlador (por ejemplo, Phison) pero un número de controlador diferente, o el mismo número de controlador pero un Flash ID distinto, **esa herramienta puede no reconocer tu USB, o peor, puede dañarla más**.

Por eso el proceso correcto siempre es:

1. Diagnosticas con ChipGenius.
2. Anotas los tres datos clave (controlador, número, Flash ID).
3. Buscas la solución específica para esa combinación exacta (ya sea en un tutorial, en la tabla de referencia de herramientas, o en el buscador de casos que veremos en el capítulo final).
4. Solo entonces descargas y ejecutas la herramienta correspondiente.

### Cuando ChipGenius dice "Unknown" (desconocido)

Vas a encontrarte casos donde, en el campo del controlador, ChipGenius simplemente diga "Unknown". Esto pasa por dos razones posibles:

- El controlador está dañado de forma irreversible a nivel de hardware.
- Es una copia o clon chino con un controlador no estandarizado, como pasa con ciertas imitaciones de modelos populares (por ejemplo, algunas Kingston DataTraveler 100 G3 falsificadas).

En ninguno de los dos casos vas a poder repararla con las herramientas de este curso, porque ninguna herramienta de reparación va a poder reconocer un controlador que ni siquiera ChipGenius puede identificar. Es importante que sepas distinguir esto desde el principio para no perder horas intentando lo imposible.

### Resumen del capítulo

Antes de pasar al siguiente capítulo, quiero que interiorices esta secuencia mental para cada reparación que vayas a hacer de ahora en adelante:

> Conecto la USB → Abro ChipGenius como administrador → Anoto Controlador, Número de controlador y Flash ID → Busco la herramienta que corresponde exactamente a esos tres datos → Ejecuto como administrador → Reparo.

Con esta base, ya puedes pasar al capítulo siguiente, donde vamos a ver, familia por familia de controlador, qué herramienta usar y cómo se maneja cada una.

---

## Capítulo 2: Las familias de herramientas de reparación

Cada fabricante de chips controladores tiene su propia herramienta (o familia de herramientas) de reparación, generalmente distribuida en un ambiente técnico/gris de reparadores profesionales, no en la web oficial del fabricante. En este capítulo vamos a repasar, uno por uno, los controladores más comunes que te vas a encontrar, con el patrón general de uso de cada herramienta.

Antes de entrar en detalle por marca, aquí está el patrón que se repite en **prácticamente todas** las herramientas de reparación, sin importar el fabricante:

1. Extraes el comprimido descargado y localizas la aplicación dentro de la carpeta.
2. La ejecutas **siempre como administrador** (esto no es opcional, muchas herramientas ni abren si no tienen permisos de administrador).
3. Esperas a que la herramienta reconozca automáticamente la memoria conectada.
4. Das clic en el botón de inicio (que según la herramienta puede decir "Start", "Format", "Restore" o "Recover").
5. Esperas a que termine el proceso — puede tardar desde segundos hasta más de una hora, dependiendo de si el proceso es de **alto nivel (high level format)** o de **bajo nivel (low level format)**.
6. Sabes que terminó exitosamente cuando aparece un mensaje o texto de confirmación, normalmente en color verde o azul (dependiendo de la herramienta), indicando reparación exitosa.
7. Cierras la herramienta, vas al explorador de Windows y formateas la USB de forma normal para verificar que quedó completamente funcional.

Con esa base en mente, vamos por controlador.

### Alcor Micro

Es, junto con Phison, uno de los dos controladores más extendidos del mundo — la mayoría de las memorias USB genéricas y de marcas como Transcend, ADATA o Maxell que vas a reparar en tu vida usan alguno de estos dos. Su herramienta principal se llama **Alcor MP** (verás distintas versiones numeradas, como la 14.08.12 o la 16.11.01, según el número de controlador exacto).

El uso general: extraes, ejecutas como administrador, y si la USB se reconoce de inmediato, simplemente das clic en "Start" para que comience el proceso.

**El "truco Alcor"**: en muchos casos, sobre todo cuando el controlador está más dañado, la Alcor MP **no reconoce la USB al abrirse**. Aquí es donde entra una de las técnicas más importantes que vas a aprender en todo este curso, exclusiva de controladores Alcor Micro:

1. Coloca la ventana de ChipGenius y la de la Alcor MP una al lado de la otra.
2. En la Alcor MP, entra a "Setup", da clic en OK, y desmarca la opción "Manual Selection" si está marcada.
3. Ve a la pestaña "Information".
4. Copia los valores exactos del **VID** y el **PID** que te muestra ChipGenius y pégalos en los campos correspondientes de esa pestaña.
5. Da OK.

Con esto le estás diciendo a la herramienta, literalmente, "esta es la memoria que quiero que revises y ninguna otra". En cuanto los valores coinciden, la USB debería aparecer reconocida con todos sus datos, y ya solo te queda dar en "Start".

Nota importante: este método del VID/PID **solo aplica a controladores Alcor Micro**. No lo intentes con otras marcas, no funciona igual.

Otro detalle útil: si dos memorias USB tienen exactamente los mismos datos de ChipGenius (mismo controlador, mismo número, mismo Flash ID), puedes conectarlas ambas a la vez y repararlas simultáneamente con la misma instancia de la Alcor MP — la herramienta reconocerá y procesará ambas en paralelo. Esto también funciona con las Dynamas de SMI y las UPTool de Phison.

### Phison

El otro gigante de los controladores USB. Vas a ver modelos con numeración que empieza en "225" (por ejemplo, PS2251-07, PS2251-32, PS2251-68, PS2251-09), cada uno con su propia particularidad. Las herramientas más comunes de esta familia son:

- **UPTool**: la más versátil y la que verás con más frecuencia. Se extrae, se ejecuta como administrador, reconoce la USB, y das "Start".
- **Restore** (por ejemplo, la versión 3.17): muy usada específicamente para modelos Kingston con controlador Phison. Se ejecuta como administrador, das clic en el botón "Restore" dos veces, y aceptas el cartel de confirmación que aparece.
- **Phison Formatter / Low Level Format**: para controladores Phison más antiguos, donde una herramienta de formateo de bajo nivel resulta más rápida y efectiva. Se ejecuta, aparece un aviso de que los datos se destruirán, y das clic en "Format".
- **SD Tool**: para ciertos modelos de controlador Phison más recientes (por ejemplo el 225109), la reparación requiere una configuración manual bastante más detallada: seleccionar el firmware correcto desde la carpeta "binw", ajustar la partición a FAT32, marcar la opción "no map" en Other Settings, y en la pestaña de parámetros MP elegir "High Level Format" como tipo de escaneo y "Capacity First" como tipo de clasificación (para priorizar conservar la mayor capacidad posible). Solo después de guardar esta configuración das clic en "Update" para que reconozca la USB y luego en "Start".

Phison es también el controlador que vas a encontrar con más frecuencia detrás de discos duros externos **falsos** (pendrives disfrazados de disco duro), así que lo volverás a ver en el capítulo de "Buyer Beware".

### Chipsbank

Su herramienta principal es la **UPTool de Chipsbank** (a veces vas a ver el nombre escrito en transcripciones como "chispan", "chisban" o "shivan" — todos se refieren a Chipsbank). El patrón de uso es el estándar: extraer, ejecutar como administrador, esperar reconocimiento automático, dar "Start". La confirmación de éxito en estas herramientas suele aparecer en letras de color azul.

Los controladores de Chipsbank que vas a ver con más frecuencia llevan numeración tipo CBM2099 o CBM2199.

### SMI (Silicon Motion)

Sus controladores empiezan típicamente con "SM" seguido de números (SM3257, SM3259, SM3268, SM3271, SM3280, etc.). Las herramientas principales de esta familia se conocen como **Dynamas Storage** o **DSMI**, en distintas versiones numeradas (por ejemplo 16.12.21, 18.10.18).

Un detalle importante con SMI: es muy común que la reparación falle al ejecutarse en modo **high level format**, y tengas que ir a los ajustes de la herramienta, cambiar la opción al modo **low level format**, guardar, volver a escanear ("Scan") y recién ahí dar "Start" de nuevo. El formato de bajo nivel es más lento (puede tardar un par de horas), pero es más efectivo cuando el de alto nivel falla. Este patrón — intentar primero en alto nivel y si falla pasar a bajo nivel — es una estrategia general que puedes aplicar a la mayoría de las familias de herramientas, no solo a SMI.

También encontrarás casos donde, en lugar de "Start", el botón dice **"Recover"** — funciona igual, solo cambia el nombre según la versión de la herramienta.

### Innostor

Sus controladores llevan numeración como IS918MGA o IS916D0. Es un controlador muy común en modelos Kingston Exodia y algunas ADATA. Su herramienta no tiene un nombre único fijo — vas a encontrar tanto una **MP Tool de Innostor** genérica como herramientas específicas como **"iRecovery" para Innostor IS916**.

Un detalle particular de esta familia: al abrir la herramienta puede aparecer una ventana con dos opciones y un botón con texto en chino — normalmente tienes que marcar la opción "test" y dar clic en ese botón para aplicar la selección. No te asustes por no entender el idioma, el flujo es siempre: marcar test → aplicar → esperar reconocimiento → Start.

También es normal que la herramienta indique inicialmente "0 GB" de capacidad al reconocer la USB — esto no significa que esté descartada, en muchos casos la reparación funciona igual. Las reparaciones de Innostor suelen ser en low level format, así que pueden tardar más de una hora.

### FirstChip

Controladores con numeración tipo FC1179. Su herramienta es una **MP Tool de FirstChip** de uso estándar: extraer, ejecutar como administrador, esperar reconocimiento, dar "Start". Este es también el controlador que vas a encontrar frecuentemente dentro de discos duros externos falsificados (más sobre esto en el capítulo 7).

### Solid State System (SSS)

Este es un caso especial que tienes que conocer para no perder tiempo: los controladores Solid State System **solo tienen herramienta de reparación disponible hasta el modelo SSS6692B5**. Los modelos superiores — 6695, 6696, 6697, 6698 — **no tienen herramienta (MPTool) disponible hasta el día de hoy**. Si tu ChipGenius te muestra uno de estos números superiores, lamentablemente no hay nada que hacer por el momento con las herramientas actuales.

### Otros controladores mencionados

El ecosistema de D-Tech USB también cubre, en su repositorio de herramientas, los controladores **ITE/USBest, Skymedi, Silicon Go, Appotech y Asolid**, entre otros menos comunes. El patrón de uso de sus herramientas sigue la misma lógica general explicada al inicio de este capítulo: identificar con ChipGenius, descargar el paquete correspondiente a esa marca, ejecutar como administrador y seguir el flujo de reconocimiento → start → confirmación. Si te encuentras con uno de estos controladores, la tabla de referencia y el buscador que veremos en el capítulo final son tu mejor punto de partida, ya que la documentación pública sobre su uso específico es más escasa.

### Cuando no reconoces qué herramienta usar: la tabla de referencia

No vas a memorizar cada combinación de controlador + número + Flash ID que existe en el mundo — nadie lo hace. Para eso existe la **tabla de solucionadas** (también llamada tabla de referencia), un documento (o conjunto de documentos en PDF, uno por cada marca de controlador) que recopila casos reales ya resueltos, indicando: número de controlador, Flash ID, fabricante y, en la columna que realmente importa, la **herramienta exacta** que se usó para reparar esa combinación.

El uso es simple: abres el PDF correspondiente al controlador que te dio ChipGenius (por ejemplo, el de Phison), usas Ctrl+F para buscar el número de controlador exacto, y si hay varias coincidencias, te fijas cuál tiene el mismo Flash ID que tu USB — porque el mismo número de controlador puede aparecer varias veces con Flash ID distintos, y cada uno puede requerir una herramienta diferente. Una vez identificada la fila correcta, ahí tienes el nombre exacto de la herramienta que necesitas buscar y descargar.

Esta tabla es, sin exagerar, la herramienta más valiosa de todo tu kit, porque te permite reparar prácticamente cualquier combinación sin depender de haber visto ya un video con esos datos exactos.

---

## Capítulo 3: Soluciones por síntoma

En este capítulo vamos a ver, síntoma por síntoma, cómo actuar. Ya conoces el diagnóstico (Capítulo 1) y ya conoces las familias de herramientas (Capítulo 2) — ahora vamos a conectar ambas cosas según lo que le esté pasando a la memoria que tienes en tus manos.

### Síntoma 1: Formato RAW

Este es probablemente el síntoma más común que vas a encontrar. La USB aparece conectada en el explorador, pero Windows te dice que no tiene formato, o el administrador de discos muestra el sistema de archivos como "RAW".

Lo primero que mucha gente intenta es CHKDSK desde el símbolo del sistema (`chkdsk E: /f`, reemplazando E: por la letra correspondiente). **Este comando no funciona cuando el disco está en formato RAW** — CHKDSK está diseñado para reparar sistemas de archivos existentes, no para reconstruir uno que no existe. Vas a recibir un mensaje de error indicando justamente eso.

El proceso correcto:

1. **Antes que nada**, si hay datos importantes dentro, recupéralos primero con las herramientas del Capítulo 4 — la reparación por controlador es un proceso destructivo.
2. Abre ChipGenius, identifica controlador, número y Flash ID.
3. Busca (en tabla de referencia o video específico) la herramienta correspondiente exacta.
4. Ejecuta como administrador, deja que reconozca la USB y da "Start".
5. Espera la confirmación (verde, azul o el color que use esa herramienta en particular).
6. Formatea la USB de nuevo desde Windows para confirmar que la reparación quedó completa.

### Síntoma 2: "Windows no puede completar el formato" / no se deja formatear

Este mensaje aparece cuando intentas formatear normalmente desde Windows y el sistema simplemente rechaza la operación. No es culpa tuya ni de una mala manipulación necesariamente — generalmente indica que el sistema operativo no reconoce correctamente el sistema de archivos porque el controlador interno está dañado.

El proceso es idéntico al de RAW: diagnóstico con ChipGenius → herramienta específica del controlador → Start → confirmación → formateo final desde Windows para verificar.

Un truco alternativo con el símbolo del sistema (CMD), que en algunos casos leves puede funcionar sin necesidad de recurrir a una herramienta de controlador:

1. Abre CMD como administrador.
2. Escribe `diskpart` y presiona Enter.
3. Escribe `list disk` y presiona Enter — identifica tu USB por su capacidad.
4. Escribe `select disk N` (donde N es el número de tu disco) y Enter.
5. Escribe `clean` y Enter — esto borra todas las particiones.
6. Escribe `create partition primary` y Enter.
7. Escribe `select partition 1` y Enter.
8. Escribe `format fs=fat32 quick` (o `fs=ntfs quick` si es un disco duro) y Enter.
9. Si Windows no le asigna letra automáticamente, ve a "Administrar" → "Administrador de discos", clic derecho sobre el volumen y "Cambiar letra y ruta de acceso" para asignarle una manualmente.

**Importante**: este método de CMD falla con mucha frecuencia cuando la USB está protegida contra escritura (verás el error al intentar el comando `clean`) o cuando el controlador está más gravemente dañado. En esos casos no queda otra opción que ir directo a la herramienta de reparación por controlador.

Este mismo método de CMD también sirve para un caso curioso: memorias USB que muestran una capacidad mucho menor a la real (por ejemplo, una USB de 8 GB que solo muestra 35 MB disponibles) sin que se trate de una falsificación — simplemente la partición quedó mal configurada, y recreándola con diskpart recuperas el espacio perdido.

### Síntoma 3: Protección contra escritura

Este es uno de los síntomas más frustrantes porque parece "fácil" de resolver (basta con cambiar una configuración, ¿verdad?) pero casi nunca lo es. El problema no está en ninguna configuración de Windows a la que puedas acceder normalmente — está grabado en el firmware del controlador.

Antes de asumir que necesitas la reparación completa, hay un intento rápido con CMD que a veces funciona para protecciones leves:

1. Abre CMD como administrador.
2. Escribe `diskpart`, Enter.
3. `list disk`, Enter, identifica tu USB.
4. `select disk N`, Enter.
5. `attributes disk clear readonly`, Enter (este comando específico intenta quitar el atributo de solo lectura).
6. Intenta formatear de nuevo.

Si esto no resuelve el problema (que es lo más común cuando el controlador está realmente dañado), el proceso es el mismo de siempre:

1. ChipGenius → identificas controlador, número, Flash ID.
2. Buscas la herramienta correspondiente exacta (a menudo, para protección contra escritura, encontrarás que la solución es la misma herramienta de reparación general de ese controlador — no hay una herramienta "especial" solo para escritura, el proceso de reescritura de firmware suele resolver ambos problemas a la vez).
3. Ejecutas como administrador, esperas reconocimiento, das Start (o Restore/Recover según la herramienta).
4. Verificas formateando desde Windows.

**Advertencia importante sobre SanDisk**: las memorias USB de la familia SanDisk Cruzer (Cruzer Blade, Cruzer Glide, Cruzer Edge) que se protegen contra escritura **no tienen solución por software**. SanDisk no distribuye ninguna herramienta de reparación pública para sus controladores, y a diferencia de otras marcas, estas memorias se reparan (según información no verificada de círculos técnicos rusos) desoldando físicamente el chip de memoria flash y montándolo sobre otra placa con un controlador distinto — un procedimiento de laboratorio con interfaz de programador, fuera del alcance de cualquier reparación casera o con las herramientas de este curso. Si te llega una SanDisk Cruzer protegida contra escritura, sé honesto con el cliente (o contigo mismo): no hay reparación por software posible hoy en día. Vale la pena intentar los comandos de CMD mencionados arriba antes de descartarla del todo, pero si el bloqueo está realmente en el controlador, no hay MPTool que la reconozca.

### Síntoma 4: "Inserte un disco en unidad USB"

Este mensaje de error aparece cuando el sistema operativo detecta que hay un dispositivo conectado pero no logra leer absolutamente nada de él — ni siquiera la estructura básica de particiones. Es indicativo de un controlador con daño más severo que en los casos de RAW simple.

El proceso de reparación es el estándar: ChipGenius → identificación exacta → herramienta correspondiente al controlador (puede ser una UPTool de Chipsbank, una Dynamas de SMI, una Alcor MP con el truco del VID/PID, según lo que te muestre el diagnóstico) → Start → confirmación (fíjate en el color específico de confirmación de cada herramienta: verde en unas, azul en otras) → formateo de verificación desde Windows.

No hay una única herramienta "para este síntoma" — el síntoma "inserte un disco" puede aparecer con prácticamente cualquier marca de controlador. Lo único que cambia siempre es la herramienta que corresponde a lo que te diga ChipGenius.

### Síntoma 5: "No hay medios" / disco extraíble sin volumen

Este es, en mi experiencia, de los síntomas que más asustan a la gente porque el Administrador de Discos de Windows literalmente muestra el dispositivo como "sin medios" — como si el hardware estuviera físicamente vacío o muerto. La reacción natural es pensar que el chip se quemó y tirar la memoria a la basura.

Pero en la mayoría de los casos, el chip está vivo — simplemente el controlador está bloqueado o confundido y no está reportando correctamente su capacidad. La solución sigue el mismo patrón: identificas con ChipGenius (vas a obtener de todas formas los tres datos clave, aunque el sistema diga "sin medios"), buscas la herramienta específica de ese controlador y la ejecutas.

Un detalle a tener en cuenta con este síntoma: es común que la herramienta de reparación muestre inicialmente "0 GB" de capacidad detectada al reconocer la memoria. No te desanimes por eso — en muchos casos el proceso de reparación (generalmente en high level format, que es rápido: o funciona en segundos, o falla en segundos) restaura la capacidad real una vez completado. También es normal que, justo después de la reparación exitosa, el explorador siga mostrando la USB "sin formato" — es el paso final normal, y basta con formatearla una vez más desde Windows para que quede completamente operativa.

### Síntoma 6: USB no reconocida en absoluto / no aparece en la PC

Cuando la memoria ni siquiera aparece en el explorador ni en el administrador de discos, prueba primero lo básico: otro puerto USB, otra computadora. Si el resultado es el mismo en ambos casos, confirmas que no es un problema del puerto ni del cable, sino de la memoria en sí.

A partir de ahí, el proceso es idéntico al resto: ChipGenius (que sí debería poder leer el controlador aunque el explorador de Windows no vea la unidad, ya que trabaja a un nivel más bajo), identificación de controlador/número/Flash ID, búsqueda de la herramienta correcta, ejecución como administrador, reparación, verificación con formateo.

### Resumen de diagnóstico rápido por síntoma

| Síntoma | ¿CHKDSK funciona? | ¿Requiere herramienta de controlador? |
|---|---|---|
| Formato RAW | No | Sí, siempre |
| No completa el formato | A veces con CMD/diskpart | Sí, si CMD falla |
| Protección contra escritura | A veces con `attributes disk clear readonly` | Sí, si CMD falla (excepto SanDisk Cruzer) |
| "Inserte un disco" | No | Sí, siempre |
| "No hay medios" | No | Sí, siempre |
| No se reconoce en absoluto | No | Sí, siempre |

---

## Capítulo 4: Recupera tus archivos ANTES de reparar

Este capítulo es, posiblemente, el más importante de toda la guía desde el punto de vista del cliente o del usuario final. Todo lo que viste en los capítulos anteriores sobre reparación de controlador es un **proceso destructivo**: reescribe el firmware y, en la mayoría de los casos, borra por completo el contenido de la memoria. Si dentro de esa USB hay fotos familiares, documentos de trabajo o cualquier archivo irremplazable, **recuperar primero, reparar después** — nunca al revés.

### Por qué no debes formatear de entrada

La tentación natural cuando una USB da problemas es formatearla e intentar seguir usándola. Pero si hay datos importantes ahí dentro y aún no los has recuperado, formatear (o peor, reparar el controlador) puede hacer que esa información se pierda para siempre o se vuelva mucho más difícil de recuperar.

### Recuperación con TestDisk / PhotoRec

Para memorias ya formateadas por error (o que quieres formatear pero antes necesitas rescatar el contenido), la combinación **TestDisk / PhotoRec** es gratuita, funciona en Windows, Mac y Linux, y es sorprendentemente efectiva incluso después de un formateo.

El proceso con PhotoRec (que viene incluido junto a TestDisk):

1. Descarga y extrae el paquete correspondiente a tu sistema (32 o 64 bits).
2. Crea de antemano una carpeta de destino donde se guardarán los archivos recuperados — nunca guardes la recuperación dentro de la misma USB que estás recuperando, siempre en una unidad distinta.
3. Ejecuta PhotoRec como administrador.
4. Selecciona con las flechas del teclado el dispositivo del que quieres recuperar (identifícalo por su capacidad) y presiona Enter.
5. En la siguiente ventana no toques nada, Enter.
6. Elige la opción correspondiente a tu tabla de particiones — para Windows normalmente es la opción inferior de las dos que aparecen.
7. Elige el tipo de análisis: **"Free"** analiza solo una parte del dispositivo (más rápido); **"Whole"** revisa todos los sectores buscando la mayor cantidad posible de archivos recuperables (más lento, pero más completo). Para una recuperación seria, usa "Whole".
8. Selecciona la carpeta de destino que creaste al inicio y, en vez de presionar Enter, presiona la tecla **C**.
9. El proceso comenzará y su duración dependerá de la capacidad del dispositivo.

Nota práctica: en ocasiones la herramienta no guarda los archivos exactamente en la carpeta que marcaste, sino en una subcarpeta aparte generada automáticamente — revisa bien el directorio de destino al terminar.

### Recuperación con Get Data Back (para formato RAW)

Cuando el problema es específicamente formato RAW y quieres recuperar antes de intentar cualquier reparación, otra opción muy usada es **Get Data Back**, en su versión portable y gratuita:

1. Al ejecutarlo como administrador, elige entre las opciones FAT32 o NTFS según corresponda (para una USB, generalmente FAT32).
2. Entra a "Opciones" y en el apartado "Recovery" marca las casillas de archivos borrados ("deleted files") y archivos perdidos ("lost files").
3. Selecciona la partición de tu USB (identifícala por su capacidad) y avanza.
4. El programa organizará los archivos encontrados en carpetas para facilitar la búsqueda.
5. Para recuperar un archivo específico, clic derecho sobre él → "Copy", y eliges la ruta de destino (de nuevo: nunca sobre la misma USB, siempre en otra unidad, para no arriesgarte a sobrescribir datos que aún no has recuperado).

### Otra alternativa de recuperación general

Existe también **DMDE**, una herramienta de recuperación con interfaz completa en español, liviana (de menos de 2 MB de descarga), que permite escoger el dispositivo, la partición y ejecutar un "escaneo total". Tras el escaneo, se agrupan los resultados por volúmenes recuperables, y desde ahí puedes explorar carpeta por carpeta y recuperar archivo por archivo con clic derecho → "Recuperar", eligiendo la ubicación de destino. El flujo es esencialmente el mismo que con las herramientas anteriores: escanear todo el dispositivo, no solo una parte, para maximizar lo que se puede rescatar.

### El flujo recomendado, siempre

1. La USB llega con un problema (RAW, no reconocida, error de formato, etc.).
2. **Antes de tocar cualquier herramienta de reparación de controlador**, intenta recuperar el contenido con TestDisk/PhotoRec o Get Data Back.
3. Guarda todo lo recuperado en una unidad distinta.
4. Solo después de asegurar los datos, procede con la reparación a nivel de controlador según el síntoma (Capítulo 3).
5. Una vez reparada, si el cliente quiere sus archivos de vuelta, se los entregas por separado — no dentro de la misma USB reparada, ya que el proceso de reparación la deja vacía.

---

## Capítulo 5: Discos duros y microSD — un mundo distinto

Hasta ahora hemos hablado casi exclusivamente de memorias USB tipo pendrive. Pero los discos duros (internos y externos) y las tarjetas microSD tienen sus propias particularidades, y merecen un capítulo aparte.

### Discos duros: sectores dañados y "vida" del disco

A diferencia de una USB, un disco duro mecánico (HDD) tiene partes físicas en movimiento — platos giratorios y un cabezal de lectura/escritura. Cuando un disco tiene **sectores dañados**, generalmente es porque zonas específicas de la superficie magnética han perdido la capacidad de almacenar datos de forma confiable, ya sea por desgaste, golpes o simple antigüedad.

Es fundamental entender un límite honesto aquí: **si el daño es físico** (un cabezal roto, una aguja partida, un motor que no gira), **no hay software que lo repare**. Ningún programa puede arreglar hardware roto. Todo lo que vamos a ver en este capítulo aplica quirúrgicamente a fallos de **sectores lógicos/magnéticos**, no a fallos mecánicos catastróficos.

**CHKDSK como primer paso (solo para problemas leves)**

Si el disco tiene un problema de comunicación leve (por ejemplo, "tiene problemas de formato" pero el sistema aún lo reconoce y navega parcialmente), puedes intentar primero:

```
chkdsk F: /f
```

(reemplazando F: por la letra que le corresponda). Este comando escanea y corrige problemas en la cadena de archivos. **Importante: este método NO funciona si el disco está en formato RAW** — para eso necesitas el método de diskpart explicado en el Capítulo 3 (clean, create partition, format), asignando el sistema de archivos NTFS en vez de FAT32, ya que los discos duros normalmente usan NTFS.

**Victoria — el programa de referencia para sectores dañados**

Victoria es el software más usado del canal para pruebas y reparación de sectores dañados en discos duros internos y externos. El flujo de uso:

1. Ejecuta como administrador.
2. Selecciona el disco (arriba a la derecha).
3. Ve a "Test and Repair".
4. Elige el tipo de prueba: por defecto viene en "prueba de lectura", que es la más segura para empezar.
5. En la parte inferior, configura qué hacer con los sectores dañados que se encuentren:
   - **Ignore**: ignora el sector malo y sigue — no recomendado.
   - **Remap**: reemplaza el sector dañado con sectores de repuesto que el propio disco reserva para esto. **Esta es la opción recomendada en la mayoría de los casos.**
   - **Erase**: elimina el sector dañado del disco — como contra, puede reducir la capacidad total al eliminar los sectores defectuosos.
6. Clic en "Scan" para iniciar.
7. Durante el escaneo verás una cuadrícula de colores: gris a azul representando sectores buenos, hasta una X en blanco para sectores críticos. El número junto a cada sector indica los milisegundos que tardó en leerse — cuanto más alto, peor el estado de ese sector.
8. El proceso completo puede tardar horas dependiendo de la capacidad del disco (2+ horas para un disco de 1 TB es normal).

**Recomendación crítica**: haz siempre esta prueba con alimentación externa de respaldo (UPS) o al menos con la certeza de que no habrá cortes de corriente — un corte a mitad del proceso puede dejar el disco en peor estado del que tenía.

**HDD Regenerator — alternativa a Victoria**

Otro de los tres programas principales (junto a Victoria y Hard Disk Sentinel) para este tipo de reparación. Su instalación requiere primero ejecutar "Validate" como administrador, ingresando un número de serie que se encuentra en un bloc de notas incluido en la descarga. Una vez validado, ejecutas la aplicación principal como administrador, seleccionas el disco, el modo de análisis (single/multiple sector), el tipo de acceso, y entre las siete opciones de menú eliges la 2 o la 3 (escanear y reparar, en modo lectura o escritura respectivamente) para iniciar el proceso de reparación de sectores.

**Hard Disk Sentinel — reinicialización agresiva de la superficie**

Este es un método más agresivo, recomendado **solo** para discos con muy poca vida útil restante o con una cantidad muy alta de sectores dañados (por ejemplo, más de 7000). No aumenta la vida del disco, pero ayuda a mantenerla estable por más tiempo.

1. Ve a "Disc" → "Surface Test".
2. Elige el disco a analizar.
3. Entre los seis tipos de prueba disponibles, las dos relevantes para reparación son: **opción 5, reinicializar la superficie del disco** (recomendada cuando hay muchísimos sectores dañados, demasiados para intentar repararlos uno por uno), y **opción 6, prueba de lectura con reparación de sectores** (similar al enfoque de Victoria).
4. Antes de iniciar, haz respaldo de cualquier dato importante — el proceso puede borrar toda la información del disco.
5. Da "Start Test". Verás el mismo sistema de cuadrícula de colores: verde (sectores buenos), amarillo (sectores dañados) y rojo (sectores críticos).
6. **Nota importante**: si detienes o el proceso termina, el disco puede aparecer sin volumen ni partición, como si fuera nuevo. Tendrás que ir al Administrador de discos y volver a inicializarlo.

### MicroSD: un caso aparte

Las tarjetas microSD comparten cierta lógica con las USB, pero **no puedes tratarlas con las herramientas de controlador de USB** — usan chips y protocolos distintos. Además, hay una limitación importante que debes conocer desde el principio: **los métodos de este capítulo solo sirven para problemas de formato** (la SD no se deja formatear, pide formato, etc.). **Si la SD está protegida contra escritura o simplemente no aparece en la PC, estos métodos no van a funcionar.**

**SD Formatter**

Herramienta oficial y sencilla, pensada específicamente para tarjetas SD/microSD:

1. Instala normalmente (siguiente → instalar → finalizar).
2. Ejecuta como administrador — detecta automáticamente la letra y capacidad de tu tarjeta.
3. En "Opciones", elige el tipo de formato: rápido, borrado completo, o borrado sobreescribiendo.
4. Da clic en "Format", confirma las advertencias (no desconectes la tarjeta durante el proceso).
5. En segundos debería quedar formateada y lista.

**Low Level Format Tool**

Para casos donde SD Formatter no resuelve el problema, esta herramienta de formateo de bajo nivel suele tener mejores resultados:

1. Ejecútala como administrador.
2. Ingresa el número de serie (viene en un bloc de notas junto a la aplicación) en el campo "Enter Code" y da "Submit".
3. Selecciona el dispositivo (evita la opción SATA, que es para discos internos) y da "Continue".
4. Ve al apartado "Low Level Format", marca la opción de formateo rápido de bajo nivel (para no alargar demasiado el proceso — aunque un formateo completo es más efectivo si tienes tiempo).
5. Da "Formatear dispositivo", confirma la advertencia de que todo se borrará.
6. Al finalizar el bajo nivel, ve al explorador de Windows e intenta un formateo normal — en la mayoría de los casos ahora sí se completará sin problemas.

---

## Capítulo 6: Cuidado con lo que compras — falsificaciones y velocidad real

Este capítulo cambia un poco de enfoque: en vez de reparación, vamos a hablar de cómo protegerte (a ti o a tus clientes) de comprar dispositivos de almacenamiento que no son lo que dicen ser.

### La diferencia entre "menos espacio del prometido" y una estafa real

Antes de hablar de falsificaciones, hay que aclarar algo que mucha gente confunde con una estafa sin serlo: **es normal y esperado** que una USB de "16 GB" muestre en Windows algo como 14.9 GB de capacidad real, o que un disco externo de "1 TB" muestre 931 GB.

Esto sucede porque los fabricantes anuncian la capacidad usando el **sistema decimal** (1 GB = 1,000 MB), mientras que el sistema operativo mide el almacenamiento en **sistema binario** (1 GB = 1,024 MB). Al convertir de uno a otro, se "pierden" aproximadamente 70 MB por cada gigabyte contado. Como referencia:

- 16 GB anunciados → ~14.9 GB reales
- 32 GB anunciados → ~29.8 GB reales
- 64 GB anunciados → ~59.5 GB reales
- 1 TB anunciado → ~931 GB reales

Esto **no es una estafa**, es simplemente cómo funciona la aritmética binaria contra la decimal. Si ves esta diferencia, tu dispositivo está bien.

### La verdadera estafa: capacidad falseada por software

Ahora sí, el problema real: existen memorias USB donde, mediante manipulación del firmware del controlador, se hace que el dispositivo **reporte** una capacidad mucho mayor a la que físicamente tiene. Por ejemplo, una USB con solo 4 GB reales de flash que el sistema operativo "ve" como si tuviera 16 GB o incluso más.

El problema con estas memorias es que técnicamente puedes empezar a copiar archivos y el sistema te dejará "llenarlas" hasta el número falso indicado — pero en cuanto superas la capacidad física real, empiezas a **sobrescribir silenciosamente** los archivos que ya habías copiado, sin ningún aviso de error visible en el momento. Te enteras cuando intentas abrir esos archivos después y están corruptos o simplemente no existen.

### Cómo verificar si una USB tiene capacidad falseada

La herramienta de referencia para esto es **H2testw**, gratuita y muy liviana:

1. Descárgala y extráela.
2. Si la USB tiene archivos, primero fórmatela para dejarla completamente vacía.
3. Abre H2testw, cambia el idioma a español o inglés si es necesario.
4. Da clic en "Select Target" (seleccionar destino) y elige tu USB.
5. Marca la opción de escribir una cantidad determinada de datos (empieza con un valor pequeño, por ejemplo 2000 MB, para una primera prueba rápida).
6. Da clic en "Write + Verify" y acepta la advertencia.
7. El programa escribirá esa cantidad de datos y luego los verificará byte por byte.
8. Si **no hay errores**, esa porción de capacidad es real. Si **hay errores**, te dirá exactamente cuántos GB fueron correctos antes de empezar a fallar — ese número es la capacidad real de tu memoria.

Para repetir la prueba con un valor mayor, tienes que borrar los archivos que dejó H2testw o simplemente reformatear la USB.

### Cómo reparar una memoria con capacidad falseada

Una vez que sabes cuál es la capacidad real (gracias a H2testw), puedes usar una herramienta como **RMPrepUSB** para "recortar" la memoria a su capacidad verdadera y evitar que siga reportando el número falso:

1. Ejecuta como administrador.
2. En "Partition Size" ingresa la capacidad real detectada (por ejemplo, si H2testw detectó 3.7 GB reales, pones 3700 MB).
3. Opcionalmente cambia el nombre de la unidad.
4. En formato, elige FAT32.
5. Da clic en "Prepare Drive" y acepta las ventanas de confirmación.

El resultado será una USB con menos capacidad "de etiqueta" pero **100% confiable**: ya no vas a perder archivos por sobrescritura silenciosa, ni vas a tener copias lentas o videos que no abren (síntomas típicos de una memoria con capacidad falseada).

### Discos duros externos falsos (pendrives disfrazados)

Existe otra variante de esta estafa, más agresiva: discos duros externos que, si los abrieras (perdiendo la garantía en el proceso), resultarían ser simplemente una memoria USB corriente conectada a una interfaz USB 3.0, metida dentro de una carcasa de disco duro. Aquí van dos señales para detectarlo **sin necesidad de abrir el dispositivo**:

**1. Velocidad de escritura**

Un disco duro externo real, cuando está nuevo, normalmente supera los 100 MB/s de velocidad de escritura. Una memoria USB (incluso una buena, USB 3.0) ronda los 12-15 MB/s en promedio. Si un "disco duro" que compraste transfiere a velocidades de memoria USB, es una señal de alerta fuerte.

**2. Los datos de ChipGenius**

Esta es la prueba definitiva. Conecta el dispositivo y abre ChipGenius:

- Un disco duro externo real (Toshiba, Western Digital, Seagate, etc.) mostrará como fabricante el nombre real de la marca, y en la opción "Power Detection" siempre te va a dar como respuesta un "No" — **nunca** va a aparecer un chip controlador de USB como Phison, Alcor Micro o FirstChip detrás de un disco duro genuino.
- Un disco duro falso (pendrive disfrazado) mostrará como fabricante algo genérico ("Vendor Co." o similar, no una marca reconocida) y, al revisar los datos, aparecerá un controlador de USB perfectamente identificable — Phison, FirstChip, etc. — con una capacidad real mucho menor a la anunciada en el empaque.

Otra pista adicional: los discos duros, sea cual sea su capacidad, vienen formateados de fábrica en **NTFS**. Si un "disco duro externo" te llega formateado en **exFAT**, es otra señal sospechosa de que en realidad es una memoria USB.

### Comprobación de velocidad real (sin instalar nada)

Windows tiene un comando nativo, sin necesidad de instalar software de terceros, para medir la velocidad real de cualquier unidad de almacenamiento (USB, disco duro, SSD, tarjeta SD):

1. Abre CMD como administrador.
2. Escribe: `winsat disk -drive` seguido de la letra de la unidad (por ejemplo, `winsat disk -drive E`).
3. En segundos obtendrás la velocidad de lectura (y en algunos casos de escritura) reales del dispositivo, en MB/s.

Como referencia de lo que puedes esperar según el tipo de unidad: una USB estándar puede rondar unos pocos MB/s de lectura; un disco duro mecánico (HDD) puede estar en el rango de 150-180 MB/s tanto en lectura como en escritura; y un SSD NVMe puede superar fácilmente los 2000 MB/s de lectura y 1300 MB/s de escritura. Si tu dispositivo rinde muy por debajo de lo esperado para su categoría, combínalo con la revisión de ChipGenius para descartar una falsificación.

### Qué marcas dan más y menos problemas (15 años de experiencia)

Esta sección resume observaciones acumuladas a lo largo de 15 años reparando cientos de miles de memorias USB. No es un ataque a ninguna marca ni contenido patrocinado — es simplemente el patrón que se repite una y otra vez en el taller.

- **ADATA**: marca confiable, sus USB no suelen ser falsificaciones (siempre tienen controlador real detrás, generalmente Innostor o similar). El modelo UV18 (azul y amarillo) tiene un problema recurrente de soldadura interna del chip que provoca desconexiones intermitentes — pero en la gran mayoría de los casos observados, el problema real es de software/firmware, no de soldadura física.
- **Mtec**: fabricación buena y estable en general, aunque el controlador (frecuentemente Alcor Micro, a veces Phison) puede fallar con los síntomas típicos: no reconocida, "inserte un disco", RAW.
- **Maxell**: buena fabricación, pero el controlador (usualmente Phison o Alcor Micro) falla con cierta frecuencia — "inserte un disco", no reconocida, protección contra escritura.
- **Kingston**: la marca más distribuida a nivel mundial y, por lo tanto, la más reparada. La DataTraveler 101 G2 tiende a "inserte un disco", RAW y no reconocida. La DataTraveler 100 G3 tiende a protegerse contra escritura con facilidad (se repara comúnmente con Restore 3.17 cuando el Flash ID es Hynix). La Kingston Exodia (controlador Phison PS2251-1, entre otros) también se protege contra escritura con frecuencia, y para algunas variantes de su controlador **aún no existe herramienta compatible disponible** — vale la pena verificar el estado actual de las herramientas antes de prometer una reparación.
- **SanDisk**: marca de gran renombre, pero con una limitación seria: cuando se protege contra escritura (algo que ocurre con cierta frecuencia, sin importar cuántos años de uso tenga), **no existe reparación por software**, tal como se explicó en el Capítulo 3. Puede durar años sin problemas o fallar al año — es impredecible, y cuando falla, no hay vuelta atrás con las herramientas actuales.
- **Transcend**: la marca con **menos** reparaciones registradas en 15 años de experiencia — la de mejor estabilidad general observada. Cuando falla (controlador principalmente Alcor Micro, modelos AU6989SN y AU6987), presenta los síntomas típicos ya conocidos, pero ocurre con mucha menor frecuencia que en otras marcas.

Conclusión honesta: no existe la memoria USB perfecta. Todas las marcas tienen sus puntos débiles. Pero conocer estos patrones te ayuda a poner expectativas realistas — tanto a la hora de recomendar una compra como a la hora de saber qué tan probable es lograr una reparación exitosa según la marca que te llega al taller.

---

## Capítulo 7: Qué hacer según el problema — tu mapa de decisión

Este capítulo cierra el curso con un flujo de decisión completo, para que en cualquier reparación futura sepas exactamente por dónde empezar y a dónde ir según lo que encuentres.

### El flujo completo, paso a paso

**Paso 1 — ¿Hay datos importantes dentro?**
Si la respuesta es sí (o no lo sabes con certeza), recupera primero con TestDisk/PhotoRec o Get Data Back (Capítulo 4), guardando todo en una unidad distinta. Nunca repares el controlador antes de intentar esto.

**Paso 2 — Diagnostica con ChipGenius**
Conecta el dispositivo, abre ChipGenius como administrador, y anota los tres datos clave: Controlador, Número de controlador, Flash ID. Si es un disco duro externo, aprovecha también para verificar si es genuino (Capítulo 6) revisando el campo de fabricante y la respuesta de "Power Detection".

**Paso 3 — Clasifica el tipo de dispositivo**
- ¿Es una memoria USB tipo pendrive? → Ve al Paso 4.
- ¿Es una microSD? → Ve directo al Capítulo 5 (SD Formatter o Low Level Format Tool), recordando que solo sirve para problemas de formato, no para protección contra escritura ni para SD no reconocidas.
- ¿Es un disco duro (interno o externo, mecánico)? → Ve directo al Capítulo 5 (CHKDSK para problemas leves, diskpart para RAW, Victoria/HDD Regenerator/Hard Disk Sentinel para sectores dañados).

**Paso 4 — Para memorias USB: identifica el síntoma**
- **RAW o no completa el formato** → intenta CMD/diskpart primero; si falla, herramienta de controlador (Capítulo 3, síntoma 1 y 2).
- **Protección contra escritura** → intenta `attributes disk clear readonly`; si falla, herramienta de controlador — salvo que sea SanDisk Cruzer, en cuyo caso no hay solución por software (Capítulo 3, síntoma 3).
- **"Inserte un disco en unidad USB"** → directo a herramienta de controlador (Capítulo 3, síntoma 4).
- **"No hay medios" / disco extraíble fantasma** → directo a herramienta de controlador, sin asustarte por la lectura de "0 GB" inicial (Capítulo 3, síntoma 5).
- **No se reconoce en absoluto** → prueba otro puerto/PC para confirmar, luego herramienta de controlador (Capítulo 3, síntoma 6).

**Paso 5 — Si ChipGenius dice "Unknown"**
Detente. No hay herramienta que pueda reparar un controlador que ni siquiera se identifica. O está dañado irreversiblemente, o es una copia/clon no estandarizado. No pierdas tiempo ni prometas una reparación en este caso.

**Paso 6 — Busca la herramienta exacta**
Con Controlador + Número + Flash ID en mano, busca en la tabla de solucionadas (documento PDF por marca de controlador) la herramienta exacta usada en un caso con esos mismos datos. Si prefieres una vía más rápida, usa el buscador de casos por modelo (explicado más abajo) en vez de revisar el PDF manualmente.

**Paso 7 — Ejecuta y verifica**
Ejecuta la herramienta como administrador, espera el reconocimiento automático, da Start/Restore/Recover según corresponda, espera la confirmación (verde, azul, u otro indicador según la herramienta), y finalmente formatea desde Windows para confirmar que quedó 100% funcional.

### Dónde conseguir las herramientas

Todo lo mencionado en esta guía —ChipGenius, la tabla de solucionadas, y los paquetes de herramientas organizados por marca de controlador (Alcor Micro, Phison, Chipsbank, SMI, Innostor, FirstChip, ITE/USBest, Solid State System, Appotech, Asolid, Skymedi, Silicon Go, entre otros)— está disponible de forma organizada en:

**dtechusb.pages.dev**

Ahí vas a encontrar, además de las descargas por controlador, dos secciones adicionales muy útiles con tutoriales en video: cómo quitar la protección contra escritura, y cómo formatear de exFAT a FAT32.

### La forma más rápida de encontrar tu solución: el mini app de Telegram

Si no quieres revisar manualmente la tabla de solucionadas PDF por PDF, D-Tech USB tiene una **mini app de Telegram** conectada a una base de datos de más de **587 casos reales de reparación**. Solo tienes que introducir la marca y el modelo de tu USB (o los datos de ChipGenius si los tienes), y el sistema te indica directamente qué herramienta se usó en un caso ya documentado y exitoso con esas características. Es, en la práctica, la forma más rápida de saltarte la búsqueda manual y llegar directo a la herramienta correcta.

### Reflexión final

Si llegaste hasta aquí, ya tienes en tu cabeza exactamente el mismo proceso mental que yo uso cada vez que se sienta frente a mí una USB, un disco duro o una microSD dañada: identificar antes de actuar, respetar los datos exactos del ChipGenius, recuperar antes de reparar, y usar siempre la herramienta que corresponde — nunca "probar a ver si pega".

Con esto ya no dependes de encontrar "el video exacto" con tu mismo problema cada vez que se te dañe una memoria. Tienes el método completo. Practícalo, repítelo, y en poco tiempo vas a poder diagnosticar y resolver la gran mayoría de los casos que te lleguen, sin importar la marca ni el modelo.

Si esta guía te resultó útil, considera suscribirte al canal de YouTube **D-Tech USB (@dtechusb2510)**, donde subimos reparaciones nuevas cada semana cubriendo controladores y casos que no entraron en esta edición. Y si quieres seguir ampliando tu kit de herramientas y acceso a nuevos casos documentados, aquí tienes el siguiente paso:

**[LINK DE COMPRA]**

**[PRECIO]**

Nos vemos en la próxima reparación.

— Daimel, D-Tech USB
