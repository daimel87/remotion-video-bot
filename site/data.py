# -*- coding: utf-8 -*-
"""Datos de las herramientas y contenido SEO de cada página.
Editar aquí para añadir/quitar herramientas: luego ejecutar build.py"""

SITE = {
    "name": "D-TECH USB",
    "tagline": "Herramientas y guías para reparar memorias USB",
    "domain": "https://dtechusb.pages.dev",  # cambiar por tu dominio propio cuando lo tengas
    "youtube": "https://www.youtube.com/channel/UCLppVn9LXrHWGTsnQr2ov1g?sub_confirmation=1",
    "playlist_id": "PLBfPLvLvAgajMalhkQ8ru4RnB9s4Fp1_N",  # lista general de reparaciones USB (87 videos)
    "description": "Repositorio gratuito de herramientas de reparación de memorias USB (MPTool) "
                   "para todos los controladores: Phison, SMI, Chipsbank, FirstChip y más. "
                   "Guías paso a paso para formatear y reparar pendrives dañados.",
    # ==== MONETAG (todas las zonas de este sitio) ====
    "monetag_push": '<script src="https://5gvci.com/act/files/tag.min.js?z=11426112" data-cfasync="false" async></script>',
    "monetag_inpage_push": "<script>(function(s){s.dataset.zone='11443690',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>",
    "monetag_vignette": "<script>(function(s){s.dataset.zone='11443698',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>",
    "monetag_popunder": "<script>(function(s){s.dataset.zone='11434447',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>",
    "monetag_directlink": "https://omg10.com/4/11443701",  # Direct Link (se abre al pulsar el botón de descarga)
    "google_verify": "4t1k_fsPm-BsPZ6JQFLArsFhmg_LqMMaYAX1iqdFg4E",  # Google Search Console
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
TOOLS = [
    {
        "slug": "chipgenius",
        "title": "ChipGenius 4.21 – Identificar el controlador de tu USB",
        "brand": "ChipGenius",
        "url": "https://www.mediafire.com/file/v58c3jvkisf1ok7/ChipGenius-con-lanzador+4.21.0701.rar/file",
        "key": "repusb",
        "kind": "detector",
        "video_id": "1BKymQQoDs8",
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
        "brand": "Tabla de referencia",
        "url": "https://mega.nz/file/i6IwhCiB#tzYmDfMiZ3Ycfo7Rh_si3M5UE8rgpl7LOOBxVPk9fH0",
        "kind": "detector",
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

for slug, brand, url in _CONTROLLERS:
    TOOLS.append({
        "slug": slug,
        "title": f"Herramienta {brand} – Reparar y formatear USB {brand}",
        "brand": brand,
        "url": url,
        "kind": "mptool",
        "playlist": _PLAYLISTS.get(slug),
        "video_id": _VIDEOS.get(slug),
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
    "intro": "¿Tu memoria USB dice \"el disco está protegido contra escritura\" y no te deja "
             "formatear ni borrar? Aquí tienes todas las formas de quitar la protección contra "
             "escritura de un pendrive o tarjeta SD, paso a paso y en vídeo.",
    "steps": [
        "Comprueba si tu USB tiene un <strong>interruptor físico</strong> de bloqueo en el lateral; muévelo a la posición de desbloqueo.",
        "Prueba con <strong>Diskpart</strong>: abre CMD como administrador → <code>diskpart</code> → <code>list disk</code> → <code>select disk N</code> → <code>attributes disk clear readonly</code>.",
        "Edita el <strong>registro de Windows</strong> en <code>HKLM\\SYSTEM\\CurrentControlSet\\Control\\StorageDevicePolicies</code> y pon <code>WriteProtect = 0</code>.",
        "Si nada funciona, el problema es del controlador: identifica tu chip con <a href=\"/chipgenius.html\">ChipGenius</a> y usa su herramienta de reparación de esta web.",
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
        "Si no aparece en ningún lado (ni en Administrador de discos), identifica el chip con <a href=\"/chipgenius.html\">ChipGenius</a> y usa la herramienta de reparación de esta web para tu controlador.",
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
        "Identifica el chip exacto con <a href=\"/chipgenius.html\">ChipGenius</a>: marca, VID/PID y fabricante del flash.",
        "Descarga la <strong>MPTool</strong> de tu controlador específico en esta web y ejecútala como administrador hasta que termine en verde.",
        "Vuelve a formatear en Windows una vez reparada — ahora sí debería completarse sin errores.",
    ],
})
