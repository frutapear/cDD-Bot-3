const  {createBot, createProvider, createFlow, addKeyword, EVENTS}  = require('@bot-whatsapp/bot')
require('dotenv').config();

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')


const path = require("path")
const fs = require("fs")


//DECLARACIONES PATH/OBJECTS//
const menuPath = path.join(__dirname, "mensajes", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf-8")

const cuentasPath = path.join(__dirname, "mensajes", "cuentas.txt")
const cuentas = fs.readFileSync(cuentasPath, "utf-8")

const carteraPath = path.join(__dirname, "mensajes", "cartera.txt")
const cartera = fs.readFileSync(carteraPath, "utf-8")

const resultadosPath = path.join(__dirname, 'mensajes', 'resultados.txt')
const resultados = fs.readFileSync(resultadosPath, 'utf-8')

//DECLARACIONES FLOW E INFO//
//FLOW PRINCIPAL
const flowPrincipal = addKeyword(['hola', 'ole', 'alo', 'Hola', 'Buenas tardes', 'buenos dias', 'buenas noches', 'buen dia', 'Buen dia', 'Buenas noches', 'Buenos dias', 'buenas tardes', 'saludos'])
    .addAnswer('Gracias por comunicarse con el Dr. Baralt')
    .addAnswer('En estos momentos no podemos atender su mensaje, a la mayor brevedad posible lo haremos, Dios mediante.')
    .addAnswer([
        '🚫 No se hacen consultas medicas por esta vía,',
        '🚫 No lectura de resultados ni recetamos por WhatsApp',
        '✅ Si es paciente del Doctor y tiene una urgencia y debe comunicarse con el directamente, por favor llame al *809-775-8194*.',
        '🔔 El doctor llega a la consulta a partir de las 10:00 AM',
        '*Dios le bendiga*'
    ])
    .addAnswer('Para mas informacion, por favor, escriba: *Menú*.')


//OPCION 1 DEL MENU - AGENDAR CITAS//
const flowCuenta = addKeyword(EVENTS.ACTION)
    .addAnswer('Si desea agendar una cita debe realizar el pago de la consulta a una de nuestras cuentas.')
    .addAnswer ('Para continuar, escriba *Ok*', {capture:true}, (ctx, {fallBack}) => {
      if (!ctx.body.toLowerCase().includes('ok')) {
          return fallBack();
      }
      console.log('Mensaje entrante:', ctx.body);
    })
    .addAnswer('Enviando Cuentas Bancarias (BHD, Popular, Banreservas).')
    .addAnswer('Responda *"cuentas"* para continuar', {capture:true}, (ctx, {fallBack}) => {
      if (!ctx.body.toLowerCase().includes('cuentas')) {
          return fallBack();
      }
      console.log('Mensaje entrante:', ctx.body);
    })

//FLOW DE CUENTAS//
const flowCuentasB = addKeyword (EVENTS.ACTION)
.addAnswer(["BANRESERVAS",
  '*Cuenta de Ahorros*',
  'NO. 9605876089',
  'Natalia Guerrero',
  '001-1164182-5'
])
.addAnswer("Por favor, debe responder este mensaje con una captura de pantalla de la transaccion completada con el *MONTO TOTAL DE LA CONSULTA*", {capture:true}, (ctx, {fallBack}) => {
  if (!ctx.message?.imageMessage) {
      return fallBack();
  }
  console.log('Mensaje entrante:', ctx.body);
})
.addAnswer("Captura recibida ✅")
.addAnswer('Por favor, envienos su nombre completo y que seguro medico utiliza.')
.addAnswer('Escribalo en el siguiente formato: *Nombre: Maria Gonzalez Perez, Seguro: Senasa*', {capture:true}, (ctx, {fallBack}) => {
  if (!ctx.body.toLowerCase().includes('nombre')) {
      return fallBack();
  }
  console.log('Mensaje entrante:', ctx.body);
}) 
.addAnswer("Cita Agendada con Exito ✅, Muchas gracias. Dios le bendiga.")
.addAnswer("Nuestro horario es de 8AM-5PM, el Doctor llega a partir de las 10:00 AM, para volver al menu principal, escriba 'menu'")


const flowCuentasBHD = addKeyword (EVENTS.ACTION)
.addAnswer(["Banco BHD",
  '*Cuenta de Ahorros*',
  'NO. 32385280010',
  'Gabriela Hinojosa',
  '402-3246-332-9'
])
.addAnswer("Por favor, debe responder este mensaje con una captura de pantalla de la transaccion completada con el *MONTO TOTAL DE LA CONSULTA*", {capture:true}, (ctx, {fallBack}) => {
  if (!ctx.message?.imageMessage) {
      return fallBack();
  }
  console.log('Mensaje entrante:', ctx.body);
})

.addAnswer("Captura recibida ✅")
.addAnswer('Por favor, envienos su nombre completo y que seguro medico utiliza.')
.addAnswer('Escribalo en el siguiente formato: *Nombre: Maria Gonzalez Perez, Seguro: Senasa*', {capture:true}, (ctx, {fallBack}) => {
  if (!ctx.body.toLowerCase().includes('nombre')) {
      return fallBack();
  }
  console.log('Mensaje entrante:', ctx.body);
}) 

.addAnswer("Cita Agendada con Exito ✅, Muchas gracias. Dios le bendiga.")
.addAnswer("Nuestro horario es de 8AM-5PM, el Doctor llega a partir de las 10:00 AM, para volver al menu principal, escriba 'menu'")

const flowCuentasP = addKeyword (EVENTS.ACTION)
.addAnswer(["Banco Popular",
  '*Cuenta de Ahorros*',
  'NO. 809370745',
  'Julio F. Baralt',
  '001-0720802-7'
])
.addAnswer("Por favor, debe responder este mensaje con una captura de pantalla de la transaccion completada con el *MONTO TOTAL DE LA CONSULTA*", {capture:true}, (ctx, {fallBack}) => {
  if (!ctx.message?.imageMessage) {
      return fallBack();
  }
  console.log('Mensaje entrante:', ctx.body);
})

.addAnswer("Captura recibida ✅")
.addAnswer('Por favor, envienos su nombre completo y que seguro medico utiliza.')
.addAnswer('Escribalo en el siguiente formato: *Nombre: Maria Gonzalez Perez, Seguro: Senasa*', {capture:true}, (ctx, {fallBack}) => {
  if (!ctx.body.toLowerCase().includes('nombre')) {
      return fallBack();
  }
  console.log('Mensaje entrante:', ctx.body);
}) 

.addAnswer("Cita Agendada con Exito ✅, Muchas gracias. Dios le bendiga.")
.addAnswer("Nuestro horario es de 8AM-5PM, el Doctor llega a partir de las 10:00 AM, para volver al menu principal, escriba 'menu'")

 const cuentasFlow = addKeyword(['cuentas']).addAnswer(
     cuentas,
      { capture: true },
      async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1", "2", "3"].includes(ctx.body)) {
          return fallBack(
            "Respuesta no válida, por favor selecciona una de las opciones."
          );
        }
        switch (ctx.body) {
          case "1":
            return gotoFlow(flowCuentasB);
          case "2":
            return gotoFlow(flowCuentasBHD);
          case "3":
            return gotoFlow(flowCuentasP);
          case "0":
            return await flowDynamic(
              "Saliendo... Puedes volver a acceder al menú escribiendo *menu*"
            );
        }
      }
  );
  


