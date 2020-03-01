import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage:image_url?", async ( req, res ) => {
    //console.log("query image url is: " + (req.query).toString() + "hi");
    //console.log("query image url is: " + JSON.stringify(req.query));

    let imgUrl = req.query.image_url;

    const VALID_URL_REG_EX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;

    //check imgUrl is not empty
    if(!imgUrl) {
      console.log("URL is empty");
      return res.status(400)
                .send('image url is required');
    }
    else
    {
      // validate imgUrl
      // compare it against our regex to see if its a valid url
      if(VALID_URL_REG_EX.exec(imgUrl))
      {
        // some logging
        console.log("Looks like a valid URI");
        
        const x = await filterImageFromURL(imgUrl);

        /*return res.status(201).sendFile(x, async (err) =>{
          console.log(x);
          console.log("i should clean up files here");
          let fileArr = [];
          fileArr.push(x);
          await sleep(3000);
          deleteLocalFiles(fileArr);
      });*/
        return res.status(201).sendFile(x, async (err) => cleanUp(err, x));
        // return res.status(200)
        //         .send("@TODO");
      }
      else
      {
        console.log('Not a URI');
        return res.status(400).send("not a valid url");
      }
    }
  });

  // wrapper function so we can put stuff logging or additional 
  // stuff in here before calling the deleteLocalFiles function
  async function cleanUp(err: Error, file: string) {
    console.log(file);
    let fileArr = [];
    fileArr.push(file);
    await sleep(3000);
    deleteLocalFiles(fileArr);
  }

  /*#START# COMMENT ME OUT */
  // extra function to sleep so I can see
  // the temp file be created in the .tmp folder
  // then see the deleteLocalFiles command working and
  // deleting the temp created files
  async function sleep(ms: number){
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  /*#END# COMMENT ME OUT */


  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();