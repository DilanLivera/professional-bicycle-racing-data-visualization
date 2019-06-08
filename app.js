document.addEventListener("DOMContentLoaded", function() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
  const title = "Doping in Professional Bicycle Racing";
  const width = 1000;
  const height = 600;
  const margin = { top: 20, left: 60, bottom: 20, right: 0 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const minSecSpecifier  = "%M:%S";
  const yearSpecifier  = "%Y";
  const startYear = "1993";

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
                     .domain([d3.timeParse(yearSpecifier)(startYear),d3.max(data, d => d3.timeParse(yearSpecifier)(d.Year))])
                     .range([margin.left, innerWidth]);

      let yScale = d3.scaleTime()
                     .domain(d3.extent(data, d => d3.timeParse(minSecSpecifier)(d.Time)))
                     .range([margin.top, innerHeight]);
      
      //set up axis
      let xAxis = d3.axisBottom(xScale)
                    .ticks(d3.timeYear.every(2))

      let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat(minSecSpecifier))
                    .ticks(d3.timeSecond.every(15))

      svg.append("g")
           .attr("id", "x-axis")
         .call(xAxis)
           .attr("transform", `translate(0,${innerHeight})`)
         .selectAll("text")

      svg.append("g")
           .attr("id", "y-axis")
         .call(yAxis)
           .attr("transform", `translate(${margin.left},0)`)

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
         .style("font-size", "10px")

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
         .style("font-size", "10px")

      //draw circles
      svg.selectAll(".circle")
         .data(data)
         .enter()
         .append("circle")
           .attr("cx", d => xScale(d3.timeParse(yearSpecifier)(d.Year)))
           .attr("cy", d => yScale(d3.timeParse(minSecSpecifier)(d.Time)))
           .attr("fill", d => (d.Doping === "") ? "rgb(255, 127, 14)" : "rgb(31, 119, 180)")
           .attr("r", 6)
           .attr("stroke", "black")
           .on("mouseover", showTooltip)
           .on("touchstart", showTooltip)
           .on("mouseout", hideTooltip)    
           .on("touchend", hideTooltip);           
      
      //add tooltip
      let tooltip = d3.select("body")
                      .append("div")
                        .attr("id", "tooltip")

      function showTooltip(d) {
        let name = d.Name;
        let nationality = d.Nationality;
        let year = d.Year;
        let time = d.Time;
        let doping = d.Doping;
        
        tooltip
          .style("opacity", 1)
          .style("left", `${d3.event.x - tooltip.node().offsetWidth/2}px`)
          .style("top", `${d3.event.y + 25}px`)
          .html(`
            <p>${name}: ${nationality}</p>
            <p>Year: ${year}, Time: ${time}</p>
            <p>${doping}</p>
          `);         
      }

      function hideTooltip() {
        tooltip
          .style("opacity", 0);        
      }
    });
});