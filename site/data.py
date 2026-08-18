# -*- coding: utf-8 -*-
"""Datos de las herramientas y contenido SEO de cada página.
Editar aquí para añadir/quitar herramientas: luego ejecutar build.py"""

SITE = {
    "name": "D-TECH USB",
    "tagline": "Herramientas y guías para reparar memorias USB",
    "domain": "https://dtechusb.pages.dev",  # cambiar por tu dominio propio cuando lo tengas
    "youtube": "https://www.youtube.com/channel/UCLppVn9LXrHWGTsnQr2ov1g?sub_confirmation=1",
    "logo": "https://yt3.googleusercontent.com/bWvxTf1d19FL1Fai23FfCnKHbYKDCEsc3Gdk4NxjxxrCmdV9OXVgLI-jD1XL3DWr4lFOtGGT7w=s160-c-k-c0x00ffffff-no-rj",
    "contact_email": "daimel.rivera@outlook.es",
    "facebook": "https://www.facebook.com/dtechusb",
    "instagram": "https://www.instagram.com/como_reparar_usb_y_sistemas/",
    "playlist_id": "PLBfPLvLvAgajMalhkQ8ru4RnB9s4Fp1_N",  # lista general de reparaciones USB (87 videos)
    "description": "Aprende cómo reparar una memoria USB dañada gratis: identifica si tu USB está "
                   "dañada, descarga la herramienta MPTool exacta para tu controlador (Phison, SMI, "
                   "Chipsbank, FirstChip y más) y sigue la guía paso a paso sin perder tus datos.",
    # ==== MONETAG (todas las zonas de este sitio) ====
    "monetag_push": '<script src="https://5gvci.com/act/files/tag.min.js?z=11426112" data-cfasync="false" async></script>',
    "monetag_inpage_push": "<script>(function(s){s.dataset.zone='11443690',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>",
    "monetag_vignette": "<script>(function(s){s.dataset.zone='11443698',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>",
    "monetag_popunder": "<script>(function(s){s.dataset.zone='11434447',s.src='https://zovidree.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>",
    "monetag_directlink": "https://omg10.com/4/11443701",  # Direct Link (se abre al pulsar el botón de descarga)
    # ==== POPADS (reemplaza al popunder de Monetag en este sitio) ====
    "popads_popunder": '''<script type="text/javascript" data-cfasync="false">
/*<![CDATA[/* */
(function(){var d=window,i="ed535ff01c04e087bea23253eda62746",m=[["siteId",299-712+327-200+509+5316556],["minBid",0.0003],["popundersPerIP","3"],["delayBetween",43200],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],t=["d3d3LnByZW1pdW12ZXJ0aXNpbmcuY29tL3VzcHJpdGUubWluLmNzcw==","ZDJqMDQyY2oxNDIxd2kuY2xvdWRmcm9udC5uZXQvamEvcmJhc2tldC5mdWxsLm1pbi5qcw=="],y=-1,k,s,x=function(){clearTimeout(s);y++;if(t[y]&&!(1812831851000<(new Date).getTime()&&1<y)){k=d.document.createElement("script");k.type="text/javascript";k.async=!0;var a=d.document.getElementsByTagName("script")[0];k.src="https://"+atob(t[y]);k.crossOrigin="anonymous";k.onerror=x;k.onload=function(){clearTimeout(s);d[i.slice(0,16)+i.slice(0,16)]||x()};s=setTimeout(x,5E3);a.parentNode.insertBefore(k,a)}};if(!d[i]){try{Object.freeze(d[i]=m)}catch(e){}x()}})();
/*]]>/* */
</script>''',
    "google_verify": "4t1k_fsPm-BsPZ6JQFLArsFhmg_LqMMaYAX1iqdFg4E",  # Google Search Console
    # ==== MONETAG MultiTag (test: replaces the 4 individual zones above on this site) ====
    "monetag_multitag": '<script src="https://quge5.com/88/tag.min.js" data-zone="270716" async data-cfasync="false"></script>',
}

# ---- Enlaces externos con página intermedia de anuncios (/ir/<slug>) ----
EXTERNAL_LINKS = [
    {
        "slug": "ebook",
        "title": "Comprar el eBook completo de reparación de USB",
        "cta_label": "Comprar eBook en Ko-fi",
        "lead": "Vas a salir a Ko-fi para comprar la \"Guía Completa: Repara Cualquier Memoria USB Dañada\".",
        "target_url": "https://ko-fi.com/s/8fe2c66b5a",
    },
    {
        "slug": "miniapp",
        "title": "Abrir la Mini App de Telegram",
        "cta_label": "Abrir Mini App en Telegram",
        "lead": "Vas a salir a Telegram para abrir la mini app de búsqueda de reparaciones D-Tech USB.",
        "target_url": "https://t.me/dtechusb_repair_bot/ReparatuUSB",
    },
]

