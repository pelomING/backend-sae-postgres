const db = require("../../models");
const VisitaTerreno = db.visitaTerreno;
const Obra = db.obra;
const ObrasHistorialCambios = db.obrasHistorialCambios;
const EstadoVisita = db.estadoVisita;


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
      #swagger.description = 'Crea una visita a terreno' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos para crear la visita a terreno',
            required: false,
            schema: {
                id_obra: 1,
                fecha_visita: "2023-10-25",
                direccion: "direccion",
                persona_mandante: "persona mandante",
                cargo_mandante: "cargo mandante",
                persona_contratista: "persona contratista",
                cargo_contratista: "cargo contratista",
                observacion: "observacion"
              }
        }
      
      
      */

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
        const id_obra = req.body.id_obra;
        const fecha_visita = req.body.fecha_visita;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_visita)) {
          res.status(400).send( 'La fecha de visita no tiene el formato correcto (AAAA-MM-DD)' );
          return;
        }

        //let fecha_visita = new Date(req.body.fecha_visita).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        //fecha_visita = fecha_visita.slice(6,10) + "-" + fecha_visita.slice(3,5) + "-" + fecha_visita.slice(0,2)
        let fecha_hoy = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha_hoy = fecha_hoy.slice(6,10) + "-" + fecha_hoy.slice(3,5) + "-" + fecha_hoy.slice(0,2)

    
        //Verifica que la visita a terreno no se encuentra ya agendada
        await VisitaTerreno.findAll({where: {id_obra: id_obra, fecha_visita: fecha_visita}}).then(async data => {
            //La obra ya tiene una visita agendada para esa fecha
            if (data.length > 0) {
                res.status(400).send( 'La Visita ya se encuentra ingresada para esa fecha' );
                return
            }else {
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

                const visita = {

                    id_obra: id_obra,
                    fecha_visita: fecha_visita,
                    direccion: req.body.direccion,
                    persona_mandante: req.body.persona_mandante,
                    cargo_mandante: req.body.cargo_mandante,
                    persona_contratista: req.body.persona_contratista,
                    cargo_contratista: req.body.cargo_contratista,
                    observacion: req.body.observacion,
                    estado: 6,    //Dejar de inmediato como efectuada ok
                    fecha_modificacion: fecha_hoy
        
                }
                const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
                const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);

                //estado visita agendada = 4  Estado de Obra: visita reportada exitosa (4)
                const obra = {estado: 4};

                const obra_historial = {
                  id_obra: id_obra,
                  fecha_hora: fechahoy,
                  usuario_rut: user_name,
                  estado_obra: 4,
                  datos: obra,
                  observacion: "Visita Reportada exitosa"
                }

                let salida = {};
                const t = await sequelize.transaction();

                try {

                  salida = {"error": false, "message": "Visita reportada ok"};
                  const visita_creada = await VisitaTerreno.create(visita, { transaction: t });

                  const obra_creada = await Obra.update(obra, { where: { id: id_obra }, transaction: t });
            
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
      #swagger.description = 'Actualiza una visita a terreno' 
      #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos para actualizar visita terreno',
            required: false,
            schema: {
                fecha_visita: "2023-10-25",
                direccion: "direccion",
                persona_mandante: "persona mandante",
                cargo_mandante: "cargo mandante",
                persona_contratista: "persona contratista",
                cargo_contratista: "cargo contratista",
                observacion: "observacion"
              }
        }
      
      
      */
    try{
        
        const id = req.params.id;

        const fecha_visita = req.body.fecha_visita;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_visita)) {
          res.status(400).send( 'La fecha de visita no tiene el formato correcto (AAAA-MM-DD)' );
          return;
        }
        //let fecha_visita = new Date(req.body.fecha_visita).toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        //fecha_visita = fecha_visita.slice(6,10) + "-" + fecha_visita.slice(3,5) + "-" + fecha_visita.slice(0,2)
        let fecha_hoy = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"}).slice(0, 10);
        fecha_hoy = fecha_hoy.slice(6,10) + "-" + fecha_hoy.slice(3,5) + "-" + fecha_hoy.slice(0,2)

        let id_obra;
        await VisitaTerreno.findOne({
            where: {
                id: id
            }
        }).then(data => {
          id_obra = data?data.id_obra:undefined;
        }).catch(err => {
            console.log('error id_obra --> ', err)
        })
    
        if (!id_obra) {
            res.status(500).send( 'La visita terreno no existe');
            return;
        }


        let visita;


        console.log("=================================");
        console.log('id' + id);
        console.log('fecha_hoy' + fecha_hoy);
        console.log('fecha visita' + fecha_visita);
        console.log("=================================");


            //Si viene la fecha de visita verificar que sea mayor o igual al día de hoy
            if (fecha_visita) {

                //let today = new Date(fecha_hoy).toISOString();
                //let fechaVisita = new Date(fecha_visita).toISOString();
                    visita = {

                        fecha_visita: fecha_visita,
                        direccion: req.body.direccion?req.body.direccion:undefined,
                        persona_mandante: req.body.persona_mandante?req.body.persona_mandante:undefined,
                        cargo_mandante: req.body.cargo_mandante?req.body.cargo_mandante:undefined,
                        persona_contratista: req.body.persona_contratista?req.body.persona_contratista:undefined,
                        cargo_contratista: req.body.cargo_contratista?req.body.cargo_contratista:undefined,
                        observacion: req.body.observacion?req.body.observacion:undefined,
                        estado: req.body.estado?req.body.estado:undefined,
                        fecha_modificacion: today
                
                    }
                
            }else {
                //No viene la fecha de visita
                visita = {

                  fecha_visita: undefined,
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

                //Determinar el estado al que debe cambiar la obra
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
                let estado_de_obra;
                if (req.body.estado) {
                  await EstadoVisita.findOne({ where: { id: req.body.estado } }).then(data => {
                    estado_de_obra = data.estado_obra_resultante;
                  })
                }
                
                estado_de_obra = 4  //forzar visita ok
                //estado visita agendada = 2
                const obra = estado_de_obra?{"estado": estado_de_obra}:null;

                const obra_historial = estado_de_obra?{
                  id_obra: id_obra,
                  fecha_hora: fechahoy,
                  usuario_rut: user_name,
                  estado_obra: estado_de_obra,
                  datos: obra,
                  observacion: "Modificación visita terreno"
                }:null;

                let salida = {};
                
                const t = await sequelize.transaction();

                try {

                  salida = {"error": false, "message": "Visita actualizada ok"};
                  const visita_creada = await VisitaTerreno.update(visita, { where: { id: id }, transaction: t });

                  
                  const obra_creada = obra?await Obra.update(obra, { where: { id: id_obra }, transaction: t }):null;
            
                  const obra_historial_creado = obra_historial?await ObrasHistorialCambios.create(obra_historial, { transaction: t }):null;
            
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
              
            } else {
                res.status(500).send('ERROR: falta completar campos');
                return;
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

        //Determinar el id de obra que está asociado a la visita terreno
        let id_obra;
        await VisitaTerreno.findOne({
          where: { id: id },
          attributes: ['id_obra']
        }).then(data => {
          id_obra = data.id_obra;
        }).catch(err => {
          res.status(500).send(err.message );
          return;
        })
        if (!id_obra) {
          res.status(500).send('La visita terreno no tiene una obra asociada');
          return;
        }
        // Determinar cuantas visitas terreno están asociadas a ese id de obra
        const countVisitasTerreno = await VisitaTerreno.count({
            where: { id_obra: id_obra }
        });
        console.log('countVisitasTerreno --> ', countVisitasTerreno);
        // consultar el estado de la obra con el ID de obra
        const estadoActualObra = await Obra.findOne({
            where: { id: id_obra },
            attributes: ['estado']
        });

        console.log('estadoActualObra --> ', estadoActualObra);
        if (estadoActualObra.estado !== 1 && estadoActualObra.estado !== 2 && estadoActualObra.estado !== 3 && estadoActualObra.estado !== 4) {
            res.status(500).send('La obra no se encuentra en un estado que permita borrar visitas terreno');
            return;
        }

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

        //determina fecha actual
        const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
        const fechahoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12);

        const estado_obra = 1  //forzar estado de obra a ingresada (1)
        //estado visita agendada = 2
        const obra = {estado: estado_obra};

        //Guarda historial
        const obra_historial = {
          id_obra: id_obra,
          fecha_hora: fechahoy,
          usuario_rut: user_name,
          estado_obra: estado_obra,  //Estado 1 ingresada
          datos: obra,
          observacion: "Borrado de visita terreno"
        };

        let salida = {};
        const t = await sequelize.transaction();

        try {

            salida = {"error": false, "message": "visita terreno eliminada"};

            await VisitaTerreno.destroy({where: { id: id }, transaction: t});

            if (countVisitasTerreno === 1) {
              const obra_creada = await Obra.update(obra, { where: { id: id_obra }, transaction: t });
            }

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
        res.status(500).send(error);
    }
}