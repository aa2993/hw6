import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component {
  state = {
    company: "Apple",
    selectedMonth: "November",
  };

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.csv_data !== this.props.csv_data ||
      prevState.company !== this.state.company ||
      prevState.selectedMonth !== this.state.selectedMonth
    ) {
      this.drawChart();
    }
  }

  handleCompanyChange = (event) => {
    this.setState({ company: event.target.value });
  };

  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };

  filterData = () => {
    const { csv_data } = this.props;
    const { company, selectedMonth } = this.state;
    return csv_data.filter((d) => {
      return (
        d.Company === company &&
        d.Date.toLocaleString("default", { month: "long" }) === selectedMonth
      );
    });
  };

  drawChart = () => {
    const data = this.filterData();
    d3.select("#chart").selectAll("*").remove();

    const margin = { top: 40, right: 150, bottom: 120, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Date))
      .range([10, width]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d.Open, d.Close)),
        d3.max(data, (d) => Math.max(d.Open, d.Close)),
      ])
      .nice()
      .range([height, 0]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%a %d"));
    const yAxis = d3.axisLeft(y);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px");

    const formatDate = d3.timeFormat("%m/%d/%Y");

    const lineOpen = d3
      .line()
      .curve(d3.curveCardinal)
      .x((d) => x(d.Date))
      .y((d) => y(d.Open));

    const lineClose = d3
      .line()
      .curve(d3.curveCardinal)
      .x((d) => x(d.Date))
      .y((d) => y(d.Close));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 1.5)
      .attr("d", lineOpen);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 1.5)
      .attr("d", lineClose);

    svg.selectAll(".dot-open")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-open")
      .attr("cx", (d) => x(d.Date))
      .attr("cy", (d) => y(d.Open))
      .attr("r", 3)
      .attr("fill", "#b2df8a")
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px")
          .style("opacity", 1)
          .html(
            `Date: ${formatDate(d.Date)}<br>
            Open: ${d.Open.toFixed(2)}<br>
            Close: ${d.Close.toFixed(2)}<br>
            Difference: ${(d.Close - d.Open).toFixed(2)}`
          );
      })
      .on("mouseout", () => d3.select("#tooltip").style("opacity", 0));

    svg.selectAll(".dot-close")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-close")
      .attr("cx", (d) => x(d.Date))
      .attr("cy", (d) => y(d.Close))
      .attr("r", 3)
      .attr("fill", "#e41a1c")
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px")
          .style("opacity", 1)
          .html(
            `Date: ${formatDate(d.Date)}<br>
            Open: ${d.Open.toFixed(2)}<br>
            Close: ${d.Close.toFixed(2)}<br>
            Difference: ${(d.Close - d.Open).toFixed(2)}`
          );
      })
      .on("mouseout", () => d3.select("#tooltip").style("opacity", 0));

    const legend = svg.append("g").attr("transform", `translate(${width + 20}, ${20})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 10)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "#b2df8a");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 22)
      .text("Open")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 35)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "#e41a1c");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 47)
      .text("Close")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  };

  render() {
    const options = [
      "Apple",
      "Microsoft",
      "Amazon",
      "Google",
      "Meta",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="child1">
        <div className="controls">
          <div className="company-selector">
            {options.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  checked={this.state.company === option}
                  onChange={this.handleCompanyChange}
                />
                {option}
              </label>
            ))}
          </div>
          <div className="month-selector">
            <select value={this.state.selectedMonth} onChange={this.handleMonthChange}>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div id="chart"></div>
        <div id="tooltip" className="tooltip" style={{ opacity: 0 }}></div>
      </div>
    );
  }
}

export default Child1;
