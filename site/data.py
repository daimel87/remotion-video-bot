# -*- coding: utf-8 -*-
"""Datos de las herramientas y contenido SEO de cada página.
Editar aquí para añadir/quitar herramientas: luego ejecutar build.py"""

SITE = {
    "name": "D-TECH USB",
    "tagline": "Herramientas y guías para reparar memorias USB",
    "domain": "https://dtechusb.pages.dev",  # cambiar por tu dominio propio cuando lo tengas
    "youtube": "https://www.youtube.com/channel/UCLppVn9LXrHWGTsnQr2ov1g?sub_confirmation=1",
    "description": "Repositorio gratuito de herramientas de reparación de memorias USB (MPTool) "
                   "para todos los controladores: Phison, SMI, Chipsbank, FirstChip y más. "
                   "Guías paso a paso para formatear y reparar pendrives dañados.",
    "adsterra_desktop": "bef7ad1928b96e7c8a74641eae7831f2",  # banner Adsterra 728x90 (escritorio)
    "adsterra_mobile": "34b9456d140c391cf222a083843e7112",   # banner Adsterra 320x50 (móvil)
    "adsterra_smartlink": "https://www.effectivecpmnetwork.com/rw6cjraf55?key=d14fae77a93a3d3ac84c55802e5d0f7a",  # Smartlink en botones de descarga
    "adsterra_socialbar": "https://pl30472951.effectivecpmnetwork.com/24/cd/3c/24cd3c81b3ba31e15d37a3e645e60a7e.js",  # Social Bar
    "google_verify": "4t1k_fsPm-BsPZ6JQFLArsFhmg_LqMMaYAX1iqdFg4E",  # Google Search Console
}

# slug, título, marca, enlace de descarga, clave (opcional), intro SEO, pasos
TOOLS = [
    {
        "slug": "chipgenius",
        "title": "ChipGenius 4.21 – Identificar el controlador de tu USB",
        "brand": "ChipGenius",
        "url": "https://www.mediafire.com/file/v58c3jvkisf1ok7/ChipGenius-con-lanzador+4.21.0701.rar/file",
        "key": "repusb",
        "kind": "detector",
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

for slug, brand, url in _CONTROLLERS:
    TOOLS.append({
        "slug": slug,
        "title": f"Herramienta {brand} – Reparar y formatear USB {brand}",
        "brand": brand,
        "url": url,
        "kind": "mptool",
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
