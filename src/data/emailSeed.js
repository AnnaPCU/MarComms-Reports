// ════════════════════════════════════════════════════════════════
//  SEED — Pilar Email Marketing (Mailchimp / Apollo). Mensual.
//  Datos en código (sin base de datos). Se cargan procesando los
//  exports de Mailchimp con `scripts/mailchimp-to-seed.mjs` y pegando
//  el resultado en EMAIL_DB.
//
//  Forma de cada período (campaña/secuencia) — ver utils/mailchimp/build.js:
//    {
//      campaignName,
//      emails:   [{ name, subject, metrics:{ sent, openRate, clickRate, ctor, … } }],
//      totals:   { emailCount, totalSent, totalDelivered, openRate, clickRate, ctor, … },
//      comparison:[{ name, aperturas, clics, ctor }],
//      allLeads: [{ email, firstName, lastName, company, clicks, opens, campaigns, emailAppearances }],
//      hotLeads: [ …subconjunto de allLeads con clicks>0… ],
//      hotLeadsCount,
//    }
//  Si en el mes salió más de una campaña, el período es
//  { campaigns: [{ id, label, exportDate, …campaña }] } en orden de carga y la
//  vista muestra una botonera de campaña (docs/DECISIONES.md §15).
//
//  Mientras no haya datos reales importados, EMAIL_DB queda vacío y la
//  vista muestra "Sin información suficiente" (regla de honestidad).
// ════════════════════════════════════════════════════════════════

import { MONTHS_2026 } from '@/constants/periods';

// { [accountId]: { name, handle?, periods: { [periodId]: <campaña> } } }
export const EMAIL_DB = {};

// Control Union + Peterson Solutions Latinoamérica · m08 — generado con scripts/mailchimp-to-seed.mjs
// (allLeads omitido del bundle: solo se usa hotLeads en la vista)
EMAIL_DB['cups'] = {
  name: "Control Union + Peterson Solutions Latinoamérica",
  periods: {
    m08: {
      campaignName: "Webinar EUDR — CU + Peterson · Agosto 2026",
      emails: [
        {
          name: "Email 1 — Invitación",
          subject: "",
          metrics: {
            sent: 2766,
            uniqueOpens: 513,
            uniqueClicks: 42,
            totalOpens: 925,
            totalClicks: 152,
            openRate: 18.55,
            clickRate: 1.52,
            ctor: 8.19
          }
        },
        {
          name: "Email 2 — Recordatorio",
          subject: "",
          metrics: {
            sent: 2675,
            uniqueOpens: 465,
            uniqueClicks: 30,
            totalOpens: 753,
            totalClicks: 129,
            openRate: 17.38,
            clickRate: 1.12,
            ctor: 6.45
          }
        },
        {
          name: "Resend Email 2",
          subject: "",
          metrics: {
            sent: 184,
            uniqueOpens: 41,
            uniqueClicks: 2,
            totalOpens: 64,
            totalClicks: 4,
            openRate: 22.28,
            clickRate: 1.09,
            ctor: 4.88
          }
        },
        {
          name: "Resend — Nueva BBDD",
          subject: "",
          metrics: {
            sent: 2018,
            uniqueOpens: 410,
            uniqueClicks: 15,
            totalOpens: 562,
            totalClicks: 37,
            openRate: 20.32,
            clickRate: 0.74,
            ctor: 3.66
          }
        },
        {
          name: "Email 3 — Reactivación",
          subject: "",
          metrics: {
            sent: 2666,
            uniqueOpens: 456,
            uniqueClicks: 53,
            totalOpens: 701,
            totalClicks: 179,
            openRate: 17.1,
            clickRate: 1.99,
            ctor: 11.62
          }
        },
        {
          name: "Email 4 — Última convocatoria",
          subject: "",
          metrics: {
            sent: 2657,
            uniqueOpens: 465,
            uniqueClicks: 51,
            totalOpens: 676,
            totalClicks: 153,
            openRate: 17.5,
            clickRate: 1.92,
            ctor: 10.97
          }
        },
        {
          name: "Email 5 — Post-webinar (registrados)",
          subject: "",
          metrics: {
            sent: 117,
            uniqueOpens: 28,
            uniqueClicks: 9,
            totalOpens: 43,
            totalClicks: 18,
            openRate: 23.93,
            clickRate: 7.69,
            ctor: 32.14
          }
        },
        {
          name: "Email 5 — Post-webinar (participantes)",
          subject: "",
          metrics: {
            sent: 79,
            uniqueOpens: 22,
            uniqueClicks: 3,
            totalOpens: 35,
            totalClicks: 4,
            openRate: 27.85,
            clickRate: 3.8,
            ctor: 13.64
          }
        }
      ],
      totals: {
        emailCount: 8,
        totalSent: 13162,
        totalDelivered: 13162,
        totalOpens: 2400,
        totalClicks: 205,
        totalBounces: null,
        totalUnsubs: null,
        openRate: 18.23,
        clickRate: 1.56,
        ctor: 8.54,
        bounceRate: null,
        unsubRate: null
      },
      comparison: [
        {
          name: "Email 1 — Invitación",
          aperturas: 18.5,
          clics: 1.5,
          ctor: 8.2
        },
        {
          name: "Email 2 — Recordatorio",
          aperturas: 17.4,
          clics: 1.1,
          ctor: 6.5
        },
        {
          name: "Resend Email 2",
          aperturas: 22.3,
          clics: 1.1,
          ctor: 4.9
        },
        {
          name: "Resend — Nueva BBDD",
          aperturas: 20.3,
          clics: 0.7,
          ctor: 3.7
        },
        {
          name: "Email 3 — Reactivación",
          aperturas: 17.1,
          clics: 2,
          ctor: 11.6
        },
        {
          name: "Email 4 — Última convocatoria",
          aperturas: 17.5,
          clics: 1.9,
          ctor: 11
        },
        {
          name: "Email 5 — Post-webinar (registrados)",
          aperturas: 23.9,
          clics: 7.7,
          ctor: 32.1
        },
        {
          name: "Email 5 — Post-webinar (participantes)",
          aperturas: 27.8,
          clics: 3.8,
          ctor: 13.6
        }
      ],
      hotLeads: [
        {
          email: "mjmacias@ragon.com.mx",
          clicks: 36,
          opens: 4,
          company: "Comercializadora Ragón",
          firstName: "Maria",
          lastName: "Macias Pimentel",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "ken@thrivefarmers.com",
          clicks: 34,
          opens: 10,
          company: "Thrive Farmers",
          firstName: "Kenneth",
          lastName: "Lander",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "angel.cedeno@starkist.com",
          clicks: 32,
          opens: 12,
          company: "StarKist Co.",
          firstName: "Angel",
          lastName: "Cedeno",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "amora@blumos.cl",
          clicks: 32,
          opens: 8,
          company: "Grupo Blumos, an IMCD company",
          firstName: "Alfredo",
          lastName: "Mora Cobian",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "jennifer.ballestero@somosbretano.com",
          clicks: 32,
          opens: 8,
          company: "Bretano An IMCD Company",
          firstName: "Jennifer",
          lastName: "Ballestero Bermudez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "mfernandez@pandol.com",
          clicks: 32,
          opens: 4,
          company: "Pandol Brothers Inc.",
          firstName: "Marcelo",
          lastName: "Fernandez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "p.clerici@agrifirm.com",
          clicks: 32,
          opens: 4,
          company: "Royal Agrifirm Group",
          firstName: "Pierina",
          lastName: "Clerici",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "mbascope@polarisrei.com",
          clicks: 28,
          opens: 6,
          company: "Polaris Renewable Energy Inc.",
          firstName: "Marcela",
          lastName: "Bascope",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "ecastaneda@ragon.com.mx",
          clicks: 26,
          opens: 7,
          company: "Comercializadora Ragón",
          firstName: "Edson",
          lastName: "Castaneda",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "maria.monges@nitrongroup.com",
          clicks: 25,
          opens: 4,
          company: "Nitron Group LLC",
          firstName: "Maria",
          lastName: "Monges Jharolinn",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "luis.espinoza@ncrvoyix.com",
          clicks: 9,
          opens: 11,
          company: "NCR Voyix",
          firstName: "Luis",
          lastName: "Espinoza Benavides",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "crestrepo@expocafe.com",
          clicks: 8,
          opens: 15,
          company: "Expocafe S.A",
          firstName: "Carolina",
          lastName: "Restrepo Perez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "nkantorowicz@blumosgroup.com",
          clicks: 8,
          opens: 1,
          company: "Grupo Blumos Argentina - An IMCD company",
          firstName: "Nicolas",
          lastName: "Kantorowicz",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "patricio_espinoza@cargill.com",
          clicks: 7,
          opens: 109,
          company: "Cargill",
          firstName: "Patricio",
          lastName: "Espinoza",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "pcuellarm@corona.com.co",
          clicks: 7,
          opens: 9,
          company: "Corona",
          firstName: "Paula",
          lastName: "Cuellar",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "rossana.oropesa@westfaliafruit.com",
          clicks: 7,
          opens: 4,
          company: "Westfalia Fruit Estates",
          firstName: "Rossana",
          lastName: "Oropesa Vela",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "lucette@solidaridadnetwork.org",
          clicks: 6,
          opens: 32,
          company: "Solidaridad network",
          firstName: "Lucette",
          lastName: "Martinez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "vanesa.mendoza@bunge.com",
          clicks: 6,
          opens: 14,
          company: "Bunge",
          firstName: "Vanesa",
          lastName: "Mendoza",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "almir@biosafras.com.py",
          clicks: 5,
          opens: 11,
          company: "biosafras",
          firstName: "",
          lastName: "",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "icollazo@cousa.com",
          clicks: 5,
          opens: 7,
          company: "COUSA",
          firstName: "Ines",
          lastName: "Collazo Turell",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "mchampion@robecayazoo.com",
          clicks: 5,
          opens: 7,
          company: "Rones y Bebidas del Caribe - Yazoo",
          firstName: "Maria",
          lastName: "Champion Torres",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "altagracia.morales@avantorsciences.com",
          clicks: 5,
          opens: 3,
          company: "Avantor",
          firstName: "Altagracia",
          lastName: "Morales",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "maria.senosiain@ar.mcd.com",
          clicks: 5,
          opens: 1,
          company: "Arcos Dorados",
          firstName: "Maria",
          lastName: "Teresa Senosiain",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            4,
            5,
            6
          ]
        },
        {
          email: "melissa.quintana@blumar.com",
          clicks: 5,
          opens: 1,
          company: "Blumar",
          firstName: "Melissa",
          lastName: "Josefina Quintana",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "nayeli.martinez@oleomex.com.mx",
          clicks: 4,
          opens: 26,
          company: "OLEOMEX",
          firstName: "Nayeli",
          lastName: "Martinez Ulloa",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "leonardo.paipilla@proforest.net",
          clicks: 4,
          opens: 24,
          company: "Proforest",
          firstName: "Leonardo",
          lastName: "Paipilla Pardo",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "carlos.calo@centralpuerto.com",
          clicks: 4,
          opens: 14,
          company: "Central Puerto",
          firstName: "Carlos",
          lastName: "Calo",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "luz.salinas@lar.com.py",
          clicks: 4,
          opens: 14,
          company: "lar",
          firstName: "",
          lastName: "",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "andres.lypynskyj@lcecorp.com",
          clicks: 4,
          opens: 12,
          company: "Little Caesars Pizza",
          firstName: "Andres",
          lastName: "Lypynskyj",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "arturo.zaldivar@dole.com",
          clicks: 4,
          opens: 12,
          company: "Dole USA",
          firstName: "Arturo",
          lastName: "Zaldivar",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "manuel.sanchez@upm.com",
          clicks: 4,
          opens: 10,
          company: "UPM Uruguay",
          firstName: "Manuel",
          lastName: "Sanchez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "lmaya@westfaliafruit.com",
          clicks: 4,
          opens: 9,
          company: "Westfalia Fruit Estates",
          firstName: "Luis",
          lastName: "Carlos Maya",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "federica.bournissen@upm.com",
          clicks: 4,
          opens: 8,
          company: "UPM Uruguay",
          firstName: "Federica",
          lastName: "Bournissen Caballero",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "brenda@terranostra.com",
          clicks: 4,
          opens: 7,
          company: "Terra Nostra",
          firstName: "Brenda",
          lastName: "Villalobos",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "cmora@agroamerica.com",
          clicks: 4,
          opens: 7,
          company: "AgroAmerica",
          firstName: "Christian",
          lastName: "Mora",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "freyes@agroamerica.com",
          clicks: 4,
          opens: 6,
          company: "AgroAmerica",
          firstName: "Fernando",
          lastName: "Reyes De Leon",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "gerardo_linares@barry-callebaut.com",
          clicks: 4,
          opens: 6,
          company: "Barry Callebaut Sourcing AG",
          firstName: "Gerardo",
          lastName: "Linares",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "gonzalo.zuniga@alianzateam.com",
          clicks: 4,
          opens: 6,
          company: "Alianza Team®",
          firstName: "Gonzalo",
          lastName: "Zuniga",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "ana.celis@ramo.com.co",
          clicks: 4,
          opens: 5,
          company: "Productos Ramo S.A.",
          firstName: "Ana",
          lastName: "Celis Salazar",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "andrea.angel@team.co",
          clicks: 4,
          opens: 5,
          company: "Team Foods",
          firstName: "Andrea",
          lastName: "Angel Lopez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "yeny.gil@team.co",
          clicks: 4,
          opens: 5,
          company: "Team Foods",
          firstName: "Yeny",
          lastName: "Gil Romero",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "luzeth.garces@alianzateam.com",
          clicks: 4,
          opens: 4,
          company: "Alianza Team®",
          firstName: "Luzeth",
          lastName: "Garces Vasquez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "nadiar@biafoods.com",
          clicks: 4,
          opens: 4,
          company: "Bia Foods",
          firstName: "Nadia",
          lastName: "Rivera",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "flavia.meza@carvimsa.com",
          clicks: 4,
          opens: 4,
          company: "carvimsa",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "ana.amaya@alianzateam.com",
          clicks: 4,
          opens: 3,
          company: "Alianza Team®",
          firstName: "Ana",
          lastName: "Lucia Amaya",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "apadron@biafoods.com",
          clicks: 4,
          opens: 2,
          company: "Bia Foods",
          firstName: "Abraham",
          lastName: "Padron",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "dnaguilar@grupoclc.com",
          clicks: 4,
          opens: 2,
          company: "GRUPO CLC",
          firstName: "Dominik",
          lastName: "Aguilar",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "fbenavides@bredenmaster.com",
          clicks: 4,
          opens: 2,
          company: "BredenMaster",
          firstName: "Francisco",
          lastName: "Benavides",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "german.mejia@littlecaesars.com",
          clicks: 4,
          opens: 2,
          company: "Little Caesars Pizza",
          firstName: "German",
          lastName: "Mejia",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "isabel.giraldo@alianzateam.com",
          clicks: 4,
          opens: 2,
          company: "Alianza Team®",
          firstName: "Isabel",
          lastName: "Giraldo",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "jbarragan@alimentossanmarcos.com",
          clicks: 4,
          opens: 2,
          company: "San Marcos México",
          firstName: "Julio",
          lastName: "Barragan Perez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "jcouttolenc@alimentossanmarcos.com",
          clicks: 4,
          opens: 2,
          company: "San Marcos México",
          firstName: "Jose",
          lastName: "Flores Diaz",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "josue.moraleda@oppy.com",
          clicks: 4,
          opens: 2,
          company: "Oppy",
          firstName: "Josue",
          lastName: "Moraleda Werner",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "mlopez@agroamerica.com",
          clicks: 4,
          opens: 2,
          company: "AgroAmerica",
          firstName: "Merclin",
          lastName: "Lopez Poveda",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "rfernandez@cafepuntadelcielo.co",
          clicks: 4,
          opens: 2,
          company: "Café Punta del Cielo",
          firstName: "Ruth",
          lastName: "Fernandez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "uleon@biafoods.com",
          clicks: 4,
          opens: 2,
          company: "Bia Foods",
          firstName: "Ulises",
          lastName: "Leon Paez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "velias@biafoods.com",
          clicks: 4,
          opens: 2,
          company: "Bia Foods",
          firstName: "Velia",
          lastName: "Suarez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "zaira.reyna@ashland.com",
          clicks: 4,
          opens: 2,
          company: "Ashland",
          firstName: "Zaira",
          lastName: "Reyna",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "lsalinas@cofcointernational.com",
          clicks: 4,
          opens: 2,
          company: "cofcointernational",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            7
          ]
        },
        {
          email: "mdalponte@kumbaru.com.ar",
          clicks: 4,
          opens: 2,
          company: "kumbaru",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            7
          ]
        },
        {
          email: "eloi.b@copronar.com.py",
          clicks: 3,
          opens: 35,
          company: "copronar",
          firstName: "",
          lastName: "",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "alejandra@fronterra.eco",
          clicks: 3,
          opens: 9,
          company: "FRONTERRA",
          firstName: "Alejandra",
          lastName: "Manrique Milla",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "o.mendez@cacaohunters.com",
          clicks: 3,
          opens: 7,
          company: "Cacao Hunters",
          firstName: "Omar",
          lastName: "Mendez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "jennifer.rojas@ecomtrading.com",
          clicks: 3,
          opens: 7,
          company: "ecomtrading",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "dmendoza@palmaceitera.com",
          clicks: 3,
          opens: 4,
          company: "Agroindustrial de Palma Aceitera S.A.",
          firstName: "Deyby",
          lastName: "Mendoza",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "idania.reyes@reckitt.com",
          clicks: 3,
          opens: 3,
          company: "Reckitt Benckiser Group plc",
          firstName: "Idania",
          lastName: "Reyes Caudillo",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "juan.espejo@wilsonart.com",
          clicks: 3,
          opens: 3,
          company: "Wilsonart",
          firstName: "Juan",
          lastName: "Espejo Barrios",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "leticia.lopez@somaxagro.com",
          clicks: 3,
          opens: 3,
          company: "somaxagro",
          firstName: "",
          lastName: "",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "elizabeth.elgegren@mpf.com.pe",
          clicks: 3,
          opens: 2,
          company: "Machu Picchu Foods",
          firstName: "Elizabeth",
          lastName: "Elgegren",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "gabriela.pacheco@westfaliafruit.com",
          clicks: 3,
          opens: 1,
          company: "westfaliafruit",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "alexandra@proforest.net",
          clicks: 2,
          opens: 21,
          company: "Proforest",
          firstName: "Alexandra",
          lastName: "Gallo",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "mdelafuente@allpa.com.pe",
          clicks: 2,
          opens: 18,
          company: "AllpaSac",
          firstName: "Maria",
          lastName: "Carmen De La Fuente",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "jfonseca@citrison.com",
          clicks: 2,
          opens: 12,
          company: "CITRISON SA de CV",
          firstName: "Juan",
          lastName: "Carlos Fonseca",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "kalvarez@purafruit.com",
          clicks: 2,
          opens: 12,
          company: "PURA BERRIES S.A.C.",
          firstName: "Karen",
          lastName: "Alvarez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "diana.hernandez@us.wilmar-intl.com",
          clicks: 2,
          opens: 9,
          company: "Wilmar International",
          firstName: "Diana",
          lastName: "Hernandez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "desiree.montealegre@sucafina.com",
          clicks: 2,
          opens: 8,
          company: "Sucafina",
          firstName: "Desiree",
          lastName: "Montealegre",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "daniel@localpartners.ch",
          clicks: 2,
          opens: 7,
          company: "Fundación Local Partners",
          firstName: "Daniel",
          lastName: "Ardila Zuluaga",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "juan.gutierrez@cafesca.com",
          clicks: 2,
          opens: 7,
          company: "CAFESCA - Cafés de Especialidad de Chiapas SAPI de CV",
          firstName: "Juan",
          lastName: "Gutierrez Aguilar",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "gustavo.lamas@ldc.com",
          clicks: 2,
          opens: 6,
          company: "ldc",
          firstName: "",
          lastName: "",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "calidad.sgia@greenbox.pe",
          clicks: 2,
          opens: 5,
          company: "Greenbox",
          firstName: "Luz",
          lastName: "Tinoco",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "ignacio.faraldo@novaustral.cl",
          clicks: 2,
          opens: 5,
          company: "Nova Austral S.A.",
          firstName: "Ignacio",
          lastName: "Faraldo Portus",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "valeria.l@dos-hermanos.com",
          clicks: 2,
          opens: 5,
          company: "Dos Hermanos",
          firstName: "Valeria",
          lastName: "Leffler",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "gabriela.alanis@theodpgroup.com",
          clicks: 2,
          opens: 4,
          company: "The ODP Group",
          firstName: "Gabriela",
          lastName: "Alanis",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "certificaciones@laflorida.org.pe",
          clicks: 2,
          opens: 4,
          company: "laflorida",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "jhon.fromherz@fguarani.com.py",
          clicks: 2,
          opens: 2,
          company: "Guarani SACI",
          firstName: "Jhon",
          lastName: "Fromherz",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "m.flores@earthworm.org",
          clicks: 2,
          opens: 2,
          company: "Earthworm Foundation",
          firstName: "Martin",
          lastName: "Flores Zurita",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "mariela.umana@ecomtrading.com",
          clicks: 2,
          opens: 2,
          company: "Ecom Agroindustrial Corp.",
          firstName: "Mariela",
          lastName: "Umana",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "raul.troncoso@cencosud.cl",
          clicks: 2,
          opens: 2,
          company: "Cencosud",
          firstName: "Raul",
          lastName: "Troncoso Urquiza",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "shuaman@sunfruits.com.pe",
          clicks: 2,
          opens: 2,
          company: "SunfruitsExports",
          firstName: "Silvia",
          lastName: "Huaman Garcia",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "catalina.concha@bredenmaster.com",
          clicks: 2,
          opens: 2,
          company: "BredenMaster",
          firstName: "Catalina",
          lastName: "Concha",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "gonzalo.mendez@mercadolibre.com",
          clicks: 2,
          opens: 2,
          company: "Mercado Libre",
          firstName: "Gonzalo",
          lastName: "Mendez",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "jackhijar@gmail.com",
          clicks: 2,
          opens: 2,
          company: "gmail",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            7
          ]
        },
        {
          email: "alcione.garcias@agrofertil.com.py",
          clicks: 2,
          opens: 1,
          company: "agrofertil",
          firstName: "",
          lastName: "",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "csalvatierra@macesa.com.ni",
          clicks: 2,
          opens: 1,
          company: "Matadero Central, S.A.",
          firstName: "Caleb",
          lastName: "Salvatierra",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "hernan.zunino@twinings.com",
          clicks: 2,
          opens: 1,
          company: "Twinings",
          firstName: "Hernan",
          lastName: "Zunino",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "macarena.delsolar@dole.com",
          clicks: 2,
          opens: 1,
          company: "Dole Chile",
          firstName: "Macarena",
          lastName: "Solar Segovia",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "maria.campo@manuelita.com",
          clicks: 2,
          opens: 1,
          company: "Manuelita",
          firstName: "Maria",
          lastName: "Pilar Campo Torres",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "nelson.maya@ldc.com",
          clicks: 2,
          opens: 1,
          company: "LDC Paraguay",
          firstName: "Nelson",
          lastName: "Maya",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "stephany.meza@smurfitkappa.com.mx",
          clicks: 2,
          opens: 1,
          company: "Smurfit WestRock",
          firstName: "Stephany",
          lastName: "Meza",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "valeria.santecchia@bunge.com",
          clicks: 2,
          opens: 1,
          company: "Bunge",
          firstName: "Valeria",
          lastName: "Santecchia",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "cj_fran13@hotmail.com",
          clicks: 2,
          opens: 1,
          company: "hotmail",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "jlopez@lapolar.cl",
          clicks: 2,
          opens: 1,
          company: "ABCDIN",
          firstName: "Juan",
          lastName: "Lopez Barrios",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "jortiz@bredenmaster.com",
          clicks: 2,
          opens: 1,
          company: "BredenMaster",
          firstName: "Jorge",
          lastName: "Ortiz",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "ucertificacion@actu.com.pe",
          clicks: 2,
          opens: 1,
          company: "actu",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "ecisternaa1@correo.uss.cl",
          clicks: 2,
          opens: 1,
          company: "correo",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            7
          ]
        },
        {
          email: "jhincapie@expocafe.com",
          clicks: 2,
          opens: 1,
          company: "expocafe",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            7
          ]
        },
        {
          email: "wilber.g@ofi.com",
          clicks: 2,
          opens: 1,
          company: "ofi",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            8
          ]
        },
        {
          email: "vvicco@elementafoods.com",
          clicks: 2,
          opens: 0,
          company: "Elementa",
          firstName: "Veronica",
          lastName: "Vicco",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "sofia.ibanez@copefrut.com",
          clicks: 1,
          opens: 12,
          company: "COPEFRUT SA",
          firstName: "Sofia",
          lastName: "Ibanez Cerda",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "ronal.morales@agricolahimalaya.com",
          clicks: 1,
          opens: 11,
          company: "Agrícola Himalaya",
          firstName: "Ronal",
          lastName: "Morales",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "ruben.marin@ravago.com",
          clicks: 1,
          opens: 9,
          company: "Ravago",
          firstName: "Ruben",
          lastName: "Marin Aldana",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "elagos@banasan.com.co",
          clicks: 1,
          opens: 8,
          company: "Banasan",
          firstName: "Estefania",
          lastName: "Lagos Revelo",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "icordero@coopedota.com",
          clicks: 1,
          opens: 7,
          company: "Coopedota R.L.",
          firstName: "Ileana",
          lastName: "Cordero Fallas",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "jacob.a@agrosura.com",
          clicks: 1,
          opens: 6,
          company: "Green Coffee Company",
          firstName: "Jacob",
          lastName: "Agudelo Rueda",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "evelyn.cisterna@masisa.com",
          clicks: 1,
          opens: 5,
          company: "Masisa",
          firstName: "Evelyn",
          lastName: "Cisterna Arellano",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "pablo.duarte@frusan.cl",
          clicks: 1,
          opens: 5,
          company: "Frusan S.A.",
          firstName: "Pablo",
          lastName: "Duarte",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "Silmar.farmsgroup@hotmail.com",
          clicks: 1,
          opens: 4,
          company: "hotmail",
          firstName: "",
          lastName: "",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "gira@pomeramaderas.com",
          clicks: 1,
          opens: 4,
          company: "GARRUCHOS",
          firstName: "Gumercindo",
          lastName: "Irala",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "diego@cumbres.com.co",
          clicks: 1,
          opens: 3,
          company: "Cumbres",
          firstName: "Diego",
          lastName: "Carranza",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "natalhiacabral@gmail.com",
          clicks: 1,
          opens: 3,
          company: "gmail",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            7
          ]
        },
        {
          email: "spadilla@madretierra.com.gt",
          clicks: 1,
          opens: 2,
          company: "Ingenio Madre Tierra",
          firstName: "Sandra",
          lastName: "Padilla",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "silvia.huaman25@gmail.com",
          clicks: 1,
          opens: 2,
          company: "gmail",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            7
          ]
        },
        {
          email: "her.fornecimiento@lar.com.py",
          clicks: 1,
          opens: 2,
          company: "lar",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            8
          ]
        },
        {
          email: "alejandro.rodriguez@vnv.earth",
          clicks: 1,
          opens: 1,
          company: "VNV -  Value Network Ventures",
          firstName: "Alejandro",
          lastName: "Rodriguez Mosquera",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "eburgos@conacado.com",
          clicks: 1,
          opens: 1,
          company: "Grupo CONACADO",
          firstName: "Elizabeth",
          lastName: "Burgos",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "elopez@grandsur.com",
          clicks: 1,
          opens: 1,
          company: "GrandSur (GrandSouth S.A.)",
          firstName: "Edison",
          lastName: "Lopez Ortiz",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "jrangel@oleoflores.com",
          clicks: 1,
          opens: 1,
          company: "Oleoflores S.A.S",
          firstName: "Juliana",
          lastName: "Rangel",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "marauz@coopeagri.co.cr",
          clicks: 1,
          opens: 1,
          company: "CoopeAgri R.L.",
          firstName: "Mario",
          lastName: "Arauz Rojas",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "medioambiente@frigoconcepcion.com.py",
          clicks: 1,
          opens: 1,
          company: "Frigorífico Concepción",
          firstName: "Ana",
          lastName: "Moller",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "operaciones@frigoservice-inc.com",
          clicks: 1,
          opens: 1,
          company: "FrigoService Inc",
          firstName: "Andres",
          lastName: "Barrios Lopez",
          campaigns: 4,
          emailAppearances: [
            1,
            2,
            5,
            6
          ]
        },
        {
          email: "quality@moracue.com",
          clicks: 1,
          opens: 1,
          company: "Mora Cue Alimentos",
          firstName: "Teresa",
          lastName: "Saldivar",
          campaigns: 5,
          emailAppearances: [
            1,
            2,
            3,
            5,
            6
          ]
        },
        {
          email: "certificaciones@agrocafekivinaki.com",
          clicks: 1,
          opens: 1,
          company: "agrocafekivinaki",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "eduedu22@hotmail.com",
          clicks: 1,
          opens: 1,
          company: "hotmail",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "rcochachirivera@gmail.com",
          clicks: 1,
          opens: 1,
          company: "gmail",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            4
          ]
        },
        {
          email: "jfbermudez09@gmail.com",
          clicks: 1,
          opens: 1,
          company: "gmail",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            7
          ]
        },
        {
          email: "matheusrubert@gmail.com",
          clicks: 1,
          opens: 1,
          company: "gmail",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            7
          ]
        },
        {
          email: "maria.salgado@alianzateam.com",
          clicks: 1,
          opens: 1,
          company: "alianzateam",
          firstName: "",
          lastName: "",
          campaigns: 1,
          emailAppearances: [
            8
          ]
        }
      ],
      hotLeadsCount: 137,
      allLeadsCount: 4966
    }
  }
};


