const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://salih:cemil@cluster0.xtzk2.mongodb.net/payment?retryWrites=true&w=majority',
  {useNewUrlParser: true, useUnifiedTopology: true},
);

const paymentSchema = new mongoose.Schema({
  id: String,
  itemId: String,
  paid: Boolean,
  buyerPubKey: String
});
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {
  Payment
};