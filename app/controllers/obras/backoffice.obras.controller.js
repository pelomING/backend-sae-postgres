const db = require("../../models");
const Obra = db.obra;
const ObrasHistorialCambios = db.obrasHistorialCambios;
const ObrasCierres = db.obrasCierres;
const ObrasParalizacion = db.obrasParalizacion;

/***********************************************************************************/
/*                                                                                 */
/*                                                                                 */
/*                                 TABLA OBRAS                                     */
/*                                                                                 */
/*                                                                                 */
/***********************************************************************************/


/*********************************************************************************** */
/* Consulta todas las Obras
;
*/
exports.findAllObra = async (req, res) => {
    //metodo GET
    /*  #swagger.tags = ['Obras - Backoffice - Obras']
      #swagger.description = 'Devuelve todas las obras de la tabla de obras' */
    try {
      const sql = "SELECT o.id, codigo_obra, numero_ot, nombre_obra, row_to_json(z) as zona, row_to_json(d) as delegacion, \
      o.gestor_cliente, numero_aviso, numero_oc, monto, cantidad_uc, fecha_llegada::text, fecha_inicio::text, \
      fecha_termino::text, row_to_json(tt) as tipo_trabajo, persona_envia_info, cargo_persona_envia_info, \
      row_to_json(ec) as empresa_contratista, row_to_json(cc) as coordinador_contratista, row_to_json(c) as comuna, \
      ubicacion, row_to_json(eo) as estado, row_to_json(tob) as tipo_obra, row_to_json(s) as segmento, eliminada, \
      case when erd.cuenta is null then 0 else erd.cuenta end as cantidad_reportes, o.jefe_delegacion, \
      (select count(id) as cantidad_estados_pago FROM obras.encabezado_estado_pago WHERE id_obra = o.id) as cantidad_estados_pago, \
      row_to_json(ofi) as oficina, row_to_json(rec) as recargo_distancia FROM obras.obras o left join _comun.zonal z \
      on o.zona = z.id left join obras.delegaciones d on o.delegacion = d.id left join obras.tipo_trabajo tt on \
      o.tipo_trabajo = tt.id left join obras.empresas_contratista ec on o.empresa_contratista = ec.id left join \
      obras.coordinadores_contratista cc on o.coordinador_contratista = cc.id left join _comun.comunas c on \
      o.comuna = c.codigo left join obras.estado_obra eo on o.estado = eo.id left join obras.tipo_obra tob on \
      o.tipo_obra = tob.id left join obras.segmento s on o.segmento = s.id left join (select id_obra, count(id) \
      as cuenta from obras.encabezado_reporte_diario group by id_obra) as erd on o.id = erd.id_obra left join \
      (SELECT os.id, o.nombre as oficina, so.nombre as supervisor	FROM obras.oficina_supervisor os join _comun.oficinas \
        o on os.oficina = o.id join obras.supervisores_contratista so on os.supervisor = so.id) ofi on o.oficina = \
        ofi.id left join (SELECT id, nombre, porcentaje FROM obras.recargos where id_tipo_recargo = 2) rec \
        on o.recargo_distancia = rec.id WHERE not o.eliminada";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const obras = await sequelize.query(sql, { type: QueryTypes.SELECT });
      let salida = [];
      if (obras) {
        for (const element of obras) {
  
              const detalle_salida = {
                id: Number(element.id),
                codigo_obra: String(element.codigo_obra),
                numero_ot: String(element.numero_ot),
                nombre_obra: String(element.nombre_obra),
                zona: element.zona, //json
                delegacion: element.delegacion, //json
                gestor_cliente: String(element.gestor_cliente),
                numero_aviso: Number(element.numero_aviso),
                numero_oc: String(element.numero_oc),
                monto: Number(element.monto),
                cantidad_uc: Number(element.cantidad_uc),
                fecha_llegada: String(element.fecha_llegada),
                fecha_inicio: String(element.fecha_inicio),
                fecha_termino: String(element.fecha_termino),
                tipo_trabajo: element.tipo_trabajo, //json
                persona_envia_info: String(element.persona_envia_info),
                cargo_persona_envia_info: String(element.cargo_persona_envia_info),
                empresa_contratista: element.empresa_contratista, //json
                coordinador_contratista: element.coordinador_contratista, //json
                comuna: element.comuna, //json
                ubicacion: String(element.ubicacion),
                estado: element.estado, //json
                tipo_obra: element.tipo_obra, //json
                segmento: element.segmento, //json
                eliminada: element.eliminada,
                cantidad_reportes: Number(element.cantidad_reportes),
                jefe_delegacion: element.jefe_delegacion?String(element.jefe_delegacion):null,
                cantidad_estados_pago: Number(element.cantidad_estados_pago),
                oficina: element.oficina, //json
                recargo_distancia: element.recargo_distancia, //json
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
/* Crea una obra
;
*/
exports.createObra = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Obras']
      #swagger.description = 'Crea una nueva obra' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos básicos de una obra',
            required: true,
            schema: {
              codigo_obra: "CGED-123456",
                nombre_obra: "nombre de la obra",
                numero_ot: "123456",
                zona: 1,
                delegacion: 1,
                gestor_cliente: "nombre gestor cliente (cge)",
                numero_aviso: 123456,
                numero_oc: "123456",
                monto: 1000,
                cantidad_uc: 100,
                fecha_llegada: "2023-10-25",
                fecha_inicio: "2023-10-25",
                fecha_termino: "2023-10-25",
                tipo_trabajo: 1,
                persona_envia_info: "nombre persona envia info",
                cargo_persona_envia_info: "cargo persona envia info",
                empresa_contratista: 1,
                coordinador_contratista: 1,
                comuna: "07201",
                ubicacion: "dirección donde se trabajará en la obra",
                tipo_obra: 1,
                segmento: 1,
                jefe_delegacion: "nombre jefe delegacion",
                oficina: {'id':1,'oficina':'Curicó','supervisor':'Eduardo Soto'},
                recargo_distancia: {'id':7,'nombre':'Menos de 30km','porcentaje':0}
            }
        }
      */
  try {

      let salir = false;
      const campos = [
        'codigo_obra', 'nombre_obra'
      ];
      for (const element of campos) {
        if (!req.body[element]) {
          res.status(400).send( "No puede estar nulo el campo " + element
          );
          return;
        }
      };
    
      //Verifica que el codigo obra no se encuentre
      await Obra.findAll({where: {codigo_obra: req.body.codigo_obra}}).then(data => {
        //el rut ya existe
        if (data.length > 0) {
          salir = true;
          res.status(400).send('El Codigo de Obra ya se encuentra ingresado en la base' );
        }
      }).catch(err => {
          salir = true;
          res.status(500).send( err.message );
      })
    
      if (salir) {
        return;
      }
      // Busca el ID de encabezado disponible
      let sql = "select nextval('obras.obras_id_seq'::regclass) as valor";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      let id_obra = 0;
      await sequelize.query(sql, {
        type: QueryTypes.SELECT
      }).then(data => {
        id_obra = data[0].valor;
      }).catch(err => {
        res.status(500).send(err.message );
        return;
      })

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

      const obra = {
          id: id_obra,
          codigo_obra: req.body.codigo_obra,
          nombre_obra: req.body.nombre_obra,
          numero_ot: req.body.numero_ot,
          zona: req.body.zona,
          delegacion: req.body.delegacion,
          gestor_cliente: req.body.gestor_cliente,
          numero_aviso: req.body.numero_aviso,
          numero_oc: req.body.numero_oc,
          monto: req.body.monto,
          cantidad_uc: req.body.cantidad_uc,
          fecha_llegada: req.body.fecha_llegada,
          fecha_inicio: req.body.fecha_inicio,
          fecha_termino: req.body.fecha_termino,
          tipo_trabajo: req.body.tipo_trabajo,
          persona_envia_info: req.body.persona_envia_info,
          cargo_persona_envia_info: req.body.cargo_persona_envia_info,
          empresa_contratista: req.body.empresa_contratista,
          coordinador_contratista: req.body.coordinador_contratista,
          comuna: req.body.comuna,
          ubicacion: req.body.ubicacion,
          estado: 1,
          tipo_obra: req.body.tipo_obra,
          segmento: req.body.segmento,
          eliminada: false,
          jefe_delegacion: req.body.jefe_delegacion,
          oficina: req.body.oficina?req.body.oficina.id:null,
          recargo_distancia: req.body.recargo_distancia?req.body.recargo_distancia.id:null

      }
      const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
      const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);

      const obra_historial = {
        id_obra: id_obra,
        fecha_hora: fechahoy,
        usuario_rut: user_name,
        estado_obra: 1,
        datos: obra
      }

        let salida = {};
        const t = await sequelize.transaction();

        try {


          salida = {"error": false, "message": "obra ingresada"};
          const obra_creada = await Obra.create(obra, { transaction: t });

          const obra_historial_creado = await ObrasHistorialCambios.create(obra_historial, { transaction: t });

          await t.commit();

        } catch (error) {
          salida = { error: true, message: error }
          await t.rollback();
        }


      if (salida.error) {
        console.log('Error Result ---> ', salida.message);
        res.status(500).send(salida.message.parent.detail);
      }else {
        res.status(200).send(salida);
      }
      
    }catch (error) {
      console.log('Error General ---> ', error);
      res.status(500).send(error);
    }
  }
  /*********************************************************************************** */


/*********************************************************************************** */
/* Actualiza una obra
;
*/
exports.updateObra = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Obras']
      #swagger.description = 'Actualiza una obra' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos básicos de una obra',
            required: false,
            schema: {
              codigo_obra: "CGE-123456",
                nombre_obra: "nombre de la obra",
                numero_ot: "123456",
                zona: 1,
                delegacion: 1,
                gestor_cliente: "nombre gestor cliente (cge)",
                numero_aviso: 123456,
                numero_oc: "123456",
                monto: 1000,
                cantidad_uc: 100,
                fecha_llegada: "2023-10-25",
                fecha_inicio: "2023-10-25",
                fecha_termino: "2023-10-25",
                tipo_trabajo: 1,
                persona_envia_info: "nombre persona envia info",
                cargo_persona_envia_info: "cargo persona envia info",
                empresa_contratista: 1,
                coordinador_contratista: 1,
                comuna: "07234",
                ubicacion: "dirección donde se trabajará en la obra",
                tipo_obra: 1,
                segmento: 1,
                jefe_delegacion: "nombre jefe delegacion",
                oficina: {'id':1,'oficina':'Curicó','supervisor':'Eduardo Soto'},
                recargo_distancia: {'id':7,'nombre':'Menos de 30km','porcentaje':0}
            }
        }
      */
  
  try{
    const id = req.params.id;
    let id_usuario = req.userId;
    let user_name;

      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      let sql = "select username from _auth.users where id = " + id_usuario;
      await sequelize.query(sql, {
        type: QueryTypes.SELECT
      }).then(data => {
        user_name = data[0].username;
      }).catch(err => {
        res.status(500).send(err.message );
        return;
      })

      let ultimo_estado;
      sql = "select max(a.estado_obra) as estado_obra from (SELECT estado_obra FROM obras.obras_historial_cambios WHERE id_obra = " + id + " order by fecha_hora desc limit 1) as a;"
      await sequelize.query(sql, {
        type: QueryTypes.SELECT
      }).then(data => {
        ultimo_estado = data[0].estado_obra;
      }).catch(err => {
        res.status(500).send(err.message );
        return;
      })
      if (!ultimo_estado) {
        ultimo_estado = 1;
      }

    const obra = {

      codigo_obra: req.body.codigo_obra?req.body.codigo_obra:undefined,
      nombre_obra: req.body.nombre_obra?req.body.nombre_obra:undefined,
      numero_ot: req.body.numero_ot?req.body.numero_ot:undefined,
      zona: req.body.zona?req.body.zona:undefined,
      delegacion: req.body.delegacion?req.body.delegacion:undefined,
      gestor_cliente: req.body.gestor_cliente?req.body.gestor_cliente:undefined,
      numero_aviso: req.body.numero_aviso?req.body.numero_aviso:undefined,
      numero_oc: req.body.numero_oc?req.body.numero_oc:undefined,
      monto: req.body.monto?req.body.monto:undefined,
      cantidad_uc: req.body.cantidad_uc?req.body.cantidad_uc:undefined,
      fecha_llegada: req.body.fecha_llegada?req.body.fecha_llegada:undefined,
      fecha_inicio: req.body.fecha_inicio?req.body.fecha_inicio:undefined,
      fecha_termino: req.body.fecha_termino?req.body.fecha_termino:undefined,
      tipo_trabajo: req.body.tipo_trabajo?req.body.tipo_trabajo:undefined,
      persona_envia_info: req.body.persona_envia_info?req.body.persona_envia_info:undefined,
      cargo_persona_envia_info: req.body.cargo_persona_envia_info?req.body.cargo_persona_envia_info:undefined,
      empresa_contratista: req.body.empresa_contratista?req.body.empresa_contratista:undefined,
      coordinador_contratista: req.body.coordinador_contratista?req.body.coordinador_contratista:undefined,
      comuna: req.body.comuna?req.body.comuna:undefined,
      ubicacion: req.body.ubicacion?req.body.ubicacion:undefined,
      estado: undefined,
      tipo_obra: req.body.tipo_obra?req.body.tipo_obra:undefined,
      segmento: req.body.segmento?req.body.segmento:undefined,
      jefe_delegacion: req.body.jefe_delegacion?req.body.jefe_delegacion:undefined,
      oficina: req.body.oficina?req.body.oficina.id:undefined,
      recargo_distancia: req.body.recargo_distancia?req.body.recargo_distancia.id:undefined

  }
        const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
        const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);
        const obra_historial = {
          id_obra: id,
          fecha_hora: fechahoy,
          usuario_rut: user_name,
          estado_obra: ultimo_estado,
          datos: obra
        }

        let salida = {};
        const t = await sequelize.transaction();

        try {


          salida = {"error": false, "message": "obra actualizda"};
          const obra_creada = await Obra.update(obra, { where: { id: id }, transaction: t });

          const obra_historial_creado = await ObrasHistorialCambios.create(obra_historial, { transaction: t });

          await t.commit();

        } catch (error) {
          salida = { error: true, message: error }
          await t.rollback();
        }
        if (salida.error) {
          res.status(500).send(salida.message);
        }else {
          res.status(200).send(salida);
        }

  }catch (error) {
    res.status(500).send(error);
  }
}
  /*********************************************************************************** */


