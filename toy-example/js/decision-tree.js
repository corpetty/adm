function createDecisionTree() {
    const container = d3.select("#decision-tree");
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 1200 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
    
    container.selectAll("*").remove();
    
    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Load decision tree data
    d3.json('visualization_data/decision_tree.json').then(function(treeData) {
        console.log("Decision tree data loaded:", treeData);
        
        // Create tree layout
        const treeLayout = d3.tree()
            .size([width, height - 100]);
        
        // Convert data to hierarchy
        const root = d3.hierarchy(treeData, d => d.children);
        
        // Generate tree layout
        treeLayout(root);
        
        // Create links (edges)
        const links = g.selectAll(".tree-link")
            .data(root.links())
            .enter()
            .append("path")
            .attr("class", "tree-link")
            .attr("d", d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y))
            .attr("stroke", "#999")
            .attr("stroke-width", 2)
            .attr("fill", "none");
        
        // Create nodes
        const nodes = g.selectAll(".tree-node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "tree-node")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);
        
        // Add node circles/rectangles
        nodes.append("rect")
            .attr("width", d => getNodeWidth(d))
            .attr("height", d => getNodeHeight(d))
            .attr("x", d => -getNodeWidth(d) / 2)
            .attr("y", d => -getNodeHeight(d) / 2)
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("fill", d => getNodeColor(d))
            .attr("stroke", "#333")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("stroke-width", 3);
                showDecisionTreeTooltip(event, d);
            })
            .on("mouseout", function() {
                d3.select(this).attr("stroke-width", 2);
                hideTooltip();
            })
            .on("click", function(event, d) {
                if (d.data.type === "outcome") {
                    showProjectDetails(d.data);
                }
            });
        
        // Add node labels
        nodes.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("font-size", "11px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .style("pointer-events", "none")
            .each(function(d) {
                const text = d3.select(this);
                const words = d.data.name.split(/\s+/);
                const lineHeight = 12;
                const maxWidth = getNodeWidth(d) - 10;
                
                // Clear any existing text
                text.selectAll("*").remove();
                
                if (words.length === 1 || d.data.name.length < 20) {
                    // Single line
                    text.append("tspan")
                        .text(d.data.name);
                } else {
                    // Multi-line text wrapping
                    let line = [];
                    let lineNumber = 0;
                    
                    words.forEach(word => {
                        line.push(word);
                        const testLine = line.join(" ");
                        
                        if (testLine.length > 15 && line.length > 1) {
                            line.pop();
                            text.append("tspan")
                                .attr("x", 0)
                                .attr("dy", lineNumber === 0 ? "-0.3em" : "1.1em")
                                .text(line.join(" "));
                            line = [word];
                            lineNumber++;
                        }
                    });
                    
                    if (line.length > 0) {
                        text.append("tspan")
                            .attr("x", 0)
                            .attr("dy", lineNumber === 0 ? "0.35em" : "1.1em")
                            .text(line.join(" "));
                    }
                }
            });
        
        // Add project count badges for outcome nodes
        nodes.filter(d => d.data.type === "outcome" && d.data.project_count > 0)
            .append("circle")
            .attr("cx", d => getNodeWidth(d) / 2 - 10)
            .attr("cy", d => -getNodeHeight(d) / 2 + 10)
            .attr("r", 12)
            .attr("fill", "#e74c3c")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);
        
        nodes.filter(d => d.data.type === "outcome" && d.data.project_count > 0)
            .append("text")
            .attr("x", d => getNodeWidth(d) / 2 - 10)
            .attr("y", d => -getNodeHeight(d) / 2 + 10)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .style("pointer-events", "none")
            .text(d => d.data.project_count);
        
        // Add legend
        createDecisionTreeLegend(svg, width, height, margin);
        
    }).catch(function(error) {
        console.error('Error loading decision tree data:', error);
        container.append("div")
            .style("text-align", "center")
            .style("padding", "50px")
            .style("color", "#666")
            .text("Error loading decision tree data. Please check the data files.");
    });
}

function getNodeWidth(d) {
    if (d.data.type === "decision") {
        return Math.max(120, d.data.name.length * 6);
    } else {
        return Math.max(140, d.data.name.length * 5);
    }
}

function getNodeHeight(d) {
    if (d.data.type === "decision") {
        return d.data.name.length > 20 ? 50 : 35;
    } else {
        return d.data.name.length > 20 ? 60 : 45;
    }
}

function getNodeColor(d) {
    if (d.data.type === "decision") {
        return "#3498db"; // Blue for decision nodes
    } else {
        // Color outcome nodes based on recommendation
        const recommendation = d.data.recommendation;
        if (recommendation.includes("STRONGLY RECOMMEND")) {
            return "#27ae60"; // Green
        } else if (recommendation.includes("RECOMMEND")) {
            return "#2ecc71"; // Light green
        } else if (recommendation.includes("CONDITIONAL") || recommendation.includes("CAUTION")) {
            return "#f39c12"; // Orange
        } else if (recommendation.includes("EVALUATE")) {
            return "#e67e22"; // Dark orange
        } else {
            return "#e74c3c"; // Red
        }
    }
}

