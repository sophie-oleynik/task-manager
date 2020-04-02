const {List} = require('../models/list');

let controller = {
    getList: async (req, res) => {
        if(req.params.id) {
            let list = await List.findById(req.params.id);
            res.send(list);
        } else {
            res.status(500).send("No List id")
        }
    }
}

module.exports = controller;