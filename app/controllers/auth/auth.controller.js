const db = require("../../models");
const config = require("../../config/auth.config");
const User = db.user;
const Role = db.role;
const UsuariosFunciones = db.usuariosFunciones;
const LoginHistorial = db.loginHistorial;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
  /*  #swagger.tags = ['Autenticación']
      #swagger.description = 'Registro de un usuariuo nuevo' */
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      const result = user.setRoles(roles);
      if (result) res.status(200).send({ message: "User registered successfully!" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result) res.status(200).send({ message: "User registered successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
    
  }
};

exports.signin = async (req, res) => {
  /*  #swagger.tags = ['Autenticación']
      #swagger.description = 'Login de usuario' */
  try {
    const c = new Date().toLocaleString("es-CL", {timeZone: "America/Santiago"});
    const fechoy = c.substring(6,10) + '-' + c.substring(3,5) + '-' + c.substring(0,2) + ' ' + c.substring(12)
  

    const userFuncion = await UsuariosFunciones.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!userFuncion) {
      return res.status(401).send("User Not found." );
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      userFuncion.password
    );

    if (!passwordIsValid) {
      return res.status(401).send("Invalid Password!",
      );
    }

    const token = jwt.sign({ id: userFuncion.id },
                           config.secret,
                           {
                            algorithm: 'HS256',
                            allowInsecureKeySizes: true,
                            expiresIn: 86400, // 24 hours
                           });

    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    })

    let authorities = [];
    let idRole = [];
    const roles = await user.getRoles();
    for (const element of roles) {
      idRole.push(element.id);
      authorities.push("ROLE_" + element.name.toUpperCase());
    }

    // Esta línea es la que envía las cookies al cliente
    req.session.token = token;
    // *******************************************

    //* almacenar el log *//
    const loginHistorial = await LoginHistorial.create({
      username: user.username,
      email: user.email,
      accion: 'Login',
      fecha_hora: fechoy
    }).then(data => {
      console.log('ok');
    }).catch(err => {
      console.log('err', err);
    })
    const rol_consulta = idRole[0]?idRole[0]:0;

    const sql = "select * from _frontend.ver_menu_new where rol_id = " + rol_consulta + ";";
    const { QueryTypes } = require('sequelize');
    const sequelize = db.sequelize;
    const menu = await sequelize.query(sql, { type: QueryTypes.SELECT });

    function compararPorCampo(a, b) {
      if (a.orden < b.orden) {
        return -1;
      }
      if (a.orden > b.orden) {
        return 1;
      }
      return 0;
    }

    //determina el menu de salida
    let menu_salida = [];
    if (menu) {
        for (const element of menu) {
          element.items.sort(compararPorCampo);
          let items = [];
          for (const item of element.items) {
            delete item.orden;
            items.push(item);
          }
          const salida = {
            "label": element.label,
            "items": items
          }
          menu_salida.push(salida);
          //menu_salida.push(element.menu);
        }
      }
    /////////////////////////////////
    return res.status(200).send({
      id: user.id,
      username: user.username,
      nombre: userFuncion.nombres,
      funcion: userFuncion.funcion,
      email: user.email,
      roles: authorities,
      accessToken: token,
      menu: menu_salida
    });
  } catch (error) {
    if (error.message === "connect ECONNREFUSED ::1:5432") {
      return res.status(400).send( "No hay conexión a la base de datos",
      );
    } else {
      return res.status(500).send( error.message );
    }
  }
};

exports.signout = async (req, res) => {
  /*  #swagger.tags = ['Autenticación']
      #swagger.description = 'Logout de usuario' */
  try {
    //console.log("req.session", req);
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};