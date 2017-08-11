const NUM_COLUMNS = 4;
const GRAY = "666666";

function getPallete(color){
	var palette = [];
	//add shades
 	palette.push(ColorLuminance(color, 0.2)); // 20% lighter
 	palette.push(ColorLuminance(color, 0.4)); // 40% lighter
 	palette.push(ColorLuminance(color, -0.2)); // 20% darker
	palette.push(ColorLuminance(color, -0.4)); // 40% darker 
 	//add tones 
 	palette.push(mix(color, GRAY, 90)); // 60% tone
 	palette.push(mix(color, GRAY, 60)); // 90% tone
 	palette.push(mix(color, GRAY, 40)); // 40% tone
 	palette.push(mix(color, GRAY, 30)); // 50% tone
 	//complementary color scheme
 	var complement = hexToComplimentary(color,180); 
 	palette.push("#"+color); 
 	palette.push(complement); // 50% tone
 	palette.push(ColorLuminance(color, -0.1)); // 60% tone
 	palette.push(ColorLuminance(complement, -0.1)); // 90% tone
 	//analogous color scheme 
 	var analogue1 = hexToComplimentary(color,-40);
 	var analogue2 = hexToComplimentary(color,40); 
 	palette.push(analogue1); // 50% tone
 	palette.push("#"+color);  
 	palette.push(analogue2); // 50% tone
 	palette.push(ColorLuminance(analogue2, 0.1));
	return palette;
}
//to create shades
function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}
function mix(color_1, color_2, weight) {
  function d2h(d) { return d.toString(16); }  // convert a decimal value to hex
  function h2d(h) { return parseInt(h, 16); } // convert a hex value to decimal 

  weight = (typeof(weight) !== 'undefined') ? weight : 50; // set the weight to 50%, if that argument is omitted

  var color = "#";

  for(var i = 0; i <= 5; i += 2) { // loop through each of the 3 hex pairs—red, green, and blue
    var v1 = h2d(color_1.substr(i, 2)), // extract the current pairs
        v2 = h2d(color_2.substr(i, 2)),
        
        // combine the current pairs from each source color, according to the specified weight
        val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0))); 

    while(val.length < 2) { val = '0' + val; } // prepend a '0' if val results in a single digit
    
    color += val; // concatenate val to our new color string
  }
    
  return color; // PROFIT!
}
function hexToComplimentary(hex,shiftWheel){

    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if(max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max == r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= shiftWheel;
    if (h > 360) { h -= 360; }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255); 
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16); 
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
}  
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        "rgb("+parseInt(result[1], 16)+","+parseInt(result[2], 16)+","+parseInt(result[3], 16)+")"
 		 : null;
}
function printPalette(color){
	var palette = getPallete(color);
	var content = "<table style='background-color:white;'>";
	var columns = NUM_COLUMNS;
	for(var i=0;i < palette.length;i++){
		if(columns == NUM_COLUMNS){
			content+="<tr>"
		}
		content +="<td><div style='width:50px; height:20px; margin:10px;background-color:"+palette[i]+"'></div><div style='padding-left: 10px;'>"+palette[i] +",<br>"+hexToRgb(palette[i])+"</div></td>";
		columns--;
		if(columns == 0){
			content+="</tr>";
			columns = NUM_COLUMNS;
		}
		
	}
	content+="</table>";
	$("#palette").append(content);
}

export default printPalette;
