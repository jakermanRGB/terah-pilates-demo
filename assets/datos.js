/* Térah Pilates Studio: todo lo que cambia seguido vive aquí.
   Editar en UTF-8. Precios en MXN. Lo marcado "por confirmar" sale de la ficha. */
window.NEGOCIO = {
  nombre: "Térah Pilates Studio",
  giro: "ExerciseGym",
  telefono: "+526245707543",
  whatsapp: "526245707543",
  correo: "terah_@outlook.com",
  direccion: "Jacarandas 2615, Local 5, Plaza Master Cardones, Lomas del Pacífico, 23473 Cabo San Lucas, B.C.S.",
  direccion_corta: { es: "Plaza Master Cardones, local 5", en: "Plaza Master Cardones, suite 5" },
  colonia: "Lomas del Pacífico, Cabo San Lucas",
  mapa_query: "TÉRAH PILATES STUDIO, Jacarandas 2615, Cabo San Lucas",
  maps_url: "https://www.google.com/maps/place/T%C3%89RAH+PILATES+STUDIO/@22.9040935,-109.9549997,17z/data=!4m6!3m5!1s0x86af35ca56019fe7:0x9c72cabce971780b!8m2!3d22.9040935!4d-109.9549997",
  instagram: "https://www.instagram.com/terah.pilates/",
  google: { calificacion: 4.8, opiniones: 49 },
  zona_horaria: "America/Mazatlan",

  /* Fitco: reservas y pagos viven ahí */
  fitco: {
    base: "https://terahpilates.fitcolatam.com",
    horario: "https://terahpilates.fitcolatam.com/classes",
    planes: "https://terahpilates.fitcolatam.com/plans",
    comprar: id => "https://terahpilates.fitcolatam.com/buy/" + id,
    api: "https://api.fitcoapp.net/lessons/search",
    establecimiento: 2945
  },

  /* Horario del estudio para "abierto ahora" (sale de las clases; por confirmar el de recepción) */
  horario: {
    0: [],
    1: [["07:00","10:00"],["17:00","21:00"]],
    2: [["07:00","10:00"],["17:00","21:00"]],
    3: [["07:00","10:00"],["17:00","21:00"]],
    4: [["07:00","10:00"],["17:00","21:00"]],
    5: [["07:00","10:00"],["17:00","21:00"]],
    6: [["07:00","09:00"]]
  },
  cierres_especiales: { "2026-12-25": [], "2027-01-01": [] },

  /* El enfoque de cada día. Se usa en "La semana" y para nombrar las clases. */
  enfoques: {
    1: { es: "Full Body", en: "Full Body", nota: { es: "Todo el cuerpo, de pies a hombros.", en: "Head to toe, every muscle on the menu." } },
    2: { es: "Tren inferior", en: "Lower Body", nota: { es: "Glúteo, piernas y cadera estable.", en: "Glutes, legs and a steady pelvis." } },
    3: { es: "Jumpboard", en: "Jumpboard", nota: { es: "Saltos acostada sobre el reformer. Intermedio y avanzado.", en: "Cardio jumps lying on the reformer. Intermediate and up." } },
    4: { es: "Tren superior", en: "Upper Body", nota: { es: "Brazos, espalda y una postura que se nota.", en: "Arms, back and posture you can see." } },
    5: { es: "Flex Full Body", en: "Flex Full Body", nota: { es: "Fuerza con movilidad para cerrar la semana.", en: "Strength plus mobility to close the week." } },
    6: { es: "Full Body", en: "Full Body", nota: { es: "Dos clases temprano, antes de la playa.", en: "Two early classes, before the beach." } }
  },

  /* Plantilla semanal: se usa si la conexión con Fitco falla. Formato [hora, coach] */
  horario_clases: {
    1: [["08:00","Fabi"],["09:00","Fabi"],["17:00","Fabi"],["18:00","Fabi"],["19:00","Luisa"]],
    2: [["07:00","Fabi"],["08:00","Fabi"],["09:00","Fabi"],["17:00","Fabi"],["18:00","Fabi"],["19:00","Fabi"],["20:00","Fabi"]],
    3: [["07:00","Fabi"],["08:00","Fabi"],["17:00","Fabi"],["18:00","Fabi"],["19:00","Fabi"],["20:00","Fabi"]],
    4: [["08:00","Fabi"],["09:00","Fabi"],["17:00","Fabi"],["18:00","Fabi"],["19:00","Fabi"],["20:00","Fabi"]],
    5: [["07:00","Fabi"],["08:00","Fabi"],["09:00","Fabi"],["17:00","Fabi"],["18:00","Fabi"],["19:00","Luisa"],["20:00","Luisa"]],
    6: [["07:00","Itzel"],["08:00","Itzel"]]
  },
  cupo: 4,
  duracion: 45,

  /* Planes: id = el id del plan en Fitco (compra directa) */
  moneda: "MXN",
  prueba: { id: 561449, precio: 230,
    nombre: { es: "Clase prueba", en: "Trial class" },
    desc: { es: "Tu primera clase grupal de 45 minutos. Solo alumnas y alumnos nuevos, una por persona.", en: "Your first 45-minute group class. New students only, one per person." } },
  planes: [
    { id: 560116, clases: 1,  precio: 350,  vigencia: { es: "7 días", en: "7 days" } },
    { id: 547102, clases: 4,  precio: 999,  vigencia: { es: "30 días", en: "30 days" } },
    { id: 561689, clases: 8,  precio: 1999, vigencia: { es: "30 días", en: "30 days" } },
    { id: 561690, clases: 12, precio: 2799, vigencia: { es: "30 días", en: "30 days" } },
    { id: 560153, clases: 0,  precio: 2999, vigencia: { es: "30 días · 1 clase al día", en: "30 days · 1 class a day" }, ilimitado: true }
  ],
  privada: { id: 541456, precio: 1300, personas: 4 },

  coaches: [
    { nombre: "Fabi Bojorges", foto: "", rol: { es: "Da la mayoría de las clases, mañana y tarde.", en: "Teaches most of the week, morning and evening." } },
    { nombre: "Luisa Ferreira", foto: "", rol: { es: "Tardes de lunes y viernes.", en: "Monday and Friday evenings." } },
    { nombre: "Itzel Chávez", foto: "", rol: { es: "Sábados temprano.", en: "Early Saturdays." } }
  ],

  /* Reseñas copiadas tal cual de Google */
  resenas: [
    { nombre: "Nayeli Nieto", texto: "Literalmente de las mejores decisiones que he tomado este año. Además de disfrutar muchísimo cada clase, he notado cambios reales en mi cuerpo, mi postura y hasta en mi energía diaria." },
    { nombre: "Mya figueroa reyes", texto: "Desde que empecé a venir a este estudio de pilates, mi relación con el ejercicio cambió por completo 🤍" },
    { nombre: "Yetsibe Castañeda", texto: "Agradezco mucho an Eve y Fabi por su entrega y dedicación en cada clase, Amo Térah pilates, de verdad me a cambiado la vida!" }
  ],

  promo: null,
  wa_mensaje: {
    es: "Hola Térah, vi su página y tengo una duda.",
    en: "Hi Térah! I found your website and have a quick question."
  },
  wa_privada: {
    es: "Hola Térah, quiero agendar una clase privada (hasta 4 personas). ¿Qué horarios tienen?",
    en: "Hi Térah! I'd like to book a private class (up to 4 people). What times do you have?"
  },
  wa_celebracion: {
    es: "Hola Térah, quiero organizar una celebración en el estudio. ¿Me pueden dar informes?",
    en: "Hi Térah! I'd like to host a celebration at the studio. Could you send me details?"
  }
};
