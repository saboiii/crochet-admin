import { Category } from "@/models/Category";

export default async function handle(req, res) {
    const { method } = req;

    if (method === 'POST') {
        const { name } = req.body;
        const categoryDoc = await Category.create({name});
        res.json(categoryDoc);
    }

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Category.findOne({ _id: req.query.id }));
        } else {
            res.json(await Category.find());
        }
    }
}