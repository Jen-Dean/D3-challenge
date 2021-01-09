// Data options:
// state
// abbr
// poverty,
// age,
// income,
// healthcare,healthcareLow,healthcareHigh,
// obesity,obesityLow,obesityHigh,
// smokes,smokesLow,smokesHigh



// SVG container size

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG variable

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// SVG Group

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Chart

var selectXAxis = "poverty"
var selectYAxis = "obesity"