function showDecisionTreeTooltip(event, d) {
    let content = `<strong>${d.data.name}</strong><br/>`;
    
    if (d.data.type === "decision") {
        content += `<em>Question:</em> ${d.data.question}<br/>`;
        content += `Children: ${d.data.children ? d.data.children.length : 0}`;
    } else {
        content += `<em>Recommendation:</em> ${d.data.recommendation}<br/>`;
        content += `<em>Reasoning:</em> ${d.data.reasoning}<br/>`;
        content += `Projects: ${d.data.project_count}`;
    }
    
    showTooltip(content, event);
}

function showProjectDetails(nodeData) {
    if (nodeData.projects && nodeData.projects.length > 0) {
        let content = `
            <div style="max-width: 400px;">
                <h3 style="margin-top: 0; color: #2c3e50;">${nodeData.name}</h3>
                <p><strong>Recommendation:</strong> ${nodeData.recommendation}</p>
                <p><strong>Reasoning:</strong> ${nodeData.reasoning}</p>
                <h4>Projects in this category:</h4>
                <div style="max-height: 200px; overflow-y: auto;">
        `;
        
        nodeData.projects.forEach(project => {
            content += `
                <div style="border: 1px solid #ddd; margin: 5px 0; padding: 10px; border-radius: 5px; background: #f9f9f9;">
                    <strong>${project.name}</strong><br/>
                    <small>
                        Budget: ${formatCurrency(project.budget)} | 
                        Strategic Score: ${project.strategic_score} | 
                        Risk: ${project.risk_score} | 
                        ROI: ${project.roi}x<br/>
                        Status: ${project.status} | 
                        Priority: ${project.priority}
                    </small>
                </div>
            `;
        });
        
        content += `</div></div>`;
        
        // Create modal-like overlay
        const overlay = d3.select("body")
            .append("div")
            .style("position", "fixed")
            .style("top", "0")
            .style("left", "0")
            .style("width", "100%")
            .style("height", "100%")
            .style("background", "rgba(0,0,0,0.5)")
            .style("z-index", "10000")
            .style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "center")
            .on("click", function() {
                overlay.remove();
            });
        
        const modal = overlay.append("div")
            .style("background", "white")
            .style("padding", "20px")
            .style("border-radius", "10px")
            .style("box-shadow", "0 4px 20px rgba(0,0,0,0.3)")
            .style("max-width", "500px")
            .style("max-height", "80vh")
            .style("overflow-y", "auto")
            .html(content)
            .on("click", function(event) {
                event.stopPropagation();
            });
        
        // Add close button
        modal.append("button")
            .style("position", "absolute")
            .style("top", "10px")
            .style("right", "15px")
            .style("background", "none")
            .style("border", "none")
            .style("font-size", "20px")
            .style("cursor", "pointer")
            .style("color", "#666")
            .text("×")
            .on("click", function() {
                overlay.remove();
            });
    }
}

function createDecisionTreeLegend(svg, width, height, margin) {
    const legend = svg.append("g")
        .attr("class", "decision-tree-legend")
        .attr("transform", `translate(${width - 200}, ${margin.top})`);
    
    legend.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text("Decision Tree Legend")
        .style("font-weight", "bold")
        .style("font-size", "14px");
    
    // Node type legend
    const nodeTypes = [
        { type: "Decision Node", color: "#3498db", description: "Question/Criteria" },
        { type: "Outcome Node", color: "#27ae60", description: "Recommendation" }
    ];
    
    const nodeTypeLegend = legend.selectAll(".node-type-legend")
        .data(nodeTypes)
        .enter()
        .append("g")
        .attr("class", "node-type-legend")
        .attr("transform", (d, i) => `translate(0, ${25 + i * 25})`);
    
    nodeTypeLegend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => d.color)
        .attr("stroke", "#333")
        .attr("rx", 3);
    
    nodeTypeLegend.append("text")
        .attr("x", 20)
        .attr("y", 7.5)
        .attr("dy", "0.35em")
        .text(d => d.type)
        .style("font-size", "11px");
    
    // Recommendation colors
    legend.append("text")
        .attr("x", 0)
        .attr("y", 100)
        .text("Recommendations")
        .style("font-weight", "bold")
        .style("font-size", "12px");
    
    const recommendations = [
        { label: "Strongly Recommend", color: "#27ae60" },
        { label: "Recommend", color: "#2ecc71" },
        { label: "Conditional/Caution", color: "#f39c12" },
        { label: "Evaluate Alternatives", color: "#e67e22" },
        { label: "Do Not Recommend", color: "#e74c3c" }
    ];
    
    const recLegend = legend.selectAll(".rec-legend")
        .data(recommendations)
        .enter()
        .append("g")
        .attr("class", "rec-legend")
        .attr("transform", (d, i) => `translate(0, ${120 + i * 20})`);
    
    recLegend.append("circle")
        .attr("r", 6)
        .attr("fill", d => d.color);
    
    recLegend.append("text")
        .attr("x", 12)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .text(d => d.label)
        .style("font-size", "10px");
    
    // Instructions
    legend.append("text")
        .attr("x", 0)
        .attr("y", 250)
        .text("Click outcome nodes")
        .style("font-size", "10px")
        .style("font-style", "italic")
        .style("fill", "#666");
    
    legend.append("text")
        .attr("x", 0)
        .attr("y", 265)
        .text("to view projects")
        .style("font-size", "10px")
        .style("font-style", "italic")
        .style("fill", "#666");
}
