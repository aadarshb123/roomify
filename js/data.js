// Random image generator without API keys.
// Uses Picsum Photos with seeded URLs so refresh gives new images.
export function generateImages(count = 40){
  const cats = ['bedroom','kitchen','decor','living'];
  const items = [];
  const now = Date.now();
  for(let i=0;i<count;i++){
    const id = now + i;
    const cat = cats[i % cats.length];
    // random-ish width/height for masonry effect
    const w = 600 + Math.floor(Math.random()*400);
    const h = 700 + Math.floor(Math.random()*500);
    const seed = `${cat}-${id}-${Math.floor(Math.random()*9999)}`;
    const src = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
    items.push({ id, cat, title: prettyTitle(cat,i), likes: Math.floor(Math.random()*20), src });
  }
  return items;
}

function prettyTitle(cat,i){
  const map = { bedroom: 'Cozy Bedroom', kitchen: 'Warm Kitchen', decor: 'Home Decor', living: 'Living Room' };
  return `${map[cat]} #${i+1}`
}