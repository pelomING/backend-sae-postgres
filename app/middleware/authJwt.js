const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const VerificaAuth = db.verificaAuth;

let verifyToken = (req, res, next) => {

  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      error: true,
      message: "No está autenticado",
    });
  }

  jwt.verify(token,
             config.secret,
             (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  error: true,
                  message: "No autorizado!",
                });
              }
              req.userId = decoded.id;
              next();
             });
};

let isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const element of roles) {
      if (element.name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      error: true,
      message: "Debe ser Administrador",
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "No es posible validar el rol",
    });
  }
};


let isSistema = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const element of roles) {
      if (element.name === "sistema") {
        return next();
      }
    }

    return res.status(403).send({
      error: true,
      message: "Debe ser usuario de Sistema",
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "No es posible validar el rol",
    });
  }
};

let isTecnico = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const element of roles) {
      if (element.name === "tecnico") {
        return next();
      }
    }

    return res.status(403).send({
      error: true,
      message: "Debe ser Tecnico",
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "No es posible determinar el rol",
    });
  }
};

let isSupervisor = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const element of roles) {
      if (element.name === "supervisor") {
        return next();
      }
    }

    return res.status(403).send({
      error: true,
      message: "Debe ser Supervisor",
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "No es posible determinar el rol",
    });
  }
};


let isSupervisorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const element of roles) {
      if (element.name === "supervisor") {
        return next();
      }

      if (element.name === "admin" ) {
        return next();
      }
    }

    return res.status(403).send({
      message: "Debe ser Supervisor o Administrador!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "No es posible determinar el rol",
    });
  }
};

let isSistemaOrAdminSae = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const element of roles) {
      if (element.name === "sistema") {
        return next();
      }

      if (element.name === "adminsae") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Debe ser Sistema o Administrador Sae!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "No es posible determinar el rol",
    });
  }
}
let isSupervisorOrAdminObrasOrSistema = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const element of roles) {
      if (element.name === "supervisor") {
        return next();
      }

      if (element.name === "adminobras" ) {
        return next();
      }

      if (element.name === "sistema") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Debe ser Supervisor o Administrador o Sistema!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "No es posible determinar el rol",
    });
  }
};

let isSupervisorOrAdminOrSistema = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (const element of roles) {
      if (element.name === "supervisor") {
        return next();
      }

      if (element.name === "admin" ) {
        return next();
      }

      if (element.name === "sistema") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Debe ser Supervisor o Administrador o Sistema!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "No es posible determinar el rol",
    });
  }
};

let readObrasBackofficeTerreno = async (req, res, next) => {
        let id_user = req.userId;
        let codigo_api = 'obras.backoffice.terreno';
        let crud = 'leer';
        const verificaAuth = await VerificaAuth.findOne({
          where: {
            user_id: id_user,
            codigo: codigo_api,
            [crud]: true
          }
        });
        if (!verificaAuth) {
          return res.status(403).send({
            error: true,
            message: "No tiene permiso para realizar esta operación"
          })
        }else{
            next();
        }
  
}

let createObrasBackofficeTerreno = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.terreno';
  let crud = 'crear';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
      next();
  }

}

let updateObrasBackofficeTerreno = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.terreno';
  let crud = 'actualizar';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
      next();
  }

}

let deleteObrasBackofficeTerreno = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.terreno';
  let crud = 'borrar';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
      next();
  }

}

let readObrasBackofficeBom = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.bom';
  let crud = 'leer';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
      next();
  }

}

let createObrasBackofficeBom = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.bom';
  let crud = 'crear';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
      }
  });

  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
    next();
  }

}

let updateObrasBackofficeBom = async (req, res, next) => {
    let id_user = req.userId;
    let codigo_api = 'obras.backoffice.bom';
    let crud = 'actualizar';
    const verificaAuth = await VerificaAuth.findOne({
      where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
    });
    if (!verificaAuth) {
      return res.status(403).send({
        error: true,
        message: "No tiene permiso para realizar esta operación"
      })
    }else{
      next();
    }

}

let deleteObrasBackofficeBom = async (req, res, next) => {
    let id_user = req.userId;
    let codigo_api = 'obras.backoffice.bom';
    let crud = 'borrar';
    const verificaAuth = await VerificaAuth.findOne({
    where: {
    user_id: id_user,
    codigo: codigo_api,
    [crud]: true
    }
    });
    if (!verificaAuth) {
    return res.status(403).send({
    error: true,
    message: "No tiene permiso para realizar esta operación"
    })
    }else{
    next();
    }

}