# ---- Módulo "¿Cuál es el problema de tu USB?" (páginas por síntoma, título = pregunta real de Google) ----
PROBLEMS = [
    {
        "slug": "usb-no-hay-medios",
        "label": "USB dice \"No hay medios\"",
        "title": "¿Qué significa \"No hay medios\" en una USB y cómo solucionarlo?",
        "video_id": "GypEuIFjmIY",
        "explanation": "El mensaje \"No hay medios\" en el Administrador de discos de Windows aparece "
            "cuando el PC no puede comunicarse con el chip controlador de la memoria, casi siempre "
            "porque el controlador está corrupto o dañado (no porque la memoria física esté rota). "
            "También puede deberse a un puerto USB defectuoso, un cable/hub en mal estado o falta de "
            "energía suficiente en el puerto.",
        "steps": [
            "Prueba la USB en otro puerto (mejor uno trasero 2.0) y en otra PC si puedes.",
            "Abre el Administrador de discos de Windows para confirmar que aparece como \"Sin medios\".",
            "Identifica el chip con <a href=\"/chipgenius\">ChipGenius</a> — si no lo detecta ahí tampoco, es un problema de controlador.",
            "Descarga la herramienta de reparación (MPTool) de tu controlador desde esta web.",
        ],
    },
    {
        "slug": "usb-inserte-un-disco",
        "label": "USB pide \"Inserte un disco\"",
        "title": "¿Qué hacer cuando aparece \"Inserte un disco en la unidad\" en tu USB?",
        "video_id": "WwM6DBLY1r8",
        "explanation": "El error \"Por favor, inserte un disco en la unidad\" ocurre cuando Windows detecta "
            "físicamente el dispositivo pero no puede leer su sistema de archivos ni su tabla de "
            "particiones. Es una de las señales más claras de que el controlador de la memoria se "
            "corrompió y necesita reprogramarse con su herramienta de fábrica.",
        "steps": [
            "No intentes formatear todavía — normalmente falla con el mismo error.",
            "Conecta la USB directamente a un puerto trasero del PC, sin hubs ni alargadores.",
            "Identifica el chip con <a href=\"/chipgenius\">ChipGenius</a>.",
            "Descarga la herramienta MPTool de tu controlador desde esta web y repárala a bajo nivel.",
        ],
    },
    {
        "slug": "usb-formato-raw",
        "label": "USB en formato RAW",
        "title": "USB en formato RAW: qué significa y cómo repararla",
        "video_id": "Cb6s2cqwFjg",
        "explanation": "Que una USB aparezca en formato \"RAW\" significa que Windows ya no reconoce su "
            "sistema de archivos (FAT32/exFAT/NTFS) porque la tabla de particiones o el sistema de "
            "archivos se corrompió. Es distinto a un formateo normal: intentar formatearla directamente "
            "suele fallar o borra datos que a veces todavía se pueden recuperar antes de reparar.",
        "steps": [
            "Si tienes datos importantes, intenta recuperarlos primero con un programa como TestDisk/PhotoRec antes de tocar nada más.",
            "Prueba el comando <code>chkdsk X: /f</code> en CMD como administrador (cambia X por tu unidad).",
            "Si sigue en RAW, identifica el controlador con <a href=\"/chipgenius\">ChipGenius</a>.",
            "Repara a bajo nivel con la MPTool de tu controlador desde esta web.",
        ],
    },
    {
        "slug": "usb-capacidad-falsa",
        "label": "USB con capacidad falsa",
        "title": "Cómo saber si tu USB tiene capacidad falsa y cómo repararla",
        "video_id": "iHXxmonALo4",
        "explanation": "Una memoria USB \"falsa\" es aquella cuyo chip fue reprogramado para reportar una "
            "capacidad mayor a la que realmente tiene físicamente (por ejemplo, se anuncia como 128GB "
            "pero solo tiene 8GB reales de memoria NAND). Windows la muestra con el tamaño falso, pero "
            "al llenarla empieza a corromper y perder archivos silenciosamente.",
        "steps": [
            "Descarga <strong>H2testW</strong> y ejecútalo sobre la unidad completa: escribe datos de prueba y verifica si se pueden leer de vuelta.",
            "Si H2testW reporta errores o menos capacidad de la anunciada, tu USB es falsa.",
            "Usa <strong>RMPrepUSB</strong> para ajustar la partición al tamaño REAL detectado (esto la hace usable de forma confiable, aunque con menor capacidad).",
            "Alternativa por CMD: <code>diskpart</code> → <code>clean</code> → <code>create partition primary size=N</code> (N = capacidad real en MB) → <code>format fs=fat32 quick</code>.",
        ],
    },
    {
        "slug": "usb-corrupta",
        "label": "USB corrupta",
        "title": "¿Qué es una memoria USB corrupta y cómo repararla?",
        "video_id": "Sx_2l_m-sXM",
        "explanation": "Una USB \"corrupta\" es aquella que Windows sigue detectando (aparece en el "
            "Administrador de discos con su capacidad correcta) pero se comporta de forma extraña: no "
            "abre, da errores al copiar archivos o se congela al acceder. Casi siempre es corrupción "
            "lógica del sistema de archivos o del firmware del controlador, no daño físico real.",
        "steps": [
            "Si tienes archivos importantes, intenta copiarlos antes de seguir (pueden fallar a mitad de camino, es normal).",
            "Ejecuta <code>chkdsk X: /f /r</code> en CMD como administrador para reparar errores lógicos.",
            "Si sigue corrupta, identifica el controlador con <a href=\"/chipgenius\">ChipGenius</a>.",
            "Repara a bajo nivel con la MPTool específica de tu controlador desde esta web.",
        ],
    },
    {
        "slug": "usb-danada-ilegible",
        "label": "\"El archivo o directorio está dañado y es ilegible\"",
        "title": "\"El archivo o directorio está dañado y es ilegible\": qué significa y cómo repararlo",
        "video_id": "YVnfWtKIONs",
        "explanation": "Este mensaje aparece cuando intentas abrir o copiar un archivo/carpeta de tu USB "
            "y el sistema de archivos ya no puede leer esa sección del disco correctamente. Es una señal "
            "de corrupción del sistema de archivos (a veces del controlador), y copiar/formatear "
            "directamente suele fallar hasta que se repara la causa real.",
        "steps": [
            "No sigas copiando archivos de esa carpeta — puede empeorar la pérdida de datos.",
            "Ejecuta <code>chkdsk X: /f</code> en CMD como administrador (cambia X por tu unidad).",
            "Si el error persiste, identifica el controlador con <a href=\"/chipgenius\">ChipGenius</a>.",
            "Repara a bajo nivel con la MPTool de tu controlador desde esta web.",
        ],
    },
]

