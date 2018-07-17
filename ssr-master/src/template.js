// html skeleton provider
function template(title, initialState = {}, content = ""){
  let scripts = ''; // Dynamically ship scripts based on render type
  if(content){
    scripts = ` <script>
                   window.__STATE__ = ${JSON.stringify(initialState)}
                </script>
                <script src="assets/client.js"></script>
                `
  } else {
    scripts = ` <script src="assets/bundle.js"> </script> `
  }
  let page = `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="utf-8">
                <title> ${title} </title>
                <link href="assets/style.css" rel="stylesheet">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">  
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
              </head>
              <body>
                <div class="content">
                   <div id="app" >
                      ${content}
                   </div>
                </div>

                  ${scripts}
              </body>
              `;

  return page;
}

module.exports = template;