// Control Union Global · m09 — generado con scripts/mailchimp-to-seed.mjs
EMAIL_DB['cug'] = {
  name: 'Control Union Global',
  periods: {
    'm09': {
        campaignName: 'Webinar The Future of Plastic Packaging · Septiembre 2026',
        emails: [
          {
            name: 'Email 1 · Américas',
            subject: '',
            metrics: {
              sent: 2030,
              uniqueOpens: 321,
              uniqueClicks: 29,
              totalOpens: 470,
              totalClicks: 205,
              openRate: 15.81,
              clickRate: 1.43,
              ctor: 9.03
            }
          },
          {
            name: 'Email 1 · Europa',
            subject: '',
            metrics: {
              sent: 1116,
              uniqueOpens: 208,
              uniqueClicks: 18,
              totalOpens: 451,
              totalClicks: 86,
              openRate: 18.64,
              clickRate: 1.61,
              ctor: 8.65
            }
          },
          {
            name: 'Email 2 · Américas',
            subject: '',
            metrics: {
              sent: 1946,
              uniqueOpens: 300,
              uniqueClicks: 34,
              totalOpens: 383,
              totalClicks: 204,
              openRate: 15.42,
              clickRate: 1.75,
              ctor: 11.33
            }
          },
          {
            name: 'Email 2 · Europa',
            subject: '',
            metrics: {
              sent: 1073,
              uniqueOpens: 169,
              uniqueClicks: 17,
              totalOpens: 244,
              totalClicks: 81,
              openRate: 15.75,
              clickRate: 1.58,
              ctor: 10.06
            }
          },
          {
            name: 'Email 3 · Américas',
            subject: '',
            metrics: {
              sent: 1932,
              uniqueOpens: 328,
              uniqueClicks: 45,
              totalOpens: 450,
              totalClicks: 294,
              openRate: 16.98,
              clickRate: 2.33,
              ctor: 13.72
            }
          },
          {
            name: 'Email 3 · Europa',
            subject: '',
            metrics: {
              sent: 1065,
              uniqueOpens: 177,
              uniqueClicks: 14,
              totalOpens: 279,
              totalClicks: 100,
              openRate: 16.62,
              clickRate: 1.31,
              ctor: 7.91
            }
          },
          {
            name: 'Email 3 (reenvío) · Américas',
            subject: '',
            metrics: {
              sent: 1920,
              uniqueOpens: 253,
              uniqueClicks: 32,
              totalOpens: 317,
              totalClicks: 234,
              openRate: 13.18,
              clickRate: 1.67,
              ctor: 12.65
            }
          },
          {
            name: 'Email 3 (reenvío) · Europa',
            subject: '',
            metrics: {
              sent: 1057,
              uniqueOpens: 135,
              uniqueClicks: 14,
              totalOpens: 228,
              totalClicks: 85,
              openRate: 12.77,
              clickRate: 1.32,
              ctor: 10.37
            }
          },
          {
            name: 'Post-webinar · Asistentes',
            subject: '',
            metrics: {
              sent: 74,
              uniqueOpens: 44,
              uniqueClicks: 12,
              totalOpens: 82,
              totalClicks: 28,
              openRate: 59.46,
              clickRate: 16.22,
              ctor: 27.27
            }
          }
        ],
        totals: {
          emailCount: 9,
          totalSent: 12213,
          totalDelivered: 12213,
          totalOpens: 1935,
          totalClicks: 215,
          totalBounces: null,
          totalUnsubs: null,
          openRate: 15.84,
          clickRate: 1.76,
          ctor: 11.11,
          bounceRate: null,
          unsubRate: null
        },
        comparison: [
          {
            name: 'Email 1 · Américas',
            aperturas: 15.8,
            clics: 1.4,
            ctor: 9
          },
          {
            name: 'Email 1 · Europa',
            aperturas: 18.6,
            clics: 1.6,
            ctor: 8.7
          },
          {
            name: 'Email 2 · Américas',
            aperturas: 15.4,
            clics: 1.7,
            ctor: 11.3
          },
          {
            name: 'Email 2 · Europa',
            aperturas: 15.8,
            clics: 1.6,
            ctor: 10.1
          },
          {
            name: 'Email 3 · Américas',
            aperturas: 17,
            clics: 2.3,
            ctor: 13.7
          },
          {
            name: 'Email 3 · Europa',
            aperturas: 16.6,
            clics: 1.3,
            ctor: 7.9
          },
          {
            name: 'Email 3 (reenvío) · Américas',
            aperturas: 13.2,
            clics: 1.7,
            ctor: 12.6
          },
          {
            name: 'Email 3 (reenvío) · Europa',
            aperturas: 12.8,
            clics: 1.3,
            ctor: 10.4
          },
          {
            name: 'Post-webinar · Asistentes',
            aperturas: 59.5,
            clics: 16.2,
            ctor: 27.3
          }
        ],
        hotLeads: [
          {
            email: 'fauricioc@amvac.com',
            clicks: 52,
            opens: 4,
            company: 'AMVAC Latam',
            firstName: 'Fauricio',
            lastName: 'Castro',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'luis.mamani@hihonor.com',
            clicks: 48,
            opens: 4,
            company: 'HONOR',
            firstName: 'Luis',
            lastName: 'Angel Mamani',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'kaltnow@langetwins.com',
            clicks: 44,
            opens: 4,
            company: 'LangeTwins Family Winery and Vineyards',
            firstName: 'Kendra',
            lastName: 'Altnow',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'bknapp@smirecyclers.com',
            clicks: 36,
            opens: 5,
            company: 'Scrap Management Industries',
            firstName: 'Bronson',
            lastName: 'Knapp',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'nhammond@shawmutcorporation.com',
            clicks: 33,
            opens: 4,
            company: 'Shawmut Corporation',
            firstName: 'Nicholas',
            lastName: 'Hammond',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'paula.meegan@asrcindustrial.com',
            clicks: 33,
            opens: 4,
            company: 'ASRC Industrial',
            firstName: 'Paula',
            lastName: 'Meegan',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'rylee.mccone@ahec.edu',
            clicks: 33,
            opens: 4,
            company: 'Auraria Sustainable Campus Program',
            firstName: 'Rylee',
            lastName: 'McCone',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'michelle.obrien@coillte.ie',
            clicks: 33,
            opens: 4,
            company: 'Coillte',
            firstName: 'Michelle',
            lastName: 'O\'Brien',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'cja@larslarsengroup.com',
            clicks: 32,
            opens: 12,
            company: 'Lars Larsen Group',
            firstName: 'Christina',
            lastName: 'Jacobsen',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'vschenk@palmerholland.com',
            clicks: 32,
            opens: 8,
            company: 'Palmer Holland',
            firstName: 'Valerie',
            lastName: 'Schenk',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'bailym@pureoptions.com',
            clicks: 32,
            opens: 7,
            company: 'Pure Options',
            firstName: 'Bailey',
            lastName: 'McDaniel',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'kristi.megivern@passportauto.com',
            clicks: 32,
            opens: 7,
            company: 'Passport Auto Group',
            firstName: 'Kristi',
            lastName: 'Megivern',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'm.stankius@hyva.com',
            clicks: 32,
            opens: 6,
            company: 'Hyva',
            firstName: 'Maciej',
            lastName: 'Stankius',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'christiancovarrubias@tupperware.com',
            clicks: 32,
            opens: 5,
            company: 'Tupperware México',
            firstName: 'Christian',
            lastName: 'Covarrubias Pimentel',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'cekanayake@atmossolutionsinc.com',
            clicks: 32,
            opens: 4,
            company: 'Atmos Solutions, Inc.',
            firstName: 'Chamod',
            lastName: 'Ekanayake',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'chenyongjun@honor.com',
            clicks: 32,
            opens: 4,
            company: 'HONOR',
            firstName: 'Yongjun',
            lastName: 'Chen',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'jordanm@amvac.com',
            clicks: 32,
            opens: 4,
            company: 'AMVAC U.S.',
            firstName: 'Jordan',
            lastName: 'Moseley',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'kyleg@cometobask.com',
            clicks: 32,
            opens: 4,
            company: 'Bask, Inc.',
            firstName: 'Kyle',
            lastName: 'Grotevant',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'marcuso@modere.com',
            clicks: 32,
            opens: 4,
            company: 'Modere',
            firstName: 'Marcus',
            lastName: 'Ostergaard',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'sloria@keramida.com',
            clicks: 32,
            opens: 4,
            company: 'KERAMIDA Inc.',
            firstName: 'Steve',
            lastName: 'Loria',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'yrodriguez@myinsa.com',
            clicks: 32,
            opens: 4,
            company: 'Insa',
            firstName: 'Yalissa',
            lastName: 'Rodriguez',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'carlos.taus@huhtamaki.com',
            clicks: 32,
            opens: 4,
            company: 'Huhtamaki, Inc. - Waterville',
            firstName: 'Carlos',
            lastName: 'Taus Soler',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'slb@jysk.com',
            clicks: 32,
            opens: 4,
            company: 'JYSK',
            firstName: 'Soren',
            lastName: 'Beek',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'ettore.vercesi@huhtamaki.com',
            clicks: 30,
            opens: 6,
            company: 'Huhtamaki, Inc. - Waterville',
            firstName: 'Ettore',
            lastName: 'Vercesi',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'rdavis@asrcenergy.com',
            clicks: 30,
            opens: 4,
            company: 'ASRC Energy Services, LLC',
            firstName: 'Rachel',
            lastName: 'Davis',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'barbara.telecka@huhtamaki.com',
            clicks: 29,
            opens: 4,
            company: 'Huhtamaki, Inc. - Waterville',
            firstName: 'Barbara',
            lastName: 'Telecka',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'pawel.pikula@ironsideslubricants.co.uk',
            clicks: 29,
            opens: 4,
            company: 'Ironsides Lubricants Ltd',
            firstName: 'Pawel',
            lastName: 'Pikula',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'bignacio@virginiadare.com',
            clicks: 26,
            opens: 4,
            company: 'Virginia Dare Extract Co.',
            firstName: 'Bediver',
            lastName: 'Ignacio',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'gregg.mance@aac-contracting.com',
            clicks: 26,
            opens: 4,
            company: 'AAC Contracting, LLC',
            firstName: 'Gregg',
            lastName: 'Mance',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'ahume@gpminvestments.com',
            clicks: 24,
            opens: 7,
            company: 'GPM Investments, LLC',
            firstName: 'Amber',
            lastName: 'Hume',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'nancyo@westmarine.com',
            clicks: 24,
            opens: 4,
            company: 'West Marine',
            firstName: 'Nancy',
            lastName: 'Ortiz',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'v.fulginei@elica.com',
            clicks: 22,
            opens: 17,
            company: 'Elica',
            firstName: 'Valentina',
            lastName: 'Fulginei',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'aleija@niagarawater.com',
            clicks: 19,
            opens: 2,
            company: 'Niagara Bottling',
            firstName: 'Anna',
            lastName: 'Jeraldine Leija',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'sdascher@niagarawater.com',
            clicks: 18,
            opens: 2,
            company: 'Niagara Bottling',
            firstName: 'Shalto',
            lastName: 'Dascher',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'mmarrero@plaidonline.com',
            clicks: 16,
            opens: 2,
            company: 'Plaid Enterprises',
            firstName: 'Maria',
            lastName: 'Marrero',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'mkroh@lgchem.com',
            clicks: 15,
            opens: 5,
            company: 'LG Chem America, Inc.',
            firstName: 'Michelle',
            lastName: 'Kroh',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'jbeck@usadebusk.com',
            clicks: 12,
            opens: 3,
            company: 'USA DeBusk',
            firstName: 'Jessica',
            lastName: 'Beck',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'tassio.domingues@reachcooling.com',
            clicks: 12,
            opens: 3,
            company: 'Reach Cooling Group',
            firstName: 'Tassio',
            lastName: 'Domingues',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'jvanbennekom@inlineplastics.com',
            clicks: 10,
            opens: 6,
            company: 'Inline Plastics',
            firstName: 'Julie',
            lastName: 'Van Bennekom',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'mlaser@visteon.com',
            clicks: 8,
            opens: 3,
            company: 'Visteon Corporation',
            firstName: 'Michelle',
            lastName: 'Laser',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'preston_poag@mohawkind.com',
            clicks: 8,
            opens: 3,
            company: 'Mohawk Industries',
            firstName: 'Preston',
            lastName: 'Poag',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'mariana.carvalho@heiq.com',
            clicks: 8,
            opens: 3,
            company: 'HeiQ',
            firstName: 'Mariana',
            lastName: 'Carvalho',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'esaccoccia@newpharm.it',
            clicks: 8,
            opens: 2,
            company: 'NEWPHARM S.r.l.',
            firstName: 'Erika',
            lastName: 'Saccoccia',
            campaigns: 2,
            emailAppearances: [
              2,
              4
            ]
          },
          {
            email: 'francesca.bugli@luxottica.com',
            clicks: 8,
            opens: 2,
            company: 'EssilorLuxottica',
            firstName: 'Francesca',
            lastName: 'Bugli',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'edillon@brewerscience.com',
            clicks: 8,
            opens: 1,
            company: 'Brewer Science',
            firstName: 'Edna',
            lastName: 'Dillon',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'raffaele.gazzano@sedamyl.com',
            clicks: 8,
            opens: 1,
            company: 'SEDAMYL',
            firstName: 'Raffaele',
            lastName: 'Gazzano',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: '99849035@ambev.com.br',
            clicks: 7,
            opens: 12,
            company: 'Ambev',
            firstName: 'Leonardo',
            lastName: 'Souza',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'ben.anderson@ralcoagriculture.com',
            clicks: 6,
            opens: 7,
            company: 'Ralco',
            firstName: 'Ben',
            lastName: 'Anderson',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'costel.suditu@greentech.ro',
            clicks: 6,
            opens: 1,
            company: 'greentech',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'dpe@fecc.org',
            clicks: 5,
            opens: 19,
            company: 'European Association of Chemical Distributors',
            firstName: 'David',
            lastName: 'Navarro',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              8,
              9
            ]
          },
          {
            email: 'biancadewit@primo.com',
            clicks: 4,
            opens: 8,
            company: 'Inter Primo A/S - Primo Group - Extruded polymer profiles',
            firstName: 'Bianca',
            lastName: 'Wit',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              8,
              9
            ]
          },
          {
            email: 'ssac@be-liv.com',
            clicks: 4,
            opens: 4,
            company: 'Beliv Company',
            firstName: 'Sara',
            lastName: 'Sac Tejada',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'brennan.greene@growmark.com',
            clicks: 4,
            opens: 2,
            company: 'GROWMARK, Inc.',
            firstName: 'Brennan',
            lastName: 'Greene',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'sgallego@nexamp.com',
            clicks: 4,
            opens: 2,
            company: 'Nexamp',
            firstName: 'Stephany',
            lastName: 'Gallego',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'eva.kiefhaber@bardusch.com',
            clicks: 4,
            opens: 2,
            company: 'bardusch',
            firstName: 'Eva',
            lastName: 'Kiefhaber',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'g.pasotti@davines.it',
            clicks: 4,
            opens: 2,
            company: 'Davines Group | B Corp since 2016',
            firstName: 'Giulia',
            lastName: 'Pasotti',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'brecht.deschuymer@baltagroup.com',
            clicks: 4,
            opens: 1,
            company: 'Balta Group',
            firstName: 'Brecht',
            lastName: 'Deschuymer',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              8,
              9
            ]
          },
          {
            email: 'matthew.allen@molsoncoors.com',
            clicks: 3,
            opens: 5,
            company: 'Molson Coors Beverage Company',
            firstName: 'Matt',
            lastName: 'Allen',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'alessandra.petrini@sogefigroup.com',
            clicks: 3,
            opens: 4,
            company: 'Sogefi Group',
            firstName: 'Alessandra',
            lastName: 'Petrini',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'dshuleva@controlunion.com',
            clicks: 3,
            opens: 4,
            company: 'controlunion',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'harry1260@gmail.com',
            clicks: 3,
            opens: 1,
            company: 'gmail',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'obiriukova@controlunion.com',
            clicks: 3,
            opens: 1,
            company: 'controlunion',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'tamara.schuitvlot@nl.bolsius.com',
            clicks: 2,
            opens: 84,
            company: 'Bolsius | B Corp™',
            firstName: 'Tamara',
            lastName: 'Schuitvlot',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'b.vandenbrink@intersnackgroup.com',
            clicks: 2,
            opens: 60,
            company: 'INTERSNACK LIMITED',
            firstName: 'Bas',
            lastName: 'Van Den Brink',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'michiel.kokken@ofi.com',
            clicks: 2,
            opens: 17,
            company: 'OFI',
            firstName: 'Michiel',
            lastName: 'Kokken',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'juan.rico@alcaliber.com',
            clicks: 2,
            opens: 15,
            company: 'ALCALIBER, S.A.U.',
            firstName: 'Juan',
            lastName: 'Rico Zamorano',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              8,
              9
            ]
          },
          {
            email: 'romulo.pereira@archroma.com',
            clicks: 2,
            opens: 8,
            company: 'ARCHROMA IBÉRICA, S.L.',
            firstName: 'Romulo',
            lastName: 'Pereira',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'salikov@matterr.de',
            clicks: 2,
            opens: 8,
            company: 'matterr',
            firstName: 'Vitalij',
            lastName: 'Salikov',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              8,
              9
            ]
          },
          {
            email: 'sguardia@quimivita.com',
            clicks: 2,
            opens: 6,
            company: 'Quimivita',
            firstName: 'Sara',
            lastName: 'Guardia Almeida',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'frank.schlauer@hamburgwasser.de',
            clicks: 2,
            opens: 5,
            company: 'HAMBURG WASSER',
            firstName: 'Frank',
            lastName: 'Schlauer',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'linda.gustafsson@toteme.com',
            clicks: 2,
            opens: 5,
            company: 'TOTEME',
            firstName: 'Linda',
            lastName: 'Gustafsson',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              8,
              9
            ]
          },
          {
            email: 'slemay@rti-inc.com',
            clicks: 2,
            opens: 4,
            company: 'Restaurant Technologies',
            firstName: 'Sean',
            lastName: 'Lemay',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'laura.hofman.miquel@volvo.com',
            clicks: 2,
            opens: 4,
            company: 'Volvo',
            firstName: 'Laura',
            lastName: 'Miquel',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'oliver.priess@aldautomotive.com',
            clicks: 2,
            opens: 4,
            company: 'ALD Automotive Germany',
            firstName: 'Oliver',
            lastName: 'Priess',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'line.kerbech@everrest.com',
            clicks: 2,
            opens: 3,
            company: 'EverRest',
            firstName: 'Line',
            lastName: 'Kerbech',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'brenda.calderon@organizacionsoriana.com',
            clicks: 2,
            opens: 2,
            company: 'Organización Soriana',
            firstName: 'Brenda',
            lastName: 'Calderon',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'rafael.galvao@byd.com',
            clicks: 2,
            opens: 2,
            company: 'BYD Brasil',
            firstName: 'Rafael',
            lastName: 'Galvao',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'aaron.miller@ashland.com',
            clicks: 2,
            opens: 1,
            company: 'Ashland',
            firstName: 'Aaron',
            lastName: 'Miller',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'anderson.lima@grupohope.com.br',
            clicks: 2,
            opens: 1,
            company: 'Grupo HOPE',
            firstName: 'Anderson',
            lastName: 'Lima',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'bward@sandersonfarms.com',
            clicks: 2,
            opens: 1,
            company: 'Wayne-Sanderson Farms',
            firstName: 'Brittany',
            lastName: 'Kerr',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'carolina.hasegawa@reverconsulting.com',
            clicks: 2,
            opens: 1,
            company: 'Rever | Consultoria em Sustentabilidade',
            firstName: 'Carolina',
            lastName: 'Hasegawa',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'dsalgado@artesco.com.pe',
            clicks: 2,
            opens: 1,
            company: 'Artesco',
            firstName: 'Diego',
            lastName: 'Salgado',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'exportregulatory@plymag.com',
            clicks: 2,
            opens: 1,
            company: 'PLYMAG - Agronutrientes',
            firstName: 'Fernando',
            lastName: 'Gimenez Lazaro',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'glassu@ashland.com',
            clicks: 2,
            opens: 1,
            company: 'Ashland',
            firstName: 'Gyongyi',
            lastName: 'Lassu',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'mgaleano@koppert.es',
            clicks: 2,
            opens: 1,
            company: 'Koppert España',
            firstName: 'Magda',
            lastName: 'Galeano Revert',
            campaigns: 4,
            emailAppearances: [
              2,
              4,
              6,
              8
            ]
          },
          {
            email: 'Nattarika.Siripunt@doleintl.com',
            clicks: 2,
            opens: 1,
            company: 'doleintl',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'Sukanya.Dathong@doleintl.com',
            clicks: 2,
            opens: 1,
            company: 'doleintl',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'rosa.cabezudo@intertek.com',
            clicks: 2,
            opens: 1,
            company: 'intertek',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'erin.semple@averydennison.com',
            clicks: 1,
            opens: 7,
            company: 'Avery Dennison',
            firstName: 'Erin',
            lastName: 'Semple',
            campaigns: 5,
            emailAppearances: [
              1,
              3,
              5,
              7,
              9
            ]
          },
          {
            email: 'lkarpati@controlunion.com',
            clicks: 1,
            opens: 2,
            company: 'controlunion',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'qa@rpet.co.il',
            clicks: 1,
            opens: 2,
            company: 'rpet',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'belinda.andaverde@abbott.com',
            clicks: 1,
            opens: 1,
            company: 'Abbott Laboratories',
            firstName: 'Belinda',
            lastName: 'Andaverde',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'kristina.mccoy@us.dsv.com',
            clicks: 1,
            opens: 1,
            company: 'DSV',
            firstName: 'Kristina',
            lastName: 'McCoy',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'sourcing@asap-trading.net',
            clicks: 1,
            opens: 1,
            company: 'ASAP TRADING Sourcing',
            firstName: 'Cesar',
            lastName: 'Salamanca Castilla',
            campaigns: 4,
            emailAppearances: [
              1,
              3,
              5,
              7
            ]
          },
          {
            email: 'leena.ta.salaime@gmail.com',
            clicks: 1,
            opens: 1,
            company: 'gmail',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          },
          {
            email: 'shehbazahmed743@gmail.com',
            clicks: 1,
            opens: 1,
            company: 'gmail',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              9
            ]
          }
        ],
        hotLeadsCount: 96,
        allLeadsCount: 3213
      },
  },
};

