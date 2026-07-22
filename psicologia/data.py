# -*- coding: utf-8 -*-
"""Datos y artículos de la web de psicología/relaciones.
Editar aquí para añadir artículos; luego ejecutar build.py"""

SITE = {
    "name": "Seducción e Infidelidades",
    "tagline": "Psicología femenina, relaciones y señales de infidelidad",
    "domain": "https://seduccioninfidelidades.pages.dev",  # cambiar por tu URL/dominio real
    "facebook": "https://www.facebook.com/",  # <-- pon aquí el enlace de tu página
    "youtube": "",  # opcional: enlace de tu canal
    "description": "Aprende a entender la psicología femenina, reconocer las señales de una "
                   "infidelidad y mejorar tus relaciones. Artículos claros y directos sobre "
                   "seducción, atracción y comportamiento en pareja.",
    # Rellena con tus códigos de Adsterra cuando crees esta web en tu panel:
    "ad_top": "",     # <script> banner superior
    "ad_mid": "",     # <script> banner en medio
    "ad_bottom": "",  # <script> banner inferior
    "ad_native": "",  # <script> native banner
    "ad_social": "",  # <script> social bar
}

# slug, título, resumen, categoría, cuerpo (lista de (subtítulo, párrafos))
ARTICLES = [
    {
        "slug": "senales-de-que-una-mujer-es-infiel",
        "title": "10 señales de que una mujer podría estar siendo infiel",
        "cat": "Infidelidad",
        "summary": "Cambios de comportamiento, en el móvil y en la intimidad que, juntos, pueden "
                   "indicar que algo no va bien en la relación.",
        "body": [
            ("Introducción",
             ["Detectar una infidelidad rara vez depende de una sola señal. Lo que de verdad "
              "importa es el <strong>cambio de patrón</strong>: cosas que antes eran de una manera "
              "y de repente son distintas, sin una explicación clara. Aquí repasamos las señales "
              "más comunes, siempre desde el respeto y sin caer en la paranoia."]),
            ("1. Cambios repentinos con el teléfono",
             ["Empieza a alejar el móvil, lo pone boca abajo, cambia contraseñas o se lleva el "
              "teléfono hasta al baño. No es una prueba por sí sola, pero si antes no lo hacía y "
              "ahora sí, es un cambio que conviene observar."]),
            ("2. Menos interés en la relación",
             ["Cuando alguien invierte su energía emocional en otra parte, suele mostrar menos "
              "interés en los planes, las conversaciones profundas o la intimidad de la pareja. "
              "La distancia emocional suele notarse antes que cualquier otra cosa."]),
            ("3. Cuida más su aspecto sin motivo aparente",
             ["Un cambio brusco en la forma de vestir, arreglarse o cuidarse, especialmente si "
              "coincide con salidas nuevas o cambios de horario, puede ser significativo. Ojo: "
              "también puede ser simple crecimiento personal, no lo tomes como prueba."]),
            ("4. Justifica ausencias con explicaciones confusas",
             ["Horarios que no cuadran, versiones que cambian o un exceso de detalles innecesarios "
              "para justificar dónde estuvo. La mentira suele necesitar demasiada explicación."]),
            ("5. Se muestra más irritable o a la defensiva",
             ["La culpa a menudo se disfraza de enfado. Si preguntas cosas normales y reacciona con "
              "agresividad o te acusa de \"controlarla\", puede ser una forma de desviar la atención."]),
            ("Conclusión",
             ["Ninguna señal aislada demuestra una infidelidad. Lo importante es el conjunto y, "
              "sobre todo, la <strong>comunicación honesta</strong>. Antes de sacar conclusiones, "
              "habla con tu pareja: muchas veces lo que parece engaño es en realidad un problema "
              "de la relación que se puede resolver hablando."]),
        ],
    },
    {
        "slug": "frases-que-usa-una-mujer-infiel",
        "title": "8 frases que suele usar una persona que está siendo infiel",
        "cat": "Infidelidad",
        "summary": "El lenguaje delata más de lo que crees. Estas frases, cuando aparecen juntas, "
                   "suelen indicar distancia emocional o algo que se oculta.",
        "body": [
            ("Por qué el lenguaje delata",
             ["Cuando alguien esconde algo, su forma de hablar cambia: aparece la vaguedad, la "
              "actitud defensiva y las justificaciones. Estas frases no son una condena, pero sí "
              "señales de que conviene prestar atención y, sobre todo, hablar."]),
            ("\"Estás imaginando cosas\"",
             ["Negar tus percepciones para hacerte dudar de ti es una forma de desviar la "
              "conversación. Si lo dice cada vez que planteas algo, evita el tema en lugar de aclararlo."]),
            ("\"Solo es un amigo, no seas celoso\"",
             ["Minimizar una relación antes de que hayas acusado a nadie a veces revela que esa "
              "amistad ocupa más espacio del que admite."]),
            ("\"Necesito mi espacio\"",
             ["Pedir espacio es sano y legítimo. Pero si aparece de golpe, sin explicación y junto "
              "a otras señales, puede reflejar que está poniendo distancia emocional."]),
            ("\"No tengo que darte explicaciones de todo\"",
             ["La privacidad es normal; el secretismo defensivo, no tanto. La diferencia está en si "
              "hay confianza o si se usa para bloquear cualquier pregunta."]),
            ("Conclusión",
             ["Estas frases valen como señal, no como prueba. Lo más maduro es no espiar ni acusar, "
              "sino <strong>expresar cómo te sientes</strong> y observar la reacción. Una relación "
              "sana resiste esa conversación."]),
        ],
    },
    {
        "slug": "psicologia-femenina-lo-que-de-verdad-valora",
        "title": "Psicología femenina: lo que de verdad valora una mujer en un hombre",
        "cat": "Psicología femenina",
        "summary": "Más allá de mitos y tópicos, lo que genera atracción real y duradera tiene que "
                   "ver con seguridad, coherencia y respeto.",
        "body": [
            ("Olvida los trucos",
             ["No existen frases mágicas ni trucos para \"conquistar\". La atracción genuina se "
              "construye sobre cómo eres, no sobre lo que finges ser. Estos son los rasgos que, "
              "según la psicología de las relaciones, generan atracción sana y duradera."]),
            ("Seguridad, no arrogancia",
             ["La seguridad es sentirte cómodo contigo mismo sin necesidad de aprobación constante. "
              "No se trata de dominar ni de presumir, sino de tener criterio propio y calma."]),
            ("Coherencia entre lo que dices y haces",
             ["Nada genera más confianza que la coherencia. Cuando tus actos acompañan tus palabras, "
              "transmites estabilidad, y la estabilidad es profundamente atractiva."]),
            ("Inteligencia emocional",
             ["Saber escuchar, entender emociones (las tuyas y las de ella) y comunicar sin explotar "
              "ni callar. Esto pesa mucho más que cualquier gesto de \"seducción\"."]),
            ("Respeto y límites sanos",
             ["Respetar su espacio y, a la vez, tener tus propios límites. Ni sumisión ni control: "
              "dos personas completas que eligen estar juntas."]),
            ("Conclusión",
             ["La mejor \"técnica\" es trabajar en ti mismo: seguridad real, coherencia y respeto. "
              "Eso no solo atrae, sino que sostiene una relación en el tiempo."]),
        ],
    },
    {
        "slug": "cuando-dejas-de-rogar-a-una-mujer",
        "title": "Qué pasa cuando dejas de rogarle a una mujer",
        "cat": "Atracción",
        "summary": "Perseguir e insistir suele alejar. Recuperar tu centro y tu dignidad cambia por "
                   "completo la dinámica de una relación.",
        "body": [
            ("El error de rogar",
             ["Cuando ruegas, insistes o persigues, envías un mensaje sin querer: que tu bienestar "
              "depende por completo de la otra persona. Eso, lejos de acercar, genera rechazo, "
              "porque nadie se siente atraído por la necesidad desesperada."]),
            ("Recuperar tu centro",
             ["Dejar de rogar no es un truco de manipulación: es volver a ti. Retomar tus objetivos, "
              "tus amigos, tus rutinas. Cuando tu vida vuelve a tener valor propio, dejas de "
              "depender emocionalmente de una sola persona."]),
            ("El cambio de dinámica",
             ["Al dejar de perseguir, la dinámica se equilibra. La otra persona percibe a alguien "
              "íntegro, con vida propia y autoestima. A veces eso reaviva el interés; otras veces "
              "simplemente te libera de una relación que no te convenía."]),
            ("No lo hagas para manipular",
             ["Importante: esto funciona porque es <strong>real</strong>, no una estrategia para "
              "provocar reacción. Si lo finges, se nota. El objetivo es tu dignidad, no controlar a nadie."]),
            ("Conclusión",
             ["Dejar de rogar es recuperar el respeto por ti mismo. Y ese respeto, casi siempre, "
              "cambia por completo cómo te ven y cómo te sientes."]),
        ],
    },
    {
        "slug": "el-poder-del-silencio-en-una-relacion",
        "title": "El poder del silencio: por qué a veces callar dice más",
        "cat": "Atracción",
        "summary": "Usado con madurez (no como castigo), el silencio ayuda a poner límites, bajar "
                   "el conflicto y hacerte valorar.",
        "body": [
            ("Silencio no es castigo",
             ["Aclaremos algo: el silencio del que hablamos <strong>no es la ley del hielo</strong> "
              "para castigar. Eso es manipulación y daña la relación. Hablamos del silencio maduro: "
              "saber cuándo no reaccionar, cuándo no discutir de más y cuándo dar espacio."]),
            ("Bajar la intensidad del conflicto",
             ["En una discusión acalorada, callar un momento y no responder desde el enfado evita "
              "que todo empeore. No es rendirse: es elegir no echar más leña al fuego."]),
            ("Dejar espacio para que te valoren",
             ["Cuando dejas de llenar cada silencio con explicaciones o insistencia, das espacio a "
              "que la otra persona note tu ausencia y valore tu presencia. El exceso de disponibilidad "
              "resta valor."]),
            ("El silencio que comunica seguridad",
             ["Una persona segura no necesita tener la última palabra ni justificarse constantemente. "
              "Ese silencio tranquilo transmite estabilidad y autocontrol."]),
            ("Conclusión",
             ["Bien usado, el silencio es una herramienta de madurez emocional: pone límites, calma "
              "conflictos y te hace valer. Mal usado (como castigo), destruye. La diferencia está en "
              "la intención."]),
        ],
    },
    {
        "slug": "como-detectar-una-infidelidad",
        "title": "Cómo detectar una infidelidad sin volverte paranoico",
        "cat": "Infidelidad",
        "summary": "La clave no es espiar, sino observar patrones y, sobre todo, comunicarte. Una "
                   "guía equilibrada para salir de la duda.",
        "body": [
            ("El equilibrio entre atención y paranoia",
             ["Vivir revisando el móvil de tu pareja destruye la relación aunque no haya infidelidad. "
              "El objetivo no es espiar, sino recuperar la tranquilidad: o confirmas que todo está "
              "bien, o sales de una situación que te hace daño."]),
            ("Observa patrones, no hechos aislados",
             ["Un día raro no significa nada. Lo relevante es un <strong>cambio sostenido</strong> en "
              "varios frentes a la vez: comunicación, intimidad, horarios y actitud."]),
            ("La distancia emocional es la mayor señal",
             ["Más que el móvil o las salidas, lo que más delata es el <strong>alejamiento "
              "emocional</strong>: dejáis de compartir, de reír juntos, de conectar. Eso pesa más "
              "que cualquier detalle."]),
            ("Habla en lugar de acusar",
             ["La conversación honesta resuelve más que cualquier investigación. Expresa cómo te "
              "sientes (\"me he sentido distante de ti últimamente\") en vez de acusar. La reacción "
              "te dirá mucho."]),
            ("Conclusión",
             ["Detectar una infidelidad no va de espiar, sino de <strong>observar con calma y "
              "comunicarte</strong>. Y recuerda: una relación en la que necesitas vigilar "
              "constantemente ya tiene un problema de fondo que merece atención."]),
        ],
    },
]