# slug, título, marca, enlace de descarga, clave (opcional), intro SEO, pasos
# ---- Comentarios reales de YouTube (testimonios) ----
TESTIMONIALS = [
    {
        "author": "@nroc1976",
        "text": "Gracias a toda la información de Daimel, llegué a reparar mi USB otra vez, gracias "
                "y espero que sirvan mis comentarios, saludos desde Monterrey México.",
        "video_title": "Cómo QUITAR la Protección contra Escritura de tu USB Kingston Exodia",
        "video_id": "wFTdO_DniuQ",
    },
    {
        "author": "@gransayaman96",
        "text": "Muchas gracias! me funcionó, logré rescatar un pendrive de 64gb y eso que al "
                "principio me salió Unknown en rojo pero ya luego conectó.",
        "video_title": "Como Reparar USB dañada con First Chip CHIPYC2019 (SIN ERRORES)",
        "video_id": "yF9gxwEIOTQ",
    },
    {
        "author": "@AhmedCM-n4y",
        "text": "A ti mi bro, que pude reparar muchas USB y aún sigo 💪🏻",
        "video_title": "¿Tu PC no reconoce tu USB? El 90% de los Casos tiene Solución",
        "video_id": "iYnODhTenz8",
    },
    {
        "author": "@franclinguirola99",
        "text": "Bueno yo no sé mucho de esto pero a prueba y error recuperé mi usb jajajaj😅😅 "
                "gracias por las herramientas.",
        "video_title": "Como Reparar USB dañada Alcor Micro",
        "video_id": "3hJHW9UeRM8",
    },
    {
        "author": "@marisolrodriguez-p9k",
        "text": "USB protegido contra escritura de 4 gigas se ha transformado en usb de 16 gigas... "
                "reparado con High Level Format y Capacity Optimize.",
        "video_title": "La Herramienta GRATIS para Quitar la Protección Contra Escritura USB",
        "video_id": "3sMdQrSfhAQ",
    },
]

TOOLS = [
    {
        "slug": "chipgenius",
        "title": "ChipGenius v4.21 en Español – Descargar Gratis para Identificar el Controlador de tu USB (2026)",
        "brand": "ChipGenius",
        "url": "https://www.mediafire.com/file/v58c3jvkisf1ok7/ChipGenius-con-lanzador+4.21.0701.rar/file",
        "key": "repusb",
        "kind": "detector",
        "video_id": "1BKymQQoDs8",
        "video_title": "ChipGenius: la ÚNICA herramienta que necesitas para identificar tu USB",
        "img": "/images/tools/chipgenius.png",
        "intro": "ChipGenius es el primer paso para reparar cualquier memoria USB. Detecta el "
                 "VID, PID y el fabricante del controlador (chip) de tu pendrive. Con ese dato "
                 "sabrás exactamente qué herramienta MPTool necesitas descargar para repararla.",
        "steps": [
            "Descarga y descomprime ChipGenius (contraseña del RAR: repusb).",
            "Conecta la memoria USB dañada al puerto directamente (evita hubs).",
            "Abre ChipGenius y selecciona tu unidad en la lista superior.",
            "Anota el <strong>VID</strong>, <strong>PID</strong> y sobre todo el "
            "<strong>Controller (Chip Vendor)</strong>: Phison, SMI, Chipsbank, etc.",
            "Con el nombre del controlador, descarga desde esta web la herramienta que le corresponde.",
        ],
    },
    {
        "slug": "tabla-solucionadas",
        "title": "Tabla de USB solucionadas – Base de datos de reparaciones",
        "brand": "Tabla de solucionadas",
        "url": "https://mega.nz/file/i6IwhCiB#tzYmDfMiZ3Ycfo7Rh_si3M5UE8rgpl7LOOBxVPk9fH0",
        "kind": "detector",
        "video_id": "LqdzdO3BBGo",
        "img": "/images/tools/tabla-solucionadas.png",
        "intro": "Base de datos con memorias USB ya reparadas: modelo, VID/PID, controlador y la "
                 "herramienta exacta que funcionó. Búscala por tu chip para ahorrar tiempo y saber "
                 "de antemano qué MPTool usar.",
        "steps": [
            "Descarga y abre la tabla de solucionadas.",
            "Busca tu VID/PID (obtenido con ChipGenius) dentro de la tabla.",
            "Localiza el controlador y la herramienta que se usó para repararla.",
            "Descarga esa herramienta desde esta web y sigue su guía.",
        ],
    },
    {
        "slug": "alcor-micro",
        "title": "Herramienta Alcor Micro – Reparar y formatear USB Alcor",
        "brand": "Alcor Micro",
        "url": "https://mega.nz/file/m2IClIiB#PEoPCBH7n4X7qtBEPNBIESWFuE0AI_F8apKMYtj4qsc",
        "kind": "mptool",
        "playlist": "PLBfPLvLvAgajTrTQS-ylyjDlgsvou8RWi",
        "img": "/images/tools/alcor-micro.png",
        "intro": "Herramienta de bajo nivel (MPTool) para reparar memorias USB con controlador "
                 "Alcor Micro. Permite reformatear el chip NAND, borrar bloques dañados y devolver "
                 "la capacidad real al pendrive cuando Windows ya no lo reconoce o no da formato.",
        "steps": [
            "Confirma con ChipGenius que tu controlador es <strong>Alcor Micro</strong>.",
            "Descarga y descomprime la herramienta Alcor Micro.",
            "Conecta la memoria USB directamente a un puerto trasero del PC.",
            "Ejecuta el MPTool como administrador; debe detectar tu unidad.",
            "Pulsa Start / Iniciar y espera SIN desconectar hasta que termine en verde (OK/Pass).",
            "Extrae la USB, vuelve a conectarla y formatéala en Windows si hace falta.",
        ],
    },
]

