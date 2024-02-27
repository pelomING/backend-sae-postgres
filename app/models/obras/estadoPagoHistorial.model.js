module.exports = (sequelize, Sequelize) => {
    const EstadoPagoHistorial = sequelize.define("estado_pago_historial", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        codigo_pelom: {
            type: Sequelize.STRING,
            allowNull: false
          },
        fecha_hora: {
            type: Sequelize.STRING,
            allowNull: false
        },
        usuario_rut: {
            type: Sequelize.STRING,
            allowNull: false
        },
        estado_edp: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        datos: {
            type: Sequelize.JSON
        },
        observacion: {
            type: Sequelize.STRING
        }
        },
        {
            schema: "obras",
        });
    return EstadoPagoHistorial;
  };