//OPCION 2 DEL MENU / SERVICIOS //
const flowServ = addKeyword(EVENTS.ACTION).addAnswer(
    cartera,
     { capture: true })

//OPCION 3 DEL MENU / RESULTADOS PAP/BIOPSIA//
const flowPap = addKeyword(EVENTS.ACTION).addAnswer(
  resultados,
   { capture: true })

//OPCION 4 DEL MENU / DUDAS SOBRE UN TRATAMIENTO//
const flowDuda = addKeyword(EVENTS.ACTION)
    .addAnswer('Si tiene dudas sobre su tratamiento, llame *directamente* al +18097758194, gracias.');

//OPCIOM 5 DEL MENU / CAMBIOS EN LA RECETA//
const flowReceta = addKeyword(EVENTS.ACTION)
    .addAnswer('Si requiere de cambios en la receta o necesita una licencia medica, por favor, llamar al 8096225457, *Lunes* a *Viernes* de 8:00AM a 5:00PM, gracias.');

//OPCION 6 DEL MENU / EMBARAZADA//
const flowEmb = addKeyword(EVENTS.ACTION)
    .addAnswer('Si tiene alguna emergencia, llame *directamente* al +18097758194 o al +18297927117, gracias.');

//OPCIOM 7 DEL MENU / OTRO//
const flowOtro = addKeyword(EVENTS.ACTION)
    .addAnswer('Gracias por comunicarse con el Dr. Baralt, en caso de necesitar mas informacion, por favor, llamar al 8096225457, *Lunes* a *Viernes* de 8:00AM a 5:00PM, gracias.');

const menuFlow = addKeyword(['menu','Menu','Menú']).addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
      if (!["1", "2", "3", "4", "5", "6", "7", "0"].includes(ctx.body)) {
        return fallBack(
          "Respuesta no válida, por favor selecciona una de las opciones."
        );
      }
      switch (ctx.body) {
        case "1":
          return gotoFlow(flowCuenta);
        case "2":
          return gotoFlow(flowServ);
        case "3":
          return gotoFlow(flowPap);
        case "4":
          return gotoFlow(flowDuda);
        case "5":
          return gotoFlow(flowReceta);
        case "6":
          return gotoFlow(flowEmb);
        case "7":
            return gotoFlow(flowOtro);
        case "0":
          return await flowDynamic(
            "Saliendo... Puedes volver a acceder a este menú escribiendo *menu*"
          );
      }
    }
);

const main = async () => {
    const adapterDB = new MockAdapter
    const adapterFlow = createFlow([flowPrincipal, menuFlow, flowDuda, flowCuenta, flowOtro, flowReceta, cuentasFlow, flowCuentasB, flowCuentasBHD, flowCuentasP, flowServ, flowEmb, flowPap])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
