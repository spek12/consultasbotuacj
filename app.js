require('dotenv-extended').load();


//Librerias
var builder = require('botbuilder');
var restify = require('restify');
const https = require('https');


//crear connector de chat, msg, skype, etc
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//Creo el bot
var bot = new builder.UniversalBot(connector);

// Crearmos el servidor
var server =restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listen to %s', server.name, server.url);

});
server.post('/api/messages', connector.listen());

//Conexion de LUIS
const recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b16a8333-baae-4f8e-bf19-c80bb30c8ee8?subscription-key=1b32aced334346dcb4d40613fac774fe&timezoneOffset=-420&verbose=true&q=');
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

//Creamos raiz de dialogo con LUIS
bot.dialog('/', intents) 
.endConversationAction(
    "endPizza", "Ok. Gracias por utilizar este bot.",
    {
        matches: /^-goodbye$|^adios$|^bye$/i,
        confirmPrompt: "Esto terminara la conversacion. Estas seguro?"
    }
)



//Dialogo de ayuda
bot.dialog('help', function (session, args, next) {
    session.endDialog("Este bot te ayudara a resolver dudas presentes en la Pagina de la UACJ, asi como del tablero de la UACJ.");
})
.triggerAction({
    matches: /^-help$/i,
});






//Dialogo de saluar con LUIS
intents.matches('Saludar', [
    function (session) {
    session.send('Hola, Bienvenido a ConsultasBOTUACJ, donde te ayudare a resolver dudas que presentes.');
    session.beginDialog('nombre');
    },
    function (session, results) {
        session.dialogData.nombre = results.response;
        session.send("Gracias %s, Con cual duda te puedo ayudar hoy?",session.dialogData.nombre );
        session.endDialog();
    
    }
    
]);


//Dialogo de contrasena bot con LUIS
intents.matches('Contrasena', [function (session, args, next) {
    const contrasena = ['restablecer', 'cambiar'];
    const entidadcontrasena = builder.EntityRecognizer.findEntity(args.entities, 'Contrasena');


    if(entidadcontrasena.entity.match(/^restablecer$|^restablezco$|^restablesco$|^restablecerla|^resetear$|^ressetar$/i)){
         session.send("Claro, para restablecer tu contraseña, solo sigue los siguientes pasos: <br/>  1.- <br/> 2.-");
         var msg = new builder.Message(session)
            .text("Espera un momento.....")
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i66.tinypic.com/1zx08pk.png"
            }]);
              session.endDialog(msg);
            }
        

    else if(entidadcontrasena.entity.match(/^cambiar$|^cambio$|^cambiarla/i)){
             session.send("Claro, para cambiar tu contraseña, solo sigue los siguientes pasos: <br/>  1.- <br/> 2.-");
             var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i63.tinypic.com/210zts4.png",
            }]);
              session.endDialog(msg);

            
        }

     else if(entidadcontrasena.entity){
        builder.Prompts.choice(session, 'Ahora mismo tenemos estas opciones para la contrasena?', contrasena,{listStyle: builder.ListStyle.button});
          }
}, function (session, results) {
    if (results.response) {
        if(results.response.entity.match(/^restablecer$/i)){
         session.send("Claro, para restablecer tu contraseña, solo sigue los siguientes pasos: <br/>  1.- <br/> 2.-");
       var msg = new builder.Message(session)
            .text("Espera un momento.....")
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i66.tinypic.com/1zx08pk.png"
            }]);
              session.endDialog(msg);
            }
        }
         else if(results.response.entity.match(/^cambiar$/i)){
             session.send("Claro, para cambiar tu contraseña, solo sigue los siguientes pasos: <br/>  1.- <br/> 2.-");
             var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i63.tinypic.com/210zts4.png",
            }]);
              session.endDialog(msg);
        }
}
]);




//Dialogo de como estas bot con LUIS
intents.matches('Estado', function (session) {
    session.send("Me siento estupendamente. Me encanta resolver dudas. ¿Tiene alguna pregunta para mí?");
});




//Dialogo por default
intents.onDefault(builder.DialogAction.send('No he entendido lo que quieres decir, prueba de nuevo'));






