import mongoHelper from "../infra/helpers/mongo-helper";
import app from "./config/app";
import env from './config/env';

mongoHelper.connect(env.mongoUrl)
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running');
        });
    })
    .catch(e => {
        console.log(e);
    });