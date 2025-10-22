// Parse the data
        const rawData = `Day start time end time drink type why? quantity (mL or oz) location hot/ice/room temp sleep the night before (hr) sweetness level (0-10) container
Sat 10:30 AM 10:50 AM Water dehydrated 8 oz home cold 8 hr 0 glass
Sat 10:40 AM 11:00 AM Coffee tired 8 oz home hot 8 hr 0 mug
Sat 12:00 PM 12:30 PM Water thirsty 8 oz home room temp 8 hr 0 glass
Sat 1:00 PM 1:30 PM Coffee still tired 8 oz home hot 8 hr 0 mug
Sat 2:15 PM 2:20 PM Water hydrating 8 oz home room temp 8 hr 0 glass
Sat 4:00 PM 4:30 PM Margerita socializing 8 oz bar cold 8 hr 3 glass
Sat 4:40 PM 4:45 PM Water hydrating 8 oz bar cold 8 hr 0 glass
Sat 5:30 PM 6:10 PM Beer socializing 12 oz bar cold 8 hr 1 glass
Sun 11:30 AM 11:30 AM Water hydrating 8 oz home cold 8 hr 0 glass
Sun 11:45 AM 12:10 PM Coffee tired 8 oz home hot 6 hr 0 mug
Sun 12:20 PM 12:30 PM Water thirsty 8 oz home room temp 6 hr 0 glass
Sun 12:30 PM 12:55 PM Coffee tired 8 oz home room temp 6 hr 0 mug
Sun 2:00 PM 3:15 PM Water thirsty 8 oz home cold 6 hr 0 glass
Sun 4:15 PM 4:30 PM Water thirsty 8 oz home cold 6 hr 0 glass
Sun 8:00 PM 8:15 PM Water thirsty 8 oz restaurant cold 6 hr 0 glass
Sun 8:20 PM 8:40 PM Water thirsty 8 oz restaurant cold 6 hr 0 glass
Mon 9:30 AM 9:55 PM Coffee tired 8 oz home hot 8.5 hr 0 mug
Mon 11:00 AM 11:45 PM Coffee need to focus 8 oz home hot 8.5 hr 0 mug
Mon 12:00 PM 12:20 PM Water thirsty 8 oz home cold 8.5 hr 0 glass
Mon 2:10 PM 2:30 PM Water hydrating 8 oz class cold 8.5 hr 0 bottle
Mon 4:00 PM 4:20 PM Water hydrating 8 oz class room temp 8.5 hr 0 bottle
Mon 4:10 PM 4:45 PM Coffee need to focus 8 oz class iced 8.5 hr 0 bottle
Mon 7:00 PM 8:30 PM Water hydrating 8 oz home room temp 8.5 hr 0 bottle
Tues 6:40 AM 7:20 AM Coffee very tired 8 oz home hot 6 hr 0 mug
Tues 9:00 AM 10:00 AM Coffee tired 8 oz class hot 6 hr 0 mug
Tues 10:00 AM 10:15 AM Water thirsty 8 oz class cold 6 hr 0 glass
Tues 12:00 PM 12:45 PM Water hydrating 8 oz class room temp 6 hr 0 glass
Tues 4:00 PM 4:30 PM Coffee tired 8 oz coffee shop iced 6 hr 0 plastic cup
Tues 6:00 PM 6:30 PM Water thirsty 8 oz restaurant room temp 6 hr 0 glass
Tues 6:30 PM 6:50 PM Water thirsty 8 oz restaurant cold 6 hr 0 glass
Tues 9:00 PM 10:10 PM Water hydrating 8 oz home room temp 6 hr 0 glass
Wed 9:30 AM 10:15 PM Coffee tired 8 oz home hot 8.5 hr 0 mug
Wed 10:30 PM 11:00 PM Coffee need to focus 8 oz home hot 8.5 hr 0 mug
Wed 10:45 PM 11:15 PM Water thirsty 8 oz home cold 8.5 hr 0 glass
Wed 12:00 PM 12:15 PM Water hydrating 8 oz home cold 8.5 hr 0 glass
Wed 12:20 PM 12:45 PM Water hydrating 8 oz home room temp 8.5 hr 0 bottle
Wed 2:00 PM 2:35 PM Smoothie hungry 8 oz class room temp 8.5 hr 3 bottle
Wed 3:00 PM 3:30 PM Water hydrating 8 oz class room temp 8.5 hr 0 botlle
Wed 4:20 PM 5:10 PM Coffee tired 8 oz class iced 8.5 hr 0 bottle
Wed 5:45 PM 6:00 PM Water hydrating 8 oz class cold 8.5 hr 0 glass
Wed 8:00 PM 8:05 PM Water hydrating 8 oz home cold 8.5 hr 0 glass
Wed 8:30 PM 8:45 PM Water hydrating 8 oz home cold 8.5 hr 0 glass
Wed 9:25 PM 10:45 PM Water hydrating 8 oz home cold 8.5 hr 0 glass`;

        // Parse time to minutes from midnight
        function parseTimeToMinutes(timeStr) {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            
            if (period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }
            
            return hours * 60 + minutes;
        }

        // Parse the data
        function parseData(rawData) {
            const lines = rawData.trim().split('\n').slice(1); // Skip header
            
            return lines.map(line => {
                const parts = line.split(' ');
                const day = parts[0];
                const startTime = parts[1] + ' ' + parts[2];
                const endTime = parts[3] + ' ' + parts[4];
                const drinkType = parts[5];
                const reason = parts[6];
                const quantity = parts[7] + ' ' + parts[8];
                const location = parts[9];
                const temperature = parts[10];
                
                return {
                    day,
                    startTime,
                    endTime,
                    drinkType,
                    reason,
                    quantity,
                    location,
                    temperature,
                    startMinutes: parseTimeToMinutes(startTime),
                    endMinutes: parseTimeToMinutes(endTime),
                    duration: parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime)
                };
            }).filter(d => d.duration >= 0); // Filter out entries with negative duration (time errors)
        }

        const data = parseData(rawData);
        
        // Set up dimensions
        const margin = { top: 20, right: 80, bottom: 60, left: 80 };
        const width = 900 - margin.left - margin.right;
        const height = 600 - margin.bottom - margin.top;

        // Create SVG
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up scales
        const days = ["Sat", "Sun", "Mon", "Tues", "Wed"];
        const yScale = d3.scaleBand()
            .domain(days)
            .range([0, height])
            .padding(0.1);

        const xScale = d3.scaleLinear()
            .domain([0, 24 * 60]) // 0 to 24 hours in minutes
            .range([0, width]);

        // Color scale
        const colorScale = d3.scaleOrdinal()
            .domain(["Water", "Coffee", "Other"])
            .range(["#3498db", "#27ae60", "#e91e63"]);

        // Function to get drink category
        function getDrinkCategory(drinkType) {
            if (drinkType.toLowerCase() === "water") return "Water";
            if (drinkType.toLowerCase() === "coffee") return "Coffee";
            return "Other";
        }

        // Add grid lines
        svg.selectAll(".grid-line")
            .data(d3.range(0, 25, 4)) // Every 4 hours
            .enter()
            .append("line")
            .attr("class", "grid-line")
            .attr("x1", d => xScale(d * 60))
            .attr("x2", d => xScale(d * 60))
            .attr("y1", 0)
            .attr("y2", height);

        // Create tooltip
        const tooltip = d3.select("#tooltip");

        // Add bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.startMinutes))
            .attr("y", d => yScale(d.day))
            .attr("width", d => Math.max(2, xScale(d.endMinutes) - xScale(d.startMinutes)))
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorScale(getDrinkCategory(d.drinkType)))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .on("mouseover", function(event, d) {
                tooltip
                    .style("opacity", 1)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px")
                    .html(`
                        <strong>${d.drinkType}</strong><br>
                        <strong>Time:</strong> ${d.startTime} - ${d.endTime}<br>
                        <strong>Quantity:</strong> ${d.quantity}<br>
                        <strong>Location:</strong> ${d.location}<br>
                        <strong>Temperature:</strong> ${d.temperature}<br>
                        <strong>Reason:</strong> ${d.reason}
                    `);
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
            });

        // Add x-axis
        const xAxis = d3.axisBottom(xScale)
            .tickValues(d3.range(0, 25, 4).map(h => h * 60))
            .tickFormat(d => {
                const hours = Math.floor(d / 60);
                return hours === 0 ? "12 AM" : hours === 12 ? "12 PM" : hours > 12 ? (hours - 12) + " PM" : hours + " AM";
            });

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        // Add y-axis
        const yAxis = d3.axisLeft(yScale);
        svg.append("g").call(yAxis);

        // Add axis labels
        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 15)
            .attr("x", 0 - (height / 2))
            .style("text-anchor", "middle")
            .text("Day");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
            .style("text-anchor", "middle")
            .text("Time of Day");