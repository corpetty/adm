function createResourceMatrix() {
    const container = d3.select("#resource-matrix");
    const margin = { top: 80, right: 50, bottom: 100, left: 200 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;
    
    // Clear any existing content
    container.selectAll("*").remove();
    
    // Create SVG
    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Get data
    const projects = resourceMatrixData.projects;
    const resources = resourceMatrixData.resources;
    const matrix = resourceMatrixData.matrix;
    
    // Create scales
    const xScale = d3.scaleBand()
        .domain(resources)
        .range([0, width])
        .padding(0.05);
    
    const yScale = d3.scaleBand()
        .domain(projects)
        .range([0, height])
        .padding(0.05);
    
    // Find max value for color scale
    const maxValue = d3.max(matrix.flat());
    
    const colorScale = d3.scaleSequential()
        .domain([0, maxValue])
        .interpolator(d3.interpolateBlues);
    
    // Create matrix cells
    const cells = g.selectAll(".matrix-cell")
        .data(matrix.flatMap((row, i) => 
            row.map((value, j) => ({
                project: projects[i],
                resource: resources[j],
                value: value,
                x: j,
                y: i
            }))
        ))
        .enter()
        .append("rect")
        .attr("class", "matrix-cell")
        .attr("x", d => xScale(d.resource))
        .attr("y", d => yScale(d.project))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => d.value === 0 ? "#f8f9fa" : colorScale(d.value))
        .on("mouseover", function(event, d) {
            const content = `
                <strong>Resource Allocation</strong><br/>
                Project: ${d.project}<br/>
                Resource: ${d.resource}<br/>
                Amount: ${d.value > 1000 ? formatCurrency(d.value) : d.value}
            `;
            showTooltip(content, event);
            
            // Highlight row and column
            d3.selectAll(".matrix-cell")
                .style("opacity", 0.3);
            d3.selectAll(".matrix-cell")
                .filter(cell => cell.project === d.project || cell.resource === d.resource)
                .style("opacity", 1);
        })
        .on("mouseout", function() {
            hideTooltip();
            d3.selectAll(".matrix-cell")
                .style("opacity", 1);
        });
    
    // Add value labels for non-zero cells
    g.selectAll(".cell-label")
        .data(matrix.flatMap((row, i) => 
            row.map((value, j) => ({
                project: projects[i],
                resource: resources[j],
                value: value,
                x: j,
                y: i
            })).filter(d => d.value > 0)
        ))
        .enter()
        .append("text")
        .attr("class", "cell-label")
        .attr("x", d => xScale(d.resource) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.project) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("fill", d => d.value > maxValue * 0.6 ? "white" : "black")
        .style("pointer-events", "none")
        .text(d => d.value > 1000 ? `$${Math.round(d.value / 1000)}K` : d.value);
    
    // Add X axis (resources)
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .selectAll(".x-label")
        .data(resources)
        .enter()
        .append("text")
        .attr("class", "x-label")
        .attr("x", d => xScale(d) + xScale.bandwidth() / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .text(d => d.length > 15 ? d.substring(0, 15) + "..." : d)
        .each(function(d) {
            // Rotate long labels
            if (d.length > 10) {
                d3.select(this)
                    .attr("transform", `rotate(-45, ${xScale(d) + xScale.bandwidth() / 2}, 15)`)
                    .attr("text-anchor", "end");
            }
        });
    
    // Add Y axis (projects)
    g.selectAll(".y-label")
        .data(projects)
        .enter()
        .append("text")
        .attr("class", "y-label")
        .attr("x", -10)
        .attr("y", d => yScale(d) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .text(d => d);
    
    // Add axis titles
    svg.append("text")
        .attr("class", "axis-title")
        .attr("x", margin.left + width / 2)
        .attr("y", height + margin.top + margin.bottom - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Resources");
    
    svg.append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("x", -(margin.top + height / 2))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Projects");
    
    // Add color legend
    createResourceMatrixLegend(svg, colorScale, maxValue, width, margin);
}

function createResourceMatrixLegend(svg, colorScale, maxValue, width, margin) {
    const legendWidth = 200;
    const legendHeight = 15;
    
    const legend = svg.append("g")
        .attr("class", "color-legend")
        .attr("transform", `translate(${margin.left + width - legendWidth}, ${margin.top - 50})`);
    
    // Create gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "matrix-gradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");
    
    // Add gradient stops
    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
        const value = (i / numStops) * maxValue;
        gradient.append("stop")
            .attr("offset", `${(i / numStops) * 100}%`)
            .attr("stop-color", colorScale(value));
    }
    
    // Add legend rectangle
    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#matrix-gradient)")
        .style("stroke", "#ccc");
    
    // Add legend scale
    const legendScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, legendWidth]);
    
    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d => d > 1000 ? `$${Math.round(d / 1000)}K` : d);
    
    legend.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis)
        .style("font-size", "10px");
    
    // Add legend title
    legend.append("text")
        .attr("x", legendWidth / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Allocation Amount");
}