# Herramientas por controlador (misma estructura de guía)
_CONTROLLERS = [
    ("chipsbank", "Chipsbank", "https://mega.nz/file/K6JTQAaY#QF1dBsRX2N0zJ7CXAJN0yq4xOPBBzMPnfR7NkYZEOBg"),
    ("firstchip", "FirstChip", "https://mega.nz/file/f7RA1bDY#KUJTO7ncPHYtf2EaM1XDplYj7CxBEF5TzwFReT16syw"),
    ("phison", "Phison", "https://mega.nz/file/T3JmSaQS#e2SUtjjVQoA2G1TmfNBoML-IVZyM0G-wGaWnSv35gaU"),
    ("ite-usbest", "ITE USBest", "https://mega.nz/file/n6okXZIb#sMPdqcENIydc_PWDsC6WHEBGMXDeHyZxSrGQ4m9O8qo"),
    ("smi", "SMI (Silicon Motion)", "https://mega.nz/file/kBAgBRxZ#KQzy9TqSd_9VwfEhfJxdyjslFLmuV2F6x11xcN9yrH0"),
    ("innostor", "Innostor", "https://mega.nz/file/juohTQJD#tz5I34qLA8JNbthkySmu2xnFrnSz5iBj6nYMreuuq1c"),
    ("solid-state-system", "Solid State System (SSS)", "https://mega.nz/file/qrA0CDbJ#DMbenX72fwTQQ6SEaEdsoVx2X1sGLgg-YtKpOUZxGqA"),
    ("appotech", "Appotech", "https://mega.nz/file/2iYjkbRC#V80vRtCHKdD1Q3Nz7ZICJqsBMNVlXERfgIf4zKuLppo"),
    ("asolid", "Asolid", "https://www.mediafire.com/file/fzgmet8zfd8immc/ASolid.rar/file"),
    ("skymedi", "Skymedi", "https://www.mediafire.com/file/4umrd5gwr886mxc/Skymedi.rar/file"),
    ("silicon-go", "Silicon Go", "https://mega.nz/file/y24mTSJa#pEqjxJMD02eEPLbgfh0EB3zYG09lSAzKEnDzTaxdcL0"),
    ("twsc", "TWSC", "https://www.mediafire.com/file/kzexkmg96s7i4go/TWSC.rar/file"),
    ("huayi", "Huayi", "https://mega.nz/file/zmRwGBYR#yh4DURtrmlJbGiVeJnOddzy56sJjJ7p9wwDzjs1dS-M"),
]

# Listas de reproducción específicas por controlador (las demás usan la general)
_PLAYLISTS = {
    "phison": "PLBfPLvLvAgagQG5879qSm9SQIN5xbFV5T",
    "firstchip": "PLBfPLvLvAgaiTQeX9xzR-THQfrLYFw8Zv",
    "smi": "PLBfPLvLvAgag228yMuFf73HoLK3Mfxz8I",
    "chipsbank": "PLBfPLvLvAgahLZkPvVydZOPsUvIk0RCl_",
}

# Video único específico por controlador (cuando no hay playlist propia)
_VIDEOS = {
    "innostor": "R-w49XRIQRU",
}

# Captura real (del eBook, o recortada de una captura de pantalla propia) por
# controlador, solo cuando la resolución es suficiente para verse bien en grande
_IMAGES = {
    "chipsbank": "/images/tools/chipsbank.png",
    "firstchip": "/images/tools/firstchip.png",
    "phison": "/images/tools/phison.png",
    "ite-usbest": "/images/tools/ite-usbest.png",
    "innostor": "/images/tools/innostor.png",
}

for slug, brand, url in _CONTROLLERS:
    TOOLS.append({
        "slug": slug,
        "title": f"Herramienta {brand} – Reparar y formatear USB {brand}",
        "brand": brand,
        "url": url,
        "kind": "mptool",
        "playlist": _PLAYLISTS.get(slug),
        "video_id": _VIDEOS.get(slug),
        "img": _IMAGES.get(slug),
        "intro": f"Herramienta de bajo nivel (MPTool) para reparar memorias USB con controlador "
                 f"{brand}. Permite reformatear el chip NAND, borrar bloques dañados y devolver la "
                 f"capacidad real al pendrive cuando Windows ya no lo reconoce o no da formato.",
        "steps": [
            f"Confirma con ChipGenius que tu controlador es <strong>{brand}</strong>.",
            f"Descarga y descomprime la herramienta {brand}.",
            "Conecta la memoria USB directamente a un puerto trasero del PC.",
            "Ejecuta el MPTool como administrador; debe detectar tu unidad.",
            "Pulsa Start / Iniciar y espera SIN desconectar hasta que termine en verde (OK/Pass).",
            "Extrae la USB, vuelve a conectarla y formatéala en Windows si hace falta.",
        ],
    })

