const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    validate: {
      isAsync: true,
      validator: function(value) {
        return new Promise(function(resolve, reject) {
          Tag.findOne({ name: value})
          .then(function(tag) {
            if(tag) {
              resolve(false)  
            } else {
              resolve(true)
            }
          });
        });
      },
      message: 'Tag already exist',
    },
  },
  questions: [{ type: Schema.Types.ObjectId }]
});

const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;