/*********************************************************************************** */
/* Eliminar una obra
;
*/
exports.deleteObra = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Obras']
      #swagger.description = 'Borra una obra, pasando el campo eliminado a true' */
  try{
    const id = req.params.id;
    const borrar = {"eliminada": true, "estado": 9};

    let id_usuario = req.userId;
    let user_name;

    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    let sql = "select username from _auth.users where id = " + id_usuario;
    await sequelize.query(sql, {
      type: QueryTypes.SELECT
    }).then(data => {
      user_name = data[0].username;
    }).catch(err => {
      res.status(500).send(err.message );
      return;
    })

    const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
    const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);
    const obra_historial = {
      id_obra: id,
      fecha_hora: fechahoy,
      usuario_rut: user_name,
      estado_obra: 9,
      datos: borrar
    }

    let salida = {};
    const t = await sequelize.transaction();

    try {


      salida = {"error": false, "message": "obra eliminada"};
      const obra_creada = await Obra.update(borrar, { where: { id: id }, transaction: t });

      const obra_historial_creado = await ObrasHistorialCambios.create(obra_historial, { transaction: t });

      await t.commit();

    } catch (error) {
      salida = { error: true, message: error }
      await t.rollback();
    }
    if (salida.error) {
      res.status(500).send(salida.message.parent.detail);
    }else {
      res.status(200).send(salida);
    }

  }catch (error) {
    res.status(500).send(error);
  }

}
  /*********************************************************************************** */
