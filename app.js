document.addEventListener("DOMContentLoaded", function() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";


  //get data
  d3.queue()
    .defer(d3.json, url)
    .await((error, response) => {
      //setup data
      let data = response;
      
    });
});