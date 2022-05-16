//importando
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
//utilizara un archivo json
var app = express();
app.use(bodyParser.json());
//establezco el puerto
app.listen(3000, function(){
  console.log("El servidor se encuentra en el puerto 3000");
});
//APP_TOKEN
const APP_TOKEN  = '--'
//configurando la ruta
app.get('/',function(req, res){
  res.send('En linea');
});
//configurando token
app.get('/webhook', function(req, res){
  if(req.query['hub.verify_token'] === 'test_token_say_hello'){
    res.send(req.query['hub.challenge']);
  }
  else{
    res.send('Sin acceso');
  }
});
//validar eventos
app.post('/webhook', function(req, res){
  var data = req.body;
  if(data.object == 'page'){
    data.entry.forEach(function(pageEntry){
      pageEntry.messaging.forEach(function(messagingEvent){
      if (messagingEvent.message) {
        reciveMessage(messagingEvent);
      }
      });
    });
    res.sendStatus(200);
  }
});
//muestro el mensaje
function reciveMessage(event){
  var senderID = event.sender.id;
  var messageText = event.message.text;
  evaluateMessage(senderID, messageText);
}
//responder al usuario
function evaluateMessage(recipientId,message){
  var finalMessage = '';
  //lectura del mensaje
  if(isContain(message, 'hola')){
    finalMessage = 'hola ¿Como puedo ayudarte?';
  }else if(isContain(message, 'ayuda')){
    finalMessage = '¿Como puedo ayudarte?';
  }else if(isContain(message, 'tipo de comidas')){
    finalMessage = 'Tenemos una gran variedad de desayunos y comidas \n ¿Que menu te gustaria ver?';
  }else if(isContain(message, 'menu')){
    if (isContain(message, 'comida')) {
      sendMessageTemplateC(recipientId);
    }if (isContain(message, 'desayuno')) {
      sendMessageTemplateD(recipientId);
    }else {
      finalMessage = 'Contamos con dos menus: desayunos y comidas';}
  }else if(isContain(message, 'servicio a domicilio')){
    finalMessage = 'Por el momento no contamos con el servicio';
  }else if(isContain(message, 'ubicac')){
    finalMessage = 'calle ficticia s/n Ciudad, Municipio';
  }else if (isContain(message, 'desayuno')) {
    sendMessageTemplateD(recipientId);
  }else if (isContain(message, 'comida')) {
    sendMessageTemplateC(recipientId);
  }else if (isContain(message, 'horario')) {
    sendMessageTemplateH(recipientId);
  }else {
    finalMessage = 'No puedo responder a esa peticion';
  }
  sendMessageText(recipientId, finalMessage);
}
function sendMessageText(recipientId,message) {
  var messageData = {
    recipient : {
      id: recipientId
    },
    message: {
      text: message
    }
  };
  callSendAPI(messageData);
}
function sendMessageTemplateH(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment:{
        type: "template",
        payload:{
          template_type: "generic",
          elements: [ elemenTemplateH1() ],
        }
      }
    }
  };
  callSendAPI(messageData);
}function elemenTemplateH1() {
  return {
    title: "HORARIO",
    subtitle: "Lunes: 8:00a.m - 8:00 p.m \n Martes: 8:00a.m - 8:00 p.m \n Miercoles: 8:00a.m - 8:00 p.m \n Jueves: 8:00a.m - 8:00 p.m \n Viernes: 8:00a.m - 8:00 p.m \n Sabado: 8:00a.m - 4:00 p.m",
    image_url: "https://i0.pngocean.com/files/435/519/801/pizza-napoli-cafe-fast-food-restaurant-menu-dining-knife-and-fork-cartoon-logo-thumb.jpg",
    buttons: [ buttonTemplate1()],
  }
}

