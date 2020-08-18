// https://observablehq.com/@mmznrstat/tagliche-covid-19-fallzahlen-im-kanton-zurich@1779
import define1 from "./a0c7a2f7aa705586@522.js";
import define2 from "./cd832dfa6c7938a9@451.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["statistisches_amt_kt_zh.png",new URL("./files/1a2e95ea62804b9cfef595b6d55690d274e2ec68f77b6c9754f76555cb5d2f5c095cf0878b26e1d78d40b195aa1362a87bbf177a7e091ae6a2d691d9eac64147",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md","FileAttachment"], async function(md,FileAttachment){return(
md`
<figure>${Object.assign(
  await FileAttachment("statistisches_amt_kt_zh.png").image(),
  { alt: 'Girl reading', style: 'width: 100%; max-width: 440px;' }
)}</figure>

# Tägliche COVID-19 Fallzahlen im Kanton Zürich 
### [Fach- und Koordinationsstelle OGD](https://open.zh.ch/content/internet/justiz_inneres/ogd/de/home.html)`
)});
  main.variable(observer()).define(["shareTweet"], function(shareTweet){return(
shareTweet(document.baseURI, {
  buttonText: "Auf Twitter teilen",
  text: "COVID-19 Fallzahlen im Kanton Zürich",
  hashtags: "covid19zh",
  via: "opendatazh"
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Positiv Getestete`
)});
  main.variable(observer("viewof dayChart")).define("viewof dayChart", ["d3","width","yScaleF","scaleTyp","datenZH","margin","xScale","height","xAxis","formatTime","datenZHTagAvg","bisect"], function(d3,width,yScaleF,scaleTyp,datenZH,margin,xScale,height,xAxis,formatTime,datenZHTagAvg,bisect)
{
  let widthNow = d3.min([768, width]);
  let yScale = yScaleF(scaleTyp, d3.extent(datenZH, d => d.n_conf));
  let yAxis = g =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

  let line = d3
    .line()
    .defined(d => !isNaN(d.value))
    .x(d => xScale(d.date))
    .y(d => (console.log(d), yScale(d.value)));
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr('id', 'STATchart1');
  const axisGr = svg.append('g');
  const mouseGr = svg.append('g');
  const chartGr = svg.append('g').attr('pointer-events', 'none');

  axisGr.append("g").call(xAxis);
  axisGr.append("g").call(yAxis);
  let balkenWidth = (width - margin.left - margin.right) / datenZH.length;

  const mouseRect = mouseGr
    .selectAll('rect.STATmouse')
    .data(datenZH)
    .enter()
    .append('rect')
    .attr('id', d => 'm' + formatTime(d.date))
    .attr('class', 'STATmouse')
    .attr('cursor', 'pointer')
    .attr("fill", "white")
    .attr("stroke-width", 0.5)
    .attr("stroke", "white")
    .attr("opacity", 0)
    .attr("x", (d, i) => xScale(d.date))
    .attr("y", 0)
    .attr("width", balkenWidth)
    .attr("height", height);

  let balken = chartGr.selectAll('rect').data(datenZH);

  balken
    .enter()
    .append('rect')
    .attr('id', d => 'a' + formatTime(d.date))
    .attr("fill", "grey")
    .attr("stroke-width", 0.5)
    .attr("stroke", "white")
    .attr("opacity", 0.7)
    .attr("x", (d, i) => xScale(d.date))
    .attr("y", (d, i) => yScale(d.n_conf))
    .attr("width", balkenWidth)
    .attr("height", d => yScale(0) - yScale(d.n_conf));

  chartGr
    .append('g')
    .attr('transform', 'translate(' + balkenWidth / 2 + ',' + 0 + ')')
    .append("path")
    .datum(datenZHTagAvg)
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", "tomato")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

  let tag, tageswert, mittelwert, week;

  mouseGr.selectAll('rect').on('mouseover', function(d) {
    tageswert = d;

    tag = d3
      .timeParse("%Q")(+d.date)
      .toLocaleString("de-CH", {
        day: "numeric",
        month: "long"
      });

    mittelwert = bisect(datenZHTagAvg, d3.timeParse("%Q")(+d.date));

    week = d3.timeFormat('%U')(d3.timeParse("%Q")(+d.date));

    chartGr.selectAll('rect').attr('opacity', 0.7);

    chartGr.select('#a' + formatTime(+d.date)).attr('opacity', 1);

    chartGr.select('#thisMouse').remove();
    let thisMouse = chartGr.append('g').attr('id', 'thisMouse');

    let translateX = d3.min([
      width - margin.right - margin.left - 20,
      d3.max([xScale(d.date) - 40, 0])
    ]);
    let translateY = d3.min([height - 60, yScale(mittelwert.value)]) - 60;

    let thisGr = thisMouse
      .append('g')
      .attr('transform', 'translate(' + translateX + ',' + translateY + ')');

    thisGr
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 80)
      .attr('height', 45)
      .style('fill', 'white')
      .style('opacity', 0.6);

    thisGr
      .append('text')
      .attr('dx', 40)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(tag);

    let text1 = '';

    if (mittelwert.value >= 0) {
      text1 = Math.round(mittelwert.value);
    }
    thisGr
      .append('text')
      .attr('dx', 30)
      .attr('dy', '2.2em')
      .style('text-anchor', 'end')
      .style('fill', 'tomato')
      .text(text1);

    thisGr
      .append('text')
      .attr('dx', 72)
      .attr('dy', '2.2em')
      .style('text-anchor', 'end')
      .style('fill', 'grey')
      .text('(' + tageswert.n_conf + ')');
  });
  
  let element2 = svg.append('g').attr('transform', 'translate(0,500)');
  element2
    .append('line')
    .attr('x1', 0)
    .attr('x2', 15)
    .attr('y1', 8)
    .attr('y2', 8)
    .style('stroke', 'tomato')
    .style('stroke-width', 3);

  element2
    .append('text')
    .attr('x', 20)
    .attr('y', 13)
    .text('gleitendes Mittel (7 Tage)');
  let element1 = svg.append('g').attr('transform', 'translate(220,500)');
  element1
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', 15)
    .attr('width', 15)
    .style('fill', 'grey');
  element1
    .append('text')
    .attr('x', 20)
    .attr('y', 13)
    .text('(tägliche Fallzahlen)');

  return Object.assign(svg.node(), {
    value: null,
    onmousemove: event => {
      event.currentTarget.value = {
        tag: tag,
        mittel: mittelwert.value,
        neu: tageswert.n_conf,
        woche: week
      };
      event.currentTarget.dispatchEvent(new CustomEvent("input"));
    }
  });
}
);
  main.variable(observer("dayChart")).define("dayChart", ["Generators", "viewof dayChart"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","dayChart"], function(md,dayChart){return(
md` *Lesebeispiel:*

${
  dayChart
    ? `Am ${dayChart.tag} wurden <b>${
        dayChart.neu
      } Neuansteckungen</b> gemeldet. Der Mittelwert der Neuansteckungen  über sieben Tage beträgt ${Math.round(
        dayChart.mittel
      )}.`
    : `Bitte fahren Sie mit der Maus über das Diagramm.`
}`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Todesfälle`
)});
  main.variable(observer("viewof dayChartDeath")).define("viewof dayChartDeath", ["d3","width","yScaleF","scaleTyp","datenZH","margin","xScale","height","xAxis","formatTime","datenZHTagAvgDeceased","bisect"], function(d3,width,yScaleF,scaleTyp,datenZH,margin,xScale,height,xAxis,formatTime,datenZHTagAvgDeceased,bisect)
{
  let widthNow = d3.min([768, width]);

  let yScale = yScaleF(scaleTyp, d3.extent(datenZH, d => d.n_deceased));
  let yAxis = g =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

  let line = d3
    .line()
    .defined(d => !isNaN(d.value))
    .x(d => xScale(d.date))
    .y(d => (yScale(d.value)));
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr('id', 'STATchart1');
  const axisGr = svg.append('g');
  const mouseGr = svg.append('g');
  const chartGr = svg.append('g').attr('pointer-events', 'none');

  axisGr.append("g").call(xAxis);
  axisGr.append("g").call(yAxis);
  let balkenWidth = (width - margin.left - margin.right) / datenZH.length;

  const mouseRect = mouseGr
    .selectAll('rect.STATmouse')
    .data(datenZH)
    .enter()
    .append('rect')
    .attr('id', d => 'm' + formatTime(d.date))
    .attr('class', 'STATmouse')
    .attr('cursor', 'pointer')
    .attr("fill", "white")
    .attr("stroke-width", 0.5)
    .attr("stroke", "white")
    .attr("opacity", 0)
    .attr("x", (d, i) => xScale(d.date))
    .attr("y", 0)
    .attr("width", balkenWidth)
    .attr("height", height);

  let balken = chartGr.selectAll('rect').data(datenZH);

  balken
    .enter()
    .append('rect')
    .attr('id', d => 'a' + formatTime(d.date))
    .attr("fill", "grey")
    .attr("stroke-width", 0.5)
    .attr("stroke", "white")
    .attr("opacity", 0.7)
    .attr("x", (d, i) => xScale(d.date))
    .attr("y", (d, i) => yScale(d.n_deceased))
    .attr("width", balkenWidth)
    .attr("height", d => yScale(0) - yScale(d.n_deceased));

  chartGr
    .append('g')
    .attr('transform', 'translate(' + balkenWidth / 2 + ',' + 0 + ')')
    .append("path")
    .datum(datenZHTagAvgDeceased)
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", "tomato")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

  let tag, tageswert, mittelwert, week;

  mouseGr.selectAll('rect').on('mouseover', function(d) {
    tageswert = d;

    tag = d3
      .timeParse("%Q")(+d.date)
      .toLocaleString("de-CH", {
        day: "numeric",
        month: "long"
      });

    mittelwert = bisect(datenZHTagAvgDeceased, d3.timeParse("%Q")(+d.date));

    week = d3.timeFormat('%U')(d3.timeParse("%Q")(+d.date));

    chartGr.selectAll('rect').attr('opacity', 0.7);

    chartGr.select('#a' + formatTime(+d.date)).attr('opacity', 1);

    chartGr.select('#thisMouse').remove();
    let thisMouse = chartGr.append('g').attr('id', 'thisMouse');

    let translateX = d3.min([
      width - margin.right - margin.left - 20,
      d3.max([xScale(d.date) - 40, 0])
    ]);
    let translateY = d3.min([height - 60, yScale(mittelwert.value)]) - 60;

    let thisGr = thisMouse
      .append('g')
      .attr('transform', 'translate(' + translateX + ',' + translateY + ')');

    thisGr
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 80)
      .attr('height', 45)
      .style('fill', 'white')
      .style('opacity', 0.6);

    thisGr
      .append('text')
      .attr('dx', 40)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(tag);

    let text1 = '';

    if (mittelwert.value >= 0) {
      text1 = Math.round(mittelwert.value);
    }
    thisGr
      .append('text')
      .attr('dx', 30)
      .attr('dy', '2.2em')
      .style('text-anchor', 'end')
      .style('fill', 'tomato')
      .text(text1);

    thisGr
      .append('text')
      .attr('dx', 72)
      .attr('dy', '2.2em')
      .style('text-anchor', 'end')
      .style('fill', 'grey')
      .text('(' + tageswert.n_deceased + ')');
  });
  let element2 = svg.append('g').attr('transform', 'translate(0,500)');
  element2
    .append('line')
    .attr('x1', 0)
    .attr('x2', 15)
    .attr('y1', 8)
    .attr('y2', 8)
    .style('stroke', 'tomato')
    .style('stroke-width', 3);

  element2
    .append('text')
    .attr('x', 20)
    .attr('y', 13)
    .text('gleitendes Mittel (7 Tage)');
  let element1 = svg.append('g').attr('transform', 'translate(220,500)');
  element1
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', 15)
    .attr('width', 15)
    .style('fill', 'grey');
  element1
    .append('text')
    .attr('x', 20)
    .attr('y', 13)
    .text('(tägliche Todesfälle)');

  return Object.assign(svg.node(), {
    value: null,
    onmousemove: event => {
      event.currentTarget.value = {
        tag: tag,
        mittel: mittelwert.value,
        neu: tageswert.n_deceased,
        woche: week
      };
      event.currentTarget.dispatchEvent(new CustomEvent("input"));
    }
  });
}
);
  main.variable(observer("dayChartDeath")).define("dayChartDeath", ["Generators", "viewof dayChartDeath"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","dayChartDeath"], function(md,dayChartDeath){return(
md` *Lesebeispiel:*

${
  dayChartDeath
    ? `Am ${dayChartDeath.tag} wurden <b>${
        dayChartDeath.neu
      } Todesfälle</b> gemeldet. Der Mittelwert der Todesfälle über sieben Tage beträgt ${Math.round(
        dayChartDeath.mittel
      )}.`
    : `Bitte fahren Sie mit der Maus über das Diagramm.`
}`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Hospitalisierte / Beatmete`
)});
  main.variable(observer("dayChartHosp")).define("dayChartHosp", ["d3","width","yScaleF","scaleTyp","datenZH","margin","xScale","height","xAxis","formatTime"], function(d3,width,yScaleF,scaleTyp,datenZH,margin,xScale,height,xAxis,formatTime)
{
  let widthNow = d3.min([768, width]);

  let yScale = yScaleF(scaleTyp, d3.extent(datenZH, d => +d.current_hosp));
  let yAxis = g =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

  let line1 = d3
    .line()
    .defined(d => !isNaN(d.current_hosp))
    .x(d => xScale(d.date))
    .y(d => yScale(d.current_hosp));

  let line2 = d3
    .line()
    .defined(d => !isNaN(d.current_vent))
    .x(d => xScale(d.date))
    .y(d => yScale(d.current_vent));

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr('id', 'STATchart1');
  const axisGr = svg.append('g');
  const mouseGr = svg.append('g');
  const chartGr = svg.append('g').attr('pointer-events', 'none');

  axisGr.append("g").call(xAxis);
  axisGr.append("g").call(yAxis);
  let balkenWidth = (width - margin.left - margin.right) / datenZH.length;

  const mouseRect = mouseGr
    .selectAll('rect.STATmouse')
    .data(datenZH)
    .enter()
    .append('rect')
    .attr('id', d => 'm' + formatTime(d.date))
    .attr('class', 'STATmouse')
    .attr('cursor', 'pointer')
    .attr("fill", "white")
    .attr("stroke-width", 0.5)
    .attr("stroke", "white")
    .attr("opacity", 0)
    .attr("x", (d, i) => xScale(d.date))
    .attr("y", 0)
    .attr("width", balkenWidth)
    .attr("height", height);

  chartGr
    .append('g')
    .attr('transform', 'translate(' + balkenWidth / 2 + ',' + 0 + ')')
    .append("path")
    .datum(datenZH)
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line1);

  chartGr
    .append('g')
    .attr('transform', 'translate(' + balkenWidth / 2 + ',' + 0 + ')')
    .append("path")
    .datum(datenZH)
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", "SkyBlue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line2);
  let tag, tageswert, hosp, vent, week;

  mouseGr.selectAll('rect').on('mouseover', function(d) {
    tageswert = d;

    tag = d3
      .timeParse("%Q")(+d.date)
      .toLocaleString("de-CH", {
        day: "numeric",
        month: "long"
      });

    hosp = tageswert.current_hosp;
    vent = tageswert.current_vent;

    week = d3.timeFormat('%U')(d3.timeParse("%Q")(+d.date));

    chartGr.selectAll('rect').attr('opacity', 0.7);

    chartGr.select('#a' + formatTime(+d.date)).attr('opacity', 1);

    chartGr.select('#thisMouse').remove();
    let thisMouse = chartGr.append('g').attr('id', 'thisMouse');

    let translateX = d3.min([
      width - margin.right - margin.left - 20,
      d3.max([xScale(d.date) - 40, 0])
    ]);

    let translateY = d3.min([height - 60, yScale(tageswert.current_hosp)]) - 60;

    let thisGr = thisMouse
      .append('g')
      .attr('transform', 'translate(' + translateX + ',' + translateY + ')');

    thisGr
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 80)
      .attr('height', 45)
      .style('fill', 'white')
      .style('opacity', 0.6);

    thisGr
      .append('text')
      .attr('dx', 40)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(tag);

    let text1 = '';
    let text2 = '';

    if (hosp >= 0) {
      text1 = Math.round(hosp);
    }

    if (vent >= 0) {
      text2 = Math.round(vent);
    }

    thisGr
      .append('text')
      .attr('dx', 30)
      .attr('dy', '2.2em')
      .style('text-anchor', 'end')
      .style('fill', 'steelblue')
      .text(text1);

    thisGr
      .append('text')
      .attr('dx', 72)
      .attr('dy', '2.2em')
      .style('text-anchor', 'end')
      .style('fill', 'skyblue')
      .text('/ ' + text2);
  });

  let element2 = svg.append('g').attr('transform', 'translate(0,500)');
  element2
    .append('line')
    .attr('x1', 0)
    .attr('x2', 15)
    .attr('y1', 8)
    .attr('y2', 8)
    .style('stroke', 'steelblue')
    .style('stroke-width', 3);

  element2
    .append('text')
    .attr('x', 20)
    .attr('y', 13)
    .text('Hospitalisierte');

  let element1 = svg.append('g').attr('transform', 'translate(220,500)');
  element1
    .append('line')
    .attr('x1', 0)
    .attr('x2', 15)
    .attr('y1', 8)
    .attr('y2', 8)
    .style('stroke', 'SkyBlue')
    .style('stroke-width', 3);

  element1
    .append('text')
    .attr('x', 20)
    .attr('y', 13)
    .text('Beatmete');

  return Object.assign(svg.node(), {
    value: null,
    onmousemove: event => {
      event.currentTarget.value = {
        tag: tag,
        mittel: tageswert.current_hosp,
        neu: tageswert.n_deceased,
        woche: week
      };
      event.currentTarget.dispatchEvent(new CustomEvent("input"));
    }
  });
}
);
  main.variable(observer("viewof scaleTyp")).define("viewof scaleTyp", ["DOM"], function(DOM){return(
DOM.select(["linear", "log"])
)});
  main.variable(observer("scaleTyp")).define("scaleTyp", ["Generators", "viewof scaleTyp"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","week_extent"], function(md,week_extent){return(
md`## Neuansteckungen pro Bezirk in Woche ${week_extent[1]}:`
)});
  main.variable(observer("map")).define("map", ["d3","width","heightMap","mapDataRegions","path","datenRegionWoche","mouseOver","mouseOut","colorScale","datenRegionNeuMax","margin"], function(d3,width,heightMap,mapDataRegions,path,datenRegionWoche,mouseOver,mouseOut,colorScale,datenRegionNeuMax,margin)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, 20 + heightMap + 30]);
  const chartGr = svg
    .append('g')
    .attr('id', 'chartGr')
    .attr('transform', 'translate(0,20)');


  var paths = chartGr
    .append('g')
    .attr('id', 'Gemeinden')
    .selectAll(".gemeinde")
    .data(mapDataRegions.features)
    .enter()
    .append("path")
    .attr('class', 'gemeinde')
    .attr('id', d => 'bez_' + d.properties.BEZ_ID)
    .attr("d", path)
    .style("cursor", "pointer")
    .attr('pointer-events', function(d) {
      if (d.properties.BEZ_N == 'See') {
        return 'none';
      }
    })
    .style('fill', function(d) {
      if (d.properties.BEZ_N == 'See') {
        return 'steelblue';
      } else {
        return 'grey';
      }
    })
    .style('stroke-width', 0.5)
    .style('fill-opacity', function(d) {
      return 1;
    })
    .style('stroke', function(d) {
      return 'grey';
    })
    .on('mouseover', function(d) {
      let thisId = d.properties.BEZ_ID;
      let thisData = datenRegionWoche.filter(
        el => el.DistrictId == d.properties.BEZ_ID
      )[0];
      let that = d3.select('#bez_' + thisId);
      let bbox = this.getBBox();

      let mouseGr = chartGr.append('g').attr('id', 'mouseGr');
      d3.mouse(this)[0];

      mouseOver(d, that, bbox, '#mouseGr', thisData, path);
    })
    .on('mouseout', function() {
      mouseOut();
    });

  for (let i = 0; i < datenRegionWoche.length; i++) {
    chartGr
      .select('#bez_' + datenRegionWoche[i].DistrictId)
      .style('fill', colorScale(+datenRegionWoche[i].NewConfCases));
  }
  let legenden = [0, 5, 10, 50, datenRegionNeuMax];
  let middle = (width - margin.left - margin.right) / 2 + margin.left;

  let legScale = d3
    .scaleLinear()
    .range([
      margin.left + width / 10,
      width - margin.left - margin.right - width / 10
    ])
    .domain(d3.extent(legenden));

  for (let i = 0; i <= datenRegionNeuMax; i++) {
    svg
      .append('rect')
      .attr('fill', colorScale([i]))
      .attr('stroke', 'none')
      .attr('x', legScale([i]))
      .attr('y', heightMap + 22.5)
      .attr('width', (width - margin.left - margin.right) / datenRegionNeuMax)
      .attr('height', 10);
  }
  for (let i = 0; i < legenden.length; i++) {
    svg
      .append('text')
      .attr('x', legScale(legenden[i]))
      .attr('y', heightMap + 50)
      .text(legenden[i])
      .attr('text-anchor', 'middle');
  }
  return svg.node();
}
);
  main.variable(observer()).define(["table","datenRegionWoche"], function(table,datenRegionWoche){return(
table(datenRegionWoche, {
  sortable: true,
  style: 'compact',
  paged: 100,
  columns: {
    District: {
      title: ""
    },
    Population: {
      title: "Bevölkerung",
      formatter(val, i) {
        return (+val).toLocaleString('de-CH');
      }
    },
    DistrictId: {
      title: "",
      formatter(val, i) {
        return '';
      }
    },
    Week: {
      title: "",
      formatter(val, i) {
        return '';
      }
    },
    Year: {
      title: "",
      formatter(val, i) {
        return '';
      }
    },
    NewConfCases: {
      title: "Neue Ansteckungen"
    },
    NewDeaths: {
      title: "neue Todesfälle"
    },
    TotalConfCases: {
      title: "Total Ansteckungen"
    },
    TotalDeaths: {
      title: "Total Todesfälle"
    }
  }
})
)});
  main.variable(observer("mapDiv")).define("mapDiv", ["d3","width","DOM","height","L","latOrg","lngOrg","mapDataRegions4326","datenRegionWoche","mouseOut","colorScale","datenRegionNeuMax","margin","heightMap"], function*(d3,width,DOM,height,L,latOrg,lngOrg,mapDataRegions4326,datenRegionWoche,mouseOut,colorScale,datenRegionNeuMax,margin,heightMap)
{
  let widthNow = d3.min([width,768]);
  let container = DOM.element('div', {
    style: `width:${widthNow}px;height:${height + 90}px;margin: 0 auto;`
  });

  yield container;

  let zoomOrg = 9.5;
  let map = L.map(container, { zoomControl: false }).setView(
    [latOrg, lngOrg],
    zoomOrg
  );

  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();

  L.tileLayer
    .wms('https://wms.zh.ch/ZHWEB', {
      maxZoom: 14,
      layers: 'Geometrie' //,Beschriftungen'
    })
    .addTo(map);

  L.svg().addTo(map);

  const overlay = d3
    .select(map.getPanes().overlayPane)
    .attr('pointer-events', 'auto');
  const svgMap = overlay.select('svg').attr('pointer-events', 'auto');

  const g = svgMap
    .append('g')
    .attr('class', 'leaflet-zoom-hide')
    .attr('id', 'g');
  //map.addControl(new customControl1());

  const projectPoint = function(x, y) {
    const point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  };

  const transform = d3.geoTransform({ point: projectPoint });
  const path = d3.geoPath().projection(transform);

  const featureElement = g
    .selectAll('path')
    .data(mapDataRegions4326.features)
    .enter()
    .append('path')
    .style('fill', d => (d.properties.BEZ_N == "See" ? "none" : "tomato"))
    .attr('id', d => 'bez_' + d.properties.BEZ_ID)
    .attr('class', 'bezirke')
    .style('fill-opacity', 0.85)
    .style('stroke', 'grey')
    .on('mouseover', function(d) {
      let thisId = d.properties.BEZ_ID;
      console.log(thisId);
      let thisData = datenRegionWoche.filter(el => el.DistrictId == thisId)[0];
      console.log(thisData);
      let that = d3.select('#bez_' + thisId);
      let bbox = this.getBBox();

      let mouseGr = g.append('g').attr('id', 'mouseGr');

      //var thisBfs = thisData.properties.BEZ_ID;

      var mouseOverRW = 217,
        mouseOverRH = 48;
      //Position Tooltip
      var xPos = bbox.x + bbox.width / 2,
        yPos = bbox.y + bbox.height / 2;
      //Korrektur, damit tooltip nicht über den Rand hinaus geht:
      if (xPos > widthNow / 2) {
        xPos = bbox.x + bbox.width / 2 - mouseOverRW;
      }
      if (yPos > 80) {
        yPos = bbox.y + bbox.height / 2 - mouseOverRH;
      }
      var mouseOverL = d3
        .select('#g')
        .append('g')
        .attr('id', 'mouseOverL')
        .attr('pointer-events', 'none');

      var mouseOverP = mouseOverL.append('g').attr('id', 'mouseOverP');
      var mouseOverT = mouseOverL
        .append('g')
        .attr('id', 'mouseOverT')
        .attr('transform', 'translate(' + xPos + ',' + yPos + ')');

      g.selectAll('path.bezirke')
        .style('stroke-width', 0.1)
        .style('fill-opacity', 0.4);

      d3.select(this)
        .style('stroke', 'black')
        .style('stroke-width', 2)
        .style('fill-opacity', 0.85);

      mouseOverT
        .append('rect')
        .attr('x', -5)
        .attr('y', 0)
        .attr('width', mouseOverRW)
        .attr('height', mouseOverRH)
        .style('fill', 'white')
        .attr('fill-opacity', 0.8)
        .style('stroke', 'dimgrey');

      mouseOverT
        .append('text')
        .attr('x', 2)
        .attr('y', 16)
        .style('font-size', 14 + 'px')
        .style('font-weight', 'bold')
        .text(thisData.District)
        .style('font-family', 'Helvetica');

      mouseOverT
        .append('text')
        .attr('x', 2)
        .attr('y', 16)
        .attr('dy', '1.4em')
        .style('font-size', 14 + 'px')
        .text('Neuansteckungen: ' + thisData.NewConfCases)
        .style('font-family', 'Helvetica');
    })
    .on('mouseout', function() {
      g.selectAll('path')
        .style('stroke-width', 0.5)
        .style('fill-opacity', 0.85);
      d3.select(this).style('stroke', 'grey');
      mouseOut();
    });

  for (let i = 0; i < datenRegionWoche.length; i++) {
    g.select('#bez_' + datenRegionWoche[i].DistrictId).style(
      'fill',
      colorScale(+datenRegionWoche[i].NewConfCases)
    );
  }
  let legenden = [0, 5, 10, 50, datenRegionNeuMax];
  let middle = (widthNow - margin.left - margin.right) / 2 + margin.left;

  let legScale = d3
    .scaleLinear()
    .range([
      margin.left + widthNow / 10,
      widthNow - margin.left - margin.right - width / 10
    ])
    .domain(d3.extent(legenden));

  for (let i = 0; i <= datenRegionNeuMax; i++) {
    g.append('rect')
      .attr('fill', colorScale([i]))
      .attr('stroke', 'none')
      .attr('x', legScale([i]))
      .attr('y', heightMap + 90)
      .attr('width', (widthNow - margin.left - margin.right) / datenRegionNeuMax)
      .attr('height', 10);
  }
  for (let i = 0; i < legenden.length; i++) {
    g.append('text')
      .attr('x', legScale(legenden[i]))
      .attr('y', heightMap + 116)
      .text(legenden[i])
      .style('font-size', 14 + 'px')
      .style('text-anchor', 'middle');
  }
  // Function to place svg based on zoom
  const onZoom = () => featureElement.attr('d', path);
  // initialize positioning
  onZoom();
  // reset whenever map is moved
  map.on('zoomend', onZoom);
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Postleitzahlen`
)});
  main.variable(observer("mapDivPlz")).define("mapDivPlz", ["d3","width","DOM","height","L","latOrg","lngOrg","mapPlz","datenPlzTag","mouseOut","colorScalePlz","margin","heightMap"], function*(d3,width,DOM,height,L,latOrg,lngOrg,mapPlz,datenPlzTag,mouseOut,colorScalePlz,margin,heightMap)
{
  let widthNow = d3.min([width,768]);
  let container = DOM.element('div', {
    style: `width:${widthNow}px;height:${height + 90}px;margin: 0 auto;pointer-events:none;`
  });

  yield container;

  let zoomOrg = 9.5;
  let mapStat = L.map(container, { zoomControl: false }).setView(
    [latOrg, lngOrg],
    zoomOrg
  );

  mapStat.touchZoom.disable();
  mapStat.doubleClickZoom.disable();
  mapStat.scrollWheelZoom.disable();
  mapStat.boxZoom.disable();
  mapStat.keyboard.disable();
  mapStat.dragging.disable();

  L.tileLayer
    .wms('https://wms.zh.ch/ZHWEB', {
      maxZoom: 14,
      layers: 'Geometrie' //,Beschriftungen'
    })
    .addTo(mapStat);

  L.svg().addTo(mapStat);

  const overlay = d3
    .select(mapStat.getPanes().overlayPane)
    .attr('pointer-events', 'all');
  const svgMap = overlay.select('svg')
    .attr('pointer-events', 'all');
  

  const g = svgMap
    .append('g')
    .attr('class', 'leaflet-zoom-hide')
    .attr('id', 'g');
  //map.addControl(new customControl1());

  const projectPoint = function(x, y) {
    const point = mapStat.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  };

  const transform = d3.geoTransform({ point: projectPoint });
  const path = d3.geoPath().projection(transform);

  const featureElement = g
    .selectAll('path')
    .data(mapPlz.features)
    .enter()
    .append('path')
    .style('fill', d => (d.properties.PLZ == "See" ? "none" : "grey"))
    .attr('id', d => 'plz_' + d.properties.PLZ)
    .attr('class', 'bezirke')
    .style('fill-opacity', 0.85)
    .style('stroke', 'grey')
    .style('cursor', 'pointer')
    .attr('pointer-events','all')
    .on('mouseover', function(d) {
      let thisId = d.properties.PLZ;
      console.log(thisId);
      let thisData = datenPlzTag.filter(el => el.PLZ == thisId)[0];

      let that = d3.select('#plz' + thisId);
      let bbox = this.getBBox();

      let mouseGr = g.append('g').attr('id', 'mouseGr');

      var mouseOverRW = 190,
        mouseOverRH = 58;
      //Position Tooltip
      var xPos = bbox.x + bbox.width / 2,
        yPos = bbox.y + bbox.height / 2;

      //Korrektur, damit tooltip nicht über den Rand hinaus geht:
      if (xPos > widthNow / 2) {
        xPos = bbox.x + bbox.width / 2 - mouseOverRW;
      }
      if (yPos > 80) {
        yPos = bbox.y + bbox.height / 2 - mouseOverRH;
      }

      var mouseOverL = mouseGr
        .append('g')
        .attr('id', 'mouseOverL')
        .attr('pointer-events', 'none');

      var mouseOverP = mouseOverL.append('g').attr('id', 'mouseOverP');
      var mouseOverT = mouseOverL
        .append('g')
        .attr('id', 'mouseOverT')
        .attr('transform', 'translate(' + xPos + ',' + yPos + ')');

      g.selectAll('path.bezirke')
        .style('stroke-width', 0.1)
        .style('fill-opacity', 0.4);

      d3.select(this)
        .style('stroke', 'black')
        .style('stroke-width', 2)
        .style('fill-opacity', 0.85);

      var mouseRect = mouseOverT
        .append('rect')
        .attr('x', -5)
        .attr('y', 0)
        .attr('width', mouseOverRW)
        .attr('height', mouseOverRH)
        .style('fill', 'white')
        .attr('fill-opacity', 0.8)
        .style('stroke', 'dimgrey');

      mouseOverT
        .append('text')
        .attr('x', 2)
        .attr('y', 16)
        .style('font-size', 14 + 'px')
        .style('font-weight', 'bold')
        .text(d.properties.PLZ)
        .style('font-family', 'Helvetica');

      let mouseName = mouseOverT
        .append('text')
        .attr('x', 2)
        .attr('y', 16)
        .attr('dy', '1.2em')
        .style('font-size', 12 + 'px')
        .text('(' + d.properties.Ortschaftsname + ')')
        .style('font-family', 'Helvetica');

      mouseOverT
        .append('text')
        .attr('x', 2)
        .attr('y', 16)
        .attr('dy', '2.2em')
        .style('font-size', 14 + 'px')
        .text('Neuansteckungen: ' + thisData.NewConfCases_7days)
        .style('font-family', 'Helvetica');

      mouseOverRW = d3.max([mouseOverRW, mouseName.node().getBBox().width + 8]);
      mouseRect.attr('width', mouseOverRW);
    })
    .on('mouseout', function() {
      d3.select('#mouseGr').remove();
      g.selectAll('path')
        .style('stroke-width', 0.5)
        .style('fill-opacity', 0.85);
      d3.select(this).style('stroke', 'grey');
      mouseOut();
    });

  for (let i = 0; i < datenPlzTag.length; i++) {
    g.select('#plz_' + datenPlzTag[i].PLZ).style(
      'fill',
      colorScalePlz(datenPlzTag[i].NewConfCases_7days)
    );
  }
  let legenden = colorScalePlz.domain();
  console.log(legenden);
  let middle = (widthNow - margin.left - margin.right) / 2 + margin.left;

  for (let i = 0; i < legenden.length - 1; i++) {
    g.append('rect')
      .attr('fill', colorScalePlz(legenden[i]))
      .attr('stroke', 'none')
      .attr('x', widthNow / 2 - (legenden.length - 1) * 20 + i * 42)
      .attr('y', heightMap + 90)
      .attr('width', 20)
      .attr('height', 13);

    g.append('text')
      .attr('x', widthNow / 2 - (legenden.length - 1) * 20 + i * 42 + 10)
      .attr('y', heightMap + 118)
      .text(legenden[i])
      .style('font-size', 14 + 'px')
      .style('text-anchor', 'middle');
  }
  d3.selectAll('.leaflet-pane').style('pointer-events', 'none');
  
  d3.selectAll('.leaflet-map-pane').style('pointer-events', 'all');
  // Function to place svg based on zoom
  const onZoom = () => featureElement.attr('d', path);
  // initialize positioning
  onZoom();
  // reset whenever map is moved
  mapStat.on('zoomend', onZoom);
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Altersverteilung`
)});
  main.variable(observer("alterChart")).define("alterChart", ["d3","width","height"], function(d3,width,height)
{
  let widthNow = d3.min([768, width]);

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr('id', 'alterChart');
  
  
   
  
  
  

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Daten`
)});
  main.variable(observer()).define(["md","metadata"], function(md,metadata){return(
md`**Beschreibung**: ${metadata.result.description.de}

**Author**: ${metadata.result.author}

**Quelle**: https://opendata.swiss/de/dataset/covid_19-fallzahlen-kanton-zuerich`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<a href="https://opendata.swiss/de/terms-of-use/" target="_blank"> <img class="alignnone" src="https://opendata.swiss/content/themes/wp-ogdch-theme/assets/images/terms/terms_by.svg" alt="" width="74" height="58"></a>`
)});
  main.variable(observer("value")).define("value", function(){return(
"ncumul_conf"
)});
  main.variable(observer("datenZH")).define("datenZH", ["d3","parseTime"], function(d3,parseTime){return(
d3
  .csv(
    "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_total_csv_v2/COVID19_Fallzahlen_Kanton_ZH_total.csv"
  )
  .then(function(data) {
    let oldConf = 0;
    let oldDeceased = 0;
    data.forEach(function(d) {
      d.date = parseTime(d.date);
      d.ncumul_tested.length > 0
        ? (d.ncumul_tested = +d.ncumul_tested)
        : (d.ncumul_tested = undefined);
      d.ncumul_conf.length > 0
        ? (d.ncumul_conf = +d.ncumul_conf)
        : (d.ncumul_conf = undefined);
      d.n_conf = d.ncumul_conf - oldConf;
      d.n_deceased = d.ncumul_deceased - oldDeceased;
      d.new_hosp.length > 0
        ? (d.new_hosp = +d.new_hosp)
        : (d.new_hosp = undefined);
      d.current_hosp.length > 0
        ? (d.current_hosp = +d.current_hosp)
        : (d.current_hosp = undefined);
      d.current_icu.length > 0
        ? (d.current_icu = +d.current_icu)
        : (d.current_icu = undefined);
      d.current_vent.length > 0
        ? (d.current_vent = +d.current_vent)
        : (d.current_vent = undefined);
      d.ncumul_released.length > 0
        ? (d.ncumul_released = +d.ncumul_released)
        : (d.ncumul_released = undefined);
      d.ncumul_deceased.length > 0
        ? (d.ncumul_deceased = +d.ncumul_deceased)
        : (d.ncumul_deceased = 0);
      d.current_isolated.length > 0
        ? (d.current_isolated = +d.current_isolated)
        : (d.current_isolated = undefined);
      d.current_quarantined.length > 0
        ? (d.current_quarantined = +d.current_quarantined)
        : (d.current_quarantined = undefined);
      oldConf = d.ncumul_conf;
      oldDeceased = +d.ncumul_deceased;
    });
    return data;
  })
)});
  main.variable(observer("datenAlterGeschlecht")).define("datenAlterGeschlecht", ["d3","parseTime"], function(d3,parseTime){return(
d3
  .csv(
    "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_alter_geschlecht_csv/COVID19_Fallzahlen_Kanton_ZH_altersklassen_geschlecht.csv"
    //"https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_alter_geschlecht_csv/COVID19_Fallzahlen_Kanton_ZH_alter_geschlecht.csv"
  )
  .then(function(data) {
    data.forEach(function(d) {
      d.date = parseTime(d.Date);
      d.AgeYear = +d.AgeYear;
      d.NewConfCases = +d.NewConfCases;
      d.NewDeaths = +d.NewDeaths;
    });
    return data;
  })
)});
  main.variable(observer("datenAlterGeschlechtWoche")).define("datenAlterGeschlechtWoche", ["datenAlterGeschlecht","d3"], function(datenAlterGeschlecht,d3){return(
datenAlterGeschlecht.filter(
  el => el.Week == d3.max(datenAlterGeschlecht, d => +d.Week)
)
)});
  main.variable(observer("datenRegion")).define("datenRegion", ["d3"], function(d3){return(
d3.csv(
  "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_bezirke/fallzahlen_kanton_ZH_bezirk.csv"
)
)});
  main.variable(observer("dataPlz")).define("dataPlz", ["d3","parseTime"], function(d3,parseTime){return(
d3
  .csv(
    "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_plz/fallzahlen_kanton_ZH_plz.csv"
  )
  .then(function(data) {
    data.forEach(function(d) {
      d.date = parseTime(d.Date);
      d.Population = +d.Population;
    });
    return data;
  })
)});
  main.variable(observer("datenPlzTag")).define("datenPlzTag", ["dataPlz","d3"], function(dataPlz,d3){return(
dataPlz.filter(el => el.Date == d3.max(dataPlz, d => d.Date))
)});
  main.variable(observer("mapDataRegions")).define("mapDataRegions", ["d3"], function(d3){return(
d3.json(
  "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_bezirke/BezirkeAlleSee_gen_epsg2056_F_KTZH_2020.json"
)
)});
  main.variable(observer("datenRegionWoche")).define("datenRegionWoche", ["datenRegion","week_extent"], function(datenRegion,week_extent){return(
datenRegion.filter(el => el.Week == week_extent[1])
)});
  main.variable(observer("datenZHTagAvg")).define("datenZHTagAvg", ["movingAverage","datenZH"], function(movingAverage,datenZH){return(
movingAverage(datenZH.map(d => [d.n_conf, d.date]), 7)
)});
  main.variable(observer("datenZHTagAvgDeceased")).define("datenZHTagAvgDeceased", ["movingAverage","datenZH"], function(movingAverage,datenZH){return(
movingAverage(
  datenZH.map(d => [d.n_deceased, d.date]),
  7
)
)});
  main.variable(observer("mapDataRegions4326")).define("mapDataRegions4326", ["d3"], function(d3){return(
d3.json(
  "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_bezirke/BezirkeAlleSee_gen_epsg4326_F_KTZH_2020.json"
)
)});
  main.variable(observer("mapPlz")).define("mapPlz", ["d3"], function(d3){return(
d3.json(
  "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_plz/PLZ_gen_epsg4326_F_KTZH_2020.json"
)
)});
  main.variable(observer("datenAlterRef")).define("datenAlterRef", ["d3"], function(d3){return(
d3
  .dsv(
    ";",
    "https://cors-anywhere.herokuapp.com/https://www.web.statistik.zh.ch/ogd/data/KANTON_ZUERICH_bevoelkerung_1jahresklassen.csv"
  )
)});
  main.variable(observer("alterRefMaxJahr")).define("alterRefMaxJahr", ["d3","datenAlterRef"], function(d3,datenAlterRef){return(
d3.max(datenAlterRef, d => +d.JAHR)
)});
  main.variable(observer("datenAlterRefAkt")).define("datenAlterRefAkt", ["datenAlterRef","alterRefMaxJahr"], function(datenAlterRef,alterRefMaxJahr){return(
datenAlterRef.filter(d => d.JAHR == alterRefMaxJahr)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Berechnungen`
)});
  main.variable(observer("week_extent")).define("week_extent", ["d3","datenRegion"], function(d3,datenRegion){return(
d3.extent(datenRegion, d => +d.Week)
)});
  main.variable(observer("dateZH_extent")).define("dateZH_extent", ["d3","datenZH"], function(d3,datenZH){return(
d3.extent(datenZH, d => d.date)
)});
  main.variable(observer("valueZH_extent")).define("valueZH_extent", ["d3","datenZH"], function(d3,datenZH){return(
d3.extent(datenZH, d => d.n_conf)
)});
  main.variable(observer("datenRegionNeu_extent")).define("datenRegionNeu_extent", ["d3","datenRegion"], function(d3,datenRegion){return(
d3.extent(datenRegion, d => +d.NewConfCases)
)});
  main.variable(observer("datenRegionNeuMax")).define("datenRegionNeuMax", function(){return(
100
)});
  main.variable(observer("colorScale")).define("colorScale", ["d3","datenRegionNeuMax"], function(d3,datenRegionNeuMax){return(
d3
  .scaleSequentialLog(d3.interpolateGreys)
  .domain([1, datenRegionNeuMax])
)});
  main.variable(observer("colorScalePlz")).define("colorScalePlz", ["d3"], function(d3){return(
d3
  .scaleOrdinal()
  .domain(["0-3", "4-6", "7-9", "10-12", "13-15", "16-18", "19-21", "+21"])
  .range([
    "#FFFFB4",
    "#FFFF66",
    "#E0E85D",
    "#C1D254",
    "#A2BC4B",
    "#84A642",
    "#65903A",
    "#467A31"
  ])
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Libraries, parameters and functions`
)});
  main.variable(observer("lngOrg")).define("lngOrg", function(){return(
8.66
)});
  main.variable(observer("latOrg")).define("latOrg", function(){return(
47.42
)});
  main.variable(observer("customControl1")).define("customControl1", ["L","resetZoom"], function(L,resetZoom){return(
L.Control.extend({
  options: {
    position: 'topright'
  },
  onAdd: function(map) {
    var container = L.DomUtil.create(
      'div',
      'leaflet-bar leaflet-control leaflet-control-custom'
    );
    container.innerHTML = 'Reset Zoom';
    container.style.backgroundColor = 'white';
    container.style.padding = '5px';

    container.onclick = function() {
      resetZoom();
    };

    return container;
  }
})
)});
  main.variable(observer("resetZoom")).define("resetZoom", ["map","latOrg","lngOrg"], function(map,latOrg,lngOrg){return(
function() {
  map.setView([latOrg, lngOrg], 9.7);
}
)});
  main.variable(observer("mouseOver")).define("mouseOver", ["width","d3","path"], function(width,d3,path){return(
function(thisData, that, bbox, map, data, pfad) {
  var thisBfs = thisData.properties.BEZ_ID;

  var mouseOverRW = 217,
    mouseOverRH = 48;
  //Position Tooltip
  var xPos = bbox.x + bbox.width / 2,
    yPos = bbox.y + bbox.height / 2;
  //Korrektur, damit tooltip nicht über den Rand hinaus geht:
  if (xPos > width / 2) {
    xPos = bbox.x + bbox.width / 2 - mouseOverRW;
  }
  if (yPos > 80) {
    yPos = bbox.y + bbox.height / 2 - mouseOverRH;
  }
  var mouseOverL = d3
    .select(map)
    .append('g')
    .attr('id', 'mouseOverL')
    .attr('pointer-events', 'none');

  var mouseOverP = mouseOverL.append('g').attr('id', 'mouseOverP');
  var mouseOverT = mouseOverL
    .append('g')
    .attr('id', 'mouseOverT')
    .attr('transform', 'translate(' + xPos + ',' + yPos + ')');

  mouseOverP
    .append('path')
    .attr("class", 'mouse')
    .attr("d", that.attr('d'))
    .style('fill', 'none')
    .style('stroke', 'dimgrey')
    .style('stroke-width', 2)
    .attr('d', path);

  mouseOverT
    .append('rect')
    .attr('x', -5)
    .attr('y', 0)
    .attr('width', mouseOverRW)
    .attr('height', mouseOverRH)
    .style('fill', 'white')
    .attr('fill-opacity', 0.8)
    .style('stroke', 'dimgrey');

  mouseOverT
    .append('path')
    .attr("class", 'mouse')
    .attr("d", that.attr('d'))
    .style('fill', 'whitesmoke')
    .attr('transform', 'translate(' + -xPos + ',' + -yPos + ')');

  mouseOverT
    .append('text')
    .attr('x', 2)
    .attr('y', 16)
    .style('font-size', 14 + 'px')
    .style('font-weight', 'bold')
    .text(thisData.properties.BEZ_N)
    .style('font-family', 'Helvetica');

  mouseOverT
    .append('text')
    .attr('x', 2)
    .attr('y', 16)
    .attr('dy', '1.4em')
    .style('font-size', 14 + 'px')
    .text('Neuansteckungen: ' + data.NewConfCases)
    .style('font-family', 'Helvetica');
}
)});
  main.variable(observer("mouseOut")).define("mouseOut", ["d3"], function(d3){return(
function() {
  d3.select('#mouseOverL').remove();
  d3.select('#mouseOverC').remove();

  d3.select('.Gemeinde')
    .selectAll('path')
    .style('stroke-width', 3)
    .style('fill-opacity', 1)
    .style('stroke-opacity', 1);
}
)});
  main.variable(observer("height")).define("height", function(){return(
530
)});
  main.variable(observer("heightMap")).define("heightMap", function(){return(
500
)});
  main.variable(observer("padding")).define("padding", function(){return(
10
)});
  main.variable(observer("mapSize")).define("mapSize", ["width","heightMap"], function(width,heightMap){return(
[width, heightMap]
)});
  main.variable(observer("margin")).define("margin", function(){return(
{ top: 40, right: 30, bottom: 60, left: 40 }
)});
  main.variable(observer("movingAverage")).define("movingAverage", function(){return(
function movingAverage(values, N) {
  let i = 0;
  let sum = 0;
  const means = []; 
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
    let mean = {};
    mean.value = NaN;
    mean.date = values[i][1];
    means[i] = mean;
    sum += values[i][0];
  }
  for (let n = values.length; i < n; ++i) {
    sum += values[i][0];
    let mean = {};
    mean.value = sum / N;
    mean.date = values[i][1];
    means[i] = mean;
    sum -= values[i - N + 1][0];
  }
  return means;
}
)});
  main.variable(observer("parseTime")).define("parseTime", ["d3"], function(d3){return(
d3.timeParse("%Y-%m-%d")
)});
  main.variable(observer("formatTime")).define("formatTime", ["d3"], function(d3){return(
d3.timeFormat("%Y-%m-%d")
)});
  main.variable(observer("xScale")).define("xScale", ["d3","dateZH_extent","margin","width"], function(d3,dateZH_extent,margin,width){return(
d3
  .scaleTime()
  .domain(dateZH_extent)
  .range([margin.left, width - margin.right])
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","xScale"], function(height,margin,d3,xScale){return(
g =>
  g.attr("transform", `translate(0,${height - margin.bottom})`).call(
    d3.axisBottom(xScale).tickFormat(d =>
      d.toLocaleString("de-CH", {
        day: "numeric",
        month: "long"
      })
    )
  )
)});
  main.variable(observer("yScaleF")).define("yScaleF", ["d3","height","margin","valueZH_extent"], function(d3,height,margin,valueZH_extent){return(
function(type, extent) {
  if (type == 'linear') {
    return d3
      .scaleLinear()
      .domain([0, extent[1]])
      .range([height - margin.bottom, margin.top]);
  } else if (type == 'log') {
    return d3
      .scaleLog()
      .domain([1, valueZH_extent[1]])
      .range([height - margin.bottom, margin.top]);
  }
}
)});
  main.variable(observer("projection")).define("projection", ["d3","padding","mapSize","mapDataRegions"], function(d3,padding,mapSize,mapDataRegions){return(
d3
  .geoIdentity()
  .reflectY(true)
  .fitExtent(
    [[padding, padding], mapSize.map(d => d - padding)],
    mapDataRegions
  )
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath(projection)
)});
  main.variable(observer("bisect")).define("bisect", ["d3"], function(d3)
{
  const bisectDate = d3.bisector(d => d.date).left;
  return (data, date) => {
    const i = bisectDate(data, date, 1);
    const a = data[i - 1],
      b = data[i];
    return date - a.date > b.date - date ? b : a;
  };
}
);
  main.variable(observer("odswissId")).define("odswissId", function(){return(
"covid_19-fallzahlen-kanton-zuerich"
)});
  main.variable(observer("metadata")).define("metadata", ["getMetadata","odswissId"], function(getMetadata,odswissId){return(
getMetadata(odswissId)
)});
  main.variable(observer("getMetadata")).define("getMetadata", ["d3"], function(d3){return(
function getMetadata(odswissId) {
  let link =
    "https://cors-anywhere.herokuapp.com/https://opendata.swiss/api/3/action/package_show?id=" +
    odswissId;
  const metadata = d3.json(link);
  //https://opendata.swiss/api/3/action/package_show?id=
  return metadata;
}
)});
  const child1 = runtime.module(define1);
  main.import("table", child1);
  main.variable(observer("d32")).define("d32", ["require"], function(require){return(
require.alias({
  "d3-array": "d3@5",
  "d3-axis": "d3@5",
  "d3-dispatch": "d3@5",
  "d3-drag": "d3@5",
  "d3-ease": "d3@5",
  "d3-scale": "d3@5",
  "d3-selection": "d3@5",
  "d3-transition": "d3@5"
})("d3@5", "d3-simple-slider@1")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3')
)});
  main.variable(observer("L")).define("L", ["require"], function(require){return(
require('leaflet@1.2.0')
)});
  const child2 = runtime.module(define2);
  main.import("shareTweet", child2);
  main.variable(observer()).define(["html"], function(html){return(
html`<style>
/* required styles */
* { font-family: Helvetica, Arial, sans-serif;
    margin: 0;
}

select {
  font-size: 14px;
}

</style`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<style>
/* required styles */

.leaflet-map-pane,
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-tile-pane,
.leaflet-tile-container,
.leaflet-overlay-pane,
.leaflet-shadow-pane,
.leaflet-marker-pane,
.leaflet-popup-pane,
.leaflet-overlay-pane svg,
.leaflet-zoom-box,
.leaflet-image-layer,
.leaflet-layer {
	position: absolute;
	left: 0;
	top: 0;
	}
.leaflet-container {
	overflow: hidden;
	-ms-touch-action: none;
	}
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow {
	-webkit-user-select: none;
	   -moz-user-select: none;
	        user-select: none;
	-webkit-user-drag: none;
	}
.leaflet-marker-icon,
.leaflet-marker-shadow {
	display: block;
	}
/* map is broken in FF if you have max-width: 100% on tiles */
.leaflet-container img {
	max-width: none !important;
	}
/* stupid Android 2 doesn't understand "max-width: none" properly */
.leaflet-container img.leaflet-image-layer {
	max-width: 15000px !important;
	}
.leaflet-tile {
	filter: inherit;
	visibility: hidden;
	}
.leaflet-tile-loaded {
	visibility: inherit;
	}
.leaflet-zoom-box {
	width: 0;
	height: 0;
	}
/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */
.leaflet-overlay-pane svg {
	-moz-user-select: none;
	}

.leaflet-tile-pane    { z-index: 2; }
.leaflet-objects-pane { z-index: 3; }
.leaflet-overlay-pane { z-index: 4; }
.leaflet-shadow-pane  { z-index: 5; }
.leaflet-marker-pane  { z-index: 6; }
.leaflet-popup-pane   { z-index: 7; }

.leaflet-vml-shape {
	width: 1px;
	height: 1px;
	}
.lvml {
	behavior: url(#default#VML);
	display: inline-block;
	position: absolute;
	}


/* control positioning */

.leaflet-control {
	position: relative;
	z-index: 7;
	pointer-events: auto;
	}
.leaflet-top,
.leaflet-bottom {
	position: absolute;
	z-index: 1000;
	pointer-events: none;
	}
.leaflet-top {
	top: 0;
	}
.leaflet-right {
	right: 0;
	}
.leaflet-bottom {
	bottom: 0;
	}
.leaflet-left {
	left: 0;
	}
.leaflet-control {
	float: left;
	clear: both;
	}
.leaflet-right .leaflet-control {
	float: right;
	}
.leaflet-top .leaflet-control {
	margin-top: 10px;
	}
.leaflet-bottom .leaflet-control {
	margin-bottom: 10px;
	}
.leaflet-left .leaflet-control {
	margin-left: 10px;
	}
.leaflet-right .leaflet-control {
	margin-right: 10px;
	}


/* zoom and fade animations */

.leaflet-fade-anim .leaflet-tile,
.leaflet-fade-anim .leaflet-popup {
	opacity: 0;
	-webkit-transition: opacity 0.2s linear;
	   -moz-transition: opacity 0.2s linear;
	     -o-transition: opacity 0.2s linear;
	        transition: opacity 0.2s linear;
	}
.leaflet-fade-anim .leaflet-tile-loaded,
.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {
	opacity: 1;
	}

.leaflet-zoom-anim .leaflet-zoom-animated {
	-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);
	   -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);
	     -o-transition:      -o-transform 0.25s cubic-bezier(0,0,0.25,1);
	        transition:         transform 0.25s cubic-bezier(0,0,0.25,1);
	}
.leaflet-zoom-anim .leaflet-tile,
.leaflet-pan-anim .leaflet-tile,
.leaflet-touching .leaflet-zoom-animated {
	-webkit-transition: none;
	   -moz-transition: none;
	     -o-transition: none;
	        transition: none;
	}

.leaflet-zoom-anim .leaflet-zoom-hide {
	visibility: hidden;
	}


/* cursors */

.leaflet-clickable {
	cursor: pointer;
	}
.leaflet-container {
	cursor: -webkit-grab;
	cursor:    -moz-grab;
	}
.leaflet-popup-pane,
.leaflet-control {
	cursor: auto;
	}
.leaflet-dragging .leaflet-container,
.leaflet-dragging .leaflet-clickable {
	cursor: move;
	cursor: -webkit-grabbing;
	cursor:    -moz-grabbing;
	}


/* visual tweaks */

.leaflet-container {
	background: #ddd;
	outline: 0;
	}
.leaflet-container a {
	color: #0078A8;
	}
.leaflet-container a.leaflet-active {
	outline: 2px solid orange;
	}
.leaflet-zoom-box {
	border: 2px dotted #38f;
	background: rgba(255,255,255,0.5);
	}


/* general typography */
.leaflet-container {
	font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;
	}


/* general toolbar styles */

.leaflet-bar {
	box-shadow: 0 1px 5px rgba(0,0,0,0.65);
	border-radius: 4px;
	}
.leaflet-bar a,
.leaflet-bar a:hover {
	background-color: #fff;
	border-bottom: 1px solid #ccc;
	width: 26px;
	height: 26px;
	line-height: 26px;
	display: block;
	text-align: center;
	text-decoration: none;
	color: black;
	}
.leaflet-bar a,
.leaflet-control-layers-toggle {
	background-position: 50% 50%;
	background-repeat: no-repeat;
	display: block;
	}
.leaflet-bar a:hover {
	background-color: #f4f4f4;
	}
.leaflet-bar a:first-child {
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	}
.leaflet-bar a:last-child {
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
	border-bottom: none;
	}
.leaflet-bar a.leaflet-disabled {
	cursor: default;
	background-color: #f4f4f4;
	color: #bbb;
	}

.leaflet-touch .leaflet-bar a {
	width: 30px;
	height: 30px;
	line-height: 30px;
	}


/* zoom control */

.leaflet-control-zoom-in,
.leaflet-control-zoom-out {
	font: bold 18px 'Lucida Console', Monaco, monospace;
	text-indent: 1px;
	}
.leaflet-control-zoom-out {
	font-size: 20px;
	}

.leaflet-touch .leaflet-control-zoom-in {
	font-size: 22px;
	}
.leaflet-touch .leaflet-control-zoom-out {
	font-size: 24px;
	}


/* layers control */

.leaflet-control-layers {
	box-shadow: 0 1px 5px rgba(0,0,0,0.4);
	background: #fff;
	border-radius: 5px;
	}
.leaflet-control-layers-toggle {
	background-image: url(images/layers.png);
	width: 36px;
	height: 36px;
	}
.leaflet-retina .leaflet-control-layers-toggle {
	background-image: url(images/layers-2x.png);
	background-size: 26px 26px;
	}
.leaflet-touch .leaflet-control-layers-toggle {
	width: 44px;
	height: 44px;
	}
.leaflet-control-layers .leaflet-control-layers-list,
.leaflet-control-layers-expanded .leaflet-control-layers-toggle {
	display: none;
	}
.leaflet-control-layers-expanded .leaflet-control-layers-list {
	display: block;
	position: relative;
	}
.leaflet-control-layers-expanded {
	padding: 6px 10px 6px 6px;
	color: #333;
	background: #fff;
	}
.leaflet-control-layers-selector {
	margin-top: 2px;
	position: relative;
	top: 1px;
	}
.leaflet-control-layers label {
	display: block;
	}
.leaflet-control-layers-separator {
	height: 0;
	border-top: 1px solid #ddd;
	margin: 5px -10px 5px -6px;
	}


/* attribution and scale controls */

.leaflet-container .leaflet-control-attribution {
	background: #fff;
	background: rgba(255, 255, 255, 0.7);
	margin: 0;
	}
.leaflet-control-attribution,
.leaflet-control-scale-line {
	padding: 0 5px;
	color: #333;
	}
.leaflet-control-attribution a {
	text-decoration: none;
	}
.leaflet-control-attribution a:hover {
	text-decoration: underline;
	}
.leaflet-container .leaflet-control-attribution,
.leaflet-container .leaflet-control-scale {
	font-size: 11px;
	}
.leaflet-left .leaflet-control-scale {
	margin-left: 5px;
	}
.leaflet-bottom .leaflet-control-scale {
	margin-bottom: 5px;
	}
.leaflet-control-scale-line {
	border: 2px solid #777;
	border-top: none;
	line-height: 1.1;
	padding: 2px 5px 1px;
	font-size: 11px;
	white-space: nowrap;
	overflow: hidden;
	-moz-box-sizing: content-box;
	     box-sizing: content-box;

	background: #fff;
	background: rgba(255, 255, 255, 0.5);
	}
.leaflet-control-scale-line:not(:first-child) {
	border-top: 2px solid #777;
	border-bottom: none;
	margin-top: -2px;
	}
.leaflet-control-scale-line:not(:first-child):not(:last-child) {
	border-bottom: 2px solid #777;
	}

.leaflet-touch .leaflet-control-attribution,
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
	box-shadow: none;
	}
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
	border: 2px solid rgba(0,0,0,0.2);
	background-clip: padding-box;
	}


