//Review
//Créer un schéma `Review` avec :
//`username` : obligatoire ;
//`rating` : nombre compris entre 1 et 5 ;
//`comment` : maximum 500 caractères ;
//dates automatiques.


const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true 
});
module.exports = mongoose.model('Review', reviewSchema);


