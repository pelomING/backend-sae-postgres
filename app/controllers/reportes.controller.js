const db = require("../models");
const Jornada = db.jornada;
const EstadoResultado = db.estadoResultado;
const DetalleEstadoResultado = db.detalleEstadoResultado;

exports.readAllJornada = async (req, res) => {
    await Jornada.findAll().then(data => {
        console.log(data);
        res.send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
}

exports.findAllJornadas = async (req, res) => {
    try {
      const sql = "SELECT id, rut_maestro, rut_ayudante, codigo_turno, patente, id_paquete as paquete, km_inicial, km_final, fecha_hora_ini::text, \
      fecha_hora_fin::text, estado	FROM reporte.jornada ORDER BY id ASC;";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const jornadas = await sequelize.query(sql, { type: QueryTypes.SELECT });
      res.status(200).send(jornadas);
    } catch (error) {
      res.status(500).send(error);
    }
    
  }

  exports.findAllEventos = async (req, res) => {
    try {
      const sql = "SELECT e.id, e.numero_ot, et.descripcion as tipo_evento, e.rut_maestro, e.rut_ayudante, \
      (substr(t.inicio::text,1,5) || ' - ' || substr(t.fin::text,1,5)) as turno, p.nombre as paquete, \
      e.requerimiento, e.direccion, e.fecha_hora::text, e.estado FROM reporte.eventos e join \
      public.eventos_tipo et on e.tipo_evento = et.codigo join public.turnos t on e.codigo_turno = t.id join \
      public.paquete p on e.id_paquete = p.id order by e.id asc";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const eventos = await sequelize.query(sql, { type: QueryTypes.SELECT });
      res.status(200).send(eventos);
    } catch (error) {
      res.status(500).send(error);
    }
    
  }


  exports.creaEstadoResultado = async (req, res) => {
    try {
      const campos = [
        'id_usuario', 'zona', 'paquete', 'mes', 'fecha_inicio', 'fecha_final', 'nombre_doc', 'url_doc', 'fecha_creacion', 'fecha_modificacion', 'estado', 'eventos_relacionados'
      ];
      for (const element of campos) {
        if (!req.body[element]) {
          res.status(400).send({
            message: "No puede estar nulo el campo " + element
          });
          return;
        }
      };

      console.log(req.body.eventos_relacionados);
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
        estado: req.body.estado
      }).then(async data => {
            let hayError = false;
            let mensajeError = '';
            for (const detalle of detalles) {
              console.log(detalle);
              await DetalleEstadoResultado.create({
                id_estado_resultado: data.id,
                id_evento: detalle
              }).then(data => {
                console.log(data)
                //res.send(data);
              }).catch(err => {
                hayError = true;
                mensajeError = err.message;
                //res.status(500).send({ message: err.message });
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


  exports.findAllEstadosResultado = async (req, res) => {
    try {
      const sql = "SELECT er.id, id_usuario, u.username as nombre_usuario, zona, z.nombre as nombre_zona, paquete, \
      p.nombre as nombre_paquete, mes, m.nombre as nombre_mes, fecha_inicio, fecha_final, nombre_doc, url_doc, \
      fecha_creacion, fecha_modificacion, estado, (SELECT array_agg(id_evento) as eventos FROM reporte.detalle_estado_resultado  \
      where id_estado_resultado = er.id) as eventos_relacionados	FROM reporte.estado_resultado er INNER JOIN public.users u \
      on er.id_usuario = u.id	INNER JOIN public.zonal z on z.id = er.zona	INNER JOIN public.paquete p on p.id = er.paquete	\
      INNER JOIN public.meses m on m.id = er.mes;";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const estadosResultado = await sequelize.query(sql, { type: QueryTypes.SELECT });
      res.status(200).send(estadosResultado);
    } catch (error) {
      res.status(500).send(error);
    }
  }


exports.resumenEventos = async (req, res) => {
  try {
    const campos = [
      'id_paquete', 'fecha_inicial', 'fecha_final'
    ];
    for (const element of campos) {
      if (!req.body[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    const sql = "SELECT e.id_paquete, e.tipo_evento, et.id as id_evento, et.descripcion as glosa_evento, \
    pb.valor as precio, count(e.id) as cantidad, (pb.valor*count(e.id)) as monto from reporte.eventos e \
    inner join public.eventos_tipo et on et.codigo = e.tipo_evento inner join (SELECT distinct on \
      (id_cliente, id_paquete, id_evento_tipo) id_cliente, id_paquete, id_evento_tipo, valor FROM \
      public.precios_base ORDER BY id_cliente, id_paquete, id_evento_tipo ASC ) as pb on et.id = \
      pb.id_evento_tipo and e.id_paquete = pb.id_paquete and pb.id_cliente = 1 where estado = 1 and \
      e.id_paquete = :id_paquete and (fecha_hora between :fec_ini and :fec_fin) group by \
      e.id_paquete, e.tipo_evento, et.id, et.descripcion, pb.valor;";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const eventos = await sequelize.query(sql, { replacements: { id_paquete: req.body.id_paquete, fec_ini: req.body.fecha_inicial, fec_fin: req.body.fecha_final }, type: QueryTypes.SELECT });
    res.status(200).send(eventos);
  } catch (error) {
    res.status(500).send(error);
  }
}


exports.resumenTurnos = async (req, res) => {
  try {
    console.log('parametros', req);
    const campos = [
      'id_paquete', 'fecha_inicial', 'fecha_final'
    ];
    for (const element of campos) {
      if (!req.params[element]) {
        res.status(400).send({
          message: "No puede estar nulo el campo " + element
        });
        return;
      }
    };
    
    const sql = "select r.*, (r.cantidad_brigada*r.precio*r.uso_semanal)::integer as monto from \
    (SELECT id_paquete, id_turno, (substring(t.inicio::text,1,5) || ' - ' || substring(t.fin::text,1,5)) as permanencia_semanal, \
    cantidad_brigada, valor as precio, ((date :fec_fin - (date :fec_ini - 1))::numeric/7)::numeric(6,4) \
    as uso_semanal 	FROM public.cargo_fijo cf inner join public.turnos t on t.id = cf.id_turno where id_cliente = 1 and id_paquete = :id_paquete) r;";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const eventos = await sequelize.query(sql, { replacements: { id_paquete: req.params.id_paquete, fec_ini: req.params.fecha_inicial, fec_fin: req.params.fecha_final }, type: QueryTypes.SELECT });
    res.status(200).send(eventos);
  } catch (error) {
    res.status(500).send(error);
  }
}