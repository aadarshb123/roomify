/* ========================
FILE: js/ui.js
======================== */
export function cardTemplate(item, favorites){
  const faved = favorites.has(item.id);
  return `
    <article class="card" data-id="${item.id}" data-cat="${item.cat}">
      <img src="${item.src}" alt="${item.title}" loading="lazy"/>
      <div class="meta">
        <span>${item.title}</span>
        <button class="heart" aria-pressed="${faved}" aria-label="Toggle favorite">${faved?'❤':'♡'}</button>
      </div>
    </article>
  `;
}

export function renderFeed(feedElement, items, searchTerm, activeCategory, favorites) {
  // Filter items based on search term and active category
  let filteredItems = items;
  
  // Filter by category (if not 'all')
  if (activeCategory && activeCategory !== 'all') {
    filteredItems = filteredItems.filter(item => item.cat === activeCategory);
  }
  
  // Filter by search term
  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.cat.toLowerCase().includes(term)
    );
  }
  
  // Render the filtered items
  if (filteredItems.length === 0) {
    feedElement.innerHTML = '<div style="padding: 2rem; text-align: center; opacity: 0.7;">No items found</div>';
  } else {
    feedElement.innerHTML = filteredItems.map(item => cardTemplate(item, favorites)).join('');
  }
}