// Peterson Solutions Iberoamérica · m09 — generado con scripts/mailchimp-to-seed.mjs
EMAIL_DB['psi'] = {
  name: 'Peterson Solutions Iberoamérica',
  periods: {
    'm09': {
        campaignName: 'Webinar EmpCo 2026 · Septiembre 2026',
        emails: [
          {
            name: 'Email 1 · Invitación',
            subject: '',
            metrics: {
              sent: 5297,
              uniqueOpens: 888,
              uniqueClicks: 46,
              totalOpens: 1340,
              totalClicks: 232,
              openRate: 16.76,
              clickRate: 0.87,
              ctor: 5.18
            }
          },
          {
            name: 'Email 2',
            subject: '',
            metrics: {
              sent: 5199,
              uniqueOpens: 1014,
              uniqueClicks: 71,
              totalOpens: 1444,
              totalClicks: 241,
              openRate: 19.5,
              clickRate: 1.37,
              ctor: 7
            }
          },
          {
            name: 'Email 3',
            subject: '',
            metrics: {
              sent: 5178,
              uniqueOpens: 935,
              uniqueClicks: 31,
              totalOpens: 1326,
              totalClicks: 176,
              openRate: 18.06,
              clickRate: 0.6,
              ctor: 3.32
            }
          },
          {
            name: 'Email 4',
            subject: '',
            metrics: {
              sent: 5146,
              uniqueOpens: 951,
              uniqueClicks: 45,
              totalOpens: 1294,
              totalClicks: 164,
              openRate: 18.48,
              clickRate: 0.87,
              ctor: 4.73
            }
          },
          {
            name: 'Email 5 · Base completa',
            subject: '',
            metrics: {
              sent: 5125,
              uniqueOpens: 965,
              uniqueClicks: 35,
              totalOpens: 1305,
              totalClicks: 151,
              openRate: 18.83,
              clickRate: 0.68,
              ctor: 3.63
            }
          },
          {
            name: 'Email 5 · Asistentes',
            subject: '',
            metrics: {
              sent: 64,
              uniqueOpens: 25,
              uniqueClicks: 6,
              totalOpens: 38,
              totalClicks: 18,
              openRate: 39.06,
              clickRate: 9.38,
              ctor: 24
            }
          },
          {
            name: 'Email 5 · Registrados',
            subject: '',
            metrics: {
              sent: 63,
              uniqueOpens: 12,
              uniqueClicks: 0,
              totalOpens: 19,
              totalClicks: 0,
              openRate: 19.05,
              clickRate: 0,
              ctor: 0
            }
          }
        ],
        totals: {
          emailCount: 7,
          totalSent: 26072,
          totalDelivered: 26072,
          totalOpens: 4790,
          totalClicks: 234,
          totalBounces: null,
          totalUnsubs: null,
          openRate: 18.37,
          clickRate: 0.9,
          ctor: 4.89,
          bounceRate: null,
          unsubRate: null
        },
        comparison: [
          {
            name: 'Email 1 · Invitación',
            aperturas: 16.8,
            clics: 0.9,
            ctor: 5.2
          },
          {
            name: 'Email 2',
            aperturas: 19.5,
            clics: 1.4,
            ctor: 7
          },
          {
            name: 'Email 3',
            aperturas: 18.1,
            clics: 0.6,
            ctor: 3.3
          },
          {
            name: 'Email 4',
            aperturas: 18.5,
            clics: 0.9,
            ctor: 4.7
          },
          {
            name: 'Email 5 · Base completa',
            aperturas: 18.8,
            clics: 0.7,
            ctor: 3.6
          },
          {
            name: 'Email 5 · Asistentes',
            aperturas: 39.1,
            clics: 9.4,
            ctor: 24
          },
          {
            name: 'Email 5 · Registrados',
            aperturas: 19,
            clics: 0,
            ctor: 0
          }
        ],
        hotLeads: [
          {
            email: 'gromero@aris-mining.com',
            clicks: 73,
            opens: 54,
            company: 'aris-mining',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'limon@paramerica.com.ar',
            clicks: 57,
            opens: 19,
            company: 'paramerica',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'nkantorowicz@blumosgroup.com',
            clicks: 52,
            opens: 5,
            company: 'Grupo Blumos Argentina - An IMCD company',
            firstName: 'Nicolas',
            lastName: 'Kantorowicz',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'lspear@t360.com.co',
            clicks: 44,
            opens: 11,
            company: 't360',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'msekulits@t360.com.co',
            clicks: 44,
            opens: 10,
            company: 't360',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'andreafuenzalidaplaza@honor.com',
            clicks: 44,
            opens: 5,
            company: 'honor',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'angelgabrielperezsivira@honor.com',
            clicks: 44,
            opens: 5,
            company: 'honor',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'gabriela@nitrongroup.com',
            clicks: 44,
            opens: 5,
            company: 'nitrongroup',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'semillas@paramerica.com.ar',
            clicks: 42,
            opens: 17,
            company: 'paramerica',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'comercial@paramerica.com.ar',
            clicks: 38,
            opens: 15,
            company: 'paramerica',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'institucional@paramerica.com.ar',
            clicks: 38,
            opens: 14,
            company: 'paramerica',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'francisco.prado.tg@hihonor.com',
            clicks: 30,
            opens: 2,
            company: 'hihonor',
            firstName: '',
            lastName: '',
            campaigns: 2,
            emailAppearances: [
              1,
              2
            ]
          },
          {
            email: 'rcardinali@santander.com.ar',
            clicks: 29,
            opens: 23,
            company: 'santander',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'ccabral@silvateam.com',
            clicks: 23,
            opens: 5,
            company: 'silvateam',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'carlosruiz@paramerica.com.ar',
            clicks: 19,
            opens: 15,
            company: 'paramerica',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'paulo.naranjo@ingsanisidro.com.ar',
            clicks: 19,
            opens: 6,
            company: 'ingsanisidro',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'comercial@frutucumansa.com.ar',
            clicks: 15,
            opens: 4,
            company: 'frutucumansa',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'logistica@frutucumansa.com.ar',
            clicks: 15,
            opens: 4,
            company: 'frutucumansa',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'jpena@domainebousquet.com',
            clicks: 10,
            opens: 15,
            company: 'Domaine Bousquet',
            firstName: 'Julio',
            lastName: 'Peña',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'fran.chavez@angloamerican.com',
            clicks: 9,
            opens: 2,
            company: 'angloamerican',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'christopher.rodriguez@angloamerican.com',
            clicks: 8,
            opens: 2,
            company: 'angloamerican',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'harald.schramm@angloamerican.com',
            clicks: 8,
            opens: 2,
            company: 'angloamerican',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'cantoron@olega.com.ar',
            clicks: 7,
            opens: 22,
            company: 'Olega S.A.',
            firstName: 'Nicolás',
            lastName: 'Cantoro',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          },
          {
            email: 'gonzalo.acevedo@angloamerican.com',
            clicks: 7,
            opens: 4,
            company: 'angloamerican',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'martin.flores@ecintl.com',
            clicks: 6,
            opens: 10,
            company: 'ecintl',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'javier.caro@emerald.com.co',
            clicks: 6,
            opens: 8,
            company: 'emerald',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'felorrieta@southblu.cl',
            clicks: 6,
            opens: 5,
            company: 'southblu',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'david.erbojo@molinosagro.com.ar',
            clicks: 6,
            opens: 2,
            company: 'Molinos Agro SA',
            firstName: 'David',
            lastName: 'Erbojo',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'constanza.divico@seaboard.com.ar',
            clicks: 6,
            opens: 1,
            company: 'Seaboard Energias Renovables y Alimentos S.R.L.',
            firstName: 'Constanza',
            lastName: 'Di Vico',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          },
          {
            email: 'Alejandra.Farias@imcdchile.com',
            clicks: 6,
            opens: 1,
            company: 'imcdchile',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              6
            ]
          },
          {
            email: 'lino.degiusti@buyatti.com.ar',
            clicks: 4,
            opens: 19,
            company: 'Buyatti',
            firstName: 'Lino',
            lastName: 'Deguisti',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'rfrancois@on.energy',
            clicks: 4,
            opens: 6,
            company: 'on',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'eduardo.musa@hocplc.com',
            clicks: 4,
            opens: 5,
            company: 'hocplc',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'martijn.leeflang@bunge.com',
            clicks: 4,
            opens: 5,
            company: 'Bunge - Argentina',
            firstName: 'Martijn',
            lastName: 'Leeflang',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'mgudino@luigibosca.com',
            clicks: 4,
            opens: 4,
            company: 'luigibosca',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'oleh.chernilevskyy@bunge.com',
            clicks: 4,
            opens: 4,
            company: 'Bunge - Argentina - Puerto General San Martín',
            firstName: 'Oleh',
            lastName: 'Chernilevskyy',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'calidad@certimet.pe',
            clicks: 4,
            opens: 2,
            company: 'CERTIMET - CALIBRACIÓN, METROLOGÍA Y AUTOMATIZACIÓN',
            firstName: 'Maria',
            lastName: 'Curacachi Pacheco',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'rvalqui@certimet.pe',
            clicks: 4,
            opens: 2,
            company: 'CERTIMET - CALIBRACIÓN, METROLOGÍA Y AUTOMATIZACIÓN',
            firstName: 'Rildon',
            lastName: 'Valqui',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'moises.aracena@goldfields.com',
            clicks: 4,
            opens: 1,
            company: 'goldfields',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'jose.verdejo@diavaz.com',
            clicks: 3,
            opens: 11,
            company: 'diavaz',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'jorge.rivas@internationalgasandoil.com',
            clicks: 3,
            opens: 9,
            company: 'internationalgasandoil',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'adalberto.fratini@molinosagro.com.ar',
            clicks: 3,
            opens: 7,
            company: 'Molinos Agro SA',
            firstName: 'Adalberto',
            lastName: 'Fratini',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'beatrizjofre@empresasjofre.cl',
            clicks: 3,
            opens: 6,
            company: 'empresasjofre',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'carlos.serrano@pegsa.com.co',
            clicks: 3,
            opens: 6,
            company: 'pegsa',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'jportugal@artatlasperu.com',
            clicks: 3,
            opens: 6,
            company: 'Art Atlas S.R.L.',
            firstName: 'Jenny',
            lastName: 'Portugal Perez',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'rgonzalez@sonacol.cl',
            clicks: 3,
            opens: 5,
            company: 'sonacol',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'gabrielalopez@inagro.com.ar',
            clicks: 3,
            opens: 4,
            company: 'inagro',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'catalina.concha@bredenmaster.com',
            clicks: 3,
            opens: 3,
            company: 'BredenMaster',
            firstName: 'Catalina',
            lastName: 'Concha',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'aboll@onepeterson.com',
            clicks: 3,
            opens: 3,
            company: 'onepeterson',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              6
            ]
          },
          {
            email: 'miguel_gonzalez@diavaz.com',
            clicks: 3,
            opens: 2,
            company: 'diavaz',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'noel.delgado@diavaz.com',
            clicks: 3,
            opens: 2,
            company: 'diavaz',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'lcarbini2@onepeterson.com',
            clicks: 3,
            opens: 2,
            company: 'onepeterson',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              6
            ]
          },
          {
            email: 'acossio@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'arojas@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'bcompean@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'cintia.maltoni@molinosagro.com.ar',
            clicks: 3,
            opens: 1,
            company: 'molinosagro',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'cmontes@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'daniel.salgado@molycop.cl',
            clicks: 3,
            opens: 1,
            company: 'molycop',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'dvargas@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'egracia@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'gleal@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'gonzalo.mendez@mercadolibre.com',
            clicks: 3,
            opens: 1,
            company: 'Mercado Libre',
            firstName: 'Gonzalo',
            lastName: 'Mendez',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'gpmedina@tenaris.com',
            clicks: 3,
            opens: 1,
            company: 'tenaris',
            firstName: '',
            lastName: '',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'jlopez@lapolar.cl',
            clicks: 3,
            opens: 1,
            company: 'ABCDIN',
            firstName: 'Juan',
            lastName: 'Lopez Barrios',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'jortiz@bredenmaster.com',
            clicks: 3,
            opens: 1,
            company: 'BredenMaster',
            firstName: 'Jorge',
            lastName: 'Ortiz',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'kaguilera@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'lmontano@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'marcelo.lorca@molycop.cl',
            clicks: 3,
            opens: 1,
            company: 'molycop',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'nadia.engler@austinpowder.com',
            clicks: 3,
            opens: 1,
            company: 'austinpowder',
            firstName: '',
            lastName: '',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          },
          {
            email: 'nhernandez@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'slopez@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'smartinez@littelfuse.com',
            clicks: 3,
            opens: 1,
            company: 'littelfuse',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'rdelossantos@sanmiguelglobal.com',
            clicks: 2,
            opens: 68,
            company: 'S.A San Miguel AGICIYF',
            firstName: 'Romina',
            lastName: 'De Los Santos',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          },
          {
            email: 'serra@justla.com.ar',
            clicks: 2,
            opens: 34,
            company: 'Just International LATAM S.A.',
            firstName: 'Martin',
            lastName: 'Serra',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'mariana.ignacio@bunge.com',
            clicks: 2,
            opens: 22,
            company: 'Bunge - Argentina',
            firstName: 'Mariana',
            lastName: 'Ignacio',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'sgorischnik@bice.com.ar',
            clicks: 2,
            opens: 16,
            company: 'BICE',
            firstName: 'Sandra',
            lastName: 'Fabiana Gorischnik',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'gmontenegro@cofcointernational.com',
            clicks: 2,
            opens: 13,
            company: 'cofcointernational',
            firstName: '',
            lastName: '',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          },
          {
            email: 'gsegovia@esentia-energy.com',
            clicks: 2,
            opens: 12,
            company: 'esentia-energy',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'mmrozek@viafrutta.com.ar',
            clicks: 2,
            opens: 8,
            company: 'viafrutta',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'dmanosalva@canacolenergy.com',
            clicks: 2,
            opens: 7,
            company: 'canacolenergy',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'abraham.cortes@bench.com',
            clicks: 2,
            opens: 6,
            company: 'bench',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'rvergara@jri.cl',
            clicks: 2,
            opens: 6,
            company: 'jri',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'carolina.ossandon@summitnanotech.com',
            clicks: 2,
            opens: 5,
            company: 'summitnanotech',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'julieta.olego@terragene.com',
            clicks: 2,
            opens: 5,
            company: 'Terragene',
            firstName: 'Julieta',
            lastName: 'Olego',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'petrica.bunghiuz@bunge.com',
            clicks: 2,
            opens: 5,
            company: 'Bunge - Argentina - Puerto General San Martín',
            firstName: 'Petrica',
            lastName: 'Bunghiuz',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'sabrina.iannizzotto@trivento.com',
            clicks: 2,
            opens: 5,
            company: 'trivento',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'lpino@ceyesa.com.pe',
            clicks: 2,
            opens: 4,
            company: 'CEYESA',
            firstName: 'Luis',
            lastName: 'Pino',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'amneris.m.pondal@exxonmobil.com',
            clicks: 2,
            opens: 3,
            company: 'exxonmobil',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'conorpaul.clarke@bunge.com',
            clicks: 2,
            opens: 3,
            company: 'Bunge - Argentina',
            firstName: 'Conor',
            lastName: 'Paul Clarke',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'judith.nachtwey@bunge.com',
            clicks: 2,
            opens: 3,
            company: 'Bunge - Argentina',
            firstName: 'Judith',
            lastName: 'Nachtwey',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'nataliya.danilyuk@bunge.com',
            clicks: 2,
            opens: 3,
            company: 'Bunge - Argentina',
            firstName: 'Nataliya',
            lastName: 'Danilyuk',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'mcontinanza@controlunion.com',
            clicks: 2,
            opens: 3,
            company: 'controlunion',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              6
            ]
          },
          {
            email: 'patricia.baldaccini@gmail.com',
            clicks: 2,
            opens: 3,
            company: 'gmail',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              6
            ]
          },
          {
            email: 'spierazzoli@onepeterson.com',
            clicks: 2,
            opens: 2,
            company: 'onepeterson',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              6
            ]
          },
          {
            email: 'agnes.penella@bunge.com',
            clicks: 2,
            opens: 1,
            company: 'Bunge - Argentina - Puerto General San Martín',
            firstName: 'Agnes',
            lastName: 'Penella',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'anaclara.longo@grupopenaflor.com.ar',
            clicks: 2,
            opens: 1,
            company: 'Grupo Peñaflor S.A',
            firstName: 'Ana Clara',
            lastName: 'Longo',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'bruna.vieira@bunge.com',
            clicks: 2,
            opens: 1,
            company: 'Bunge - Argentina',
            firstName: 'Bruna',
            lastName: 'Vieira',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'hblusztein@ahkargentina.com.ar',
            clicks: 2,
            opens: 1,
            company: 'AHK Argentina - Cámara de Industria y Comercio Argentino Alemana',
            firstName: 'Hanne',
            lastName: 'Blusztein',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'eerrecalde@cotagro.com.ar',
            clicks: 1,
            opens: 20,
            company: 'Cotagro',
            firstName: 'Emilia',
            lastName: 'Recalde',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'edmundoperkins@espartina.com.ar',
            clicks: 1,
            opens: 17,
            company: 'Espartina S.A',
            firstName: 'Edmundo Pablo',
            lastName: 'Perkins',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'nbernasconi@laanonima.com.ar',
            clicks: 1,
            opens: 15,
            company: 'La Anónima SAIEP',
            firstName: 'Natalia',
            lastName: 'Bernasconi',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'mgiammello@conmil.com.ar',
            clicks: 1,
            opens: 11,
            company: 'Conmil',
            firstName: 'Matias',
            lastName: 'Giammello',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'rguizar@esentia-energy.com',
            clicks: 1,
            opens: 11,
            company: 'esentia-energy',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'calidad@biovanda.com.ar',
            clicks: 1,
            opens: 10,
            company: 'Bio Vanda SA',
            firstName: 'Silvana',
            lastName: 'Beccarini',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          },
          {
            email: 'joaquina.cristeche@explora.com.ar',
            clicks: 1,
            opens: 9,
            company: 'EXPLORA S.A.',
            firstName: 'Joaquina',
            lastName: 'Cristeche',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'mrana@mazul.com.ar',
            clicks: 1,
            opens: 8,
            company: 'mazul',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'pelin.gencaga@bunge.com',
            clicks: 1,
            opens: 7,
            company: 'Bunge - Argentina - Puerto General San Martín',
            firstName: 'Pelin',
            lastName: 'Gencaga',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'luciano.moure@segod.com.ar',
            clicks: 1,
            opens: 6,
            company: 'SEGOD',
            firstName: 'Luciano',
            lastName: 'Moure',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'rseselovsky@ucel.edu.ar',
            clicks: 1,
            opens: 6,
            company: 'ucel',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'fabricio@fragapane.com.ar',
            clicks: 1,
            opens: 5,
            company: 'fragapane',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'consultas@sevensport.com.ar',
            clicks: 1,
            opens: 4,
            company: 'Seven Sport Group',
            firstName: 'Marina',
            lastName: 'Diaz',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'fabianotero@proseind.com.ar',
            clicks: 1,
            opens: 4,
            company: 'Proseind S.A.',
            firstName: 'Fabian',
            lastName: 'Otero',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'lucrey@agro.uba.ar',
            clicks: 1,
            opens: 4,
            company: 'agro',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'marcelo.suazo@byp.cl',
            clicks: 1,
            opens: 4,
            company: 'BP Iluminación',
            firstName: 'Marcelo',
            lastName: 'Suazo',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'mariasol.ramirezoribe@bbva.com',
            clicks: 1,
            opens: 4,
            company: 'bbva',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'royarzun@naturaljuice.com.ar',
            clicks: 1,
            opens: 4,
            company: 'naturaljuice',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'gabriela.ciutac@bunge.com',
            clicks: 1,
            opens: 3,
            company: 'Bunge - Argentina - Puerto General San Martín',
            firstName: 'Gabriela',
            lastName: 'Ciutac',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'jsastre@tecotex.com.ar',
            clicks: 1,
            opens: 3,
            company: 'Tecotex',
            firstName: 'Julio',
            lastName: 'Carlos Sastre',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'mramello@bio4.com.ar',
            clicks: 1,
            opens: 3,
            company: 'bio4',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'svaz@andromaco.com.ar',
            clicks: 1,
            opens: 3,
            company: 'Laboratorios Andrómaco',
            firstName: 'Santiago',
            lastName: 'Vaz',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'ezequiel.kiener@amaggi.com.ar',
            clicks: 1,
            opens: 2,
            company: 'Amaggi Argentina S.A.',
            firstName: 'Ezequiel',
            lastName: 'Kiener',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          },
          {
            email: 'fabian.garofalo@ecoetika.com',
            clicks: 1,
            opens: 2,
            company: 'ecoetika',
            firstName: '',
            lastName: '',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          },
          {
            email: 'maria.pierrestegui@olivaressannicolas.com',
            clicks: 1,
            opens: 2,
            company: 'olivaressannicolas',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'pleiva@evalc.cl',
            clicks: 1,
            opens: 2,
            company: 'evalc',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'rseselovsky@gmail.com',
            clicks: 1,
            opens: 2,
            company: 'Ucel',
            firstName: 'Romina',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'smartinez@sophenia.com.ar',
            clicks: 1,
            opens: 2,
            company: 'sophenia',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'asrivas@dacas.com',
            clicks: 1,
            opens: 1,
            company: 'DACAS',
            firstName: 'Alejandra',
            lastName: 'Serrano Rivas',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              6
            ]
          },
          {
            email: 'cnunez@jugos-sa.com.ar',
            clicks: 1,
            opens: 1,
            company: 'jugos-sa',
            firstName: '',
            lastName: '',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'cpedretti@foodsmentor.com',
            clicks: 1,
            opens: 1,
            company: 'foodsmentor',
            firstName: '',
            lastName: '',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'emanuel.esquivel@honeywell.com',
            clicks: 1,
            opens: 1,
            company: 'honeywell',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'ezequielmarcoskiener@gmail.com',
            clicks: 1,
            opens: 1,
            company: 'AMAGGI',
            firstName: 'Ezequiel Marcos',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'fernando.pinto@asgreen.cl',
            clicks: 1,
            opens: 1,
            company: 'ASGREEN Ingeniería Sustentable',
            firstName: 'Fernando',
            lastName: 'Pinto Medina',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'fernando_alomar@lapampeana.com.ar',
            clicks: 1,
            opens: 1,
            company: 'lapampeana',
            firstName: '',
            lastName: '',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'iedoparis@gulfoil.com.ar',
            clicks: 1,
            opens: 1,
            company: 'gulfoil',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'jgonzalez@agrosudsa.com.ar',
            clicks: 1,
            opens: 1,
            company: 'agrosudsa',
            firstName: '',
            lastName: '',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          },
          {
            email: 'mgomez@cementosinka.com.pe',
            clicks: 1,
            opens: 1,
            company: 'Cementos Inka',
            firstName: 'Maick',
            lastName: 'Gomez Camarena',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'micaela.c@desitec.com.ar',
            clicks: 1,
            opens: 1,
            company: 'Desitec S.A.',
            firstName: 'Micaela',
            lastName: 'Corrarello',
            campaigns: 6,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5,
              7
            ]
          },
          {
            email: 'obarrios@cassinelli.com',
            clicks: 1,
            opens: 1,
            company: 'Cassinelli',
            firstName: 'Oscar',
            lastName: 'Barrios Hinostroza',
            campaigns: 5,
            emailAppearances: [
              1,
              2,
              3,
              4,
              5
            ]
          }
        ],
        hotLeadsCount: 138,
        allLeadsCount: 5403
      },
  },
};

