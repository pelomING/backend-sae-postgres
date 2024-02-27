module.exports = (sequelize, Sequelize) => {
    const EstadoPagoGestion = sequelize.define("estado_pago_gestion", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        codigo_pelom: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        fecha_presentacion: {
            type: Sequelize.STRING
        },
        semana: {
            type: Sequelize.INTEGER
        },
        detalle: {
            type: Sequelize.STRING,
            allowNull: false
          },
        numero_oc: {
            type: Sequelize.STRING
        },
        fecha_entrega_oc: {
            type: Sequelize.STRING
        },
        fecha_subido_portal: {
            type: Sequelize.STRING
        },
        folio_portal: {
            type: Sequelize.STRING
        },
        fecha_hes: {
            type: Sequelize.STRING
        },
        numero_hes: {
            type: Sequelize.STRING
        },
        fecha_solicita_factura: {
            type: Sequelize.STRING
        },
        responsable_solicitud: {
            type: Sequelize.STRING
        },
        numero_factura: {
            type: Sequelize.STRING
        },
        fecha_factura: {
            type: Sequelize.STRING
        },
        rango_dias: {
            type: Sequelize.STRING
          },
        estado: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
        },
        {
            schema: "obras",
        });
    return EstadoPagoGestion;
  };