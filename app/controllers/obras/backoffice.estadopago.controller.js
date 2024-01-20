const db = require("../../models");
const Recargo = db.recargo;
const TipoRecargo = db.tipoRecargo;

/*********************************************************************************** */
/* Obtiene todos los tipos de recargo
    GET /api/obras/backoffice/estadopago/v1/alltiporecargo
*/
exports.findAllTipoRecargo = async (req, res) => {
    /*  #swagger.tags = ['Obras - Backoffice - Estado de Pago']
      #swagger.description = 'Devuelve todos los tipos de recargo' */
    try {
        await TipoRecargo.findAll().then(data => {
            res.status(200).send(data);
          }).catch(err => {
              res.status(500).send({ message: err.message });
          })
    } catch (error) {
        res.status(500).send(error);
    }
}

/*********************************************************************************** */
/* Obtiene todos los Recargos
    GET /api/obras/backoffice/estadopago/v1/allrecargos
*/
exports.findAllRecargo = async (req, res) => {
    /*  #swagger.tags = ['Obras - Backoffice - Estado de Pago']
      #swagger.description = 'Devuelve todos los Recargos' */
    try {
        const sql = "SELECT r.id, nombre, row_to_json(tr) as tipo_recargo, porcentaje \
        FROM obras.recargos r join obras.tipo_recargo tr on r.id_tipo_recargo = tr.id";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const recargo = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        if (recargo) {
            
            for (const element of recargo) {
      
                  const detalle_salida = {
                    id: Number(element.id),
                    nombre: String(element.nombre),
                    tipo_recargo: element.tipo_recargo,  //json {"id":2,"descripcion":"Recargo por distancia"}
                    porcentaje: Number(element.porcentaje)
                    
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
/* Genera un nuevo encabezado para estado de pago
    GET /api/obras/backoffice/estadopago/v1/nuevoencabezado
*/
exports.generaNuevoEncabezadoEstadoPago = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Estado de Pago']
      #swagger.description = 'Genera un nuevo encabezado para estado de pago' */
  try {
    const id_obra = req.query.id_obra;
    const campos = [
        'id_obra'
      ];
      for (const element of campos) {
        if (!req.query[element]) {
          res.status(400).send({
            message: "No puede estar nulo el campo " + element
          });
          return;
        }
      };
    const sql = "select o.id as id_obra, o.codigo_obra as codigo_obra, o.nombre_obra as nombre_obra, row_to_json(d) \
    as cliente, fecha_llegada::text as fecha_asignacion, row_to_json(tt) as tipo_trabajo, row_to_json(s) as segmento, \
    gestor_cliente as solicitado_por, numero_ot as ot_sdi, row_to_json(cc) as supervisor_pelom, row_to_json(c) \
    as comuna, ubicacion as direccion, '{\"CGE-0000-234\", \"CGE-0000-456\"}'::character varying[] as flexiapp, \
    fecha_termino as fecha_ejecucion, null as jefe_delegacion, (SELECT row_to_json(jf) as jefe_faena FROM \
    obras.encabezado_reporte_diario erd join obras.jefes_faena jf on erd.jefe_faena = jf.id	where id_obra = 1 \
    order by fecha_reporte desc  limit 1) as jefe_faena, null as codigo_pelom from obras.obras o left \
    join obras.delegaciones d on o.delegacion = d.id left join obras.tipo_trabajo tt on o.tipo_trabajo = tt.id \
    left join obras.segmento s on o.segmento = s.id left join obras.coordinadores_contratista cc on \
    o.coordinador_contratista = cc.id left join _comun.comunas c on o.comuna = c.codigo WHERE o.id = " + id_obra;
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const nuevoEncabezado = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        if (nuevoEncabezado) {
            
            for (const element of nuevoEncabezado) {
      
                  const detalle_salida = {
                    id_obra: Number(element.id_obra),
                    codigo_obra: String(element.codigo_obra),
                    nombre_obra: String(element.nombre_obra),
                    cliente: element.cliente,
                    fecha_asignacion: String(element.fecha_asignacion),
                    tipo_trabajo: element.tipo_trabajo,
                    segmento: element.segmento,
                    solicitado_por: String(element.solicitado_por),
                    ot_sdi: String(element.ot_sdi),
                    supervisor_pelom: element.supervisor_pelom,
                    comuna: element.comuna,
                    direccion: String(element.direccion),
                    flexiapp: element.flexiapp,
                    fecha_ejecucion: String(element.fecha_ejecucion),
                    jefe_delegacion: String(element.jefe_delegacion),
                    jefe_faena: element.jefe_faena,
                    codigo_pelom: String(element.codigo_pelom)
 
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
/* Obtiene todas las actividades no adicionales para un estado de pago
    GET /api/obras/backoffice/estadopago/v1/allactividades
*/

exports.getAllActividadesByIdObra = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Estado de Pago']
      #swagger.description = 'Obtiene todas las actividades no adicionales para un estado de pago' */
      try {
        const id_obra = req.query.id_obra;
        const campos = [
            'id_obra'
          ];
          for (const element of campos) {
            if (!req.query[element]) {
              res.status(400).send({
                message: "No puede estar nulo el campo " + element
              });
              return;
            }
          };
        const sql = "select top.clase, ta.descripcion tipo, ma.actividad, mu.codigo_corto as unidad, e.cantidad, \
        case when top.clase = 'I' then ma.uc_instalacion when top.clase = 'R' then ma.uc_retiro \
        when top.clase = 'T' then ma.uc_traslado else 999::double precision end as unitario from \
        (SELECT drda.tipo_operacion, drda.id_actividad, sum(drda.cantidad) as cantidad FROM \
        obras.encabezado_reporte_diario erd join obras.detalle_reporte_diario_actividad drda on erd.id = \
        drda.id_encabezado_rep WHERE id_obra = " + id_obra + " group by drda.tipo_operacion, drda.id_actividad) e \
        join obras.maestro_actividades ma on e.id_actividad = ma.id join obras.tipo_operacion top on \
        e.tipo_operacion = top.id join obras.tipo_actividad ta on ma.id_tipo_actividad = ta.id join \
        obras.maestro_unidades mu on ma.id_unidad = mu.id WHERE ta.id <> 9";
            const { QueryTypes } = require('sequelize');
            const sequelize = db.sequelize;
            const actividades = await sequelize.query(sql, { type: QueryTypes.SELECT });
            let salida = [];
            if (actividades) {
                
                for (const element of actividades) {
          
                      const detalle_salida = {
                        clase: String(element.clase),
                        tipo: String(element.tipo),
                        actividad: String(element.actividad),
                        unidad: String(element.unidad),
                        cantidad: Number(element.cantidad),
                        unitario: Number(element.unitario),
                        total: Number((Number(element.cantidad) * Number(element.unitario)).toFixed(2))
                        
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
/* Obtiene todas las actividades adicionales para un estado de pago
    GET /api/obras/backoffice/estadopago/v1/allactividadesadicionales
*/
exports.getAllActividadesAdicionalesByIdObra = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Estado de Pago']
      #swagger.description = 'Obtiene todas las actividades adicionales para un estado de pago' */
      try {
        const id_obra = req.query.id_obra;
        const campos = [
            'id_obra'
          ];
          for (const element of campos) {
            if (!req.query[element]) {
              res.status(400).send({
                message: "No puede estar nulo el campo " + element
              });
              return;
            }
          };
        const sql = "select top.clase, ta.descripcion tipo, ma.actividad, mu.codigo_corto as unidad, e.cantidad, \
        case when top.clase = 'I' then ma.uc_instalacion when top.clase = 'R' then ma.uc_retiro when top.clase = 'T' \
        then ma.uc_traslado else 999::double precision end as unitario from (SELECT drda.tipo_operacion, \
          drda.id_actividad, sum(drda.cantidad) as cantidad FROM obras.encabezado_reporte_diario erd \
          join obras.detalle_reporte_diario_actividad drda on erd.id = drda.id_encabezado_rep WHERE \
          erd.id_obra = " + id_obra + " group by drda.tipo_operacion, drda.id_actividad) e join obras.maestro_actividades ma \
          on e.id_actividad = ma.id join obras.tipo_operacion top on e.tipo_operacion = top.id join obras.tipo_actividad \
          ta on ma.id_tipo_actividad = ta.id join obras.maestro_unidades mu on ma.id_unidad = mu.id WHERE ta.id = 9 \
          UNION	\
          select 'I'::char as clase, 'Adicionales'::varchar as tipo, glosa as actividad, 'CU'::varchar, cantidad, \
          uc_unitaria as unitario from obras.detalle_reporte_diario_otras_actividades drdoa join \
          obras.encabezado_reporte_diario erd on drdoa.id_encabezado_rep = erd.id WHERE erd.id_obra = " + id_obra + " order by 1,2,3";
            const { QueryTypes } = require('sequelize');
            const sequelize = db.sequelize;
            const actividades = await sequelize.query(sql, { type: QueryTypes.SELECT });
            let salida = [];
            if (actividades) {
                
                for (const element of actividades) {
          
                      const detalle_salida = {
                        clase: String(element.clase),
                        tipo: String(element.tipo),
                        actividad: String(element.actividad),
                        unidad: String(element.unidad),
                        cantidad: Number(element.cantidad),
                        unitario: Number(element.unitario),
                        total: Number((Number(element.cantidad) * Number(element.unitario)).toFixed(2))
                        
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