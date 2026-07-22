# -*- coding: utf-8 -*-
"""Datos y artículos de la web de psicología/relaciones.
Artículos basados en los 12 videos más vistos del canal (con su vídeo embebido).
Editar aquí; luego ejecutar build.py"""

SITE = {
    "name": "Seducción e Infidelidades",
    "tagline": "Psicología femenina, relaciones y señales de infidelidad",
    "domain": "https://seduccioninfidelidades.pages.dev",  # cambiar por tu URL/dominio real
    "facebook": "https://www.facebook.com/",  # <-- pon aquí el enlace de tu página
    "description": "Aprende a entender la psicología femenina, reconocer las señales de una "
                   "infidelidad y mejorar tus relaciones de pareja. Artículos claros, directos y "
                   "con vídeo sobre atracción, comportamiento y confianza.",
    # ==== HUECOS DE ADSTERRA (pega aquí tus <script> cuando crees esta web en Adsterra) ====
    # Deja el string vacío "" para que salga un placeholder "Publicidad" mientras tanto.
    "ad_top": "<script type=\"text/javascript\">atOptions={'key':'4cc6893bc84e7afeb251d2250af83ae9','format':'iframe','height':90,'width':728,'params':{}};</script><script type=\"text/javascript\" src=\"https://www.highperformanceformat.com/4cc6893bc84e7afeb251d2250af83ae9/invoke.js\"></script>",  # banner superior 728x90
    "ad_incontent": "",# 300x250 dentro del artículo (el que MÁS CPM da)
    "ad_native": "<script async=\"async\" data-cfasync=\"false\" src=\"https://pl30477756.effectivecpmnetwork.com/758335b1c8d20ccab8242f1ba293f8e5/invoke.js\"></script><div id=\"container-758335b1c8d20ccab8242f1ba293f8e5\"></div>",  # native banner
    "ad_bottom": "",   # banner inferior
    "ad_social": "",   # social bar (script, va en todas las páginas)
}

