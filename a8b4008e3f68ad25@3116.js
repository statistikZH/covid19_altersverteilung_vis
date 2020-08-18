// https://observablehq.com/@mmznrstat/altersverteilung-der-positiv-getesteten-im-kanton-zurich@3116
import define1 from "./cd832dfa6c7938a9@451.js";

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

# Altersverteilung der positiv Getesteten im Kanton Zürich
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
  main.variable(observer("offset")).define("offset", function(){return(
"d3.stackOffsetZero"
)});
  main.variable(observer("ageCatPer")).define("ageCatPer", ["AreaChartAge","ageSeriesAnteil","d3","width","weeks","margin"], function(AreaChartAge,ageSeriesAnteil,d3,width,weeks,margin)
{
  let height = 1,
      marginBottom = 10,
      marginTop = 30,
      data;
  
  if (AreaChartAge !== null) {
    height = 150;
    data = ageSeriesAnteil.filter(el => el.key == AreaChartAge.data.key)[0];
  } else {
    height = 1;
  }
  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);
 
   let scaleWeek = d3.scaleBand()
    .domain(weeks)
    .range([margin.left,width-margin.right]);
  
  if(AreaChartAge !== null) {
    let yScale = d3.scaleLinear()
      .domain([0,0.6])
      .range([height-marginBottom,marginTop]);
    
    let yAxis = g => g
      .attr("transform", `translate(${width-margin.left},0)`)
      .call(d3.axisLeft(yScale).tickSize(width-margin.left-margin.right+5).ticks(5).tickSizeOuter(0).tickFormat(d3.format(".0%"))); 
    
    let yAxisGr = svg.append("g").call(yAxis);
    

    yAxisGr.selectAll('.tick').selectAll('line').style('stroke', 'lightgrey');
    yAxisGr.selectAll('path').style('stroke', 'none')
    
    let balken = svg.selectAll('rect.balken')
      .data(data);
    
    balken.enter()
      .append('rect')
      .attr('class','balken')
      .attr('x', d => scaleWeek(d.data.week))
      .attr('y', d => yScale(d[1]-d[0]))
      .attr('height', d => yScale(0)-yScale(d[1]-d[0]))
      .attr('width', scaleWeek.bandwidth())
      .style('fill', d => d3.rgb(AreaChartAge.color).darker())
    
       
    balken.transition()
      .attr('x', d => scaleWeek(d.data.week))
      .attr('y', d => yScale(d[1]-d[0]))
      .attr('height', d => yScale(0)-yScale(d[1]-d[0]))
      .attr('width', scaleWeek.bandwidth())
      .style('fill', d => d3.rgb(AreaChartAge.color).darker())
   svg.append('text')
      .attr('x',margin.left)
      .attr('y', 22)
     .text('Anteil in Alterskategorie: '+data.key)
  }
  
  return svg.node();
}
);
  main.variable(observer("viewof AreaChartAge")).define("viewof AreaChartAge", ["d3","width","height","ageSeries","color","area","xAxis","yAxis","margin"], function(d3,width,height,ageSeries,color,area,xAxis,yAxis,margin)
{  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  let thisData,thisColor, thisKey;
  svg.append("g")
    .selectAll("path.area")
    .data(ageSeries)
    .join("path")
      .attr("fill", ({key}) => color(key))
      .attr('class','area')
      .attr("d", area)
      .on('mouseover', function(d,{key}) {
        console.log('mouse');
        console.log(d);
        thisData = d;
        thisColor = d3.select(this).attr("fill");
        thisKey = key;
        d3.selectAll('.area').style('opacity', 0.8);
        d3.select(this).style('opacity',1)
          .attr('fill',d3.color(thisColor).darker());
      
    
      })
      .on('mouseout', function() {
        d3.selectAll('.area').style('opacity', 1)
        d3.select(this).style('opacity',1)
          .attr('fill',d3.color(d3.select(this).attr("fill")).brighter());
      });

  svg.append("g")
      .call(xAxis);
  svg.append("g")
      .call(yAxis);
  svg.append('text')
    .attr('x',margin.left)
    .attr('y',height)
    .text('Woche')
    .style('fill','dimgrey')
  svg.selectAll('text').attr('font-size', 'calc(0vw + 16px)');
  
  return Object.assign(svg.node(), {
    value: null,
    onmousemove: event => {
      event.currentTarget.value = {
        data: thisData,
        color: thisColor,
        key: thisKey
      };
      event.currentTarget.dispatchEvent(new CustomEvent("input"));
    }
  });
}
);
  main.variable(observer("AreaChartAge")).define("AreaChartAge", ["Generators", "viewof AreaChartAge"], (G, _) => G.input(_));
  main.variable(observer("viewof legendeChart")).define("viewof legendeChart", ["width","d3","margin","ages","color"], function(width,d3,margin,ages,color)
{
  let rows;
  if (width<=600) {
    rows = 1;
  } else {
    rows = 0;
  }
  let padding = 10,
      title = 'Alterskategorien',
      heightPer = 15,
      filterA = [],
      height = (heightPer+2*25)*(rows+1);
  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);
  
  let widthPer = (width-margin.left-margin.right)/(ages.length);
  svg.append('text')
    .attr('x', margin.left+padding/2)
    .attr('y', 13)
    .text(title)
    .style('font-weight', 'bold');
  
  let count = ages.length;
  let getRow = function(index) {
    Math.floor(index/count)*rows;
  }
  console.log(ages)
  const rects = svg.selectAll('rect')
    .data(ages)
    .enter()
    .append('rect')
    .attr('x', (d,i) => padding/2+margin.left+i*widthPer)
    .attr('class', 'selected')
    .attr('y', 22)
    .attr('width', widthPer-padding)
    .attr('height', heightPer)
    .style('fill', d => color(d))
    .style('stroke-width', 1.5)
    .style('stroke', d => color(d))
    .style('cursor', 'pointer');  
  
  

  svg.selectAll('text.legende')
    .data(ages)
    .enter()
    .append('text')
    .attr('class', 'legende')
    .attr('x', (d,i) => margin.left+i*widthPer+widthPer/2)
    .attr('y', '3.5em')
    .attr('text-anchor', 'middle')
    .text(d => d)
    .style('pointer-events', 'none');
  
  let selected = ages;
  rects.on('click', function(d) {
    selected = ages;
    if (d3.select(this).attr('class') == 'selected') {
      d3.select(this).attr('class', 'not')
        .attr('fill-opacity', 0.2);
      filterA.push(d);
    } else {
      d3.select(this).attr('class', 'selected')
        .attr('fill-opacity', 1);
      filterA.splice(filterA.indexOf(d),1);
    }
    console.log(filterA)
    selected = ages.filter(
      function(e) {
        return this.indexOf(e) < 0;
      },filterA
    ); 
  })
  svg.selectAll('text').attr('font-size', 'calc(0vw + 16px)');
  
  return Object.assign(svg.node(), {
    value: {selected},
    onclick: event => {
      event.currentTarget.value = {
        selected: selected
      };
      event.currentTarget.dispatchEvent(new CustomEvent("input"));
    }
  });
}
);
  main.variable(observer("legendeChart")).define("legendeChart", ["Generators", "viewof legendeChart"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`## Altersverteilung`
)});
  main.variable(observer("alterChartWeek")).define("alterChartWeek", ["d3","width","ages","weeks","datenAlterGeschlechtTotal","datenAlterGeschlecht"], function(d3,width,ages,weeks,datenAlterGeschlechtTotal,datenAlterGeschlecht)
{
  let widthNow = d3.min([750, width]);

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, widthNow, 400])
    .attr('id', 'alterChart')
    //.attr('transform','translate('+(width-widthNow)/2+',0)')
    .style('margin','0 auto');
  
  let axisGr = svg.append('g')
  let chart = svg.append('g')
  
  let margin = {left:70,top: 120,bottom:40,right:10};
  
  let agesAll = [];
  for (let i = 0;i<ages.length;i++) {
    let obj = {};
    if (ages[i]!='unbekannt') {
      obj.age = +ages[i].replace('+','-').split('-')[0];
      obj.label = ages[i];
      agesAll.push(obj)
    }
  }
  console.log(agesAll)
  
  let scaleAge = d3.scaleBand()
    .domain(agesAll.map(d => d.label))
    .range([400-margin.bottom,margin.top]);
  
  let scaleWeek = d3.scaleBand()
    .domain(weeks)
    .range([margin.left,widthNow-margin.left-margin.right]);
  
  let colorScaleAge = d3
    .scaleSequential(d3.interpolateInferno)
    .domain([0,165])
  
  let scaleTotal = d3.scaleLinear() 
    .domain([0,d3.max(datenAlterGeschlechtTotal, d => +d.value)])
    .range([110,20])
  
  let totAxis = chart.append('g');
  let widthChart = datenAlterGeschlechtTotal.length*scaleWeek.bandwidth();
  var yAxisTot = d3.axisLeft(scaleTotal).tickSizeOuter(0).tickSize(widthChart+30).ticks(3)
  var gY = totAxis.append("g").call(yAxisTot).attr('transform','translate('+(widthChart+margin.left)+',0)');
  
  totAxis.selectAll("text")
    .attr("y", '-0.5em')
    .attr("x", -widthChart-30)
    .style("text-anchor", "start")
    .attr('pointer-events','none');
      
  totAxis.selectAll('.tick').selectAll('line').style('stroke', 'lightgrey');
  totAxis.selectAll('path').style('stroke', 'none');
  
  var xAxis = d3.axisBottom(scaleWeek).tickSizeOuter(0);
  var gX = axisGr.append("g").call(xAxis).attr('transform','translate(0,'+(400-margin.bottom)+')');
  
  var yAxis = d3.axisLeft(scaleAge).tickSizeOuter(0).tickValues(agesAll.map(d => d.label));
  var gY = axisGr.append("g").call(yAxis).attr('transform','translate('+margin.left+',0)');
  
  axisGr.selectAll('.tick').selectAll('line').style('stroke', 'lightgrey');
  axisGr.selectAll('path').style('stroke', 'none')
  
  chart.append('text')
    .attr('x',margin.left)
    .attr('y',395)
    .text('Woche')
    .style('fill','dimgrey')
  
    
  chart.append('text')
    .attr('x',-margin.top)
    .attr('y',20)
    .text('Alterskategorien')
    .style('fill','dimgrey')
    .attr('transform','rotate(-90)')
    .style('text-anchor','end');
 
  chart.append('text')
    .attr('x',-10)
    .attr('y',20)
    .text('Total Fälle')
    .style('fill','dimgrey')
    .attr('transform','rotate(-90)')
    .style('text-anchor','end'); 
  
  for(let week = 0;week<weeks.length;week++) {
    let totalWeek = 0;
    let now = weeks[week];
    for (let age = 0;age<agesAll.length;age++) {
      let ageCat = agesAll[age].label;
      let now = weeks[week];
      let thisDate = datenAlterGeschlecht.filter(el => (el.Week == now && el.AgeYearCat == ageCat));

      let tot = 0;
      for (let i = 0;i<thisDate.length;i++) {
        tot += thisDate[i].NewConfCases
      }
      totalWeek += tot;
      chart.append('rect')
        .attr('x',scaleWeek(+now))
        .attr('y', scaleAge(ageCat))
        .attr('width', scaleWeek.bandwidth())
        .attr('height', scaleAge.bandwidth())
        .attr('fill', colorScaleAge(tot))
        .on('mouseover', function() {
         
          let mouseGr = chart.append('g').attr('id','mouseGr').attr('pointer-events','none');
          
          mouseGr.append('rect')
            .attr('x',scaleWeek(+now)+5+scaleWeek.bandwidth())
            .attr('y', scaleAge(ageCat)-2)
            .attr('width', '100')
            .attr('height', scaleAge.bandwidth()+4)
            .attr('fill','white')
            .attr('fill-opacity','0.9');
        
          mouseGr.append('text')
            .attr('x',scaleWeek(+now)+5+scaleWeek.bandwidth()+3)
            .attr('y', scaleAge(ageCat)+16)
            .text(ageCat+': '+ tot);
        
 
        
        chart.select('#balken_'+now)
          .style('fill', 'grey');          
       
        chart.select('#text_'+now)
            .attr('visibility', 'visible');
        
        })
        .on('mouseout', function() {
          d3.select('#mouseGr').remove();           
        
          chart.select('#balken_'+now)
            .style('fill', 'silver');
        chart.select('#text_'+now)
            .attr('visibility', 'hidden');
        })
     }
    
     let totalBalken = chart.selectAll('rect.total')
      .data(datenAlterGeschlechtTotal)
      .enter().append('rect')
      .attr('id', d => 'balken_'+d.key)
      .attr('class', 'total')
      .attr('x', d => scaleWeek(d.key))
      .attr('y', d => scaleTotal(+d.value))
      .attr('height', d => scaleTotal(0)-scaleTotal(+d.value))
      .attr('width', scaleWeek.bandwidth())
      .style('fill', 'silver')
    
     let totalTect = chart.selectAll('text.total')
      .data(datenAlterGeschlechtTotal)
      .enter().append('text')
      .attr('id', d => 'text_'+d.key)
      .attr('class', 'total')
      .attr('x', d => scaleWeek(d.key))
      .attr('y', d => scaleTotal(+d.value))
      .attr('text-anchor', 'middle')
      .attr('dx', scaleWeek.bandwidth()/2)
      .attr('dy', -2)
      .text(d => d.value)
     .style('font-size','12px')
     .attr('visibility','hidden')

   }

  

  return svg.node();
}
);
  main.variable(observer("alterChart")).define("alterChart", ["d3","width","ages","weeks","datenAlterGeschlecht"], function(d3,width,ages,weeks,datenAlterGeschlecht)
{
  let widthNow = d3.min([750, width]);

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, widthNow, 300])
    .attr('id', 'alterChart')
    //.attr('transform','translate('+(width-widthNow)/2+',0)')
    .style('margin','0 auto');
  
  let axisGr = svg.append('g')
  let chart = svg.append('g')
  
  let margin = {left:70,top: 0,bottom:40,right:10};
  
  let agesAll = [];
  for (let i = 0;i<ages.length;i++) {
    let obj = {};
    if (ages[i]!='unbekannt') {
      obj.age = +ages[i].replace('+','-').split('-')[0];
      obj.label = ages[i];
      agesAll.push(obj)
    }
  }
  console.log(agesAll)
  
  let scaleAge = d3.scaleBand()
    .domain(agesAll.map(d => d.label))
    .range([300-margin.top-margin.bottom,margin.top]);
  
  let scaleWeek = d3.scaleBand()
    .domain(weeks)
    .range([margin.left,widthNow-margin.left-margin.right]);
  
  let colorScaleAge = d3
    .scaleSequential(d3.interpolateInferno)
    .domain([0,165])
  
  var xAxis = d3.axisBottom(scaleWeek).tickSizeOuter(0);
  var gX = axisGr.append("g").call(xAxis).attr('transform','translate(0,'+(300-margin.bottom)+')');
  
  var yAxis = d3.axisLeft(scaleAge).tickSizeOuter(0).tickValues(agesAll.map(d => d.label));
  var gY = axisGr.append("g").call(yAxis).attr('transform','translate('+margin.left+',0)');
  
  axisGr.selectAll('.tick').selectAll('line').style('stroke', 'lightgrey');
  axisGr.selectAll('path').style('stroke', 'none')
  
  chart.append('text')
    .attr('x',margin.left)
    .attr('y',295)
    .text('Woche')
    .style('fill','dimgrey')
  
    
  chart.append('text')
    .attr('x',-margin.top)
    .attr('y',20)
    .text('Alterskategorien')
    .style('fill','dimgrey')
    .attr('transform','rotate(-90)')
    .style('text-anchor','end');
  
  
  for (let age = 0;age<agesAll.length;age++) {
    for(let week = 0;week<weeks.length;week++) {
      let ageCat = agesAll[age].label;
      let now = weeks[week];
      let thisDate = datenAlterGeschlecht.filter(el => (el.Week == now && el.AgeYearCat == ageCat));

      let tot = 0;
      for (let i = 0;i<thisDate.length;i++) {
        tot += thisDate[i].NewConfCases
      }
      chart.append('rect')
        .attr('x',scaleWeek(+now))
        .attr('y', scaleAge(ageCat))
        .attr('width', scaleWeek.bandwidth())
        .attr('height', scaleAge.bandwidth())
        .attr('fill', colorScaleAge(tot))
        .on('mouseover', function() {
         
          let mouseGr = svg.append('g').attr('id','mouseGr').attr('pointer-events','none');
          mouseGr.append('rect')
            .attr('x',scaleWeek(+now)+5+scaleWeek.bandwidth())
            .attr('y', scaleAge(ageCat)-2)
            .attr('width', '100')
            .attr('height', scaleAge.bandwidth()+4)
            .attr('fill','white')
            .attr('fill-opacity','0.9');
        
          mouseGr.append('text')
            .attr('x',scaleWeek(+now)+5+scaleWeek.bandwidth()+3)
            .attr('y', scaleAge(ageCat)+16)
            .text(ageCat+': '+ tot);
        })
        .on('mouseout', function() {
          d3.select('#mouseGr').remove();
        })
     }
   }

  

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
  main.variable(observer("viewof curve")).define("viewof curve", ["html"], function(html){return(
html`<select>
  <option value="d3.curveCatmullRom.alpha(0.5)">interpoliert</option>
  <option value="d3.curveLinear">linear</option>
</select>`
)});
  main.variable(observer("curve")).define("curve", ["Generators", "viewof curve"], (G, _) => G.input(_));
  main.variable(observer("ages")).define("ages", ["distincts","datenAlterGeschlecht"], function(distincts,datenAlterGeschlecht){return(
distincts(datenAlterGeschlecht,"AgeYearCat").filter(el => el!='unbekannt')
)});
  main.variable(observer("odswissId")).define("odswissId", function(){return(
"covid_19-fallzahlen-kanton-zuerich"
)});
  main.variable(observer("datenAlterGeschlecht")).define("datenAlterGeschlecht", ["d3","datenAlterGeschlechtBasis"], function(d3,datenAlterGeschlechtBasis){return(
d3
  .csv(
    "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_alter_geschlecht_csv/COVID19_Fallzahlen_Kanton_ZH_altersklassen_geschlecht.csv"
    //"https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_alter_geschlecht_csv/COVID19_Fallzahlen_Kanton_ZH_alter_geschlecht.csv"
  )
  .then(function(data) {
    data.forEach(function(d) {
      d.Week = +d.Week;
      d.NewConfCases = +d.NewConfCases;
      d.NewDeaths = +d.NewDeaths;
      for(let i=0;i<datenAlterGeschlechtBasis.length;i++) {
        if(datenAlterGeschlechtBasis[i].AgeYearCat==d.AgeYearCat && datenAlterGeschlechtBasis[i].Gender == d.Gender){
          d.NewConfCasesAnt = +d.NewConfCases / datenAlterGeschlechtBasis[i].Inhabitants;
        }
      }
    });
    return data;
  })
)});
  main.variable(observer("datenAlterGeschlechtTotal")).define("datenAlterGeschlechtTotal", ["d3","datenAlterGeschlecht"], function(d3,datenAlterGeschlecht){return(
d3.nest()
  .key(d => d.Week)
  .rollup(function(leaves) { return d3.sum(leaves, function(d) {return +(d.NewConfCases);})})
  .entries(datenAlterGeschlecht)
)});
  main.variable(observer("datenAlterGeschlechtBasis")).define("datenAlterGeschlechtBasis", ["d3"], function(d3){return(
d3
  .csv(
    "https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_alter_geschlecht_csv/COVID19_Einwohner_Kanton_ZH_altersklassen_geschlecht.csv"
  )
)});
  main.variable(observer()).define(["color"], function(color){return(
color.domain()
)});
  main.variable(observer("color")).define("color", ["d3","ages"], function(d3,ages){return(
d3.scaleOrdinal()
    .domain(ages)
    .range(d3.schemeRdBu[11].reverse())
)});
  main.variable(observer()).define(["color"], function(color){return(
color("100+")
)});
  main.variable(observer("datenAlterGeschlechtWoche")).define("datenAlterGeschlechtWoche", ["datenAlterGeschlecht","d3"], function(datenAlterGeschlecht,d3){return(
datenAlterGeschlecht.filter(
  el => el.Week == d3.max(datenAlterGeschlecht, d => +d.Week)
)
)});
  main.variable(observer("datenAlterWide")).define("datenAlterWide", ["d3","datenAlterGeschlecht"], function(d3,datenAlterGeschlecht){return(
function () {
  let nest = d3.nest()
    .key(d => d.Week)
    .key(d => d.AgeYearCat)
    .rollup(function(leaves) { return d3.sum(leaves, function(d) {return +(d.NewConfCases);})})
    .entries(datenAlterGeschlecht)
  let data = [];
  for (let i = 0;i<nest.length;i++) {
    let obj = {};
    let tot = 0;
    for (let j = 0; j<nest[i].values.length;j++) {
      tot += nest[i].values[j].value;
      obj.week = +nest[i].key;
      obj[''+nest[i].values[j].key] = nest[i].values[j].value;
    }
    //nest[i].total = tot;
    data.push(obj);
  }
  return data;
  }()
)});
  main.variable(observer("ageSeries")).define("ageSeries", ["d3","legendeChart","offset","datenAlterWide"], function(d3,legendeChart,offset,datenAlterWide){return(
d3.stack()
    .keys(legendeChart.selected)
    //.offset(d3.stackOffsetExpand)
    //.offset(d3.stackOffsetSilhouette)
    .offset(eval(offset))
  (datenAlterWide)
)});
  main.variable(observer("ageSeriesAnteil")).define("ageSeriesAnteil", ["d3","legendeChart","datenAlterWide"], function(d3,legendeChart,datenAlterWide){return(
d3.stack()
    .keys(legendeChart.selected)
    .offset(d3.stackOffsetExpand)
    //.offset(d3.stackOffsetSilhouette)
    //.offset(eval(offset))
  (datenAlterWide)
)});
  main.variable(observer("area")).define("area", ["d3","curve","xScaleWeek","yScaleArea"], function(d3,curve,xScaleWeek,yScaleArea){return(
d3.area()
    .curve(eval(curve))
    .x(d => xScaleWeek(d.data.week))
    .y0(d => yScaleArea(d[0]))
    .y1(d => yScaleArea(d[1]))
)});
  main.variable(observer("weeks")).define("weeks", ["distincts","datenAlterGeschlecht"], function(distincts,datenAlterGeschlecht){return(
distincts(datenAlterGeschlecht,"Week")
)});
  main.variable(observer("distincts")).define("distincts", function(){return(
function distincts(array,element) {
  var flags = [], output = [], l = array.length, i;
  
  for( i=0; i<l; i++) {
    if( flags[array[i][element]]) continue;
    flags[array[i][element]] = true;
    output.push(array[i][element]);
  }
  return output
}
)});
  main.variable(observer("week_extent")).define("week_extent", ["d3","weeks"], function(d3,weeks){return(
d3.extent(weeks, d => +d)
)});
  main.variable(observer("colorScaleAge")).define("colorScaleAge", ["d3","datenAlterGeschlecht"], function(d3,datenAlterGeschlecht){return(
d3
  .scaleSequential(d3.interpolateGreys)
  .domain([d3.max(datenAlterGeschlecht, d => +d.NewConfCases),0])
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Libraries, parameters and functions`
)});
  main.variable(observer("ch_DE")).define("ch_DE", ["d3"], function(d3){return(
d3.timeFormatDefaultLocale({
  "decimal": ".",
  "thousands": "'",
	"grouping": [3],
	"currency": ["CHF", " "],
	"dateTime": "%a %b %e %X %Y",
	"date": "%d.%m.%Y",
	"time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
	"shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
	"months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	"shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
})
)});
  main.variable(observer("height")).define("height", function(){return(
530
)});
  main.variable(observer("margin")).define("margin", function(){return(
{ top: 10, right: 40, bottom: 40, left: 50 }
)});
  main.variable(observer("xScaleWeek")).define("xScaleWeek", ["d3","weeks","margin","width"], function(d3,weeks,margin,width){return(
d3
  .scaleLinear()
  .domain(d3.extent(weeks))
  .range([margin.left, width - margin.right])
)});
  main.variable(observer("yScaleArea")).define("yScaleArea", ["d3","ageSeries","height","margin"], function(d3,ageSeries,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(ageSeries, d => d3.max(d, d => d[1]))]).nice()
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer()).define(["offset","yScaleArea"], function(offset,yScaleArea){return(
function() {
  if (offset == 'd3.stackOffsetExpand') {
    yScaleArea.domain([0,1])
  }
}()
)});
  main.variable(observer()).define(["yScaleArea"], function(yScaleArea){return(
yScaleArea.domain()
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","yScaleArea"], function(margin,d3,yScaleArea){return(
g =>
  g.attr("transform", `translate(${margin.left},${0})`).call(
    d3.axisLeft(yScaleArea)
    
  )
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","xScaleWeek"], function(height,margin,d3,xScaleWeek){return(
g =>
  g.attr("transform", `translate(0,${height - margin.bottom})`).call(
    d3.axisBottom(xScaleWeek).tickFormat(d =>
      d.toLocaleString("de-CH", {
        day: "numeric",
        month: "long"
      })
    )
  )
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
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3')
)});
  const child1 = runtime.module(define1);
  main.import("shareTweet", child1);
  main.variable(observer("legend")).define("legend", ["width","margin","d3","ramp"], function(width,margin,d3,ramp){return(
function legend({
  color,
  title,
  tickSize = 6,
  widthL = width-margin.left-margin.right, 
  height = 44 + tickSize,
  marginTop = 10,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = margin.left,
  ticks = width / 64,
  tickFormat,
  tickValues
} = {}) {

  const svg = d3.create("svg")
      .attr("width", widthL)
      .attr("height", height)
      .attr("viewBox", [0, 0, widthL, height])
      .style("overflow", "visible")
      .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, widthL - marginRight), n));

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", widthL - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
        .interpolator(d3.interpolateRound(marginLeft, widthL - marginRight)),
        {range() { return [marginLeft, widthL - marginRight]; }});

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("widthL", widthL - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds
        = color.thresholds ? color.thresholds() // scaleQuantize
        : color.quantiles ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold

    const thresholdFormat
        = tickFormat === undefined ? d => d
        : typeof tickFormat === "string" ? d3.format(tickFormat)
        : tickFormat;

    x = d3.scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, widthL - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, widthL - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);

    tickAdjust = () => {};
  }

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
      .call(tickAdjust)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(title));

  svg.selectAll('text').attr('font-size', 'calc(0vw + 16px)');
  return svg.node();
}
)});
  main.variable(observer("entity")).define("entity", function(){return(
function entity(character) {
  return `&#${character.charCodeAt(0).toString()};`;
}
)});
  main.variable(observer("ramp")).define("ramp", ["DOM"], function(DOM){return(
function ramp(color, n = 256) {
  const canvas = DOM.canvas(n, 1);
  const context = canvas.getContext("2d");
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}
)});
  main.variable(observer("slider_snap")).define("slider_snap", ["d3","DOM"], function(d3,DOM){return(
function(min, max) {

  var range = [min, max]

  // set width and height of svg
  var w = 600
  var h = 80
  var margin = {top: 0,
                bottom: 20,
                left: 10,
                right: 10}

  // dimensions of slider bar
  var width = w - margin.left - margin.right;
  var height = h - margin.top - margin.bottom;

  // create x scale
  var x = d3.scaleLinear()
    .domain(range)  // data space
    .range([0, width]);  // display space
  
  // create svg and translated g
  var svg = d3.select(DOM.svg(w,h))
  const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
  
  // draw background lines
  g.append('g').selectAll('line')
    .data(d3.range(range[0], range[1]+1))
    .enter()
    .append('line')
    .attr('x1', d => x(d)).attr('x2', d => x(d))
    .attr('y1', 0).attr('y2', height)
    .style('stroke', '#ccc')
  
  // labels
  var labelL = g.append('text')
    .attr('id', 'labelleft')
    .attr('x', 0)
    .attr('y', height + 5)
    .text(range[0])

  var labelR = g.append('text')
    .attr('id', 'labelright')
    .attr('x', 0)
    .attr('y', height + 5)
    .text(range[1])

  // define brush
  var brush = d3.brushX()
    .extent([[0,0], [width, height]])
    .on('brush', function() {
      var s = d3.event.selection;
      // update and move labels
      labelL.attr('x', s[0])
        .text(Math.round(x.invert(s[0])))
      labelR.attr('x', s[1])
        .text(Math.round(x.invert(s[1])) - 1)
      // move brush handles      
      handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
      // update view
      // if the view should only be updated after brushing is over, 
      // move these two lines into the on('end') part below
      svg.node().value = s.map(d => Math.round(x.invert(d)));
      svg.node().dispatchEvent(new CustomEvent("input"));
    })
    .on('end', function() {
      if (!d3.event.sourceEvent) return;
      var d0 = d3.event.selection.map(x.invert);
      var d1 = d0.map(Math.round)
      d3.select(this).transition().call(d3.event.target.move, d1.map(x))
    })

  // append brush to g
  var gBrush = g.append("g")
      .attr("class", "brush")
      .call(brush)

  // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
  var brushResizePath = function(d) {
      var e = +(d.type == "e"),
          x = e ? 1 : -1,
          y = height / 2;
      return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
        "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
        "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
  }

  var handle = gBrush.selectAll(".handle--custom")
    .data([{type: "w"}, {type: "e"}])
    .enter().append("path")
    .attr("class", "handle--custom")
    .attr("stroke", "#000")
    .attr("fill", '#eee')
    .attr("cursor", "ew-resize")
    .attr("d", brushResizePath);
    
  // override default behaviour - clicking outside of the selected area 
  // will select a small piece there rather than deselecting everything
  // https://bl.ocks.org/mbostock/6498000
  gBrush.selectAll(".overlay")
    .each(function(d) { d.type = "selection"; })
    .on("mousedown touchstart", brushcentered)
  
  function brushcentered() {
    var dx = x(1) - x(0), // Use a fixed width when recentering.
    cx = d3.mouse(this)[0],
    x0 = cx - dx / 2,
    x1 = cx + dx / 2;
    d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);
  }
  
  // select entire range
  gBrush.call(brush.move, range.map(x))
  
  return svg.node()
}
)});
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
  main.variable(observer()).define(["html"], function(html){return(
html`
<style>
svg {
	font-family: sans-serif;
}

rect.overlay {
	stroke: black;
}

rect.selection {
	stroke: none;
  fill: steelblue;
  fill-opacity: 0.6;
}

#labelleft, #labelright {
	dominant-baseline: hanging;
  font-size: 12px;
}

#labelleft {
	text-anchor: end;
}

#labelright {
	text-anchor: start;
}
</style>
`
)});
  return main;
}
