module.exports = (sequelize, Sequelize) => {
    const EstadoPagoEstados = sequelize.define("estado_pago_estados", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
          },
        comentario: {
            type: Sequelize.STRING
        }
        },
        {
            schema: "obras",
        });
    return EstadoPagoEstados;
  };