//Dialogo de nombre
bot.dialog('nombre', [
    function (session) {
        builder.Prompts.text(session, "Cual es tu nombre?.");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);







//Dialogo de contrasena bot con LUIS
intents.matches('Horario', [function (session, args, next) {
    const institutos = ['IIT', 'ICSA', 'ICB', 'CU', 'IADA','Rectoria'];
    const entidadinstitutos = builder.EntityRecognizer.findEntity(args.entities, 'Instituto');
    session.send('Espera un momento....');


    if(entidadinstitutos.entity.match(/^IIT$|^ingenieria$|^ingeneria$/i)){
         session.send('El Instituto de Ingeneria y Tecnologia')

         var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i64.tinypic.com/2hz23vo.png",
            }]);
              session.endDialog(msg);
        }

    else if(entidadinstitutos.entity.match(/^ICSA$|^sociales$/i)){
             session.send("El Instituto de Ciencias Sociales y Administracion")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i67.tinypic.com/4hcky9.png",
            }]);
              session.endDialog(msg);
        }
         
         else if(entidadinstitutos.entity.match(/^ICB$|^biomedicas$|^biomedico$/i)){
             session.send("El Instituto de Ciencias Biomedicas")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i63.tinypic.com/ehire8.png",
            }]);
              session.endDialog(msg);
        }

        else if(entidadinstitutos.entity.match(/^CU$|^universitaria$/i)){
             session.send("La ciudad universitaria")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i65.tinypic.com/1233ztg.png",
            }]);
              session.endDialog(msg);
        }

        else if(entidadinstitutos.entity.match(/^IADA$|^arte$|^diseño$/i)){
             session.send("El Instituto de Artes y Diseno")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i67.tinypic.com/xlhv92.png",
            }]);
              session.endDialog(msg);
        }
        else if(entidadinstitutos.entity.match(/^rectoria$|^Rectoria$|^recto$/i)){
             session.send("Rectoria")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i65.tinypic.com/20r4a9x.png",
            }]);
              session.endDialog(msg);
        }
     else if(entidadinstitutos.entity){
        builder.Prompts.choice(session, 'Ahora mismo tenemos estas opciones para la contrasena?', institutos,{listStyle: builder.ListStyle.button});
          }
}, function (session, results) {
    if (results.response) {
        if(results.response.entity.match(/^IIT$/i)){
          session.send('El Instituto de Ingeneria y Tecnologia')
            var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i64.tinypic.com/2hz23vo.png",
            }]);
              session.endDialog(msg);
        }
         else if(results.response.entity.match(/^ICSA$/i)){
             session.send("El Instituto de Ciencias Sociales y Administracion")
                var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i67.tinypic.com/4hcky9.png",
            }]);
              session.endDialog(msg);
             
        }
        else if(results.response.entity.match(/^ICB$/i)){
             session.send("El Instituto de Ciencias Biomedicas")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i63.tinypic.com/ehire8.png",
            }]);
              session.endDialog(msg);
        }
        else if(results.response.entity.match(/^IADA$/i)){
             session.send("El Instituto de Arte y Diseno")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i67.tinypic.com/xlhv92.png",
            }]);
              session.endDialog(msg);
        }
        else if(results.response.entity.match(/^CU$/i)){
             session.send("La ciudad Universitaria")
              session.send("La ciudad universitaria")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i65.tinypic.com/1233ztg.png",
            }]);
              session.endDialog(msg);
        }
        else if(results.response.entity.match(/^Rectoria$/i)){
             session.send("Rectoria")
               session.send("Rectoria")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i65.tinypic.com/20r4a9x.png",
            }]);
              session.endDialog(msg);
        }
}
}

]);



//Dialogo de creacion de bot con LUIS
intents.matches('Creadores', function (session) {
    session.send("Gracias por preguntar, mis creadores son: Angel Aniel Santana Payan y Armando Najera Benavidez");
});


//Dialogo de veranos de bot con LUIS
intents.matches('Fechas', function (session) {
    session.send("Los veranos tienen las siguientes fechas <br/> Inician: 12 de Junio <br/> Terminan: 22 de Julio");
});


//Dialogo de vacaciones de bot con LUIS
intents.matches('Vacaciones', function (session) {
    session.send("Vacaciones! <br/> El periodo vacacional de Semana Santa   <br/> Inicia: 10 Abril <br/> Termina: 22 Abril <br/> <br/> El periodo vacacional de Verano <br/> Inicia: 25 de Junio <br/> Termina: 30 de Julio <br/> <br/> El periodo vacacional de Invierno <br/> Apartir del 18 de Diciembre ");
});


//Dialogo de calendario de bot con LUIS
intents.matches('Calendario', function (session) {
    session.send("Por supuesto <br/> Aqui tienes el calendario escolar, igualmente lo puedes encontrar en la pagina de la UACJ www.uacj.mx");
               session.send("Calendario")
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/pdf",
                contentUrl: "http://www.uacj.mx/calendario/Paginas/pdf/general.pdf",
            }]);
              session.endDialog(msg);
        
});


//Dialogo de software gratis de bot con LUIS
intents.matches('DSoftware', function (session) {
    session.send("Claro <br/> Aqui la liga(https://alumnosuacj.sharepoint.com/sites/Alumnos/Pages/software.aspx) <br/> Solamente inicia seccion con tu usuario y contrasena y selecciona la seccion del software deseado <br/> Recuerda que tienes que ser un usuario para usar estos beneficios");
});