# ---- Páginas-guía (temas muy buscados en Google, sin descarga) ----
TOOLS.append({
    "slug": "quitar-proteccion-escritura-usb",
    "title": "Cómo quitar la protección contra escritura de una USB",
    "brand": "Quitar protección contra escritura",
    "url": None,
    "kind": "guide",
    "playlist": "PLBfPLvLvAgago9OauNwERklrDwRVMEIl4",
    "img": "/images/tools/quitar-proteccion-escritura-usb.png",
    "intro": "¿Tu memoria USB dice \"el disco está protegido contra escritura\" y no te deja "
             "formatear ni borrar? Aquí tienes todas las formas de quitar la protección contra "
             "escritura de un pendrive o tarjeta SD, paso a paso y en vídeo.",
    "steps": [
        "Comprueba si tu USB tiene un <strong>interruptor físico</strong> de bloqueo en el lateral; muévelo a la posición de desbloqueo.",
        "Prueba con <strong>Diskpart</strong>: abre CMD como administrador → <code>diskpart</code> → <code>list disk</code> → <code>select disk N</code> → <code>attributes disk clear readonly</code>.",
        "Edita el <strong>registro de Windows</strong> en <code>HKLM\\SYSTEM\\CurrentControlSet\\Control\\StorageDevicePolicies</code> y pon <code>WriteProtect = 0</code>.",
        "Si nada funciona, el problema es del controlador: identifica tu chip con <a href=\"/chipgenius\">ChipGenius</a> y usa su herramienta de reparación de esta web.",
        "Mira los vídeos de abajo para verlo en detalle según tu caso.",
    ],
})
TOOLS.append({
    "slug": "formatear-usb-exfat-a-fat32",
    "title": "Cómo formatear una USB de exFAT a FAT32",
    "brand": "Formatear de exFAT a FAT32",
    "url": None,
    "kind": "guide",
    "playlist": "PLBfPLvLvAgagMCh6WjAzsLokj1qkfIMhB",
    "img": "/images/tools/formatear-usb-exfat-a-fat32.png",
    "intro": "¿Necesitas pasar tu memoria USB de exFAT a FAT32 (por ejemplo para una consola, "
             "TV o coche que no lee exFAT)? Windows a veces no da la opción de FAT32 en unidades "
             "grandes. Aquí te explico cómo hacerlo paso a paso, gratis.",
    "steps": [
        "<strong>Haz copia de seguridad:</strong> formatear borra todos los datos de la USB.",
        "Para unidades de hasta 32 GB: clic derecho sobre la unidad → Formatear → elige <strong>FAT32</strong>.",
        "Para unidades grandes (más de 32 GB) Windows oculta FAT32: usa una herramienta gratuita como <strong>guiformat</strong> o <strong>Rufus</strong>.",
        "Con Rufus: selecciona tu USB, sistema de archivos <strong>FAT32</strong>, y pulsa Empezar.",
        "También puedes usar CMD: <code>format /FS:FAT32 X:</code> (cambia X por tu unidad).",
        "Mira los vídeos de abajo para el método exacto según el tamaño de tu memoria.",
    ],
})
TOOLS.append({
    "slug": "windows-no-reconoce-usb",
    "title": "Windows no reconoce la USB: cómo solucionarlo (todos los casos)",
    "brand": "Windows no reconoce la USB",
    "url": None,
    "kind": "guide",
    "video_id": "APabN6Ym_Y0",
    "img": "/images/tools/windows-no-reconoce-usb.png",
    "related_videos": [
        {"id": "dzAM05htmAo", "label": "Reparar USB dañada que no se reconoce en la PC"},
        {"id": "vI53QJFsDKU", "label": "¿USB No Reconoce? Esto SIEMPRE Funciona"},
    ],
    "intro": "¿Conectas tu memoria USB y Windows no la detecta, ni siquiera aparece en \"Este equipo\" "
             "o en el Administrador de discos? Aquí tienes todas las causas posibles y cómo solucionar "
             "cada una, desde el puerto hasta un controlador dañado.",
    "steps": [
        "Prueba primero en <strong>otro puerto USB</strong> (mejor uno trasero 2.0) y en otra PC si puedes; descarta cable/hub defectuoso.",
        "Abre el <strong>Administrador de dispositivos</strong> de Windows: si aparece con una señal de alerta amarilla, el driver o el controlador está fallando.",
        "Si aparece en \"Administrador de discos\" pero no en el explorador, puede que le falte una <strong>letra de unidad</strong>: clic derecho → Cambiar letra y rutas de acceso.",
        "Si no aparece en ningún lado (ni en Administrador de discos), identifica el chip con <a href=\"/chipgenius\">ChipGenius</a> y usa la herramienta de reparación de esta web para tu controlador.",
        "Mira el vídeo de abajo para ver el proceso completo paso a paso.",
    ],
})
TOOLS.append({
    "slug": "windows-no-pudo-completar-formato",
    "title": "\"Windows no pudo completar el formato\": solución (USB y microSD)",
    "brand": "Windows no pudo completar el formato",
    "url": None,
    "kind": "guide",
    "video_id": "aGaTI4Vksc0",
    "img": "/images/tools/windows-no-pudo-completar-formato.png",
    "related_videos": [
        {"id": "eN0A-n_9Poo", "label": "Windows Could Not Complete Formatting — reparación paso a paso"},
        {"id": "4JHW586eSaM", "label": "¡Sí tiene solución! Reparar USB que Windows no puede formatear"},
        {"id": "Cb6s2cqwFjg", "label": "Reparar pendrive en formato RAW que Windows no puede formatear"},
    ],
    "intro": "El error \"Windows no pudo completar el formato\" casi siempre significa que el "
             "controlador de la memoria (el chip que la gobierna) está dañado o corrupto, no la "
             "memoria física en sí. Aquí tienes la solución real, no solo trucos de CMD que no funcionan.",
    "steps": [
        "Prueba primero con <strong>Diskpart</strong>: CMD como administrador → <code>diskpart</code> → <code>list disk</code> → <code>select disk N</code> → <code>clean</code> → <code>create partition primary</code> → <code>format fs=fat32 quick</code>.",
        "Si Diskpart también falla o se queda trabado, el problema es de <strong>bajo nivel</strong> (el controlador), no del sistema de archivos.",
        "Identifica el chip exacto con <a href=\"/chipgenius\">ChipGenius</a>: marca, VID/PID y fabricante del flash.",
        "Descarga la <strong>MPTool</strong> de tu controlador específico en esta web y ejecútala como administrador hasta que termine en verde.",
        "Vuelve a formatear en Windows una vez reparada — ahora sí debería completarse sin errores.",
    ],
})

