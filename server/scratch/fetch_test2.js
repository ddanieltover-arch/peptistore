const url = 'http://api.scraperapi.com?api_key=57598939deeac0e6fcd3c03247788a03&url=https://researchpeptide.co.uk/product/semaglutide-glp-1/';

async function run() {
  try {
    const res = await fetch(url);
    const data = await res.text();
    
    // Check for variations JSON
    const variationsMatch = data.match(/data-product_variations=["']([^"']+)["']/);
    if (variationsMatch) {
        console.log("Variations found!");
        console.log(variationsMatch[1].substring(0, 200) + '...');
    } else {
        console.log("Variations not found.");
    }

    // Check for high res image
    const imgMatch = data.match(/data-large_image=["']([^"']+)["']/);
    if (imgMatch) {
       console.log("High-res image found:", imgMatch[1]);
    } else {
       console.log("High-res image not found.");
    }

  } catch (e) {
    console.error(e);
  }
}
run();
