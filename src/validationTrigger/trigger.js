exports.handler = async (event, context) => {
  try {
    console.log('the trigger function was executed');
    /*
    event.Records.forEach(taxpayer => {
      const {body} = taxpayer;
      const request = JSON.parse(body);
      console.log(request,'request LEANDRITO');  
    });
    */
  } catch (error) {
    console.log(error);
  }
}