// Control Union Estados Unidos · m10 — generado con scripts/mailchimp-to-seed.mjs
EMAIL_DB['cuus'] = {
  name: 'Control Union Estados Unidos',
  periods: {
    // Varias campañas en el mismo mes: botonera de campaña en la vista (orden de carga).
    // exportDate = fecha del export de Mailchimp (sufijo «sent_…» del archivo), no la del envío.
    'm10': {
      campaigns: [
        {
          id: 'fairly-made',
          label: 'PCU x Fairly Made',
          exportDate: '2026-10-06',
          campaignName: 'PCU x Fairly Made · Networking Event (Textile Exchange) · Octubre 2026',
          emails: [
            {
              name: 'Email 1 · Invitación',
              subject: '',
              metrics: {
                sent: 1350,
                uniqueOpens: 278,
                uniqueClicks: 36,
                totalOpens: 470,
                totalClicks: 187,
                openRate: 20.59,
                clickRate: 2.67,
                ctor: 12.95
              }
            }
          ],
          totals: {
            emailCount: 1,
            totalSent: 1350,
            totalDelivered: 1350,
            totalOpens: 278,
            totalClicks: 36,
            totalBounces: null,
            totalUnsubs: null,
            openRate: 20.59,
            clickRate: 2.67,
            ctor: 12.95,
            bounceRate: null,
            unsubRate: null
          },
          comparison: [
            {
              name: 'Email 1 · Invitación',
              aperturas: 20.6,
              clics: 2.7,
              ctor: 12.9
            }
          ],
          hotLeads: [
            {
              email: 'shippingmanager@csfibers.com',
              clicks: 12,
              opens: 3,
              company: 'Custom Synthetic Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'jamirtharaj@premierefibers.com',
              clicks: 12,
              opens: 2,
              company: 'Premiere Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'certifications@csfibers.com',
              clicks: 12,
              opens: 1,
              company: 'Custom Synthetic Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'hr@csfibers.com',
              clicks: 12,
              opens: 1,
              company: 'Custom Synthetic Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'glupercio@hybridapparel.com',
              clicks: 8,
              opens: 5,
              company: 'Hybrid Promotions LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'brenda@csfibers.com',
              clicks: 8,
              opens: 1,
              company: 'Custom Synthetic Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'ehatley@premierefibers.com',
              clicks: 8,
              opens: 1,
              company: 'Premiere Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'emilyf@burton.com',
              clicks: 8,
              opens: 1,
              company: 'The Burton Corporation',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'jfaulkner@premierefibers.com',
              clicks: 8,
              opens: 1,
              company: 'Premiere Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'jrose@echodesign.com',
              clicks: 8,
              opens: 1,
              company: 'The Echo Design Group',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'jyoo@hybridapparel.com',
              clicks: 8,
              opens: 1,
              company: 'Hybrid Promotions LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'receptionist@csfibers.com',
              clicks: 8,
              opens: 1,
              company: 'Custom Synthetic Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'taylor@csfibers.com',
              clicks: 8,
              opens: 1,
              company: 'Custom Synthetic Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'taylorr@burton.com',
              clicks: 8,
              opens: 1,
              company: 'The Burton Corporation',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'tracy@csfibers.com',
              clicks: 8,
              opens: 1,
              company: 'Custom Synthetic Fibers, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'ttawil@o5group.com',
              clicks: 8,
              opens: 1,
              company: 'O5 LE, LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'vsireci@echodesign.com',
              clicks: 8,
              opens: 1,
              company: 'The Echo Design Group',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'jgretton@wlgore.com',
              clicks: 3,
              opens: 6,
              company: 'W.L. Gore & Associates',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'gallant@gallantintl.com',
              clicks: 3,
              opens: 2,
              company: 'Gallant International Inc',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'xime.sanchez@arcteryx.com',
              clicks: 3,
              opens: 2,
              company: 'Arc\'teryx Equipment',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'ktaillefer@roots.com',
              clicks: 3,
              opens: 1,
              company: 'Roots Corporation',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'elepri@teddy.it',
              clicks: 2,
              opens: 7,
              company: 'Teddy S.p.A',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'kiran.badiger@suminter.com',
              clicks: 2,
              opens: 6,
              company: 'Suminter India Organics',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'calvin.huelsman@elevatetextiles.com',
              clicks: 2,
              opens: 2,
              company: 'CONE DENIM LLC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'jitendra.bhuyan@hm.com',
              clicks: 2,
              opens: 2,
              company: 'H&M Group',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'dalyah@downdecor.com',
              clicks: 2,
              opens: 1,
              company: 'Ohio Feather Company',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'dsouzaf@welspunusa.com',
              clicks: 2,
              opens: 1,
              company: 'Welspun USA, INC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'simran.vadher@syre.com',
              clicks: 2,
              opens: 1,
              company: 'H&M Group',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 't.matiz@lenzing.com',
              clicks: 2,
              opens: 1,
              company: 'Lenzing Fibers',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'ariana@ecofashioncorp.com',
              clicks: 1,
              opens: 1,
              company: 'Ecofashion Corp S.P.C. DBA MARCI ZAROFF SUSTAINABLE BRANDS LLC, FARM TO HOME, YES AND, SEED TO STYLE, FARM TO FLIGHT.',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'fugarte@cofaco.com',
              clicks: 1,
              opens: 1,
              company: 'Cofaco Industries S.A.C.',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'kerry@bollandbranch.com',
              clicks: 1,
              opens: 1,
              company: 'Boll & Branch LLC.',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'kuljit.rakhra@takasa.co',
              clicks: 1,
              opens: 1,
              company: 'Takasa Lifestyle Company Inc.',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'pwhitener@defeet.com',
              clicks: 1,
              opens: 1,
              company: 'DeFeet International',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'mariela.calderon@bergmanrivera.com',
              clicks: 1,
              opens: 0,
              company: 'Bergman/Rivera SAC',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'tmartin@anodynewool.com',
              clicks: 1,
              opens: 0,
              company: 'Anodyne Wool Inc.',
              firstName: '',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            }
          ],
          hotLeadsCount: 36,
          allLeadsCount: 1350
        },
        {
          id: 'smeta-3',
          label: 'SMETA · Campaign 3',
          exportDate: '2026-10-09',
          campaignName: 'SMETA · Campaign 3 · Octubre 2026',
          emails: [
            {
              name: 'Email 1',
              subject: '',
              metrics: {
                sent: 253,
                uniqueOpens: 37,
                uniqueClicks: 9,
                totalOpens: 55,
                totalClicks: 55,
                openRate: 14.62,
                clickRate: 3.56,
                ctor: 24.32
              }
            }
          ],
          totals: {
            emailCount: 1,
            totalSent: 253,
            totalDelivered: 253,
            totalOpens: 37,
            totalClicks: 9,
            totalBounces: null,
            totalUnsubs: null,
            openRate: 14.62,
            clickRate: 3.56,
            ctor: 24.32,
            bounceRate: null,
            unsubRate: null
          },
          comparison: [
            {
              name: 'Email 1',
              aperturas: 14.6,
              clics: 3.6,
              ctor: 24.3
            }
          ],
          hotLeads: [
            {
              email: 'herman.katopo@furlanifoods.com',
              clicks: 8,
              opens: 5,
              company: 'Furlani Foods Corporation',
              firstName: 'Herman',
              lastName: 'Katopo',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'Will.Phillips@furlanifoods.com',
              clicks: 8,
              opens: 1,
              company: 'Furlani Foods LLC',
              firstName: 'Will',
              lastName: 'Phillips',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'andre.dequardo@furlanifoods.com',
              clicks: 8,
              opens: 1,
              company: 'Furlani Foods LLC',
              firstName: 'Andre',
              lastName: 'Dequardo',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'kirandeep.kaur@imcdca.com',
              clicks: 8,
              opens: 1,
              company: 'IMCD Canada Limited',
              firstName: 'Kirandeep',
              lastName: 'Kaur',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'nnala@hearthsidefoods.com',
              clicks: 8,
              opens: 1,
              company: 'Hearthside Holdco, LLC (Interbake Canada)',
              firstName: 'Nnala',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'tborneman@hearthsidefoods.com',
              clicks: 8,
              opens: 1,
              company: 'Hearthside Holdco, LLC (Interbake Canada)',
              firstName: 'Tborneman',
              lastName: '',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'joseph.ravinath@sinarmas-agri.com',
              clicks: 3,
              opens: 3,
              company: 'Golden Agri-Resources USA Inc.',
              firstName: 'Joseph',
              lastName: 'Ravinath',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'steve.kubicki@sinarmas-agri.com',
              clicks: 3,
              opens: 1,
              company: 'Golden Agri-Resources USA Inc.',
              firstName: 'Steve',
              lastName: 'Kubicki',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            },
            {
              email: 'alexandra.haan@perdue.com',
              clicks: 1,
              opens: 1,
              company: 'Perdue Agribusiness LLC',
              firstName: 'Alexandra',
              lastName: 'Haan',
              campaigns: 1,
              emailAppearances: [
                1
              ]
            }
          ],
          hotLeadsCount: 9,
          allLeadsCount: 253
        },
        {
          id: 'ifpa',
          label: 'IFPA',
          exportDate: '2026-10-16',
          campaignName: 'IFPA · Octubre 2026',
          emails: [
            {
              name: 'Email 1',
              subject: '',
              metrics: {
                sent: 5968,
                uniqueOpens: 1208,
                uniqueClicks: 133,
                totalOpens: 1998,
                totalClicks: 907,
                openRate: 20.24,
                clickRate: 2.23,
                ctor: 11.01
              }
            },
            {
              name: 'Email 2',
              subject: '',
              metrics: {
                sent: 5840,
                uniqueOpens: 1163,
                uniqueClicks: 128,
                totalOpens: 1725,
                totalClicks: 941,
                openRate: 19.91,
                clickRate: 2.19,
                ctor: 11.01
              }
            },
            {
              name: 'Email 3',
              subject: '',
              metrics: {
                sent: 5800,
                uniqueOpens: 1274,
                uniqueClicks: 161,
                totalOpens: 1882,
                totalClicks: 931,
                openRate: 21.97,
                clickRate: 2.78,
                ctor: 12.64
              }
            }
          ],
          totals: {
            emailCount: 3,
            totalSent: 17608,
            totalDelivered: 17608,
            totalOpens: 3645,
            totalClicks: 422,
            totalBounces: null,
            totalUnsubs: null,
            openRate: 20.7,
            clickRate: 2.4,
            ctor: 11.58,
            bounceRate: null,
            unsubRate: null
          },
          comparison: [
            {
              name: 'Email 1',
              aperturas: 20.2,
              clics: 2.2,
              ctor: 11
            },
            {
              name: 'Email 2',
              aperturas: 19.9,
              clics: 2.2,
              ctor: 11
            },
            {
              name: 'Email 3',
              aperturas: 22,
              clics: 2.8,
              ctor: 12.6
            }
          ],
          hotLeads: [
            {
              email: 'cstarns@reveam.com',
              clicks: 28,
              opens: 14,
              company: 'Reveam, Inc.',
              firstName: 'Chip',
              lastName: 'Starns',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'dean.difazio@toplinefarms.com',
              clicks: 28,
              opens: 13,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Dean',
              lastName: 'DiFazio',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'luis.garcia@toplinefarms.com',
              clicks: 28,
              opens: 9,
              company: 'Topline Farms - Westmoreland',
              firstName: 'LUIS',
              lastName: 'GARCIA',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'lortega@mango.org',
              clicks: 28,
              opens: 5,
              company: 'National Mango Board',
              firstName: 'Leonardo',
              lastName: 'Ortega',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rojeda@mango.org',
              clicks: 28,
              opens: 5,
              company: 'National Mango Board',
              firstName: 'Ramon',
              lastName: 'Ojeda',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'dlentz@mango.org',
              clicks: 28,
              opens: 4,
              company: 'National Mango Board',
              firstName: 'Debra',
              lastName: 'Lentz',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'paul.newstead@honeybearmarketing.com',
              clicks: 28,
              opens: 4,
              company: 'Honeybear Brands',
              firstName: 'Paul',
              lastName: 'Newstead',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rfeighery@procaccibrothers.com',
              clicks: 28,
              opens: 4,
              company: 'Procacci Brothers Sales Corp.',
              firstName: 'Richard',
              lastName: 'Feighery',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'fred@wescottorchard.com',
              clicks: 28,
              opens: 3,
              company: 'Honeybear Brands',
              firstName: 'Fred',
              lastName: 'Wescott',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'gillian.digman@redhatco-op.com',
              clicks: 28,
              opens: 3,
              company: 'Red Hat Co-Op',
              firstName: 'Gillian',
              lastName: 'Digman',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'j.harris@fsfreshfoods.com',
              clicks: 28,
              opens: 3,
              company: 'F&S Fresh Foods',
              firstName: 'Jessica',
              lastName: 'Harris',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'justine.taylor@toplinefarms.com',
              clicks: 28,
              opens: 3,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Justine',
              lastName: 'Taylor',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'shelly.hoffman@luckie.com',
              clicks: 28,
              opens: 3,
              company: 'Luckie',
              firstName: 'Shelly',
              lastName: 'Hoffman',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'lazo@agraya.com',
              clicks: 26,
              opens: 4,
              company: 'AGRAYA GmbH',
              firstName: 'Angelo',
              lastName: 'Lazo',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'shige.ohara@vanguardteam.com',
              clicks: 25,
              opens: 8,
              company: 'The Vanguard International Group LP',
              firstName: 'Shige',
              lastName: 'Ohara',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'hector.velderrain@toplinefarms.com',
              clicks: 25,
              opens: 4,
              company: 'Topline Farms - Westmoreland',
              firstName: 'HectorVelderrain',
              lastName: 'Magallanes',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'dlacroix@familytreefarms.com',
              clicks: 25,
              opens: 3,
              company: 'Family Tree Farms',
              firstName: 'Doug',
              lastName: 'LaCroix',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'ccastanos@reveam.com',
              clicks: 24,
              opens: 17,
              company: 'Reveam, Inc.',
              firstName: 'Carlos',
              lastName: 'Castanos',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'johnp@pandol.com',
              clicks: 24,
              opens: 14,
              company: 'Pandol Brothers, Inc.',
              firstName: 'John',
              lastName: 'Pandol',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'amoore@fsfreshfoods.com',
              clicks: 24,
              opens: 8,
              company: 'F&S Fresh Foods',
              firstName: 'Alyssa',
              lastName: 'Moore',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'chuck.sinks@honeybearmarketing.com',
              clicks: 24,
              opens: 8,
              company: 'Honeybear Brands',
              firstName: 'Chuck',
              lastName: 'Sinks',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'goldschj@anagramintl.com',
              clicks: 24,
              opens: 8,
              company: 'Anagram International, Inc.',
              firstName: 'Josh',
              lastName: 'Goldschmidt',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jmorris@freshinnovationsllc.com',
              clicks: 24,
              opens: 8,
              company: 'Fresh Innovations, LLC',
              firstName: 'Jeff',
              lastName: 'Morris',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'josh.borkman@giumarra.com',
              clicks: 24,
              opens: 8,
              company: 'The Giumarra Companies',
              firstName: 'Josh',
              lastName: 'Borkman',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'ntello@mango.org',
              clicks: 24,
              opens: 8,
              company: 'National Mango Board',
              firstName: 'Nathalia',
              lastName: 'Tello',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rodney.tuthill@honeybearmarketing.com',
              clicks: 24,
              opens: 8,
              company: 'Honeybear Brands',
              firstName: 'Rodney',
              lastName: 'Tuthill',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'adam@clarksmarket.com',
              clicks: 24,
              opens: 7,
              company: 'Clark\'s Market',
              firstName: 'Adam',
              lastName: 'Laliberte',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'gbetancourt@reveam.com',
              clicks: 24,
              opens: 7,
              company: 'Reveam, Inc.',
              firstName: 'Gabriela',
              lastName: 'Betancourt',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'gene.coughlin@vanguardfresh.com',
              clicks: 24,
              opens: 7,
              company: 'The Vanguard International Group LP',
              firstName: 'Gene',
              lastName: 'Coughlin',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jmata@mango.org',
              clicks: 24,
              opens: 7,
              company: 'National Mango Board',
              firstName: 'Juan',
              lastName: 'Mata',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jmazer@fsfreshfoods.com',
              clicks: 24,
              opens: 7,
              company: 'F&S Fresh Foods',
              firstName: 'Jill',
              lastName: 'Mazer',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'lsetia@mango.org',
              clicks: 24,
              opens: 7,
              company: 'National Mango Board',
              firstName: 'Lavanya',
              lastName: 'Setia',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'mevero@mango.org',
              clicks: 24,
              opens: 7,
              company: 'National Mango Board',
              firstName: 'Muno',
              lastName: 'Evero',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'noah.croft@honeybearmarketing.com',
              clicks: 24,
              opens: 7,
              company: 'Honeybear Brands',
              firstName: 'Noah',
              lastName: 'Croft',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rudy@directsourcemktg.com',
              clicks: 24,
              opens: 7,
              company: 'IG Fruit Dba Direct Source Marketing',
              firstName: 'Rudy',
              lastName: 'Heras',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'emilio.moreno@toplinefarms.com',
              clicks: 24,
              opens: 6,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Emilio',
              lastName: 'Moreno',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'krystinar@toplinefarms.com',
              clicks: 24,
              opens: 6,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Krystina',
              lastName: 'RappÃ©',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'matt.wright@toplinefarms.com',
              clicks: 24,
              opens: 6,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Matt',
              lastName: 'Wright',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'mitch@pandol.com',
              clicks: 24,
              opens: 6,
              company: 'Pandol Brothers, Inc.',
              firstName: 'Mitchell',
              lastName: 'Millwee',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'nick.dicarlo@toplinefarms.com',
              clicks: 24,
              opens: 6,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Nick',
              lastName: 'DiCarlo',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'phil.rindone@pandol.com',
              clicks: 24,
              opens: 6,
              company: 'Pandol Brothers, Inc.',
              firstName: 'Phil',
              lastName: 'Rindone',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rginac@panoplyfoods.com',
              clicks: 24,
              opens: 6,
              company: 'Panoply Foods Corp',
              firstName: 'Robin',
              lastName: 'Ginac',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'thomas.wescott@honeybearmarketing.com',
              clicks: 24,
              opens: 6,
              company: 'Honeybear Brands',
              firstName: 'Thomas',
              lastName: 'Wescott',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'amanda@savewaysupplies.com',
              clicks: 24,
              opens: 5,
              company: 'Saveway Supplies, Inc.',
              firstName: 'Amanda',
              lastName: 'Woods',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'bbiederman@scotlynn.com',
              clicks: 24,
              opens: 5,
              company: 'Scotlynn Investments, Inc.',
              firstName: 'Bryan',
              lastName: 'Biederman',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'chuck@directsourcemktg.com',
              clicks: 24,
              opens: 5,
              company: 'IG Fruit Dba Direct Source Marketing',
              firstName: 'Chuck',
              lastName: 'LeDone',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'david.pereira@toplinefarms.com',
              clicks: 24,
              opens: 5,
              company: 'Topline Farms - Westmoreland',
              firstName: 'David',
              lastName: 'Pereira',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'erin.riney@luckie.com',
              clicks: 24,
              opens: 5,
              company: 'Luckie',
              firstName: 'Erin',
              lastName: 'Riney',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jdpoole@scotlynn.com',
              clicks: 24,
              opens: 5,
              company: 'Scotlynn Sweet Pac Growers',
              firstName: 'JD',
              lastName: 'Poole',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jpelletier@reveam.com',
              clicks: 24,
              opens: 5,
              company: 'Reveam, Inc.',
              firstName: 'Jeff',
              lastName: 'Pelletier',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'ryan.callahan@honeybearmarketing.com',
              clicks: 24,
              opens: 5,
              company: 'Honeybear Brands',
              firstName: 'Ryan',
              lastName: 'Callahan',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'sherry@savewaysupplies.com',
              clicks: 24,
              opens: 5,
              company: 'Saveway Supplies, Inc.',
              firstName: 'Sherry',
              lastName: 'Chen',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'sarah.esker@honeybearmarketing.com',
              clicks: 24,
              opens: 4,
              company: 'Honeybear Brands',
              firstName: 'Sarah',
              lastName: 'Esker',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'stefaniep@pandol.com',
              clicks: 24,
              opens: 4,
              company: 'Pandol Brothers, Inc.',
              firstName: 'Stefanie',
              lastName: 'Pandol',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'tony.harmon@vanguardfresh.com',
              clicks: 24,
              opens: 4,
              company: 'The Vanguard International Group LP',
              firstName: 'Tony',
              lastName: 'Harmon',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'abarrero@mango.org',
              clicks: 24,
              opens: 3,
              company: 'National Mango Board',
              firstName: 'Adrienne',
              lastName: 'Barrero',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'alexa@directsourcemktg.com',
              clicks: 24,
              opens: 3,
              company: 'IG Fruit Dba Direct Source Marketing',
              firstName: 'Alexa',
              lastName: 'Zhdan',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'alissaa@familytreefarms.com',
              clicks: 24,
              opens: 3,
              company: 'Family Tree Farms',
              firstName: 'Alissa',
              lastName: 'Amaral',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'andres.duque@vanguardfresh.com',
              clicks: 24,
              opens: 3,
              company: 'The Vanguard International Group LP',
              firstName: 'Andres',
              lastName: 'Duque',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'bcarter@scotlynn.com',
              clicks: 24,
              opens: 3,
              company: 'Scotlynn Sweet Pac Growers',
              firstName: 'Brad',
              lastName: 'Carter',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'brad.hansman@honeybearmarketing.com',
              clicks: 24,
              opens: 3,
              company: 'Honeybear Brands',
              firstName: 'Bradley',
              lastName: 'Hansman',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'brian.dicarlo@toplinefarms.com',
              clicks: 24,
              opens: 3,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Brian',
              lastName: 'DiCarlo',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'carlos.marquez@giumarra.com',
              clicks: 24,
              opens: 3,
              company: 'The Giumarra Companies',
              firstName: 'Carlos',
              lastName: 'Marquez',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'cfavero@mango.org',
              clicks: 24,
              opens: 3,
              company: 'National Mango Board',
              firstName: 'Cesar',
              lastName: 'Favero',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'cforbes@freshinnovationsllc.com',
              clicks: 24,
              opens: 3,
              company: 'Fresh Innovations, LLC',
              firstName: 'Clyde',
              lastName: 'Forbes',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'cindy@savewaysupplies.com',
              clicks: 24,
              opens: 3,
              company: 'Saveway Supplies, Inc.',
              firstName: 'Cindy',
              lastName: 'Chen',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'clara.cuevas@honeybearmarketing.com',
              clicks: 24,
              opens: 3,
              company: 'Honeybear Brands',
              firstName: 'Clara',
              lastName: 'Cuevas',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'claraarfmann@brstores.com',
              clicks: 24,
              opens: 3,
              company: 'B & R Stores Inc.',
              firstName: 'Clara',
              lastName: 'Arfmann',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'craig.arneson@honeybearmarketing.com',
              clicks: 24,
              opens: 3,
              company: 'Honeybear Brands',
              firstName: 'Craig',
              lastName: 'Arneson',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'crystal@freshinnovationsllc.com',
              clicks: 24,
              opens: 3,
              company: 'Fresh Innovations, LLC',
              firstName: 'Crystal',
              lastName: 'Berry',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'don.roper@honeybearmarketing.com',
              clicks: 24,
              opens: 3,
              company: 'Honeybear Brands',
              firstName: 'Don',
              lastName: 'Roper',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'ignacio.ugarte@vanguardteam.com',
              clicks: 24,
              opens: 3,
              company: 'The Vanguard International Group LP',
              firstName: 'Ignacio',
              lastName: 'Ugarte',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jalley@freshinnovationsllc.com',
              clicks: 24,
              opens: 3,
              company: 'Fresh Innovations, LLC',
              firstName: 'Jay',
              lastName: 'Alley',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jordan.root@vanguardfresh.com',
              clicks: 24,
              opens: 3,
              company: 'The Vanguard International Group LP',
              firstName: 'Jordan',
              lastName: 'Root',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'kristi.harris@honeybearmarketing.com',
              clicks: 24,
              opens: 3,
              company: 'Honeybear Brands',
              firstName: 'Kristi',
              lastName: 'Harris',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'laurentv@westmorelandsales.com',
              clicks: 24,
              opens: 3,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Laurent',
              lastName: 'Verbist',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'magaly.martini@honeybearmarketing.com',
              clicks: 24,
              opens: 3,
              company: 'Honeybear Brands',
              firstName: 'Magaly',
              lastName: 'Martini',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'matias.mora@vanguardfresh.com',
              clicks: 24,
              opens: 3,
              company: 'The Vanguard International Group LP',
              firstName: 'Matias',
              lastName: 'Mora',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'max.mastronardi@toplinefarms.com',
              clicks: 24,
              opens: 3,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Max',
              lastName: 'Mastronardi',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'michael.bader@honeybearmarketing.com',
              clicks: 24,
              opens: 3,
              company: 'Honeybear Brands',
              firstName: 'Michael',
              lastName: 'Bader',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'patrick.matthias@pandol.com',
              clicks: 24,
              opens: 3,
              company: 'Pandol Brothers, Inc.',
              firstName: 'Patrick',
              lastName: 'Matthias',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'scott.gelber@luckie.com',
              clicks: 24,
              opens: 3,
              company: 'Luckie',
              firstName: 'Scott',
              lastName: 'Gelber',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'sethc@familytreefarms.com',
              clicks: 24,
              opens: 3,
              company: 'Family Tree Farms',
              firstName: 'Seth',
              lastName: 'Costi',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'shelby.gaddis@honeybearmarketing.com',
              clicks: 24,
              opens: 3,
              company: 'Honeybear Brands',
              firstName: 'Shelby',
              lastName: 'Gaddis',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'tammy.collum@vanguardfresh.com',
              clicks: 24,
              opens: 3,
              company: 'The Vanguard International Group LP',
              firstName: 'Tammy',
              lastName: 'Collum',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'taylor.rhodes@luckie.com',
              clicks: 24,
              opens: 3,
              company: 'Luckie',
              firstName: 'Taylor',
              lastName: 'Rhodes',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'tfreytag@fsfreshfoods.com',
              clicks: 24,
              opens: 3,
              company: 'F&S Fresh Foods',
              firstName: 'Tony',
              lastName: 'Freytag',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'vanessag@familytreefarms.com',
              clicks: 24,
              opens: 3,
              company: 'Family Tree Farms',
              firstName: 'Vanessa',
              lastName: 'Gutierrez',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'myoung@reveam.com',
              clicks: 22,
              opens: 11,
              company: 'Reveam, Inc.',
              firstName: 'Michael',
              lastName: 'Young',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'chair@freshinnovationsllc.com',
              clicks: 20,
              opens: 3,
              company: 'Fresh Innovations, LLC',
              firstName: 'Codie',
              lastName: 'Hair',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'daniel.wu@redhatco-op.com',
              clicks: 20,
              opens: 3,
              company: 'Red Hat Co-Op',
              firstName: 'Daniel',
              lastName: 'Wu',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jimmy.coppola@toplinefarms.com',
              clicks: 20,
              opens: 3,
              company: 'Topline Farms - Westmoreland',
              firstName: 'Jimmy',
              lastName: 'Coppola',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'munn@arcadeagroup.com',
              clicks: 20,
              opens: 3,
              company: 'Arcadea Group',
              firstName: 'Emmy',
              lastName: 'Munn',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'dona.tang@eppkg.com',
              clicks: 19,
              opens: 5,
              company: 'Eco Promax Packaging Co., Ltd.',
              firstName: 'Dona',
              lastName: 'Tang',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'eric.yang@lesuipackaging.com',
              clicks: 19,
              opens: 4,
              company: 'Eco Promax Packaging Co., Ltd.',
              firstName: 'Eric',
              lastName: 'Yang',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'estelle.zhao@eppkg.com',
              clicks: 18,
              opens: 3,
              company: 'Eco Promax Packaging Co., Ltd.',
              firstName: 'Estelle',
              lastName: 'Zhao',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'donnyc@familytreefarms.com',
              clicks: 16,
              opens: 4,
              company: 'Family Tree Farms',
              firstName: 'Donny',
              lastName: 'Caggianelli',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'dwashburn@familytreefarms.com',
              clicks: 16,
              opens: 4,
              company: 'Family Tree Farms',
              firstName: 'Drew',
              lastName: 'Washburn',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jerryg@familytreefarms.com',
              clicks: 16,
              opens: 4,
              company: 'Family Tree Farms',
              firstName: 'Jerry',
              lastName: 'Guerrero',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'mrodriguez@gem-packberries.com',
              clicks: 16,
              opens: 3,
              company: 'Gem-Pack Berries, LLC',
              firstName: 'Maria',
              lastName: 'Rodriguez',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'brentonh@familytreefarms.com',
              clicks: 16,
              opens: 2,
              company: 'Family Tree Farms',
              firstName: 'Brenton',
              lastName: 'Helm',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'christians@familytreefarms.com',
              clicks: 16,
              opens: 2,
              company: 'Family Tree Farms',
              firstName: 'Christian',
              lastName: 'Shehadey',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'cmurray@familytreefarms.com',
              clicks: 16,
              opens: 2,
              company: 'Family Tree Farms',
              firstName: 'Cody',
              lastName: 'Murray',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'colemanh@familytreefarms.com',
              clicks: 16,
              opens: 2,
              company: 'Family Tree Farms',
              firstName: 'Coleman',
              lastName: 'Hammond',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'ethan.williams@vanguardfresh.com',
              clicks: 16,
              opens: 2,
              company: 'The Vanguard International Group LP',
              firstName: 'Ethan',
              lastName: 'Williams',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'sean.riley@giumarra.com',
              clicks: 16,
              opens: 2,
              company: 'The Giumarra Companies',
              firstName: 'Sean',
              lastName: 'Riley',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'steveng@familytreefarms.com',
              clicks: 16,
              opens: 2,
              company: 'Family Tree Farms',
              firstName: 'Steven',
              lastName: 'Gallegos',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'chris.henry@giumarra.com',
              clicks: 13,
              opens: 4,
              company: 'The Giumarra Companies',
              firstName: 'Chris',
              lastName: 'Henry',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'luisd@familytreefarms.com',
              clicks: 13,
              opens: 2,
              company: 'Family Tree Farms',
              firstName: 'Luis',
              lastName: 'De La Torre',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'cmoore@kingpost.us',
              clicks: 12,
              opens: 9,
              company: 'Furlong Logistics LLC dba Kingpost',
              firstName: 'Clay',
              lastName: 'Moore',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jeniffer.chen@lesuipackaging.com',
              clicks: 12,
              opens: 5,
              company: 'Eco Promax Packaging Co., Ltd.',
              firstName: 'Jeniffer',
              lastName: 'Chen',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'bkessinger@kingpost.us',
              clicks: 12,
              opens: 3,
              company: 'Furlong Logistics LLC dba Kingpost',
              firstName: 'Ben',
              lastName: 'Kessinger',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'pgoudis@kingpost.us',
              clicks: 12,
              opens: 3,
              company: 'Furlong Logistics LLC dba Kingpost',
              firstName: 'Peter',
              lastName: 'Goudis',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'wholton@kingpost.us',
              clicks: 12,
              opens: 3,
              company: 'Furlong Logistics LLC dba Kingpost',
              firstName: 'Will',
              lastName: 'Holton',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'bryceh@familytreefarms.com',
              clicks: 8,
              opens: 3,
              company: 'Family Tree Farms',
              firstName: 'Bryce',
              lastName: 'Hammond',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'diane.soard@cc-racks.com',
              clicks: 8,
              opens: 3,
              company: 'Container Centralen Inc.',
              firstName: 'Diane',
              lastName: 'Soard',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'amuxlow@familytreefarms.com',
              clicks: 8,
              opens: 2,
              company: 'Family Tree Farms',
              firstName: 'Andy',
              lastName: 'Muxlow',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'anthony.stallings@giumarra.com',
              clicks: 8,
              opens: 1,
              company: 'The Giumarra Companies',
              firstName: 'Anthony',
              lastName: 'Stallings',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'davidj@familytreefarms.com',
              clicks: 8,
              opens: 1,
              company: 'Family Tree Farms',
              firstName: 'David',
              lastName: 'Jackson',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jweber@pure-flavor.com',
              clicks: 8,
              opens: 1,
              company: 'Pure Flavor Farms LP',
              firstName: 'Julia',
              lastName: 'Weber',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'madalyn.mccracken@vanguardteam.com',
              clicks: 8,
              opens: 1,
              company: 'The Vanguard International Group LP',
              firstName: 'Madalyn',
              lastName: 'McCracken',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'marcol@familytreefarms.com',
              clicks: 8,
              opens: 1,
              company: 'Family Tree Farms',
              firstName: 'Marco',
              lastName: 'Luna',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'phosda.pak@giumarra.com',
              clicks: 8,
              opens: 1,
              company: 'The Giumarra Companies',
              firstName: 'Phosda',
              lastName: 'Pak',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rhoward@familytreefarms.com',
              clicks: 8,
              opens: 1,
              company: 'Family Tree Farms',
              firstName: 'Ryan',
              lastName: 'Howard',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'tracej@familytreefarms.com',
              clicks: 8,
              opens: 1,
              company: 'Family Tree Farms',
              firstName: 'Trace',
              lastName: 'Jackson',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'comercializacion@alimentosjopa.com',
              clicks: 6,
              opens: 3,
              company: 'Alimentos Jopa C.A',
              firstName: 'Johan Luciano',
              lastName: 'Chavez Gruber',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'd.bermudez@frtropicales.com',
              clicks: 6,
              opens: 3,
              company: 'Costa Rica - Essential Costa Rica',
              firstName: 'Deivin',
              lastName: 'Bermudez Mendez',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'micailan@familytreefarms.com',
              clicks: 5,
              opens: 1,
              company: 'Family Tree Farms',
              firstName: 'Micaila',
              lastName: 'Nunez',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jose.diaz@eammosca.com',
              clicks: 4,
              opens: 2,
              company: 'EAM-Mosca Corporation',
              firstName: 'Jose',
              lastName: 'Diaz',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'chigashi@spokaneproduce.com',
              clicks: 4,
              opens: 1,
              company: 'Spokane Produce, Inc.',
              firstName: 'Craig',
              lastName: 'Higashi',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'auna.lundberg@stemilt.com',
              clicks: 3,
              opens: 4,
              company: 'Stemilt Growers LLC',
              firstName: 'Auna',
              lastName: 'Lundberg',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jsokolova@ensembleiq.com',
              clicks: 2,
              opens: 35,
              company: 'Ensemble IQ',
              firstName: 'Julia',
              lastName: 'Sokolova',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'brian.evans@stemilt.com',
              clicks: 2,
              opens: 4,
              company: 'Stemilt Growers LLC',
              firstName: 'Brian',
              lastName: 'Evans',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'dwarkesh.kapadiya@omori-na.com',
              clicks: 2,
              opens: 4,
              company: 'Omori North America Inc.',
              firstName: 'Dwarkesh',
              lastName: 'Kapadiya',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jlee@kowalskis.com',
              clicks: 2,
              opens: 3,
              company: 'Kowalski\'s Markets',
              firstName: 'Jeremy',
              lastName: 'Lee',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'morgan@thefreshwave.com',
              clicks: 2,
              opens: 3,
              company: 'Fresh Wave Fruit & Produce',
              firstName: 'Morgan',
              lastName: 'DiMartino',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'aakdogan@swtfresh.com',
              clicks: 1,
              opens: 10,
              company: 'Sweet Fresh Produce',
              firstName: 'Ali',
              lastName: 'Akdogan',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'amweddle@calpoly.edu',
              clicks: 1,
              opens: 8,
              company: 'Cal Poly State University',
              firstName: 'Avery',
              lastName: 'Weddle',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'lgarwick@calpoly.edu',
              clicks: 1,
              opens: 7,
              company: 'Cal Poly State University',
              firstName: 'Logan',
              lastName: 'Garwick',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'bart.bakker@ludvigsvensson.com',
              clicks: 1,
              opens: 5,
              company: 'Ludvig Svensson, Inc',
              firstName: 'Bart',
              lastName: 'Bakker',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'dennis.burns@affinitysales.com',
              clicks: 1,
              opens: 5,
              company: 'Affinity Sales',
              firstName: 'Dennis',
              lastName: 'Burns',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jmpiment@calpoly.edu',
              clicks: 1,
              opens: 5,
              company: 'Cal Poly State University',
              firstName: 'Jack',
              lastName: 'Pinmentel',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'kespinosa@eateryessentials.com',
              clicks: 1,
              opens: 5,
              company: 'Eatery Essentials',
              firstName: 'Kimberley',
              lastName: 'Espinosa',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'sarah.burns@stemilt.com',
              clicks: 1,
              opens: 5,
              company: 'Stemilt Growers LLC',
              firstName: 'Sarah',
              lastName: 'Burns',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'ssimon@sunsweet.com',
              clicks: 1,
              opens: 5,
              company: 'Sunsweet Growers, Inc.',
              firstName: 'Sandy',
              lastName: 'Simon',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'zrodri03@calpoly.edu',
              clicks: 1,
              opens: 5,
              company: 'Cal Poly State University',
              firstName: 'Zenaida',
              lastName: 'Rodriguez',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'cameron.newell@xerces.org',
              clicks: 1,
              opens: 4,
              company: 'Bee Better Certified',
              firstName: 'Cameron',
              lastName: 'Newell',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'fmaggio@camposol.com',
              clicks: 1,
              opens: 4,
              company: 'Camposol',
              firstName: 'Federico',
              lastName: 'Maggio',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'herb@gps-miami.com',
              clicks: 1,
              opens: 4,
              company: 'Global Perishable Services',
              firstName: 'Herb',
              lastName: 'Gardner',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jorge.macias@stemilt.com',
              clicks: 1,
              opens: 4,
              company: 'Stemilt Growers LLC',
              firstName: 'Jorge',
              lastName: 'Macias',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'katie.harmon@stemilt.com',
              clicks: 1,
              opens: 4,
              company: 'Stemilt Growers LLC',
              firstName: 'Katie',
              lastName: 'Harmon',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'lauren.mathison@stemilt.com',
              clicks: 1,
              opens: 4,
              company: 'Stemilt Growers LLC',
              firstName: 'Lauren',
              lastName: 'Mathison',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'matthew.jarmin@stemilt.com',
              clicks: 1,
              opens: 4,
              company: 'Stemilt Growers LLC',
              firstName: 'Matthew',
              lastName: 'Jarmin',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'mrk@darksideequipment.com',
              clicks: 1,
              opens: 4,
              company: 'Dark Side Equipment',
              firstName: 'Maxwell',
              lastName: 'Krieger',
              campaigns: 2,
              emailAppearances: [
                1,
                2
              ]
            },
            {
              email: 'neryem.flores@stemilt.com',
              clicks: 1,
              opens: 4,
              company: 'Stemilt Growers LLC',
              firstName: 'Neryem',
              lastName: 'Flores',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rgalindo@sunshinebouquet.com',
              clicks: 1,
              opens: 4,
              company: 'Sunshine Bouquet Company',
              firstName: 'Roga',
              lastName: 'Galindo',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'brendac@cmiorchards.com',
              clicks: 1,
              opens: 3,
              company: 'CMI Orchards',
              firstName: 'Brenda',
              lastName: 'Calvillo',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'bsando13@calpoly.edu',
              clicks: 1,
              opens: 3,
              company: 'Cal Poly State University',
              firstName: 'Bryan',
              lastName: 'Sandovl',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'ceranos_v@msn.com',
              clicks: 1,
              opens: 3,
              company: 'GRUPO CA & LU ORGANIC FRUITS',
              firstName: 'Vicente Cerano',
              lastName: 'Sanchez',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'cwells12@calpoly.edu',
              clicks: 1,
              opens: 3,
              company: 'Cal Poly State University',
              firstName: 'Caleb',
              lastName: 'Wells',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'david@farmacopiafarms.com',
              clicks: 1,
              opens: 3,
              company: 'Farmacopia Farms LLC',
              firstName: 'David',
              lastName: 'Waters',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'everth@riverdalefarms.com',
              clicks: 1,
              opens: 3,
              company: 'Riverdale Farms',
              firstName: 'Everth',
              lastName: 'Chacon',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'gminetti@calpoly.edu',
              clicks: 1,
              opens: 3,
              company: 'Cal Poly State University',
              firstName: 'Grace',
              lastName: 'Minetti',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'grejo.torres@hotmail.com',
              clicks: 1,
              opens: 3,
              company: 'LEVEL-BERRIES SA DE CV',
              firstName: 'Grettel Josefina',
              lastName: 'Torres Mendoza',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'harold.ramos@seaboardmarine.com',
              clicks: 1,
              opens: 3,
              company: 'Seaboard Marine Ltd.',
              firstName: 'Harold',
              lastName: 'Ramos',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'hcremers@calpoly.edu',
              clicks: 1,
              opens: 3,
              company: 'Cal Poly State University',
              firstName: 'Henry',
              lastName: 'Cremers',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jandrews@sev-rend.com',
              clicks: 1,
              opens: 3,
              company: 'Sev-Rend',
              firstName: 'Jeremy',
              lastName: 'Andrews',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jstoltz@hy-vee.com',
              clicks: 1,
              opens: 3,
              company: 'Hy-Vee, Inc.',
              firstName: 'Joe',
              lastName: 'Stoltz',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rkwan@hormel.com',
              clicks: 1,
              opens: 3,
              company: 'Fresherized Foods',
              firstName: 'Ray',
              lastName: 'Kwan',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'sdavie02@calpoly.edu',
              clicks: 1,
              opens: 3,
              company: 'Cal Poly State University',
              firstName: 'Sequoia',
              lastName: 'Davies',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'tnorthro@calpoly.edu',
              clicks: 1,
              opens: 3,
              company: 'Cal Poly State University',
              firstName: 'Tim',
              lastName: 'Northrop',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'travish@cmiorchards.com',
              clicks: 1,
              opens: 3,
              company: 'CMI Orchards',
              firstName: 'Travis',
              lastName: 'Hallman',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'wcrook@calpoly.edu',
              clicks: 1,
              opens: 3,
              company: 'Cal Poly State University',
              firstName: 'William',
              lastName: 'Crook',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'dganske@johansontrans.com',
              clicks: 1,
              opens: 2,
              company: 'Johanson Transportation Services',
              firstName: 'Drew',
              lastName: 'Ganske',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'maggie@bezartmarketing.com',
              clicks: 1,
              opens: 2,
              company: 'Mags International, LLC',
              firstName: 'Maggie',
              lastName: 'Bezart-Hall',
              campaigns: 2,
              emailAppearances: [
                1,
                2
              ]
            },
            {
              email: 'andres.alcala@fedex.com',
              clicks: 1,
              opens: 1,
              company: 'FedEx Express',
              firstName: 'Andres',
              lastName: 'Alcala',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'breanne.steadman@volmcompanies.com',
              clicks: 1,
              opens: 1,
              company: 'Volm Companies, Inc.',
              firstName: 'Breanne',
              lastName: 'Steadman',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'carlosvargas@cunzac.edu.gt',
              clicks: 1,
              opens: 1,
              company: 'Centro Universitario de Zacapa',
              firstName: 'Carlos Augusto',
              lastName: 'Vargas Galvez',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'cheyenne.esguerra@freshorigins.com',
              clicks: 1,
              opens: 1,
              company: 'Fresh Origins / San Diego Farms',
              firstName: 'Cheyenne',
              lastName: 'Esguerra',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'christopher.steckler@apexglobe.com',
              clicks: 1,
              opens: 1,
              company: 'Apex Logistics International Inc.',
              firstName: 'Christopher',
              lastName: 'Steckler',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'clambrou@awtlabelpack.com',
              clicks: 1,
              opens: 1,
              company: 'AWT Labels & Packaging',
              firstName: 'Chris',
              lastName: 'Lambrou',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'diego.chinchilla@seainternationalcr.com',
              clicks: 1,
              opens: 1,
              company: 'Costa Rica - Essential Costa Rica',
              firstName: 'Diego',
              lastName: 'Chinchilla',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'evanis@1800flowers.com',
              clicks: 1,
              opens: 1,
              company: '1800Flowers.com',
              firstName: 'Eva',
              lastName: 'Vanis',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'ipg@entre-valles.cl',
              clicks: 1,
              opens: 1,
              company: 'Exportadora Entre Valles Ltda',
              firstName: 'Ignacio',
              lastName: 'Pizarro Guerra',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jason.storch@volmcompanies.com',
              clicks: 1,
              opens: 1,
              company: 'Volm Companies, Inc.',
              firstName: 'Jason',
              lastName: 'Storch',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jhunsaker@slproduce.mx',
              clicks: 1,
              opens: 1,
              company: 'SL Produce LLC',
              firstName: 'Jeremiah',
              lastName: 'Hunsaker',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'joely@kingorange.com',
              clicks: 1,
              opens: 1,
              company: 'Kings River Packing, LP',
              firstName: 'Joel',
              lastName: 'Yeary',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jpatrick@ecofarmsusa.com',
              clicks: 1,
              opens: 1,
              company: 'Eco Farms',
              firstName: 'John',
              lastName: 'Patrick',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'kabbondanza@trustwell.com',
              clicks: 1,
              opens: 1,
              company: 'Trustwell',
              firstName: 'Kristen',
              lastName: 'Leto',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'kschiebel@citikold.com',
              clicks: 1,
              opens: 1,
              company: 'Citikold',
              firstName: 'Klauss',
              lastName: 'Schiebel',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'kylec@measuretoimprovellc.com',
              clicks: 1,
              opens: 1,
              company: 'Measure To Improve LLC',
              firstName: 'Kyle',
              lastName: 'Cosgrove',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'lindsay@sujalife.com',
              clicks: 1,
              opens: 1,
              company: 'Suja Life',
              firstName: 'Lindsay',
              lastName: 'Brooks',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'paula.chuman@asicagroup.com',
              clicks: 1,
              opens: 1,
              company: 'Asica Farms',
              firstName: 'Paula',
              lastName: 'Chuman',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rbolivar@mymarketstores.com',
              clicks: 1,
              opens: 1,
              company: 'My Market Stores',
              firstName: 'Roberto',
              lastName: 'Bolivar',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'rmiller@militaryproduce.com',
              clicks: 1,
              opens: 1,
              company: 'Military Produce Group LLC',
              firstName: 'Robin',
              lastName: 'Miller',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'syoung@watercress.com',
              clicks: 1,
              opens: 1,
              company: 'B&W Quality Growers',
              firstName: 'Scott',
              lastName: 'Young',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'trd-m-sato@tokyo-seika.co.jp',
              clicks: 1,
              opens: 1,
              company: 'Tokyo Seika Trading Co., Ltd.',
              firstName: 'MASAFUMI',
              lastName: 'SATO',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'tsmelcer@pwadc.com',
              clicks: 1,
              opens: 1,
              company: 'Piggly Wiggly Alabama Distributing Co., Inc.',
              firstName: 'Tracy',
              lastName: 'Smelcer',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'yolanda.roundtree@fdacs.gov',
              clicks: 1,
              opens: 1,
              company: 'Florida Department of Agriculture & Consumer Services',
              firstName: 'Yolanda',
              lastName: 'Roundtree',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            },
            {
              email: 'jyeon47@gmail.com',
              clicks: 1,
              opens: 0,
              company: 'Daemyungfarms',
              firstName: 'Juyeon',
              lastName: 'Kim',
              campaigns: 3,
              emailAppearances: [
                1,
                2,
                3
              ]
            }
          ],
          hotLeadsCount: 200,
          allLeadsCount: 5968
        },
      ],
    },
  },
};

