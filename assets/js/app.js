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

var scatterGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Chart
var selectXAxis = "poverty";
var selectYAxis = "obesity";

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

    var xtipLabel;

    if (selectXAxis === "poverty") {
        xtipLabel = "Poverty Level:";
    } else if (selectXAxis === "obesity") {
        xtipLabel = "Obesity Level:";
    } else if (selectXAxis === "age") {
        xtipLabel = "Age:";
    } else if (selectXAxis === "income") {
        xtipLabel = "Income:";
    } else if (selectXAxis === "healthcare") {
        xtipLabel = "Healthcare:";
    } else if (selectXAxis === "smokes") {
        xtipLabel = "Smoking:";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0, 0])
        .html(function (d) {
            return (`${d.state}<br>${tipLabel} ${d[selectXAxis]}`);
        });

    pointsGroup.call(toolTip);

    pointsGroup.on("mouseover", function (d) {
        toolTip.show(d);
    });

    pointsGroup.on("mouseout", function (d) {
        toolTip.hide(d)
    })

    return pointsGroup;
}
// CSV file & Dataretrieval using d3

d3.csv("assets/data/data.csv").then(function (stateData, err) {
    if (err) throw err;

    stateData.forEach(function (d) {
        stateData.poverty = +stateData.poverty;
        stateData.age = +stateData.age;
        stateData.income = +stateData.income;
        stateData.healthcare = +stateData.healthcare;
        stateData.obesity = +stateData.obesity;
        stateData.smokes = +stateData.smokes;
    });

    var xLinearScale = xScale(stateData, "poverty");
    var yLinearScale = yScale(stateData, "obesity");

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = scatterGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    scatterGroup.append("g")
        .call(leftAxis);

    var pointsGroup = scatterGroup.selectAll("points")
        .data(stateData)
        .enter()
        .append("points")
        .attr("cx", d => xLinearScale(d[selectXAxis]))
        .attr("cy", d => yLinearScale(d[selectYAxis]))
        .attr("r", 25)
        .classed("stateCircle", true)

    // CREATE GROUP FOR STATE LABELS

    var abbrLabels = scatterGroup.selectAll(null)
        .data(stateData)
        .enter()
        .append("text");
    
    abbrLabels
        .attr("x", function (d) {
            return xLinearScale(d.poverty)
        })
        .attr("y", function (d) {
            return yLinearScale(d[selectYAxis])
        })
        .text(function (d) {
            return d.abbr
        })
        .classed("stateText", true)

    // CREATE GROUP FOR ALL X-AXIS LABELS

    var stateLabelsGroup = scatterGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = stateLabelsGroup.append("text")
        .attr("x", -200)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("State Poverty Level");

    var obesityLabel = stateLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("State Obesity Level");

    var ageLabel = stateLabelsGroup.append("text")
        .attr("x", 150)
        .attr("y", 20)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Person Age");

    var incomeLabel = stateLabelsGroup.append("text")
        .attr("x", -200)
        .attr("y", 40)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Income Level");

    var healthcareLabel = stateLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Healthcare");

    var smokesLabel = stateLabelsGroup.append("text")
        .attr("x", 100)
        .attr("y", 40)
        .attr("value", "snokes")
        .classed("inactive", true)
        .text("Smoking");


    // APENDING THE Y AXIS

    scatterGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("aText", true)
        .text("Obesity????");

    var pointsGroup = updateToolTip(selectXAxis, pointsGroup);

    stateLabelsGroup.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value");
            if (value !== selectXAxis) {

                selectXAxis = value;

                xLinearScale = xScale(stateData, selectXAxis);

                xAxis = renderAxis(xLinearScale, xAxis);

                pointsGroup = renderPoints(pointsGroup, xLinearScale, selectXAxis);

                pointsGroup = updateToolTip(selectXAxis, pointsGroup); // This is the same as the variable above???

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
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function (error) {
    console.log(error);
});