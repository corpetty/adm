function createDependencyGraph() {
    const container = d3.select("#dependency-graph");
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    
    // Clear any existing content
    container.selectAll("*").remove();
    
    // Create SVG
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Create main group
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Create groups for links and nodes
    const linkGroup = g.append("g").attr("class", "links");
    const nodeGroup = g.append("g").attr("class", "nodes");
    
    // Create legend
    createDependencyLegend(svg, width, height);
    
    // Initialize with all dependencies
    updateDependencyGraph("all");
}

function updateDependencyGraph(filterType) {
    const container = d3.select("#dependency-graph svg g");
    const width = 800 - 40;
    const height = 600 - 40;
    
    // Filter links based on dependency type
    let filteredLinks = dependencyData.links;
    if (filterType !== "all") {
        filteredLinks = dependencyData.links.filter(d => d.dependency_type === filterType);
    }
    
    // Get unique nodes from filtered links
    const nodeIds = new Set();
    filteredLinks.forEach(link => {
        nodeIds.add(link.source_project_id);
        nodeIds.add(link.target_project_id);
    });
    
    const filteredNodes = dependencyData.nodes.filter(d => nodeIds.has(d.project_id));
    
    // Create force simulation
    const simulation = d3.forceSimulation(filteredNodes)
        .force("link", d3.forceLink(filteredLinks)
            .id(d => d.project_id)
            .distance(d => 100 + (5 - d.dependency_strength) * 20))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => Math.sqrt(d.budget_allocated / 10000) + 10));
    
    // Create scales
    const budgetScale = d3.scaleSqrt()
        .domain(d3.extent(filteredNodes, d => d.budget_allocated))
        .range([10, 40]);
    
    const strengthScale = d3.scaleLinear()
        .domain([1, 5])
        .range([1, 5]);
    
    // Update links
    const links = container.select(".links")
        .selectAll(".link")
        .data(filteredLinks, d => `${d.source_project_id}-${d.target_project_id}`);
    
    links.exit().remove();
    
    const linksEnter = links.enter()
        .append("line")
        .attr("class", "link");
    
    const linksUpdate = linksEnter.merge(links)
        .attr("stroke", d => dependencyTypeColors[d.dependency_type])
        .attr("stroke-width", d => strengthScale(d.dependency_strength))
        .on("mouseover", function(event, d) {
            const content = `
                <strong>Dependency</strong><br/>
                From: ${d.source_project_id}<br/>
                To: ${d.target_project_id}<br/>
                Type: ${d.dependency_type}<br/>
                Strength: ${d.dependency_strength}/5<br/>
                Impact if broken: ${d.impact_if_broken}
            `;
            showTooltip(content, event);
        })
        .on("mouseout", hideTooltip);
    
    // Update nodes
    const nodes = container.select(".nodes")
        .selectAll(".node-group")
        .data(filteredNodes, d => d.project_id);
    
    nodes.exit().remove();
    
    const nodesEnter = nodes.enter()
        .append("g")
        .attr("class", "node-group");
    
    // Add circles to new nodes
    nodesEnter.append("circle")
        .attr("class", "node");
    
    // Add labels to new nodes
    nodesEnter.append("text")
        .attr("class", "node-label")
        .attr("dy", "0.35em");
    
    const nodesUpdate = nodesEnter.merge(nodes);
    
    // Update circles
    nodesUpdate.select(".node")
        .attr("r", d => budgetScale(d.budget_allocated))
        .attr("fill", d => statusColors[d.status] || "#95a5a6")
        .on("mouseover", function(event, d) {
            const content = `
                <strong>${d.name}</strong><br/>
                Status: ${d.status}<br/>
                Budget: ${formatCurrency(d.budget_allocated)}<br/>
                Strategic Score: ${d.strategic_score_avg ? d.strategic_score_avg.toFixed(1) : 'N/A'}<br/>
                Theme: ${d.portfolio_theme}<br/>
                Risk Level: ${d.risk_level}
            `;
            showTooltip(content, event);
        })
        .on("mouseout", hideTooltip);
    
    // Update labels
    nodesUpdate.select(".node-label")
        .text(d => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name)
        .attr("fill", "#2c3e50");
    
    // Add drag behavior
    const drag = d3.drag()
        .on("start", function(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", function(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", function(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        });
    
    nodesUpdate.call(drag);
    
    // Update simulation
    simulation.nodes(filteredNodes);
    simulation.force("link").links(filteredLinks);
    
    simulation.on("tick", function() {
        linksUpdate
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        nodesUpdate
            .attr("transform", d => `translate(${d.x}, ${d.y})`);
    });
    
    simulation.alpha(1).restart();
}

function createDependencyLegend(svg, width, height) {
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 150}, 20)`);
    
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
    
    statusLegend.append("circle")
        .attr("r", 6)
        .attr("fill", d => d[1]);
    
    statusLegend.append("text")
        .attr("x", 12)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .text(d => d[0])
        .style("font-size", "11px");
    
    // Dependency type legend
    legend.append("text")
        .attr("x", 0)
        .attr("y", 100)
        .text("Dependency Type")
        .style("font-weight", "bold")
        .style("font-size", "12px");
    
    const depEntries = Object.entries(dependencyTypeColors);
    const depLegend = legend.selectAll(".dep-legend")
        .data(depEntries)
        .enter()
        .append("g")
        .attr("class", "dep-legend")
        .attr("transform", (d, i) => `translate(0, ${120 + i * 20})`);
    
    depLegend.append("line")
        .attr("x1", 0)
        .attr("x2", 15)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", d => d[1])
        .attr("stroke-width", 3);
    
    depLegend.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .text(d => d[0])
        .style("font-size", "11px");
}
