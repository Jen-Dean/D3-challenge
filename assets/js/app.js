// SVG container size

var svgWidth = 1100;
var svgHeight = 660;

var margin = {
    top: 60,
    right: 40,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG variable
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .classed("chart", true);

// SVG Group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Chart
var selectXAxis = "poverty";
var selectYAxis = "obesity";
var xtipLabel = "Poverty";
var ytipLabel = "Obesity";

// Function that creates the X Axis Scaling
function xScale(stateData, selectXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[selectXAxis] * 0.9) , 
        d3.max(stateData, d => d[selectXAxis] * 1.09) ])
        .range([0, width]);
    return xLinearScale;
}

// Function that creates the Y Axis Scaling
function yScale(stateData, selectYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[selectYAxis] * 0.9), 
        d3.max(stateData, d => d[selectYAxis] * 1.09)])
        .range([height, 0]);
    return yLinearScale;
}

// Update & Render the xAxis when you click on a different label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// Update & Render the Y Axis when you click on a different label
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// Create New Plot points based on the axis that you chose
function renderPoints(circleGroup, newXScale, newYScale, selectXAxis, selectYAxis) {

    circleGroup.transition()
        .duration(1000)
        .attr("transform", function(d, i) {
            return `translate(${newXScale(d[selectXAxis])},${newYScale(d[selectYAxis])})`;
          })
    return circleGroup;
}

// New Tooltip updates with new selections

function updateToolTip(selectXAxis, selectYAxis, circleGroup) {

    var xtipLabel;
    var ytipLabel;

    if (selectXAxis === "poverty") {
        xtipLabel = "Median Poverty Level:";
    } else if (selectXAxis === "obesity") {
        xtipLabel = "Median Obesity Level:";
    } else if (selectXAxis === "age") {
        xtipLabel = "Median Age:";
    } else if (selectXAxis === "income") {
        xtipLabel = "Median Income:";
    } else if (selectXAxis === "healthcare") {
        xtipLabel = "Median Healthcare:";
    } else if (selectXAxis === "smoking") {
        xtipLabel = "Median Smoking:";
    }

    if (selectYAxis === "poverty") {
        ytipLabel = "Median Poverty Level:";
    } else if (selectYAxis === "obesity") {
        ytipLabel = "Median Obesity Level:";
    } else if (selectYAxis === "age") {
        ytipLabel = "Median Age:";
    } else if (selectYAxis === "income") {
        ytipLabel = "Median Income:";
    } else if (selectYAxis === "healthcare") {
        ytipLabel = "Median Healthcare:";
    } else if (selectYAxis === "smoking") {
        ytipLabel = "Median Smoking:";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, 0])
        .html("")
        .html(function (d) {
            return (`<strong>${d.state}</strong><br>${xtipLabel} ${d[selectXAxis]}<br>${ytipLabel} ${d[selectYAxis]}`);
        });

    circleGroup.call(toolTip);

    circleGroup.on("mouseover", function (d) {
        d3.select(this).raise();
        toolTip.show(d, this);
    });

    circleGroup.on("mouseout", function (d) {
        toolTip.hide(d)
    })

    return circleGroup;
}
// CSV file & Dataretrieval using d3

d3.csv("assets/data/data.csv").then(function (stateData, err) {
    if (err) throw err;

    stateData.forEach(function (stateData) {
        stateData.poverty = +stateData.poverty;
        stateData.age = +stateData.age;
        stateData.income = +stateData.income;
        stateData.healthcare = +stateData.healthcare;
        stateData.obesity = +stateData.obesity;
        stateData.smokes = +stateData.smokes;
    });

    xLinearScale = xScale(stateData, selectXAxis);
    yLinearScale = yScale(stateData, selectYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis)
        .classed("y-axis", true);

    // CREATE CIRCLE GROUP
    var circleGroup = chartGroup
        .selectAll(null)
        .data(stateData)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return `translate(${xLinearScale(d[selectXAxis])},${yLinearScale(d[selectYAxis])})`
        });
    circleGroup
        .append("circle") // Appending little circles
        .attr("r", 15)
        .classed("stateCircle", true);
    
    // CREATE GROUP FOR STATE LABELS
    circleGroup.append("text")
        .attr("alignment-baseline", "middle")
        .text(function (d) {
            return d.abbr
        })
        .classed("stateText", true)

// CREATE TITLE FOR CHART
var chartTitle = chartGroup.append("g")
    .classed("titleText", true);
chartTitle.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .text(`${selectYAxis} vs ${selectXAxis}`);

// CREATE GROUP for X LABELS ////////////////////////////
var xAxisLabels = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

var povertyLabel = xAxisLabels.append("text")
    .attr("x", -200)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("State Poverty Level");

var obesityLabel = xAxisLabels.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("State Obesity Level");

var ageLabel = xAxisLabels.append("text")
    .attr("x", 150)
    .attr("y", 20)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Person Age");

