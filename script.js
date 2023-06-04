async function getData() {
  const rawData = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  );
  const data = await rawData.json();

  return data;
}

function setToolTip() {
  const cells = document.querySelectorAll(".tile");

  cells.forEach((cell) => {
    cell.addEventListener("mouseover", (event) => {
      document.getElementById("tooltip")?.remove();

      const name = event.target.getAttribute("data-name");
      const category = event.target.getAttribute("data-category");
      const value = event.target.getAttribute("data-value");
      const mousePosition = [event.x, event.y];

      const tooltip = document.createElement("div");
      tooltip.id = "tooltip";
      tooltip.innerHTML = `
          NAME: ${name} <br>
          CATEGORY: ${category} <br>
          VALUE: USD ${Number(value).toFixed(2)}
      `;
      tooltip.style.position = "fixed";
      tooltip.style.zIndex = "9999";
      tooltip.style.background = "#fff";
      tooltip.style.padding = "10px";
      tooltip.style.border = "1px solid #ccc";
      tooltip.style.borderRadius = "4px";
      tooltip.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";

      tooltip.setAttribute("data-name", name);
      tooltip.setAttribute("data-category", category);
      tooltip.setAttribute("data-value", value);

      const tooltipWidth = 50;
      const windowWidth = window.innerWidth;
      const spaceRight = windowWidth - mousePosition[0];

      if (spaceRight >= tooltipWidth) {
        tooltip.style.left = `${mousePosition[0]}px`;
      } else {
        const spaceLeft = mousePosition[0] - tooltipWidth;
        tooltip.style.left = `${spaceLeft}px`;
      }

      tooltip.style.top = `${mousePosition[1]}px`;

      document.body.appendChild(tooltip);
    });

    cell.addEventListener("mouseout", (event) => {
      document.getElementById("tooltip")?.remove();
    });
  });
}

function appendDiagram(movieSalesData) {
  const width = 960;
  const height = 570;

  const svg = d3
    .select("#tree-map")
    .style("width", width)
    .style("height", height);

  const treemap = d3.treemap().size([width, height]).paddingInner(1);

  const root = d3
    .hierarchy(movieSalesData)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  treemap(root);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => colorScale(d.parent.data.name))
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value);

  svg
    .selectAll(".label")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => d.x0 + 5)
    .attr("y", (d) => d.y0 + 15)
    .text((d) => d.data.name.slice(0, Number(d.x1 - d.x0).toFixed(0) * 0.2))
    .attr("font-size", "10px");

  setToolTip();
}

getData().then((data) => appendDiagram(data));
