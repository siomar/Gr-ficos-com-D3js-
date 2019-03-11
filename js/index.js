var palavras = ["two", "Teste", "Teste", "Teste", "Teste", "Teste", "Teste", "Teste", "Teste", "Teste", "two", "seven", "seven", "seven", "seven", "seven", "seven", "seven", "three", "three", "three", "eight", "eight", "eight", "eight", "eight", "eight", "eight", "eight", "five", "five", "five", "five", "five", "four", "four", "four", "four", "nine", "nine", "nine", "nine", "nine", "nine", "nine", "nine", "nine", "one", "ten", "ten", "ten", "ten", "ten", "ten", "ten", "ten", "ten", "ten", "six", "six", "six", "six", "six", "six"];

var words = sortByFrequency(palavras)
	.map(function (d, i) {
		return { text: d, size: -i };
	});

	// console.log(verificaQtd("ten"));



var fontName = "Montserrat",
	cWidth = 720,
	cHeight = 400,
	svg,
	wCloud,
	bbox,
	ctm,
	bScale,
	bWidth,
	bHeight,
	bMidX,
	bMidY,
	bDeltaX,
	bDeltaY;

var cTemp = document.createElement('canvas'),
	ctx = cTemp.getContext('2d');
ctx.font = "100px " + fontName;

var fRatio = Math.min(cWidth, cHeight) / ctx.measureText(words[0].text).width,
	fontScale = d3.scale.linear()
		.domain([
			d3.min(words, function (d) { return d.size; }),
			d3.max(words, function (d) { return d.size; })
		])
		//.range([20,120]),
		.range([20, 100 * fRatio / 2]), // tbc
	fill = d3.scale.category20();

d3.layout.cloud()
	.size([cWidth, cHeight])
	.words(words)
	//.padding(2) // controls
	// .rotate(function() { return ~~(Math.random() * 2) * 90; })
	.font(fontName)
	.fontSize(function (d) { return fontScale(d.size) })
	.on("end", draw)
	.start();

function draw(words, bounds) {
	// move and scale cloud bounds to canvas
	// bounds = [{x0, y0}, {x1, y1}]
	bWidth = bounds[1].x - bounds[0].x;
	bHeight = bounds[1].y - bounds[0].y;
	bMidX = bounds[0].x + bWidth / 2;
	bMidY = bounds[0].y + bHeight / 2;
	bDeltaX = cWidth / 2 - bounds[0].x + bWidth / 2;
	bDeltaY = cHeight / 2 - bounds[0].y + bHeight / 2;
	bScale = bounds ? Math.min(cWidth / bWidth, cHeight / bHeight) : 1;

	console.log(
		"bounds (" + bounds[0].x +
		", " + bounds[0].y +
		", " + bounds[1].x +
		", " + bounds[1].y +
		"), width " + bWidth +
		", height " + bHeight +
		", mid (" + bMidX +
		", " + bMidY +
		"), delta (" + bDeltaX +
		", " + bDeltaY +
		"), scale " + bScale
	);

	// the library's bounds seem not to correspond to reality?
	// try using .getBBox() instead?

	svg = d3.select(".cloud").append("svg")
		.attr("width", cWidth)
		.attr("height", cHeight);

	wCloud = svg.append("g")

		//.attr("transform", "translate(" + [bDeltaX, bDeltaY] + ") scale(" + 1 + ")") // nah!
		.attr("transform", "translate(" + [bWidth >> 1, bHeight >> 1] + ") scale(" + bScale + ")") // nah!
		.selectAll("text")
		.data(words)
		.enter().append("text")
		.style("font-size", function (d) { return d.size + "px"; })
		.style("font-family", fontName)
		.style("fill", function (d, i) { return fill(i); })
		.attr("text-anchor", "middle")
		.attr("class", "palavra")
		.transition()
		.duration(500)
		.attr("transform", function (d) {
			return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		})
		.text(function (d) { return d.text; });

	// TO DO: function to find min and max x,y of all words
	// and use it as the group's bbox
	// then do the transformation
	bbox = wCloud.node(0).getBBox();
	//ctm = wCloud.node().getCTM();
	console.log(
		"bbox (x: " + bbox.x +
		", y: " + bbox.y +
		", w: " + bbox.width +
		", h: " + bbox.height +
		")"
	);

};
function sortByFrequency(arr) {
	var f = {}
	// dados = f;

	arr.forEach(function (i) { f[i] = 0; });
	var u = arr.filter(function (i) { return ++f[i] == 1; });
	return u.sort(function (a, b) { return f[b] - f[a]; });
}
$('.palavra').on('click', function () {

	$('div.palavraSelecionada').text($(this).text());
	console.log($(this).hasClass('filter'));
	
	if ($(this).hasClass('filter') == false) {
		$('text.palavra').addClass('filter');
		$(this).removeClass('filter');
	}
	if ($(this).hasClass('filter') == true) {
		$('text.palavra').addClass('filter');
		$(this).removeClass('filter');
	}
	var palavraClass = $(this).text();
	
	$(".chart div").addClass('filter');
	$(".chart div."+palavraClass).removeClass('filter');
	// qtdPalavra($(this).text());
});
$('.reset').on('click', function () {
	$('text.palavra').removeClass('filter');
	$('div.palavraSelecionada').text('Palavras');
	$(".chart div").removeClass('filter');
	svgBars(quantidade());
});



var alturaBarra = 35;
var grafico;

function verificaQtd(palavra){
	var contador = 0;
	palavras.map(function(index){
		if(index == palavra){
			contador++;
		} 
		return contador;
	});
	return contador;
}
console.log(words);
function quantidade(){
	var valores = [];
	for (let index = 0; index < words.length; index++) {
		const element = words[index];
		valores.push(verificaQtd(element.text));
	}
	return valores;
}


svgBars(quantidade());
function svgBars(arrayDados) {
	var scale = d3.scale.linear()
		.domain([0, 15])
		.range([0, 400])
	d3.select(".chart")
		.style("width", "100%")
		.selectAll("div")
		.data(arrayDados)
		.enter()
		.append("div")
		.style("width", function (d) {
			return scale(d) + 'px'
		})
		// .style("height", "20px")
		.style("font-size", "18px")
		.style("background-color", function (d, i) { return fill(i); })
		.transition()
		.duration(500)
		.text(function (d,i) { 
			console.log(i);
			return words[i].text+': '+d; 
		})
		.attr("class", function (d,i) { return words[i].text});


}

function qtdPalavra(palavra) {
	console.log(words);
	// grafico.remove();
	$(".chart div").remove();
	var result = verificaQtd(palavra);
	svgBars([result]);

}


var svg = d3.select("#circle")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var width = 860,
    height = 350,
	radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.ordinal()
	.domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

function randomData (){
	var labels = color.domain();
	return labels.map(function(label){
    console.log({ label: label, value: Math.random() });
		return { label: label, value: Math.random() }
	});
}

change(randomData());

d3.select(".randomize")
	.on("click", function(){
		change(randomData());
	});


function change(data) {

	/* ------- PIE SLICES -------*/
	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(data), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice		
		.transition().duration(1000)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();

	/* ------- TEXT LABELS -------*/

	var text = svg.select(".labels").selectAll("text")
		.data(pie(data), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		});
	
	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		});

	text.exit()
		.remove();

	/* ------- SLICE TO TEXT POLYLINES -------*/

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(data), key);
	
	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};			
		});
	
	polyline.exit()
		.remove();
};