function sendMessageTemplateD(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment:{
        type: "template",
        payload:{
          template_type: "generic",
          elements: [ elemenTemplateD1(), elemenTemplateD2(), elemenTemplateD3(), elemenTemplateD4(), elemenTemplateD5() ],
        }
      }
    }
  };
  callSendAPI(messageData);
}function elemenTemplateD1() {
  return {
    title: "Desayuno1",
    subtitle: "Cafe \n Zumo de naranja \n Rebanadas de pan con tomate",
    image_url: "https://s5.eestatic.com/2015/01/04/cocinillas/Cocinillas_760013_115951269_1024x1024.jpg",
    buttons: [ buttonTemplate1()],
  }
}function elemenTemplateD2() {
  return {
    title: "Desayuno2",
    subtitle: "Cafe \n Pan con Hummus de aguacate \n Huebo pasado por agua \n Batido de kiwi con lima ",
    image_url: "https://s5.eestatic.com/2015/01/04/cocinillas/Cocinillas_760013_115951269_1024x1024.jpg",
    buttons: [ buttonTemplate1()],
  }
}function elemenTemplateD3() {
  return {
    title: "Desayuno3",
    subtitle: "Infusión de rooibos o un té desteinado \n Yogurt con frutas de temporada",
    image_url: "https://s6.eestatic.com/2015/01/12/cocinillas/Cocinillas_2759808_115951325_1024x1024.jpg",
    buttons: [ buttonTemplate1()],
  }
}function elemenTemplateD4() {
  return {
    title: "Desayuno4",
    subtitle: "Zumo de naranja y lima \n Café con leche \n Pan con tomate, aceite y jamon \n Ciruelas",
    image_url: "https://s4.eestatic.com/2015/02/13/cocinillas/Cocinillas_10759017_115951353_816x1024.jpg",
    buttons: [ buttonTemplate1()],
  }
}function elemenTemplateD5() {
  return {
    title: "Desayuno5",
    subtitle: "Cafe con leche \n Yogurt con frutas de temporada",
    image_url: "https://s4.eestatic.com/2015/02/04/cocinillas/Cocinillas_8509236_115951381_780x1024.jpg",
    buttons: [ buttonTemplate1() ],
  }
}
function sendMessageImage(recipientId,message) {
  var messageData = {
    recipient : {
      id: recipientId
    },
    message: {
      attachment:{
        type: "image",
        payload:{
          url: "https://s1.eestatic.com/2015/03/31/cocinillas/Cocinillas_22257914_116018278_1024x576.jpg",
        }
      }
    }
  };
  callSendAPI(messageData);
}
function sendMessageTemplateC(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment:{
        type: "template",
        payload:{
          template_type: "generic",
          elements: [ elemenTemplateC1(), elemenTemplateC2(), elemenTemplateC3(), elemenTemplateC4(), elemenTemplateC5() ],
        }
      }
    }
  };
  callSendAPI(messageData);
}function buttonTemplate1(){
  return {
    type: "web_url",
    url: "https://www.miarevista.es/salud/fotos/desayunos-rapidos-para-empezar-bien-el-dia",
    title: "Ver mas",
  }
}
function buttonTemplate2(){
  return {
    type: "web_url",
    url: "https://www.directoalpaladar.com.mx/directo-al-paladar-mexico/5-menus-completos-para-toda-la-semana",
    title: "Ver mas",
  }
}
function elemenTemplateC1() {
  return {
    title: "Comida1",
    subtitle: "Agua sabores \n Arroz a la mexicana \n A lbóndigas de pollo en salsa de chile chipotle",
    image_url: "https://i.blogs.es/104a31/sopa-tallarines/1366_2000.jpg",
    buttons: [ buttonTemplate2()],
  }
}function elemenTemplateC2() {
  return {
    title: "Comida2",
    subtitle: "Agua sabores \n Pasta a la hawaina \n Lomo en adobo  \n Gelatina de mango",
    image_url: "https://i.blogs.es/104a31/sopa-tallarines/1366_2000.jpg",
    buttons: [ buttonTemplate2()],
  }
}function elemenTemplateC3() {
  return {
    title: "Comida3",
    subtitle: "Agua sabores \n  Sopa de tallarines con verduras \n Hamburguesas de quinoa",
    image_url: "https://i.blogs.es/104a31/sopa-tallarines/1366_2000.jpg",
    buttons: [ buttonTemplate2()],
  }
}function elemenTemplateC4() {
  return {
    title: "Comida4",
    subtitle: "Agua sabores \n Sopa de palmitos con croutones de camote \n Kebabs de cordero con cebolla y pimiento \n Rumble de manzana y frambuesa",
    image_url: "https://i.blogs.es/4f4236/sopa-palmitos/1366_2000.jpg",
    buttons: [ buttonTemplate2()],
  }
}function elemenTemplateC5() {
  return {
    title: "Comida5",
    subtitle: "Agua sabores \n Espagueti aglio e olio \n Pescado con salsa cremosa de almendras \n Postre de yogur y chocolate ",
    image_url: "https://i.blogs.es/796b11/espagueti-aglio/1366_2000.jpg",
    buttons: [ buttonTemplate1()],
  }
}
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs : {access_token : APP_TOKEN },
    method: 'POST',
    json: messageData
  }, function(error, response, data){
    if(error){
      console.log('No es posible responder')
    }else {
      console.log("Respondio con exito");
    }
  });
}
function isContain(sentence, word){
  return sentence.indexOf(word) >-1;
}