/* popup */

.leaflet-popup {
	position: absolute;
	text-align: center;
	}
.leaflet-popup-content-wrapper {
	padding: 1px;
	text-align: left;
	border-radius: 12px;
	}
.leaflet-popup-content {
	margin: 13px 19px;
	line-height: 1.4;
	}
.leaflet-popup-content p {
	margin: 18px 0;
	}
.leaflet-popup-tip-container {
	margin: 0 auto;
	width: 40px;
	height: 20px;
	position: relative;
	overflow: hidden;
	}
.leaflet-popup-tip {
	width: 17px;
	height: 17px;
	padding: 1px;

	margin: -10px auto 0;

	-webkit-transform: rotate(45deg);
	   -moz-transform: rotate(45deg);
	    -ms-transform: rotate(45deg);
	     -o-transform: rotate(45deg);
	        transform: rotate(45deg);
	}
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
	background: white;

	box-shadow: 0 3px 14px rgba(0,0,0,0.4);
	}
.leaflet-container a.leaflet-popup-close-button {
	position: absolute;
	top: 0;
	right: 0;
	padding: 4px 4px 0 0;
	text-align: center;
	width: 18px;
	height: 14px;
	font: 16px/14px Tahoma, Verdana, sans-serif;
	color: #c3c3c3;
	text-decoration: none;
	font-weight: bold;
	background: transparent;
	}
.leaflet-container a.leaflet-popup-close-button:hover {
	color: #999;
	}
.leaflet-popup-scrolled {
	overflow: auto;
	border-bottom: 1px solid #ddd;
	border-top: 1px solid #ddd;
	}

.leaflet-oldie .leaflet-popup-content-wrapper {
	zoom: 1;
	}
.leaflet-oldie .leaflet-popup-tip {
	width: 24px;
	margin: 0 auto;

	-ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";
	filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);
	}
.leaflet-oldie .leaflet-popup-tip-container {
	margin-top: -1px;
	}

.leaflet-oldie .leaflet-control-zoom,
.leaflet-oldie .leaflet-control-layers,
.leaflet-oldie .leaflet-popup-content-wrapper,
.leaflet-oldie .leaflet-popup-tip {
	border: 1px solid #999;
	}


/* div icon */

.leaflet-div-icon {
	background: #fff;
	border: 1px solid #666;
	}

  #map {
    width: 570px;
    height: 600px;
    margin-top: 10px;
  }
</style`
)});
  return main;
}