# ---- Páginas por marca ("¿Qué marca es tu USB dañada?") ----
TOOLS.append({
    "slug": "usb-kingston-100g3-danada",
    "title": "USB Kingston DataTraveler 100 G3 dañada: cómo repararla (protección contra escritura)",
    "brand": "Kingston DataTraveler 100 G3",
    "url": None,
    "kind": "guide",
    "video_id": "jqBkMD_LIu4",
    "answer": "Si tu Kingston DataTraveler 100 G3 aparece protegida contra escritura o dañada, primero "
              "intenta quitar el bloqueo con Diskpart desde CMD. Si sigue igual, el problema está en "
              "el controlador (chip) de la memoria, no en el sistema de archivos: identifícalo con "
              "ChipGenius y repáralo con su herramienta de fábrica (MPTool) — gratis y sin perder la garantía.",
    "why": "Cuando la 100 G3 entra en \"modo protegido\" o deja de reconocerse bien, casi siempre es "
           "porque el chip controlador detectó un error interno (sector dañado, corrupción de "
           "firmware o un corte de energía durante una escritura) y se bloqueó a sí mismo en modo "
           "solo lectura como medida de seguridad para no perder más datos. No es un problema de la "
           "carcasa ni de la memoria flash en sí, sino del pequeño chip que la controla.",
    "variants": [
        "Protegida contra escritura (\"the disk is write protected\")",
        "0 bytes o muestra una capacidad distinta a la real",
        "Windows no la reconoce en absoluto",
        "Pide formatear cada vez que la conectas",
    ],
    "intro": "¿Tu memoria Kingston DataTraveler 100 G3 aparece protegida contra escritura o dañada y "
             "no te deja copiar ni borrar archivos? Aquí tienes la solución específica para este "
             "modelo, paso a paso y en vídeo.",
    "steps": [
        "Prueba primero quitar la protección con <strong>Diskpart</strong>: CMD como administrador → <code>diskpart</code> → <code>list disk</code> → <code>select disk N</code> → <code>attributes disk clear readonly</code>.",
        "Si Diskpart no soluciona nada, el problema está en el <strong>controlador</strong> de la 100 G3, no en el sistema de archivos.",
        "Identifica el chip exacto con <a href=\"/chipgenius\">ChipGenius</a> antes de descargar cualquier herramienta.",
        "Descarga la MPTool de tu controlador específico desde esta web y ejecútala como administrador.",
    ],
})
TOOLS.append({
    "slug": "usb-kingston-101g2-danada",
    "title": "USB Kingston DataTraveler 101 G2 dañada: cómo repararla en 1 minuto",
    "brand": "Kingston DataTraveler 101 G2",
    "url": None,
    "kind": "guide",
    "video_id": "czdWJrfrimQ",
    "answer": "Para reparar una Kingston DataTraveler 101 G2 protegida contra escritura, primero prueba "
              "quitar el bloqueo con Diskpart. Si no funciona, identifica el controlador con "
              "ChipGenius y usa su herramienta de reparación de fábrica (MPTool) — normalmente se "
              "resuelve en pocos minutos sin perder la carcasa ni comprar una nueva.",
    "why": "La 101 G2 suele mostrar este error cuando el controlador detecta una inconsistencia en la "
           "tabla de particiones o el firmware interno tras una desconexión brusca o un sector "
           "dañado, y se pone en modo de solo lectura para proteger lo que queda de los datos. "
           "También puede deberse a un interruptor físico de bloqueo en algunos modelos.",
    "variants": [
        "Protegida contra escritura",
        "No se deja formatear",
        "Windows la reconoce pero no puedes copiar nada",
        "Capacidad mostrada distinta a la real",
    ],
    "intro": "¿Tu Kingston DataTraveler 101 G2 aparece protegida contra escritura o dejó de "
             "reconocerse bien en Windows? Esta guía muestra el método rápido (en 1 minuto) para "
             "este modelo específico.",
    "steps": [
        "Comprueba primero que no tenga un <strong>bloqueo físico</strong> lateral (algunos modelos lo traen).",
        "Prueba <strong>Diskpart</strong>: CMD como administrador → <code>diskpart</code> → <code>list disk</code> → <code>select disk N</code> → <code>attributes disk clear readonly</code>.",
        "Si sigue igual, identifica el controlador exacto con <a href=\"/chipgenius\">ChipGenius</a>.",
        "Descarga la herramienta de reparación de tu controlador desde esta web y ejecútala como administrador.",
    ],
})
TOOLS.append({
    "slug": "usb-kingston-exodia-danada",
    "title": "USB Kingston Exodia dañada: cómo repararla (protección contra escritura y no detecta)",
    "brand": "Kingston Exodia",
    "url": None,
    "kind": "guide",
    "video_id": "H_3OJrLHLKI",
    "related_videos": [
        {"id": "hM03q4oWwyA", "label": "Arregla Tu USB Kingston Exodia Dañada ¡Fácil y Rápido!"},
    ],
    "answer": "Una Kingston Exodia protegida contra escritura o que Windows no reconoce bien se "
              "soluciona primero con Diskpart (quitar el atributo de solo lectura) y, si persiste, "
              "identificando el controlador con ChipGenius y reparándolo con su MPTool "
              "correspondiente. Es gratis y no necesitas comprar una USB nueva.",
    "why": "La Exodia (3.2 y otras versiones) suele bloquearse en modo de solo lectura cuando el "
           "controlador detecta un error de escritura, un corte de energía a mitad de una "
           "transferencia, o memoria flash con sectores empezando a fallar. El chip se protege a sí "
           "mismo automáticamente para evitar corromper más datos de los que ya están en riesgo.",
    "variants": [
        "Protegida contra escritura",
        "No se detecta / no aparece en \"Este equipo\"",
        "Pide formatear cada vez que la conectas",
        "Se desconecta sola durante transferencias grandes",
    ],
    "intro": "¿Tu Kingston Exodia (3.2 o cualquier versión) está protegida contra escritura, no se "
             "deja formatear o Windows no la reconoce bien? Aquí tienes la solución específica para "
             "este modelo, con dos vídeos distintos según tu caso.",
    "steps": [
        "Prueba primero <strong>Diskpart</strong>: CMD como administrador → <code>diskpart</code> → <code>list disk</code> → <code>select disk N</code> → <code>attributes disk clear readonly</code>.",
        "Si la Exodia sigue sin dejarte escribir o directamente no la reconoce, el problema es del <strong>controlador</strong>.",
        "Identifica el chip exacto con <a href=\"/chipgenius\">ChipGenius</a> antes de descargar nada.",
        "Descarga la MPTool de tu controlador desde esta web y ejecútala como administrador hasta que termine en verde.",
    ],
})
TOOLS.append({
    "slug": "usb-adata-danada",
    "title": "USB Adata dañada: cómo repararla con ChipGenius (UV210 y otros modelos)",
    "brand": "Adata",
    "url": None,
    "kind": "guide",
    "video_id": "Da8VvbAqqhc",
    "answer": "Una Adata dañada (UV210 u otro modelo) que no se formatea o no aparece en Windows se "
              "repara identificando primero el controlador con ChipGenius y descargando después la "
              "herramienta de fábrica (MPTool) exacta para ese chip. Es un proceso gratuito de 10-15 "
              "minutos que no requiere conocimientos técnicos.",
    "why": "En las Adata este problema aparece normalmente cuando el chip controlador pierde la "
           "referencia a la tabla de asignación de archivos (FAT) o entra en un estado de error tras "
           "una desconexión sin \"expulsar\" la unidad. El resultado es que Windows la detecta como "
           "hardware pero no puede leer ni escribir en ella correctamente.",
    "variants": [
        "No se formatea / \"Windows no pudo completar el formato\"",
        "Aparece en formato RAW",
        "0 bytes o capacidad falsa",
        "Se desconecta y reconecta sola",
    ],
    "intro": "¿Tu memoria Adata (UV210 u otro modelo) está dañada, no se formatea o Windows no la "
             "reconoce? Aquí tienes el proceso completo con ChipGenius para identificar el "
             "controlador y repararla gratis.",
    "steps": [
        "Conecta la Adata directamente a un puerto trasero del PC, sin hubs ni alargadores.",
        "Identifica el controlador exacto con <a href=\"/chipgenius\">ChipGenius</a> (VID, PID y fabricante del chip).",
        "Descarga la MPTool correspondiente a tu controlador desde esta web.",
        "Ejecuta la herramienta como administrador y espera a que termine en verde (OK/Pass) sin desconectar la USB.",
    ],
})
TOOLS.append({
    "slug": "usb-verbatim-danada",
    "title": "USB Verbatim dañada o protegida contra escritura: cómo repararla",
    "brand": "Verbatim",
    "url": None,
    "kind": "guide",
    "video_id": "Lm9Z8c-r2AA",
    "answer": "Para quitar la protección contra escritura de una Verbatim, primero revisa si tiene un "
              "interruptor físico de bloqueo y prueba Diskpart desde CMD. Si sigue protegida, "
              "identifica el controlador con ChipGenius — muchas Verbatim usan chip Alcor Micro — y "
              "repáralo con su herramienta de fábrica correspondiente.",
    "why": "Muchas memorias Verbatim usan controladores Alcor Micro, que activan un bloqueo de "
           "solo lectura cuando detectan errores de escritura repetidos o un fallo de energía "
           "durante una transferencia. Es un mecanismo de protección del propio chip, no un defecto "
           "de fábrica ni un problema físico de la carcasa.",
    "variants": [
        "Protegida contra escritura",
        "No deja copiar ni borrar archivos",
        "Pide formatear y falla",
        "Windows no la reconoce en absoluto",
    ],
    "intro": "¿Tu memoria Verbatim aparece protegida contra escritura y no te deja copiar ni borrar "
             "archivos? Muchas Verbatim usan controlador Alcor Micro — aquí tienes la solución "
             "específica paso a paso.",
    "steps": [
        "Comprueba si tu Verbatim tiene un <strong>interruptor físico</strong> de bloqueo lateral.",
        "Prueba <strong>Diskpart</strong>: CMD como administrador → <code>diskpart</code> → <code>list disk</code> → <code>select disk N</code> → <code>attributes disk clear readonly</code>.",
        "Si sigue protegida, identifica el controlador con <a href=\"/chipgenius\">ChipGenius</a> — muchas Verbatim usan chip <strong>Alcor Micro</strong>.",
        "Descarga la herramienta de tu controlador desde esta web y ejecútala como administrador.",
    ],
})

