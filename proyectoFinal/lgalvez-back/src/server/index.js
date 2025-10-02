import express from 'express'
import cors from 'cors'
import {sequelize} from "../config/db.js";
import routes from '../routes/index.js';

class Server{

    constructor(){
        this.port=process.env.PORT || 3000;
        this.app = express();

        this.middleware();
        this.routes();
        this.dbConnection();
    }

    routes(){
        this.app.use(routes);
    }

    middleware (){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    async dbConnection(){
        try {
        await sequelize.authenticate();
         console.log('Conexión a la base de datos Postgres establecida exitosamente.');
        } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        }

    }

    listen(){
      this.app.listen(this.port,()=> {
          console.log(`Servidor ejecutándose en el puerto ${this.port}`);
      });
    }
}
export { Server };
