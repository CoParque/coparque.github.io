      /*
			$(window).on('message',function(e){
			alert('Mensaje del iframe');
			console.log("MESSAGE",e);
				
			});
			
			$(document).on('click', 'a[rel=modal]', function(e) {
				e.stopImmediatePropagation();
				e.preventDefault();
				var modal = $('#modal').modal();
				console.log('hey')
				modal.find('.modal-body').load($(this).attr('href'), function(responseText, textStatus) {
					if(textStatus === 'success' || textStatus === 'notmodified') {
						$('#miframe').attr('src',"detalle.html?telefono=(343)%20424%20-%200288")
						modal.show();
					}
				});
			});*/
            var $table = $("#table");
            var tipo = "contactos";
            var zona = "parana";
            var data;
            var resp = Cookies.get("responsable");
            var zona = Cookies.get("zona");
            var win;
            var reservasCount;
            var clave = Cookies.get("clave");
            var claveEnc;
            var rTelefono,
              rDireccion,
              rFecha,
              rEstado,
              rResponsable,
              rObservaciones,
              rLocalidad;
            var rpTelefono, rpDireccion, rpFecha, rpRespuesta;
            var registrotelpretty, registrotel;
            var pubs;
            var limiteReservasMin = 1;
            var limiteReservasMax = 3;
            var timeoutReservas = 5;
            const scriptURL = "https://script.google.com/macros/s/AKfycbzivt4eVHnlJKOwMIHFq6n200v8eMOkx8qNJOgFf08R-ncjqa_r/exec";
      
            function loadPubs(background) {
              if (background != true) {
                $("#cargando").modal("show");
              }
            $.getJSON(
              "https://sheets.googleapis.com/v4/spreadsheets/1VGOPLJ19ms7Xi1NyLFE83cjAkq3OrffrwRjjxgcgSQ4/values/pubs?alt=json&key=AIzaSyCz4sutc6Z6Hh5FtBTB53I8-ljkj6XWpPc"
            ).done(function (jsonurl) {
              pubs = jsonata('$.values.({"Nombre":$[0],"Tel":$[2],"Reservas":$number($[3])})').evaluate(
                jsonurl
              );
      
              var listitems = "<option></option>";
              var item; 
      
              $.each(pubs, function (key, value) {
                if  (value["Reservas"] > 0) {
                    item = value["Nombre"] + " (" + value["Reservas"] + " reservados)"
                } else {
                  item = value["Nombre"]
                };
                listitems += "<option value='" + value["Nombre"] + "''>" + item +"</option>";
              });
              $("#Publicador").empty();
              $("#Publicador").append(listitems);
              $("#ddResponsable").text(resp);
              $("#cargando").modal("hide");
            })};
      
            function loadClave() {
              //$('#cargando').modal('show');
              $.getJSON(
                "https://sheets.googleapis.com/v4/spreadsheets/1VGOPLJ19ms7Xi1NyLFE83cjAkq3OrffrwRjjxgcgSQ4/values/claveEnc?alt=json&key=AIzaSyCz4sutc6Z6Hh5FtBTB53I8-ljkj6XWpPc"
              ).done(function (jsonurl) {
                claveEnc = jsonata("$.values[0][0]").evaluate(jsonurl);
              });
            }
      
            function loadJson(background) {
              if (background != true) {
                $("#cargando").modal("show");
              }
              $.getJSON(
                "https://sheets.googleapis.com/v4/spreadsheets/1VGOPLJ19ms7Xi1NyLFE83cjAkq3OrffrwRjjxgcgSQ4/values/telefonos?alt=json&key=AIzaSyCz4sutc6Z6Hh5FtBTB53I8-ljkj6XWpPc"
              ).done(function (jsonurl) {
                data = jsonata(
                  '$.values.({"Telefono":$[0], "Direccion":$[1], "Localidad":$[2], "Fecha":$[3], "Respuesta":$[4], "Publicador":$[5], "Turno":$[6], "Observaciones":$[7], "Responsable":$[8]&""})'
                ).evaluate(jsonurl);
                filterJson(background);
                loadPubs(true);
                $("#cargando").modal("hide");
              });
            }
      
            async function loadContacto() {
              $("#cargando").modal("show");
              if (zona == "Paraná") {
                localidad = '[Localidad="Paraná"]';
              } else {
                localidad = '[Localidad!="Paraná"]';
              }
              await $.getJSON(
                "https://sheets.googleapis.com/v4/spreadsheets/1VGOPLJ19ms7Xi1NyLFE83cjAkq3OrffrwRjjxgcgSQ4/values/telefonos?alt=json&key=AIzaSyCz4sutc6Z6Hh5FtBTB53I8-ljkj6XWpPc"
              ).done(function (jsonurl) {
                var data = jsonata(
                  '$shuffle($.values.({"Telefono":$[0], "Direccion":$[1], "Localidad":$[2], "Fecha":$[3], "Respuesta":$[4], "Publicador":$[5], "Turno":$[6], "Observaciones":$[7]})[Respuesta!="Reservado"]' +
                    localidad +
                    ")[0]"
                ).evaluate(jsonurl);
      
                registrotel = data; //jsonata('$[Telefono="' + telefono + '"]').evaluate(data);
                registrotelpretty = jsonata(
                  '$.{"Telefono":Telefono, "Direccion":Direccion & ", " & Localidad, "Respuesta":Respuesta, "Fecha": (Fecha & ($boolean(Turno) ?(" por la "& Turno) : ""))}'
                ).evaluate(registrotel);
                rpTelefono = registrotelpretty["Telefono"];
                rpDireccion = registrotelpretty["Direccion"];
                rpFecha = registrotelpretty["Fecha"];
                rpRespuesta = registrotelpretty["Respuesta"];
                $("#ddResponsable").text(resp);
                $("#Responsable").val(resp);
                $("#ddObservaciones").text(registrotel["Observaciones"]);
                $("#Telefono").val(registrotel["Telefono"]);
                $("#Direccion").val(registrotel["Direccion"]);
                $("#Localidad").val(registrotel["Localidad"]);
                $("#Estado").val("Reservado");
                console.log(registrotelpretty);
               rTelefono=registrotel["Telefono"];
              rDireccion=registrotel["Direccion"];
              rFecha=jsonata('$now("[Y0001]-[M01]-[D01]")').evaluate();
              rEstado="Reservado";
              rResponsable=resp;
              rObservaciones="";
              rLocalidad=registrotel["Localidad"];
              $("#spPub").text(resp);
              $("#spTel").text(registrotel["Telefono"]);
      
      //return await submitForm();
      
      
                $("#Fecha").val(jsonata('$now("[Y0001]-[M01]-[D01]")').evaluate());
                console.log(registrotel);
                //console.log(jsonata('$now("[Y0001]-[M01]-[D01]")').evaluate());
              });
            }
      
            function loadResp() {
              $.getJSON(
                "https://sheets.googleapis.com/v4/spreadsheets/1VGOPLJ19ms7Xi1NyLFE83cjAkq3OrffrwRjjxgcgSQ4/values/responsables?alt=json&key=AIzaSyCz4sutc6Z6Hh5FtBTB53I8-ljkj6XWpPc"
              ).done(function (jsonurl) {
                var data = jsonata('$.values.({"Nombre":$[0]})').evaluate(jsonurl);
                var listitems = "";
                $("#selResponsable").empty();
                $.each(data, function (key, value) {
                  listitems += "<option>" + value["Nombre"] + "</option>";
                });
                $("#selResponsable").append(listitems);
                $("#selResponsable").val(resp);
              });
            }
      
            function filterJson(background) {
              if (background != true) {
                $("#cargando").modal("show");
              }
              var filtro = data;
              filtro = jsonata(
                '$[Respuesta="Reservado"][Responsable="' + resp + '"]'
              ).evaluate(filtro);
              console.log(filtro);
              /*if(filtro) {*/
              filtro = jsonata(
                '[$.{"Telefono":Telefono, "TelefonoBlur":Telefono, "Direccion":Direccion & ", "& Localidad, "Respuesta":Respuesta &" ("& Fecha &$string(Turno = "" ? ")": " por la "& Turno &")"), "PublicadorFecha":Publicador &" ("& Fecha &")", "Responsable":Responsable}]'
              ).evaluate(filtro);
              //$("#alert").attr("class", "alert alert-warning hidden");
              $("#tableres").bootstrapTable({
                data: filtro,
              });
              $("#tableres").bootstrapTable("load", filtro);
              /*} else {
                  $("#tablereservas").attr("class", "table-responsive hidden");
                  $("#alert").attr("class", "alert alert-warning show");
              };*/
              reservasCount = jsonata("$count($)").evaluate(filtro);
              if (reservasCount > 0) {
                $("#reservasCount").text(reservasCount);
                //   $("#reservasCount").attr("class", "badge show");
              } else {
                $("#reservasCount").text("");
                //  $("#reservasCount").attr("class", "badge hidden");
              }
              $("#cargando").modal("hide");
            }
      
            function LinkFormatter(value, row, index) {
              return (
                "<a  class='btn btn-primary' role='button' href='javascript:win = window.open(&apos;informar.html?telefono=" +
                value +
                "&apos;);'><strong>" +
                value +
                "</strong></a>"
              );
            }
            window.addEventListener("message", (event) => {
              // Only accept messages from http://example.com.
              if (event.origin === "https://churruar.in") {
                win.close();
                //loadJson();
              }
            });
            $(document).ready(function () {
              $("#spResponsable").text(resp);
              $("#contactos").click(function () {
                $("#tablereservas").attr("class", "hidden");
                $("#pnlContactos").attr("class", "panel panel-primary ");
                $("#contactos").attr("class", "active");
                $("#reservas").attr("class", "");
                tipo = "contactos";
              });
              $("#reservas").click(function () {
                $("#tablereservas").attr("class", "show");
                $("#pnlContactos").attr("class", "panel panel-primary hidden");
                $("#reservas").attr("class", "active");
                $("#contactos").attr("class", "");
                tipo = "reservas";
                loadJson();
      
              });
              if (resp === undefined) {
                loadJson();
                loadResp();
                $("#modResponsable").modal("show");
              } else {
                $("#spResponsable").text(resp);
                $("#selResponsable").val(resp);
              }
              $("#btnResponsable").click(function () {
                if ($("#formresp")[0].checkValidity()) {
                  resp = $("#selResponsable").find(":selected").text();
                  Cookies.set("responsable", resp);
                  $("#spResponsable").text(resp);
                  $("#modResponsable").modal("hide");
                } else {
                  $("#formresp").find("#submit-hiddenResp").click();
                }
              });
      
      
      
      
              if (zona != undefined) {
                $("#btnSelect").attr("disabled", false);
                $("#selZona").val(zona);
              } else {
                $("#btnSelect").attr("disabled", true);
              }
      
              $("#reload").click(function () {
                loadJson();
              });
      
              $("#btnCloseSuccess").click(function () {
                  loadJson(true);
                  $("#modSuccess").modal("hide");
                
              });
      
              $("#nomResponsable").click(async function () {
                await loadResp();
                $("#modResponsable").modal("show");
                $("#selResponsable").val(resp);
              });
      
              $("#btnSelect").click( function () {
                  if ($("#formres")[0].checkValidity()) {
                      preSelect();
                       } else {
                  $("#formres").find("#submit-hidden").click();
                }
              });
      
              $("#btnReenviarwa").click(function () {
                  getWAlink();
              });
      
              $("#btnWarningAdv").click(function () {
                  $("#btnWarningAdv").addClass('hidden');
                  $("#divWarningAdv").removeClass('hidden');
                  $("#spWarningTimeout").text(timeoutReservas);
              });
      
              $('#cbWarningAdv').change(function() {
              if(this.checked) {
              
                  var counter = timeoutReservas;
                  
      var interval = setInterval(function() {
          counter--;
          $("#spBtnWarningTimeout").text('('+counter+')');
          // Display 'counter' wherever you want to display it.
          if (counter == 0) {
              // Display a login box
              $("#btnWarningEnviar").prop('disabled', false)
              $("#spBtnWarningTimeout").text('');
              clearInterval(interval);
          }
      }, 1000);
      
              } else {$("#btnWarningEnviar").prop('disabled', true)}
                 
          });
      
              function preSelect() {
                  console.log($("#Publicador").val());
                  console.log(pubs);
                  selectedPub = jsonata("$[Nombre='"+ $("#Publicador").val() + "']").evaluate(pubs);
                  console.log(selectedPub);
                  var numReservas = selectedPub["Reservas"];
                  console.log(numReservas);
                  if (numReservas < limiteReservasMin) {
                  $("#spConfirmPub").text(selectedPub["Nombre"]);
                  $("#spConfirmResp").text(resp);
                  $("#modConfirm").modal("show"); }
                  else if (numReservas >= limiteReservasMin && numReservas < limiteReservasMax) {
                      $("#modWarning").modal("show"); 
                  }
                  else {
                      $("#modInvalid").modal("show");
      
                  };
              };
      
              function getWAlink() {
                var selpub = $("#Publicador").val();
                var selpubtel = jsonata('$[Nombre="' + selpub + '"].Tel').evaluate(
                  pubs
                );
                if (selpubtel) {
                  linkwa = "https://wa.me/+54" + selpubtel;
                } else {
                  linkwa = "https://wa.me/";
                }
                //
                linkwa =
                  linkwa +
                  "?text=" +
                  encodeURIComponent(
                    "_Co. Churruarín_ \r\n*ASIGNACIÓN DE TERRITORIO TELEFÓNICO* \n\nSe te asignó el siguiente número telefónico para que lo atiendas: \nNúmero: *" +
                      registrotelpretty["Telefono"] +
                      "*\nDirección: *" +
                      registrotelpretty["Direccion"] +
                      "*\nFue llamado la última vez: *" +
                      registrotelpretty["Fecha"] +
                      "*\nRespuesta a la última llamada: *" +
                      registrotelpretty["Respuesta"] +
                      "*\n\nPor favor, *no olvides informar* la respuesta del amo de casa al hermano que te asignó este número. Llevar un buen registro es esencial para dar un buen testimonio. \nPor favor, incluí en tu respuesta estos datos: \n*Teléfono:* \n*Respuesta* (Opciones: atendió / no atendió / no existente / no volver a llamar / mensaje en el contestador / revisita): \n*Fecha de la llamada:* \n*Turno de la llamada* (mañana o tarde): \n*Observaciones* (opcional): \nSi deseás reservar el número como *revisita*, por favor no olvides informarle al hermano cuando ya no lo sigas revisitando. Gracias."
                  );
              }
      
              $("#btnEnviar").click(async function () {
                  $("#modConfirm").modal("hide");
               
                  $("#cargando").modal("show");
                  await loadContacto();
                  if (await submitForm()) {
                    
                      getWAlink();
                      window.open(linkwa);
                      //window.opener.postMessage('close', 'https://churruar.in');
                      $("#modSuccess").modal("show");
                  } else {
                    alert("Ocurrió un error. Intentá enviarlo de nuevo.");
                  }
                  $("#cargando").modal("hide");
              
              });
      
      
              async function submitForm() {
                  await loadContacto();
                var data = {
                  Telefono: rTelefono,
                  Direccion: rDireccion,
              Fecha: rFecha,
              Estado: "Reservado",
              Responsable: resp,
              Observaciones: rObservaciones,
              Localdad: rLocalidad};
              data= new FormData($("#formres")[0]);
              
              
                  var respuesta = false;
                var response = await fetch(scriptURL, {
                  method: "POST",
                  body: data
                }).catch((error) => {
                  respuesta = false;
                });
                console.log(data);
                respuesta = response.ok;
                console.log(respuesta);
                console.log(response);
      
                return respuesta;
              }
              loadJson(true);
            });