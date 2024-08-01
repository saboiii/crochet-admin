import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { WhitelistedEmail } from "@/models/WhitelistedEmail";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'POST') {
        const {whitelistedEmail} = req.body;
        const whitelistedEmailDoc = await WhitelistedEmail.create({
            whitelistedEmail,
        })
        res.json(whitelistedEmailDoc);
    }

    if (method === 'GET') {
        res.json(await WhitelistedEmail.find());
    }

    if (method == 'DELETE') {
        const {_id} = req.query;
        await  WhitelistedEmail.deleteOne({_id});
        res.json('ok');
    }
}