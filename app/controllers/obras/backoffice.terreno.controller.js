const db = require("../../models");
const VisitaTerreno = db.visitaTerreno;
const Obra = db.obra;
const ObrasHistorialCambios = db.obrasHistorialCambios;


/*********************************************************************************** */
/* Consulta todas las visitas terreno
;
*/
exports.findAllVisitaTerreno = async (req, res) => {
    /*  #swagger.tags = ['Obras - Backoffice - Visita Terreno']
      #swagger.description = 'Devuelve todas las visitas a terreno' */
    try {

  

        const sql = "SELECT vt.id, json_build_object('id', o.id, 'codigo_obra', o.codigo_obra) as id_obra, \
        fecha_visita::text, direccion, persona_mandante, cargo_mandante, persona_contratista, cargo_contratista, \
        observacion, row_to_json(ev) as estado, fecha_modificacion::text FROM obras.visitas_terreno vt join \
        obras.obras o on o.id = vt.id_obra join obras.estado_visita ev on vt.estado = ev.id WHERE not o.eliminada";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const obras = await sequelize.query(sql, { type: QueryTypes.SELECT });
        let salida = [];
        if (obras) {
          for (const element of obras) {
    
                const detalle_salida = {
                  id: Number(element.id),
                  id_obra: element.id_obra, //json {"id": id, "codigo_obra": codigo_obra}
                  fecha_visita: String(element.fecha_visita),
                  direccion: String(element.direccion),
                  persona_mandante: String(element.persona_mandante),
                  cargo_mandante: String(element.cargo_mandante),
                  persona_contratista: String(element.persona_contratista),
                  cargo_contratista: String(element.cargo_contratista),
                  observacion: String(element.observacion),
                  estado: element.estado, //json {"id": id, "nombre": nombre}
                  fecha_modificacion: String(element.fecha_modificacion)
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
/* Consulta visitas terreno por id de obra
;
*/
exports.findVisitaTerrenoByIdObra = async (req, res) => {
    /*  #swagger.tags = ['Obras - Backoffice - Visita Terreno']
      #swagger.description = 'Devuelve las visitas a terreno por ID de obra (id_obra)' */
      try {
      

        const campos = [
            'id_obra'
          ];
          for (const element of campos) {
            if (!req.query[element]) {
              res.status(400).send("No puede estar nulo el campo " + element
              );
              return;
            }
          };
        const id_obra = req.query.id_obra;
        const sql = "SELECT vt.id, json_build_object('id', o.id, 'codigo_obra', o.codigo_obra) as id_obra, \
        fecha_visita::text, direccion, persona_mandante, cargo_mandante, persona_contratista, cargo_contratista, \
        observacion, row_to_json(ev) as estado, fecha_modificacion::text FROM obras.visitas_terreno vt join \
        obras.obras o on o.id = vt.id_obra join obras.estado_visita ev on vt.estado = ev.id WHERE not o.eliminada and o.id = :id_obra";
        const { QueryTypes } = require('sequelize');
        const sequelize = db.sequelize;
        const obras = await sequelize.query(sql, {  replacements: { id_obra: id_obra } , type: QueryTypes.SELECT });
        let salida = [];
        if (obras) {
          for (const element of obras) {
    
                const detalle_salida = {
                  id: Number(element.id),
                  id_obra: element.id_obra, //json {"id": id, "codigo_obra": codigo_obra}
                  fecha_visita: String(element.fecha_visita),
                  direccion: String(element.direccion),
                  persona_mandante: String(element.persona_mandante),
                  cargo_mandante: String(element.cargo_mandante),
                  persona_contratista: String(element.persona_contratista),
                  cargo_contratista: String(element.cargo_contratista),
                  observacion: String(element.observacion),
                  estado: element.estado, //json {"id": id, "nombre": nombre}
                  fecha_modificacion: String(element.fecha_modificacion)
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
/* Crea una visita terreno
;
*/
exports.createVisitaTerreno = async (req, res) => {
    /*  #swagger.tags = ['Obras - Backoffice - Visita Terreno']
      #swagger.description = 'Crea una visita a terreno' */

    try {



        const campos = [
        'id_obra', 'fecha_visita', 'direccion', 'persona_mandante', 'cargo_mandante', 'persona_contratista', 'cargo_contratista'
        ];
        for (const element of campos) {
        if (!req.body[element]) {
            res.status(400).send( "No puede estar nulo el campo " + element
            );
            return;
        }
        };
        let fecha_visita = new Date(req.body.fecha_visita).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha_visita = fecha_visita.slice(6,10) + "-" + fecha_visita.slice(3,5) + "-" + fecha_visita.slice(0,2)
        let fecha_hoy = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha_hoy = fecha_hoy.slice(6,10) + "-" + fecha_hoy.slice(3,5) + "-" + fecha_hoy.slice(0,2)

    
        //Verifica que la visita a terreno no se encuentra ya agendada
        await VisitaTerreno.findAll({where: {id_obra: req.body.id_obra, fecha_visita: fecha_visita}}).then(async data => {
            //La obra ya tiene una visita agendada para esa fecha
            if (data.length > 0) {
                res.status(400).send( 'La Visita ya se encuentra agendada' );
                return
            }else {
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

                const visita = {

                    id_obra: req.body.id_obra,
                    fecha_visita: req.body.fecha_visita,
                    direccion: req.body.direccion,
                    persona_mandante: req.body.persona_mandante,
                    cargo_mandante: req.body.cargo_mandante,
                    persona_contratista: req.body.persona_contratista,
                    cargo_contratista: req.body.cargo_contratista,
                    observacion: req.body.observacion,
                    estado: 1,
                    fecha_modificacion: fecha_hoy
        
                }
                const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
                const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);

                //estado visita agendada = 2
                const obra = {"estado": 2};

                const obra_historial = {
                  id_obra: id_obra,
                  fecha_hora: fechahoy,
                  usuario_rut: user_name,
                  estado_obra: 2,
                  datos: obra
                }

                let salida = {};
                const t = await sequelize.transaction();

                try {

                  salida = {"error": false, "message": "Visita agendada ok"};
                  const visita_creada = await VisitaTerreno.create(visita, { transaction: t });

                  const obra_creada = await Obra.update(obra, { where: { id: id_obra }, transaction: t });
            
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
        
            }
        }).catch(err => {
            res.status(500).send( err.message );
        })
    }catch (error) {
        res.status(500).send(error);
    }   
}
/*********************************************************************************** */
/* Actualizar una visita terreno
;
*/
exports.updateVisitaTerreno = async (req, res) => {
    /*  #swagger.tags = ['Obras - Backoffice - Visita Terreno']
      #swagger.description = 'Actualiza una visita a terreno' */
    try{
        

        const id = req.params.id;

        let fecha_hoy = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
       
        fecha_hoy = fecha_hoy.slice(6,10) + "-" + fecha_hoy.slice(3,5) + "-" + fecha_hoy.slice(0,2)

        const id_obra = req.body.id_obra;
        
        let fecha_visita = req.body.fecha_visita;

        fecha_visita = fecha_visita.slice(6,10) + "-" + fecha_visita.slice(3,5) + "-" + fecha_visita.slice(0,2)


        let visita;


        console.log("=================================");
        console.log('id' + id);
        console.log('fecha_hoy' + fecha_hoy);
        console.log('fecha visita' + fecha_visita);
        console.log("=================================");

        
        if (id_obra) {
            //El id de obra no se puede cambiar para una visita una vez asignado
            res.status(500).send( 'El id de obra no se puede cambiar' );

        }else {
            //Si viene la fecha de visita verificar que sea mayor o igual al día de hoy
            if (fecha_visita) {

                let today = new Date(fecha_hoy).toISOString();
                let fechaVisita = new Date(fecha_visita).toISOString();

                if (fechaVisita < today) {
                    // La fecha de visita es menor a la fecha actual 
                    res.status(500).send( 'La fecha de la visita no puede ser menor a la fecha actual' );
                }else {
                    visita = {

                        fecha_visita: fechaVisita,
                        direccion: req.body.direccion?req.body.direccion:undefined,
                        persona_mandante: req.body.persona_mandante?req.body.persona_mandante:undefined,
                        cargo_mandante: req.body.cargo_mandante?req.body.cargo_mandante:undefined,
                        persona_contratista: req.body.persona_contratista?req.body.persona_contratista:undefined,
                        cargo_contratista: req.body.cargo_contratista?req.body.cargo_contratista:undefined,
                        observacion: req.body.observacion?req.body.observacion:undefined,
                        estado: req.body.estado?req.body.estado:undefined,
                        fecha_modificacion: today
                
                    }
                }
            }else {
                //No viene la fecha de visita
                visita = {

                    direccion: req.body.direccion?req.body.direccion:undefined,
                    persona_mandante: req.body.persona_mandante?req.body.persona_mandante:undefined,
                    cargo_mandante: req.body.cargo_mandante?req.body.cargo_mandante:undefined,
                    persona_contratista: req.body.persona_contratista?req.body.persona_contratista:undefined,
                    cargo_contratista: req.body.cargo_contratista?req.body.cargo_contratista:undefined,
                    observacion: req.body.observacion?req.body.observacion:undefined,
                    estado: req.body.estado?req.body.estado:undefined,
                    fecha_modificacion: today
            
                }
            }

            if (visita != undefined) {

                const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
                const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);

                //estado visita agendada = 2
                const obra = {"estado": 2};

                const obra_historial = {
                  id_obra: id_obra,
                  fecha_hora: fechahoy,
                  usuario_rut: user_name,
                  estado_obra: 2,
                  datos: obra
                }

                let salida = {};
                const t = await sequelize.transaction();

                try {

                  salida = {"error": false, "message": "Visita agendada ok"};
                  const visita_creada = await VisitaTerreno.create(visita, { where: { id: id }, transaction: t });

                  const obra_creada = await Obra.update(obra, { where: { id: id_obra }, transaction: t });
            
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

                await VisitaTerreno.update(visita, { where: { id: id } })
                    .then(data => {
                        if (data == 1) {
                            res.status(200).send( { message:"Visita actualizada"} );
                        }else {
                            res.status(500).send( "No se pudo actualizar la Visita 246");
                        }
                    }).catch(err => {
                        res.status(500).send( err.message );
                    })
                }
        }

    }catch (error) {
        res.status(500).send('ERROR:'+error);
    }
}
/*********************************************************************************** */
/* Elimina una visita terreno
;
*/

exports.deleteVisitaTerreno = async (req, res) => {
    /*  #swagger.tags = ['Obras - Backoffice - Visita Terreno']
      #swagger.description = 'Elimina una visita a terreno' */
    try{

        const id = req.params.id;
        await VisitaTerreno.destroy({
          where: { id: id }
        }).then(data => {
          if (data === 1) {
            res.send({ message: "Visita terreno eliminada" });
          } else {
            res.send({ message: `No existe una visita terreno con el id ${id}` });
          }
        }).catch(err => {
          res.status(500).send( err.message );
        })


    }catch (error) {
        res.status(500).send(error);
    }
}