# slug, title, cat, summary, yt (id de YouTube), body=[(subtítulo,[párrafos])]
ARTICLES = [
    {
        "slug": "cambios-comportamiento-mujer-infiel",
        "title": "10 cambios de comportamiento que delatan a una mujer infiel",
        "cat": "Infidelidad",
        "yt": "LlNoPlZRYvA",
        "summary": "Cuando alguien se involucra emocionalmente con otra persona, su conducta cambia. "
                   "Estos son los cambios más reveladores… y cómo interpretarlos sin caer en la paranoia.",
        "body": [
            ("Los cambios importan más que los hechos aislados",
             ["La infidelidad casi nunca se descubre por un solo detalle, sino por un "
              "<strong>patrón de cambios</strong> que aparecen juntos. Lo relevante no es que haga "
              "algo puntual, sino que empiece a comportarse de una forma distinta a la habitual sin "
              "una explicación clara."]),
            ("1. Cambia su relación con el teléfono",
             ["Empieza a alejar el móvil, cambia contraseñas o lo lleva a todas partes. Si antes no "
              "le daba importancia y ahora sí, es un cambio a observar."]),
            ("2. Se muestra más distante emocionalmente",
             ["La distancia emocional suele notarse antes que cualquier otra cosa: menos "
              "conversaciones profundas, menos interés en los planes de pareja, menos conexión."]),
            ("3. Cuida su aspecto de forma repentina",
             ["Un cambio brusco en cómo se arregla, sobre todo si coincide con salidas o horarios "
              "nuevos. Ojo: también puede ser simple crecimiento personal."]),
            ("4. Se irrita cuando preguntas cosas normales",
             ["La culpa a menudo se disfraza de enfado. Reaccionar a la defensiva ante preguntas "
              "cotidianas puede ser una forma de desviar la atención."]),
            ("Conclusión",
             ["Ninguna señal aislada prueba nada. Lo más sano es observar el conjunto y, sobre todo, "
              "<strong>hablar con honestidad</strong>. Muchas veces lo que parece engaño es un "
              "problema de la relación que aún se puede resolver. Mira el vídeo para el análisis completo."]),
        ],
    },
    {
        "slug": "hombres-40-dejan-de-ser-atractivos",
        "title": "Por qué muchos hombres dejan de ser atractivos después de los 40 (sin darse cuenta)",
        "cat": "Atracción",
        "yt": "N6dwBSuhG3E",
        "summary": "No es la edad: son ciertos hábitos que se instalan con los años y apagan el "
                   "atractivo. La buena noticia es que todos se pueden revertir.",
        "body": [
            ("No es la edad, son los hábitos",
             ["El atractivo después de los 40 no depende de los años, sino de cómo te cuidas por "
              "dentro y por fuera. Muchos hombres pierden atractivo no por envejecer, sino por "
              "<strong>dejarse llevar</strong> por rutinas que apagan su energía."]),
            ("1. Abandonar el cuidado físico",
             ["Dejar de moverte, descuidar la alimentación y el descanso no solo afecta al cuerpo: "
              "afecta a tu energía, tu postura y tu seguridad. Y eso se nota."]),
            ("2. Perder la curiosidad",
             ["Un hombre que deja de aprender, de tener proyectos e ilusiones se vuelve predecible. "
              "La curiosidad y las metas mantienen viva la chispa a cualquier edad."]),
            ("3. Quejarse y vivir en negativo",
             ["La actitud pesa más que las arrugas. La queja constante y el pesimismo restan "
              "atractivo mucho más rápido que el paso del tiempo."]),
            ("4. Descuidar la relación",
             ["Dar por sentada a la pareja, dejar de sorprender y de comunicar apaga la conexión. "
              "El atractivo también se cultiva dentro de la relación."]),
            ("Conclusión",
             ["La madurez puede ser tu mayor atractivo si la acompañas de cuidado, actitud y "
              "propósito. Todo esto se trabaja. En el vídeo lo desarrollo con ejemplos."]),
        ],
    },
    {
        "slug": "como-detectar-infidelidad-femenina",
        "title": "Cómo detectar la infidelidad femenina: 6 señales psicológicas",
        "cat": "Infidelidad",
        "yt": "1q9T8lo-ViY",
        "summary": "Seis señales que la psicología asocia con el engaño, explicadas con equilibrio: "
                   "para salir de la duda sin convertirte en un detective obsesivo.",
        "body": [
            ("Observar sin obsesionarse",
             ["Vivir revisando a tu pareja destruye la relación aunque no haya infidelidad. El "
              "objetivo de estas señales no es espiar, sino <strong>recuperar la tranquilidad</strong>: "
              "o confirmas que todo está bien, o afrontas un problema real."]),
            ("1. Distancia emocional repentina",
             ["La señal más fiable no es el móvil ni las salidas, sino el alejamiento emocional: "
              "dejáis de compartir, de reír y de conectar como antes."]),
            ("2. Exceso de justificaciones",
             ["Cuando alguien da demasiados detalles innecesarios para explicar dónde estuvo, a "
              "veces la mentira necesita adornarse de más."]),
            ("3. Cambios en la intimidad",
             ["Un cambio brusco (mucho menos, o de repente muy distinto) puede reflejar que la "
              "energía emocional está puesta en otra parte."]),
            ("4. Actitud defensiva ante preguntas normales",
             ["Si preguntar algo cotidiano provoca enfado o acusaciones de \"controlar\", puede ser "
              "una forma de esquivar el tema."]),
            ("Conclusión",
             ["Estas señales valen como aviso, no como prueba. La herramienta más poderosa sigue "
              "siendo <strong>la conversación honesta</strong>. Mira el vídeo para verlas en detalle."]),
        ],
    },
    {
        "slug": "cosas-que-las-mujeres-quieren-de-un-hombre",
        "title": "7 cosas que las mujeres quieren de un hombre pero rara vez dicen",
        "cat": "Psicología femenina",
        "yt": "1v8SZb1SWMI",
        "summary": "Más allá de lo físico, esto es lo que de verdad genera conexión y atracción "
                   "duradera según la psicología de las relaciones.",
        "body": [
            ("Lo que no se pide con palabras",
             ["Muchas necesidades en una relación no se expresan directamente, pero se sienten. "
              "Entenderlas no es manipular: es <strong>conectar mejor</strong> con tu pareja."]),
            ("1. Seguridad emocional",
             ["Sentir que pueden confiar, que no habrá dramas ni sorpresas desagradables. La "
              "estabilidad emocional es enormemente atractiva."]),
            ("2. Sentirse escuchada de verdad",
             ["No siempre buscan una solución: muchas veces buscan sentirse comprendidas. Escuchar "
              "sin interrumpir ni minimizar vale oro."]),
            ("3. Un hombre con propósito",
             ["Tener metas, dirección y pasión propia resulta muy atractivo. La ambición sana "
              "transmite seguridad."]),
            ("4. Coherencia",
             ["Que lo que dices y lo que haces coincidan. La coherencia construye confianza como "
              "ninguna otra cosa."]),
            ("Conclusión",
             ["No hay trucos: trabajar en ti (seguridad, escucha, propósito y coherencia) te hace "
              "atractivo de forma genuina y duradera. En el vídeo lo explico entero."]),
        ],
    },
    {
        "slug": "frases-que-dice-una-mujer-infiel",
        "title": "10 frases que suele decir una persona infiel para no ser descubierta",
        "cat": "Infidelidad",
        "yt": "GcH5kTrPfiE",
        "summary": "El lenguaje delata. Estas frases, cuando aparecen juntas, suelen indicar "
                   "distancia emocional o algo que se oculta.",
        "body": [
            ("Por qué el lenguaje revela tanto",
             ["Cuando alguien esconde algo, su forma de hablar cambia: aparece la vaguedad y la "
              "actitud defensiva. Estas frases no condenan a nadie, pero son señales para "
              "<strong>prestar atención y hablar</strong>."]),
            ("\"Estás imaginando cosas\"",
             ["Hacerte dudar de tu propia percepción es una forma de cerrar la conversación en lugar "
              "de aclararla."]),
            ("\"Solo es un amigo, no seas celoso\"",
             ["Minimizar una relación antes de que nadie acuse a veces revela que ocupa más espacio "
              "del que admite."]),
            ("\"No tengo que darte explicaciones de todo\"",
             ["La privacidad es sana; el secretismo defensivo usado para bloquear cualquier pregunta, "
              "no tanto."]),
            ("Conclusión",
             ["Son señales, no pruebas. Lo más maduro es expresar cómo te sientes y observar la "
              "reacción: una relación sana resiste esa conversación. Mira el vídeo para las 10 frases."]),
        ],
    },
    {
        "slug": "si-ella-hace-esto-te-esta-engañando",
        "title": "Si tu pareja hace esto, podría estar engañándote: cómo saberlo",
        "cat": "Infidelidad",
        "yt": "A3urpf30oBw",
        "summary": "Una guía equilibrada para leer las señales sin volverte paranoico y, sobre todo, "
                   "para saber cuándo toca hablar.",
        "body": [
            ("Leer señales, no inventar pruebas",
             ["El objetivo no es acusar, sino entender. Un cambio aislado no significa nada; lo "
              "importante es el <strong>patrón sostenido</strong> en varios frentes."]),
            ("Cambios de horario y disponibilidad",
             ["Ausencias nuevas, horarios que no cuadran o menos tiempo para la relación, "
              "especialmente si aparecen de golpe."]),
            ("Menos intimidad y complicidad",
             ["Cuando la conexión emocional baja de forma notable, suele ser más revelador que "
              "cualquier detalle del móvil."]),
            ("Reacciones desproporcionadas",
             ["Enfadarse por preguntas normales o acusarte de desconfiar puede ser una forma de "
              "desviar la atención."]),
            ("Conclusión",
             ["Ante la duda, no espíes: <strong>habla</strong>. Expresa cómo te sientes y observa la "
              "respuesta. Una relación en la que necesitas vigilar ya tiene un problema de fondo. "
              "En el vídeo lo desarrollo."]),
        ],
    },
    {
        "slug": "profesiones-femeninas-mas-infieles",
        "title": "¿Existen profesiones con más infidelidad? Lo que dicen los estudios",
        "cat": "Infidelidad",
        "yt": "aI35cFxG2Mo",
        "summary": "Algunas encuestas relacionan ciertos entornos laborales con más infidelidad. "
                   "Analizamos por qué… y por qué la profesión no determina a la persona.",
        "body": [
            ("La profesión no define a nadie",
             ["Antes de nada: ninguna profesión hace infiel a nadie. Lo que algunas encuestas "
              "muestran es que ciertos <strong>entornos</strong> (mucho contacto social, viajes, "
              "horarios flexibles) ofrecen más oportunidades. La decisión siempre es personal."]),
            ("Por qué influye el entorno",
             ["Trabajos con mucha interacción, desplazamientos o horarios irregulares crean más "
              "situaciones de cercanía y menos control externo. Es contexto, no destino."]),
            ("Lo que de verdad predice la infidelidad",
             ["Más que la profesión, pesan la satisfacción en la relación, los valores personales y "
              "la comunicación. Una relación sólida resiste cualquier entorno."]),
            ("Cuidado con los prejuicios",
             ["Sospechar de tu pareja por su trabajo solo genera conflictos. La confianza se "
              "construye con comunicación, no con etiquetas."]),
            ("Conclusión",
             ["El entorno puede dar oportunidades, pero la fidelidad depende de la persona y de la "
              "relación. En el vídeo analizo los datos y los matices."]),
        ],
    },
    {
        "slug": "cuando-dejas-de-hablarle-a-una-mujer",
        "title": "Qué pasa cuando dejas de hablarle a una mujer (visto desde el estoicismo)",
        "cat": "Atracción",
        "yt": "Eh3iWecyXv8",
        "summary": "No es la ley del hielo ni un truco de manipulación: es recuperar tu centro y tu "
                   "dignidad, y cómo eso cambia la dinámica.",
        "body": [
            ("Silencio no es castigo",
             ["Aclaremos algo: no hablamos de la ley del hielo para castigar (eso es manipulación y "
              "daña la relación). Hablamos del <strong>silencio maduro</strong>: dejar de perseguir, "
              "insistir y rogar."]),
            ("El problema de perseguir",
             ["Cuando ruegas o persigues, transmites que tu bienestar depende por completo de la "
              "otra persona. Eso, lejos de acercar, genera rechazo."]),
            ("Recuperar tu centro",
             ["Volver a tus metas, tus amigos y tus rutinas hace que tu vida recupere valor propio. "
              "Dejas de depender emocionalmente de una sola persona."]),
            ("El cambio de dinámica",
             ["Al dejar de perseguir, la relación se equilibra. A veces reaviva el interés; otras, "
              "simplemente te libera de algo que no te convenía."]),
            ("Conclusión",
             ["El estoicismo enseña a poner el foco en lo que sí controlas: tú. Eso, casi siempre, "
              "cambia cómo te ven y cómo te sientes. Mira el vídeo para el desarrollo completo."]),
        ],
    },
    {
        "slug": "donde-se-esconde-una-infidelidad-en-el-telefono",
        "title": "10 lugares del teléfono donde suele esconderse una infidelidad",
        "cat": "Infidelidad",
        "yt": "8yycFgY23lE",
        "summary": "Apps ocultas, chats archivados y otros escondites digitales. Lo explicamos para "
                   "entender señales, no para invadir la privacidad de nadie.",
        "body": [
            ("Un aviso importante",
             ["Este contenido es para <strong>entender comportamientos</strong>, no para espiar. "
              "Revisar el teléfono de tu pareja sin permiso rompe la confianza y a menudo empeora "
              "todo, haya o no infidelidad."]),
            ("Apps y chats archivados",
             ["Conversaciones archivadas, silenciadas o dentro de apps de mensajería secundarias son "
              "escondites habituales de quien oculta algo."]),
            ("Álbumes y carpetas ocultas",
             ["Galerías privadas o carpetas bloqueadas dentro del móvil pueden guardar lo que no se "
              "quiere mostrar."]),
            ("Segundas cuentas",
             ["Perfiles secundarios en redes sociales o cuentas duplicadas son otra señal frecuente."]),
            ("Conclusión",
             ["Más que buscar pruebas, lo sano es <strong>hablar</strong>. Si sientes que necesitas "
              "espiar constantemente, el problema de fondo es la falta de confianza. En el vídeo lo "
              "explico con equilibrio."]),
        ],
    },
    {
        "slug": "cosas-que-hace-una-mujer-infiel-al-llegar-a-casa",
        "title": "5 comportamientos que a veces delatan una infidelidad al llegar a casa",
        "cat": "Infidelidad",
        "yt": "zaprve8fhqQ",
        "summary": "Pequeños gestos al volver a casa que, en conjunto, pueden indicar que algo no va "
                   "bien. Siempre desde el equilibrio y sin paranoia.",
        "body": [
            ("El conjunto, no el gesto suelto",
             ["Ninguno de estos comportamientos prueba nada por sí solo. Lo relevante es que "
              "aparezcan <strong>varios juntos y de forma nueva</strong>."]),
            ("1. Ir directa a la ducha sin motivo",
             ["Un cambio repentino de rutina al llegar, sin explicación, puede llamar la atención "
              "(aunque también puede ser simple costumbre)."]),
            ("2. Evitar el contacto o la conversación",
             ["Llegar y evitar mirar a los ojos o esquivar la charla habitual puede reflejar "
              "incomodidad o culpa."]),
            ("3. Revisar el teléfono nada más entrar",
             ["Una necesidad nueva de comprobar el móvil de inmediato, protegiéndolo, es una señal "
              "a observar."]),
            ("Conclusión",
             ["Recuerda: son señales, no sentencias. La clave está en el patrón y en "
              "<strong>hablarlo</strong>, no en vigilar. Mira el vídeo para las 5 completas."]),
        ],
    },
    {
        "slug": "señales-de-madurez-en-las-relaciones",
        "title": "12 señales psicológicas de que tienes madurez en las relaciones",
        "cat": "Psicología femenina",
        "yt": "tnYAnIVzw2s",
        "summary": "La madurez emocional es lo que sostiene una relación sana. Estas son las señales "
                   "de que la tienes… o de que puedes desarrollarla.",
        "body": [
            ("Qué es la madurez emocional",
             ["No es no sentir, sino <strong>gestionar</strong> lo que sientes. Es la base de las "
              "relaciones sanas y duraderas, y se puede aprender a cualquier edad."]),
            ("1. Comunicas en lugar de explotar o callar",
             ["Expresas lo que te molesta con calma, sin gritos ni silencios de castigo."]),
            ("2. Respetas el espacio del otro",
             ["Entiendes que dos personas sanas conservan su independencia dentro de la relación."]),
            ("3. Asumes tu parte en los conflictos",
             ["En lugar de culpar siempre al otro, reconoces qué puedes mejorar tú."]),
            ("4. No dependes emocionalmente",
             ["Disfrutas la relación desde el deseo, no desde la necesidad desesperada."]),
            ("Conclusión",
             ["La madurez emocional es la mejor inversión para cualquier relación: atrae, retiene y "
              "da paz. En el vídeo repaso las 12 señales."]),
        ],
    },
    {
        "slug": "señales-ocultas-de-una-mujer-infiel",
        "title": "Mujer infiel: 10 señales ocultas que muchos hombres ignoran",
        "cat": "Infidelidad",
        "yt": "gQ7pIGNLRb4",
        "summary": "Señales sutiles que pasan desapercibidas porque no son obvias. Aprende a leerlas "
                   "con criterio y sin obsesión.",
        "body": [
            ("Lo sutil pesa más que lo obvio",
             ["Las señales evidentes son fáciles de ver; las <strong>sutiles</strong> son las que se "
              "escapan. Pero recuerda: ninguna prueba nada por sí sola."]),
            ("1. Cambios en la comunicación",
             ["Menos mensajes cariñosos, respuestas más cortas o conversaciones más frías de lo "
              "habitual."]),
            ("2. Nuevos intereses inexplicados",
             ["Aficiones, música o vocabulario nuevos que aparecen de repente sin un origen claro."]),
            ("3. Protección excesiva del móvil",
             ["Un cambio marcado en cómo cuida y esconde el teléfono respecto a antes."]),
            ("4. Menos proyección de futuro",
             ["Deja de hablar de planes a largo plazo o los evita, señal de desconexión emocional."]),
            ("Conclusión",
             ["Estas señales sirven para estar atento, no para acusar. La solución siempre pasa por "
              "<strong>la comunicación</strong>. Mira el vídeo para las 10 señales completas."]),
        ],
    },
]
