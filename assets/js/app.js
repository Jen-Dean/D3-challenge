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

function xScale(stateData, selectXAxis) {
    
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[selectXAxis]),
            d3.max(stateData, d => d[selectXAxis]) // * something???
        ])
        .range([0, width]);

    return xLinearScale;
}

function yScale(stateData, selectYAxis) {
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[selectYAxis]),
            d3.max(stateData, d => d[selectYAxis]) // * something???
        ])
        .range([height, 0]);

    return yLinearScale;
}

// Update the xAxis when you click on a different label
function renderAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBttom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}
// Create New Plot points based on the axis that you chose
function renderPoints(pointsGroup, newXScale, selectXAxis) {

    pointsGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[selectXAxis]));
    return pointsGroup;
}

// New Tooltip updates with new selections

function updateToolTip(selectXAxis, pointsGroup) {

    var tipLabel;

    if (selectXAxis === "poverty") {
        tipLabel = "Poverty Level:";
    } else if (selectXAxis === "obesity") {
        tipLabel = "Obesity Level:";
    } else if (selectXAxis === "age") {
        tipLabel = "Age:";
    } else if (selectXAxis === "income") {
        tipLabel = "Income:";
    } else if (selectXAxis === "healthcare") {
        tipLabel = "Healthcare:";
    } else if (selectXAxis === "smokes") {
        tipLabel = "Smoking:";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0,0])
        .html(function(d) {
            return (`${d.state}<br>${tipLabel} ${d[selectXAxis]}`);
        });

    pointsGroup.call(toolTip);

    pointsGroup.on("mouseover", function(d) {
        toolTip.show(d);
    });

    pointsGroup.on("mouseout", function(d) {
        toolTip.hide(d)
    })

    return pointsGroup;
}
// CSV file & Dataretrieval using d3

d3.csv("data.csv").then(function(stateData, err) {
    if (err) throw err;

    stateData.forEach(function(d) {
        stateData.poverty = +stateData.poverty;
        stateData.age = +stateData.age;
        stateData.income = +stateData.income;
        stateData.healthcare = +stateData.healthcare;
        stateData.obesity = +stateData.obesity;
        stateData.smokes = +stateData.smokes;
    });

    var xLinearScale = xScale(stateData, selectXAxis);

    var yLinearScale = yScale(stateData, selectYAxis);

    


















});