const db = require("../../models");
const EncabezadoReporteDiario = db.encabezadoReporteDiario;
const DetalleReporteDiarioActividad = db.detalleReporteDiarioActividad;
const DetalleRporteDiarioOtrasActividades = db.detalleReporteDiarioOtrasActividades; 
const tipoOperacion = db.tipoOperacion;
const maestroActividad = db.maestroActividad;
const Obra = db.obra;
const ObrasHistorialCambios = db.obrasHistorialCambios;
//const encabezado_reporte_diario = db.encabezadoReporteDiario;
const JefesFaena = db.jefesFaena;
const TipoActividad = db.tipoActividad;
const TipoTrabajo = db.tipoTrabajo;

/***********************************************************************************/
/*                                                                                 */
/*                                                                                 */
/*                                 REPORTE DIARIO                                  */
/*                                                                                 */
/*                                                                                 */
/***********************************************************************************/


/*********************************************************************************** */
/* Consulta todos los encabezados reportes diarios
;
*/
exports.findAllEncabezadoReporteDiario = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Devuelve todos los ancabezados de reporte diario' */
    try {
      /*
        const sql = "SELECT rd.id, json_build_object('id', o.id, 'codigo_obra', o.codigo_obra) as id_obra, fecha_reporte::text, \
        row_to_json(jf) as jefe_faena, sdi, rd.gestor_cliente, row_to_json(tt) as id_area, brigada_pesada, observaciones, \
        entregado_por_persona, fecha_entregado::text, revisado_por_persona, fecha_revisado::text, sector, hora_salida_base::text, \
        hora_llegada_terreno::text, hora_salida_terreno::text, hora_llegada_base::text, alimentador, row_to_json(c) as comuna, \
        num_documento, flexiapp FROM obras.encabezado_reporte_diario rd join obras.tipo_trabajo tt on rd.id_area = tt.id join \
        obras.obras o on rd.id_obra = o.id join _comun.comunas c on rd.comuna = c.codigo left join obras.jefes_faena jf on rd.jefe_faena = jf.id";
        */
       const sql = "SELECT rd.id, id_estado_pago, json_build_object('id', o.id, 'codigo_obra', o.codigo_obra) as id_obra, fecha_reporte::text, \
       row_to_json(jf) as jefe_faena, sdi, rd.gestor_cliente, row_to_json(tt) as id_area, brigada_pesada, observaciones, \
       entregado_por_persona, fecha_entregado::text, revisado_por_persona, fecha_revisado::text, sector, hora_salida_base::text, \
       hora_llegada_terreno::text, hora_salida_terreno::text, hora_llegada_base::text, alimentador, row_to_json(c) as comuna, \
       num_documento, flexiapp, row_to_json(rec) as recargo, (select array_agg(detalle) as detalle_actividad from \
       (select row_to_json(a) as detalle from (SELECT dra.id, row_to_json(top) as tipo_operacion, ma.tipo_actividad, \
       row_to_json(ma) as actividad, cantidad, json_build_object('id', erd.id, 'id_obra', erd.id_obra, 'fecha_reporte', \
       erd.fecha_reporte) as encabezado_reporte, case when top.id = 1 then uc_instalacion when top.id = 2 then uc_retiro \
       when top.id = 3 then uc_traslado else 0 end as unitario, case when top.id = 1 then uc_instalacion when top.id = 2 \
       then uc_retiro when top.id = 3 then uc_traslado else 0 end * cantidad as total FROM obras.detalle_reporte_diario_actividad \
       dra join obras.tipo_operacion top on dra.tipo_operacion = top.id join (SELECT ma.id, actividad, row_to_json(ta) \
       as tipo_actividad, uc_instalacion, uc_retiro, uc_traslado, ma.descripcion, row_to_json(mu) as unidad FROM \
       obras.maestro_actividades ma join obras.tipo_actividad ta on ma.id_tipo_actividad = ta.id join obras.maestro_unidades \
       mu on ma.id_unidad = mu.id) ma on dra.id_actividad = ma.id join obras.encabezado_reporte_diario erd on \
       dra.id_encabezado_rep = erd.id WHERE dra.id_encabezado_rep = rd.id) a) b), (select array_agg(detalle) as \
       detalle_otros from (select row_to_json(a) as detalle from (SELECT drd.id, glosa, uc_unitaria, cantidad, \
        total_uc, json_build_object('id', erd.id, 'id_obra', erd.id_obra, 'fecha_reporte', erd.fecha_reporte) as \
        encabezado_reporte FROM obras.detalle_reporte_diario_otras_actividades drd join obras.encabezado_reporte_diario \
        erd on drd.id_encabezado_rep = erd.id WHERE drd.id_encabezado_rep = rd.id) a) b) FROM obras.encabezado_reporte_diario \
        rd join obras.tipo_trabajo tt on rd.id_area = tt.id join obras.obras o on rd.id_obra = o.id join _comun.comunas c \
        on rd.comuna = c.codigo left join obras.jefes_faena jf on rd.jefe_faena = jf.id left join obras.recargos rec on \
        rd.recargo_hora = rec.id";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const encabezadoReporte = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        if (encabezadoReporte) {
          for (const element of encabezadoReporte) {
    
                const detalle_salida = {
                  id: Number(element.id),
                  id_estado_pago: element.id_estado_pago?Number(element.id_estado_pago):null,
                  id_obra: element.id_obra, //json {"id": id, "codigo_obra": codigo_obra}
                  fecha_reporte: String(element.fecha_reporte),
                  jefe_faena: element.jefe_faena,
                  sdi: String(element.sdi),
                  supervisor: String(element.revisado_por_persona),
                  ito_mandante: String(element.gestor_cliente),
                  area: element.id_area, //json {"id": id, "descripcion": descripcion}
                  brigada_pesada: element.brigada_pesada?{ id: 2, descripcion: 'PESADA' }:{ id: 1, descripcion: 'LIVIANA'},
                  observaciones: String(element.observaciones),
                  entregado_por_persona: String(element.entregado_por_persona),
                  fecha_entregado: String(element.fecha_entregado),
                  revisado_por_persona: String(element.revisado_por_persona),
                  fecha_revisado: String(element.fecha_revisado),
                  sector: String(element.sector),
                  hora_salida_base: String(element.hora_salida_base),
                  hora_llegada_terreno: String(element.hora_llegada_terreno),
                  hora_salida_terreno: String(element.hora_salida_terreno),
                  hora_llegada_base: String(element.hora_llegada_base),
                  alimentador: String(element.alimentador),
                  comuna: element.comuna,
                  num_documento: String(element.num_documento),
                  flexiapp: element.flexiapp,
                  recargo_hora: element.recargo,
                  det_actividad: element.detalle_actividad,
                  det_otros: element.detalle_otros
                  
                }
                salida.push(detalle_salida);
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
/* Consulta todos los encabezados reportes diarios por parámetros
;
*/
exports.findAllEncabezadoReporteDiarioByParametros = async (req, res) => {
   /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Devuelve todos los ancabezados de reporte diario por parametro: id de reporte, id_obra, fecha_reporte
      , debe indicarse al menos uno' */
  const parametros = {
    id: req.query.id,
    id_obra: req.query.id_obra,
    fecha_reporte: req.query.fecha_reporte
  }
  const keys = Object.keys(parametros)
  let sql_array = [];
  let param = {};
  for (element of keys) {
    if (parametros[element]){
      if (element === "id") {
        sql_array.push("rd.id = :" + element);
        param[element] = Number(parametros[element]);
      }
      if (element === "id_obra") {
        sql_array.push("o.id = :" + element);
        param[element] = Number(parametros[element]);
      }
      if (element === "fecha_reporte") {
        sql_array.push("rd.fecha_reporte = :" + element);
        param[element] = String(parametros[element]);
      }
    }
  }

  if (sql_array.length === 0) {
    res.status(500).send("Debe incluir algun parametro para consultar");
  }else {
    try {
      let b = sql_array.reduce((total, num) => total + " AND " + num);
      if (b){
        /*
        const sql = "SELECT rd.id, json_build_object('id', o.id, 'codigo_obra', o.codigo_obra) as id_obra, \
        fecha_reporte::text, jefe_faena, sdi, rd.gestor_cliente, row_to_json(tt) as id_area, brigada_pesada, \
        observaciones, entregado_por_persona, fecha_entregado::text, revisado_por_persona, fecha_revisado::text, \
        sector, hora_salida_base::text, hora_llegada_terreno::text, hora_salida_terreno::text, hora_llegada_base::text, \
        alimentador, row_to_json(c) as comuna, num_documento, flexiapp FROM obras.encabezado_reporte_diario rd join obras.tipo_trabajo \
        tt on rd.id_area = tt.id join obras.obras o on rd.id_obra = o.id join _comun.comunas c on rd.comuna = c.codigo WHERE "+b;*/

        /*
        const sql = "SELECT rd.id, json_build_object('id', o.id, 'codigo_obra', o.codigo_obra) as id_obra, fecha_reporte::text, \
        row_to_json(jf) as jefe_faena, sdi, rd.gestor_cliente, row_to_json(tt) as id_area, brigada_pesada, observaciones, \
        entregado_por_persona, fecha_entregado::text, revisado_por_persona, fecha_revisado::text, sector, hora_salida_base::text, \
        hora_llegada_terreno::text, hora_salida_terreno::text, hora_llegada_base::text, alimentador, row_to_json(c) as comuna, \
        num_documento, flexiapp FROM obras.encabezado_reporte_diario rd join obras.tipo_trabajo tt on rd.id_area = tt.id join \
        obras.obras o on rd.id_obra = o.id join _comun.comunas c on rd.comuna = c.codigo left join obras.jefes_faena jf on rd.jefe_faena = jf.id WHERE "+b;
        */
       const sql = "SELECT rd.id, id_estado_pago, json_build_object('id', o.id, 'codigo_obra', o.codigo_obra) as id_obra, fecha_reporte::text, \
       row_to_json(jf) as jefe_faena, sdi, rd.gestor_cliente, row_to_json(tt) as id_area, brigada_pesada, observaciones, \
       entregado_por_persona, fecha_entregado::text, revisado_por_persona, fecha_revisado::text, sector, hora_salida_base::text, \
       hora_llegada_terreno::text, hora_salida_terreno::text, hora_llegada_base::text, alimentador, row_to_json(c) as comuna, \
       num_documento, flexiapp, row_to_json(rec) as recargo, (select array_agg(detalle) as detalle_actividad from (select row_to_json(a) as detalle from \
       (SELECT dra.id, row_to_json(top) as tipo_operacion, ma.tipo_actividad, row_to_json(ma) as actividad, cantidad, \
       json_build_object('id', erd.id, 'id_obra', erd.id_obra, 'fecha_reporte', erd.fecha_reporte) as encabezado_reporte, \
       case when top.id = 1 then uc_instalacion when top.id = 2 then uc_retiro when top.id = 3 then uc_traslado else 0 \
       end as unitario, case when top.id = 1 then uc_instalacion when top.id = 2 then uc_retiro when top.id = 3 then \
       uc_traslado else 0 end * cantidad as total FROM obras.detalle_reporte_diario_actividad dra join obras.tipo_operacion \
       top on dra.tipo_operacion = top.id join (SELECT ma.id, actividad, row_to_json(ta) as tipo_actividad, uc_instalacion, \
       uc_retiro, uc_traslado, ma.descripcion, row_to_json(mu) as unidad FROM obras.maestro_actividades ma join \
       obras.tipo_actividad ta on ma.id_tipo_actividad = ta.id join obras.maestro_unidades mu on ma.id_unidad = mu.id) \
       ma on dra.id_actividad = ma.id join obras.encabezado_reporte_diario erd on dra.id_encabezado_rep = erd.id \
       WHERE dra.id_encabezado_rep = rd.id) a) b), (select array_agg(detalle) as detalle_otros from (select row_to_json(a) \
       as detalle from (SELECT drd.id, glosa, uc_unitaria, cantidad, total_uc, json_build_object('id', erd.id, 'id_obra', \
       erd.id_obra, 'fecha_reporte', erd.fecha_reporte) as encabezado_reporte FROM obras.detalle_reporte_diario_otras_actividades \
       drd join obras.encabezado_reporte_diario erd on drd.id_encabezado_rep = erd.id WHERE drd.id_encabezado_rep = rd.id) \
       a) b) FROM obras.encabezado_reporte_diario rd join obras.tipo_trabajo tt on rd.id_area = tt.id join obras.obras o \
       on rd.id_obra = o.id join _comun.comunas c on rd.comuna = c.codigo left join obras.jefes_faena jf on rd.jefe_faena = \
       jf.id left join obras.recargos rec on rd.recargo_hora = rec.id WHERE "+b;

        console.log("sql: "+sql);
        const { QueryTypes } = require('sequelize'); 
        const sequelize = db.sequelize;
        const encabezadoReporte = await sequelize.query(sql, { replacements: param, type: QueryTypes.SELECT });
        let salida = [];
        if (encabezadoReporte) {
          for (const element of encabezadoReporte) {
            

            const detalle_salida = {
              id: Number(element.id),
              id_estado_pago: element.id_estado_pago?Number(element.id_estado_pago):null,
              id_obra: element.id_obra, //json {"id": id, "codigo_obra": codigo_obra}
              fecha_reporte: String(element.fecha_reporte),
              jefe_faena: element.jefe_faena,
              sdi: String(element.sdi),
              supervisor: String(element.revisado_por_persona),
              ito_mandante: String(element.gestor_cliente),
              area: element.id_area, //json {"id": id, "descripcion": descripcion}
              brigada_pesada: element.brigada_pesada?{ id: 2, descripcion: 'PESADA' }:{ id: 1, descripcion: 'LIVIANA'},
              observaciones: String(element.observaciones),
              entregado_por_persona: String(element.entregado_por_persona),
              fecha_entregado: String(element.fecha_entregado),
              revisado_por_persona: String(element.revisado_por_persona),
              fecha_revisado: String(element.fecha_revisado),
              sector: String(element.sector),
              hora_salida_base: String(element.hora_salida_base),
              hora_llegada_terreno: String(element.hora_llegada_terreno),
              hora_salida_terreno: String(element.hora_salida_terreno),
              hora_llegada_base: String(element.hora_llegada_base),
              alimentador: String(element.alimentador),
              comuna: element.comuna,
              num_documento: String(element.num_documento),
              flexiapp: element.flexiapp,
              recargo_hora: element.recargo,
              det_actividad: element.detalle_actividad,
              det_otros: element.detalle_otros


            }
                salida.push(detalle_salida);
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send(salida);
        }
      }else {
        res.status(500).send("Error en la consulta (servidor backend)");
      }
    }catch (error) {
      res.status(500).send(error);
    }
  }
}
/*********************************************************************************** */
/* Consulta el ultimo de encabezado de reporte diario
*/
exports.findUltimoEncabezadoReporteDiarioByIdObra = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
     #swagger.description = 'Consulta el ultimo de encabezado de reporte diario por id de obra' */
 const parametros = {
   id_obra: req.query.id_obra,
 }
 const keys = Object.keys(parametros)
 let sql_array = [];
 let param = {};
 for (element of keys) {
   if (parametros[element]){
     if (element === "id_obra") {
       sql_array.push("o.id = :" + element);
       param[element] = Number(parametros[element]);
     }
   }
 }

 if (sql_array.length === 0) {
   res.status(400).send("Debe incluir el parametro de id de obra");
 }else {
   try {
     let b = sql_array.reduce((total, num) => total + " AND " + num);
     if (b){
      
      const sql = "SELECT rd.id, id_estado_pago, json_build_object('id', o.id, 'codigo_obra', o.codigo_obra) as id_obra, \
      row_to_json(jf) as jefe_faena, sdi, rd.gestor_cliente, row_to_json(tt) as id_area, brigada_pesada, observaciones, \
      entregado_por_persona, revisado_por_persona, sector, alimentador, row_to_json(c) as comuna, num_documento, \
      flexiapp FROM obras.encabezado_reporte_diario rd join obras.tipo_trabajo tt on rd.id_area = tt.id join obras.obras o \
      on rd.id_obra = o.id join _comun.comunas c on rd.comuna = c.codigo left join obras.jefes_faena jf on rd.jefe_faena = \
      jf.id left join obras.recargos rec on rd.recargo_hora = rec.id WHERE "+b+" order by fecha_reporte desc limit 1;";

       console.log("sql: "+sql);
       const { QueryTypes } = require('sequelize'); 
       const sequelize = db.sequelize;
       const encabezadoReporte = await sequelize.query(sql, { replacements: param, type: QueryTypes.SELECT });
       let salida = [];
       if (encabezadoReporte) {
        const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
        const fecha_hoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2)

         for (const element of encabezadoReporte) {
           

           const detalle_salida = {
             id: Number(element.id),
             id_estado_pago: element.id_estado_pago?Number(element.id_estado_pago):null,
             id_obra: element.id_obra, //json {"id": id, "codigo_obra": codigo_obra}
             fecha_reporte: String(fecha_hoy),
             jefe_faena: element.jefe_faena,
             sdi: String(element.sdi),
             supervisor: String(element.revisado_por_persona),
             ito_mandante: String(element.gestor_cliente),
             area: element.id_area, //json {"id": id, "descripcion": descripcion}
             brigada_pesada: element.brigada_pesada?{ id: 2, descripcion: 'PESADA' }:{ id: 1, descripcion: 'LIVIANA'},
             observaciones: String(element.observaciones),
             entregado_por_persona: String(element.entregado_por_persona),
             fecha_entregado: String(fecha_hoy),
             revisado_por_persona: String(element.revisado_por_persona),
             fecha_revisado: String(fecha_hoy),
             sector: String(element.sector),
             //hora_salida_base: String(element.hora_salida_base),
             //hora_llegada_terreno: String(element.hora_llegada_terreno),
             //hora_salida_terreno: String(element.hora_salida_terreno),
             //hora_llegada_base: String(element.hora_llegada_base),
             alimentador: String(element.alimentador),
             comuna: element.comuna,
             num_documento: String(element.num_documento),
             flexiapp: element.flexiapp,
             //recargo_hora: element.recargo,
             //det_actividad: element.detalle_actividad,
             //det_otros: element.detalle_otros


           }
               salida.push(detalle_salida);
         };
       }
       if (salida===undefined){
         res.status(500).send("Error en la consulta (servidor backend)");
       }else{
         res.status(200).send(salida);
       }
     }else {
       res.status(500).send("Error en la consulta (servidor backend)");
     }
   }catch (error) {
     res.status(500).send(error);
   }
 }
}
/*********************************************************************************** */
/* Crea un reporte diario
;
*/
exports.createEncabezadoReporteDiario = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Crea un encabezado de reporte diario'
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos encabezado reporte diario',
            required: true,
            schema: {
                id_obra: 1,
                fecha_reporte: "2023-10-25",
                jefe_faena: 1,
                sdi: "sdi",
                ito_mandante: "nombre gestor cliente",
                id_area: 1,
                brigada_pesada: false,
                observaciones: "observaciones",
                entregado_por_persona: "nombre persona",
                fecha_entregado: "2023-10-25",
                revisado_por_persona: "nombre persona que revisa",
                fecha_revisado: "2023-10-25",
                sector: "direccion sector",
                hora_salida_base: "2023-10-25 07:30:00",
                hora_llegada_terreno: "2023-10-25 08:00",
                hora_salida_terreno: "2023-10-25 18:30",
                hora_llegada_base: "2023-10-25 19:30",
                alimentador: "alimentador",
                comuna: "10305",
                num_documento: "10001000600",
                flexiapp: ["CGE-123343-55", "CGE-123343-56"],
                det_actividad: [
                    {
                      "clase": 1,
                      "tipo": 1,
                      "actividad": 1,
                      "cantidad": 1
                    },
                    {
                      "clase": 1,
                      "tipo": 1,
                      "actividad": 2,
                      "cantidad": 3
                    }
                ],
                det_otros: [
                      {
                        "glosa": "descripcion de la tarea 1", 
                        "uc_unitaria": 1, 
                        "cantidad": 1, 
                        "uc_total": 1
                      },
                      {
                        "glosa": "descripcion de la tarea 2", 
                        "uc_unitaria": 1, 
                        "cantidad": 1, 
                        "uc_total": 1
                      }
                ]
            }
        } */
  try{
      let salir = false;
      const campos = [
        'id_obra', 'fecha_reporte', 'jefe_faena', 'sdi', 'ito_mandante', 'id_area', 
        'observaciones', 'entregado_por_persona', 'fecha_entregado', 
        'revisado_por_persona', 'fecha_revisado', 'sector', 'hora_salida_base', 
        'hora_llegada_terreno', 'hora_salida_terreno', 'hora_llegada_base'
      ];
      for (const element of campos) {
        if (!req.body[element]) {
          res.status(400).send(
            "No puede estar nulo el campo " + element
          );
          return;
        }
      };

      //Verifica que la fecha de reporte no este asignada a una obra
      await EncabezadoReporteDiario.findAll({where: {id_obra: req.body.id_obra, fecha_reporte: req.body.fecha_reporte}}).then(data => {
          //el rut ya existe
          if (data.length > 0) {
            salir = true;
            res.status(400).send('El Codigo de Obra ya se encuentra ingresado en la base' );
          }
        }).catch(err => {
            salir = true;
            res.status(500).send(err.message );
        })
      
        if (salir) {
          return;
        }
        //const flexiapp = req.body.flexiapp;
        let flexiapp = "{";
        for (const b of req.body.flexiapp){
          if (flexiapp.length==1) {
            flexiapp = flexiapp + b
          }else {
            flexiapp = flexiapp + ", " + b
          }
        }
        flexiapp = flexiapp + "}"
        // procesa detalle de actividad
        for (const element of req.body.det_actividad) {
          if (!element.clase || !element.actividad || !element.cantidad) {
            res.status(400).send("No puede estar nulo el campo " + element
            );
            return;
          }
        };

        // Busca el ID de encabezado disponible
        const sql = "select nextval('obras.encabezado_reporte_diario_id_seq'::regclass) as valor";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        let encabezado_reporte_diario_id = 0;
        await sequelize.query(sql, {
          type: QueryTypes.SELECT
        }).then(data => {
          encabezado_reporte_diario_id = data[0].valor;
        }).catch(err => {
          res.status(500).send(err.message );
        })

        const encabezado_reporte_diario = {
            id: encabezado_reporte_diario_id,
            id_obra: Number(req.body.id_obra),
            fecha_reporte: String(req.body.fecha_reporte),
            jefe_faena: Number(req.body.jefe_faena),
            sdi: String(req.body.sdi),
            gestor_cliente: String(req.body.ito_mandante),
            id_area: Number(req.body.id_area),
            brigada_pesada: Boolean(req.body.brigada_pesada),
            observaciones: String(req.body.observaciones),
            entregado_por_persona: String(req.body.entregado_por_persona),
            fecha_entregado: String(req.body.fecha_entregado),
            revisado_por_persona: String(req.body.revisado_por_persona),
            fecha_revisado: String(req.body.fecha_revisado),
            sector: String(req.body.sector),
            hora_salida_base: String(req.body.hora_salida_base),
            hora_llegada_terreno: String(req.body.hora_llegada_terreno),
            hora_salida_terreno: String(req.body.hora_salida_terreno),
            hora_llegada_base: String(req.body.hora_llegada_base),
            alimentador: String(req.body.alimentador),
            comuna: String(req.body.comuna),
            num_documento: String(req.body.num_documento),
            flexiapp: String(flexiapp)
        }
        /*
        sql_insert_encabezado = `INSERT INTO obras.encabezado_reporte_diario(id, id_obra, fecha_reporte, sdi, gestor_cliente, \
          id_area, brigada_pesada, observaciones, entregado_por_persona, fecha_entregado, revisado_por_persona, fecha_revisado, \
          sector, hora_salida_base, hora_llegada_terreno, hora_salida_terreno, hora_llegada_base, alimentador, comuna, \
          num_documento, jefe_faena, flexiapp) VALUES (${encabezado_reporte_diario.id}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
*/
        await EncabezadoReporteDiario.create(encabezado_reporte_diario)
          .then(data => {
              res.status(200).send(data);
          }).catch(err => {
              res.status(500).send(err.message );
          })
  }catch (error) {
    res.status(500).send(error);
  }

}
/*********************************************************************************** */
/* Crea un reporte diario Versión 2
;
*/
exports.createEncabezadoReporteDiario_V2 = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Crea un encabezado de reporte diario'
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos encabezado reporte diario',
            required: true,
            schema: {
                id_obra: 1,
                fecha_reporte: "2023-10-25",
                jefe_faena: 1,
                sdi: "sdi",
                ito_mandante: "nombre gestor cliente",
                id_area: 1,
                brigada_pesada: false,
                observaciones: "observaciones",
                entregado_por_persona: "nombre persona",
                fecha_entregado: "2023-10-25",
                revisado_por_persona: "nombre persona que revisa",
                fecha_revisado: "2023-10-25",
                sector: "direccion sector",
                hora_salida_base: "2023-10-25 07:30:00",
                hora_llegada_terreno: "2023-10-25 08:00",
                hora_salida_terreno: "2023-10-25 18:30",
                hora_llegada_base: "2023-10-25 19:30",
                alimentador: "alimentador",
                comuna: "10305",
                num_documento: "10001000600",
                flexiapp: ["CGE-123343-55", "CGE-123343-56"],
                det_actividad: [
                    {
                      "clase": 1,
                      "tipo": 1,
                      "actividad": 1,
                      "cantidad": 1
                    },
                    {
                      "clase": 1,
                      "tipo": 1,
                      "actividad": 2,
                      "cantidad": 3
                    }
                ],
                det_otros: [
                      {
                        "glosa": "descripcion de la tarea 1", 
                        "uc_unitaria": 1, 
                        "cantidad": 1, 
                        "uc_total": 1
                      },
                      {
                        "glosa": "descripcion de la tarea 2", 
                        "uc_unitaria": 1, 
                        "cantidad": 1, 
                        "uc_total": 1
                      }
                ]
            }
        } */
  try{
      let salir = false;
      const campos = [
        'id_obra', 'fecha_reporte', 'jefe_faena', 'sdi', 'ito_mandante', 'id_area', 
        'observaciones', 'entregado_por_persona', 'fecha_entregado', 
        'revisado_por_persona', 'fecha_revisado', 'sector', 'hora_salida_base', 
        'hora_llegada_terreno', 'hora_salida_terreno', 'hora_llegada_base', 'det_actividad'
      ];
      for (const element of campos) {
        if (!req.body[element]) {
          res.status(400).send("No puede estar nulo el campo " + element
          );
          return;
        }
      };
      const id_obra = req.body.id_obra;

      //Verifica que la fecha de reporte no este asignada a una obra
      await EncabezadoReporteDiario.findAll({where: {id_obra: id_obra, fecha_reporte: req.body.fecha_reporte}}).then(data => {
          if (data.length > 0) {
            salir = true;
            res.status(400).send(`La fecha de reporte '${req.body.fecha_reporte} ya está asignada a la obra. Por favor cambie la fecha o actualice la que ya existe.'`);
          }
        }).catch(err => {
            console.log('error: ' + err.message);
            salir = true;
            res.status(500).send(err.message );
        })
      
        if (salir) {
          return;
        }

        let flexiapp;
        //const flexiapp = req.body.flexiapp;
        if (req.body.flexiapp === null || req.body.flexiapp === undefined) {
          flexiapp = "{}";
        } else {
          if (typeof req.body.flexiapp[Symbol.iterator] === 'function') {
            flexiapp = "{";
            for (const b of req.body.flexiapp){
              if (flexiapp.length==1) {
                flexiapp = flexiapp + b
              }else {
                flexiapp = flexiapp + ", " + b
              }
            }
            flexiapp = flexiapp + "}"
          } else {
            flexiapp = "{}";
          }
        }

        console.log('flexiapp: ' + flexiapp)
        // procesa detalle de actividad
        for (const element of req.body.det_actividad) {
          if (!element.clase || !element.actividad || !element.cantidad) {
            res.status(400).send("No puede estar nulo el campo " + element
            );
            return;
          }
        };

        const detalle_actividad = req.body.det_actividad;
        const detalle_otros = req.body.det_otros;
        if (Array.isArray(detalle_actividad)) {
          if (detalle_actividad.length==0) {
            //revisar arreglo de otras actividades
            if (Array.isArray(detalle_otros)) {
              if (detalle_otros.length==0) {
                res.status(400).send("Debe especificar al menos una actividad");
                return;
              }
            }
          }else {
            if (!detalle_actividad[0]) {
              res.status(400).send("El detalle debe tener al menos una actividad");
              return;
            }
            if (!detalle_actividad[0].clase) {
              salir = true;
              res.status(400).send("El campo clase en el detalle debe tener valor");
              return;
            }
            if (!detalle_actividad[0].tipo) {
              console.log('a4')
              res.status(400).send("El campo tipo en el detalle debe tener valor");
              return;
            }
            if (!detalle_actividad[0].actividad) {
              console.log('a5')
              res.status(400).send("El campo actividad en el detalle debe tener valor");
              return;
            }
            if (!detalle_actividad[0].cantidad) {
              console.log('a6')
              res.status(400).send("El campo cantidad en el detalle debe tener valor");
              return;
            }
          }
        } else {
          //revisar arreglo de otras actividades
          if (Array.isArray(detalle_otros)) {
            if (detalle_otros.length==0) {
              res.status(400).send("Debe especificar al menos una actividad");
              return;
            }
          }else {
            res.status(400).send("Debe especificar al menos una actividad");
            return;
          }
        }

        console.log('id_obra (1) --> ', id_obra)
        let estado_obra_actual;
        //busca el estado de la obra dentro de la tabla obras por ID de obra
        await Obra.findOne({
            where: {
                id: id_obra
            }
        }).then (data => {
            estado_obra_actual = data?data.estado:undefined;
        }).catch(err => {
            console.log('error estado_obra_actual --> ', err)
        })

        console.log('estado_obra_actual (1) --> ', estado_obra_actual)
        if (!estado_obra_actual) {
            res.status(500).send( 'No hay una obra para asociar al reporte diario');
            return;
        }
        if (estado_obra_actual === 8) {
            res.status(500).send( 'La obra se encuentra en estado eliminada');
            return;
        }

        // Si el estado actual de la obra es 7 (finalizada) se mantiene en el mismo estado, si es otro estado
        // cambia a 5 (en faena)
        const estado_obra = estado_obra_actual === 7 ? 7 : 5;

        // Busca el ID de encabezado disponible
        let sql = "select nextval('obras.encabezado_reporte_diario_id_seq'::regclass) as valor";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        let encabezado_reporte_diario_id = 0;
        await sequelize.query(sql, {
          type: QueryTypes.SELECT
        }).then(data => {
          encabezado_reporte_diario_id = data[0].valor;
        }).catch(err => {
          res.status(500).send(err.message );
        })

        //determina el usario que está modificando
        let id_usuario = req.userId;
        let user_name;
        sql = "select username from _auth.users where id = " + id_usuario;
        await sequelize.query(sql, {
          type: QueryTypes.SELECT
        }).then(data => {
          user_name = data[0].username;
        }).catch(err => {
          res.status(500).send(err.message );
          return;
        })

        //determina fecha actual
        const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
        const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);



        //estado visita agendada = 2
        const obra = {estado: estado_obra};

        //Guarda historial
        const obra_historial = {
          id_obra: id_obra,
          fecha_hora: fechahoy,
          usuario_rut: user_name,
          estado_obra: estado_obra,  //Estado 5 es en faena
          datos: obra,
          observacion: "Ingreso de reporte diario"
        }

        const recargo_aplicar = req.body.recargo_hora?req.body.recargo_hora.id:undefined;
        const encabezado_reporte_diario = {
            id: encabezado_reporte_diario_id,
            id_obra: Number(id_obra),
            fecha_reporte: String(req.body.fecha_reporte),
            jefe_faena: Number(req.body.jefe_faena),
            sdi: String(req.body.sdi),
            gestor_cliente: String(req.body.ito_mandante),
            id_area: Number(req.body.id_area),
            brigada_pesada: req.body.brigada_pesada===undefined?false:Boolean(req.body.brigada_pesada),
            observaciones: String(req.body.observaciones),
            entregado_por_persona: String(req.body.entregado_por_persona),
            fecha_entregado: String(req.body.fecha_entregado),
            revisado_por_persona: String(req.body.revisado_por_persona),
            fecha_revisado: String(req.body.fecha_revisado),
            sector: String(req.body.sector),
            hora_salida_base: String(req.body.hora_salida_base),
            hora_llegada_terreno: String(req.body.hora_llegada_terreno),
            hora_salida_terreno: String(req.body.hora_salida_terreno),
            hora_llegada_base: String(req.body.hora_llegada_base),
            alimentador: String(req.body.alimentador),
            comuna: String(req.body.comuna),
            num_documento: String(req.body.num_documento),
            flexiapp: String(flexiapp),
            recargo_hora: recargo_aplicar?Number(req.body.recargo_hora.id):null
        }

        let salida = {};
        const t = await sequelize.transaction();
        try {

          salida = {"error": false, "message": "Reporte diario ingresado ok"};
          const encabezadoReporteDiario = await EncabezadoReporteDiario.create(encabezado_reporte_diario, { transaction: t });
      
          for (const element of req.body.det_actividad) {
            const det_actividad = {
              id_encabezado_rep: Number(encabezado_reporte_diario_id),
              tipo_operacion: Number(element.clase),
              id_actividad: Number(element.actividad),
              cantidad: Number(element.cantidad)
            }
            await DetalleReporteDiarioActividad.create(det_actividad, { transaction: t });
          }

          for (const element of req.body.det_otros) {
            const det_otros = {
              id_encabezado_rep: Number(encabezado_reporte_diario_id),
              glosa: String(element.glosa),
              uc_unitaria: Number(element.uc_unitaria),
              total_uc: Number(element.uc_total),
              cantidad: Number(element.cantidad)
            }
            await DetalleRporteDiarioOtrasActividades.create(det_otros, { transaction: t });
          }
          const obra_creada = obra?await Obra.update(obra, { where: { id: id_obra }, transaction: t }):null;
            
          const obra_historial_creado = obra_historial?await ObrasHistorialCambios.create(obra_historial, { transaction: t }):null;
    
          await t.commit();
        } catch (error) {
          salida = { error: true, message: error }
          console.log('Error Result ---> ', error);
          await t.rollback();
        }
        if (salida.error) {
          res.status(500).send(salida.message);
        }else {
          res.status(200).send(salida);
        }
  }catch (error) {
    console.log('error general 500 --> ', error);
    res.status(500).send(error);
  }
}
/*********************************************************************************** */
/* Actualiza un reporte diario
;
*/
exports.updateEncabezadoReporteDiario = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Actualiza un encabezado de reporte diario por ID' */
  try{
    const id = req.params.id;
    await EncabezadoReporteDiario.update(req.body, {
      where: { id: id }
    }).then(data => {
      if (data[0] === 1) {
        res.status(200).send({ message: "Obra actualizada" } );
      } else {
        res.status(400).send(`No existe una obra con el id ${id}` );
      }
    }).catch(err => {
      res.status(500).send(err.message );
    })
  }catch (error) {
    res.status(500).send(error);
  }
}
/*********************************************************************************** */
/* Actualiza un reporte diario V2
;
*/
exports.updateEncabezadoReporteDiario_V2 = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Actualiza un encabezado de reporte y sus detalles por ID' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos encabezado reporte diario',
            required: true,
            schema: {
                fecha_reporte: "2023-10-25",
                jefe_faena: 1,
                sdi: "sdi",
                ito_mandante: "nombre gestor cliente",
                id_area: 1,
                brigada_pesada: false,
                observaciones: "observaciones",
                entregado_por_persona: "nombre persona",
                fecha_entregado: "2023-10-25",
                revisado_por_persona: "nombre persona que revisa",
                fecha_revisado: "2023-10-25",
                sector: "direccion sector",
                hora_salida_base: "2023-10-25 07:30:00",
                hora_llegada_terreno: "2023-10-25 08:00",
                hora_salida_terreno: "2023-10-25 18:30",
                hora_llegada_base: "2023-10-25 19:30",
                alimentador: "alimentador",
                comuna: "10305",
                num_documento: "10001000600",
                flexiapp: ["CGE-123343-55", "CGE-123343-56"],
                det_actividad: [
                    {
                      "clase": 1,
                      "tipo": 1,
                      "actividad": 1,
                      "cantidad": 1
                    },
                    {
                      "clase": 1,
                      "tipo": 1,
                      "actividad": 2,
                      "cantidad": 3
                    }
                ],
                det_otros: [
                      {
                        "glosa": "descripcion de la tarea 1", 
                        "uc_unitaria": 1, 
                        "cantidad": 1, 
                        "uc_total": 1
                      },
                      {
                        "glosa": "descripcion de la tarea 2", 
                        "uc_unitaria": 1, 
                        "cantidad": 1, 
                        "uc_total": 1
                      }
                ]
            }
        } */
  try{
    const id = req.params.id;

    let flexiapp;
    //const flexiapp = req.body.flexiapp;
    if (req.body.flexiapp === null || req.body.flexiapp === undefined) {
      flexiapp = "{}";
    } else {
      if (typeof req.body.flexiapp[Symbol.iterator] === 'function') {
        flexiapp = "{";
        for (const b of req.body.flexiapp){
          if (flexiapp.length==1) {
            flexiapp = flexiapp + b
          }else {
            flexiapp = flexiapp + ", " + b
          }
        }
        flexiapp = flexiapp + "}"
      } else {
        flexiapp = "{}";
      }
    }
    
    let detalle_actividad = req.body.det_actividad;
    console.log('detalle_actividad --> ', detalle_actividad)
 
    let detalle_otros = req.body.det_otros;
    console.log('detalle_otros --> ', detalle_otros)

    //determina el usario que está modificando
    let id_usuario = req.userId;
    let user_name;
    let sql = "select username from _auth.users where id = " + id_usuario;
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    await sequelize.query(sql, {
      type: QueryTypes.SELECT
    }).then(data => {
      user_name = data[0].username;
    }).catch(err => {
      res.status(500).send(err.message );
      return;
    })

    //Encuentra el id de la obra segun el reporte diario
    let id_obra;
    await EncabezadoReporteDiario.findOne({
        where: {
            id: id
        }
    }).then(data => {
        id_obra = data?data.id_obra:undefined;
    }).catch(err => {
        console.log('error id_obra --> ', err)
    })

    if (!id_obra) {
        res.status(500).send( 'El reporte diario no existe');
        return;
    }
    let estado_obra_actual;
    //busca el estado de la obra dentro de la tabla obras por ID de obra
    await Obra.findOne({
        where: {
            id: id_obra
        }
    }).then (data => {
        estado_obra_actual = data?data.estado:undefined;
    }).catch(err => {
        console.log('error estado_obra_actual --> ', err)
    })

    if (!estado_obra_actual) {
        res.status(500).send( 'No hay una opbra asociada al reporte diario');
        return;
    }
    if (estado_obra_actual === 8) {
        res.status(500).send( 'La obra fue eliminada');
        return;
    }

    // Si el estado actual de la obra es 7 (finalizada) se mantiene en el mismo estado, si es otro estado
    // cambia a 5 (en faena)
    const estado_obra = estado_obra_actual === 7 ? 7 : 5;


    //determina fecha actual
    const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
    const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);

    //estado visita agendada = 2
    const obra = {estado: estado_obra};

    //Guarda historial
    const obra_historial = {
      id_obra: id_obra,
      fecha_hora: fechahoy,
      usuario_rut: user_name,
      estado_obra: estado_obra,  //Estado 5 es en faena
      datos: obra,
      observacion: "Actualizacion de reporte diario"
    }


   const recargo_aplicar = req.body.recargo_hora?req.body.recargo_hora.id:undefined;
    const encabezadoReporteDiario = {
      fecha_reporte: req.body.fecha_reporte?String(req.body.fecha_reporte):undefined,
      jefe_faena: req.body.jefe_faena?Number(req.body.jefe_faena):undefined,
      sdi: req.body.sdi?String(req.body.sdi):undefined,
      gestor_cliente: req.body.ito_mandante?String(req.body.ito_mandante):undefined,
      id_area: req.body.id_area?Number(req.body.id_area):undefined,
      brigada_pesada: req.body.brigada_pesada===undefined?undefined:Boolean(req.body.brigada_pesada),
      observaciones: req.body.observaciones?String(req.body.observaciones):undefined,
      entregado_por_persona: req.body.entregado_por_persona?String(req.body.entregado_por_persona):undefined,
      fecha_entregado: req.body.fecha_entregado?String(req.body.fecha_entregado):undefined,
      revisado_por_persona: req.body.revisado_por_persona?String(req.body.revisado_por_persona):undefined,
      fecha_revisado: (req.body.fecha_revisado?String(req.body.fecha_revisado):undefined),
      sector: req.body.sector?String(req.body.sector):undefined,
      hora_salida_base: req.body.hora_salida_base?String(req.body.hora_salida_base):undefined,
      hora_llegada_terreno: req.body.hora_llegada_terreno?String(req.body.hora_llegada_terreno):undefined,
      hora_salida_terreno: req.body.hora_salida_terreno?String(req.body.hora_salida_terreno):undefined,
      hora_llegada_base: req.body.hora_llegada_base?String(req.body.hora_llegada_base):undefined,
      alimentador: req.body.alimentador?String(req.body.alimentador):undefined,
      comuna: req.body.comuna?String(req.body.comuna):undefined,
      num_documento: req.body.num_documento?String(req.body.num_documento):undefined,
      flexiapp: flexiapp?String(flexiapp):undefined,
      recargo_hora: recargo_aplicar

  }

      console.log('encabezadoReporteDiario --> ', encabezadoReporteDiario);

        let salida = {};
        const t = await sequelize.transaction();
        try {
          salida = {"error": false, "message": "Reporte diario actualizado ok"};
          

          // realizar la actualizacion del encabezado por id
          await EncabezadoReporteDiario.update(encabezadoReporteDiario, { where: { id: id }, transaction: t });
          
          //actualizar detalles
          if (detalle_actividad){
            
            //primer debe borrar los regisatros que tenga asociado el encabezado
            await DetalleReporteDiarioActividad.destroy( { where: { id_encabezado_rep: id }, transaction: t } );
            ;
            //luego volver a insertar los registros
            for (const element of detalle_actividad) {
              const det_actividad = {
                id_encabezado_rep: Number(id),
                tipo_operacion: Number(element.clase),
                id_actividad: Number(element.actividad),
                cantidad: Number(element.cantidad)
              }
              await DetalleReporteDiarioActividad.create(det_actividad, { transaction: t });
            }
          };
          
          if (detalle_otros){
            
            //primer debe borrar los regisatros que tenga asociado el encabezado
            await DetalleRporteDiarioOtrasActividades.destroy( { where: { id_encabezado_rep: id }, transaction: t } );
            //luego volver a insertar los registros
            
            for (const element of detalle_otros) {
              const det_otros = {
                id_encabezado_rep: Number(id),
                glosa: String(element.glosa),
                uc_unitaria: Number(element.uc_unitaria),
                total_uc: Number(element.uc_total),
                cantidad: Number(element.cantidad)
              }
              await DetalleRporteDiarioOtrasActividades.create(det_otros, { transaction: t });
            }
          }

          const obra_creada = obra?await Obra.update(obra, { where: { id: id_obra }, transaction: t }):null;
            
          const obra_historial_creado = obra_historial?await ObrasHistorialCambios.create(obra_historial, { transaction: t }):null;
          
    
          await t.commit();
          
        } catch (error) {
          salida = { error: true, message: error }
          await t.rollback();
        }
        if (salida.error) {
          
          if (salida.message.parent.detail.slice(0,28) === 'Key (id_obra, fecha_reporte)') {
            res.status(400).send('Ya existe un reporte diario para esta fecha en esta obra');
          }else{
            res.status(400).send(salida.message);
          }
        }else {
          res.status(200).send(salida);
        }
  }catch (error) {
    res.status(500).send(error);
  }
}
/*********************************************************************************** */
/* Borra un reporte diario
;
*/
exports.deleteEncabezadoReporteDiario = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Borra un encabezado de reporte diario y sus detalles por ID' */
  try{
    const id = req.params.id;

    //Primer debe eliminar el detalle actividad por id de encabezado, luego borrar el detalle otros y por ultimo el encabezado
    const sequelize = db.sequelize;
    const result = await sequelize.transaction(async () => {
        let salida = {};
        await DetalleReporteDiarioActividad.destroy( { where: { id_encabezado_rep: id } } );
        await DetalleRporteDiarioOtrasActividades.destroy( { where: { id_encabezado_rep: id } } );
        await EncabezadoReporteDiario.destroy({
          where: { id: id }
        }).then(data => {
          if (data > 0) {
            salida = { message: `Reporte eliminado`}
          } else {
            salida = { message: `No existe el reporte con id ${id}` }
          }
        });
        return salida;
      });
    if (result.message==="Reporte eliminado") {
      res.status(200).send(result);
    }else {
      res.status(400).send(result.message);
    }
  }catch (error) {
    res.status(500).send(error);
  }

}
/*********************************************************************************** */
/* Consulta detalles de reportes diarios actividad
;
*/
exports.findAllDetalleReporteDiarioActividad = async (req, res) => {
    //metodo GET
    /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Devuelve todos los registros de detalle de reportes diarios' */
    try {
      const sql = "SELECT dra.id, row_to_json(top) as tipo_operacion, ma.tipo_actividad, row_to_json(ma) as actividad, cantidad, \
      json_build_object('id', erd.id, 'id_obra', erd.id_obra, 'fecha_reporte', erd.fecha_reporte) as encabezado_reporte, \
      case when top.id = 1 then uc_instalacion when top.id = 2 then uc_retiro when top.id = 3 then uc_traslado else 0 end as unitario, \
      case when top.id = 1 then uc_instalacion when top.id = 2 then uc_retiro when top.id = 3 then uc_traslado else 0 end * \
      cantidad as total FROM obras.detalle_reporte_diario_actividad dra join obras.tipo_operacion top on \
      dra.tipo_operacion = top.id join (SELECT ma.id, actividad, row_to_json(ta) as tipo_actividad, uc_instalacion, uc_retiro, \
      uc_traslado, ma.descripcion, row_to_json(mu) as unidad FROM obras.maestro_actividades ma join obras.tipo_actividad \
      ta on ma.id_tipo_actividad = ta.id join obras.maestro_unidades mu on ma.id_unidad = mu.id) ma on dra.id_actividad = \
      ma.id join obras.encabezado_reporte_diario erd on dra.id_encabezado_rep = erd.id";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const detalleReporteDiarioActividad = await sequelize.query(sql, { type: QueryTypes.SELECT });
      let salida;
      if (detalleReporteDiarioActividad) {
        salida = [];
        for (const element of detalleReporteDiarioActividad) {
  
              const detalle_salida = {
                id: Number(element.id),
                tipo_operacion: element.tipo_operacion,
                tipo_actividad: element.tipo_actividad,
                actividad: element.actividad,
                cantidad: Number(element.cantidad),
                id_encabezado_rep: element.encabezado_reporte,
                unitario: Number(element.unitario),
                total: Number(element.total),                
              }
              salida.push(detalle_salida);
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
/* Consulta detalles de reportes diarios actividad por ID
;
*/
exports.findOneDetalleReporteDiarioActividad = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Devuelve un registro de detalle de reportes diarios por ID' */
  try {
      
    const campos = [
      'id'
    ];
    for (const element of campos) {
      if (!req.query[element]) {
        res.status(400).send("No puede estar nulo el campo " + element
        );
        return;
      }
    };
    const id = req.query.id;
    /*
    const sql = "SELECT dra.id, row_to_json(top) as tipo_operacion, row_to_json(ma) as tipo_actividad, cantidad, \
    json_build_object('id', erd.id, 'id_obra', erd.id_obra, 'fecha_reporte', erd.fecha_reporte) as encabezado_reporte \
    FROM obras.detalle_reporte_diario_actividad dra join obras.tipo_operacion top on dra.tipo_operacion = top.id \
    join obras.maestro_actividades ma on dra.id_actividad = ma.id join obras.encabezado_reporte_diario erd \
    on dra.id_encabezado_rep = erd.id WHERE dra.id = :id";*/

    const sql = "SELECT dra.id, row_to_json(top) as tipo_operacion, ma.tipo_actividad, row_to_json(ma) as actividad, cantidad, \
    json_build_object('id', erd.id, 'id_obra', erd.id_obra, 'fecha_reporte', erd.fecha_reporte) as encabezado_reporte, \
    case when top.id = 1 then uc_instalacion when top.id = 2 then uc_retiro when top.id = 3 then uc_traslado else 0 end as unitario, \
    case when top.id = 1 then uc_instalacion when top.id = 2 then uc_retiro when top.id = 3 then uc_traslado else 0 end * \
    cantidad as total FROM obras.detalle_reporte_diario_actividad dra join obras.tipo_operacion top on \
    dra.tipo_operacion = top.id join (SELECT ma.id, actividad, row_to_json(ta) as tipo_actividad, uc_instalacion, uc_retiro, \
    uc_traslado, ma.descripcion, row_to_json(mu) as unidad FROM obras.maestro_actividades ma join obras.tipo_actividad \
    ta on ma.id_tipo_actividad = ta.id join obras.maestro_unidades mu on ma.id_unidad = mu.id) ma on dra.id_actividad = \
    ma.id join obras.encabezado_reporte_diario erd on dra.id_encabezado_rep = erd.id WHERE dra.id = :id";

    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const detalleReporteDiarioActividad = await sequelize.query(sql,  { replacements: { id: id }, type: QueryTypes.SELECT });
    let salida;
    if (detalleReporteDiarioActividad) {
      salida = [];
      for (const element of detalleReporteDiarioActividad) {

            const detalle_salida = {
              id: Number(element.id),
              tipo_operacion: element.tipo_operacion,
              tipo_actividad: element.tipo_actividad,
              actividad: element.actividad,
              cantidad: Number(element.cantidad),
              id_encabezado_rep: element.encabezado_reporte,
              unitario: Number(element.unitario),
              total: Number(element.total),
            }
            salida.push(detalle_salida);
      };
    }
    if (salida===undefined){
      res.status(500).send("Error en la consulta (servidor backend)");
    }else{
      res.status(200).send(salida);
    }
  } catch (err) {
    res.status(500).send(err.message );
  }
}
/*********************************************************************************** */
/* Consulta detalles de reportes diarios actividad por obra
;
*/
/*********************************************************************************** */
exports.findDetalleReporteDiarioActividadPorParametros = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Devuelve un registro de detalle de reportes diarios por parámetros: id_obra, id_encabezado_rep,
      debe tener al menos un parámetro' */
  const parametros = {
    id_obra: req.query.id_obra,
    id_encabezado_rep: req.query.id_encabezado_rep
  }
  const keys = Object.keys(parametros)
  let sql_array = [];
  let param = {};
  for (element of keys) {
    if (parametros[element]){

      if (element === "id_obra") {
        sql_array.push("erd.id_obra = :" + element);
        param[element] = Number(parametros[element]);
      }
      if (element === "id_encabezado_rep") {
        sql_array.push("dra.id_encabezado_rep = :" + element);
        param[element] = Number(parametros[element]);
      }
    }
  }

  if (sql_array.length === 0) {
    res.status(500).send("Debe incluir algun parametro para consultar");
  }else {
    try {
      let b = sql_array.reduce((total, num) => total + " AND " + num);
      if (b){
        /*
        const sql = "SELECT dra.id, row_to_json(top) as tipo_operacion, row_to_json(ma) as tipo_actividad, cantidad, \
        json_build_object('id', erd.id, 'id_obra', erd.id_obra, 'fecha_reporte', erd.fecha_reporte) as encabezado_reporte \
        FROM obras.detalle_reporte_diario_actividad dra join obras.tipo_operacion top on dra.tipo_operacion = top.id \
        join obras.maestro_actividades ma on dra.id_actividad = ma.id join obras.encabezado_reporte_diario erd \
        on dra.id_encabezado_rep = erd.id WHERE "+b;*/

        const sql = "SELECT dra.id, row_to_json(top) as tipo_operacion, ma.tipo_actividad, row_to_json(ma) as actividad, cantidad, \
        json_build_object('id', erd.id, 'id_obra', erd.id_obra, 'fecha_reporte', erd.fecha_reporte) as encabezado_reporte, \
        case when top.id = 1 then uc_instalacion when top.id = 2 then uc_retiro when top.id = 3 then uc_traslado else 0 end as unitario, \
        case when top.id = 1 then uc_instalacion when top.id = 2 then uc_retiro when top.id = 3 then uc_traslado else 0 end * \
        cantidad as total FROM obras.detalle_reporte_diario_actividad dra join obras.tipo_operacion top on \
        dra.tipo_operacion = top.id join (SELECT ma.id, actividad, row_to_json(ta) as tipo_actividad, uc_instalacion, uc_retiro, \
        uc_traslado, ma.descripcion, row_to_json(mu) as unidad FROM obras.maestro_actividades ma join obras.tipo_actividad \
        ta on ma.id_tipo_actividad = ta.id join obras.maestro_unidades mu on ma.id_unidad = mu.id) ma on dra.id_actividad = \
        ma.id join obras.encabezado_reporte_diario erd on dra.id_encabezado_rep = erd.id WHERE "+b;

        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const detalleReporteDiarioActividad = await sequelize.query(sql, { replacements: param, type: QueryTypes.SELECT });
        let salida = [];
        if (detalleReporteDiarioActividad) {
          for (const element of detalleReporteDiarioActividad) {

            const detalle_salida = {
              id: Number(element.id),
              tipo_operacion: element.tipo_operacion,
              tipo_actividad: element.tipo_actividad,
              actividad: element.actividad,
              cantidad: Number(element.cantidad),
              id_encabezado_rep: element.encabezado_reporte,
              unitario: Number(element.unitario),
              total: Number(element.total),
            }
                salida.push(detalle_salida);
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send(salida);
        }
      }else {
        res.status(500).send("Error en la consulta (servidor backend)");
      }
    }catch (error) {
      res.status(500).send(error);
    }
  }
}

exports.findDetalleReporteDiarioOtrasPorParametros = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Devuelve un registro de detalle de reportes diarios otras actividades por parámetros: id_obra, id_encabezado_rep,
      debe tener al menos un parámetro' */
  const parametros = {
    id_obra: req.query.id_obra,
    id_encabezado_rep: req.query.id_encabezado_rep
  }
  const keys = Object.keys(parametros)
  let sql_array = [];
  let param = {};
  for (element of keys) {
    if (parametros[element]){

      if (element === "id_obra") {
        sql_array.push("erd.id_obra = :" + element);
        param[element] = Number(parametros[element]);
      }
      if (element === "id_encabezado_rep") {
        sql_array.push("drd.id_encabezado_rep = :" + element);
        param[element] = Number(parametros[element]);
      }
    }
  }

  if (sql_array.length === 0) {
    res.status(500).send("Debe incluir algun parametro para consultar");
  }else {
    try {
      let b = sql_array.reduce((total, num) => total + " AND " + num);
      if (b){
        /*
        const sql = "SELECT dra.id, row_to_json(top) as tipo_operacion, row_to_json(ma) as tipo_actividad, cantidad, \
        json_build_object('id', erd.id, 'id_obra', erd.id_obra, 'fecha_reporte', erd.fecha_reporte) as encabezado_reporte \
        FROM obras.detalle_reporte_diario_actividad dra join obras.tipo_operacion top on dra.tipo_operacion = top.id \
        join obras.maestro_actividades ma on dra.id_actividad = ma.id join obras.encabezado_reporte_diario erd \
        on dra.id_encabezado_rep = erd.id WHERE "+b;*/

        const sql = "SELECT drd.id, glosa, uc_unitaria, cantidad, total_uc, json_build_object('id', erd.id, 'id_obra', erd.id_obra, \
        'fecha_reporte', erd.fecha_reporte) as encabezado_reporte FROM obras.detalle_reporte_diario_otras_actividades drd \
        join obras.encabezado_reporte_diario erd on drd.id_encabezado_rep = erd.id WHERE "+b;


        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const detalleReporteDiarioActividad = await sequelize.query(sql, { replacements: param, type: QueryTypes.SELECT });
        let salida = [];
        if (detalleReporteDiarioActividad) {
          for (const element of detalleReporteDiarioActividad) {

            const detalle_salida = {
              id: Number(element.id),
              glosa: element.glosa,
              uc_unitaria: element.uc_unitaria,
              cantidad: Number(element.cantidad),
              total_uc: Number(element.total_uc),
              id_encabezado_rep: element.encabezado_reporte
            }
                salida.push(detalle_salida);
          };
        }
        if (salida===undefined){
          res.status(500).send("Error en la consulta (servidor backend)");
        }else{
          res.status(200).send(salida);
        }
      }else {
        res.status(500).send("Error en la consulta (servidor backend)");
      }
    }catch (error) {
      res.status(500).send(error);
    }
  }
}
/* Crea un detalle de reporte diario
;
*/
exports.createOneDetalleReporteDiarioActividad = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Crea un detalle de reporte diario' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos para el detalle de reporte diario',
            required: true,
            schema: {
                tipo_operacion: 1,
                id_actividad: 537,
                cantidad: 2.3,
                id_encabezado_rep: 3
            }
        }*/
  try {
    const campos = [
      'tipo_operacion',
      'id_actividad',
      'cantidad',
      'id_encabezado_rep'
    ];
    for (const element of campos) {
      if (!req.body[element]) {
        res.status(400).send("No puede estar nulo el campo " + element
        );
        return;
      }
    };

    // Consultar si existe la actividad en el maestro de actividades
    const actividadExists = await maestroActividad.findOne({
      where: {
        id: req.body.id_actividad
      }
    });

    // Consultar si existe el tipo de opracion en la tabla tipo_operacion
    const tipoOperacionExists = await tipoOperacion.findOne({
      where: {
        id: req.body.tipo_operacion
      }
    });

    // Consultar si existe el encabezado de reporte diario en la tabla encabezado_reporte_diario
    const encabezado_reporte_diarioExists = await EncabezadoReporteDiario.findOne({
      where: {
        id: req.body.id_encabezado_rep
      }
    });
    if (!actividadExists) {
      // La actividad no existe en la tabla maestro_actividad
      res.status(400).send("No existe la actividad con Id " + req.body.id_actividad);
      return;
    }

    if (!tipoOperacionExists) {
      // El tipo de operación no existe en la tabla tipo_operacion
      res.status(400).send("No el tipo de operación con Id " + req.body.tipo_operacion);
      return;
    }

    if (!encabezado_reporte_diarioExists) {
      // El encabezado de reporte diario no existe
      res.status(400).send("No existe un encabezado reporte diario con Id " + req.body.id_encabezado_rep);
      return;
    }

    const detalleReporteDiarioActividad = {
      tipo_operacion: Number(req.body.tipo_operacion),
      id_actividad: Number(req.body.id_actividad),
      cantidad: Number(req.body.cantidad),
      id_encabezado_rep: Number(req.body.id_encabezado_rep)
    }
    await DetalleReporteDiarioActividad.create(detalleReporteDiarioActividad)
          .then(data => {
              res.status(200).send(data);
          }).catch(err => {
              res.status(500).send( err.message );
          })
  }catch (error) {
    res.status(500).send(error);
  }

}

