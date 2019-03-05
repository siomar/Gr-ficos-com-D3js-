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
		.attr("height", cHeight*5);

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