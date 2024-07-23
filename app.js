const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');
require('dotenv').config(); // Correctly invoking dotenv configuration

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

const path = require("path");
const fs = require("fs");

// DECLARACIONES PATH/OBJECTS //
const menuPath = path.join(__dirname, "mensajes", "menu.txt");
const menu = fs.readFileSync(menuPath, "utf-8");

const cuentasPath = path.join(__dirname, "mensajes", "cuentas.txt");
const cuentas = fs.readFileSync(cuentasPath, "utf-8");

const carteraPath = path.join(__dirname, "mensajes", "cartera.txt");
const cartera = fs.readFileSync(carteraPath, "utf-8");

const resultadosPath = path.join(__dirname, 'mensajes', 'resultados.txt');
const resultados = fs.readFileSync(resultadosPath, 'utf-8');

// DECLARACIONES FLOW E INFO //
// FLOW PRINCIPAL
const flowPrincipal = addKeyword(['hola', 'ole', 'alo', 'Hola', 'Buenas'])
    .addAnswer('Gracias por comunicarse con el Dr. Baralt')
    .addAnswer('En estos momentos no podemos atender su mensaje, a la mayor brevedad posible lo haremos, Dios mediante.')
    .addAnswer([
        '🚫 No se hacen consultas medicas por esta vía,',
        '🚫 No lectura de resultados ni recetamos por WhatsApp',
        '✅ Si es paciente del Doctor y tiene una urgencia y debe comunicarse con el directamente, por favor llame al *809-775-8194*.',
        '🔔 El doctor llega a la consulta a partir de las 10:00 AM',
        '*Dios le bendiga*'
    ])
    .addAnswer('Para más información, por favor, escriba: *Menú*.');

// OPCION 1 DEL MENU - AGENDAR CITAS //
const flowCuenta = addKeyword(['1'])
    .addAnswer('Si desea agendar una cita debe realizar el pago de la consulta a una de nuestras cuentas.')
    .addAnswer('Para continuar, escriba *Ok*', { capture: true }, (ctx, { fallBack }) => {
        if (!ctx.body.toLowerCase().includes('ok')) {
            return fallBack();
        }
        console.log('Mensaje entrante:', ctx.body);
    })
    .addAnswer('Enviando Cuentas Bancarias (BHD, Popular, Banreservas).')
    .addAnswer('Responda *"cuentas"* para continuar', { capture: true }, (ctx, { fallBack }) => {
        if (!ctx.body.toLowerCase().includes('cuentas')) {
            return fallBack();
        }
        console.log('Mensaje entrante:', ctx.body);
    });

// FLOW DE CUENTAS //
const flowCuentasB = addKeyword(['cuentas', '1'])
    .addAnswer([
        "BANRESERVAS",
        '*Cuenta de Ahorros*',
        'NO. 9605876089',
        'Natalia Guerrero',
        '001-1164182-5'
    ])
    .addAnswer("Por favor, debe responder este mensaje con una captura de pantalla de la transacción completada con el *MONTO TOTAL DE LA CONSULTA*", { capture: true }, (ctx, { fallBack }) => {
        if (!ctx.message?.imageMessage) {
            return fallBack();
        }
        console.log('Mensaje entrante:', ctx.body);
    })
    .addAnswer(['Captura recibida ✅ ',
        'Por favor, envíenos su nombre completo y qué seguro médico utiliza.',
        'Por ejemplo: *Maria Gonzalez Perez, Seguro Senasa*'
    ]);

// Add similar setup for flowCuentasBHD and flowCuentasP here
//...

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

// Define other flow variables here (flowServ, flowPap, etc.)

const menuFlow = addKeyword(['menu', 'Menu', 'Menú']).addAnswer(
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
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowPrincipal, menuFlow, flowDuda, flowCuenta, flowOtro, flowReceta, cuentasFlow, flowCuentasB, flowCuentasBHD, flowCuentasP, flowServ]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
}

main();
