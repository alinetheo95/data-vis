

    const svg = d3.select("svg"),
          margin = {top: 20, right: 20, bottom: 30, left: 100},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("drinks.csv").then(data => {
      // Parse time
      const parseTime = d3.timeParse("%H:%M:%S");
      data.forEach(d => {
        d.start = parseTime(d["start time"]);
        d.day = d.Day;
        d.drink = d["drink type"];
      });

      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.start))
        .range([0, width]);

      const y = d3.scaleBand()
        .domain([...new Set(data.map(d => d.day))])
        .range([0, height])
        .padding(0.2);

      const color = d3.scaleOrdinal()
        .domain(["Water", "Coffee", "Other"])
        .range(["blue", "green", "pink"]);

      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M")));

      g.append("g")
        .call(d3.axisLeft(y));

      g.selectAll("rect")
        .data(data)
        .enter().append("rect")
          .attr("x", d => x(d.start))
          .attr("y", d => y(d.day))
          .attr("width", 8) // narrow bar for each drink instance
          .attr("height", y.bandwidth())
          .attr("fill", d => {
            if (d.drink.toLowerCase() === "water") return "blue";
            if (d.drink.toLowerCase() === "coffee") return "green";
            return "pink";
          });
    });
