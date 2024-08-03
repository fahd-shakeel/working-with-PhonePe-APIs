const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    name:{type:String, require:true},
    amount:{type:String, require:true},
    date:{type:Date, require:true},
    transactionId:{type:String, require:true}
},
{
    timestamps:true
})

const Transaction = mongoose.model('Transaction',transactionSchema)

module.exports = Transaction;