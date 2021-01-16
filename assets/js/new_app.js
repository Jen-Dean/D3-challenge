// SVG wrapper width and height
var svgWidth = 1100;
var svgHeight = 660;

// set margins
var margin = {
    top: 60,
    right: 40,
    bottom: 100,
    left: 100
};

// set height and width of chart
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create an SVG wrapper, append an SVG group that will hold our chart,
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
var xLabel = "Poverty";
var yLabel = "Healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scale
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * .95,
      d3.max(censusData, d => d[chosenXAxis] * 1.05)
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scale
  yLinearScale = d3.scaleLinear()
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * .8,
      d3.max(censusData, d => d[chosenYAxis] * 1.05)
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating state group circles with a transition to new circles
function renderCircles(stateCirclesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  stateCirclesGroup.transition()
    .duration(1000)
    .attr("transform", function(d, i) {
      //console.log(`State: ${i} ${d.state}`);
      //console.log(`translate(${newXScale(d[chosenXAxis])},${newYScale(d[chosenYAxis])})`);
      return `translate(${newXScale(d[chosenXAxis])},${newYScale(d[chosenYAxis])})`;
    })

  return stateCirclesGroup;
}

// function used for updating state group circles  with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, stateCirclesGroup) {

  var xLabel;
  var yLabel;
  var xType;
  var yType;

  // update xLabel and xType based on chosenXAxis
  switch(chosenXAxis) {
    case "income":
      xLabel = "Median Income: $";
      xType = "";
      break;
    case "age":
      xLabel = "Median Age: ";
      xType = "";
      break;
    default:
      xLabel = "Poverty: ";
      xType = "%";
  };

  // update yLabel and yType based on chosenYAxis
  switch(chosenYAxis) {
    case "obesity":
      yLabel = "Obesity: ";
      yType = "%";
      break;
    case "smokes":
      yLabel = "Smokes: ";
      yType = "%";
      break;
    default:
      yLabel = "Healthcare: ";
      yType = "%";
  };

  // find the max size for label
  var labelSize = Math.max(xLabel.length, yLabel.length);
  
  // Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([45, -(labelSize * 6)]) // use label size to set the offset at the right position
    .html("")
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>${xLabel}${d[chosenXAxis]}${xType}<br>${yLabel}${d[chosenYAxis]}${yType}`);
    });

  // Create tooltip in the chart
  stateCirclesGroup.call(toolTip);

  // event listeners to display and hide the tooltip
  stateCirclesGroup
    .on('mouseover', function(d){
      // raise the state circle to the front on mouseover
      d3.select(this).raise(); 
      toolTip.show(d, this);
    })
    .on('mouseout', toolTip.hide);

  return stateCirclesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData) {
  
  console.log(`Initial census Data ${censusData}`);

  // Parse Data/Cast as numbers
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });

  // Create scale functions
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  console.log([censusData]);

  // Create element group for both circle and text
  var stateCirclesGroup = chartGroup.selectAll(null)
    .data(censusData)
    .enter()
    .append("g")
    //.attr("transform", d => `translate(${xLinearScale(d[chosenXAxis])},${yLinearScale(d[chosenYAxis])})`);
    .attr("transform", function(d, i) {
      console.log(`State: ${i} ${d.state}`);
      //console.log(`translate(${xLinearScale(d[chosenXAxis])},${yLinearScale(d[chosenYAxis])})`);
      return `translate(${xLinearScale(d[chosenXAxis])},${yLinearScale(d[chosenYAxis])})`;
    });

  // Create Circles
  stateCirclesGroup.append("circle")
    .classed("stateCircle", true)
    .attr("r", "15");

  // Add State abbreviations to circles
  stateCirclesGroup.append("text")
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', '15px')
    .attr("class", "stateText")
    .text(d => d.abbr);

  // Add Title to chart
  var titleText = chartGroup.append("g")
    .classed("tText", true);
  titleText.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .text(`${chosenXAxis} vs ${chosenYAxis}`);

  // Create group for three x-axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .classed("aText", true);
  
  // poverty on x-axis
  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  // age on x-axis
  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");
  
  // income on x-axis
  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for three y-axis labels
  var yLabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)")
  .classed("aText", true);
  
  // healthcare on y-axis
  var healthcareLabel = yLabelsGroup.append("text")
    .attr("y", 0 - margin.left + 70)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  // amokes on y-axis
  var smokesLabel = yLabelsGroup.append("text")
    .attr("y", 0 - margin.left + 50)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");
  
  // obesity on y-axis
  var obesityLabel = yLabelsGroup.append("text")
    .attr("y", 0 - margin.left + 30)
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

  // updateToolTip
  var stateCirclesGroup = updateToolTip(chosenXAxis, chosenYAxis, stateCirclesGroup);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x,y values
        stateCirclesGroup = renderCircles(stateCirclesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        stateCirclesGroup = updateToolTip(chosenXAxis, chosenYAxis, stateCirclesGroup);

        // changes classes to change bold text
        switch(chosenXAxis) {
          case "income":
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          case "age":
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          default:
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
        };
        // Add Title to chart
        titleText.html("")
          .append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .text(`${chosenXAxis} vs ${chosenYAxis}`);
      }
    });

  // y axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxis(yLinearScale, yAxis);

        // updates circles with new x,y values
        stateCirclesGroup = renderCircles(stateCirclesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        stateCirclesGroup = updateToolTip(chosenXAxis, chosenYAxis, stateCirclesGroup);

        // changes classes to change bold text
        switch(chosenYAxis) {
          case "obesity":
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          case "smokes":
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            break;
          default:
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
        };
        // Add Title to chart
        titleText.html("")
          .append("text")
          .attr("x", (width / 2))
          .attr("y", 0 - (margin.top / 2))
          .text(`${chosenXAxis} vs ${chosenYAxis}`);
      }
    });
  
}).catch(function(error) {
  console.log(error);
});