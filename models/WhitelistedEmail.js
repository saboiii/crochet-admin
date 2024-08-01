import {model, models, Schema} from "mongoose";

const WhitelistedEmailSchema = new Schema({
    whitelistedEmail : { type: String, required: true },
});

export const WhitelistedEmail = models?.WhitelistedEmail || model('WhitelistedEmail', WhitelistedEmailSchema);