// Cuentas derivadas del seed (vacío hasta el primer import real).
// Peterson Solutions Estados Unidos · m10 — generado con scripts/mailchimp-to-seed.mjs
EMAIL_DB['psus'] = {
  name: 'Peterson Solutions Estados Unidos',
  periods: {
    'm10': {
        campaignName: 'Webinar Fueling Conversations · Octubre 2026',
        emails: [
          {
            name: 'Email 1 · Base actual',
            subject: '',
            metrics: {
              sent: 996,
              uniqueOpens: 228,
              uniqueClicks: 26,
              totalOpens: 348,
              totalClicks: 209,
              openRate: 22.89,
              clickRate: 2.61,
              ctor: 11.4
            }
          },
          {
            name: 'Email 1 · Base nueva',
            subject: '',
            metrics: {
              sent: 2640,
              uniqueOpens: 605,
              uniqueClicks: 65,
              totalOpens: 911,
              totalClicks: 357,
              openRate: 22.92,
              clickRate: 2.46,
              ctor: 10.74
            }
          },
          {
            name: 'Email 2 · Base actual',
            subject: '',
            metrics: {
              sent: 946,
              uniqueOpens: 224,
              uniqueClicks: 33,
              totalOpens: 322,
              totalClicks: 214,
              openRate: 23.68,
              clickRate: 3.49,
              ctor: 14.73
            }
          },
          {
            name: 'Email 2 · Base nueva',
            subject: '',
            metrics: {
              sent: 2549,
              uniqueOpens: 557,
              uniqueClicks: 56,
              totalOpens: 820,
              totalClicks: 354,
              openRate: 21.85,
              clickRate: 2.2,
              ctor: 10.05
            }
          },
          {
            name: 'Email 3 · Base actual',
            subject: '',
            metrics: {
              sent: 940,
              uniqueOpens: 199,
              uniqueClicks: 26,
              totalOpens: 282,
              totalClicks: 182,
              openRate: 21.17,
              clickRate: 2.77,
              ctor: 13.07
            }
          },
          {
            name: 'Email 3 · Base nueva',
            subject: '',
            metrics: {
              sent: 2525,
              uniqueOpens: 910,
              uniqueClicks: 60,
              totalOpens: 1280,
              totalClicks: 365,
              openRate: 36.04,
              clickRate: 2.38,
              ctor: 6.59
            }
          },
          {
            name: 'Email 4 · Base nueva',
            subject: '',
            metrics: {
              sent: 2503,
              uniqueOpens: 884,
              uniqueClicks: 57,
              totalOpens: 1220,
              totalClicks: 323,
              openRate: 35.32,
              clickRate: 2.28,
              ctor: 6.45
            }
          },
          {
            name: 'Email 5 · Base actual',
            subject: '',
            metrics: {
              sent: 937,
              uniqueOpens: 186,
              uniqueClicks: 23,
              totalOpens: 249,
              totalClicks: 125,
              openRate: 19.85,
              clickRate: 2.45,
              ctor: 12.37
            }
          },
          {
            name: 'Email 5 · Base nueva',
            subject: '',
            metrics: {
              sent: 2493,
              uniqueOpens: 559,
              uniqueClicks: 57,
              totalOpens: 788,
              totalClicks: 324,
              openRate: 22.42,
              clickRate: 2.29,
              ctor: 10.2
            }
          },
          {
            name: 'Email 6 · Base actual',
            subject: '',
            metrics: {
              sent: 933,
              uniqueOpens: 227,
              uniqueClicks: 28,
              totalOpens: 319,
              totalClicks: 165,
              openRate: 24.33,
              clickRate: 3,
              ctor: 12.33
            }
          },
          {
            name: 'Email 7 · Base actual',
            subject: '',
            metrics: {
              sent: 929,
              uniqueOpens: 224,
              uniqueClicks: 26,
              totalOpens: 326,
              totalClicks: 159,
              openRate: 24.11,
              clickRate: 2.8,
              ctor: 11.61
            }
          },
          {
            name: 'Email 8 · Base actual',
            subject: '',
            metrics: {
              sent: 917,
              uniqueOpens: 174,
              uniqueClicks: 26,
              totalOpens: 239,
              totalClicks: 159,
              openRate: 18.97,
              clickRate: 2.84,
              ctor: 14.94
            }
          },
          {
            name: 'Post-webinar · Participantes',
            subject: '',
            metrics: {
              sent: 28,
              uniqueOpens: 7,
              uniqueClicks: 2,
              totalOpens: 15,
              totalClicks: 16,
              openRate: 25,
              clickRate: 7.14,
              ctor: 28.57
            }
          },
          {
            name: 'Post-webinar · Registrados',
            subject: '',
            metrics: {
              sent: 34,
              uniqueOpens: 11,
              uniqueClicks: 3,
              totalOpens: 17,
              totalClicks: 13,
              openRate: 32.35,
              clickRate: 8.82,
              ctor: 27.27
            }
          }
        ],
        totals: {
          emailCount: 14,
          totalSent: 19370,
          totalDelivered: 19370,
          totalOpens: 4995,
          totalClicks: 488,
          totalBounces: null,
          totalUnsubs: null,
          openRate: 25.79,
          clickRate: 2.52,
          ctor: 9.77,
          bounceRate: null,
          unsubRate: null
        },
        comparison: [
          {
            name: 'Email 1 · Base actual',
            aperturas: 22.9,
            clics: 2.6,
            ctor: 11.4
          },
          {
            name: 'Email 1 · Base nueva',
            aperturas: 22.9,
            clics: 2.5,
            ctor: 10.7
          },
          {
            name: 'Email 2 · Base actual',
            aperturas: 23.7,
            clics: 3.5,
            ctor: 14.7
          },
          {
            name: 'Email 2 · Base nueva',
            aperturas: 21.9,
            clics: 2.2,
            ctor: 10.1
          },
          {
            name: 'Email 3 · Base actual',
            aperturas: 21.2,
            clics: 2.8,
            ctor: 13.1
          },
          {
            name: 'Email 3 · Base nueva',
            aperturas: 36,
            clics: 2.4,
            ctor: 6.6
          },
          {
            name: 'Email 4 · Base nueva',
            aperturas: 35.3,
            clics: 2.3,
            ctor: 6.4
          },
          {
            name: 'Email 5 · Base actual',
            aperturas: 19.9,
            clics: 2.5,
            ctor: 12.4
          },
          {
            name: 'Email 5 · Base nueva',
            aperturas: 22.4,
            clics: 2.3,
            ctor: 10.2
          },
          {
            name: 'Email 6 · Base actual',
            aperturas: 24.3,
            clics: 3,
            ctor: 12.3
          },
          {
            name: 'Email 7 · Base actual',
            aperturas: 24.1,
            clics: 2.8,
            ctor: 11.6
          },
          {
            name: 'Email 8 · Base actual',
            aperturas: 19,
            clics: 2.8,
            ctor: 14.9
          },
          {
            name: 'Post-webinar · Participantes',
            aperturas: 25,
            clics: 7.1,
            ctor: 28.6
          },
          {
            name: 'Post-webinar · Registrados',
            aperturas: 32.4,
            clics: 8.8,
            ctor: 27.3
          }
        ],
        hotLeads: [
          {
            email: 'mkelly@cgbioenergy.com',
            clicks: 67,
            opens: 16,
            company: 'Carbon Green BioEnergy, LLC',
            firstName: 'Missy',
            lastName: 'Kelly',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'ddzajic@cgbioenergy.com',
            clicks: 62,
            opens: 14,
            company: 'Carbon Green BioEnergy, LLC',
            firstName: 'Dzenis',
            lastName: 'Dzajic',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'ptiverios@fulcrum-bioenergy.com',
            clicks: 62,
            opens: 13,
            company: 'Fulcrum BioEnergy, Inc.',
            firstName: 'Pete',
            lastName: 'Tiverios',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'gcorey@cgbioenergy.com',
            clicks: 62,
            opens: 11,
            company: 'Carbon Green BioEnergy, LLC',
            firstName: 'Gabe',
            lastName: 'Corey',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'mbenham@cgbioenergy.com',
            clicks: 62,
            opens: 11,
            company: 'Carbon Green BioEnergy, LLC',
            firstName: 'Maggie',
            lastName: 'Benham',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'epryor@fulcrum-bioenergy.com',
            clicks: 62,
            opens: 10,
            company: 'Fulcrum BioEnergy, Inc.',
            firstName: 'Eric',
            lastName: 'Pryor',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'jbellaire@walkerind.com',
            clicks: 60,
            opens: 20,
            company: 'Walker Industries',
            firstName: 'James',
            lastName: 'Bellaire',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'gwalker@walkerind.com',
            clicks: 60,
            opens: 17,
            company: 'Walker Industries',
            firstName: 'Geordie',
            lastName: 'Walker',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'dschulz@walkerind.com',
            clicks: 60,
            opens: 12,
            company: 'Walker Industries',
            firstName: 'David',
            lastName: 'Schulz',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'jnies@herobx.com',
            clicks: 60,
            opens: 7,
            company: 'HERO BX',
            firstName: 'John',
            lastName: 'Nies',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'mberger@uwgp.com',
            clicks: 60,
            opens: 7,
            company: 'United Wisconsin Grain Producers, LLC',
            firstName: 'Marc',
            lastName: 'Berger',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'cpeterson@herobx.com',
            clicks: 60,
            opens: 6,
            company: 'HERO BX',
            firstName: 'Chris',
            lastName: 'Peterson',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'lhennig@fulcrum-bioenergy.com',
            clicks: 59,
            opens: 12,
            company: 'Fulcrum BioEnergy, Inc.',
            firstName: 'Lorra',
            lastName: 'Hennig',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'cwhitsett@herobx.com',
            clicks: 59,
            opens: 7,
            company: 'HERO BX',
            firstName: 'Cetric',
            lastName: 'Whitsett',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'wayne.karolat@greenmantra.com',
            clicks: 50,
            opens: 7,
            company: 'GreenMantra Technologies',
            firstName: 'Wayne',
            lastName: 'Karolat',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'stacyn@nelsonbaker.com',
            clicks: 44,
            opens: 12,
            company: 'Nelson Baker Biotech',
            firstName: 'Stacy',
            lastName: 'Nelson',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'dbrannan@calbioenergy.com',
            clicks: 44,
            opens: 9,
            company: 'California Bioenergy LLC',
            firstName: 'Danielle',
            lastName: 'Brannan',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'mhanson@ecfinc.net',
            clicks: 44,
            opens: 9,
            company: 'ECF, Inc.',
            firstName: 'Mark',
            lastName: 'Hanson',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'joen@nelsonbaker.com',
            clicks: 44,
            opens: 5,
            company: 'Nelson Baker Biotech',
            firstName: 'Josiah',
            lastName: 'Nyberg',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'christine@vsjf.org',
            clicks: 40,
            opens: 18,
            company: 'Vermont Sustainable Jobs Fund',
            firstName: 'Christine',
            lastName: 'McGowan',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'elliot.neto@kemin.com',
            clicks: 40,
            opens: 18,
            company: 'Kemin Industries',
            firstName: 'Elliot',
            lastName: 'Neto',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'ashkhans@tol-lp.com',
            clicks: 40,
            opens: 16,
            company: 'Texas OilTech Laboratories',
            firstName: 'Ashkhan',
            lastName: 'Sorurbakhsh',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'chris.moore@kemin.com',
            clicks: 40,
            opens: 15,
            company: 'Kemin Industries',
            firstName: 'Chris',
            lastName: 'Moore',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'afsheens@tol-lp.com',
            clicks: 40,
            opens: 14,
            company: 'Texas OilTech Laboratories',
            firstName: 'Afsheen',
            lastName: 'Sorurbakhsh',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'judson.vasconcelos@kemin.com',
            clicks: 40,
            opens: 14,
            company: 'Kemin Industries',
            firstName: 'Judson',
            lastName: 'Vasconcelos',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'nelson@biotownag.com',
            clicks: 40,
            opens: 13,
            company: 'Bio Town Ag, Inc.',
            firstName: 'Nelson',
            lastName: 'Eisenmann',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'ben@biotownag.com',
            clicks: 40,
            opens: 11,
            company: 'Bio Town Ag, Inc.',
            firstName: 'Ben',
            lastName: 'Gerber',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'kbaalmann@ecfinc.net',
            clicks: 40,
            opens: 11,
            company: 'ECF, Inc.',
            firstName: 'Keith',
            lastName: 'Baalmann',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'cforgeyjahn@calbioenergy.com',
            clicks: 40,
            opens: 10,
            company: 'California Bioenergy LLC',
            firstName: 'Claire',
            lastName: 'Forgey-Jahn',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'csummers@maineenergymarketers.com',
            clicks: 40,
            opens: 10,
            company: 'Maine Energy Marketers Association/MTEC',
            firstName: 'Charlie',
            lastName: 'Summers',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'elbyc@unitedethanol.com',
            clicks: 40,
            opens: 10,
            company: 'United Ethanol LLC',
            firstName: 'Elby',
            lastName: 'Cox',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'ff@tol-lp.com',
            clicks: 40,
            opens: 10,
            company: 'Texas OilTech Laboratories',
            firstName: 'Fatemeh',
            lastName: 'Fatehi',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'gschouten@schoutenadvies.nl',
            clicks: 40,
            opens: 10,
            company: 'Schouten Advies',
            firstName: 'Govert',
            lastName: 'Schouten',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'johnm@unitedethanol.com',
            clicks: 40,
            opens: 10,
            company: 'United Ethanol LLC',
            firstName: 'John',
            lastName: 'Minard',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'kgardner@ecfinc.net',
            clicks: 40,
            opens: 10,
            company: 'ECF, Inc.',
            firstName: 'Kermit',
            lastName: 'Gardner',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'mburnett@calbioenergy.com',
            clicks: 40,
            opens: 10,
            company: 'California Bioenergy LLC',
            firstName: 'Madelyn',
            lastName: 'Burnett',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'tamara@ceaconsulting.com',
            clicks: 40,
            opens: 10,
            company: 'CEA Consulting',
            firstName: 'Tamara',
            lastName: 'Evans',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'troyf@biotownag.com',
            clicks: 40,
            opens: 10,
            company: 'Bio Town Ag, Inc.',
            firstName: 'Troy',
            lastName: 'Fiechter',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'gyoung@unitedethanol.com',
            clicks: 40,
            opens: 9,
            company: 'United Ethanol LLC',
            firstName: 'Gary',
            lastName: 'Young',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'melissa@ceaconsulting.com',
            clicks: 40,
            opens: 9,
            company: 'CEA Consulting',
            firstName: 'Melissa',
            lastName: 'Clack',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'sarrynna@ceaconsulting.com',
            clicks: 40,
            opens: 9,
            company: 'CEA Consulting',
            firstName: 'Sarrynna',
            lastName: 'Sou',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'ellen@vsjf.org',
            clicks: 40,
            opens: 8,
            company: 'Vermont Sustainable Jobs Fund',
            firstName: 'Ellen',
            lastName: 'Kahler',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'leah@vsjf.org',
            clicks: 40,
            opens: 7,
            company: 'Vermont Sustainable Jobs Fund',
            firstName: 'Leah',
            lastName: 'Rovner',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'doug.hoogeveen@verbio.us',
            clicks: 40,
            opens: 6,
            company: 'VERBIO North America LLC',
            firstName: 'Doug',
            lastName: 'Hoogeveen',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'andrewa@nelsonbaker.com',
            clicks: 40,
            opens: 5,
            company: 'Nelson Baker Biotech',
            firstName: 'Andrew',
            lastName: 'Argo',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'dzifa.quist@nbsola.com',
            clicks: 40,
            opens: 5,
            company: 'Netherlands Enterprise Agency',
            firstName: 'Dzifa',
            lastName: 'Quist-Sanford',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jbresser@uwgp.com',
            clicks: 40,
            opens: 5,
            company: 'United Wisconsin Grain Producers, LLC',
            firstName: 'Jon',
            lastName: 'Bresser',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'lolson@uwgp.com',
            clicks: 40,
            opens: 5,
            company: 'United Wisconsin Grain Producers, LLC',
            firstName: 'Lee',
            lastName: 'Olson',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'mdiver@maineenergymarketers.com',
            clicks: 40,
            opens: 5,
            company: 'Maine Energy Marketers Association/MTEC',
            firstName: 'Megan',
            lastName: 'Diver',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'tkeaveney@lakeeriebiofuels.com',
            clicks: 40,
            opens: 5,
            company: 'Lake Erie Biofuels',
            firstName: 'Timothy',
            lastName: 'Keaveney',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'domenic.dimondo@greenmantra.com',
            clicks: 36,
            opens: 5,
            company: 'GreenMantra Technologies',
            firstName: 'Domenic',
            lastName: 'Mondo',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'samson.mathew@greenmantra.com',
            clicks: 36,
            opens: 4,
            company: 'GreenMantra Technologies',
            firstName: 'Samson',
            lastName: 'Mathew',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'martin.hudson@greenmantra.com',
            clicks: 35,
            opens: 4,
            company: 'GreenMantra Technologies',
            firstName: 'Martin',
            lastName: 'Hudson',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'brouzer@fuillc.com',
            clicks: 25,
            opens: 2,
            company: 'Farmers Union Industries, LLC',
            firstName: 'Brendan',
            lastName: 'Rouzer',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'ckuhlers@ggecorn.com',
            clicks: 24,
            opens: 3,
            company: 'Golden Grain Energy, LLC',
            firstName: 'Chad',
            lastName: 'Kuhlers',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'cmiller@ggecorn.com',
            clicks: 24,
            opens: 3,
            company: 'Golden Grain Energy, LLC',
            firstName: 'Clay',
            lastName: 'Miller',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'jbentley@fuillc.com',
            clicks: 24,
            opens: 2,
            company: 'Farmers Union Industries, LLC',
            firstName: 'Jason',
            lastName: 'Bentley',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'garymcchesney@ffcmail.com',
            clicks: 23,
            opens: 5,
            company: 'FutureFuel Chemical Company',
            firstName: 'Gary',
            lastName: 'McChesney',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'kylegaither@ffcmail.com',
            clicks: 23,
            opens: 5,
            company: 'FutureFuel Chemical Company',
            firstName: 'Kyle',
            lastName: 'Gaither',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'bmcclure@silvateam.com',
            clicks: 20,
            opens: 5,
            company: 'Silvateam s.p.a.',
            firstName: 'Benny',
            lastName: 'McClure',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'cmrossi@tecnicasreunidas.es',
            clicks: 20,
            opens: 5,
            company: 'Técnicas Reunidas',
            firstName: 'Christopher',
            lastName: 'Rossi',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'deberhart@tecnicasreunidas.es',
            clicks: 20,
            opens: 5,
            company: 'Técnicas Reunidas',
            firstName: 'Doug',
            lastName: 'Eberhart',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jbedoya@tecnicasreunidas.es',
            clicks: 20,
            opens: 5,
            company: 'Técnicas Reunidas',
            firstName: 'Joel',
            lastName: 'Bedoya',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'lhulst@silvateam.com',
            clicks: 20,
            opens: 5,
            company: 'Silvateam s.p.a.',
            firstName: 'Logan',
            lastName: 'Hulst',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'roelandpolet@ffcmail.com',
            clicks: 19,
            opens: 4,
            company: 'FutureFuel Chemical Company',
            firstName: 'Roeland',
            lastName: 'Polet',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'michaelthompson@ffcmail.com',
            clicks: 15,
            opens: 3,
            company: 'FutureFuel Chemical Company',
            firstName: 'Michael',
            lastName: 'Thompson',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'stacygunderman@ffcmail.com',
            clicks: 12,
            opens: 3,
            company: 'FutureFuel Chemical Company',
            firstName: 'Stacy',
            lastName: 'Gunderman',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'cgosser@fuillc.com',
            clicks: 12,
            opens: 1,
            company: 'Farmers Union Industries, LLC',
            firstName: 'Curt',
            lastName: 'Gosser',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'junaid@re-5.co.uk',
            clicks: 8,
            opens: 4,
            company: 'RE 5',
            firstName: 'Junaid',
            lastName: 'Arshad',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jrosa@calbioenergy.com',
            clicks: 8,
            opens: 3,
            company: 'calbioenergy',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              13
            ]
          },
          {
            email: 'gdouma@calbioenergy.com',
            clicks: 8,
            opens: 2,
            company: 'calbioenergy',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              13
            ]
          },
          {
            email: 'gerrit@oic.com',
            clicks: 7,
            opens: 6,
            company: 'OIC',
            firstName: 'Gerrit',
            lastName: 'Nicholas',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'meysam.mirarab@cemeng.ca',
            clicks: 6,
            opens: 3,
            company: 'CEM Engineering',
            firstName: 'Meysam',
            lastName: 'Mirarab',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'mmcbain@edeniq.com',
            clicks: 6,
            opens: 2,
            company: 'Edeniq, Inc.',
            firstName: 'Matt',
            lastName: 'McBain',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'nazar@oic.com',
            clicks: 5,
            opens: 3,
            company: 'OIC',
            firstName: 'Nazar',
            lastName: 'Massouh',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'tom@virescosolutions.com',
            clicks: 5,
            opens: 3,
            company: 'Viresco Solutions Inc.',
            firstName: 'Tom',
            lastName: 'Ogaranko',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'tspade@glaciallakesenergy.com',
            clicks: 5,
            opens: 2,
            company: 'Glacial Lakes Energy',
            firstName: 'Tim',
            lastName: 'Spade',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'anshul@biotownbiogas.com',
            clicks: 5,
            opens: 2,
            company: 'biotownbiogas',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              14
            ]
          },
          {
            email: 'jswartz@calbioenergy.com',
            clicks: 5,
            opens: 2,
            company: 'calbioenergy',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              14
            ]
          },
          {
            email: 'geoffreymather@nextenergyfuels.com',
            clicks: 4,
            opens: 11,
            company: 'Next Energy Fuels',
            firstName: 'Geoffrey',
            lastName: 'Mather',
            campaigns: 6,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9,
              13
            ]
          },
          {
            email: 'drew@oic.com',
            clicks: 4,
            opens: 8,
            company: 'OIC',
            firstName: 'Andrew',
            lastName: 'Karian',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'mperry@forestconcepts.com',
            clicks: 4,
            opens: 2,
            company: 'FOREST CONCEPTS',
            firstName: 'Michael',
            lastName: 'Perry',
            campaigns: 6,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9,
              13
            ]
          },
          {
            email: 'claude@lr3tech.com',
            clicks: 3,
            opens: 15,
            company: 'Agramarketing',
            firstName: 'Claude Luster III',
            lastName: '',
            campaigns: 8,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12,
              13
            ]
          },
          {
            email: 'tsnider@soy.org',
            clicks: 3,
            opens: 12,
            company: 'American Soybean Association',
            firstName: 'Tracy',
            lastName: 'Snider',
            campaigns: 6,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9,
              13
            ]
          },
          {
            email: 'cpayn@catalystgrp.com',
            clicks: 3,
            opens: 9,
            company: 'The Catalyst Group',
            firstName: 'Clyde',
            lastName: 'Payn',
            campaigns: 6,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9,
              13
            ]
          },
          {
            email: 'esant3@uky.edu',
            clicks: 3,
            opens: 9,
            company: 'University of Kentucky Center for Applied Energy Research',
            firstName: 'Eduardo',
            lastName: 'Santillan-Jimenez',
            campaigns: 6,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9,
              13
            ]
          },
          {
            email: 'greg.hall@petrogenium.com',
            clicks: 3,
            opens: 4,
            company: 'Petrogenium',
            firstName: 'Greg',
            lastName: 'Hall',
            campaigns: 6,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9,
              13
            ]
          },
          {
            email: 'genevieve.grainger@gmail.com',
            clicks: 3,
            opens: 3,
            company: 'gmail',
            firstName: '',
            lastName: '',
            campaigns: 1,
            emailAppearances: [
              14
            ]
          },
          {
            email: 'don_chapman@g3.ca',
            clicks: 3,
            opens: 2,
            company: 'G3 Global Grain Group',
            firstName: 'Don',
            lastName: 'Chapman',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'matt.leuck@neste.com',
            clicks: 3,
            opens: 2,
            company: 'Neste',
            firstName: 'Matt',
            lastName: 'Leuck',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'parts@vactron.com',
            clicks: 3,
            opens: 2,
            company: 'VA Consulting, Inc., now Stantec',
            firstName: 'Robin',
            lastName: 'Hayes',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jamie_denbow@g3.ca',
            clicks: 3,
            opens: 1,
            company: 'G3 Global Grain Group',
            firstName: 'Jamie',
            lastName: 'Denbow',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'cescami@ampolusa.com',
            clicks: 3,
            opens: 1,
            company: 'Ampol Refineries (QLD) Pty Ltd',
            firstName: 'Cathy',
            lastName: 'Escamilla',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'kevin.zhang@jupengbio.com',
            clicks: 2,
            opens: 17,
            company: 'Jupeng Bio, Inc.',
            firstName: 'Kevin',
            lastName: 'Zhang',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'saiphetk@westernp.com',
            clicks: 2,
            opens: 12,
            company: 'Western Pneumatics LLC',
            firstName: 'Saiphet',
            lastName: 'Khanthanhot',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'diana@ergbio.com',
            clicks: 2,
            opens: 9,
            company: 'Erg Bio',
            firstName: 'Diana',
            lastName: 'Gutierrez',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'kklavers@ecoengineers.us',
            clicks: 2,
            opens: 9,
            company: 'EcoEngineers',
            firstName: 'Kristine',
            lastName: 'Klavers',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'kwight@worldenergy.net',
            clicks: 2,
            opens: 8,
            company: 'World Energy, LLC',
            firstName: 'Kathleen',
            lastName: 'Wight',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'sally@capco2.solutions',
            clicks: 2,
            opens: 8,
            company: 'CapCO2 Solutions',
            firstName: 'Sally',
            lastName: 'Hart',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'pauloesterreich@strategicbiofuels.com',
            clicks: 2,
            opens: 7,
            company: 'Strategic Biofuels',
            firstName: 'Paul',
            lastName: 'Oesterreich',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'jaydip.bhadaliya@brayafuels.com',
            clicks: 2,
            opens: 7,
            company: 'Braya Renewable Fuels LP',
            firstName: 'Jaydip',
            lastName: 'Bhadaliya',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jrollins@phibro.com',
            clicks: 2,
            opens: 7,
            company: 'Phibro LLC',
            firstName: 'John',
            lastName: 'Rollins',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'tjrashaud@xemplarcarbon.com',
            clicks: 2,
            opens: 7,
            company: 'Xemplar Carbon & Capital',
            firstName: 'Tarique',
            lastName: 'Rashaud',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'corey.lavinsky@calumet.com',
            clicks: 2,
            opens: 6,
            company: 'Calumet',
            firstName: 'Corey',
            lastName: 'Lavinsky',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'morais@katzen.com',
            clicks: 2,
            opens: 6,
            company: 'KATZEN International, Inc.',
            firstName: 'Hugo',
            lastName: 'Morais',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'dlamond@kawarthaethanol.ca',
            clicks: 2,
            opens: 5,
            company: 'Kawartha Ethanol Inc.',
            firstName: 'Doug',
            lastName: 'Lamond',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'bb@go2-markets.com',
            clicks: 2,
            opens: 5,
            company: 'GO2-markets GmbH',
            firstName: 'Ben',
            lastName: 'Brimble',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'Geoff.fichtl@lanzajet.com',
            clicks: 2,
            opens: 3,
            company: 'LanzaJet',
            firstName: 'Geoff Fichtl',
            lastName: '',
            campaigns: 8,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12,
              13
            ]
          },
          {
            email: 'hubert@p2i2.ca',
            clicks: 2,
            opens: 3,
            company: 'P2i2 Consulting',
            firstName: 'Hubert',
            lastName: 'Piatkowski',
            campaigns: 6,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9,
              13
            ]
          },
          {
            email: 'madelyn.evans@borregaard.com',
            clicks: 2,
            opens: 3,
            company: 'Borregaard',
            firstName: 'Madelyn',
            lastName: 'Evans',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'kriley@clg.com',
            clicks: 2,
            opens: 2,
            company: 'CLG',
            firstName: 'Krystyna',
            lastName: 'Riley',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'tina@biochar.org',
            clicks: 2,
            opens: 2,
            company: 'American Biochar Institute',
            firstName: 'Tina',
            lastName: 'Metzer',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'alexandra.krus@calumetspecialty.com',
            clicks: 2,
            opens: 1,
            company: 'Calumet Specialty Products Partners',
            firstName: 'Alexandra',
            lastName: 'Krus',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'melissa@roslin.ca',
            clicks: 2,
            opens: 1,
            company: 'RNW Enterprises Inc.',
            firstName: 'Melissa',
            lastName: 'McDonald',
            campaigns: 8,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12,
              13
            ]
          },
          {
            email: 'menninojason@bfusa.com',
            clicks: 2,
            opens: 1,
            company: 'Bridgestone',
            firstName: 'Jason',
            lastName: 'Mennino',
            campaigns: 8,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12,
              13
            ]
          },
          {
            email: 'shandford@permolex.com',
            clicks: 2,
            opens: 1,
            company: 'Permolex Ltd.',
            firstName: 'Serena',
            lastName: 'Handford',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'ckleven@ndsoybean.org',
            clicks: 2,
            opens: 1,
            company: 'North Dakota Soybean Council',
            firstName: 'Craig',
            lastName: 'Kleven',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'daniela.ibanez@sanimax.com',
            clicks: 2,
            opens: 1,
            company: 'Sanimax',
            firstName: 'Daniela',
            lastName: 'Ibanez',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'eric@mercuriusbiorefining.com',
            clicks: 2,
            opens: 1,
            company: 'Mercurius Biorefining',
            firstName: 'Eric',
            lastName: 'Seck',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'speacock@arifractal.com',
            clicks: 2,
            opens: 1,
            company: 'ARi',
            firstName: 'Steve',
            lastName: 'Peacock',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'tpoole@grains.org',
            clicks: 2,
            opens: 1,
            company: 'U.S. Grains & BioProducts Council',
            firstName: 'Tom',
            lastName: 'Poole',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jdolezal@aztalanbio.com',
            clicks: 1,
            opens: 28,
            company: 'Aztalan Bio',
            firstName: 'Josh',
            lastName: 'Dolezal',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'ken@beachwayeco.com',
            clicks: 1,
            opens: 25,
            company: 'Beachway EcoSearch LLC',
            firstName: 'Ken Beach',
            lastName: '',
            campaigns: 8,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12,
              13
            ]
          },
          {
            email: 'michael.ainsworth@spectrumenergyusa.com',
            clicks: 1,
            opens: 15,
            company: 'Spectrum Energy',
            firstName: 'Michael',
            lastName: 'Ainsworth',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'tcesarek@bioveritas.com',
            clicks: 1,
            opens: 15,
            company: 'BioVeritas',
            firstName: 'Tim',
            lastName: 'Cesarek',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'ally.niphakis@srectrade.com',
            clicks: 1,
            opens: 14,
            company: 'Xpansiv Managed Solutions',
            firstName: 'Ally',
            lastName: 'Niphakis',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'kari@bioenergy-solutions.com',
            clicks: 1,
            opens: 12,
            company: 'BioEnergy-Solutions Inc.',
            firstName: 'Kari',
            lastName: 'McDonald',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'kmannas@canarybiofuels.com',
            clicks: 1,
            opens: 11,
            company: 'Canary Biofuels',
            firstName: 'Kavanagh',
            lastName: 'Mannas',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'dmilbrath@aztalanbio.com',
            clicks: 1,
            opens: 10,
            company: 'Aztalan Bio',
            firstName: 'Dawn',
            lastName: 'Milbrath',
            campaigns: 3,
            emailAppearances: [
              1,
              3,
              5
            ]
          },
          {
            email: 'jboughen@hdc.on.ca',
            clicks: 1,
            opens: 10,
            company: 'Hensall Co-op',
            firstName: 'Joel',
            lastName: 'Boughen',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'tvanriper@creamerenvironmental.com',
            clicks: 1,
            opens: 9,
            company: 'Creamer Environmental, Inc',
            firstName: 'Tim',
            lastName: 'Van Riper',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jzueger@harvestonelcp.com',
            clicks: 1,
            opens: 8,
            company: 'Midwest AgEnergy',
            firstName: 'Jeff',
            lastName: 'Zueger',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'mstratton@harvestonelcp.com',
            clicks: 1,
            opens: 8,
            company: 'Midwest AgEnergy',
            firstName: 'Marc',
            lastName: 'Stratton',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'rejean.pare@remabec.com',
            clicks: 1,
            opens: 8,
            company: 'Gestion Rémabec Inc',
            firstName: 'Rejean',
            lastName: 'Pare',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'ryanr@huskerag.com',
            clicks: 1,
            opens: 8,
            company: 'Husker Ag LLC',
            firstName: 'Ryan',
            lastName: 'Reestman',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'shayden@americangreenfuels.com',
            clicks: 1,
            opens: 8,
            company: 'American Greenfuels LLC',
            firstName: 'Sean',
            lastName: 'Hayden',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'cintrater@tidewatermidstream.com',
            clicks: 1,
            opens: 8,
            company: 'Tidewater Midstream and Infrastructure',
            firstName: 'Collin',
            lastName: 'Intrater',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'krai@covercress.com',
            clicks: 1,
            opens: 8,
            company: 'CoverCress Inc.',
            firstName: 'Krishan',
            lastName: 'Rai',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'ajohns@cgf.com',
            clicks: 1,
            opens: 7,
            company: 'HoneyBadger Charging',
            firstName: 'Andrew',
            lastName: 'Johns',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'davidd@huskerag.com',
            clicks: 1,
            opens: 7,
            company: 'Husker Ag LLC',
            firstName: 'David',
            lastName: 'Dolan',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'Kristie.Armstrong@ergon.com',
            clicks: 1,
            opens: 6,
            company: 'Ergon Refinery',
            firstName: 'Kristie Armstrong',
            lastName: '',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'virginia@blueridgebiofuels.com',
            clicks: 1,
            opens: 6,
            company: 'Blue Ridge Biofuels',
            firstName: 'Virginia',
            lastName: 'Bennett',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'darren@chemcal.com',
            clicks: 1,
            opens: 6,
            company: 'ChemCal',
            firstName: 'Patty',
            lastName: 'Dumler',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 's.kim@xcf.global',
            clicks: 1,
            opens: 6,
            company: 'XCF Global',
            firstName: 'Si-Yeon',
            lastName: 'Kim',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jmcisaac@clearbluemarkets.com',
            clicks: 1,
            opens: 5,
            company: 'ClearBlue Markets',
            firstName: 'Jennifer',
            lastName: 'McIsaac',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'kyle@badgercharging.ca',
            clicks: 1,
            opens: 5,
            company: 'HoneyBadger Charging',
            firstName: 'Kyle',
            lastName: 'Ng',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'dwilson@mrbfuels.com',
            clicks: 1,
            opens: 5,
            company: 'Midwest Renewable Biofuels, Inc.',
            firstName: 'Dan',
            lastName: 'Wilson',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jcc@nacero.co',
            clicks: 1,
            opens: 5,
            company: 'Nacero Inc.',
            firstName: 'John',
            lastName: 'Coffin',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'natalie@lcfcoalition.com',
            clicks: 1,
            opens: 5,
            company: 'Low Carbon Fuels Coalition',
            firstName: 'Natalie',
            lastName: 'Burdick',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'zohrab@refuelthefuture.com',
            clicks: 1,
            opens: 4,
            company: 'Refuel Energy Inc',
            firstName: 'Zohrab',
            lastName: 'Mawani',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'pjolley@2bfueled.com',
            clicks: 1,
            opens: 4,
            company: '2BFueled LLC',
            firstName: 'Peter',
            lastName: 'Jolley',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'tori_brooks@treeimprovement.org',
            clicks: 1,
            opens: 4,
            company: 'Tree Improvement Program',
            firstName: 'Tori',
            lastName: 'Brooks',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'lauren@synergyenterprises.ca',
            clicks: 1,
            opens: 3,
            company: 'Synergy Enterprises',
            firstName: 'Lauren',
            lastName: 'Duffield',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'jim.thorn@grace.com',
            clicks: 1,
            opens: 3,
            company: 'W. R. Grace',
            firstName: 'Jim',
            lastName: 'Thorn',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'manu@carbonbridge.io',
            clicks: 1,
            opens: 3,
            company: 'CarbonBridge',
            firstName: 'Manu',
            lastName: 'Pillai',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'rod.kux@takachar.com',
            clicks: 1,
            opens: 3,
            company: 'Takachar',
            firstName: 'Rod',
            lastName: 'Kux',
            campaigns: 6,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9,
              13
            ]
          },
          {
            email: 'stacy@carbon180.org',
            clicks: 1,
            opens: 3,
            company: 'Carbon180',
            firstName: 'Stacy',
            lastName: 'Aguilera-Peterson',
            campaigns: 3,
            emailAppearances: [
              2,
              4,
              6
            ]
          },
          {
            email: 'tracydwilson@besheanwe.com',
            clicks: 1,
            opens: 3,
            company: 'Bes Health and Wellness',
            firstName: 'Tracy',
            lastName: 'Wilson',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'zowyang@tierrabiosciences.com',
            clicks: 1,
            opens: 3,
            company: 'Revr',
            firstName: 'Zach',
            lastName: 'Owyang',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'achandra@grains.org',
            clicks: 1,
            opens: 2,
            company: 'US Grains Council',
            firstName: 'Ankit Chandra',
            lastName: '',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'pat.adams@pagrain.com',
            clicks: 1,
            opens: 2,
            company: 'Pennsylvania Grain Processing, LLC',
            firstName: 'Patrick',
            lastName: 'Adams',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'araines@restorationbio.com',
            clicks: 1,
            opens: 2,
            company: 'Restoration Bioproducts, LLC',
            firstName: 'Andy',
            lastName: 'Raines',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'avillaluenga@etasca.com',
            clicks: 1,
            opens: 2,
            company: 'etasca',
            firstName: 'Antonio',
            lastName: 'Villaluenga',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'bjordan@gpisd.net',
            clicks: 1,
            opens: 2,
            company: 'Great Plains Institute',
            firstName: 'Brendan',
            lastName: 'Jordan',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jose.urdaz@iica.int',
            clicks: 1,
            opens: 2,
            company: 'Instituto Interamericano de Cooperación para la Agricultura (IICA)',
            firstName: 'Jose',
            lastName: 'Urdaz',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'mahir.alrashdan@calumetspecialty.com',
            clicks: 1,
            opens: 2,
            company: 'Calumet',
            firstName: 'Maher',
            lastName: 'Alrashdan',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'michael.wiedmaier@icmbiofuels.com',
            clicks: 1,
            opens: 2,
            company: 'ICM BIOFUELS, LLC',
            firstName: 'Michael',
            lastName: 'Wiedmaier',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'pirouz@nanostrip.tech',
            clicks: 1,
            opens: 2,
            company: 'NanoStrip',
            firstName: 'Pirouz',
            lastName: 'Kiani',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'ryan.tatton@teamapex.com',
            clicks: 1,
            opens: 2,
            company: 'Apex Water and Process',
            firstName: 'Ryan',
            lastName: 'Tatton',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'steve@sdcenerserve.com',
            clicks: 1,
            opens: 2,
            company: 'SDC Enerserve Solutions',
            firstName: 'Steve',
            lastName: 'Dorcheus',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'cathi.pelelo@plymouthenergyllc.com',
            clicks: 1,
            opens: 1,
            company: 'Plymouth Energy, LLC',
            firstName: 'Cathi',
            lastName: 'Pelelo',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'cguillon@stormfisher.com',
            clicks: 1,
            opens: 1,
            company: 'StormFisher',
            firstName: 'Chris',
            lastName: 'Guillon',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'gpitches@consolidatedbiofuels.net',
            clicks: 1,
            opens: 1,
            company: 'Consolidated Biofuels',
            firstName: 'Graeme',
            lastName: 'Pitches',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'jlapish@thumbbioenergy.com',
            clicks: 1,
            opens: 1,
            company: 'Thumb BioEnergy',
            firstName: 'Jenyfer',
            lastName: 'Lapish',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'karen_duckworth@transalta.com',
            clicks: 1,
            opens: 1,
            company: 'TransAlta',
            firstName: 'Karen',
            lastName: 'Duckworth',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'shazia@slgrain.com',
            clicks: 1,
            opens: 1,
            company: 'Grain St Laurent',
            firstName: 'Shazia',
            lastName: 'Nanjijuma',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'solszewski@aceethanol.com',
            clicks: 1,
            opens: 1,
            company: 'Ace Ethanol',
            firstName: 'Sue',
            lastName: 'Olszewski',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'troyb@ncpllc.net',
            clicks: 1,
            opens: 1,
            company: 'Nebraska Corn Processing, LLC',
            firstName: 'Troy',
            lastName: 'Bose',
            campaigns: 7,
            emailAppearances: [
              1,
              3,
              5,
              8,
              10,
              11,
              12
            ]
          },
          {
            email: 'artiom.loginov@cratos.de',
            clicks: 1,
            opens: 1,
            company: 'Cratos Can Inc.',
            firstName: 'Artiom',
            lastName: 'Loginov',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'bjensen@edmontonglobal.ca',
            clicks: 1,
            opens: 1,
            company: 'Edmonton Global',
            firstName: 'Brent',
            lastName: 'Jensen',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'cassandra.seitz@edged.us',
            clicks: 1,
            opens: 1,
            company: 'Edged',
            firstName: 'Cassandra',
            lastName: 'Seitz',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'clark@whinfellcap.com',
            clicks: 1,
            opens: 1,
            company: 'Whinfell',
            firstName: 'Clark',
            lastName: 'Thornburgh',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'cory.busby@crimsonrenewable.com',
            clicks: 1,
            opens: 1,
            company: 'Crimson Renewable Energy',
            firstName: 'Cory',
            lastName: 'Busby',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'james.piche@herculift.com',
            clicks: 1,
            opens: 1,
            company: 'Herc-U-Lift, Inc.',
            firstName: 'James',
            lastName: 'Piche',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'jon@provectusbiofuels.com',
            clicks: 1,
            opens: 1,
            company: 'Provectus Biofuels',
            firstName: 'Jon',
            lastName: 'Jaque',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'kalthoff@equinox8.com',
            clicks: 1,
            opens: 1,
            company: 'Equinox LLC',
            firstName: 'Kyle',
            lastName: 'Althoff',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'victor@bioeconomysolutions.com',
            clicks: 1,
            opens: 1,
            company: 'BioEconomy Solutions',
            firstName: 'Victor',
            lastName: 'Garlington',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          },
          {
            email: 'iahmed@aurisbioenergy.com',
            clicks: 1,
            opens: 0,
            company: 'Avalon Energy Group LLC',
            firstName: 'Irshad',
            lastName: 'Ahmed',
            campaigns: 5,
            emailAppearances: [
              2,
              4,
              6,
              7,
              9
            ]
          }
        ],
        hotLeadsCount: 188,
        allLeadsCount: 3681
      },
  },
};

