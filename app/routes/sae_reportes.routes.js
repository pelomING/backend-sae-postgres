const { authJwt } = require("../middleware");
const reportesController = require("../controllers/sae/reportes.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
    

    /* Devuelve todos las jornadas */
    app.get("/api/reportes/v1/alljornada", [authJwt.verifyToken], reportesController.findAllJornadas);

    /* Actualiza la fecha de Jornada por Id de jornada
      app.put("/api/reportes/v1/updatejornada", reportesController.updateJornada)
    */
    app.put("/api/reportes/v1/updatejornada/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.updateJornada);

    /*********************************************************************************** */
    /* Crea una jornada nueva 
      app.post("/api/reportes/v1/creajornada", reportesController.creaJornada)
    */
    app.post("/api/reportes/v1/creajornada", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.creaJornada);
      /*********************************************************************************** */
      /* Elimina una jornada por id de jornada 
        app.delete("/api/reportes/v1/deletejornada", reportesController.deleteJornada)
      */
    app.delete("/api/reportes/v1/deletejornada/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.deleteJornada);

    /* Devuelve detalle de eventos */
    app.get("/api/reportes/v1/alleventos", [authJwt.verifyToken], reportesController.findAllEventos);

    /*********************************************************************************** */
    /* Crea un nuevo evento  
      app.post("/api/reportes/v1/creaevento", reportesController.creaEvento)
    */
    app.post("/api/reportes/v1/creaevento", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.creaEvento);

    /*********************************************************************************** */
    /* Actualiza la fecha de Evento por Id de evento
      app.put("/api/reportes/v1/updateevento", reportesController.updateEvento)
    */
    app.put("/api/reportes/v1/updateevento/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.updateEvento);

    /* Elimina un evento por id de evento 
      app.delete("/api/reportes/v1/deleteevento", reportesController.deleteEvento)
    */
    app.delete("/api/reportes/v1/deleteevento/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.deleteEvento);


    /* Devuelve el reporte de estado con los eventos asociados */
    app.get("/api/reportes/v1/allestadosresultado", [authJwt.verifyToken], reportesController.findAllEstadosResultado);


    /* Crea un estado resultado 
    ejemplo: { "id_usuario": 7, "zona": 1, "paquete": 1, "mes": 9, "fecha_inicio": "2023-09-01", "fecha_final": "2023-09-30", 
    "nombre_doc": "nombre de documento", "url_doc": "url de documento", "fecha_creacion": "2023-09-30", "fecha_modificacion": "2023-09-30", 
    "estado": 1, "eventos_relacionados": [1,2,3,4,5], "id_cliente":1 }*/
    app.post("/api/reportes/v1/creaestadoresultado", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.creaEstadoResultado);


    /* Devuelve resumen de eventos 
    ejemplo: /api/reportes/v1/resumeneventos?id_paquete=1&fecha_inicial=2023-08-01&fecha_final=2023-09-30*/
    app.get("/api/reportes/v1/resumeneventos", [authJwt.verifyToken], reportesController.resumenEventos);


    /* Devuelve resumen de turnos 
    ejemplpo: /api/reportes/v1/resumenturnos?id_paquete=1&fecha_inicial=2023-08-01&fecha_final=2023-09-30*/
    app.get("/api/reportes/v1/resumenturnos", [authJwt.verifyToken], reportesController.resumenTurnos);

    /* Devuelve resumen de todos los eventos, de todos los paquetes 
    ejemplo: /api/reportes/v1/resumeneventos?fecha_inicial=2023-08-01&fecha_final=2023-09-30*/
    app.get("/api/reportes/v1/resumenalleventos", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.resumenAllEventos)

    /* Devuelve resumen de todos los turnos 
    ejemplpo: /api/reportes/v1/resumenturnos?fecha_inicial=2023-08-01&fecha_final=2023-09-30*/
    app.get("/api/reportes/v1/resumenallturnos", [authJwt.verifyToken], reportesController.resumenAllTurnos);

    /*********************************************************************************** */
    /* Ingresa las observaciones para un estado de pago
      app.post("/api/reportes/v1/creaobservaciones", reportesController.creaObservaciones)
    */
    app.post("/api/reportes/v1/creaobservaciones", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.creaObservaciones);

    /*********************************************************************************** */
    /* Actualiza las observaciones para un estado de pago
      app.post("/api/reportes/v1/updateobservaciones", reportesController.updateObservaciones)
    */
    app.put("/api/reportes/v1/updateobservaciones/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.updateObservaciones);

    /*********************************************************************************** */
    /* Elimina una observacion para un estado de pago
      app.post("/api/reportes/v1/deleteobservaciones", reportesController.deleteObservaciones)
    */
    app.delete("/api/reportes/v1/deleteobservaciones/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.deleteObservaciones);

    /*********************************************************************************** */
    /* Devuelve todas las observaciones 
      app.post("/api/reportes/v1/findallobservaciones", reportesController.findallObservaciones)
    */
    app.get("/api/reportes/v1/findallobservaciones", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findallObservaciones);

    /*********************************************************************************** */
    /* Devuelve las observacion por parametros
      app.post("/api/reportes/v1/findobservaciones", reportesController.findObservacionesByParams)
    */
    app.get("/api/reportes/v1/findobservaciones", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findObservacionesByParams);

    /*********************************************************************************** */
    /* Devuelve las observaciones no procesadas, id_estado_resultado=null
      app.post("/api/reportes/v1/observacionesnoprocesadas", reportesController.findObservacionesNoProcesadas)
    */
    app.get("/api/reportes/v1/observacionesnoprocesadas", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findObservacionesNoProcesadas);

    /*********************************************************************************** */
    /* Devuelve los cargos fijo por semana
      app.post("/api/reportes/v1/semanal_por_brigada", reportesController.semanalByBrigada)
    */
    app.get("/api/reportes/v1/semanal_por_brigada", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.semanalByBrigada);
    /*********************************************************************************** */
    /* Devuelve la permanencia total como si no hubiera faltado ningún turno
      app.post("/api/reportes/v1/permanencia_total", reportesController.permanenciaTotal)
    */
    app.get("/api/reportes/v1/permanencia_total", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.permanenciaTotal);
    /*********************************************************************************** */
    /* Devuelve la permanencia semanal por brigada
      app.post("/api/reportes/v1/permanencia_por_brigada", reportesController.permanenciaByBrigada)
    */
    app.get("/api/reportes/v1/permanencia_por_brigada", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.permanenciaByBrigada);

    /*********************************************************************************** */
    /* Devuelve las horas extra realizadas
      app.post("/api/reportes/v1/horasextras", reportesController.findHorasExtras)
    */
    app.get("/api/reportes/v1/horasextras", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findHorasExtras);

    /*********************************************************************************** */
    /* Devuelve los turnos adicionales
      app.post("/api/reportes/v1/turnosadicionales", reportesController.findTurnosAdicionales)
    */
    app.get("/api/reportes/v1/turnosadicionales", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findTurnosAdicionales);

    /*********************************************************************************** */
    /* Devuelve los turnos de contingencia
      app.post("/api/reportes/v1/turnoscontingencia", reportesController.findTurnosContingencia)
    */
    app.get("/api/reportes/v1/turnoscontingencia", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findTurnosContingencia);

    /*********************************************************************************** */
    /* Devuelve la produccion PxQ
      app.post("/api/reportes/v1/produccionpxq", reportesController.findProduccionPxQ)
    */
    app.get("/api/reportes/v1/produccionpxq", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findProduccionPxQ);

    /*********************************************************************************** */
    /* Devuelve la tabla de cobros adicionales para el EDP
      app.post("/api/reportes/v1/reportecobroadicional", reportesController.findRepCobroAdicional)
    */
    app.get("/api/reportes/v1/reportecobroadicional", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findRepCobroAdicional);

    /*********************************************************************************** */
    /* Devuelve la tabla de descuentos para el EDP
      app.post("/api/reportes/v1/reportedescuentos", reportesController.findRepDescuentos)
    */
    app.get("/api/reportes/v1/reportedescuentos", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findRepDescuentos);
    /*********************************************************************************** */
    /* Devuelve la tabla de resumen para el EDP
      app.post("/api/reportes/v1/reporteresumen", reportesController.findRepResumen)
    */
    app.get("/api/reportes/v1/reporteresumen", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findRepResumen);

    /*********************************************************************************** */
    /* Ingresa las observaciones para un estado de pago
      app.post("/api/reportes/v1/creacobroadicional", reportesController.creaCobroAdicional)
    */
    app.post("/api/reportes/v1/creacobroadicional", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.creaCobroAdicional);

    /* Actualiza los cobros adicionales para un estado de pago
    app.post("/api/reportes/v1/updatecobroadicional", reportesController.updateCobroAdicional)
    */
    app.put("/api/reportes/v1/updatecobroadicional/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.updateCobroAdicional);

    /*********************************************************************************** */
    /* Elimina un cobro adicional para un estado de pago
      app.post("/api/reportes/v1/deletecobroadicional", reportesController.deleteCobroAdicional)
    */
    app.delete("/api/reportes/v1/deletecobroadicional/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.deleteCobroAdicional);

    /*********************************************************************************** */
    /* Devuelve todos los cobros adicionales 
      app.post("/api/reportes/v1/findallcobroadicional", reportesController.findallCobroAdicional)
    */
    app.get("/api/reportes/v1/findallcobroadicional", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findallCobroAdicional);

    /*********************************************************************************** */
    /* Devuelve los cobros adicionales por parametros
      app.post("/api/reportes/v1/findcobroadicional", reportesController.findCobroAdicionalByParams)
    */
    app.get("/api/reportes/v1/findcobroadicional", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findCobroAdicionalByParams);

    /*********************************************************************************** */
    /* Devuelve los cobros adicionales no procesados, id_estado_resultado=null
      app.post("/api/reportes/v1/cobroadicionalnoprocesado", reportesController.findCobroAdicionalNoProcesado)
    */
    app.get("/api/reportes/v1/cobroadicionalnoprocesado", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findCobroAdicionalNoProcesado);

    /*********************************************************************************** */
    /* Ingresa los descuentos para un estado de pago
      app.post("/api/reportes/v1/creadescuentos", reportesController.creaDescuentos)
    */
    app.post("/api/reportes/v1/creadescuentos", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.creaDescuentos);

    /*********************************************************************************** */
    /* Actualiza los descuentos para un estado de pago
      app.post("/api/reportes/v1/updatedescuentos", reportesController.updateDescuentos)
    */
    app.put("/api/reportes/v1/updatedescuentos/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.updateDescuentos);

    /*********************************************************************************** */
    /* Elimina un descuento para un estado de pago
      app.post("/api/reportes/v1/deletedescuento", reportesController.deleteDescuentos)
    */
    app.delete("/api/reportes/v1/deletedescuento/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.deleteDescuentos);

    /*********************************************************************************** */
    /* Devuelve todos los descuentos 
      app.post("/api/reportes/v1/findalldescuentos", reportesController.findallDescuentos)
    */
    app.get("/api/reportes/v1/findalldescuentos", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findallDescuentos);

    /*********************************************************************************** */
    /* Devuelve los descuentos por parametros
      app.post("/api/reportes/v1/finddescuentos", reportesController.findDescuentosByParams)
    */
    app.get("/api/reportes/v1/finddescuentos", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findDescuentosByParams);

    /*********************************************************************************** */
    /* Devuelve los descuentos no procesados, id_estado_resultado=null
      app.post("/api/reportes/v1/descuentosnoprocesados", reportesController.findDescuentosNoProcesados)
    */
    app.get("/api/reportes/v1/descuentosnoprocesados", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findDescuentosNoProcesados);

    /*********************************************************************************** */
    /* Devuelve la lsita de brigadas para seleccionar dentro del módulo de horas extra
      app.get("/api/movil/v1/listabrigadassae", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.listaBrigadasSae)
    */
    app.get("/api/movil/v1/listabrigadassae", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.listaBrigadasSae);

    /*********************************************************************************** */
    /* Ingresa las horas extra para un estado de pago
      app.post("/api/reportes/v1/creahoraextra", reportesController.creaHoraExtra)
    */
    app.post("/api/reportes/v1/creahoraextra", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.creaHoraExtra);

    /* Actualiza las horas extra para un estado de pago
    app.put("/api/reportes/v1/updatehoraextra", reportesController.updateHoraExtra)
    */
    app.put("/api/reportes/v1/updatehoraextra/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.updateHoraExtra);

    /*********************************************************************************** */
    /* Elimina un registro de hora extra para un estado de pago
      app.post("/api/reportes/v1/deletehoraextra", reportesController.deleteHoraExtra)
    */
    app.delete("/api/reportes/v1/deletehoraextra/:id", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.deleteHoraExtra);

    /*********************************************************************************** */
    /* Devuelve todos los registros de hora extra
      app.get("/api/reportes/v1/findallhoraextra", reportesController.findallHoraExtra)
    */
    app.get("/api/reportes/v1/findallhoraextra", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findallHoraExtra);

    /*********************************************************************************** */
    /* Devuelve los registros de hora extra por parametros
      app.get("/api/reportes/v1/findhoraextra", reportesController.findHoraExtraByParams)
    */
    app.get("/api/reportes/v1/findhoraextra", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findHoraExtraByParams);

    /*********************************************************************************** */
    /* Devuelve los registros de hora extra no procesados, id_estado_resultado=null
      app.get("/api/reportes/v1/horaextranoprocesados", reportesController.findHoraExtraNoProcesados)
    */
    app.get("/api/reportes/v1/horaextranoprocesados", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findHoraExtraNoProcesados);

    /*********************************************************************************** */
    /* Devuelve el detalle de PxQ para planilla Excel, ingresando parámetro del paquete
      app.get("/api/reportes/v1/detallepxq", reportesController.detallePxQ)
    */
    app.get("/api/reportes/v1/detallepxq", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.detallePxQ);

    /*********************************************************************************** */
    /* Realiza el cierre de un estado de pago
      app.post("/api/reportes/v1/cierraedp", reportesController.cierraEstadoPago)
    */
    app.post("/api/reportes/v1/cierraedp", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.cierraEstadoPago);

    /*********************************************************************************** */
    /* Devuelve el listado historico de estados de pago
      app.get("/api/reportes/v1/historicoedp", reportesController.historicoEdp)
    */
    app.get("/api/reportes/v1/historicoedp", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.historicoEdp);

    /*********************************************************************************** */
    /* Devuelve la permanencia semanal por brigada
      app.get("/api/reportes/v1/permanencia_por_brigada_historial", reportesController.permanenciaByBrigadaHistorial)
    */
    app.get("/api/reportes/v1/permanencia_por_brigada_historial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.permanenciaByBrigadaHistorial);

  /*********************************************************************************** */
  /* Devuelve las horas extra realizadas
    app.get("/api/reportes/v1/horasextrafindHorasExtrasHistorial", reportesController.findHorasExtrasHistorial)
  */
    app.get("/api/reportes/v1/horasextrafindHorasExtrasHistorial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findHorasExtrasHistorial);

    /* Devuelve las observacion histocias por ID de estado de pago
      app.post("/api/reportes/v1/findobservacioneshistorial", reportesController.findObservacionesHistorial)
    */
   app.get("/api/reportes/v1/findobservacioneshistorial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findObservacionesHistorial);


    /*********************************************************************************** */
    /* Devuelve los turnos adicionales
      app.get("/api/reportes/v1/turnosadicionaleshistorial", reportesController.findTurnosAdicionalesHistorial)
    */
    app.get("/api/reportes/v1/turnosadicionaleshistorial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findTurnosAdicionalesHistorial);

    /*********************************************************************************** */
    /* Devuelve los turnos de contingencia
      app.get("/api/reportes/v1/turnoscontingenciahistorial", reportesController.findTurnosContingenciaHistorial)
    */
    app.get("/api/reportes/v1/turnoscontingenciahistorial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findTurnosContingenciaHistorial);  

    /*********************************************************************************** */
    /* Devuelve la produccion PxQ
      app.get("/api/reportes/v1/produccionpxqhistorial", reportesController.findProduccionPxQHistorial)
    */
    app.get("/api/reportes/v1/produccionpxqhistorial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findProduccionPxQHistorial);


    /*********************************************************************************** */
    /* Devuelve la tabla de cobros adicionales historicos para el EDP
      app.get("/api/reportes/v1/reportecobroadicionalhistorial", reportesController.findRepCobroAdicionalHistorial)
    */
    app.get("/api/reportes/v1/reportecobroadicionalhistorial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findRepCobroAdicionalHistorial);

    /*********************************************************************************** */
    /* Devuelve la tabla de descuentos para el EDP
      app.get("/api/reportes/v1/reportedescuentoshistorial", reportesController.findRepDescuentosHistorial)
    */
    app.get("/api/reportes/v1/reportedescuentoshistorial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findRepDescuentosHistorial);

    /*********************************************************************************** */
    /* Devuelve la tabla de resumen para el EDP
      app.get("/api/reportes/v1/reporteresumenhistorial", reportesController.findRepResumenHistorial)
    */
    app.get("/api/reportes/v1/reporteresumenhistorial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.findRepResumenHistorial);

    /*********************************************************************************** */
    /* Devuelve el detalle de PxQ para planilla Excel, ingresando parámetro del paquete
      app.get("/api/reportes/v1/detallepxqhistorial", reportesController.detallePxQHistorial)
    */
    app.get("/api/reportes/v1/detallepxqhistorial", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.detallePxQHistorial);

    /* Devuelve el resumen de las operaciones de SAE*/
    app.get("/api/reportes/v1/resumensae", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.getResumenSae);

}
