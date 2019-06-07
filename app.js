document.addEventListener("DOMContentLoaded", function() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
  const title = "Doping in Professional Bicycle Racing";
  const width = 1000;
  const height = 600;
  const margin = { top: 20, left: 60, bottom: 20, right: 0 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  //get data
  d3.queue()
    .defer(d3.json, url)
    .await((error, response) => {
      //setup data
      let data = response;
      
      //set up svg
      let svg = d3.select("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .classed("svg", true);

      //set up chart title
      d3.select("#title")
          .classed("title", true)
          .text(title);

      //set up scales
      let xScale = d3.scaleTime()
                     .domain(d3.extent(data, d => new Date(d.Year)))
                     .range([margin.left, innerWidth]);

      let specifier  = "%M:%S";
      // let parsedData = data.map((d) => d3.timeParse(specifier)(d.Time));

      let yScale = d3.scaleTime()
                     .domain(d3.extent(data, d => d3.timeParse(specifier)(d.Time)))
                     .range([margin.top, innerHeight]);
      
      //set up axis
      let xAxis = d3.axisBottom(xScale)                    
                    // .ticks(d3.timeYears(new Date("1994"), 2))

      let yAxis = d3.axisLeft(yScale)
                    // .tickValue()
                    .ticks(d3.timeSecond.every(10))

      svg.append("g")
           .attr("id", "x-axis")
         .call(xAxis)
           .attr("transform", `translate(0,${innerHeight})`)
         .selectAll("text")

      svg.append("g")
           .attr("id", "y-axis")
         .call(yAxis)
           .attr("transform", `translate(${margin.left},0)`)

      //draw circles
      svg.selectAll(".circle")
         .data(data)
         .enter()
         .append("circle")
           .attr("cx", d => xScale(new Date(d.Year)))
           .attr("cy", d => yScale(d3.timeParse(specifier)(d.Time)))
           .attr("fill", d => (d.Doping === "") ? "rgb(255, 127, 14)" : "rgb(31, 119, 180)")
           .attr("r", 6)
           .attr("stroke", "black");

      //add legend
      svg
         .append("rect")
         .attr("x", width-100)
         .attr("y", height/4)
         .attr("width", 15)
         .attr("height", 15)
         .style("fill", "rgb(255, 127, 14)")
      
      svg
         .append("text")
         .attr("x", width-215)
         .attr("y", height/4+11)
         .text("No doping allegations")
         .style("font", "10px sans-serif")

      svg
         .append("rect")
         .attr("x", width-100)
         .attr("y", height/4 + 25)
         .attr("width", 15)
         .attr("height", 15)
         .style("fill", "rgb(31, 119, 180)")

      svg
         .append("text")
         .attr("x", width-250)
         .attr("y", height/4+36)
         .text("Riders with doping allegations")
         .style("font", "10px sans-serif")

    });
});