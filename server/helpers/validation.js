
module.exports = {
  validationMessage: function(error, res) {
    console.log('========================',error)

    let output = null
    if(!error) {
      output = 'internal server error'
    } else if(error.errors) {
      output = []
      for( let key in error.errors ) {
        output.push(error.errors[key].message)
      }
    } else {
      output = 'internal server error'  
    }

    let status = (typeof output === 'string') ? 500 : 400
    if(status === 400) {
      output = output.join(' & ')
    }
    res
    .status(status)
    .json({ message : output })
  },
}