//Dialogo del horario de clases con LUIS
intents.matches('HClases', function (session) {
    session.send("Es un gusto ayudarte. <br/> Tu horario lo puedes ver ingresando al portal de Alumnos, en la seccion de  Horario <br/> Igualmente puedes acceder a www.uacj.mx y seleccionar alumnos.");
});


//Dialogo de cardex
intents.matches('Cardex', function (session) {
    session.send("Es un gusto ayudarte. <br/> Tu cadex, lo puedes observacion ingresando en Informacion en Linea, en la seccion de Datos Alumnos - Datos Academicos - Cardex");
               var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i66.tinypic.com/m9ul2a.png",
            }]);
              session.endDialog(msg);
    
});



//Dialogo de campus virtual
intents.matches('CampusVirtual', function (session) {
    session.send("Es un gusto ayudarte. <br/> Para acceder al campus virtual: <br/> 1.-  Ingresa a (www.uacj.mx) <br/> 2.-  Seleccionas Alumnos <br/>. 3.- Dentro de tu tablero, selecciona Campus virtual <br/> 4.- Campus virtual.");
});

//dialogo de inscripbiones
intents.matches('Inscripciones', function (session) {
    session.send("Es un gusto ayudarte. <br/> Para inscribirte: <br/> 1.-  Ingresa a (www.uacj.mx) <br/> 2.-  Seleccionas Alumnos <br/>. 3.- Dentro de tu tablero, selecciona Servicios Academicos <br/> 4.- Proceso de Inscripciones <br/> O puedes ingresar a la siguiente liga (https://escolar.uacj.mx/inscripciones).");
});

//dialogo de lista de materias
intents.matches('ListadeMaterias', function (session) {
    session.send("Claro. <br/> Para conocer la lista de materias: <br/> 1.-  Ingresa a (www.uacj.mx) <br/> 2.-  Seleccionas Alumnos <br/>. 3.- Dentro de tu tablero, selecciona Servicios Academicos <br/> 4.- Proceso de Inscripciones <br/> 5.- En la parte superior aparece un menu, donde seleccionar el periodo deseado <br/> O puedes ingresar  directamente a la siguiente liga (https://alumnosuacj.sharepoint.com/sites/Alumnos/Pages/Inscripciones/Index.aspx).");
});


//Dialogo de biblioteca virtual
intents.matches('Biblioteca', function (session) {
    session.send("Es un gusto que utilices estos servicios. <br/> Para entrar a la Biblioteca virtual: <br/> 1.-  Ingresa a (www.uacj.mx) <br/> 2.-  Seleccionas Alumnos <br/>. 3.- Dentro de tu tablero, selecciona Biblioteca <br/> 4.- Selecciona Biblioteca Virtual");
});

//Dialogo de servicio social
intents.matches('Servicio', function (session) {
    session.send("Es un placer ayudarte. <br/> Para conocer detalles del servicio social: <br/> 1.-  Ingresa a tu Informacion en linea <br/> 2.-  Seleccionas Servicios<br/>. 3.- Dentro de servicios, Seleccionas Servicio Social <br/> Dentro de ese partado te mostrara cuantas horas necesitas para tu plan de estudios. ");
    var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i68.tinypic.com/300hc0z.png",
            }]);
              session.endDialog(msg);
});

//Dialogo de nuevo ingreso 
intents.matches('NuevoIngreso', function (session) {
    session.send("Es un placer ayudarte. <br/> Para el semestre de Agosto-Diciembre 2017 : 15 de Junio al 16 de Junio <br/> Semestre Enero-Julio 2018: 30 de Noviembre y 01 de Diciembre.");
});

//Dialogo de nuevo ingreso 
intents.matches('Reingreso', function (session) {
    session.send("Es un placer ayudarte. <br/> Para el semestre de Agosto-Diciembre 2017 : 20 de Junio al 23 de Junio <br/> Semestre Enero-Julio 2018: 12 al 15 de Diciembre.");
});


//Dialogo de nuevo ingreso 
intents.matches('NecesitoInfo', function (session) {
    session.send("No eh entendido tu consulta, puebra siendo mas especifico. ");
});



//Dialogo de nuevo ingreso 
intents.matches('Gracias', function (session) {
    session.send("Es un gusto poder ayudarte. Me alegro que haya sido de gran utilidad");
});

//Dialogo de nuevo ingreso 
intents.matches('Promedio', function (session) {
    session.send("Es un gusto ayudarte. <br/> Tu promedio, lo puedes observacion ingresando en Informacion en Linea, en la seccion de Datos Alumnos - Datos Academicos - Periodo");
    var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/png",
                contentUrl: "http://i64.tinypic.com/102o8xc.png"
            }]);
              session.endDialog(msg);
});







