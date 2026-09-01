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
//
//  Mientras no haya datos reales importados, EMAIL_DB queda vacío y la
//  vista muestra "Sin información suficiente" (regla de honestidad).
// ════════════════════════════════════════════════════════════════

import { MONTHS_2026 } from '@/constants/periods';

// { [accountId]: { name, handle?, periods: { [periodId]: <campaña> } } }
export const EMAIL_DB = {};

// CU + PS Latinoamérica · m08 — generado con scripts/mailchimp-to-seed.mjs
// (allLeads omitido del bundle: solo se usa hotLeads en la vista)
EMAIL_DB['cups'] = {
  name: "CU + PS Latinoamérica",
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


// Cuentas derivadas del seed (vacío hasta el primer import real).
export const EMAIL_CLIENTS = Object.entries(EMAIL_DB).map(([id, v]) => ({ id, name: v.name }));

// Períodos (meses) presentes en el seed, en el orden canónico de MONTHS_2026.
export function emailPeriodsPresent() {
  const present = new Set();
  Object.values(EMAIL_DB).forEach((acc) => {
    Object.keys(acc.periods || {}).forEach((p) => present.add(p));
  });
  return MONTHS_2026.filter((m) => present.has(m.id));
}
