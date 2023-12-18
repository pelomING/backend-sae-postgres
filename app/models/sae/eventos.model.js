module.exports = (sequelize, Sequelize) => {
    const Eventos = sequelize.define("reporte_eventos", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          numero_ot: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
          },
          tipo_evento: {
            type: Sequelize.STRING,
            allowNull: false
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
            allowNull: false
          },
          id_paquete: {
            type: Sequelize.INTEGER
          },
          requerimiento: {
            type: Sequelize.STRING
          },
          direccion: {
            type: Sequelize.STRING
          },
          fecha_hora: {
            type: Sequelize.STRING
          },
          estado: {
            type: Sequelize.INTEGER
          },
          trabajo_solicitado: {
            type: Sequelize.STRING
          },
          trabajo_realizado: {
            type: Sequelize.STRING
          }
    },
    {
        schema: "sae",
    });
  
    return Eventos;
  };