/* Paraliza una obra
;
*/
exports.paralizaObra = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Obras']
      #swagger.description = 'Paraliza una obra, pasando el campo paralizada a true'
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos para paralizar una obra',
            required: false,
            schema: {
                id_obra: 45,
                fecha_hora: "2024-01-05 15:30:00",
                responsable: "Juan Perez",
                motivo: "Motivo de la paralización (descripción corta)",
                observacion: "Observaciones detalladas de la paralización"
            }
        } */
      try{
        let salir = false;
        const campos = [
          'id_obra', 'fecha_hora', 'responsable', 'motivo', 'observacion'
        ];
        for (const element of campos) {
          if (!req.body[element]) {
            res.status(400).send( "No puede estar nulo el campo " + element
            );
            return;
          }
        };

        const id_obra = req.body.id_obra;

        const obra_paralizada = {
          "id_obra": id_obra, 
          "fecha_hora": req.body.fecha_hora,
          "responsable": "responsable", 
          "motivo": "motivo", 
          "observacion": "observacion"
        };

        const borrar = {"eliminada": true, "estado": 9};
    
        let id_usuario = req.userId;
        let user_name;
    
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        let sql = "select username from _auth.users where id = " + id_usuario;
        await sequelize.query(sql, {
          type: QueryTypes.SELECT
        }).then(data => {
          user_name = data[0].username;
        }).catch(err => {
          res.status(500).send(err.message );
          return;
        })
    
        const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
        const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);
        const obra_historial = {
          id_obra: id,
          fecha_hora: fechahoy,
          usuario_rut: user_name,
          estado_obra: 9,
          datos: borrar
        }
    
        let salida = {};
        const t = await sequelize.transaction();
    
        try {
    
    
          salida = {"error": false, "message": "obra eliminada"};
          const obra_creada = await Obra.update(borrar, { where: { id: id }, transaction: t });
    
          const obra_historial_creado = await ObrasHistorialCambios.create(obra_historial, { transaction: t });
    
          await t.commit();
    
        } catch (error) {
          salida = { error: true, message: error }
          await t.rollback();
        }
        if (salida.error) {
          res.status(500).send(salida.message.parent.detail);
        }else {
          res.status(200).send(salida);
        }
    
      }catch (error) {
        res.status(500).send(error);
      }

}