/*********************************************************************************** */
/* Obtiene todos los jefes de faena
*/
exports.findAllJefesFaena = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Devuelve todos los jefes de faena' */
  try {
    await JefesFaena.findAll({
      order: [
        ['nombre', 'ASC']
      ]
    }).then(data => {
      res.status(200).send(data);
    }).catch(err => {
        res.status(500).send(err.message );
    })
  }catch (error) {
    res.status(500).send(error);
  }
}

/*********************************************************************************** */
/* Obtiene todos los tipo de operación
*/
exports.findAllTipoOperacion = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Devuelve todos los tipo de operación' */
  try {
    await tipoOperacion.findAll().then(data => {
      res.status(200).send(data);
    }).catch(err => {
        res.status(500).send(err.message );
    })
  }catch (error) {
    res.status(500).send(error);
  }
}

/*********************************************************************************** */
/* Obtiene todos los tipo de actividad
*/
exports.findAllTipoActividad = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
      #swagger.description = 'Devuelve todos los tipo de actividad' */

      try {
            
        const sql = "select * from (SELECT distinct on (ta.id) ta.* FROM obras.tipo_actividad ta join \
        obras.maestro_actividades ma on ta.id = ma.id_tipo_actividad order by 1) a order by 2";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const tipoActividad = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida;
        if (tipoActividad) {
          salida = [];
          for (const element of tipoActividad) {
    
                const detalle_salida = {
                  id: Number(element.id),
                  descripcion: String(element.descripcion)
                }
                salida.push(detalle_salida);
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
/* Obtiene todos las actividades del maestro actividades
*/
exports.findAllMaestroActividad = async (req, res) => {
  //metodo GET
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
    #swagger.description = 'Devuelve todas las actividades dentro del Maestro Actividades' */
  try {
    //metodo GET
    const id_tipo_actividad = req.query.id_tipo_actividad;
    let where = '';
    if (id_tipo_actividad) {
      where = `WHERE ta.id = ${id_tipo_actividad}`
    }

    const sql = "SELECT ma.id, actividad, row_to_json(ta) as tipo_actividad, uc_instalacion, uc_retiro, \
    uc_traslado, ma.descripcion, row_to_json(mu) as unidad FROM obras.maestro_actividades ma join \
    obras.tipo_actividad ta on ma.id_tipo_actividad = ta.id	join obras.maestro_unidades mu on ma.id_unidad = mu.id " + where;
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const maestroActividad = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida;
    if (maestroActividad) {
      salida = [];
      for (const element of maestroActividad) {

            const detalle_salida = {
              id: Number(element.id),
              actividad: String(element.actividad),
              tipo_actividad: element.tipo_actividad,  //json {"id": 1, "descripcion": "Instalación"}
              uc_instalacion: Number(element.uc_instalacion),
              uc_retiro:  Number(element.uc_retiro),
              uc_traslado:  Number(element.uc_traslado),
              descripcion: String(element.descripcion),
              unidad: element.unidad
              
            }
            salida.push(detalle_salida);
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

exports.findAllTipoTrabajo = async (req, res) => {
  //metodo GET
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
    #swagger.description = 'Devuelve todos los tipo de Trabajo' */
  try {
      await TipoTrabajo.findAll().then(data => {
        let salida = [];
        for (element of data) {
          const detalle_salida = {
            id: Number(element.id),
            descripcion: String(element.descripcion)
          }
          salida.push(detalle_salida);
        }
        res.status(200).send(salida);
    }).catch(err => {
        res.status(500).send(err.message );
    })
  } catch (err) {
    res.status(500).send( err.message );
  }
}
/*********************************************************************************** */



 exports.findAllRecargosHoraExtra = async (req, res) => {
  //metodo GET
  /*  #swagger.tags = ['Obras - Backoffice - Reporte diario']
    #swagger.description = 'Devuelve todas los recargos por hora extra' */
  try {
    //metodo GET
    

    const sql = "SELECT id, nombre, id_tipo_recargo, porcentaje, nombre_corto FROM obras.recargos where id_tipo_recargo = 3 order by 1";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const recargoHora = await sequelize.query(sql, { type: QueryTypes.SELECT });
    let salida;
    if (recargoHora) {
      salida = [];
      for (const element of recargoHora) {

            const detalle_salida = {
              id: Number(element.id),
              nombre: String(element.nombre),
              id_tipo_recargo: Number(3),
              porcentaje: Number(element.porcentaje),
              nombre_corto: String(element.nombre_corto)
              
            }
            salida.push(detalle_salida);
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