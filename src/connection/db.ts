import mongoose from "mongoose";

const connection = () => {
    mongoose.connect('mongodb://localhost/sastaStore').then(() => {
        console.log('DB connected successfully');
    }).catch((err) => {
        console.log('Error connecting to', err)
    })

    // mongoose.set('debug', true)
}

export default connection