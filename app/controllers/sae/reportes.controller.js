const db = require("../../models");
const Jornada = db.jornada;
const EstadoResultado = db.estadoResultado;
const DetalleEstadoResultado = db.detalleEstadoResultado;
const Observaciones = db.observaciones;
const CobroAdicional = db.cobroAdicional;
const Descuentos = db.descuentos;
const HoraExtra = db.horaExtra;
const EstadoPago = db.estadoPago;
const Eventos = db.eventos;

exports.readAllJornada = async (req, res) => {
  //metodo GET
  /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Devuelve todas las jornadas' */
    await Jornada.findAll().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
}
/*********************************************************************************** */


/*********************************************************************************** */
/* Devuelve todos las jornadas
  app.get("/api/reportes/v1/alljornada", reportesController.findAllJornadas)
*/
exports.findAllJornadas = async (req, res) => {
  //metodo GET
  /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Devuelve todas las jornadas. Si se especifica vertodo=true devuelve todas las jornadas, en caso contrario devuelve solo las jornadas pendientes' */
    try {

      const condicion = req.query.vertodo==='true'?'':'and rj.id_estado_resultado is null';
      const sql = "SELECT rj.id, rut_maestro,(pe1.nombres || ' ' || pe1.apellido_1 || case when pe1.apellido_2 is null then '' else ' ' || \
      trim(pe1.apellido_2) end) as nombre_maestro, rut_ayudante, (pe2.nombres || ' ' || pe2.apellido_1 || case when pe2.apellido_2 is null \
      then '' else ' ' || trim(pe2.apellido_2) end) as nombre_ayudante, (substr(t.inicio::text,1,5) || ' - ' || substr(t.fin::text,1,5)) \
      as turno, patente, id_paquete as id_paquete, km_inicial, km_final, fecha_hora_ini::text, fecha_hora_fin::text, estado,  null as brigada, \
      null as tipo_turno, case when rj.coordenadas is not null then rj.coordenadas->>'latitude' else null end as latitude, case when \
      rj.coordenadas is not null then rj.coordenadas->>'longitude' else null end as longitude, 'NULO' as paquete FROM sae.reporte_jornada rj JOIN _auth.personas \
      pe1 on rj.rut_maestro = pe1.rut JOIN _auth.personas pe2 on rj.rut_ayudante = pe2.rut JOIN _comun.turnos t on rj.codigo_turno = t.id WHERE \
      brigada is null and rj.estado <> 0 " + condicion + " UNION \
      SELECT rj.id, rut_maestro, (pe1.nombres || ' ' || pe1.apellido_1 || case when pe1.apellido_2 is null then '' \
      else ' ' || trim(pe1.apellido_2) end) as nombre_maestro, rut_ayudante, (pe2.nombres || ' ' || pe2.apellido_1 || case when pe2.apellido_2 \
      is null then '' else ' ' || trim(pe2.apellido_2) end) as nombre_ayudante, br.turno as turno, patente, id_paquete as id_paquete, km_inicial, \
      km_final, fecha_hora_ini::text, fecha_hora_fin::text, estado,  br.brigada as brigada, case when tipo_turno is not null then \
      (select nombre from _comun.tipo_turno where id = rj.tipo_turno) else null end as tipo_turno, case when rj.coordenadas is not null \
      then rj.coordenadas->>'latitude' else null end as latitude, case when rj.coordenadas is not null then rj.coordenadas->>'longitude' \
      else null end as longitude, br.paquete as paquete FROM sae.reporte_jornada rj JOIN _auth.personas pe1 on rj.rut_maestro = pe1.rut JOIN _auth.personas pe2 on \
      rj.rut_ayudante = pe2.rut join (SELECT br.id, b.nombre as base, p.nombre as paquete, (substr(t.inicio::text,1,5) || ' - ' || \
      substr(t.fin::text,1,5)) as turno, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as brigada \
      FROM _comun.brigadas  br join _comun.base b on br.id_base = b.id join _comun.paquete p on b.id_paquete = p.id join _comun.turnos t on \
      br.id_turno = t.id) as br on rj.brigada = br.id WHERE rj.brigada is not null and rj.estado <> 0 " + condicion + " ORDER BY id DESC;";

      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const jornadas = await sequelize.query(sql, { type: QueryTypes.SELECT });
      let salida = [];
      if (jornadas) {
        for (const element of jornadas) {
          if (
            typeof element.id === 'number' && 
            typeof element.rut_maestro === 'string' &&
            (typeof element.nombre_maestro === 'string' || typeof element.nombre_maestro === 'object') &&
            typeof element.rut_ayudante === 'string' &&
            (typeof element.nombre_ayudante === 'string' || typeof element.nombre_ayudante === 'object') &&
            typeof element.turno === 'string' &&
            typeof element.patente === 'string' &&
            (typeof element.km_inicial === 'number' || typeof element.km_inicial === 'string') &&
            (typeof element.km_final === 'number' || typeof element.km_final === 'string') &&
            (typeof element.fecha_hora_ini === 'string' || typeof element.fecha_hora_ini === 'object') &&
            (typeof element.fecha_hora_fin === 'string' || typeof element.fecha_hora_fin === 'object') &&
            typeof element.estado === 'number' &&
            (typeof element.brigada === 'string' || typeof element.brigada === 'object') &&
            (typeof element.tipo_turno === 'string' || typeof element.tipo_turno === 'object') &&
            (typeof element.latitude === 'string' || typeof element.latitude === 'object') &&
            (typeof element.longitude === 'string' || typeof element.longitude === 'object') &&
            (typeof element.paquete === 'string' || typeof element.paquete === 'object'))  {

              const detalle_salida = {

                id: Number(element.id),
                rut_maestro: String(element.rut_maestro),
                nombre_maestro: String(element.nombre_maestro),
                rut_ayudante: String(element.rut_ayudante),
                nombre_ayudante: String(element.nombre_ayudante),
                turno: String(element.turno),
                patente: String(element.patente),
                paquete: String(element.paquete),
                km_inicial: String(element.km_inicial),
                km_final: String(element.km_final),
                fecha_hora_ini: String(element.fecha_hora_ini),
                fecha_hora_fin: String(element.fecha_hora_fin),
                estado: Number(element.estado),
                brigada: String(element.brigada),
                tipo_turno: String(element.tipo_turno),
                coordenadas: {
                  latitude: String(element.latitude),
                  longitude: String(element.longitude)
                }

              }
              salida.push(detalle_salida);

          }else {
              //console.log('else ok', element.id);
              salida=undefined;
              break;
          }
        };
      }
      if (salida===undefined){
        res.status(500).send("Error en la consulta (servidor backend)");
      }else{
        res.status(200).send(salida);
      }
    } catch (error) {
      res.status(500).send(error);
    }
    
  }
/*********************************************************************************** */
/* Actualiza la fecha de Jornada por Id de jornada
  app.put("/api/reportes/v1/updatejornada", reportesController.updateJornada)
*/
  exports.updateJornada = async (req, res) => {
    /* #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Actualiza las fechas de inicio y final de Jornada por Id de jornada' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos para actualizar, No son obligatorios, llenar sólo los que se necesiten',
            required: true,
            schema: {
                rut_maestro: "17332391-3",
                rut_ayudante: "17332391-3",
                patente: "AABB00",
                km_inicial: 1,
                km_final: 1,
                fecha_hora_ini: "2023-10-30 12:00:00",
                fecha_hora_fin: "2023-10-30 12:00:00",
                brigada: 1,
                tipo_turno: 1,
                coordenada_x: '34.23',
                coordenada_y: '-54.34'
            }
        }*/
    try {
      const id = req.params.id;
      const jornada = {
        rut_maestro: req.body.rut_maestro,
        rut_ayudante: req.body.rut_ayudante,
        patente: req.body.patente,
        km_inicial: req.body.km_inicial,
        km_final: req.body.km_final,
        fecha_hora_ini: req.body.fecha_hora_ini,
        fecha_hora_fin: req.body.fecha_hora_fin,
        brigada: req.body.brigada,
        tipo_turno: req.body.tipo_turno,
        coordenadas: {
          latitude: String(req.body.coordenada_x),
          longitude: String(req.body.coordenada_y)
        }
      };
      await Jornada.update(jornada, { where: { id: id } })
        .then(data => {
          if (data == 1) {
            res.send({ message: "Jornada actualizada" });
          } else {
            res.status(500).send({ message: "No se pudo actualizar la jornada" });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: `No se pudo actualizar la jornada con el id=${id}`
          });
        });
    } catch (error) {
      res.status(500).send(error);
    }

  }
/*********************************************************************************** */
/* Crea una jornada nueva 
  app.post("/api/reportes/v1/creajornada", reportesController.creaJornada)
*/
  exports.creaJornada = async (req, res) => {
    /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Crea una nueva jornada' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos para crear una Jornada',
            required: true,
            schema: {
                rut_maestro: "17332391-3",
                rut_ayudante: "17332391-3",
                patente: "AABB00",
                km_inicial: 1,
                km_final: 1,
                fecha_hora_ini: "2023-10-30 12:00:00",
                fecha_hora_fin: "2023-10-30 12:00:00",
                brigada: 1,
                tipo_turno: 1,
                coordenada_x: '34.23',
                coordenada_y: '-54.34'
            }
        }*/
    try {
      const campos = [
        'rut_maestro',
        'rut_ayudante',
        'patente',
        'km_inicial',
        'km_final',
        'fecha_hora_ini',
        'fecha_hora_fin',
        'brigada',
        'tipo_turno'
      ];
      for (const element of campos) {
        if (!req.body[element]) {
          res.status(400).send({
            message: "No puede estar nulo el campo " + element
          });
          return;
        }
      };


      const jornada = {
        rut_maestro: req.body.rut_maestro,
        rut_ayudante: req.body.rut_ayudante,
        patente: req.body.patente,
        km_inicial: req.body.km_inicial,
        km_final: req.body.km_final,
        fecha_hora_ini: req.body.fecha_hora_ini,
        fecha_hora_fin: req.body.fecha_hora_fin,
        brigada: req.body.brigada,
        tipo_turno: req.body.tipo_turno,
        coordenadas: {
          latitude: String(req.body.coordenada_x),
          longitude: String(req.body.coordenada_y)
        },
        estado: 1
      };
      await Jornada.create(jornada)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Error al crear la jornada"
          });
        });
    } catch (error) {
      res.status(500).send(error);
    }

  }
  /*********************************************************************************** */
/* Elimina una jornada por id de jornada 
  app.delete("/api/reportes/v1/deletejornada", reportesController.deleteJornada)
*/
  exports.deleteJornada = async (req, res) => {
    // metodo DELETE
    /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Elimina una jornada por id de jornada' */
    try {
      const id = req.params.id;
      const jornada = {
        estado: 0
      };
      await Jornada.update(jornada, { where: { id: id } })
        .then(data => {
          if (data == 1) {
            res.send({ message: "Jornada marcada como eliminada" });
          } else {
            res.status(500).send({ message: "No se pudo eliminar la jornada" });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: `No se pudo actualizar la jornada con el id=${id}`
          });
        });
    } catch (error) {
      res.status(500).send(error);
    }

  }

/*********************************************************************************** */
/* Devuelve detalle de eventos
  app.get("/api/reportes/v1/alleventos", reportesController.findAllEventos)
*/
  exports.findAllEventos = async (req, res) => {
    //metodo GET
    /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Devuelve todos los eventos' */
    try {
      const condicion = req.query.vertodo==='true'?'':'and e.id_estado_resultado is null';
      const sql = "SELECT e.id, e.numero_ot, et.descripcion as tipo_evento, e.rut_maestro, (pe1.nombres || ' ' || pe1.apellido_1 || case when pe1.apellido_2 \
      is null then '' else ' ' || trim(pe1.apellido_2) end) as nombre_maestro, e.rut_ayudante, (pe2.nombres || ' ' || pe2.apellido_1 || case \
      when pe2.apellido_2 is null then '' else ' ' || trim(pe2.apellido_2) end) as nombre_ayudante, (substr(t.inicio::text,1,5) || ' - ' || \
      substr(t.fin::text,1,5)) as turno, p.nombre as paquete, e.requerimiento, e.direccion, e.fecha_hora::text, e.estado, null as hora_inicio, \
      null as hora_termino, null as brigada, null as tipo_turno, null as comuna, null as despachador, case when e.coordenadas is not null  \
      then e.coordenadas->>'latitude' else null end as latitude, case when e.coordenadas is not null then e.coordenadas->>'longitude' else \
      null end as longitude, e.trabajo_solicitado, e.trabajo_realizado, e.patente FROM sae.reporte_eventos e JOIN _auth.personas pe1 on e.rut_maestro = pe1.rut JOIN _auth.personas pe2 on \
      e.rut_ayudante = pe2.rut join _comun.eventos_tipo et on e.tipo_evento = et.codigo join _comun.turnos t on e.codigo_turno = t.id join \
      _comun.paquete p on e.id_paquete = p.id WHERE brigada is null and e.estado <> 0 " + condicion + " UNION \
      SELECT e.id, e.numero_ot, et.descripcion as tipo_evento, e.rut_maestro, \
      (pe1.nombres || ' ' || pe1.apellido_1 || case when pe1.apellido_2 is null then '' else ' ' || trim(pe1.apellido_2) end) as nombre_maestro, \
      e.rut_ayudante, (pe2.nombres || ' ' || pe2.apellido_1 || case when pe2.apellido_2 is null then '' else ' ' || trim(pe2.apellido_2) end) as \
      nombre_ayudante, br.turno as turno, br.paquete as paquete, e.requerimiento, e.direccion, e.fecha_hora::text, e.estado, hora_inicio, \
      hora_termino, br.brigada as brigada, case when tipo_turno is not null then (select nombre from _comun.tipo_turno where id = e.tipo_turno) \
      else null end as tipo_turno, case when e.comuna is not null then (select nombre from _comun.comunas where codigo = e.comuna ) else null \
      end as comuna, e.despachador, case when e.coordenadas is not null then e.coordenadas->>'latitude' else null end as latitude, case when \
      e.coordenadas is not null then e.coordenadas->>'longitude' else null end as longitude, e.trabajo_solicitado, e.trabajo_realizado, e.patente FROM sae.reporte_eventos e JOIN _auth.personas pe1 \
      on e.rut_maestro = pe1.rut JOIN _auth.personas pe2 on e.rut_ayudante = pe2.rut join _comun.eventos_tipo et on e.tipo_evento = et.codigo \
      join (SELECT br.id, b.nombre as base, p.nombre as paquete, (substr(t.inicio::text,1,5) || ' - ' || substr(t.fin::text,1,5)) as turno, \
      (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as brigada FROM _comun.brigadas  br join \
      _comun.base b on br.id_base = b.id join _comun.paquete p on b.id_paquete = p.id join _comun.turnos t on br.id_turno = t.id) as br \
      on e.brigada = br.id WHERE e.brigada is not null and e.estado <> 0 " + condicion + " order by fecha_hora desc, id desc;";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const eventos = await sequelize.query(sql, { type: QueryTypes.SELECT });
      let salida = [];
      if (eventos) {
        for (const element of eventos) {
          if (
            typeof element.id === 'number' && 
            typeof element.numero_ot === 'string' &&
            typeof element.tipo_evento === 'string' &&
            typeof element.rut_maestro === 'string' &&
            (typeof element.nombre_maestro === 'string' || typeof element.nombre_maestro === 'object') &&
            typeof element.rut_ayudante === 'string' &&
            (typeof element.nombre_ayudante === 'string' || typeof element.nombre_ayudante === 'object') &&
            typeof element.turno === 'string' &&
            typeof element.paquete === 'string' &&
            (typeof element.requerimiento === 'string' || typeof element.requerimiento === 'object') &&
            typeof element.direccion === 'string' &&
            (typeof element.fecha_hora === 'object' || typeof element.fecha_hora === 'string') &&
            typeof element.estado === 'number' &&
            (typeof element.hora_inicio === 'string' || typeof element.hora_inicio === 'object') &&
            (typeof element.hora_termino === 'string' || typeof element.hora_termino === 'object') &&
            (typeof element.brigada === 'string' || typeof element.brigada === 'object') &&
            (typeof element.tipo_turno === 'string' || typeof element.tipo_turno === 'object') &&
            (typeof element.comuna === 'string' || typeof element.comuna === 'object') &&
            (typeof element.despachador === 'string' || typeof element.despachador === 'object') &&
            (typeof element.latitude === 'string' || typeof element.latitude === 'object') &&
            (typeof element.longitude === 'string' || typeof element.longitude === 'object') &&
            (typeof element.trabajo_solicitado === 'string' || typeof element.trabajo_solicitado === 'object') &&
            (typeof element.trabajo_realizado === 'string' || typeof element.trabajo_realizado === 'object') &&
            (typeof element.patente === 'string' || typeof element.patente === 'object')) {

              const detalle_salida = {

                id: Number(element.id),
                numero_ot: String(element.numero_ot),
                tipo_evento: String(element.tipo_evento),
                rut_maestro: String(element.rut_maestro),
                nombre_maestro: String(element.nombre_maestro),
                rut_ayudante: String(element.rut_ayudante),
                nombre_ayudante: String(element.nombre_ayudante),
                turno: String(element.turno),
                paquete: String(element.paquete),
                requerimiento: String(element.requerimiento),
                direccion: String(element.direccion),
                fecha_hora: String(element.fecha_hora),
                estado: Number(element.estado),
                hora_inicio: String(element.hora_inicio),
                hora_termino: String(element.hora_termino),
                brigada: String(element.brigada),
                tipo_turno: String(element.tipo_turno),
                comuna: String(element.comuna),
                despachador: String(element.despachador),
                coordenadas: {
                  latitude: String(element.latitude),
                  longitude: String(element.longitude)
                },
                trabajo_solicitado: String(element.trabajo_solicitado),
                trabajo_realizado: String(element.trabajo_realizado),
                patente: String(element.patente)

              }
              salida.push(detalle_salida);

          }else {
              salida=undefined;
              break;
          }
        };
      }
      if (salida===undefined){
        res.status(500).send("Error en la consulta (servidor backend)");
      }else{
        res.status(200).send(salida);
      }
    } catch (error) {
      res.status(500).send(error);
    }
    
  }
