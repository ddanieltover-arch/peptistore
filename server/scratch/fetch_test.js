import https from 'https';

const url = 'http://api.scraperapi.com?api_key=57598939deeac0e6fcd3c03247788a03&url=https://researchpeptide.co.uk/product/semaglutide-glp-1/';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    // Check for variations JSON
    const variationsMatch = data.match(/data-product_variations=["']([^"']+)["']/);
    if (variationsMatch) {
        console.log("Variations found!");
        // We decode HTML entities just in case
        console.log(variationsMatch[1].substring(0, 200) + '...');
    }

    // Check for high res image
    // Usually WooCommerce has something like data-large_image or a href in the gallery
    const imgMatch = data.match(/data-large_image=["']([^"']+)["']/);
    if (imgMatch) {
       console.log("High-res image found:", imgMatch[1]);
    }

    if (!variationsMatch && !imgMatch) {
      console.log('Neither found, dumping snippet:', data.substring(0, 500));
    }
  });
}).on('error', console.error);
