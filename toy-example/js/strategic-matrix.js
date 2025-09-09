function createStrategicMatrix() {
    const container = d3.select("#strategic-matrix");
    const margin = { top: 50, right: 150, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Clear any existing content
    container.selectAll("*").remove();
    
    // Create SVG
    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Create legend
    createStrategicLegend(svg, width, margin);
    
    // Initialize with all projects
    updateStrategicMatrix("all");
}

function updateStrategicMatrix(statusFilter) {
    const container = d3.select("#strategic-matrix svg g");
    const width = 800 - 230; // Account for margins and legend
    const height = 500 - 130;
    
    // Filter data based on status
    let filteredData = strategicData;
    if (statusFilter !== "all") {
        filteredData = strategicData.filter(d => d.status === statusFilter);
    }
    
    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(strategicData, d => d.strategic_score_avg))
        .range([0, width])
        .nice();
    
    const yScale = d3.scaleLinear()
        .domain(d3.extent(strategicData, d => d.risk_score))
        .range([height, 0])
        .nice();
    
    const sizeScale = d3.scaleSqrt()
        .domain(d3.extent(strategicData, d => d.budget_allocated))
        .range([8, 40]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
        .ticks(8)
        .tickFormat(d => d.toFixed(1));
    
    const yAxis = d3.axisLeft(yScale)
        .ticks(6)
        .tickFormat(d => d.toFixed(1));
    
    // Remove existing axes
    container.selectAll(".axis").remove();
    
    // Add X axis
    container.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    // Add Y axis
    container.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);
    
    // Add axis labels
    container.selectAll(".axis-label").remove();
    
    container.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2}, ${height + 50})`)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Strategic Score");
    
    container.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Risk Score");
    
    // Add quadrant lines
    container.selectAll(".quadrant-line").remove();
    
    const midX = xScale((xScale.domain()[0] + xScale.domain()[1]) / 2);
    const midY = yScale((yScale.domain()[0] + yScale.domain()[1]) / 2);
    
    container.append("line")
        .attr("class", "quadrant-line")
        .attr("x1", midX)
        .attr("x2", midX)
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#ddd")
        .style("stroke-dasharray", "5,5");
    
    container.append("line")
        .attr("class", "quadrant-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", midY)
        .attr("y2", midY)
        .style("stroke", "#ddd")
        .style("stroke-dasharray", "5,5");
    
    // Add quadrant labels
    container.selectAll(".quadrant-label").remove();
    
    const quadrantLabels = [
        { text: "High Strategic Value\nLow Risk", x: width * 0.75, y: height * 0.25 },
        { text: "High Strategic Value\nHigh Risk", x: width * 0.75, y: height * 0.75 },
        { text: "Low Strategic Value\nLow Risk", x: width * 0.25, y: height * 0.25 },
        { text: "Low Strategic Value\nHigh Risk", x: width * 0.25, y: height * 0.75 }
    ];
    
    quadrantLabels.forEach(label => {
        container.append("text")
            .attr("class", "quadrant-label")
            .attr("x", label.x)
            .attr("y", label.y)
            .style("text-anchor", "middle")
            .style("font-size", "11px")
            .style("fill", "#999")
            .style("font-style", "italic")
            .selectAll("tspan")
            .data(label.text.split("\n"))
            .enter()
            .append("tspan")
            .attr("x", label.x)
            .attr("dy", (d, i) => i === 0 ? 0 : "1.2em")
            .text(d => d);
    });
    
    // Update bubbles
    const bubbles = container.selectAll(".bubble-group")
        .data(filteredData, d => d.project_id);
    
    bubbles.exit().remove();
    
    const bubblesEnter = bubbles.enter()
        .append("g")
        .attr("class", "bubble-group");
    
    // Add circles to new bubbles
    bubblesEnter.append("circle")
        .attr("class", "bubble");
    
    // Add labels to new bubbles
    bubblesEnter.append("text")
        .attr("class", "bubble-label");
    
    const bubblesUpdate = bubblesEnter.merge(bubbles);
    
    // Update circles
    bubblesUpdate.select(".bubble")
        .transition()
        .duration(750)
        .attr("cx", d => xScale(d.strategic_score_avg))
        .attr("cy", d => yScale(d.risk_score))
        .attr("r", d => sizeScale(d.budget_allocated))
        .attr("fill", d => statusColors[d.status] || "#95a5a6")
        .attr("opacity", 0.7);
    
    // Add interactivity to circles
    bubblesUpdate.select(".bubble")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 1)
                .attr("stroke", "#2c3e50")
                .attr("stroke-width", 3);
            
            const content = `
                <strong>${d.name}</strong><br/>
                Status: ${d.status}<br/>
                Budget: ${formatCurrency(d.budget_allocated)}<br/>
                Strategic Score: ${d.strategic_score_avg.toFixed(1)}<br/>
                Risk Score: ${d.risk_score}<br/>
                Completion: ${d.completion_percentage}%<br/>
                Theme: ${d.portfolio_theme}
            `;
            showTooltip(content, event);
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 0.7)
                .attr("stroke", "#fff")
                .attr("stroke-width", 2);
            
            hideTooltip();
        });
    
    // Update labels
    bubblesUpdate.select(".bubble-label")
        .transition()
        .duration(750)
        .attr("x", d => xScale(d.strategic_score_avg))
        .attr("y", d => yScale(d.risk_score) + sizeScale(d.budget_allocated) + 15)
        .text(d => d.name.length > 12 ? d.name.substring(0, 12) + "..." : d.name)
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("fill", "#2c3e50");
}

function createStrategicLegend(svg, width, margin) {
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + margin.left - 120}, ${margin.top})`);
    
    // Status legend
    legend.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text("Project Status")
        .style("font-weight", "bold")
        .style("font-size", "12px");
    
    const statusEntries = Object.entries(statusColors);
    const statusLegend = legend.selectAll(".status-legend")
        .data(statusEntries)
        .enter()
        .append("g")
        .attr("class", "status-legend")
        .attr("transform", (d, i) => `translate(0, ${20 + i * 25})`);
    
    statusLegend.append("circle")
        .attr("r", 8)
        .attr("fill", d => d[1])
        .attr("opacity", 0.7);
    
    statusLegend.append("text")
        .attr("x", 15)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .text(d => d[0])
        .style("font-size", "11px");
    
    // Size legend
    legend.append("text")
        .attr("x", 0)
        .attr("y", 120)
        .text("Budget Size")
        .style("font-weight", "bold")
        .style("font-size", "12px");
    
    const budgetExtent = d3.extent(strategicData, d => d.budget_allocated);
    const sizeScale = d3.scaleSqrt()
        .domain(budgetExtent)
        .range([8, 40]);
    
    const sizeLegendData = [
        { value: budgetExtent[0], label: formatCurrency(budgetExtent[0]) },
        { value: (budgetExtent[0] + budgetExtent[1]) / 2, label: formatCurrency((budgetExtent[0] + budgetExtent[1]) / 2) },
        { value: budgetExtent[1], label: formatCurrency(budgetExtent[1]) }
    ];
    
    const sizeLegend = legend.selectAll(".size-legend")
        .data(sizeLegendData)
        .enter()
        .append("g")
        .attr("class", "size-legend")
        .attr("transform", (d, i) => `translate(0, ${140 + i * 30})`);
    
    sizeLegend.append("circle")
        .attr("r", d => sizeScale(d.value))
        .attr("fill", "#3498db")
        .attr("opacity", 0.7);
    
    sizeLegend.append("text")
        .attr("x", 45)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .text(d => d.label)
        .style("font-size", "10px");
}