# ---- Herramientas de audio para Windows (Dolby, Harman Kardon, DTS) ----
AUDIO_TOOLS = [
    {
        "slug": "activar-dolby-audio-windows",
        "title": "Cómo Activar Dolby Audio en Windows 10/11 (Driver Gratis)",
        "brand": "Dolby Audio",
        "kind": "audio",
        "video_id": "YtmjMKNIepg",
        "related_videos": [
            {"id": "l9UY4ixWoTk", "label": "Activa AUDIO CINE en Windows (El Truco Dolby Audio)"},
        ],
        "intro": "¿Tu PC suena plano y sin graves comparado con otros equipos? Windows no trae "
                 "activado por defecto el procesamiento de audio Dolby, aunque tu tarjeta de sonido "
                 "sea compatible. Así lo activas gratis.",
        "why": "La mayoría de portátiles y placas base traen el hardware compatible con Dolby Audio, "
               "pero el driver/APO de Dolby no viene preinstalado de fábrica en Windows — el "
               "fabricante lo omite para abaratar costos de licencia. Instalando el driver correcto "
               "se activa el ecualizador y la virtualización de sonido envolvente sin hardware extra.",
        "steps": [
            "Mira el vídeo de abajo: el link de descarga del driver está en el <strong>comentario fijado</strong> del video.",
            "Descarga e instala el driver de Dolby Audio siguiendo el paso a paso del vídeo.",
            "Reinicia el PC y abre la app de Dolby Access / Dolby Audio para activar el perfil de ecualización.",
            "Ajusta el perfil (Película, Música, Juego) según el uso que le des al equipo.",
        ],
    },
    {
        "slug": "activar-dolby-atmos-windows",
        "title": "Cómo Activar Dolby Atmos Gratis en Windows 10/11",
        "brand": "Dolby Atmos",
        "kind": "audio",
        "video_id": "4JzoCDF2V2E",
        "related_videos": [
            {"id": "EVJacCtV-gU", "label": "Windows Está Bloqueando el Mejor Audio de tu PC: Así Activas Dolby Atmos Gratis"},
            {"id": "TuiOX1jFLyA", "label": "Audio Profesional en tu PC GRATIS y mejor que Dolby Atmos"},
        ],
        "intro": "Dolby Atmos crea sonido envolvente 3D incluso con auriculares normales o los "
                 "altavoces integrados del portátil, pero Windows lo mantiene bloqueado tras un pago "
                 "en la Microsoft Store. Aquí tienes la forma gratuita de activarlo.",
        "why": "Microsoft vende la app \"Dolby Atmos for Headphones\" en su tienda, pero el driver de "
               "audio base necesario ya suele estar soportado por el hardware de tu PC. Con el "
               "paquete correcto se puede activar la virtualización de sonido envolvente sin pagar "
               "la licencia de la Store.",
        "steps": [
            "Mira el vídeo de abajo: el link de descarga está en el <strong>comentario fijado</strong> del video.",
            "Descarga e instala el paquete siguiendo el paso a paso del vídeo.",
            "Reinicia el PC y selecciona Dolby Atmos como formato de sonido espacial en la configuración de audio de Windows.",
            "Prueba con un vídeo o juego compatible con audio envolvente para notar la diferencia.",
        ],
    },
    {
        "slug": "instalar-harman-kardon-audio-windows",
        "title": "Cómo Instalar el Driver de Audio Harman Kardon en Windows",
        "brand": "Harman Kardon",
        "kind": "audio",
        "video_id": "UAp_XyYizNc",
        "related_videos": [
            {"id": "OOPqiiFCn7M", "label": "Cómo instalar el driver de Harman Kardon en Windows"},
        ],
        "intro": "¿Tu portátil tiene altavoces Harman Kardon pero el sonido suena débil o sin el "
                 "perfil de audio de fábrica? El driver oficial de Harman Kardon mejora notablemente "
                 "la calidad respecto al driver genérico de Windows.",
        "why": "Windows Update instala un driver de audio genérico que funciona, pero no aplica el "
               "perfil de ecualización ni la virtualización de graves que sí trae el software "
               "propietario de Harman Kardon, pensado específicamente para esos altavoces.",
        "steps": [
            "Mira el vídeo de abajo: el link de descarga está en el <strong>comentario fijado</strong> del video.",
            "Desinstala (opcional) el driver de audio genérico actual desde el Administrador de dispositivos.",
            "Instala el driver/software de Harman Kardon siguiendo el paso a paso del vídeo.",
            "Reinicia el PC y abre la app de Harman Kardon para ajustar el perfil de sonido.",
        ],
    },
    {
        "slug": "instalar-dts-audio-windows",
        "title": "Cómo Instalar DTS Audio en Windows 10/11 (Guía Completa)",
        "brand": "DTS Audio",
        "kind": "audio",
        "video_id": "uaWYCx-YOqc",
        "intro": "DTS es otra tecnología de sonido envolvente, alternativa a Dolby Atmos, usada por "
                 "muchos fabricantes de laptops. Si tu PC no lo trae activado, así lo instalas gratis.",
        "why": "Al igual que con Dolby, muchos equipos traen el hardware compatible con DTS pero el "
               "software/driver no viene preinstalado de fábrica. Instalando el paquete correcto se "
               "habilita el procesamiento de audio envolvente DTS sin hardware adicional.",
        "steps": [
            "Mira el vídeo de abajo: el link de descarga está en el <strong>comentario fijado</strong> del video.",
            "Descarga e instala el paquete de DTS Audio siguiendo el paso a paso del vídeo.",
            "Reinicia el PC y abre la app de DTS para seleccionar el perfil de sonido.",
            "Ajusta el perfil según tu uso (música, película, juegos).",
        ],
    },
]