// Peterson Solutions Argentina · m10 — generado con scripts/mailchimp-to-seed.mjs
EMAIL_DB['psar'] = {
  name: 'Peterson Solutions Argentina',
  periods: {
    'm10': {
        campaignName: 'Newsletter general · Octubre 2026',
        emails: [
          {
            name: 'Email 1',
            subject: '',
            metrics: {
              sent: 738,
              uniqueOpens: 128,
              uniqueClicks: 3,
              totalOpens: 187,
              totalClicks: 15,
              openRate: 17.34,
              clickRate: 0.41,
              ctor: 2.34
            }
          },
          {
            name: 'Email 2',
            subject: '',
            metrics: {
              sent: 663,
              uniqueOpens: 124,
              uniqueClicks: 2,
              totalOpens: 175,
              totalClicks: 13,
              openRate: 18.7,
              clickRate: 0.3,
              ctor: 1.61
            }
          }
        ],
        totals: {
          emailCount: 2,
          totalSent: 1401,
          totalDelivered: 1401,
          totalOpens: 252,
          totalClicks: 5,
          totalBounces: null,
          totalUnsubs: null,
          openRate: 17.99,
          clickRate: 0.36,
          ctor: 1.98,
          bounceRate: null,
          unsubRate: null
        },
        comparison: [
          {
            name: 'Email 1',
            aperturas: 17.3,
            clics: 0.4,
            ctor: 2.3
          },
          {
            name: 'Email 2',
            aperturas: 18.7,
            clics: 0.3,
            ctor: 1.6
          }
        ],
        hotLeads: [
          {
            email: 'jalegre@silvateam.com',
            clicks: 24,
            opens: 2,
            company: 'Silvateam',
            firstName: 'Jorgelina',
            lastName: 'Alegre',
            campaigns: 2,
            emailAppearances: [
              1,
              2
            ]
          },
          {
            email: 'stramon@emiliana.cl',
            clicks: 2,
            opens: 1,
            company: 'Emiliana',
            firstName: 'Sebastian',
            lastName: 'Tramon',
            campaigns: 2,
            emailAppearances: [
              1,
              2
            ]
          },
          {
            email: 'vbustamante@scanntech.com',
            clicks: 1,
            opens: 2,
            company: 'Scann tech',
            firstName: 'Veronica',
            lastName: 'Bustamante',
            campaigns: 2,
            emailAppearances: [
              1,
              2
            ]
          },
          {
            email: 'mvmedina@oca.com.ar',
            clicks: 1,
            opens: 1,
            company: 'OCA',
            firstName: 'Marcelo',
            lastName: 'Medina',
            campaigns: 2,
            emailAppearances: [
              1,
              2
            ]
          }
        ],
        hotLeadsCount: 4,
        allLeadsCount: 738
      },
  },
};

export const EMAIL_CLIENTS = Object.entries(EMAIL_DB).map(([id, v]) => ({ id, name: v.name }));

// Períodos (meses) presentes en el seed, en el orden canónico de MONTHS_2026.
export function emailPeriodsPresent() {
  const present = new Set();
  Object.values(EMAIL_DB).forEach((acc) => {
    Object.keys(acc.periods || {}).forEach((p) => present.add(p));
  });
  return MONTHS_2026.filter((m) => present.has(m.id));
}
