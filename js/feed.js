/* ========================
FILE: js/feed.js
======================== */
import { generateImages } from './data.js';
import { renderFeed, cardTemplate } from './ui.js';

export class FeedController{
  constructor(){
    this.feed = document.getElementById('feed');
    this.q = document.getElementById('q');
    this.clearBtn = document.getElementById('clear');
    this.refreshBtn = document.getElementById('refreshBtn');
    this.chips = Array.from(document.querySelectorAll('.chip'));
    this.favoritesTab = document.getElementById('favoritesTab');

    this.activeCat = 'all';
    this.favorites = new Set(JSON.parse(localStorage.getItem('favorites')||'[]'));
    this.items = generateImages(48); // homepage full of images

    this.render();
    this.bindEvents();
  }

  bindEvents(){
    this.q.addEventListener('input', ()=>{ this.clearBtn.hidden = this.q.value.length===0; this.render(); });
    this.clearBtn.addEventListener('click', ()=>{ this.q.value=''; this.clearBtn.hidden=true; this.render(); this.q.focus();});
    this.refreshBtn.addEventListener('click', ()=> this.refresh());

    this.chips.forEach(btn=>btn.addEventListener('click', e=>{
      this.chips.forEach(c=>c.setAttribute('aria-pressed','false'));
      e.currentTarget.setAttribute('aria-pressed','true');
      this.activeCat = e.currentTarget.dataset.cat;
      this.render();
    }));

    this.feed.addEventListener('click', e=>{
      const btn = e.target.closest('.heart');
      if(!btn) return;
      const card = e.target.closest('.card');
      const id = Number(card.dataset.id);
      if(this.favorites.has(id)) { this.favorites.delete(id); btn.textContent='♡'; btn.setAttribute('aria-pressed','false'); }
      else { this.favorites.add(id); btn.textContent='❤'; btn.setAttribute('aria-pressed','true'); }
      localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
    });

    this.favoritesTab.addEventListener('click', (e)=>{
      e.preventDefault();
      const favItems = this.items.filter(it=>this.favorites.has(it.id));
      this.feed.innerHTML = favItems.length ? favItems.map(it=>cardTemplate(it,this.favorites)).join('') : `<div style="opacity:.7;padding:1rem">No favorites yet. Tap ❤ on any card.</div>`;
    });
  }

  refresh(){
    this.items = generateImages(48);
    this.render(true);
  }

  render(scrollTop=false){
    renderFeed(this.feed, this.items, this.q.value, this.activeCat, this.favorites);
    if(scrollTop) window.scrollTo({top:0,behavior:'smooth'});
  }
}