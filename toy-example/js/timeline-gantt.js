function createTimelineGantt() {
    const container = d3.select("#timeline-gantt");
    const margin = { top: 50, right: 50, bottom: 80, left: 200 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    container.selectAll("*").remove();
    
    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Get project data with dates
    const projects = strategicData.map(d => ({
        ...d,
        start_date: new Date(d.start_date || '2025-01-01'),
        end_date: new Date(d.end_date || '2025-12-31')
    }));
    
    // Create time scale
    const timeExtent = d3.extent([
        ...projects.map(d => d.start_date),
        ...projects.map(d => d.end_date)
    ]);
    
    const xScale = d3.scaleTime()
        .domain(timeExtent)
        .range([0, width]);
    
    const yScale = d3.scaleBand()
        .domain(projects.map(d => d.name))
        .range([0, height])
        .padding(0.2);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%b %Y"));
    
    const yAxis = d3.axisLeft(yScale);
    
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
    
    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
    
    // Create Gantt bars
    const bars = g.selectAll(".gantt-bar")
        .data(projects)
        .enter()
        .append("rect")
        .attr("class", "gantt-bar")
        .attr("x", d => xScale(d.start_date))
        .attr("y", d => yScale(d.name))
        .attr("width", d => xScale(d.end_date) - xScale(d.start_date))
        .attr("height", yScale.bandwidth())
        .attr("fill", d => statusColors[d.status] || "#95a5a6")
        .attr("opacity", 0.8)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("opacity", 1);
            const content = `
                <strong>${d.name}</strong><br/>
                Start: ${d.start_date.toLocaleDateString()}<br/>
                End: ${d.end_date.toLocaleDateString()}<br/>
                Duration: ${Math.ceil((d.end_date - d.start_date) / (1000 * 60 * 60 * 24))} days<br/>
                Status: ${d.status}<br/>
                Budget: ${formatCurrency(d.budget_allocated)}<br/>
                Completion: ${d.completion_percentage}%
            `;
            showTooltip(content, event);
        })
        .on("mouseout", function() {
            d3.select(this).attr("opacity", 0.8);
            hideTooltip();
        });
    
    // Add completion percentage overlay
    g.selectAll(".completion-bar")
        .data(projects)
        .enter()
        .append("rect")
        .attr("class", "completion-bar")
        .attr("x", d => xScale(d.start_date))
        .attr("y", d => yScale(d.name) + yScale.bandwidth() * 0.7)
        .attr("width", d => (xScale(d.end_date) - xScale(d.start_date)) * (d.completion_percentage / 100))
        .attr("height", yScale.bandwidth() * 0.3)
        .attr("fill", "#2ecc71")
        .attr("opacity", 0.9);
    
    // Add dependency arrows
    if (dependencyData && dependencyData.links) {
        const projectPositions = {};
        projects.forEach(p => {
            projectPositions[p.project_id] = {
                x: xScale(p.end_date),
                y: yScale(p.name) + yScale.bandwidth() / 2
            };
        });
        
        dependencyData.links.forEach(link => {
            const source = projectPositions[link.source_project_id];
            const target = projectPositions[link.target_project_id];
            
            if (source && target) {
                // Draw dependency arrow
                const line = d3.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .curve(d3.curveBundle.beta(0.5));
                
                const pathData = [
                    { x: source.x, y: source.y },
                    { x: source.x + 30, y: source.y },
                    { x: target.x - 30, y: target.y },
                    { x: target.x, y: target.y }
                ];
                
                g.append("path")
                    .datum(pathData)
                    .attr("class", "dependency-arrow")
                    .attr("d", line)
                    .attr("stroke", dependencyTypeColors[link.dependency_type] || "#999")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")
                    .attr("marker-end", "url(#arrowhead)");
            }
        });
    }
    
    // Add arrowhead marker
    svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#666");
    
    // Add axis labels
    svg.append("text")
        .attr("class", "axis-title")
        .attr("transform", `translate(${width / 2 + margin.left}, ${height + margin.top + 70})`)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Timeline");
    
    svg.append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", -(height / 2 + margin.top))
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Projects");
    
    // Add legend
    createTimelineLegend(svg, width, margin);
}

function createTimelineLegend(svg, width, margin) {
    const legend = svg.append("g")
        .attr("class", "timeline-legend")
        .attr("transform", `translate(${width + margin.left - 150}, ${margin.top})`);
    
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
        .attr("transform", (d, i) => `translate(0, ${20 + i * 20})`);
    
    statusLegend.append("rect")
        .attr("width", 15)
        .attr("height", 10)
        .attr("fill", d => d[1])
        .attr("opacity", 0.8);
    
    statusLegend.append("text")
        .attr("x", 20)
        .attr("y", 5)
        .attr("dy", "0.35em")
        .text(d => d[0])
        .style("font-size", "11px");
    
    // Completion legend
    legend.append("text")
        .attr("x", 0)
        .attr("y", 120)
        .text("Completion")
        .style("font-weight", "bold")
        .style("font-size", "12px");
    
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 140)
        .attr("width", 15)
        .attr("height", 10)
        .attr("fill", "#2ecc71")
        .attr("opacity", 0.9);
    
    legend.append("text")
        .attr("x", 20)
        .attr("y", 145)
        .attr("dy", "0.35em")
        .text("Progress")
        .style("font-size", "11px");
}
