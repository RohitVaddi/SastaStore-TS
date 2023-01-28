import mongoose from "mongoose";

const connection = () => {
    mongoose.connect('mongodb+srv://Gonna_Live:Gonna_Live_Pass@gonnalive.0hmfxfn.mongodb.net/Gonna_Live_DB').then(() => {
        console.log('DB connected successfully');
    }).catch((err) => {
        console.log('Error connecting to', err)
    })

    // mongoose.set('debug', true)
}

export default connection