'use strict';

function jb(json) {


  var width = 960,
      height = 66,
      cellSize = 8; // cell size

  var day = d3.time.format("%w"),
      week = d3.time.format("%U"),
      percent = d3.format(".1%"),
      format = d3.time.format("%Y%m%d"),
      formatOut = d3.time.format("%a %d %b %Y");


  var data = d3.nest()
    .key(function(d) { return d.date; })
    .rollup(function(d) {
      var sum = d.reduce(function(p, c) { return  p + parseInt(c.word_count) }, 0)
      // console.log(d, sum)
      return sum
    })
    .map(json);

  // console.log(json)
  // console.log(data)
  // console.log(d3.values(data).sort(d3.descending))

  var values = d3.values(data),
      min = d3.min(values),
      max = d3.max(values)
  // console.log(values)
  // console.log(min, max)

  var keys = d3.keys(data),
      start = d3.min(keys).slice(0,4),
      end = parseInt(d3.max(keys).slice(0,4)) + 1
  // console.log(keys)
  // console.log(start, end)

  // var color = d3.scale.log()
  // var color = d3.scale.quantize()
  var color = d3.scale.linear()
      .domain([min, max])
      // .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
      // .range(d3.range(8).map(function(d) { return "q" + (d + 1) + "-9"; }));
      .range(['#b4cde2', '#1a3042']);

  var svg = d3.select("#calendar-plot").selectAll("svg").remove()

  var svg = d3.select("#calendar-plot").selectAll("svg")
      .data(d3.range(+start, +end))
    .enter().append("svg")
      .attr("width", width)
      .attr("height", height)
      // .attr("class", "RdYlGn")
      // .attr("class", "RdYlBu")
      // .attr("class", "Purples")
      // .attr("class", "Spectral")
    .append("g")
      .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

  svg.append("text")
      .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
      .style("text-anchor", "middle")
      .text(function(d) { return d; });


  var addCommas = d3.format(',')

  var popup = d3.select('#calendar-popup')

  var rect = svg.selectAll(".day")
      .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", function(d) { return week(d) * cellSize; })
      .attr("y", function(d) { return day(d) * cellSize; })
      .datum(format)


  $('svg rect').tipsy({
    gravity: 'w',
    html: true,
    title: function() {
      if (data[this.__data__]) {
        return formatOut(format.parse(this.__data__)) + ' ' + addCommas(data[this.__data__]) + ' words';
      } else {
        return ''
      }
    }
  });

  rect.append("title")
      .text(function(d) { return d; });

  svg.selectAll(".month")
      .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
    .enter().append("path")
      .attr("class", "month")
      .attr("d", monthPath);

  rect.filter(function(d) { return d in data; })
      // .attr("class", function(d) {
      //   // console.log(color(data[d]));
      //   return "day " + color(data[d]);
      // })
      .attr("style", function(d) {
        return "fill:" + color(data[d]);
      })
    .select("title")
      .text(function(d) {
        // console.log(data[d])
        return d + ": " + data[d];
      });

  function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = +day(t0), w0 = +week(t0),
        d1 = +day(t1), w1 = +week(t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
  }

}