/*********************************************************************************** */
/*********************************************************************************** */
/* Crea un nuevo evento  
  app.post("/api/reportes/v1/creaevento", reportesController.creaEvento)
*/
exports.creaEvento = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Crea una evento nuevo' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos para crear un evento',
            required: true,
            schema: {
                numero_ot: '123456',
                tipo_evento: 'DOMIC',
                rut_maestro: '17332391-3',
                rut_ayudante: '17332391-3',
                direccion: 'calle uno 123',
                fecha_hora: '2023-01-01 12:00:00',
                coordenada_x: '34.23',
                coordenada_y: '-56.34',
                hora_inicio: '12:00',
                hora_termino: '13:00',
                brigada: 1,
                comuna: '07301',
                despachador: 'Miguel Soto',
                tipo_turno: 2,
                patente: 'AABB00',
                trabajo_solicitado: ' Trabajo solicitado',
                trabajo_realizado: ' Trabajo realizado',
            }
        }*/

  try {

    const num_ot = await Eventos.findOne({
      where: {
        numero_ot: req.body.numero_ot,
      },
    });

    if (num_ot) {
      return res.status(404).send({ message: "El número de OT ya existe" });
    }

    const campos = [
      'numero_ot',
      'tipo_evento',
      'rut_maestro',
      'rut_ayudante',
      'direccion',
      'fecha_hora',
      'hora_inicio',
      'hora_termino',
      'brigada',
      'comuna',
      'despachador',
      'tipo_turno',
      'patente',
      'trabajo_solicitado',
      'trabajo_realizado'
    ];
    for (const element of campos) {
      if (!req.body[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };


    const evento = {
      numero_ot: req.body.numero_ot,
      tipo_evento: req.body.tipo_evento,
      rut_maestro: req.body.rut_maestro,
      rut_ayudante: req.body.rut_ayudante,
      direccion: req.body.direccion,
      fecha_hora: req.body.fecha_hora,
      coordenadas: {
        latitude: String(req.body.coordenada_x),
        longitude: String(req.body.coordenada_y)
      },
      hora_inicio: req.body.hora_inicio,
      hora_termino: req.body.hora_termino,
      brigada: req.body.brigada,
      comuna: req.body.comuna,
      despachador: req.body.despachador,
      tipo_turno: req.body.tipo_turno,
      patente: req.body.patente,
      trabajo_solicitado: req.body.trabajo_solicitado,
      trabajo_realizado: req.body.trabajo_realizado,
      estado: 1
      
    };

    await Eventos.create(evento)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Error al crear el evento"
        });
      });
  } catch (error) {
    res.status(500).send(error);
  }

}

/*********************************************************************************** */
/* Actualiza la fecha de Evento por Id de evento
  app.put("/api/reportes/v1/updateevento", reportesController.updateEvento)
*/
  exports.updateEvento = async (req, res) => {
    /* #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Actualiza la fecha de Evento por Id de evento' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos para actualizar, No son obligatorios, llenar sólo los que se necesiten',
            required: true,
            schema: {
                numero_ot: '123456',
                tipo_evento: 'DOMIC',
                rut_maestro: '17332391-3',
                rut_ayudante: '17332391-3',
                direccion: 'calle uno 123',
                fecha_hora: '2023-01-01 12:00:00',
                coordenada_x: '34.23',
                coordenada_y: '-56.34',
                hora_inicio: '12:00',
                hora_termino: '13:00',
                brigada: 1,
                comuna: '07301',
                despachador: 'Miguel Soto',
                tipo_turno: 2,
                patente: 'AABB00',
                trabajo_solicitado: ' Trabajo solicitado',
                trabajo_realizado: ' Trabajo realizado',
            }
        }*/
    const { Op } = require("sequelize");
    try {

      const id = req.params.id;
      if (req.body.numero_ot) {
        const num_ot = await Eventos.findOne({
          where: {
            [Op.and]: [{
              numero_ot: req.body.numero_ot
            },
            { id: { [Op.ne]: id } }
          ]
          },
        });
    
        if (num_ot) {
          return res.status(404).send({ message: "El número de OT está asociado a otro evento" });
        }
      }
      
      const evento = {
        numero_ot: req.body.numero_ot,
        tipo_evento: req.body.tipo_evento,
        rut_maestro: req.body.rut_maestro,
        rut_ayudante: req.body.rut_ayudante,
        direccion: req.body.direccion,
        fecha_hora: req.body.fecha_hora,
        coordenadas: {
          latitude: String(req.body.coordenada_x),
          longitude: String(req.body.coordenada_y)
        },
        hora_inicio: req.body.hora_inicio,
        hora_termino: req.body.hora_termino,
        brigada: req.body.brigada,
        comuna: req.body.comuna,
        despachador: req.body.despachador,
        tipo_turno: req.body.tipo_turno,
        patente: req.body.patente,
        trabajo_solicitado: req.body.trabajo_solicitado,
        trabajo_realizado: req.body.trabajo_realizado
      };

      await Eventos.update(evento, { where: { id: id } })
        .then(data => {
          if (data == 1) {
            res.send({ message: "Evento actualizado" });
          } else {
            res.status(500).send({ message: "No se pudo actualizar el evento" });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: `No se pudo actualizar el evento con el id=${id}`
          });
        });
    } catch (error) {
      res.status(500).send(error);
    }
  }


/*********************************************************************************** */
/* Crea un estado resultado
  app.post("/api/reportes/v1/creaestadoresultado", reportesController.creaEstadoResultado)
*/
  exports.creaEstadoResultado = async (req, res) => {
    //metodo POST
    /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Crea un estado resultado' */
    try {
      const campos = [
        'id_usuario', 
        'zona', 
        'paquete', 
        'mes', 
        'fecha_inicio', 
        'fecha_final', 
        'nombre_doc', 
        'url_doc', 
        'fecha_creacion', 
        'fecha_modificacion', 
        'estado', 
        'eventos_relacionados',
        'id_cliente'
      ];
      for (const element of campos) {
        if (!req.body[element]) {
          res.status(400).send({
            message: "No puede estar nulo el campo " + element
          });
          return;
        }
      };

      const detalles = req.body.eventos_relacionados;
      
      const estadoResultado = await EstadoResultado.create({
        id_usuario: req.body.id_usuario,
        zona: req.body.zona,
        paquete: req.body.paquete,
        mes: req.body.mes,
        fecha_inicio: req.body.fecha_inicio,
        fecha_final: req.body.fecha_final,
        nombre_doc: req.body.nombre_doc,
        url_doc: req.body.url_doc,
        fecha_creacion: req.body.fecha_creacion,
        fecha_modificacion: req.body.fecha_modificacion,
        estado: req.body.estado,
        id_cliente: req.body.id_cliente
      }).then(async data => {
            let hayError = false;
            let mensajeError = '';
            for (const detalle of detalles) {
              await DetalleEstadoResultado.create({
                id_estado_resultado: data.id,
                id_evento: detalle
              }).then(data => {
                //data ok
              }).catch(err => {
                hayError = true;
                mensajeError = err.message;
                //mensaje de error
                return;
              });
            }
            if (!hayError) {
              res.send(data);
            }else {
              res.status(500).send({ message: mensajeError });
            }
      }).catch(err => {
        res.status(500).send({ message: err.message });
      });
      
    } catch (error) {
      res.status(500).send(error);
    }
  }
/*********************************************************************************** */
  /*********************************************************************************** */
/* Elimina un evento por id de evento 
  app.delete("/api/reportes/v1/deleteevento", reportesController.deleteEvento)
*/
  exports.deleteEvento = async (req, res) => {
    // metodo DELETE
    /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Elimina un evento pr id de jornada' */
      try {
        const id = req.params.id;
        const evento = {
          estado: 0
        };
        await Eventos.update(evento, { where: { id: id } })
          .then(data => {
            if (data == 1) {
              res.send({ message: "Evento marcado como eliminado" });
            } else {
              res.status(500).send({ message: "No se pudo eliminar el evento" });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: `No se pudo actualizar el evento con el id=${id}`
            });
          });
      } catch (error) {
        res.status(500).send(error);
      }
  }

