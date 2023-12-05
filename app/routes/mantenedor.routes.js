const { authJwt } = require("../middleware");
const mantendorController = require("../controllers/comun/mantenedor.controller");
const upload = require("../middleware/upload");

    
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
  
    //crea un nuevo estado, se debe pasar el nombre del estado, ejemplo: { nombre: "estado" }
    app.post("/api/mantenedor/v1/creaestado", [authJwt.verifyToken, authJwt.isSistema], mantendorController.createEstado);

    app.get("/api/mantenedor/v1/estados", [authJwt.verifyToken], mantendorController.estados);

    app.get("/api/mantenedor/v1/findallbases", [authJwt.verifyToken], mantendorController.findAllBases);

    app.get("/api/mantenedor/v1/findallclientes", [authJwt.verifyToken], mantendorController.findAllClientes);

    app.get("/api/mantenedor/v1/findalltipofuncionpersonal", [authJwt.verifyToken], mantendorController.findAllTipofuncionPersonal);

    app.get("/api/mantenedor/v1/oficinas", [authJwt.verifyToken], mantendorController.oficinas);

    // upload.single('file')
    app.post("/api/mantenedor/v1/upload", upload.single('file'), (req, res) => {
      /*  #swagger.tags = ['SAE - Mantenedores - Upload']
      #swagger.description = 'Sube un archivo al servidor' */
      res.json({ message: 'File uploaded successfully!' });
    });
  }; 