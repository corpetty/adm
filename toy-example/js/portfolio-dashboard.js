function createPortfolioDashboard() {
    const container = d3.select("#portfolio-dashboard");
    const width = 1200;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    
    container.selectAll("*").remove();
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Create dashboard sections
    createKPICards(svg, 20, 20, 1160, 120);
    createBudgetChart(svg, 20, 160, 380, 200);
    createRiskChart(svg, 420, 160, 380, 200);
    createCompletionChart(svg, 820, 160, 360, 200);
    createResourceUtilization(svg, 20, 380, 580, 200);
    createProjectTimeline(svg, 620, 380, 560, 200);
}

function createKPICards(svg, x, y, width, height) {
    const cardWidth = width / 4 - 10;
    const cardHeight = height - 10;
    
    // Calculate KPIs from data
    const totalProjects = strategicData.length;
    const activeProjects = strategicData.filter(d => d.status === 'Active').length;
    const totalBudget = d3.sum(strategicData, d => d.budget_allocated);
    const avgCompletion = d3.mean(strategicData, d => d.completion_percentage);
    
    const kpis = [
        { label: "Total Projects", value: totalProjects, color: "#3498db" },
        { label: "Active Projects", value: activeProjects, color: "#2ecc71" },
        { label: "Total Budget", value: formatCurrency(totalBudget), color: "#e74c3c" },
        { label: "Avg Completion", value: `${avgCompletion.toFixed(1)}%`, color: "#f39c12" }
    ];
    
    const cards = svg.selectAll(".kpi-card")
        .data(kpis)
        .enter()
        .append("g")
        .attr("class", "kpi-card")
        .attr("transform", (d, i) => `translate(${x + i * (cardWidth + 10)}, ${y})`);
    
    // Card background
    cards.append("rect")
        .attr("width", cardWidth)
        .attr("height", cardHeight)
        .attr("fill", "white")
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1)
        .attr("rx", 5);
    
    // Color bar
    cards.append("rect")
        .attr("width", cardWidth)
        .attr("height", 5)
        .attr("fill", d => d.color)
        .attr("rx", 5);
    
    // Value text
    cards.append("text")
        .attr("x", cardWidth / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("fill", "#2c3e50")
        .text(d => d.value);
    
    // Label text
    cards.append("text")
        .attr("x", cardWidth / 2)
        .attr("y", 65)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#7f8c8d")
        .text(d => d.label);
}

function createBudgetChart(svg, x, y, width, height) {
    const g = svg.append("g")
        .attr("transform", `translate(${x}, ${y})`);
    
    // Title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Budget Allocation by Project");
    
    const chartHeight = height - 40;
    const chartWidth = width - 40;
    
    // Create pie chart
    const pie = d3.pie()
        .value(d => d.budget_allocated)
        .sort(null);
    
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(chartWidth, chartHeight) / 2 - 10);
    
    const pieG = g.append("g")
        .attr("transform", `translate(${chartWidth / 2 + 20}, ${chartHeight / 2 + 20})`);
    
    const arcs = pieG.selectAll(".arc")
        .data(pie(strategicData))
        .enter()
        .append("g")
        .attr("class", "arc");
    
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => statusColors[d.data.status] || "#95a5a6")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .on("mouseover", function(event, d) {
            const content = `
                <strong>${d.data.name}</strong><br/>
                Budget: ${formatCurrency(d.data.budget_allocated)}<br/>
                Percentage: ${((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1)}%
            `;
            showTooltip(content, event);
        })
        .on("mouseout", hideTooltip);
    
    // Add labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text(d => d.data.name.split(' ')[0]);
}

function createRiskChart(svg, x, y, width, height) {
    const g = svg.append("g")
        .attr("transform", `translate(${x}, ${y})`);
    
    // Title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Risk Distribution");
    
    const chartHeight = height - 60;
    const chartWidth = width - 60;
    
    const xScale = d3.scaleBand()
        .domain(strategicData.map(d => d.name.split(' ')[0]))
        .range([0, chartWidth])
        .padding(0.1);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(strategicData, d => d.risk_score)])
        .range([chartHeight, 0]);
    
    const chartG = g.append("g")
        .attr("transform", `translate(30, 30)`);
    
    // Add bars
    chartG.selectAll(".risk-bar")
        .data(strategicData)
        .enter()
        .append("rect")
        .attr("class", "risk-bar")
        .attr("x", d => xScale(d.name.split(' ')[0]))
        .attr("y", d => yScale(d.risk_score))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d.risk_score))
        .attr("fill", d => {
            if (d.risk_score <= 3) return "#2ecc71";
            if (d.risk_score <= 6) return "#f39c12";
            return "#e74c3c";
        })
        .on("mouseover", function(event, d) {
            const content = `
                <strong>${d.name}</strong><br/>
                Risk Score: ${d.risk_score}/10<br/>
                Risk Level: ${d.risk_score <= 3 ? 'Low' : d.risk_score <= 6 ? 'Medium' : 'High'}
            `;
            showTooltip(content, event);
        })
        .on("mouseout", hideTooltip);
    
    // Add axes
    chartG.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("font-size", "10px");
    
    chartG.append("g")
        .call(d3.axisLeft(yScale).ticks(5))
        .selectAll("text")
        .style("font-size", "10px");
}