let readObrasBackofficeGeneral = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.general';
  let crud = 'leer';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
      next();
  }

}

let createObrasBackofficeGeneral = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.general';
  let crud = 'crear';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
      }
  });

  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
    next();
  }

}

let updateObrasBackofficeGeneral = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.general';
  let crud = 'actualizar';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
    user_id: id_user,
    codigo: codigo_api,
    [crud]: true
  }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
    next();
  }

}

let deleteObrasBackofficeGeneral = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.general';
  let crud = 'borrar';
  const verificaAuth = await VerificaAuth.findOne({
  where: {
  user_id: id_user,
  codigo: codigo_api,
  [crud]: true
  }
  });
  if (!verificaAuth) {
  return res.status(403).send({
  error: true,
  message: "No tiene permiso para realizar esta operación"
  })
  }else{
  next();
  }

}

let readObrasBackofficeObras = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.obras';
  let crud = 'leer';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
      next();
  }

}

let createObrasBackofficeObras = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.obras';
  let crud = 'crear';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
      }
  });

  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
    next();
  }

}

let updateObrasBackofficeObras = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.obras';
  let crud = 'actualizar';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
    user_id: id_user,
    codigo: codigo_api,
    [crud]: true
  }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
    next();
  }

}

let deleteObrasBackofficeObras = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.obras';
  let crud = 'borrar';
  const verificaAuth = await VerificaAuth.findOne({
  where: {
  user_id: id_user,
  codigo: codigo_api,
  [crud]: true
  }
  });
  if (!verificaAuth) {
  return res.status(403).send({
  error: true,
  message: "No tiene permiso para realizar esta operación"
  })
  }else{
  next();
  }

}

let readObrasBackofficeRepodiario = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.repodiario';
  let crud = 'leer';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
      next();
  }

}

let createObrasBackofficeRepodiario = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.repodiario';
  let crud = 'crear';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
      }
  });

  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
    next();
  }

}

let updateObrasBackofficeRepodiario = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.repodiario';
  let crud = 'actualizar';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
    user_id: id_user,
    codigo: codigo_api,
    [crud]: true
  }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
    next();
  }

}

let deleteObrasBackofficeRepodiario = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.repodiario';
  let crud = 'borrar';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
  next();
  }

}

let readObrasBackofficeEstadoPago = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.estadopago';
  let crud = 'leer';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
      next();
  }

}

let createObrasBackofficeEstadoPago = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.estadopago';
  let crud = 'crear';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
      }
  });

  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
    next();
  }

}

let updateObrasBackofficeEstadoPago = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.estadopago';
  let crud = 'actualizar';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
    user_id: id_user,
    codigo: codigo_api,
    [crud]: true
  }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
    next();
  }

}

let deleteObrasBackofficeEstadoPago = async (req, res, next) => {
  let id_user = req.userId;
  let codigo_api = 'obras.backoffice.estadopago';
  let crud = 'borrar';
  const verificaAuth = await VerificaAuth.findOne({
    where: {
      user_id: id_user,
      codigo: codigo_api,
      [crud]: true
    }
  });
  if (!verificaAuth) {
    return res.status(403).send({
      error: true,
      message: "No tiene permiso para realizar esta operación"
    })
  }else{
  next();
  }

}

const authJwt = {
  verifyToken,
  isAdmin,
  isTecnico,
  isSistema,
  isSupervisor,
  isSupervisorOrAdmin,
  isSupervisorOrAdminOrSistema,
  isSistemaOrAdminSae,
  isSupervisorOrAdminObrasOrSistema,
  readObrasBackofficeTerreno,
  createObrasBackofficeTerreno,
  updateObrasBackofficeTerreno,
  deleteObrasBackofficeTerreno,
  readObrasBackofficeBom,
  createObrasBackofficeBom,
  updateObrasBackofficeBom,
  deleteObrasBackofficeBom,
  readObrasBackofficeGeneral,
  createObrasBackofficeGeneral,
  updateObrasBackofficeGeneral,
  deleteObrasBackofficeGeneral,
  readObrasBackofficeObras,
  createObrasBackofficeObras,
  updateObrasBackofficeObras,
  deleteObrasBackofficeObras,
  readObrasBackofficeRepodiario,
  createObrasBackofficeRepodiario,
  updateObrasBackofficeRepodiario,
  deleteObrasBackofficeRepodiario,
  readObrasBackofficeEstadoPago,
  createObrasBackofficeEstadoPago,
  updateObrasBackofficeEstadoPago,
  deleteObrasBackofficeEstadoPago
};
module.exports = authJwt;