/*********************************************************************************** */
/* Devuelve el reporte de estado con los eventos asociados
  app.get("/api/reportes/v1/allestadosresultado", reportesController.findAllEstadosResultado)
*/
  exports.findAllEstadosResultado = async (req, res) => {
    //metodo POST
    /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Devuelve todos los estados de resultado' */
    try {
      const sql = "SELECT er.id, id_usuario, u.username as nombre_usuario, zona, z.nombre as nombre_zona, paquete, \
      p.nombre as nombre_paquete, mes, m.nombre as nombre_mes, fecha_inicio::text, fecha_final::text, nombre_doc, url_doc, \
      fecha_creacion::text, fecha_modificacion::text, estado, (SELECT array_agg(id_evento) as eventos FROM sae.reporte_detalle_estado_resultado  \
      where id_estado_resultado = er.id) as eventos_relacionados	FROM sae.reporte_estado_resultado er INNER JOIN _auth.users u \
      on er.id_usuario = u.id	INNER JOIN _comun.zonal z on z.id = er.zona	INNER JOIN _comun.paquete p on p.id = er.paquete	\
      INNER JOIN _comun.meses m on m.id = er.mes;";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const estadosResultado = await sequelize.query(sql, { type: QueryTypes.SELECT });
      let salida = [];
      if (estadosResultado) {
        for (const element of estadosResultado) {

          if (
            typeof element.id === 'number' && 
            typeof element.id_usuario === 'number' &&
            typeof element.nombre_usuario === 'string' &&
            typeof element.zona === 'number' &&
            typeof element.nombre_zona === 'string' &&
            typeof element.paquete === 'number' &&
            typeof element.nombre_paquete === 'string' &&
            typeof element.mes === 'number' &&
            typeof element.nombre_mes === 'string' &&
            (typeof element.fecha_inicio === 'object' || typeof element.fecha_inicio === 'string') &&
            (typeof element.fecha_final === 'object' || typeof element.fecha_final === 'string') &&
            typeof element.nombre_doc === 'string' &&
            typeof element.url_doc === 'string' &&
            (typeof element.fecha_creacion === 'object' || typeof element.fecha_creacion === 'string') &&
            (typeof element.fecha_modificacion === 'object' || typeof element.fecha_modificacion === 'string') &&
            typeof element.estado === 'number' &&
            typeof element.eventos_relacionados === 'object' ) { //Este campo es de tipo array integer[]

              const detalle_salida = {

                id: Number(element.id),
                id_usuario: Number(element.id_usuario),
                nombre_usuario: String(element.nombre_usuario),
                zona: Number(element.zona),
                nombre_zona: String(element.nombre_zona),
                paquete: Number(element.paquete),
                nombre_paquete: String(element.nombre_paquete),
                mes: Number(element.mes),
                nombre_mes: String(element.nombre_mes),
                fecha_inicio: String(element.fecha_inicio),
                fecha_final: String(element.fecha_final),
                nombre_doc: String(element.nombre_doc),
                url_doc: String(element.url_doc),
                fecha_creacion: String(element.fecha_creacion),
                fecha_modificacion: String(element.fecha_modificacion),
                estado: Number(element.estado),
                eventos_relacionados: element.eventos_relacionados

              }
              salida.push(detalle_salida);

          }else {
              salida = undefined;
              break;
          }
        };
      }
      if (salida===undefined){
        res.status(500).send("Error en la consulta (servidor backend)");
      }else{
        res.status(200).send(salida);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
/*********************************************************************************** */


/*********************************************************************************** */
/* Devuelve resumen de eventos
  app.get("/api/reportes/v1/resumeneventos", reportesController.resumenEventos)
*/
exports.resumenEventos = async (req, res) => {
  //metodo GET
  /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Devuelve el resumen de eventos por paquete y rango de fechas' */
  try {
    const campos = [
      'id_paquete', 'fecha_inicial', 'fecha_final'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    const sql = "SELECT e.id_paquete, e.tipo_evento, et.id as id_tipo_evento, et.descripcion as glosa_evento, \
    pb.valor as precio, count(e.id) as cantidad, (pb.valor*count(e.id)) as monto from sae.reporte_eventos e \
    inner join _comun.eventos_tipo et on et.codigo = e.tipo_evento inner join (SELECT distinct on \
      (id_cliente, id_paquete, id_evento_tipo) id_cliente, id_paquete, id_evento_tipo, valor FROM \
      sae.precios_base ORDER BY id_cliente, id_paquete, id_evento_tipo ASC ) as pb on et.id = \
      pb.id_evento_tipo and e.id_paquete = pb.id_paquete and pb.id_cliente = 1 where estado = 1 and \
      e.id_paquete = :id_paquete and (fecha_hora between date :fec_ini and date :fec_fin) group by \
      e.id_paquete, e.tipo_evento, et.id, et.descripcion, pb.valor;";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const eventos = await sequelize.query(sql, { replacements: { id_paquete: req.query.id_paquete, fec_ini: req.query.fecha_inicial, fec_fin: req.query.fecha_final }, type: QueryTypes.SELECT });
    let salida = [];
    if (eventos) {
      for (const element of eventos) {
        if (
          typeof element.id_paquete === 'number' && 
          typeof element.tipo_evento === 'string' &&
          typeof element.id_tipo_evento === 'number' &&
          typeof element.glosa_evento === 'string' &&
          (typeof element.precio === 'number' || typeof element.precio === 'string') &&
          (typeof element.cantidad === 'number' || typeof element.cantidad === 'string') &&
          (typeof element.monto === 'number' || typeof element.monto === 'string')) {

            const detalle_salida = {

              id_paquete: Number(element.id_paquete),
              tipo_evento: String(element.tipo_evento),
              id_tipo_evento: Number(element.id_tipo_evento),
              glosa_evento: String(element.glosa_evento),
              precio: Number(element.precio),
              cantidad: Number(element.cantidad),
              monto: Number(element.monto)

            }
            salida.push(detalle_salida);

        }else {
            salida===undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send(salida);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
/*********************************************************************************** */


/*********************************************************************************** */
/* Devuelve resumen de turnos
  app.get("/api/reportes/v1/resumenturnos", reportesController.resumenTurnos)
*/
exports.resumenTurnos = async (req, res) => {
  // metodo GET
  /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Devuelve el resumen de turnos por paquete y rango de fechas' */
  try {
    const campos = [
      'id_paquete', 'fecha_inicial', 'fecha_final'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    const sql = "select r.*, (r.cantidad_brigada*r.precio*r.uso_semanal)::integer as monto from \
    (SELECT id_paquete, id_turno, (substring(t.inicio::text,1,5) || ' - ' || substring(t.fin::text,1,5)) as permanencia_semanal, \
    cantidad_brigada, valor as precio, ((date :fec_fin - (date :fec_ini - 1))::numeric/7)::numeric(6,4) \
    as uso_semanal 	FROM sae.cargo_fijo cf inner join _comun.turnos t on t.id = cf.id_turno where id_cliente = 1 and id_paquete = :id_paquete) r;";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const eventos = await sequelize.query(sql, { replacements: { id_paquete: req.query.id_paquete, fec_ini: req.query.fecha_inicial, fec_fin: req.query.fecha_final }, type: QueryTypes.SELECT });
    let salida = [];
    if (eventos) {
      for (const element of eventos) {
        if (
          typeof element.id_paquete === 'number' && 
          typeof element.id_turno === 'number' &&
          typeof element.permanencia_semanal === 'string' &&
          typeof element.cantidad_brigada === 'number' &&
          (typeof element.precio === 'number' || typeof element.precio === 'string') &&
          (typeof element.uso_semanal === 'number' || typeof element.uso_semanal === 'string') &&
          typeof element.monto === 'number') {

            const detalle_salida = {

              id_paquete: Number(element.id_paquete),
              id_turno: Number(element.id_turno),
              permanencia_semanal: String(element.permanencia_semanal),
              cantidad_brigada: Number(element.cantidad_brigada),
              precio: Number(element.precio),
              uso_semanal: Number(element.uso_semanal),
              monto: Number(element.monto)

            }
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send(salida);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
/*********************************************************************************** */

/*********************************************************************************** */
/* Devuelve resumen de todos los eventos, no considera paquete
  app.get("/api/reportes/v1/resumenalleventos", reportesController.resumenAllEventos)
*/
exports.resumenAllEventos = async (req, res) => {
  //metodo GET
  /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Devuelve el resumen de eventos por paquete y rango de fechas' */
  try {
    const campos = [
      'fecha_inicial', 'fecha_final'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    const sql = "SELECT e.id_paquete, e.tipo_evento, et.id as id_tipo_evento, et.descripcion as glosa_evento, \
    pb.valor as precio, count(e.id) as cantidad, (pb.valor*count(e.id)) as monto from sae.reporte_eventos e \
    inner join _comun.eventos_tipo et on et.codigo = e.tipo_evento inner join (SELECT distinct on \
      (id_cliente, id_paquete, id_evento_tipo) id_cliente, id_paquete, id_evento_tipo, valor FROM \
      sae.precios_base ORDER BY id_cliente, id_paquete, id_evento_tipo ASC ) as pb on et.id = \
      pb.id_evento_tipo and e.id_paquete = pb.id_paquete and pb.id_cliente = 1 where estado = 1 and \
      (fecha_hora between date :fec_ini and date :fec_fin) group by \
      e.id_paquete, e.tipo_evento, et.id, et.descripcion, pb.valor;";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const eventos = await sequelize.query(sql, { replacements: { fec_ini: req.query.fecha_inicial, fec_fin: req.query.fecha_final }, type: QueryTypes.SELECT });
    let salida = [];
    if (eventos) {
      for (const element of eventos) {
        if (
          typeof element.id_paquete === 'number' && 
          typeof element.tipo_evento === 'string' &&
          typeof element.id_tipo_evento === 'number' &&
          typeof element.glosa_evento === 'string' &&
          (typeof element.precio === 'number' || typeof element.precio === 'string') &&
          (typeof element.cantidad === 'number' || typeof element.cantidad === 'string') &&
          (typeof element.monto === 'number' || typeof element.monto === 'string')) {

            const detalle_salida = {

              id_paquete: Number(element.id_paquete),
              tipo_evento: String(element.tipo_evento),
              id_tipo_evento: Number(element.id_tipo_evento),
              glosa_evento: String(element.glosa_evento),
              precio: Number(element.precio),
              cantidad: Number(element.cantidad),
              monto: Number(element.monto)

            }
            salida.push(detalle_salida);

        }else {
            salida===undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send(salida);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
/*********************************************************************************** */

/*********************************************************************************** */
/* Devuelve resumen de todos los turnos
  app.get("/api/reportes/v1/resumenallturnos", reportesController.resumenTurnos)
*/
exports.resumenAllTurnos = async (req, res) => {
  // metodo GET
  /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Devuelve el resumen de turnos por paquete y rango de fechas' */
  try {
    const campos = [
      'fecha_inicial', 'fecha_final'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    
    const sql = "select r.*, (r.cantidad_brigada*r.precio*r.uso_semanal)::integer as monto from \
    (SELECT id_paquete, id_turno, (substring(t.inicio::text,1,5) || ' - ' || substring(t.fin::text,1,5)) as permanencia_semanal, \
    cantidad_brigada, valor as precio, ((date :fec_fin - (date :fec_ini - 1))::numeric/7)::numeric(6,4) \
    as uso_semanal 	FROM sae.cargo_fijo cf inner join _comun.turnos t on t.id = cf.id_turno where id_cliente = 1) r;";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const eventos = await sequelize.query(sql, { replacements: { fec_ini: req.query.fecha_inicial, fec_fin: req.query.fecha_final }, type: QueryTypes.SELECT });
    let salida = [];
    if (eventos) {
      for (const element of eventos) {
        if (
          typeof element.id_paquete === 'number' && 
          typeof element.id_turno === 'number' &&
          typeof element.permanencia_semanal === 'string' &&
          typeof element.cantidad_brigada === 'number' &&
          (typeof element.precio === 'number' || typeof element.precio === 'string') &&
          (typeof element.uso_semanal === 'number' || typeof element.uso_semanal === 'string') &&
          typeof element.monto === 'number') {

            const detalle_salida = {

              id_paquete: Number(element.id_paquete),
              id_turno: Number(element.id_turno),
              permanencia_semanal: String(element.permanencia_semanal),
              cantidad_brigada: Number(element.cantidad_brigada),
              precio: Number(element.precio),
              uso_semanal: Number(element.uso_semanal),
              monto: Number(element.monto)

            }
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send(salida);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
/*********************************************************************************** */

/*********************************************************************************** */
/* Ingresa las observaciones para un estado de pago
  app.post("/api/reportes/v1/creaobservaciones", reportesController.creaObservaciones)
*/
exports.creaObservaciones = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Observaciones']
      #swagger.description = 'Ingresa las observaciones para un estado de pago' */
  try {
    const campos = [
      'detalle', 'fecha_hora'
    ];
    for (const element of campos) {
      if (!req.body[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    let param_fecha_ini = req.body.fecha_hora?req.body.fecha_hora:undefined;
    /*
    let fecha = "";
    if (param_fecha_ini.length == 10){
        if (param_fecha_ini.slice(2,3) == "-"){
            param_fecha_ini = param_fecha_ini.slice(6,10) + '-' + param_fecha_ini.slice(3,5)+ '-' + param_fecha_ini.slice(0,2);
        }
        param_fecha_ini = param_fecha_ini + " 23:59:59";
        fecha = new Date(param_fecha_ini).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2);
    }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
    }*/



    const observaciones = {
      detalle: req.body.detalle,
      fecha_hora: param_fecha_ini,
      estado: 1
    };

    const observacionesCreate = await Observaciones.create(observaciones)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    
  }catch (error) {
    res.status(500).send(error);
  }
}
/*********************************************************************************** */
/* Actualiza las observaciones para un estado de pago
  app.post("/api/reportes/v1/updateobservaciones", reportesController.updateObservaciones)
*/
exports.updateObservaciones = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Observaciones']
      #swagger.description = 'Actualiza las observaciones para un estado de pago' */
      try{
        const id = req.params.id;
        let fecha;
        /*
        if (req.body.fecha_hora){
          
          fecha = new Date(req.body.fecha_hora).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
          fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2);
          
          fecha = req.body.fecha_hora
        }else{
          fecha = undefined;
        }*/
        const observaciones = {
          detalle: req.body.detalle?req.body.detalle:undefined,
          fecha_hora: req.body.fecha_hora?req.body.fecha_hora:undefined,
          estado: req.body.estado?req.body.estado:undefined
        };
        await Observaciones.update(observaciones, {
          where: { id: id }
        }).then(data => {
          if (data[0] === 1) {
            res.send({ message: "Oservaciones actualizadas" });
          } else {
            res.send({ message: `No existe una observacione con el id ${id}` });
          }
        }).catch(err => {
          res.status(500).send({ message: err.message });
        })
      }catch (error) {
        res.status(500).send(error);
      };

}
/*********************************************************************************** */
/* Elimina una observacion para un estado de pago
  app.post("/api/reportes/v1/deleteobservaciones", reportesController.deleteObservaciones)
*/
exports.deleteObservaciones = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Observaciones']
      #swagger.description = 'Elimina una observacion para un estado de pago' */
  try{
    const id = req.params.id;
    await Observaciones.destroy({
      where: { id: id }
    }).then(data => {
      if (data === 1) {
        res.send({ message: "Observacion eliminada" });
      } else {
        res.send({ message: `No existe una observacion con el id ${id}` });
      }
    }).catch(err => {
      res.status(500).send({ message: err.message });
    })
  }catch (error) {
    res.status(500).send(error);
  }

}
/*********************************************************************************** */
/* Devuelve todas las observaciones 
  app.post("/api/reportes/v1/findallobservaciones", reportesController.findallObservaciones)
*/
exports.findallObservaciones = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Observaciones']
      #swagger.description = 'Devuelve todas las observaciones ' */
  await Observaciones.findAll().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
}
/*********************************************************************************** */
/* Devuelve las observacion por parametros
  app.post("/api/reportes/v1/findobservaciones", reportesController.findObservacionesByParams)
*/
exports.findObservacionesByParams = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Observaciones']
      #swagger.description = 'Devuelve las observacion por campos' */
      try{
        const parametros = {
          id: req.query.id,
          id_estado_resultado: req.query.id_estado_resultado
        }
        const keys = Object.keys(parametros)
        let sql_array = [];
        let param = {};
        for (element of keys) {
          if (parametros[element]){
            sql_array.push( element + " = :" + element);
            param[element] = parametros[element];
          }
        }
        const where = sql_array.join(" AND ");

        if (sql_array.length === 0) {
          res.status(500).send("Debe incluir algun parametro para consultar");
        }else {
          await Observaciones.findAll({
            where: param
          }).then(data => {
            res.send(data);
          }).catch(err => {
            res.status(500).send({ message: err.message });
          })
        }
        
  
    }catch (error) {
      res.status(500).send(error);
    }

}
/*********************************************************************************** */
/* Devuelve las observaciones no procesadas, id_estado_resultado=null
  app.post("/api/reportes/v1/observacionesnoprocesadas", reportesController.findObservacionesNoProcesadas)
*/
exports.findObservacionesNoProcesadas = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Observaciones']
      #swagger.description = 'Devuelve las observaciones no procesadas' */
  await Observaciones.findAll({
    where: {
      id_estado_resultado: null
    }
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
}

/*********************************************************************************** */
/* Devuelve los cargos fijo por semana
  app.post("/api/reportes/v1/semanal_por_brigada", reportesController.semanalByBrigada)
*/
exports.semanalByBrigada = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve los cargos fijo por semana' */

      // metodo GET
  /*  #swagger.tags = ['SAE - Backoffice - Reportes']
      #swagger.description = 'Devuelve el resumen de turnos por paquete y rango de fechas' */
  try {
    
    const sql = "select nombre_precio, valor from sae._precio_turno group by nombre_precio, valor order by nombre_precio;";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const cargosFijos = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida = [];
    if (cargosFijos) {
      for (const element of cargosFijos) {
        if (
          (typeof element.nombre_precio === 'object' || typeof element.nombre_precio === 'string') &&
          (typeof element.valor === 'object' || typeof element.valor === 'string') ) {

            const detalle_salida = {
              //Campos
              localidad: String(element.nombre_precio),
              valor_cargo: Number(element.valor)
              //**************************** */

            }
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send(salida);
    }
  } catch (error) {
    res.status(500).send(error);
  }

}
/*********************************************************************************** */
/* Devuelve la permanencia semanal por brigada
  app.post("/api/reportes/v1/permanencia_por_brigada", reportesController.permanenciaByBrigada)
*/
exports.permanenciaByBrigada = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve la permanencia semanal por brigada' */
/*
  const permanencia = {
    detalle: [
      {brigada: '00:00 - 08:00 (Molina)', turnos: 28, valor_dia: 198621, valor_mes: 5561376},
      {brigada: '08:00 - 18:30 (Molina)', turnos: 28, valor_dia: 198621, valor_mes: 5561376},
      {brigada: '08:00 - 16:00 (Licantén)', turnos: 0, valor_dia: 198621, valor_mes: null},
      {brigada: '16:00 - 24:00 (Licantén)', turnos: 0, valor_dia: 198621, valor_mes: null},
      {brigada: '16:00 - 24:00 (Linares)', turnos: 0, valor_dia: 198621, valor_mes: null},
      {brigada: '08:00 - 18:30 (Parral)', turnos: 29, valor_dia: 198621, valor_mes: 6253709},
      {brigada: '08:00 - 18:30 (Pelluhue)', turnos: 0, valor_dia: 198621, valor_mes: null},
    ],
    subtotal: 17376461
  }

  res.send(permanencia);
*/
  try {

    let param_fecha_ini = req.query.fecha_ini;
    let param_fecha_fin = req.query.fecha_fin;
    let condicion_fecha= "";
    if (param_fecha_fin) {
      if (param_fecha_fin.length == 10){
        //ok
        param_fecha_fin = param_fecha_fin + " 23:59:59";
        let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " 23:59:59";
        condicion_fecha = `and fecha_hora_ini <= '${fecha}'::timestamp`;
      }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
      }
    }


    const sql = "select brigada.nombre_brigada as brigada, case when tabla.turnos is null then 0 else tabla.turnos end as turnos, \
    brigada.valor_dia, case when tabla.turnos is null then 0 else tabla.turnos*brigada.valor_dia end as valor_mes from \
    (select br.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as \
    nombre_brigada, 0 as turnos, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base \
    WHERE id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno) as valor_dia, 0 as valor_mes from \
    _comun.brigadas br JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON br.id_base = b.id \
    JOIN _comun.turnos t on br.id_turno = t.id) as brigada left join (select id_brigada as id, count(id_brigada) \
    as turnos from (SELECT rj.id, br.id as id_brigada FROM sae.reporte_jornada rj join _comun.brigadas br on \
    rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id WHERE brigada is not null and s.sae and \
    id_estado_resultado is null and rj.tipo_turno = 1 and rj.estado <> 0 " + condicion_fecha + ") as rj group by id_brigada) as tabla using (id) order by id";


    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
          (typeof element.turnos === 'object' || typeof element.turnos === 'string') &&
          (typeof element.valor_dia === 'object' || typeof element.valor_dia === 'number') &&
          (typeof element.valor_mes === 'object' || typeof element.valor_mes === 'string') ) {

            const detalle_salida = {
              brigada: String(element.brigada),
              turnos: Number(element.turnos),
              valor_dia: Number(element.valor_dia),
              valor_mes: Number(element.valor_mes)

            }
            subtotal = subtotal + detalle_salida.valor_mes;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }
  

}
/*********************************************************************************** */
/* Devuelve la permanencia total como si no hubiera faltado ningún turno
  app.post("/api/reportes/v1/permanencia_total", reportesController.permanenciaTotal)
*/
exports.permanenciaTotal = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve la permanencia total óptima por brigada entre fechas' */


  try {

    let param_fecha_ini = req.query.fecha_ini;
    let param_fecha_fin = req.query.fecha_fin;
    let dias= "";
    if (param_fecha_fin && param_fecha_ini) {
      if (param_fecha_fin.length == 10){
        //ok
        const firstDate = new Date(param_fecha_ini)
        const secondDate = new Date(param_fecha_fin + " 23:59:59")
        if (firstDate.getTime() > secondDate.getTime()) {
          res.status(500).send('La fecha_fin debe ser mayor o igual a la fecha_ini');
          return;
        }
        const millisecondsDiff = secondDate.getTime() - firstDate.getTime()
        const daysDiff = Math.round( millisecondsDiff / (1000 * 60 * 60 * 24))
        dias = daysDiff.toString();

      }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
      }
    }else {
      res.status(500).send('Las fechas no pueden estar vacías');
      return;
    }


    const sql = "select brigada.nombre_brigada as brigada, case when tabla.turnos is null then 0 else tabla.turnos end as turnos, \
    brigada.valor_dia, case when tabla.turnos is null then 0 else tabla.turnos*brigada.valor_dia end as valor_mes from \
    (select br.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as \
    nombre_brigada, 0 as turnos, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base \
    WHERE id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno) as valor_dia, 0 as valor_mes from \
    _comun.brigadas br JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON br.id_base = b.id \
    JOIN _comun.turnos t on br.id_turno = t.id) as brigada left join (SELECT id, " + dias + "::integer as turnos FROM _comun.brigadas	\
      WHERE activo) as tabla using (id) order by id";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
          (typeof element.turnos === 'object' || typeof element.turnos === 'number') &&
          (typeof element.valor_dia === 'object' || typeof element.valor_dia === 'number') &&
          (typeof element.valor_mes === 'object' || typeof element.valor_mes === 'number') ) {

            const detalle_salida = {
              brigada: String(element.brigada),
              turnos: Number(element.turnos),
              valor_dia: Number(element.valor_dia),
              valor_mes: Number(element.valor_mes)

            }
            subtotal = subtotal + detalle_salida.valor_mes;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }
  
}

/*********************************************************************************** */
/* Devuelve las horas extra realizadas
  app.post("/api/reportes/v1/horasextras", reportesController.findHorasExtras)
*/
exports.findHorasExtras = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve las horas extra realizadas' */

    try {
      let param_fecha_ini = req.query.fecha_ini;
      let param_fecha_fin = req.query.fecha_fin;
      let condicion_fecha= "";
      if (param_fecha_fin) {
        if (param_fecha_fin.length == 10){
          //ok
          param_fecha_fin = param_fecha_fin + " 23:59:59";
          let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
          fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " 23:59:59";
          condicion_fecha = `and fecha_hora <= '${fecha}'::timestamp`;
        }else {
          res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
          return;
        }
      }


    
    const sql = "select xc.nombre_brigada as brigada, xc.cantidad as horas, xc.valor_hora as valor_base, xc.cantidad*valor_hora as valor_total \
    from (select rhe.*, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as nombre_brigada, \
    ((SELECT (valor::numeric/7)::integer/8 as valor_dia FROM sae.cargo_fijo_x_base WHERE id_cliente=1 and id_base= br.id_base and \
    id_turno=br.id_turno)*(select valor FROM sae.cargo_hora_extra order by fecha desc limit 1))::integer as valor_hora from \
    (select brigada, sum(cantidad) as cantidad from sae.reporte_hora_extra where id_estado_resultado is null " + condicion_fecha + " \
    group by brigada) rhe JOIN _comun.brigadas br on rhe.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id \
    JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id) as xc order by xc.brigada";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
          (typeof element.horas === 'object' || typeof element.horas === 'string') &&
          (typeof element.valor_base === 'object' || typeof element.valor_base === 'number') &&
          (typeof element.valor_total === 'object' || typeof element.valor_total === 'string') ) {

            const detalle_salida = {
              brigada: String(element.brigada),
              horas: Number(element.horas),
              valor_base: Number(element.valor_base),
              valor_total: Number(element.valor_total)

            }
            subtotal = subtotal + detalle_salida.valor_total;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }
  
/*
  const horasExtras = {
    detalle: [
      {brigada: '00:00 - 08:00 (Molina)', horas: 7, valor_base: 37192, valor_total: 260344},
      {brigada: '08:00 - 18:30 (Molina)', horas: 5, valor_base: 37192, valor_total: 185960},
      {brigada: '08:00 - 18:30 (Parral)', horas: 0, valor_base: 40380, valor_total: null},
    ],
    subtotal: 1191726
  }

  res.send(horasExtras);*/

}
/*********************************************************************************** */
/* Devuelve los turnos adicionales
  app.post("/api/reportes/v1/turnosadicionales", reportesController.findTurnosAdicionales)
*/
exports.findTurnosAdicionales = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve los turnos adicionales' */

  try {

    let param_fecha_ini = req.query.fecha_ini;
    let param_fecha_fin = req.query.fecha_fin;
    let condicion_fecha= "";
    if (param_fecha_fin) {
      if (param_fecha_fin.length == 10){
        //ok
        param_fecha_fin = param_fecha_fin + " 23:59:59";
        let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " 23:59:59";
        condicion_fecha = `and fecha_hora_ini <= '${fecha}'::timestamp`;
      }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
      }
    }
    
    const sql = "select nombre_brigada as brigada, count(nombre_brigada) as turnos, valor_dia::integer, sum(valor_dia::integer) \
    as valor_mes from (SELECT rj.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' \
    as nombre_brigada, br.id as id_brigada, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base WHERE \
    id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno)*(SELECT distinct on (fecha, tipo_turno) factor FROM \
    sae.cargo_turno_adicional where tipo_turno = rj.tipo_turno order by fecha desc, tipo_turno) as valor_dia FROM \
    sae.reporte_jornada rj join _comun.brigadas br on rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = \
    s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE brigada is not null \
    and s.sae and id_estado_resultado is null and rj.tipo_turno = 2 and rj.estado <> 0 " + condicion_fecha + ") as rj group by id_brigada, nombre_brigada, valor_dia";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
          (typeof element.turnos === 'object' || typeof element.turnos === 'string') &&
          (typeof element.valor_dia === 'object' || typeof element.valor_dia === 'number') &&
          (typeof element.valor_mes === 'object' || typeof element.valor_mes === 'string') ) {

            const detalle_salida = {
              brigada: String(element.brigada),
              turnos: Number(element.turnos),
              valor_dia: Number(element.valor_dia),
              valor_mes: Number(element.valor_mes)

            }
            subtotal = subtotal + detalle_salida.valor_mes;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }

}

/*********************************************************************************** */
/* Devuelve los turnos de contingencia
  app.post("/api/reportes/v1/turnoscontingencia", reportesController.findTurnosContingencia)
*/
exports.findTurnosContingencia = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve los turnos de contingencia' */
/*
  const turnosContingencia = {
    detalle: [],
    subtotal: null
  }
  res.send(turnosContingencia);*/
  try {
    let param_fecha_ini = req.query.fecha_ini;
    let param_fecha_fin = req.query.fecha_fin;
    let condicion_fecha= "";
    if (param_fecha_fin) {
      if (param_fecha_fin.length == 10){
        //ok
        param_fecha_fin = param_fecha_fin + " 23:59:59";
        let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " 23:59:59";
        condicion_fecha = `and fecha_hora_ini <= '${fecha}'::timestamp`;
      }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
      }
    }
    
    const sql = "select nombre_brigada as brigada, count(nombre_brigada) as turnos, valor_dia::integer, sum(valor_dia::integer) \
    as valor_mes from (SELECT rj.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' \
    as nombre_brigada, br.id as id_brigada, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base WHERE \
    id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno)*(SELECT distinct on (fecha, tipo_turno) factor FROM \
    sae.cargo_turno_adicional where tipo_turno = rj.tipo_turno order by fecha desc, tipo_turno) as valor_dia FROM \
    sae.reporte_jornada rj join _comun.brigadas br on rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = \
    s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE brigada is not null \
    and s.sae and id_estado_resultado is null and rj.tipo_turno = 3 and rj.estado <> 0 " + condicion_fecha + ") as rj group by id_brigada, nombre_brigada, valor_dia";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
          (typeof element.turnos === 'object' || typeof element.turnos === 'string') &&
          (typeof element.valor_dia === 'object' || typeof element.valor_dia === 'number') &&
          (typeof element.valor_mes === 'object' || typeof element.valor_mes === 'string') ) {

            const detalle_salida = {
              brigada: String(element.brigada),
              turnos: Number(element.turnos),
              valor_dia: Number(element.valor_dia),
              valor_mes: Number(element.valor_mes)

            }
            subtotal = subtotal + detalle_salida.valor_mes;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }

}
/*********************************************************************************** */
/* Devuelve la produccion PxQ
  app.post("/api/reportes/v1/produccionpxq", reportesController.findProduccionPxQ)
*/
exports.findProduccionPxQ = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve la produccion PxQ' */

  try {
    let param_fecha_ini = req.query.fecha_ini;
    let param_fecha_fin = req.query.fecha_fin;
    let condicion_fecha= "";
    if (param_fecha_fin) {
      if (param_fecha_fin.length == 10){
        //ok
        param_fecha_fin = param_fecha_fin + " 23:59:59";
        let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " 23:59:59";
        condicion_fecha = `and fecha_hora <= '${fecha}'::timestamp`;
      }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
      }
    }
    /*
    const sql2 = "select descripcion, sum(valor_cobrar) as valor_total from (SELECT et.descripcion as descripcion, \
      (select valor from sae.cargo_variable_x_base where id_cliente = 1 and id_base = br.id_base and \
        id_evento_tipo = et.id and id_turno = br.id_turno) as valor_cobrar, et.id as tipo_evento FROM \
        sae.reporte_eventos re join _comun.brigadas br on re.brigada = br.id join _comun.base b on \
        br.id_base = b.id left join _comun.eventos_tipo et on re.tipo_evento = et.codigo where id_estado_resultado \
        is null " + condicion_fecha + " order by fecha_hora) as xz group by tipo_evento, descripcion order by tipo_evento;";
        */
    const sql = "select nombre_precio as zonal, descripcion, valor_cobrar as valor_unitario, count(descripcion) as cantidad, \
    sum(valor_cobrar) as valor_total from (SELECT et.descripcion as descripcion, (select valor from sae.cargo_variable_x_base \
      where id_cliente = 1 and id_base = br.id_base and id_evento_tipo = et.id and id_turno = br.id_turno) as valor_cobrar, \
      et.id as tipo_evento, b.id as id_base, pe.nombre_precio, pe.valor FROM sae.reporte_eventos re join _comun.brigadas br \
      on re.brigada = br.id	join _comun.base b on br.id_base = b.id left join _comun.eventos_tipo et on \
      re.tipo_evento = et.codigo join sae._precio_evento pe on et.id = pe.id_evento_tipo and b.id = pe.id_base where \
      id_estado_resultado is null and re.estado <> 0 " + condicion_fecha + " order by fecha_hora) as xz group by nombre_precio, tipo_evento, descripcion, \
      valor_cobrar order by nombre_precio, tipo_evento;";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.zonal === 'object' || typeof element.zonal === 'string') &&
          (typeof element.descripcion === 'object' || typeof element.descripcion === 'string') &&
          (typeof element.valor_unitario === 'object' || typeof element.valor_unitario === 'string') &&
          (typeof element.cantidad === 'object' || typeof element.cantidad === 'string') &&
          (typeof element.valor_total === 'object' || typeof element.valor_total === 'string')  ) {

            const detalle_salida = {
              zonal: String(element.zonal),
              tipo_evento: String(element.descripcion),
              valor_unitario: Number(element.valor_unitario),
              cantidad: Number(element.cantidad),
              valor_total: Number(element.valor_total)
            }
            subtotal = subtotal + detalle_salida.valor_total;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }


}
/*********************************************************************************** */
/* Devuelve la tabla de cobros adicionales para el EDP
  app.post("/api/reportes/v1/reportecobroadicional", reportesController.findRepCobroAdicional)
*/
exports. findRepCobroAdicional = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve la tabla de cobros adicionales para el EDP' */
      /** SELECT detalle, cantidad, valor
	FROM sae.reporte_cobro_adicional
	WHERE id_estado_resultado is null
	order by fecha_hora */

  try {
    let param_fecha_ini = req.query.fecha_ini;
    let param_fecha_fin = req.query.fecha_fin;
    let condicion_fecha= "";
    if (param_fecha_fin) {
      if (param_fecha_fin.length == 10){
        //ok
        param_fecha_fin = param_fecha_fin + " 23:59:59";
        let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " 23:59:59";
        condicion_fecha = `and fecha_hora <= '${fecha}'::timestamp`;
      }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
      }
    }
    
    const sql = "SELECT detalle, cantidad, valor FROM sae.reporte_cobro_adicional WHERE id_estado_resultado is null " + condicion_fecha + " order by fecha_hora";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.detalle === 'object' || typeof element.detalle === 'string') &&
          (typeof element.cantidad === 'object' || typeof element.cantidad === 'string') &&
          (typeof element.valor === 'object' || typeof element.valor === 'string')  ) {

            const detalle_salida = {
              detalle: String(element.detalle),
              cantidad: Number(element.cantidad),
              valor: Number(element.valor)

            }
            subtotal = subtotal + detalle_salida.valor;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }

  

}
/*********************************************************************************** */
/* Devuelve la tabla de descuentos para el EDP
  app.post("/api/reportes/v1/reportedescuentos", reportesController.findRepDescuentos)
*/
exports.findRepDescuentos = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve la tabla de descuentos para el EDP' */

      try {
        let param_fecha_ini = req.query.fecha_ini;
        let param_fecha_fin = req.query.fecha_fin;
        let condicion_fecha= "";
        if (param_fecha_fin) {
          if (param_fecha_fin.length == 10){
            //ok
            param_fecha_fin = param_fecha_fin + " 23:59:59";
            let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
            fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " 23:59:59";
            condicion_fecha = `and fecha_hora <= '${fecha}'::timestamp`;
          }else {
            res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
            return;
          }
        }
        
        const sql = "SELECT detalle, cantidad, valor FROM sae.reporte_descuentos WHERE id_estado_resultado is null " + condicion_fecha + " order by fecha_hora";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        let subtotal = 0;
        if (permanencia) {
          for (const element of permanencia) {
            if (
              (typeof element.detalle === 'object' || typeof element.detalle === 'string') &&
              (typeof element.cantidad === 'object' || typeof element.cantidad === 'string') &&
              (typeof element.valor === 'object' || typeof element.valor === 'string')  ) {
    
                const detalle_salida = {
                  detalle: String(element.detalle),
                  cantidad: Number(element.cantidad),
                  valor: Number(element.valor)
    
                }
                subtotal = subtotal + detalle_salida.valor;
                salida.push(detalle_salida);
    
            }else {
                salida=undefined;
                break;
            }
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send({detalle: salida, subtotal: subtotal});
        }
      } catch (error) {
        res.status(500).send(error);
      }

}
/*********************************************************************************** */
/* Devuelve la tabla de resumen para el EDP
  app.post("/api/reportes/v1/reporteresumen", reportesController.findRepResumen)
*/
exports. findRepResumen = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Devuelve la tabla de resumen para el EDP' */

      try {
        let param_fecha_ini = req.query.fecha_ini;
        let param_fecha_fin = req.query.fecha_fin;
        let condicion_fecha= "";
        let condicion_fecha_permanencia= "";
        if (param_fecha_fin) {
          if (param_fecha_fin.length == 10){
            //ok
            param_fecha_fin = param_fecha_fin + " 23:59:59";
            let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
            fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " 23:59:59";
            condicion_fecha = `and fecha_hora <= '${fecha}'::timestamp`;
            condicion_fecha_permanencia = `and fecha_hora_ini <= '${fecha}'::timestamp`;
          }else {
            res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
            return;
          }
        }
        
        const sql = "select 1::integer as orden, 'BASE PERMANENCIA'::text as item, case when sum(valor_mes) is null then 0 else sum(valor_mes) \
        end as valor from (select brigada.nombre_brigada as brigada, case when tabla.turnos is null then 0 else tabla.turnos end as turnos, \
          brigada.valor_dia, case when tabla.turnos is null then 0 else tabla.turnos*brigada.valor_dia end as valor_mes from \
          (select br.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as nombre_brigada, \
          0 as turnos, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base WHERE id_cliente=1 and id_base= br.id_base \
          and id_turno=br.id_turno) as valor_dia, 0 as valor_mes from _comun.brigadas br JOIN _comun.servicios s ON br.id_servicio = \
          s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id) as brigada left join \
          (select id_brigada as id, count(id_brigada) as turnos from (SELECT rj.id, br.id as id_brigada FROM sae.reporte_jornada \
            rj join _comun.brigadas br on rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id WHERE brigada is not \
            null and s.sae and id_estado_resultado is null and rj.tipo_turno = 1 and rj.estado <> 0 " + condicion_fecha_permanencia + ") as rj group by id_brigada) as tabla using (id) order by id) as xc \
            UNION \
            select  2::integer as orden, 'HORAS EXTRAS'::text as item, case when sum(valor_total) is null then 0 else sum(valor_total) end as valor \
            from (select xc.nombre_brigada as brigada, xc.cantidad as horas, xc.valor_hora as valor_base, xc.cantidad*valor_hora as valor_total \
              from (select rhe.*, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as nombre_brigada, \
              ((SELECT (valor::numeric/7)::integer/8 as valor_dia FROM sae.cargo_fijo_x_base WHERE id_cliente=1 and id_base= br.id_base and \
              id_turno=br.id_turno)*(select valor FROM sae.cargo_hora_extra order by fecha desc limit 1))::integer as valor_hora from \
              (select brigada, sum(cantidad) as cantidad from sae.reporte_hora_extra where id_estado_resultado is null " + condicion_fecha + " group by brigada) rhe \
              JOIN _comun.brigadas br on rhe.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON \
              br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id) as xc order by xc.brigada) as xc \
              UNION \
              select  3::integer as orden, 'TURNOS ADICIONALES'::text as item, case when sum(valor_mes) is null then 0 else sum(valor_mes) end \
              as valor from (select nombre_brigada as brigada, count(nombre_brigada) as turnos, valor_dia::integer, sum(valor_dia::integer) \
              as valor_mes from (SELECT rj.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' \
              as nombre_brigada, br.id as id_brigada, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base WHERE \
              id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno)*(SELECT distinct on (fecha, tipo_turno) factor FROM sae.cargo_turno_adicional \
              where tipo_turno = rj.tipo_turno order by fecha desc, tipo_turno) as valor_dia FROM sae.reporte_jornada rj join _comun.brigadas \
              br on rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos \
              t on br.id_turno = t.id WHERE brigada is not null and s.sae and id_estado_resultado is null and rj.tipo_turno = 2 and rj.estado <> 0 " + condicion_fecha_permanencia + ") as rj group by \
              id_brigada, nombre_brigada, valor_dia) xc \
              UNION \
              select  4::integer as orden, 'TURNOS CONTINGENCIA'::text as item, case when sum(valor_mes) is null then 0 else \
              sum(valor_mes) end as valor from (select nombre_brigada as brigada, count(nombre_brigada) as turnos, valor_dia::integer, \
              sum(valor_dia::integer) as valor_mes from (SELECT rj.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) \
              || ' (' || b.nombre || ')' as nombre_brigada, br.id as id_brigada, (SELECT (valor::numeric/7)::integer as valor_dia \
              FROM sae.cargo_fijo_x_base WHERE id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno)*(SELECT distinct on \
                (fecha, tipo_turno) factor FROM sae.cargo_turno_adicional where tipo_turno = rj.tipo_turno order by fecha desc, tipo_turno) \
                as valor_dia FROM sae.reporte_jornada rj join _comun.brigadas br on rj.brigada = br.id JOIN _comun.servicios s ON \
                br.id_servicio = s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE brigada is \
                not null and s.sae and id_estado_resultado is null and rj.tipo_turno = 3 and rj.estado <> 0 " + condicion_fecha_permanencia + ") as rj group by id_brigada, nombre_brigada, valor_dia) xc \
                UNION \
                select  5::integer as orden, 'PRODUCCION'::text as item, case when sum(valor_total) is null then 0 else sum(valor_total) end as \
                valor from (select descripcion, sum(valor_cobrar) as valor_total from (SELECT et.descripcion as descripcion, (select valor from \
                  sae.cargo_variable_x_base where id_cliente = 1 and id_base = br.id_base and id_evento_tipo = et.id and id_turno = br.id_turno) \
                  as valor_cobrar, et.id as tipo_evento FROM sae.reporte_eventos re join _comun.brigadas br on re.brigada = br.id join \
                  _comun.base b on br.id_base = b.id left join _comun.eventos_tipo et on re.tipo_evento = et.codigo WHERE id_estado_resultado \
                  is null and re.estado <> 0 " + condicion_fecha + " order by fecha_hora) as xz group by tipo_evento, descripcion order by tipo_evento) xc \
                  UNION \
                  SELECT  6::integer as orden, 'COBROS ADICIONALES'::text as item, case when sum(valor) is null then 0 else sum(valor) end as valor \
                  FROM sae.reporte_cobro_adicional WHERE id_estado_resultado is null " + condicion_fecha + " \
                  UNION \
                  SELECT  7::integer as orden, 'DESCUENTOS'::text as item, \
                  case when sum(valor) is null then 0 else sum(valor) end as valor FROM sae.reporte_descuentos WHERE id_estado_resultado is null " + condicion_fecha + " order by orden";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const resumen = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        let costo_directo = 0;
        if (resumen) {
          for (const element of resumen) {
            if (
              (typeof element.orden === 'object' || typeof element.orden === 'number') &&
              (typeof element.item === 'object' || typeof element.item === 'string') &&
              (typeof element.valor === 'object' || typeof element.valor === 'string')  ) {
    
                const detalle_salida = {
                  orden: Number(element.orden),
                  item: String(element.item),
                  valor: Number(element.valor)
                }
                if (element.orden === 7){
                  // Se resta el descuento
                  costo_directo = costo_directo - Number(element.valor);
                }else{
                  costo_directo = costo_directo + Number(element.valor);
                }    
                salida.push(detalle_salida);
    
            }else {
                salida=undefined;
                break;
            }
          };
          
          if (costo_directo){
            //Agregar el costo por ditancia y por emergencia
            let detalle_salida = {
              orden: Number(8),
              item: String('COSTO DIRECTO'),
              valor: Number(costo_directo)
            }
            salida.push(detalle_salida);
            detalle_salida = {
              orden: Number(9),
              item: String('RECARGO POR DISTANCIA'),
              valor: Number(0)
            }
            salida.push(detalle_salida);
            detalle_salida = {
              orden: Number(10),
              item: String('ESTADO DE EMERGENCIA'),
              valor: Number(0)
            }
            salida.push(detalle_salida);
            /*
            let total = salida.filter((item) => item.orden > 7).reduce(((total, num) => total + num.valor), 0)
            console.log('total',total);
            let valor_neto = (total/1.19).toFixed(0);
            let iva = Number(total - valor_neto).toFixed(0);  
            */

            let valor_neto = salida.filter((item) => item.orden > 7).reduce(((total, num) => total + num.valor), 0)
            let total = Number((valor_neto * 1.19).toFixed(0));
            let iva = Number(total - valor_neto).toFixed(0);


            detalle_salida = {
              orden: Number(11),
              item: String('VALOR NETO'),
              valor: Number(valor_neto)
            }
            salida.push(detalle_salida);

            detalle_salida = {
              orden: Number(12),
              item: String('IVA'),
              valor: Number(iva)
            }
            salida.push(detalle_salida);

            detalle_salida = {
              orden: Number(13),
              item: String('TOTAL ESTADO DE PAGO'),
              valor: Number(total)
            }
            salida.push(detalle_salida);

          } else {
            let detalle_salida = {orden: Number(8), item: String('COSTO DIRECTO'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(9), item: String('RECARGO POR DISTANCIA'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(10), item: String('ESTADO DE EMERGENCIA'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(11), item: String('VALOR NETO'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(12), item: String('IVA'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(13), item: String('TOTAL ESTADO DE PAGO'), valor: Number(0)};
            salida.push(detalle_salida);

          }
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send({detalle: salida});
        }
      } catch (error) {
        res.status(500).send(error);
      }

}

/*********************************************************************************** */
/* Ingresa los cobros adicionales para un estado de pago
  app.post("/api/reportes/v1/creacobroadicional", reportesController.creaCobroAdicional)
*/
exports.creaCobroAdicional = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Cobros Adicionales']
      #swagger.description = 'Ingresa los cobros adicionales para un estado de pago' */
  try {
    const campos = [
      'detalle', 'fecha_hora', 'cantidad', 'valor'
    ];
    for (const element of campos) {
      if (!req.body[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    let param_fecha_ini = req.body.fecha_hora;
    /*
    let fecha = "";
    if (param_fecha_ini.length == 10){
        if (param_fecha_ini.slice(2,3) == "-"){
            param_fecha_ini = param_fecha_ini.slice(6,10) + '-' + param_fecha_ini.slice(3,5)+ '-' + param_fecha_ini.slice(0,2);
        }
        param_fecha_ini = param_fecha_ini + " 23:59:59";
        fecha = new Date(param_fecha_ini).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2);
    }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
    }*/

    const cobroadicional = {
      detalle: req.body.detalle,
      fecha_hora: param_fecha_ini,
	    cantidad: req.body.cantidad,
	    valor: req.body.valor,
      estado: 1
    };

    const cobroadicionalCreate = await CobroAdicional.create(cobroadicional)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    
  }catch (error) {
    res.status(500).send(error);
  }
}

/* Actualiza los cobros adicionales para un estado de pago
  app.post("/api/reportes/v1/updatecobroadicional", reportesController.updateCobroAdicional)
*/
exports.updateCobroAdicional = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Cobros Adicionales']
      #swagger.description = 'Actualiza los cobro adicionales para un estado de pago' */
      try{
        const id = req.params.id;
        /*
        let fecha;
        if (req.body.fecha_hora){
          fecha = new Date(req.body.fecha_hora).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
          fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2);
        }else{
          fecha = undefined;
        }*/
        const cobroadicional = {
          detalle: req.body.detalle?req.body.detalle:undefined,
          fecha_hora: req.body.fecha_hora?req.body.fecha_hora:undefined,
		      cantidad: req.body.cantidad?req.body.cantidad:undefined,
		      valor: req.body.valor?req.body.valor:undefined,
          estado: req.body.estado?req.body.estado:undefined
        };
        await CobroAdicional.update(cobroadicional, {
          where: { id: id }
        }).then(data => {
          if (data[0] === 1) {
            res.send({ message: "cobro adicional actualizado" });
          } else {
            res.send({ message: `No existe un cobro adicional con el id ${id}` });
          }
        }).catch(err => {
          res.status(500).send({ message: err.message });
        })
      }catch (error) {
        res.status(500).send(error);
      };

}

/*********************************************************************************** */
/* Elimina un cobro adicional para un estado de pago
  app.post("/api/reportes/v1/deletecobroadicional", reportesController.deleteCobroAdicional)
*/
exports.deleteCobroAdicional = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Cobros Adicionales']
#swagger.description = 'Elimina un cobro adicional para un estado de pago' */
  try{
    const id = req.params.id;
    await CobroAdicional.destroy({
      where: { id: id }
    }).then(data => {
      if (data === 1) {
        res.send({ message: "Cobro adicional eliminado" });
      } else {
        res.send({ message: `No existe un cobro con el id ${id}` });
      }
    }).catch(err => {
      res.status(500).send({ message: err.message });
    })
  }catch (error) {
    res.status(500).send(error);
  }

}

/*********************************************************************************** */
/* Devuelve todos los cobros adicionales 
  app.post("/api/reportes/v1/findallcobroadicional", reportesController.findallCobroAdicional)
*/
exports.findallCobroAdicional = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Cobros Adicionales']
      #swagger.description = 'Devuelve todos los cobros adicionales ' */
  await CobroAdicional.findAll().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
}

/*********************************************************************************** */
/* Devuelve los cobros adicionales por parametros
  app.post("/api/reportes/v1/findcobroadicional", reportesController.findCobroAdicionalByParams)
*/
exports.findCobroAdicionalByParams = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Cobros Adicionales']
      #swagger.description = 'Devuelve los cobros adicionales por campos' */
	try{
      const parametros = {
        id: req.query.id,
        id_estado_resultado: req.query.id_estado_resultado
      }
      const keys = Object.keys(parametros)
      let sql_array = [];
      let param = {};
      for (element of keys) {
        if (parametros[element]){
          sql_array.push( element + " = :" + element);
          param[element] = parametros[element];
        }
      }
      const where = sql_array.join(" AND ");
      if (sql_array.length === 0) {
        res.status(500).send("Debe incluir algun parametro para consultar");
      }else {
        await CobroAdicional.findAll({
          where: param
        }).then(data => {
          res.send(data);
        }).catch(err => {
          res.status(500).send({ message: err.message });
        })
      }
      

	}catch (error) {
		res.status(500).send(error);
  }
}

/*********************************************************************************** */
/* Devuelve los cobros adicionales no procesados, id_estado_resultado=null
  app.post("/api/reportes/v1/cobroadicionalnoprocesado", reportesController.findCobroAdicionalNoProcesado)
*/
exports.findCobroAdicionalNoProcesado = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Cobros Adicionales']
      #swagger.description = 'Devuelve los cobros adicionales no procesados' */
  await CobroAdicional.findAll({
    where: {
      id_estado_resultado: null
    }
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
}
/*********************************************************************************** */
/* Ingresa los descuentos para un estado de pago
  app.post("/api/reportes/v1/creadescuentos", reportesController.creaDescuentos)
*/
exports.creaDescuentos = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Descuentos']
      #swagger.description = 'Ingresa los descuentos para un estado de pago' */
  try {
    const campos = [
      'detalle', 'fecha_hora', 'cantidad', 'valor'
    ];
    for (const element of campos) {
      if (!req.body[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    let param_fecha_ini = req.body.fecha_hora;
    /*
    let fecha = "";
    if (param_fecha_ini.length == 10){
        if (param_fecha_ini.slice(2,3) == "-"){
            param_fecha_ini = param_fecha_ini.slice(6,10) + '-' + param_fecha_ini.slice(3,5)+ '-' + param_fecha_ini.slice(0,2);
        }
        param_fecha_ini = param_fecha_ini + " 23:59:59";
        fecha = new Date(param_fecha_ini).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2);
    }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
    }*/

    const descuentos = {
      detalle: req.body.detalle,
      fecha_hora: param_fecha_ini,
	    cantidad: req.body.cantidad,
	    valor: req.body.valor,
      estado: 1
    };

    const descuentosCreate = await Descuentos.create(descuentos)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    
  }catch (error) {
    res.status(500).send(error);
  }
}
/*********************************************************************************** */
/* Actualiza los descuentos para un estado de pago
  app.post("/api/reportes/v1/updatedescuentos", reportesController.updateDescuentos)
*/
exports.updateDescuentos = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Descuentos']
      #swagger.description = 'Actualiza los descuentos para un estado de pago' */
      try{
        const id = req.params.id;
        /*
        let fecha;
        if (req.body.fecha_hora){
          fecha = new Date(req.body.fecha_hora).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
          fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2);
        }else{
          fecha = undefined;
        }*/
        const descuentos = {
          detalle: req.body.detalle?req.body.detalle:undefined,
          fecha_hora: req.body.fecha_hora?req.body.fecha_hora:undefined,
		      cantidad: req.body.cantidad?req.body.cantidad:undefined,
		      valor: req.body.valor?req.body.valor:undefined,
          estado: req.body.estado?req.body.estado:undefined
        };
        await Descuentos.update(descuentos, {
          where: { id: id }
        }).then(data => {
          if (data[0] === 1) {
            res.send({ message: "descuento actualizado" });
          } else {
            res.send({ message: `No existe un descuento con el id ${id}` });
          }
        }).catch(err => {
          res.status(500).send({ message: err.message });
        })
      }catch (error) {
        res.status(500).send(error);
      };

}

/*********************************************************************************** */
/* Elimina un descuento para un estado de pago
  app.post("/api/reportes/v1/deletedescuento", reportesController.deleteDescuentos)
*/
exports.deleteDescuentos = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Descuentos']
#swagger.description = 'Elimina un descuento para un estado de pago' */
  try{
    const id = req.params.id;
    await Descuentos.destroy({
      where: { id: id }
    }).then(data => {
      if (data === 1) {
        res.send({ message: "Descuento eliminado" });
      } else {
        res.send({ message: `No existe un descuento con el id ${id}` });
      }
    }).catch(err => {
      res.status(500).send({ message: err.message });
    })
  }catch (error) {
    res.status(500).send(error);
  }

}

/*********************************************************************************** */
/* Devuelve todos los descuentos 
  app.post("/api/reportes/v1/findalldescuentos", reportesController.findallDescuentos)
*/
exports.findallDescuentos = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Descuentos']
      #swagger.description = 'Devuelve todos los descuentos ' */
  await Descuentos.findAll().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
}

/*********************************************************************************** */
/* Devuelve los descuentos por parametros
  app.post("/api/reportes/v1/finddescuentos", reportesController.findDescuentosByParams)
*/
exports.findDescuentosByParams = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Descuentos']
      #swagger.description = 'Devuelve los descuentos por campos' */
	try{
      const parametros = {
        id: req.query.id,
        id_estado_resultado: req.query.id_estado_resultado
      }
      const keys = Object.keys(parametros)
      let sql_array = [];
      let param = {};
      for (element of keys) {
        if (parametros[element]){
          sql_array.push( element + " = :" + element);
          param[element] = parametros[element];
        }
      }
      //const where = sql_array.join(" AND ");
      //console.log('where => ', where, param);
      if (sql_array.length === 0) {
        res.status(500).send("Debe incluir algun parametro para consultar");
      }else {
        await Descuentos.findAll({
          where: param
        }).then(data => {
          res.send(data);
        }).catch(err => {
          res.status(500).send({ message: err.message });
        })
      }
      

	}catch (error) {
		res.status(500).send(error);
  }
}

/*********************************************************************************** */
/* Devuelve los descuentos no procesados, id_estado_resultado=null
  app.post("/api/reportes/v1/descuentosnoprocesados", reportesController.findDescuentosNoProcesados)
*/
exports.findDescuentosNoProcesados = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Descuentos']
      #swagger.description = 'Devuelve los descuentos no procesados' */
  await Descuentos.findAll({
    where: {
      id_estado_resultado: null
    }
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  })
}

/*********************************************************************************** */
/* Devuelve la lsita de brigadas para seleccionar dentro del módulo de horas extra
  app.get("/api/movil/v1/listabrigadassae", [authJwt.verifyToken, authJwt.isSistemaOrAdminSae], reportesController.listaBrigadasSae)
*/
exports.listaBrigadasSae = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Horas Extras']
      #swagger.description = 'Devuelve la lsita de brigadas para seleccionar dentro del módulo de horas extra' */
      try {
        const sql = "SELECT br.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || \
        ' (' || b.nombre || ')' as brigada FROM _comun.brigadas br JOIN _comun.servicios s ON br.id_servicio = \
        s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE s.sae and s.activo;";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const comuna = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        if (comuna) {
          for (const element of comuna) {
            if (
              typeof element.id === 'number' && 
              typeof element.brigada === 'string') {
              
    
                const detalle_salida = {
                  id: Number(element.id),
                  brigada: String(element.brigada)
                }
                salida.push(detalle_salida);
    
            }else {
                salida=undefined;
                break;
            }
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send(salida);
        }
      } catch (error) {
        res.status(500).send(error);
      }
}

/*********************************************************************************** */
/* Ingresa las horas extra para un estado de pago
  app.post("/api/reportes/v1/creahoraextra", reportesController.creaHoraExtra)
*/
exports.creaHoraExtra = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Horas Extras']
      #swagger.description = 'Ingresa las horas extra para un estado de pago' */
  try {
    const campos = [
      'brigada', 'cantidad', 'fecha_hora'
    ];
    for (const element of campos) {
      if (!req.body[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };

    let param_fecha_ini = req.body.fecha_hora;
/*
    let fecha = "";
    if (param_fecha_ini.length == 10){
        if (param_fecha_ini.slice(2,3) == "-"){
            param_fecha_ini = param_fecha_ini.slice(6,10) + '-' + param_fecha_ini.slice(3,5)+ '-' + param_fecha_ini.slice(0,2);
        }
        param_fecha_ini = param_fecha_ini + " 23:59:59";
        fecha = new Date(param_fecha_ini).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2);
    }else {
        res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
        return;
    }*/


    const horaExtra = {
	    brigada: req.body.brigada,
      cantidad: req.body.cantidad,
      fecha_hora: param_fecha_ini,
      comentario: req.body.comentario,
      estado: 1
    };
    const horaExtraCreate = await HoraExtra.create(horaExtra)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });

    
  }catch (error) {
    res.status(500).send(error);
  }
}

/* Actualiza las horas extra para un estado de pago
  app.post("/api/reportes/v1/updatehoraextra", reportesController.updateHoraExtra)
*/
exports.updateHoraExtra = async (req, res) => {
  // metodo PUT
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Horas Extras']
      #swagger.description = 'Actualiza las horas extra para un estado de pago' */
      try{
        const id = req.params.id;
        //let param_fecha_ini = req.body.fecha_hora;
        /*
        let fecha;
        if (req.body.fecha_hora){
          fecha = new Date(req.body.fecha_hora).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
          fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2);
        }else{
          fecha = undefined;
        }*/
        const horaExtra = {
          brigada: req.body.brigada?req.body.brigada:undefined,
          cantidad: req.body.cantidad?req.body.cantidad:undefined,
          fecha_hora: req.body.fecha_hora?req.body.fecha_hora:undefined,
          comentario: req.body.comentario?req.body.comentario:undefined,
          estado: req.body.estado?req.body.estado:undefined
		};
        await HoraExtra.update(horaExtra, {
          where: { id: id }
        }).then(data => {
          if (data[0] === 1) {
            res.send({ message: "Registro actualizado" });
          } else {
            res.send({ message: `No existe un registro de hora extra con el id ${id}` });
          }
        }).catch(err => {
          res.status(500).send({ message: err.message });
        })
      }catch (error) {
        res.status(500).send(error);
      };

}

/*********************************************************************************** */
/* Elimina un registro de hora extra para un estado de pago
  app.post("/api/reportes/v1/deletehoraextra", reportesController.deleteHoraExtra)
*/
exports.deleteHoraExtra = async (req, res) => {
  // metodo POST
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Horas Extras']
#swagger.description = 'Elimina un registro de hora extra para un estado de pago' */
  try{
    const id = req.params.id;
    await HoraExtra.destroy({
      where: { id: id }
    }).then(data => {
      if (data === 1) {
        res.send({ message: "Registro eliminado" });
      } else {
        res.send({ message: `No existe un registro de hora extra con el id ${id}` });
      }
    }).catch(err => {
      res.status(500).send({ message: err.message });
    })
  }catch (error) {
    res.status(500).send(error);
  }

}

/*********************************************************************************** */
/* Devuelve todos los registros de hora extra
  app.get("/api/reportes/v1/findallhoraextra", reportesController.findallHoraExtra)
*/
exports.findallHoraExtra = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Horas Extras']
      #swagger.description = 'Devuelve todos los registros de hora extra ' */
      try {
        
        const sql = "SELECT rhe.id, json_build_object('id', br.id, 'brigada', (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || \
        ' (' || b.nombre || ')') as brigada, cantidad, rhe.comentario, id_estado_resultado, estado, fecha_hora::text FROM sae.reporte_hora_extra \
        rhe JOIN _comun.brigadas br on rhe.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON \
        br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE s.sae and s.activo;";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        if (permanencia) {
          for (const element of permanencia) {
            if (
              (typeof element.id === 'object' || typeof element.id === 'string') &&
              (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
              (typeof element.cantidad === 'object' || typeof element.cantidad === 'string') &&
              (typeof element.comentario === 'object' || typeof element.comentario === 'string') &&
              (typeof element.id_estado_resultado === 'object' || typeof element.id_estado_resultado === 'number') &&
              (typeof element.estado === 'object' || typeof element.estado === 'number') &&
              (typeof element.fecha_hora === 'object' || typeof element.fecha_hora === 'string') ) {
    
                const detalle_salida = {
                  id: Number(element.id),
                  brigada: element.brigada,
                  cantidad: Number(element.cantidad),
                  comentario: String(element.comentario),
                  id_estado_resultado: Number(element.id_estado_resultado),
                  estado: Number(element.estado),
                  fecha_hora: String(element.fecha_hora)
    
                }
                salida.push(detalle_salida);
            }else {
                salida=undefined;
                break;
            }
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send({detalle: salida});
        }
      } catch (error) {
        res.status(500).send(error);
      }
}

/*********************************************************************************** */
/* Devuelve los registros de hora extra por parametros
  app.get("/api/reportes/v1/findhoraextra", reportesController.findHoraExtraByParams)
*/
exports.findHoraExtraByParams = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Horas Extras']
      #swagger.description = 'Devuelve los registros de hora extra por campos' */
	try{
      const parametros = {
        id: req.query.id,
        id_estado_resultado: req.query.id_estado_resultado
      }
      const keys = Object.keys(parametros)
      let sql_array = [];
      let param = {};
      for (element of keys) {
        if (parametros[element]){
          sql_array.push( element + " = :" + element);
          param[element] = parametros[element];
        }
      }
      const where = sql_array.join(" AND ");
      //console.log('where => ', where, param);
      if (sql_array.length === 0) {
        res.status(500).send("Debe incluir algun parametro para consultar");
      }else {
        const sql = "SELECT rhe.id, json_build_object('id', br.id, 'brigada', (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || \
        ' (' || b.nombre || ')') as brigada, cantidad, rhe.comentario, id_estado_resultado, estado, fecha_hora::text FROM sae.reporte_hora_extra \
        rhe JOIN _comun.brigadas br on rhe.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON \
        br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE s.sae and s.activo AND " + where + ";";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        if (permanencia) {
          for (const element of permanencia) {
            if (
              (typeof element.id === 'object' || typeof element.id === 'string') &&
              (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
              (typeof element.cantidad === 'object' || typeof element.cantidad === 'string') &&
              (typeof element.comentario === 'object' || typeof element.comentario === 'string') &&
              (typeof element.id_estado_resultado === 'object' || typeof element.id_estado_resultado === 'number') &&
              (typeof element.estado === 'object' || typeof element.estado === 'number') &&
              (typeof element.fecha_hora === 'object' || typeof element.fecha_hora === 'string') ) {
    
                const detalle_salida = {
                  id: Number(element.id),
                  brigada: element.brigada,
                  cantidad: Number(element.cantidad),
                  comentario: String(element.comentario),
                  id_estado_resultado: Number(element.id_estado_resultado),
                  estado: Number(element.estado),
                  fecha_hora: String(element.fecha_hora)
    
                }
                salida.push(detalle_salida);
            }else {
                salida=undefined;
                break;
            }
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send({detalle: salida});
        }
      }
      
	}catch (error) {
		res.status(500).send(error);
  }
}

/*********************************************************************************** */
/* Devuelve los registros de hora extra no procesados, id_estado_resultado=null
  app.get("/api/reportes/v1/horaextranoprocesados", reportesController.findHoraExtraNoProcesados)
*/
exports.findHoraExtraNoProcesados = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - CRUD Horas Extras']
      #swagger.description = 'Devuelve los registros de hora extra no procesados' */


      try {
        
        const sql = "SELECT rhe.id, json_build_object('id', br.id, 'brigada', (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || \
        ' (' || b.nombre || ')') as brigada, cantidad, rhe.comentario, id_estado_resultado, estado, fecha_hora::text FROM sae.reporte_hora_extra \
        rhe JOIN _comun.brigadas br on rhe.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON \
        br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE s.sae and s.activo and id_estado_resultado is null;";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const permanencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        if (permanencia) {
          for (const element of permanencia) {
            if (
              (typeof element.id === 'object' || typeof element.id === 'string') &&
              (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
              (typeof element.cantidad === 'object' || typeof element.cantidad === 'string') &&
              (typeof element.comentario === 'object' || typeof element.comentario === 'string') &&
              (typeof element.id_estado_resultado === 'object' || typeof element.id_estado_resultado === 'number') &&
              (typeof element.estado === 'object' || typeof element.estado === 'number') &&
              (typeof element.fecha_hora === 'object' || typeof element.fecha_hora === 'string') ) {
    
                const detalle_salida = {
                  id: Number(element.id),
                  brigada: element.brigada,
                  cantidad: Number(element.cantidad),
                  comentario: String(element.comentario),
                  id_estado_resultado: Number(element.id_estado_resultado),
                  estado: Number(element.estado),
                  fecha_hora: String(element.fecha_hora)
    
                }
                salida.push(detalle_salida);
            }else {
                salida=undefined;
                break;
            }
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send({detalle: salida});
        }
      } catch (error) {
        res.status(500).send(error);
      }

}

/*********************************************************************************** */
/* Devuelve el detalle de PxQ para planilla Excel, ingresando parámetro del paquete
  app.get("/api/reportes/v1/detallepxq", reportesController.detallePxQ)
*/
exports.detallePxQ = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - Detalle PxQ']
      #swagger.description = 'Devuelve el detalle de PxQ para planilla Excel, se debe ingresar el id_paquete en la url ?id_paquete=[id_paquete]' */
      try {
        const campos = [
          'id_paquete'
        ];
        for (const element of campos) {
          if (!req.query[element]) {
            res.status(400).send({
              message: "No puede estar nulo el campo " + element
            });
            return;
          }
        };
        let param_fecha_ini = req.query.fecha_ini;
        let param_fecha_fin = req.query.fecha_fin;
        let condicion_fecha= "";
        if (param_fecha_fin) {
          if (param_fecha_fin.length == 10){
            //ok
            param_fecha_fin = param_fecha_fin + " 23:59:59";
            let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
            fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " 23:59:59";
            condicion_fecha = `and fecha_hora <= '${fecha}'::timestamp`;
          }else {
            res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
            return;
          }
        }
        
        const sql = "SELECT re.id, to_char(re.fecha_hora::timestamp with time zone, 'DD-MM-YYYY'::text) AS fecha, hora_termino::text, \
        numero_ot as centrality, (select trim(nombres || ' ' || apellido_1 || ' ' || case when apellido_2 is null then '' else ' ' || apellido_2 end) as maestro from _auth.personas \
        where rut = re.rut_maestro) as maestro, (select trim(nombres || ' ' || apellido_1 || ' ' || case when apellido_2 is null then '' else ' ' || apellido_2 end) as maestro \
        from _auth.personas where rut = re.rut_ayudante) as ayudante, despachador, c.nombre as comuna, direccion, \
        requerimiento as aviso, re.trabajo_solicitado, re.trabajo_realizado, et.descripcion as descripcion, (select valor from sae.cargo_variable_x_base where \
          id_cliente = 1 and id_base = br.id_base and id_evento_tipo = et.id and id_turno = br.id_turno) as \
          valor_cobrar, ti.nombre as tipo_turno, case when re.patente is null then 'XXXX'::varchar else re.patente end as patente FROM sae.reporte_eventos re join _comun.brigadas br on re.brigada = br.id \
          join _comun.base b on br.id_base = b.id left join _comun.comunas c on re.comuna = c.codigo left join \
          _comun.eventos_tipo et on re.tipo_evento = et.codigo join _comun.tipo_turno ti on re.tipo_turno = ti.id \
          where b.id_paquete = :id_paquete and id_estado_resultado is null and re.estado <> 0 " + condicion_fecha + " order by fecha_hora;";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const eventos = await sequelize.query(sql, { replacements: { id_paquete: req.query.id_paquete }, type: QueryTypes.SELECT });
        let salida = [];
        if (eventos) {
          for (const element of eventos) {
            if (
              typeof element.id === 'number' &&
              (typeof element.fecha === 'object' || typeof element.fecha === 'string') &&
              (typeof element.hora_termino === 'object' || typeof element.hora_termino === 'string') &&
              (typeof element.centrality === 'object' || typeof element.centrality === 'string') &&
              (typeof element.maestro === 'object' || typeof element.maestro === 'string') &&
              (typeof element.ayudante === 'object' || typeof element.ayudante === 'string') &&
              (typeof element.despachador === 'object' || typeof element.despachador === 'string') &&
              (typeof element.comuna === 'object' || typeof element.comuna === 'string') &&
              (typeof element.direccion === 'object' || typeof element.direccion === 'string') &&
              (typeof element.aviso === 'object' || typeof element.aviso === 'string') &&
              (typeof element.descripcion === 'object' || typeof element.descripcion === 'string') &&
              (typeof element.valor_cobrar === 'number' || typeof element.valor_cobrar === 'string') &&
              (typeof element.tipo_turno === 'object' || typeof element.tipo_turno === 'string') &&
              (typeof element.trabajo_realizado === 'object' || typeof element.trabajo_realizado === 'string') &&
              (typeof element.trabajo_solicitado === 'object' || typeof element.trabajo_solicitado === 'string') &&
              (typeof element.patente === 'object' || typeof element.patente === 'string')) {
    
                const detalle_salida = {
                  id: Number(element.id),
                  fecha: String(element.fecha),
                  hora_termino: String(element.hora_termino),
                  centrality: String(element.centrality),
                  maestro: String(element.maestro),
                  ayudante: String(element.ayudante),
                  patente: String(element.patente),
                  despachador: String(element.despachador),
                  comuna: String(element.comuna),
                  direccion: String(element.direccion),
                  aviso: String(element.aviso),
                  descripcion: String(element.descripcion),
                  valor_cobrar: Number(element.valor_cobrar),
                  tipo_turno: String(element.tipo_turno),
                  trabajo_realizado: String(element.trabajo_realizado),
                  trabajo_solicitado: String(element.trabajo_solicitado)
    
                }
                salida.push(detalle_salida);
    
            }else {
                salida=undefined;
                break;
            }
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send(salida);
        }
      } catch (error) {
        res.status(500).send(error);
      }
}

/*********************************************************************************** */
/* Realiza el cierre de un estado de pago
  app.post("/api/reportes/v1/cierraedp", reportesController.cierraEstadoPago)
*/
exports.cierraEstadoPago = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Realiza el cierre de un estado de pago'
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos para el cierre de estado de pago',
            required: true,
            schema: {
                periodo: "agosto-2023",
                zonal: "Maule sur - Maule norte",
                fecha_inicial: "2023-08-01",
                fecha_final: "2023-08-31",
                coordinador_pelom: "Camilo Soto",
                supervisor_cge: "José León",
                turnos_comprometidos: 31,
                fecha_generacion: "2023-09-05"
            }
        } */
      try {
        const campos = [
          'periodo', 'zonal', 'fecha_inicial', 'fecha_final', 'coordinador_pelom', 'supervisor_cge', 'turnos_comprometidos', 'fecha_generacion'
        ];
        for (const element of campos) {
          if (!req.body[element]) {
            res.status(400).send({
              message: "No puede estar nulo el campo " + element
            });
            return;
          }
        };
        let param_fecha_fin = req.body.fecha_final;
        let condicion_fecha= "";
        let condicion_fecha_permanencia= "";
        if (param_fecha_fin) {
          if (param_fecha_fin.length == 10){
            //ok
            param_fecha_fin = param_fecha_fin + " 23:59:59";
            let fecha = new Date(param_fecha_fin).toLocaleString("es-CL", {timeZone: "America/Santiago"});
            fecha = fecha.slice(6,10) + "-" + fecha.slice(3,5) + "-" + fecha.slice(0,2) + " " + fecha.slice(12)
            condicion_fecha = `and fecha_hora <= '${fecha}'::timestamp`;
            condicion_fecha_permanencia = `and fecha_hora_ini <= '${fecha}'::timestamp`;
          }else {
            res.status(500).send('Debe incluir la fecha_fin en formato YYYY-MM-DD');
            return;
          }
        }

        const codigo_estado = 'Z1-Z3-SAE-' + Math.floor(Math.random() * 999).toString() + '-' + req.body.periodo;
        let fecha_hoy = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
        fecha_hoy = fecha_hoy.slice(6,10) + "-" + fecha_hoy.slice(3,5) + "-" + fecha_hoy.slice(0,2) + " " + fecha_hoy.slice(12,20);



        const edp = {
          "periodo": req.body.periodo,
          "zonal": req.body.zonal,
          "fecha_inicial": req.body.fecha_inicial,
          "fecha_final": req.body.fecha_final,
          "coordinador_pelom": req.body.coordinador_pelom,
          "supervisor_cge": req.body.supervisor_cge,
          "turnos_comprometidos": req.body.turnos_comprometidos,
          "fecha_generacion": req.body.fecha_generacion
        }
        const estadoP = {
          "codigo_estado": codigo_estado,
          "encabezado": edp,
          "fecha_hora": fecha_hoy
        }

        const estadoPago = await EstadoPago.create(estadoP)
        .then(async data => {
            //actualizar las otras tablas

            const sql2 = "update sae.reporte_cobro_adicional set id_estado_resultado = " + data.id + " WHERE id_estado_resultado is null " + condicion_fecha + "; \
            update sae.reporte_descuentos set id_estado_resultado = " + data.id + " WHERE id_estado_resultado is null " + condicion_fecha + "; \
            update sae.reporte_hora_extra set id_estado_resultado = " + data.id + " where id_estado_resultado is null " + condicion_fecha + "; \
            update sae.reporte_jornada rj set id_estado_resultado = " + data.id + " where brigada is not null and id_estado_resultado is null and rj.estado <> 0 " + condicion_fecha_permanencia + "; \
            update sae.reporte_eventos re set id_estado_resultado = " + data.id + " where brigada is not null and id_estado_resultado is null and re.estado <> 0 " + condicion_fecha + "; \
            update sae.reporte_observaciones set id_estado_resultado = " + data.id + " where id_estado_resultado is null " + condicion_fecha + ";";
            console.log(sql2);
            const { QueryTypes } = require('sequelize');
            const sequelize = db.sequelize;
            const resultado = await sequelize.query(sql2, { type: QueryTypes.UPDATE })
            .then(data => {
              res.send(data);
            }).catch(err => {
              res.status(500).send({ message: err.message });
            })
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });

      } catch (error) {
        res.status(500).send(error);
      }

}

/*********************************************************************************** */
/* Devuelve el listado historico de estados de pago
  app.get("/api/reportes/v1/historicoedp", reportesController.historicoEdp)
*/
exports.historicoEdp = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP']
      #swagger.description = 'Obtiene el historico de estados de pago'
        } */

  try {
      const sql = "select id,codigo_estado, (encabezado->>'fecha_generacion' )::text as fecha_generacion, encabezado \
      from sae.reporte_estado_pago order by (encabezado->>'fecha_generacion')::date desc";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const edp = await sequelize.query(sql, { type: QueryTypes.SELECT });
      let salida = [];
      if (edp) {
        for (const element of edp) {
          if (
            typeof element.id === 'number' &&
            (typeof element.codigo_estado === 'object' || typeof element.codigo_estado === 'string') &&
            (typeof element.fecha_generacion === 'object' || typeof element.fecha_generacion === 'string') &&
            (typeof element.encabezado === 'object' || typeof element.encabezado === 'string') ) {
  
              const detalle_salida = {

                id: Number(element.id),
                codigo_estado: String(element.codigo_estado),
                fecha_generacion: String(element.fecha_generacion),
                encabezado: element.encabezado
  
              }
              salida.push(detalle_salida);
  
          }else {
              salida=undefined;
              break;
          }
        };
      }
      if (salida===undefined){
        res.status(500).send("Error en la consulta (servidor backend)");
      }else{
        res.status(200).send(salida);
      }

  } catch (error) {
    res.status(500).send(error);
  }
}


/*********************************************************************************** */
/* Devuelve la permanencia semanal por brigada
  app.get("/api/reportes/v1/permanencia_por_brigada_historial", reportesController.permanenciaByBrigadaHistorial)
*/
exports.permanenciaByBrigadaHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve la permanencia semanal por brigada' */

  try {
    const campos = [
      'id_estado_pago'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };

    const sql = "select brigada.nombre_brigada as brigada, case when tabla.turnos is null then 0 else tabla.turnos end as turnos, \
    brigada.valor_dia, case when tabla.turnos is null then 0 else tabla.turnos*brigada.valor_dia end as valor_mes from \
    (select br.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as \
    nombre_brigada, 0 as turnos, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base \
    WHERE id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno) as valor_dia, 0 as valor_mes from \
    _comun.brigadas br JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON br.id_base = b.id \
    JOIN _comun.turnos t on br.id_turno = t.id) as brigada left join (select id_brigada as id, count(id_brigada) \
    as turnos from (SELECT rj.id, br.id as id_brigada FROM sae.reporte_jornada rj join _comun.brigadas br on \
    rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id WHERE brigada is not null and s.sae and \
    id_estado_resultado = :id_estado_pago and rj.tipo_turno = 1) as rj group by id_brigada) as tabla using (id) order by id";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { replacements: { id_estado_pago: req.query.id_estado_pago },type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
          (typeof element.turnos === 'object' || typeof element.turnos === 'string') &&
          (typeof element.valor_dia === 'object' || typeof element.valor_dia === 'number') &&
          (typeof element.valor_mes === 'object' || typeof element.valor_mes === 'string') ) {

            const detalle_salida = {
              brigada: String(element.brigada),
              turnos: Number(element.turnos),
              valor_dia: Number(element.valor_dia),
              valor_mes: Number(element.valor_mes)

            }
            subtotal = subtotal + detalle_salida.valor_mes;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }
  

}
/*********************************************************************************** */
/* Devuelve las horas extra realizadas
  app.get("/api/reportes/v1/horasextrafindHorasExtrasHistorial", reportesController.findHorasExtrasHistorial)
*/
exports.findHorasExtrasHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve las horas extra realizadas' */

    try {
      
      const campos = [
        'id_estado_pago'
      ];
      for (const element of campos) {
        if (!req.query[element]) {
          res.status(400).send({
            message: "No puede estar nulo el campo " + element
          });
          return;
        }
      };
    
    const sql = "select xc.nombre_brigada as brigada, xc.cantidad as horas, xc.valor_hora as valor_base, xc.cantidad*valor_hora as valor_total \
    from (select rhe.*, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as nombre_brigada, \
    ((SELECT (valor::numeric/7)::integer/8 as valor_dia FROM sae.cargo_fijo_x_base WHERE id_cliente=1 and id_base= br.id_base and \
    id_turno=br.id_turno)*(select valor FROM sae.cargo_hora_extra order by fecha desc limit 1))::integer as valor_hora from \
    (select brigada, sum(cantidad) as cantidad from sae.reporte_hora_extra where id_estado_resultado = :id_estado_pago \
    group by brigada) rhe JOIN _comun.brigadas br on rhe.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id \
    JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id) as xc order by xc.brigada";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { replacements: { id_estado_pago: req.query.id_estado_pago }, type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
          (typeof element.horas === 'object' || typeof element.horas === 'string') &&
          (typeof element.valor_base === 'object' || typeof element.valor_base === 'number') &&
          (typeof element.valor_total === 'object' || typeof element.valor_total === 'string') ) {

            const detalle_salida = {
              brigada: String(element.brigada),
              horas: Number(element.horas),
              valor_base: Number(element.valor_base),
              valor_total: Number(element.valor_total)

            }
            subtotal = subtotal + detalle_salida.valor_total;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }
  

}
/* Devuelve las observacion histocias por ID de estado de pago
  app.post("/api/reportes/v1/findobservacioneshistorial", reportesController.findObservacionesHistorial)
*/
exports.findObservacionesHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve las observacion por campos' */
      try{
        const parametros = {
          id_estado_resultado: req.query.id_estado_resultado
        }
        const keys = Object.keys(parametros)
        let sql_array = [];
        let param = {};
        for (element of keys) {
          if (parametros[element]){
            sql_array.push( element + " = :" + element);
            param[element] = parametros[element];
          }
        }
        const where = sql_array.join(" AND ");
        if (sql_array.length === 0) {
          res.status(500).send("Debe incluir algun parametro para consultar");
        }else {
          await Observaciones.findAll({
            where: param
          }).then(data => {
            res.send(data);
          }).catch(err => {
            res.status(500).send({ message: err.message });
          })
        }
        
  
    }catch (error) {
      res.status(500).send(error);
    }

}
/*********************************************************************************** */
/* Devuelve los turnos adicionales
  app.get("/api/reportes/v1/turnosadicionaleshistorial", reportesController.findTurnosAdicionalesHistorial)
*/
exports.findTurnosAdicionalesHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve los turnos adicionales' */

  try {

    const campos = [
      'id_estado_pago'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    
    const sql = "select nombre_brigada as brigada, count(nombre_brigada) as turnos, valor_dia::integer, sum(valor_dia::integer) \
    as valor_mes from (SELECT rj.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' \
    as nombre_brigada, br.id as id_brigada, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base WHERE \
    id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno)*(SELECT distinct on (fecha, tipo_turno) factor FROM \
    sae.cargo_turno_adicional where tipo_turno = rj.tipo_turno order by fecha desc, tipo_turno) as valor_dia FROM \
    sae.reporte_jornada rj join _comun.brigadas br on rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = \
    s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE brigada is not null \
    and s.sae and id_estado_resultado = :id_estado_pago and rj.tipo_turno = 2 ) as rj group by id_brigada, nombre_brigada, valor_dia";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { replacements: { id_estado_pago: req.query.id_estado_pago }, type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
          (typeof element.turnos === 'object' || typeof element.turnos === 'string') &&
          (typeof element.valor_dia === 'object' || typeof element.valor_dia === 'number') &&
          (typeof element.valor_mes === 'object' || typeof element.valor_mes === 'string') ) {

            const detalle_salida = {
              brigada: String(element.brigada),
              turnos: Number(element.turnos),
              valor_dia: Number(element.valor_dia),
              valor_mes: Number(element.valor_mes)

            }
            subtotal = subtotal + detalle_salida.valor_mes;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }

}

/*********************************************************************************** */
/* Devuelve los turnos de contingencia
  app.get("/api/reportes/v1/turnoscontingenciahistorial", reportesController.findTurnosContingenciaHistorial)
*/
exports.findTurnosContingenciaHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve los turnos de contingencia' */

  try {

    const campos = [
      'id_estado_pago'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    
    const sql = "select nombre_brigada as brigada, count(nombre_brigada) as turnos, valor_dia::integer, sum(valor_dia::integer) \
    as valor_mes from (SELECT rj.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' \
    as nombre_brigada, br.id as id_brigada, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base WHERE \
    id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno)*(SELECT distinct on (fecha, tipo_turno) factor FROM \
    sae.cargo_turno_adicional where tipo_turno = rj.tipo_turno order by fecha desc, tipo_turno) as valor_dia FROM \
    sae.reporte_jornada rj join _comun.brigadas br on rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = \
    s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE brigada is not null \
    and s.sae and id_estado_resultado = :id_estado_pago and rj.tipo_turno = 3 ) as rj group by id_brigada, nombre_brigada, valor_dia";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { replacements: { id_estado_pago: req.query.id_estado_pago }, type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.brigada === 'object' || typeof element.brigada === 'string') &&
          (typeof element.turnos === 'object' || typeof element.turnos === 'string') &&
          (typeof element.valor_dia === 'object' || typeof element.valor_dia === 'number') &&
          (typeof element.valor_mes === 'object' || typeof element.valor_mes === 'string') ) {

            const detalle_salida = {
              brigada: String(element.brigada),
              turnos: Number(element.turnos),
              valor_dia: Number(element.valor_dia),
              valor_mes: Number(element.valor_mes)

            }
            subtotal = subtotal + detalle_salida.valor_mes;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }

}
/*********************************************************************************** */
/* Devuelve la produccion PxQ
  app.get("/api/reportes/v1/produccionpxqhistorial", reportesController.findProduccionPxQHistorial)
*/
exports.findProduccionPxQHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve la produccion PxQ' */


  try {

    const campos = [
      'id_estado_pago'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    /*
    const sql = "select descripcion, sum(valor_cobrar) as valor_total from (SELECT et.descripcion as descripcion, \
      (select valor from sae.cargo_variable_x_base where id_cliente = 1 and id_base = br.id_base and \
        id_evento_tipo = et.id and id_turno = br.id_turno) as valor_cobrar, et.id as tipo_evento FROM \
        sae.reporte_eventos re join _comun.brigadas br on re.brigada = br.id join _comun.base b on \
        br.id_base = b.id left join _comun.eventos_tipo et on re.tipo_evento = et.codigo where id_estado_resultado = :id_estado_pago \
        order by fecha_hora) as xz group by tipo_evento, descripcion order by tipo_evento;";
        */
    const sql = "select nombre_precio as zonal, descripcion, valor_cobrar as valor_unitario, count(descripcion) as cantidad, \
    sum(valor_cobrar) as valor_total from (SELECT et.descripcion as descripcion, (select valor from sae.cargo_variable_x_base \
      where id_cliente = 1 and id_base = br.id_base and id_evento_tipo = et.id and id_turno = br.id_turno) as valor_cobrar, \
      et.id as tipo_evento, b.id as id_base, pe.nombre_precio, pe.valor FROM sae.reporte_eventos re join _comun.brigadas br \
      on re.brigada = br.id	join _comun.base b on br.id_base = b.id left join _comun.eventos_tipo et on \
      re.tipo_evento = et.codigo join sae._precio_evento pe on et.id = pe.id_evento_tipo and b.id = pe.id_base where \
      id_estado_resultado = :id_estado_pago order by fecha_hora) as xz group by nombre_precio, tipo_evento, descripcion, \
      valor_cobrar order by nombre_precio, tipo_evento;";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { replacements: { id_estado_pago: req.query.id_estado_pago }, type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.zonal === 'object' || typeof element.zonal === 'string') &&
          (typeof element.descripcion === 'object' || typeof element.descripcion === 'string') &&
          (typeof element.valor_unitario === 'object' || typeof element.valor_unitario === 'string') &&
          (typeof element.cantidad === 'object' || typeof element.cantidad === 'string') &&
          (typeof element.valor_total === 'object' || typeof element.valor_total === 'string')  ) {

            const detalle_salida = {
              zonal: String(element.zonal),
              tipo_evento: String(element.descripcion),
              valor_unitario: Number(element.valor_unitario),
              cantidad: Number(element.cantidad),
              valor_total: Number(element.valor_total)

            }
            subtotal = subtotal + detalle_salida.valor_total;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }


}

/*********************************************************************************** */
/* Devuelve la tabla de cobros adicionales historicos para el EDP
  app.get("/api/reportes/v1/reportecobroadicionalhistorial", reportesController.findRepCobroAdicionalHistorial)
*/
exports. findRepCobroAdicionalHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve la tabla de cobros adicionales para el EDP' */


  try {
    const campos = [
      'id_estado_pago'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    
    const sql = "SELECT detalle, cantidad, valor FROM sae.reporte_cobro_adicional WHERE id_estado_resultado = :id_estado_pago order by fecha_hora";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const permanencia = await sequelize.query(sql, { replacements: { id_estado_pago: req.query.id_estado_pago },type: QueryTypes.SELECT });
    let salida = [];
    let subtotal = 0;
    if (permanencia) {
      for (const element of permanencia) {
        if (
          (typeof element.detalle === 'object' || typeof element.detalle === 'string') &&
          (typeof element.cantidad === 'object' || typeof element.cantidad === 'string') &&
          (typeof element.valor === 'object' || typeof element.valor === 'string')  ) {

            const detalle_salida = {
              detalle: String(element.detalle),
              cantidad: Number(element.cantidad),
              valor: Number(element.valor)

            }
            subtotal = subtotal + detalle_salida.valor;
            salida.push(detalle_salida);

        }else {
            salida=undefined;
            break;
        }
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send({detalle: salida, subtotal: subtotal});
    }
  } catch (error) {
    res.status(500).send(error);
  }


}

/*********************************************************************************** */
/* Devuelve la tabla de descuentos para el EDP
  app.get("/api/reportes/v1/reportedescuentoshistorial", reportesController.findRepDescuentosHistorial)
*/
exports.findRepDescuentosHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve la tabla de descuentos para el EDP' */

      try {
        
        const campos = [
          'id_estado_pago'
        ];
        for (const element of campos) {
          if (!req.query[element]) {
            res.status(400).send({
              message: "No puede estar nulo el campo " + element
            });
            return;
          }
        };

        const sql = "SELECT detalle, cantidad, valor FROM sae.reporte_descuentos WHERE id_estado_resultado = :id_estado_pago order by fecha_hora";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const permanencia = await sequelize.query(sql, { replacements: { id_estado_pago: req.query.id_estado_pago }, type: QueryTypes.SELECT });
        let salida = [];
        let subtotal = 0;
        if (permanencia) {
          for (const element of permanencia) {
            if (
              (typeof element.detalle === 'object' || typeof element.detalle === 'string') &&
              (typeof element.cantidad === 'object' || typeof element.cantidad === 'string') &&
              (typeof element.valor === 'object' || typeof element.valor === 'string')  ) {
    
                const detalle_salida = {
                  detalle: String(element.detalle),
                  cantidad: Number(element.cantidad),
                  valor: Number(element.valor)
    
                }
                subtotal = subtotal + detalle_salida.valor;
                salida.push(detalle_salida);
    
            }else {
                salida=undefined;
                break;
            }
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send({detalle: salida, subtotal: subtotal});
        }
      } catch (error) {
        res.status(500).send(error);
      }

}

/*********************************************************************************** */
/* Devuelve la tabla de resumen para el EDP
  app.get("/api/reportes/v1/reporteresumenhistorial", reportesController.findRepResumenHistorial)
*/
exports. findRepResumenHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve la tabla de resumen para el EDP' */

      try {
        const campos = [
          'id_estado_pago'
        ];
        for (const element of campos) {
          if (!req.query[element]) {
            res.status(400).send({
              message: "No puede estar nulo el campo " + element
            });
            return;
          }
        };
        
        const sql = "select 1::integer as orden, 'BASE PERMANENCIA'::text as item, case when sum(valor_mes) is null then 0 else sum(valor_mes) \
        end as valor from (select brigada.nombre_brigada as brigada, case when tabla.turnos is null then 0 else tabla.turnos end as turnos, \
          brigada.valor_dia, case when tabla.turnos is null then 0 else tabla.turnos*brigada.valor_dia end as valor_mes from \
          (select br.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as nombre_brigada, \
          0 as turnos, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base WHERE id_cliente=1 and id_base= br.id_base \
          and id_turno=br.id_turno) as valor_dia, 0 as valor_mes from _comun.brigadas br JOIN _comun.servicios s ON br.id_servicio = \
          s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id) as brigada left join \
          (select id_brigada as id, count(id_brigada) as turnos from (SELECT rj.id, br.id as id_brigada FROM sae.reporte_jornada \
            rj join _comun.brigadas br on rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id WHERE brigada is not \
            null and s.sae and id_estado_resultado = :id_estado_pago and rj.tipo_turno = 1 ) as rj group by id_brigada) as tabla using (id) order by id) as xc \
            UNION \
            select  2::integer as orden, 'HORAS EXTRAS'::text as item, case when sum(valor_total) is null then 0 else sum(valor_total) end as valor \
            from (select xc.nombre_brigada as brigada, xc.cantidad as horas, xc.valor_hora as valor_base, xc.cantidad*valor_hora as valor_total \
              from (select rhe.*, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' as nombre_brigada, \
              ((SELECT (valor::numeric/7)::integer/8 as valor_dia FROM sae.cargo_fijo_x_base WHERE id_cliente=1 and id_base= br.id_base and \
              id_turno=br.id_turno)*(select valor FROM sae.cargo_hora_extra order by fecha desc limit 1))::integer as valor_hora from \
              (select brigada, sum(cantidad) as cantidad from sae.reporte_hora_extra where id_estado_resultado = :id_estado_pago group by brigada) rhe \
              JOIN _comun.brigadas br on rhe.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON \
              br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id) as xc order by xc.brigada) as xc \
              UNION \
              select  3::integer as orden, 'TURNOS ADICIONALES'::text as item, case when sum(valor_mes) is null then 0 else sum(valor_mes) end \
              as valor from (select nombre_brigada as brigada, count(nombre_brigada) as turnos, valor_dia::integer, sum(valor_dia::integer) \
              as valor_mes from (SELECT rj.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) || ' (' || b.nombre || ')' \
              as nombre_brigada, br.id as id_brigada, (SELECT (valor::numeric/7)::integer as valor_dia FROM sae.cargo_fijo_x_base WHERE \
              id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno)*(SELECT distinct on (fecha, tipo_turno) factor FROM sae.cargo_turno_adicional \
              where tipo_turno = rj.tipo_turno order by fecha desc, tipo_turno) as valor_dia FROM sae.reporte_jornada rj join _comun.brigadas \
              br on rj.brigada = br.id JOIN _comun.servicios s ON br.id_servicio = s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos \
              t on br.id_turno = t.id WHERE brigada is not null and s.sae and id_estado_resultado = :id_estado_pago and rj.tipo_turno = 2 ) as rj group by \
              id_brigada, nombre_brigada, valor_dia) xc \
              UNION \
              select  4::integer as orden, 'TURNOS CONTINGENCIA'::text as item, case when sum(valor_mes) is null then 0 else \
              sum(valor_mes) end as valor from (select nombre_brigada as brigada, count(nombre_brigada) as turnos, valor_dia::integer, \
              sum(valor_dia::integer) as valor_mes from (SELECT rj.id, (substr(t.inicio::text,1,5) || '-' || substr(t.fin::text,1,5)) \
              || ' (' || b.nombre || ')' as nombre_brigada, br.id as id_brigada, (SELECT (valor::numeric/7)::integer as valor_dia \
              FROM sae.cargo_fijo_x_base WHERE id_cliente=1 and id_base= br.id_base and id_turno=br.id_turno)*(SELECT distinct on \
                (fecha, tipo_turno) factor FROM sae.cargo_turno_adicional where tipo_turno = rj.tipo_turno order by fecha desc, tipo_turno) \
                as valor_dia FROM sae.reporte_jornada rj join _comun.brigadas br on rj.brigada = br.id JOIN _comun.servicios s ON \
                br.id_servicio = s.id JOIN _comun.base b ON br.id_base = b.id JOIN _comun.turnos t on br.id_turno = t.id WHERE brigada is \
                not null and s.sae and id_estado_resultado = :id_estado_pago and rj.tipo_turno = 3 ) as rj group by id_brigada, nombre_brigada, valor_dia) xc \
                UNION \
                select  5::integer as orden, 'PRODUCCION'::text as item, case when sum(valor_total) is null then 0 else sum(valor_total) end as \
                valor from (select descripcion, sum(valor_cobrar) as valor_total from (SELECT et.descripcion as descripcion, (select valor from \
                  sae.cargo_variable_x_base where id_cliente = 1 and id_base = br.id_base and id_evento_tipo = et.id and id_turno = br.id_turno) \
                  as valor_cobrar, et.id as tipo_evento FROM sae.reporte_eventos re join _comun.brigadas br on re.brigada = br.id join \
                  _comun.base b on br.id_base = b.id left join _comun.eventos_tipo et on re.tipo_evento = et.codigo WHERE id_estado_resultado = :id_estado_pago \
                  order by fecha_hora) as xz group by tipo_evento, descripcion order by tipo_evento) xc \
                  UNION \
                  SELECT  6::integer as orden, 'COBROS ADICIONALES'::text as item, case when sum(valor) is null then 0 else sum(valor) end as valor \
                  FROM sae.reporte_cobro_adicional WHERE id_estado_resultado = :id_estado_pago \
                  UNION \
                  SELECT  7::integer as orden, 'DESCUENTOS'::text as item, \
                  case when sum(valor) is null then 0 else sum(valor) end as valor FROM sae.reporte_descuentos WHERE id_estado_resultado = :id_estado_pago order by orden";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const resumen = await sequelize.query(sql, { replacements: { id_estado_pago: req.query.id_estado_pago }, type: QueryTypes.SELECT });
        let salida = [];
        let costo_directo = 0;
        if (resumen) {
          for (const element of resumen) {
            if (
              (typeof element.orden === 'object' || typeof element.orden === 'number') &&
              (typeof element.item === 'object' || typeof element.item === 'string') &&
              (typeof element.valor === 'object' || typeof element.valor === 'string')  ) {
    
                const detalle_salida = {
                  orden: Number(element.orden),
                  item: String(element.item),
                  valor: Number(element.valor)
                }
                if (element.orden === 7){
                  // Se resta el descuento
                  costo_directo = costo_directo - Number(element.valor);
                }else{
                  costo_directo = costo_directo + Number(element.valor);
                }    
                salida.push(detalle_salida);
    
            }else {
                salida=undefined;
                break;
            }
          };
          
          if (costo_directo){
            //Agregar el costo por ditancia y por emergencia
            let detalle_salida = {
              orden: Number(8),
              item: String('COSTO DIRECTO'),
              valor: Number(costo_directo)
            }
            salida.push(detalle_salida);
            detalle_salida = {
              orden: Number(9),
              item: String('RECARGO POR DISTANCIA'),
              valor: Number(0)
            }
            salida.push(detalle_salida);
            detalle_salida = {
              orden: Number(10),
              item: String('ESTADO DE EMERGENCIA'),
              valor: Number(0)
            }
            salida.push(detalle_salida);
/*
            let total = salida.filter((item) => item.orden > 7).reduce(((total, num) => total + num.valor), 0)
            let valor_neto = (total/1.19).toFixed(0);
            let iva = Number(total - valor_neto).toFixed(0);  
            */
            let valor_neto = salida.filter((item) => item.orden > 7).reduce(((total, num) => total + num.valor), 0)
            let total = Number((valor_neto * 1.19).toFixed(0));
            let iva = Number(total - valor_neto).toFixed(0);

            detalle_salida = {
              orden: Number(11),
              item: String('VALOR NETO'),
              valor: Number(valor_neto)
            }
            salida.push(detalle_salida);

            detalle_salida = {
              orden: Number(12),
              item: String('IVA'),
              valor: Number(iva)
            }
            salida.push(detalle_salida);

            detalle_salida = {
              orden: Number(13),
              item: String('TOTAL ESTADO DE PAGO'),
              valor: Number(total)
            }
            salida.push(detalle_salida);

          } else {
            let detalle_salida = {orden: Number(8), item: String('COSTO DIRECTO'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(9), item: String('RECARGO POR DISTANCIA'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(10), item: String('ESTADO DE EMERGENCIA'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(11), item: String('VALOR NETO'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(12), item: String('IVA'), valor: Number(0)};
            salida.push(detalle_salida);
            detalle_salida = {orden: Number(13), item: String('TOTAL ESTADO DE PAGO'), valor: Number(0)};
            salida.push(detalle_salida);

          }
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send({detalle: salida});
        }
      } catch (error) {
        res.status(500).send(error);
      }

}


/*********************************************************************************** */
/* Devuelve el detalle de PxQ para planilla Excel, ingresando parámetro del paquete
  app.get("/api/reportes/v1/detallepxqhistorial", reportesController.detallePxQHistorial)
*/
exports.detallePxQHistorial = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes - EDP - Historial']
      #swagger.description = 'Devuelve el detalle de PxQ para planilla Excel, se debe ingresar el id_paquete en la url ?id_paquete=[id_paquete]' */
      try {
        const campos = [
          'id_paquete', 'id_estado_pago'
        ];
        for (const element of campos) {
          if (!req.query[element]) {
            res.status(400).send({
              message: "No puede estar nulo el campo " + element
            });
            return;
          }
        };
        
        const sql = "SELECT re.id, to_char(re.fecha_hora::timestamp with time zone, 'DD-MM-YYYY'::text) AS fecha, hora_termino::text, \
        numero_ot as centrality, (select trim(nombres || ' ' || apellido_1 || ' ' || case when apellido_2 is null then '' else ' ' || apellido_2 end) as maestro from _auth.personas \
        where rut = re.rut_maestro) as maestro, (select trim(nombres || ' ' || apellido_1 || ' ' || case when apellido_2 is null then '' else ' ' || apellido_2 end) as maestro \
        from _auth.personas where rut = re.rut_ayudante) as ayudante, despachador, c.nombre as comuna, direccion, \
        requerimiento as aviso, re.trabajo_solicitado, re.trabajo_realizado, et.descripcion as descripcion, (select valor from sae.cargo_variable_x_base where \
          id_cliente = 1 and id_base = br.id_base and id_evento_tipo = et.id and id_turno = br.id_turno) as \
          valor_cobrar, ti.nombre as tipo_turno FROM sae.reporte_eventos re join _comun.brigadas br on re.brigada = br.id \
          join _comun.base b on br.id_base = b.id left join _comun.comunas c on re.comuna = c.codigo left join \
          _comun.eventos_tipo et on re.tipo_evento = et.codigo join _comun.tipo_turno ti on re.tipo_turno = ti.id \
          where b.id_paquete = :id_paquete and id_estado_resultado = :id_estado_pago order by fecha_hora;";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const eventos = await sequelize.query(sql, { replacements: { id_paquete: req.query.id_paquete, id_estado_pago: req.query.id_estado_pago }, type: QueryTypes.SELECT });
        let salida = [];
        if (eventos) {
          for (const element of eventos) {
            if (
              typeof element.id === 'number' &&
              (typeof element.fecha === 'object' || typeof element.fecha === 'string') &&
              (typeof element.hora_termino === 'object' || typeof element.hora_termino === 'string') &&
              (typeof element.centrality === 'object' || typeof element.centrality === 'string') &&
              (typeof element.maestro === 'object' || typeof element.maestro === 'string') &&
              (typeof element.ayudante === 'object' || typeof element.ayudante === 'string') &&
              (typeof element.despachador === 'object' || typeof element.despachador === 'string') &&
              (typeof element.comuna === 'object' || typeof element.comuna === 'string') &&
              (typeof element.direccion === 'object' || typeof element.direccion === 'string') &&
              (typeof element.aviso === 'object' || typeof element.aviso === 'string') &&
              (typeof element.descripcion === 'object' || typeof element.descripcion === 'string') &&
              (typeof element.valor_cobrar === 'number' || typeof element.valor_cobrar === 'string') &&
              (typeof element.tipo_turno === 'object' || typeof element.tipo_turno === 'string') &&
              (typeof element.trabajo_realizado === 'object' || typeof element.trabajo_realizado === 'string') &&
              (typeof element.trabajo_solicitado === 'object' || typeof element.trabajo_solicitado === 'string')) {
    
                const detalle_salida = {
                  id: Number(element.id),
                  fecha: String(element.fecha),
                  hora_termino: String(element.hora_termino),
                  centrality: String(element.centrality),
                  maestro: String(element.maestro),
                  ayudante: String(element.ayudante),
                  patente: String('SWCX-56'),
                  despachador: String(element.despachador),
                  comuna: String(element.comuna),
                  direccion: String(element.direccion),
                  aviso: String(element.aviso),
                  descripcion: String(element.descripcion),
                  valor_cobrar: Number(element.valor_cobrar),
                  tipo_turno: String(element.tipo_turno),
                  trabajo_realizado: String(element.trabajo_realizado),
                  trabajo_solicitado: String(element.trabajo_solicitado)
    
                }
                salida.push(detalle_salida);
    
            }else {
                salida=undefined;
                break;
            }
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send(salida);
        }
      } catch (error) {
        res.status(500).send(error);
      }
}

/*********************************************************************************** */
/* Devuelve el resumen de las operaciones de SAE
*/
exports.getResumenSae = async (req, res) => {
  /*  #swagger.tags = ['SAE - Backoffice - Reportes']
    #swagger.description = 'Devuelve el resumen de las operaciones de SAE' */
    try {

      const respuesta = {
        resumen_periodo: []
      }
  
      
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
  
      let sql = "select periodo, count(id) as eventos from (SELECT re.id, date_part('year', fecha_hora) as anual, \
      date_part('month', fecha_hora) as mes, m.nombre || '-' || date_part('year', fecha_hora)::varchar as periodo \
      from sae.reporte_eventos re join _comun.meses m on date_part('month', re.fecha_hora) = m.id) as a \
      group by periodo, anual, mes order by anual, mes";
      
      const resumenSaeEventosPeriodo = await sequelize.query(sql, { type: QueryTypes.SELECT });
  
      if (resumenSaeEventosPeriodo) {
        respuesta.resumen_periodo = resumenSaeEventosPeriodo;
      }else{
        res.status(500).send("Error en la consulta (servidor backend)");
        return;
      }
  
      res.status(200).send(respuesta);
  
    } catch (error) {
      res.status(500).send(error);
    }
}