var incomeLabel = xAxisLabels.append("text")
    .attr("x", -200)
    .attr("y", 40)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Income Level");

var healthcareLabel = xAxisLabels.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "healthcare")
    .classed("inactive", true)
    .text("Healthcare");

// var smokesLabel = xAxisLabels.append("text")
//     .attr("x", 100)
//     .attr("y", 40)
//     .attr("value", "smoking")
//     .classed("inactive", true)
//     .text("Smoking");

// CREATE GROUP for y LABELS ////////////////////////////
var yAxisLabels = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

var ypovertyLabel = yAxisLabels.append("text")
    .attr("x", -400)
    .attr("y", -75)
    .attr("value", "poverty")
    .classed("inactive", true)
    .text("State Poverty Level");

var yobesityLabel = yAxisLabels.append("text")
    .attr("x", -225)
    .attr("y", -75)
    .attr("value", "obesity")
    .classed("active", true)
    .text("State Obesity Level");

var yageLabel = yAxisLabels.append("text")
    .attr("x", -60)
    .attr("y", -75)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Person Age");

var yincomeLabel = yAxisLabels.append("text")
    .attr("x", -400)
    .attr("y", -50)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Income Level");

var yhealthcareLabel = yAxisLabels.append("text")
    .attr("x", -225)
    .attr("y", -50)
    .attr("value", "healthcare")
    .classed("inactive", true)
    .text("Healthcare");

// var ysmokesLabel = yAxisLabels.append("text")
//     .attr("x", -60)
//     .attr("y", -50)
//     .attr("value", "smoking")
//     .classed("inactive", true)
//     .text("Smoking");

// UPDATE THE CIRLCLE TOOL TIPS

circleGroup = updateToolTip(selectXAxis, selectYAxis, circleGroup);

xAxisLabels.selectAll("text")
    .on("click", function () {
        var value = d3.select(this).attr("value");
        if (value !== selectXAxis) {

            selectXAxis = value;

            xLinearScale = xScale(stateData, selectXAxis);

            xAxis = renderXAxis(xLinearScale, xAxis);

            circleGroup = renderPoints(circleGroup, xLinearScale, yLinearScale, selectXAxis, selectYAxis);

            circleGroup = updateToolTip(selectXAxis, selectYAxis, circleGroup); // This is the same as the variable above???

            // Reset the "Active and Inactive states" to the correct class
            povertyLabel.classed("inactive", true);
            obesityLabel.classed("inactive", true);
            ageLabel.classed("inactive", true);
            incomeLabel.classed("inactive", true);
            healthcareLabel.classed("inactive", true);
            // smokesLabel.classed("inactive", true);

            if (selectXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
            } else if (selectXAxis === "obesity") {
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
            } else if (selectXAxis === "age") {
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
            } else if (selectXAxis === "income") {
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            } else if (selectXAxis === "healthcare") {
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
            } else {
                // smokesLabel
                //     .classed("active", true)
                //     .classed("inactive", false);
            };
            chartTitle.html("")
                .append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .text(`${selectYAxis} vs ${selectXAxis}`)
                .classed("titleText", true);;
        }
    });

yAxisLabels.selectAll("text")
.on("click", function () {
    var value = d3.select(this).attr("value");
    if (value !== selectYAxis) {

        selectYAxis = value;

        yLinearScale = yScale(stateData, selectYAxis);

        yAxis = renderYAxis(yLinearScale, yAxis);

        circleGroup = renderPoints(circleGroup, xLinearScale, yLinearScale, selectXAxis, selectYAxis);

        circleGroup = updateToolTip(selectXAxis, selectYAxis, circleGroup); // This is the same as the variable above???

        // Reset the "Active and Inactive states" to the correct class
            ypovertyLabel.classed("inactive", true);
            yobesityLabel.classed("inactive", true);
            yageLabel.classed("inactive", true);
            yincomeLabel.classed("inactive", true);
            yhealthcareLabel.classed("inactive", true);
            // ysmokesLabel.classed("inactive", true);

        if (selectYAxis === "poverty") {
            ypovertyLabel
                .classed("active", true)
                .classed("inactive", false);
        } else if (selectYAxis === "obesity") {
            yobesityLabel
                .classed("active", true)
                .classed("inactive", false);
        } else if (selectYAxis === "age") {
            yageLabel
                .classed("active", true)
                .classed("inactive", false);
        } else if (selectYAxis === "income") {
            yincomeLabel
                .classed("active", true)
                .classed("inactive", false);
        } else if (selectYAxis === "healthcare") {
            yhealthcareLabel
                .classed("active", true)
                .classed("inactive", false);
        } else {
            // ysmokesLabel
            //     .classed("active", true)
            //     .classed("inactive", false);
        }
        chartTitle.html("")
                .append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .text(`${selectYAxis} vs ${selectXAxis}`)
                .classed("titleText", true);
    }
});

}).catch (function (error) {
    console.log(error);
});