/*********************************************************************************** */
/* Encuentra una obra por id
;
*/
exports.findObraById = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Obras']
      #swagger.description = 'Devuelve una obra por ID' */
  const id = req.params.id;

  try {
    /*
    const sql = "SELECT o.id, codigo_obra, numero_ot, nombre_obra, row_to_json(z) as zona, row_to_json(d) as delegacion, gestor_cliente, \
    numero_aviso, numero_oc, monto, cantidad_uc, fecha_llegada::text, fecha_inicio::text, fecha_termino::text, row_to_json(tt) as tipo_trabajo, \
    persona_envia_info, cargo_persona_envia_info, row_to_json(ec) as empresa_contratista, row_to_json(cc) as coordinador_contratista, \
    row_to_json(c) as comuna, ubicacion, row_to_json(eo) as estado, row_to_json(tob) as tipo_obra, row_to_json(s) as segmento, eliminada \
    FROM obras.obras o left join _comun.zonal z on o.zona = z.id left join obras.delegaciones d on o.delegacion = d.id left join \
    obras.tipo_trabajo tt on o.tipo_trabajo = tt.id left join obras.empresas_contratista ec on o.empresa_contratista = ec.id left \
    join obras.coordinadores_contratista cc on o.coordinador_contratista = cc.id left join _comun.comunas c on o.comuna = c.codigo \
    left join obras.estado_obra eo on o.estado = eo.id left join obras.tipo_obra tob on o.tipo_obra = tob.id left join obras.segmento \
    s on o.segmento = s.id WHERE o.id = :id";
    */
    const sql = "SELECT o.id, codigo_obra, numero_ot, nombre_obra, row_to_json(z) as zona, row_to_json(d) as delegacion, \
      o.gestor_cliente, numero_aviso, numero_oc, monto, cantidad_uc, fecha_llegada::text, fecha_inicio::text, \
      fecha_termino::text, row_to_json(tt) as tipo_trabajo, persona_envia_info, cargo_persona_envia_info, \
      row_to_json(ec) as empresa_contratista, row_to_json(cc) as coordinador_contratista, row_to_json(c) as comuna, \
      ubicacion, row_to_json(eo) as estado, row_to_json(tob) as tipo_obra, row_to_json(s) as segmento, eliminada, \
      case when erd.cuenta is null then 0 else erd.cuenta end as cantidad_reportes, o.jefe_delegacion, \
      (select count(id) as cantidad_estados_pago FROM obras.encabezado_estado_pago WHERE id_obra = 6) as cantidad_estados_pago, \
      row_to_json(ofi) as oficina, row_to_json(rec) as recargo_distancia FROM obras.obras o left join _comun.zonal z \
      on o.zona = z.id left join obras.delegaciones d on o.delegacion = d.id left join obras.tipo_trabajo tt on \
      o.tipo_trabajo = tt.id left join obras.empresas_contratista ec on o.empresa_contratista = ec.id left join \
      obras.coordinadores_contratista cc on o.coordinador_contratista = cc.id left join _comun.comunas c on \
      o.comuna = c.codigo left join obras.estado_obra eo on o.estado = eo.id left join obras.tipo_obra tob on \
      o.tipo_obra = tob.id left join obras.segmento s on o.segmento = s.id left join (select id_obra, count(id) \
      as cuenta from obras.encabezado_reporte_diario group by id_obra) as erd on o.id = erd.id_obra left join \
      (SELECT os.id, o.nombre as oficina, so.nombre as supervisor	FROM obras.oficina_supervisor os join _comun.oficinas \
        o on os.oficina = o.id join obras.supervisores_contratista so on os.supervisor = so.id) ofi on o.oficina = \
        ofi.id left join (SELECT id, nombre, porcentaje FROM obras.recargos where id_tipo_recargo = 2) rec \
        on o.recargo_distancia = rec.id WHERE o.id = :id";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const obras = await sequelize.query(sql, { replacements: { id: id }, type: QueryTypes.SELECT });
    let salida = [];
    if (obras) {
      for (const element of obras) {

            const detalle_salida = {
              id: Number(element.id),
              codigo_obra: String(element.codigo_obra),
              numero_ot: String(element.numero_ot),
              nombre_obra: String(element.nombre_obra),
              zona: element.zona, //json
              delegacion: element.delegacion, //json
              gestor_cliente: String(element.gestor_cliente),
              numero_aviso: Number(element.numero_aviso),
              numero_oc: String(element.numero_oc),
              monto: Number(element.monto),
              cantidad_uc: Number(element.cantidad_uc),
              fecha_llegada: String(element.fecha_llegada),
              fecha_inicio: String(element.fecha_inicio),
              fecha_termino: String(element.fecha_termino),
              tipo_trabajo: element.tipo_trabajo, //json
              persona_envia_info: String(element.persona_envia_info),
              cargo_persona_envia_info: String(element.cargo_persona_envia_info),
              empresa_contratista: element.empresa_contratista, //json
              coordinador_contratista: element.coordinador_contratista, //json
              comuna: element.comuna, //json
              ubicacion: String(element.ubicacion),
              estado: element.estado, //json
              tipo_obra: element.tipo_obra, //json
              segmento: element.segmento, //json
              eliminada: element.eliminada,
              cantidad_reportes: Number(element.cantidad_reportes),
              jefe_delegacion: element.jefe_delegacion?String(element.jefe_delegacion):null,
              cantidad_estados_pago: Number(element.cantidad_estados_pago),
              oficina: element.oficina, //json
              recargo_distancia: element.recargo_distancia, //json
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


/*********************************************************************************** */
/* Encuentra una obra por Codigo Obra
;
*/
exports.findObraByCodigo = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Obras']
      #swagger.description = 'Devuelve una obra por código de obra' */
  const codigo_obra = req.query.codigo_obra;

  try {
    /*
    const sql = "SELECT o.id, codigo_obra, numero_ot, nombre_obra, row_to_json(z) as zona, row_to_json(d) as delegacion, gestor_cliente, \
    numero_aviso, numero_oc, monto, cantidad_uc, fecha_llegada::text, fecha_inicio::text, fecha_termino::text, row_to_json(tt) as tipo_trabajo, \
    persona_envia_info, cargo_persona_envia_info, row_to_json(ec) as empresa_contratista, row_to_json(cc) as coordinador_contratista, \
    row_to_json(c) as comuna, ubicacion, row_to_json(eo) as estado, row_to_json(tob) as tipo_obra, row_to_json(s) as segmento, eliminada \
    FROM obras.obras o left join _comun.zonal z on o.zona = z.id left join obras.delegaciones d on o.delegacion = d.id left join \
    obras.tipo_trabajo tt on o.tipo_trabajo = tt.id left join obras.empresas_contratista ec on o.empresa_contratista = ec.id left \
    join obras.coordinadores_contratista cc on o.coordinador_contratista = cc.id left join _comun.comunas c on o.comuna = c.codigo \
    left join obras.estado_obra eo on o.estado = eo.id left join obras.tipo_obra tob on o.tipo_obra = tob.id left join obras.segmento \
    s on o.segmento = s.id WHERE o.codigo_obra = :codigo_obra";*/
    const sql = "SELECT o.id, codigo_obra, numero_ot, nombre_obra, row_to_json(z) as zona, row_to_json(d) as delegacion, \
      o.gestor_cliente, numero_aviso, numero_oc, monto, cantidad_uc, fecha_llegada::text, fecha_inicio::text, \
      fecha_termino::text, row_to_json(tt) as tipo_trabajo, persona_envia_info, cargo_persona_envia_info, \
      row_to_json(ec) as empresa_contratista, row_to_json(cc) as coordinador_contratista, row_to_json(c) as comuna, \
      ubicacion, row_to_json(eo) as estado, row_to_json(tob) as tipo_obra, row_to_json(s) as segmento, eliminada, \
      case when erd.cuenta is null then 0 else erd.cuenta end as cantidad_reportes, o.jefe_delegacion, \
      (select count(id) as cantidad_estados_pago FROM obras.encabezado_estado_pago WHERE id_obra = 6) as cantidad_estados_pago, \
      row_to_json(ofi) as oficina, row_to_json(rec) as recargo_distancia FROM obras.obras o left join _comun.zonal z \
      on o.zona = z.id left join obras.delegaciones d on o.delegacion = d.id left join obras.tipo_trabajo tt on \
      o.tipo_trabajo = tt.id left join obras.empresas_contratista ec on o.empresa_contratista = ec.id left join \
      obras.coordinadores_contratista cc on o.coordinador_contratista = cc.id left join _comun.comunas c on \
      o.comuna = c.codigo left join obras.estado_obra eo on o.estado = eo.id left join obras.tipo_obra tob on \
      o.tipo_obra = tob.id left join obras.segmento s on o.segmento = s.id left join (select id_obra, count(id) \
      as cuenta from obras.encabezado_reporte_diario group by id_obra) as erd on o.id = erd.id_obra left join \
      (SELECT os.id, o.nombre as oficina, so.nombre as supervisor	FROM obras.oficina_supervisor os join _comun.oficinas \
        o on os.oficina = o.id join obras.supervisores_contratista so on os.supervisor = so.id) ofi on o.oficina = \
        ofi.id left join (SELECT id, nombre, porcentaje FROM obras.recargos where id_tipo_recargo = 2) rec \
        on o.recargo_distancia = rec.id WHERE o.codigo_obra = :codigo_obra";
    
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const obras = await sequelize.query(sql, { replacements: { codigo_obra: codigo_obra }, type: QueryTypes.SELECT });
    let salida = [];
    if (obras) {
      for (const element of obras) {

            const detalle_salida = {
              id: Number(element.id),
              codigo_obra: String(element.codigo_obra),
              numero_ot: String(element.numero_ot),
              nombre_obra: String(element.nombre_obra),
              zona: element.zona, //json
              delegacion: element.delegacion, //json
              gestor_cliente: String(element.gestor_cliente),
              numero_aviso: Number(element.numero_aviso),
              numero_oc: String(element.numero_oc),
              monto: Number(element.monto),
              cantidad_uc: Number(element.cantidad_uc),
              fecha_llegada: String(element.fecha_llegada),
              fecha_inicio: String(element.fecha_inicio),
              fecha_termino: String(element.fecha_termino),
              tipo_trabajo: element.tipo_trabajo, //json
              persona_envia_info: String(element.persona_envia_info),
              cargo_persona_envia_info: String(element.cargo_persona_envia_info),
              empresa_contratista: element.empresa_contratista, //json
              coordinador_contratista: element.coordinador_contratista, //json
              comuna: element.comuna, //json
              ubicacion: String(element.ubicacion),
              estado: element.estado, //json
              tipo_obra: element.tipo_obra, //json
              segmento: element.segmento, //json
              eliminada: element.eliminada,
              cantidad_reportes: Number(element.cantidad_reportes),
              jefe_delegacion: element.jefe_delegacion?String(element.jefe_delegacion):null,
              cantidad_estados_pago: Number(element.cantidad_estados_pago),
              oficina: element.oficina, //json
              recargo_distancia: element.recargo_distancia, //json
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

/*********************************************************************************** */
/* Obtiene el código de obra en caso de que sea de tipo emergencia
    GET /api/obras/backoffice/estadopago/v1/codigodeobraemergencia
*/
exports.getCodigoObraEmergencia = async (req, res) => {
  /*  #swagger.tags = ['Obras - Backoffice - Obras']
      #swagger.description = 'Obtiene el código de obra en caso de que sea de tipo emergencia' */
  try {
    //tipo_obra igual 7 es emergencia
      const sql = "select case when maximo is null then 'E-0000000001'::text else \
      ('E-' || to_char(maximo+1, 'FM0999999999'))::text end as valor from \
      (select max(id) as maximo from obras.obras WHERE tipo_obra = 7) as a";
      const { QueryTypes } = require('sequelize');
      const sequelize = db.sequelize;
      const codigoEmergencia = await sequelize.query(sql, { type: QueryTypes.SELECT });
      if (codigoEmergencia) {
        res.status(200).send(codigoEmergencia);
      }else{
        res.status(500).send("Error en la consulta (servidor backend)");
      }
  } catch (error) {
    res.status(500).send(error);
  }
}