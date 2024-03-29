module.exports = (sequelize, Sequelize) => {
    const Jornada = sequelize.define("reporte_jornada", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
        rut_maestro: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rut_ayudante: {
            type: Sequelize.STRING,
            allowNull: false
        },
        codigo_turno: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        patente: {
            type: Sequelize.STRING,
            allowNull: false
        },
        id_paquete: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        km_inicial: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        km_final: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        fecha_hora_ini: {
            type : Sequelize.STRING,
        },
        fecha_hora_fin: {
            type : Sequelize.STRING
        },
        estado: {
            type: Sequelize.INTEGER
        },
        id_movil: {
            type: Sequelize.STRING
        },
        coordenadas: {
            type: Sequelize.JSON
        },
        brigada: {
            type: Sequelize.INTEGER
        },
        tipo_turno: {
            type: Sequelize.INTEGER
        },
        id_estado_resultado: {
            type: Sequelize.INTEGER
        }
    },
    {
        schema: "sae",
    });
  
    return Jornada;
  };