function createCompletionChart(svg, x, y, width, height) {
    const g = svg.append("g")
        .attr("transform", `translate(${x}, ${y})`);
    
    // Title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Project Completion");
    
    const chartHeight = height - 60;
    const chartWidth = width - 40;
    
    const yScale = d3.scaleBand()
        .domain(strategicData.map(d => d.name.split(' ')[0]))
        .range([0, chartHeight])
        .padding(0.1);
    
    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, chartWidth]);
    
    const chartG = g.append("g")
        .attr("transform", `translate(20, 30)`);
    
    // Background bars
    chartG.selectAll(".completion-bg")
        .data(strategicData)
        .enter()
        .append("rect")
        .attr("class", "completion-bg")
        .attr("x", 0)
        .attr("y", d => yScale(d.name.split(' ')[0]))
        .attr("width", chartWidth)
        .attr("height", yScale.bandwidth())
        .attr("fill", "#ecf0f1");
    
    // Progress bars
    chartG.selectAll(".completion-bar")
        .data(strategicData)
        .enter()
        .append("rect")
        .attr("class", "completion-bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.name.split(' ')[0]))
        .attr("width", d => xScale(d.completion_percentage))
        .attr("height", yScale.bandwidth())
        .attr("fill", "#2ecc71")
        .on("mouseover", function(event, d) {
            const content = `
                <strong>${d.name}</strong><br/>
                Completion: ${d.completion_percentage}%<br/>
                Status: ${d.status}
            `;
            showTooltip(content, event);
        })
        .on("mouseout", hideTooltip);
    
    // Add percentage labels
    chartG.selectAll(".completion-label")
        .data(strategicData)
        .enter()
        .append("text")
        .attr("class", "completion-label")
        .attr("x", d => xScale(d.completion_percentage) + 5)
        .attr("y", d => yScale(d.name.split(' ')[0]) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .text(d => `${d.completion_percentage}%`);
    
    // Add y-axis
    chartG.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "10px");
}

function createResourceUtilization(svg, x, y, width, height) {
    const g = svg.append("g")
        .attr("transform", `translate(${x}, ${y})`);
    
    // Title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Resource Utilization Over Time");
    
    // Simulate time series data
    const timeData = [
        { date: new Date('2025-01-01'), utilization: 65 },
        { date: new Date('2025-02-01'), utilization: 72 },
        { date: new Date('2025-03-01'), utilization: 78 },
        { date: new Date('2025-04-01'), utilization: 85 },
        { date: new Date('2025-05-01'), utilization: 82 },
        { date: new Date('2025-06-01'), utilization: 88 },
        { date: new Date('2025-07-01'), utilization: 92 },
        { date: new Date('2025-08-01'), utilization: 89 },
        { date: new Date('2025-09-01'), utilization: 85 }
    ];
    
    const chartHeight = height - 60;
    const chartWidth = width - 60;
    
    const xScale = d3.scaleTime()
        .domain(d3.extent(timeData, d => d.date))
        .range([0, chartWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([chartHeight, 0]);
    
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.utilization))
        .curve(d3.curveMonotoneX);
    
    const chartG = g.append("g")
        .attr("transform", `translate(30, 30)`);
    
    // Add line
    chartG.append("path")
        .datum(timeData)
        .attr("fill", "none")
        .attr("stroke", "#3498db")
        .attr("stroke-width", 3)
        .attr("d", line);
    
    // Add dots
    chartG.selectAll(".dot")
        .data(timeData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.utilization))
        .attr("r", 4)
        .attr("fill", "#3498db")
        .on("mouseover", function(event, d) {
            const content = `
                <strong>Resource Utilization</strong><br/>
                Date: ${d.date.toLocaleDateString()}<br/>
                Utilization: ${d.utilization}%
            `;
            showTooltip(content, event);
        })
        .on("mouseout", hideTooltip);
    
    // Add axes
    chartG.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b")))
        .selectAll("text")
        .style("font-size", "10px");
    
    chartG.append("g")
        .call(d3.axisLeft(yScale).ticks(5))
        .selectAll("text")
        .style("font-size", "10px");
}

function createProjectTimeline(svg, x, y, width, height) {
    const g = svg.append("g")
        .attr("transform", `translate(${x}, ${y})`);
    
    // Title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Project Timeline Overview");
    
    const chartHeight = height - 60;
    const chartWidth = width - 100;
    
    // Get project data with dates
    const projects = strategicData.map(d => ({
        ...d,
        start_date: new Date(d.start_date || '2025-01-01'),
        end_date: new Date(d.end_date || '2025-12-31')
    }));
    
    const timeExtent = d3.extent([
        ...projects.map(d => d.start_date),
        ...projects.map(d => d.end_date)
    ]);
    
    const xScale = d3.scaleTime()
        .domain(timeExtent)
        .range([0, chartWidth]);
    
    const yScale = d3.scaleBand()
        .domain(projects.map(d => d.name.split(' ')[0]))
        .range([0, chartHeight])
        .padding(0.2);
    
    const chartG = g.append("g")
        .attr("transform", `translate(80, 30)`);
    
    // Add timeline bars
    chartG.selectAll(".timeline-bar")
        .data(projects)
        .enter()
        .append("rect")
        .attr("class", "timeline-bar")
        .attr("x", d => xScale(d.start_date))
        .attr("y", d => yScale(d.name.split(' ')[0]))
        .attr("width", d => xScale(d.end_date) - xScale(d.start_date))
        .attr("height", yScale.bandwidth())
        .attr("fill", d => statusColors[d.status] || "#95a5a6")
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            const content = `
                <strong>${d.name}</strong><br/>
                Start: ${d.start_date.toLocaleDateString()}<br/>
                End: ${d.end_date.toLocaleDateString()}<br/>
                Status: ${d.status}
            `;
            showTooltip(content, event);
        })
        .on("mouseout", hideTooltip);
    
    // Add axes
    chartG.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b")))
        .selectAll("text")
        .style("font-size", "10px");
    
    chartG.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "10px");
}
