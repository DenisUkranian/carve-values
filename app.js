(function () {
  'use strict';
  const catalog = window.CarveCatalog;
  const core = window.CarveTrade;
  const byId = new Map(catalog.map(item => [item.id, item]));
  const rarities = ['Common','Uncommon','Rare','Epic','Legendary','Mythical','Sacred','Ethereal','Celestial','Secret','Cosmic','Transcendent','Super Secret','Unspecified'];
  const rarityColors = {'Common':'#c6cec4','Uncommon':'#91cc83','Rare':'#94c8f7','Epic':'#d3a5f0','Legendary':'#e8ca82','Mythical':'#ed9ec7','Sacred':'#e2c98e','Ethereal':'#bbafee','Celestial':'#aac7ee','Secret':'#90d7e4','Cosmic':'#d59beb','Transcendent':'#dac9f8','Super Secret':'#d6ed9c','Unspecified':'#a6b1a9'};
  const state = {your:[], their:[], target:'your', pickerSide:'your', variants:{}, addQuantities:{}, layout:'list', toastTimer:null};
  const $ = id => document.getElementById(id);
  const format = ticks => new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(ticks / 10);
  const count = entries => entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const escape = text => String(text).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const icons = {
    plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    swap:'<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',reset:'<path d="M4 10a8 8 0 1 1 1.7 7M4 4v6h6"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list:'<path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1"/>',
    box:'<path d="m12 3 9 5v8l-9 5-9-5V8zM3 8l9 5 9-5M12 13v8M7.5 5.5l9 5"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',
    balance:'<path d="M12 3v17M7 21h10M5 7h14M5 7l-3 7h6zM19 7l-3 7h6z"/>',
    check:'<path d="m5 12 4 4L19 6"/>',warning:'<path d="M12 7v6M12 17h.01"/><path d="M10.4 3.8 2.6 17.3A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.7L13.6 3.8a1.85 1.85 0 0 0-3.2 0"/>',
    trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>'
  };
  const icon = name => '<svg viewBox="0 0 24 24" aria-hidden="true">'+(icons[name] || icons.box)+'</svg>';
  document.querySelectorAll('[data-icon]').forEach(node => {node.innerHTML = icon(node.dataset.icon);});
  function toast(message) {
    clearTimeout(state.toastTimer); $('toast').textContent = message; $('toast').classList.add('visible');
    state.toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 2400);
  }
  function image(item, small = false) {
    return item.image ? '<img src="'+escape(item.image)+'" alt="'+escape(item.name)+' in-game tree" '+(small?'':'loading="lazy" ')+'width="240" height="240">' : '<div class="placeholder">'+icon('image')+'<span>No image yet</span></div>';
  }
  function variantSwitch(item, context) {
    const mega = !!state.variants[item.id];
    return '<div class="variant-switch" role="group" aria-label="'+escape(item.name)+' variant">'+[false,true].map(value => '<button class="'+(mega===value?'selected':'')+'" data-item="'+item.id+'" data-context="'+context+'" data-mega="'+value+'" aria-pressed="'+(mega===value)+'">'+(value?'MEGA':'Normal')+'</button>').join('')+'</div>';
  }
  function card(item, context) {
    const mega = !!state.variants[item.id], side = context === 'picker' ? state.pickerSide : state.target;
    const quantity = state.addQuantities[item.id] || 1;
    const addControls = context === 'values' ? '' : '<div class="add-quantity-row"><label for="'+context+'-quantity-'+item.id+'">Quantity</label><input id="'+context+'-quantity-'+item.id+'" type="number" inputmode="numeric" min="1" max="'+core.MAX_QUANTITY+'" step="1" value="'+quantity+'" data-batch-quantity="'+item.id+'" data-context="'+context+'" aria-label="How many '+escape(item.name)+' seeds to add"></div><button class="add-item" data-add="'+item.id+'" data-context="'+context+'" aria-label="Add selected quantity of '+escape(item.name)+' '+(mega?'MEGA':'Normal')+' to '+(side==='your'?'your':'their')+' offer">'+icon('plus')+'<span>Add to '+(side==='your'?'your':'their')+' offer</span></button>';
    return '<article class="item-card '+(mega?'is-mega ':'')+(side==='their'?'adding-their':'')+'" style="--rarity:'+rarityColors[item.rarity]+';--rarity-bg:'+rarityColors[item.rarity]+'18">'+
      '<div class="item-visual">'+image(item)+(mega?'<span class="mega-corner">MEGA</span>':'')+'</div><div class="card-info"><p class="rarity-label">'+escape(item.rarity==='Unspecified'?'Rarity not specified':item.rarity)+'</p><h3>'+escape(item.name)+'</h3>'+ 
      '<div class="card-value"><strong class="value-number">'+format(item[mega?'mega':'normal'])+'</strong><span class="value-caption">VALUE</span></div><div class="card-bottom">'+variantSwitch(item,context)+addControls+'</div></div></article>';
  }
  function valueRow(item) {
    const mega = !!state.variants[item.id];
    return '<article class="value-row '+(mega?'is-mega':'')+'" style="--rarity:'+rarityColors[item.rarity]+'"><div class="item-visual">'+image(item)+'</div><div class="value-name"><h3>'+escape(item.name)+'</h3><p class="rarity-label">'+escape(item.rarity==='Unspecified'?'Rarity not specified':item.rarity)+'</p></div>'+variantSwitch(item,'values')+'<strong class="value-number" aria-label="Value '+format(item[mega?'mega':'normal'])+'">'+format(item[mega?'mega':'normal'])+'</strong></article>';
  }
  function filtered(context) {
    const search = $(context+'-search').value.trim().toLocaleLowerCase();
    const rarity = $(context+'-rarity').value;
    const sort = context==='picker' ? 'value-desc' : $(context+'-sort').value;
    return catalog.filter(item => (!search || (item.name+' '+item.rarity).toLocaleLowerCase().includes(search)) && (!rarity || item.rarity===rarity)).sort((a,b) => {
      const value = item => item.normal;
      if(sort==='name') return a.name.localeCompare(b.name);
      if(sort==='rarity') return (a.rarity==='Unspecified'?1:b.rarity==='Unspecified'?-1:rarities.indexOf(b.rarity)-rarities.indexOf(a.rarity)) || a.name.localeCompare(b.name);
      return (sort==='value-asc'?value(a)-value(b):value(b)-value(a)) || a.name.localeCompare(b.name);
    });
  }
  function restoreFocus(focusKey) {
    if (!focusKey) return;
    const candidate = document.querySelector('[data-focus="'+CSS.escape(focusKey)+'"]');
    if(candidate) candidate.focus({preventScroll:true});
  }
  function renderCatalog(context, keepFocus = false) {
    const container=$(context+'-catalog'), items=filtered(context);
    const active = document.activeElement;
    const currentItem = active?.dataset.item, currentMega=active?.dataset.mega;
    const renderList = context==='values' && state.layout==='list';
    container.className=renderList?'value-list':'item-grid '+(context==='picker'?'picker-grid':'');
    $(context+'-count').textContent = items.length+' of '+catalog.length+' items';
    container.innerHTML=items.length?items.map(item=>renderList?valueRow(item):card(item,context)).join(''):'<div class="no-results">'+icon('search')+'<strong>No matching items</strong><p>Try another name or rarity.</p><button class="button secondary" data-reset-filter="'+context+'">Reset filters</button></div>';
    if(keepFocus && currentItem && currentMega!==undefined){
      const button=container.querySelector('[data-item="'+CSS.escape(currentItem)+'"][data-mega="'+currentMega+'"]');
      button?.focus({preventScroll:true});
    }
  }
  function offerRow(entry, side, index) {
    const item=byId.get(entry.id), unit=item[entry.mega?'mega':'normal'];
    const key=side+':'+entry.id+':'+entry.mega;
    return '<div class="offer-row"><div class="offer-image">'+image(item,true)+'</div><div class="offer-info"><h3>'+escape(item.name)+'</h3><div class="offer-line-bottom"><button class="variant-small '+(entry.mega?'mega':'')+'" data-offer-toggle="'+index+'" data-side="'+side+'" data-focus="'+key+':variant" aria-label="Switch '+escape(item.name)+' to '+(entry.mega?'Normal':'MEGA')+'">'+(entry.mega?'MEGA':'Normal')+'</button><div class="quantity-control"><button data-quantity-step="-1" data-index="'+index+'" data-side="'+side+'" data-focus="'+key+':minus" aria-label="Decrease '+escape(item.name)+' quantity" '+(entry.quantity===1?'disabled':'')+'>−</button><input type="number" min="1" max="'+core.MAX_QUANTITY+'" step="1" inputmode="numeric" value="'+entry.quantity+'" data-quantity="'+index+'" data-side="'+side+'" data-focus="'+key+':quantity" aria-label="'+escape(item.name)+' '+(entry.mega?'MEGA':'Normal')+' quantity"><button data-quantity-step="1" data-index="'+index+'" data-side="'+side+'" data-focus="'+key+':plus" aria-label="Increase '+escape(item.name)+' quantity" '+(entry.quantity===core.MAX_QUANTITY?'disabled':'')+'>+</button></div><span class="offer-price">'+format(unit)+' each</span></div></div><strong class="offer-line-total" aria-label="Line value '+format(unit*entry.quantity)+'">'+format(unit*entry.quantity)+'</strong><button class="icon-button remove-item" data-remove="'+index+'" data-side="'+side+'" aria-label="Remove '+escape(item.name)+' '+(entry.mega?'MEGA':'Normal')+'">'+icon('trash')+'</button></div>';
  }
  function renderOffers(focusOverride) {
    const focusKey=focusOverride || document.activeElement?.dataset.focus;
    for(const side of ['your','their']){
      $(side+'-total').textContent=format(core.total(catalog,state[side]));
      $(side+'-items').innerHTML=state[side].length?state[side].map((entry,index)=>offerRow(entry,side,index)).join(''):'<div class="offer-empty"><span class="empty-icon">'+icon('box')+'</span><span>Your items will appear here</span></div>';
    }
    renderSummary();
    restoreFocus(focusKey);
  }
  function renderSummary() {
    for(const side of ['your','their']) $(side+'-total').textContent=format(core.total(catalog,state[side]));
    const result=core.compare(catalog,state.your,state.their);
    const resultNode=$('trade-result');resultNode.className='trade-result '+result.status;
    if(result.status==='incomplete') resultNode.innerHTML='<div class="result-icon">'+icon('balance')+'</div><div class="result-main"><h2>Add items to both offers</h2><p>The comparison is from your side of the trade.</p></div><span class="result-number">—</span>';
    else {
      const title=result.status==='fair'?'A fair trade':result.status==='win'?'A win for you':'A loss for you';
      const subtitle=result.status==='fair'?(result.fairMarginApplied?'Within the 3% margin for offers above 50 value.':'Both offers have the same reference value.'):result.status==='win'?'Their offer is worth more than yours.':'You are giving more value than you receive.';
      const percent=result.percent===null?'':new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(Math.abs(result.percent))+'% '+(result.status==='win'?'more value':result.status==='loss'?'less value':'difference');
      resultNode.innerHTML='<div class="result-icon">'+icon(result.status==='loss'?'warning':result.status==='fair'?'balance':'check')+'</div><div class="result-main"><h2>'+title+'</h2><p>'+subtitle+'</p></div><div class="result-number">'+(result.difference>0?'+':result.difference<0?'−':'')+format(Math.abs(result.difference))+'<small>'+percent+'</small></div>';
    }
    if($('picker').open) renderPickerSummary();
    $('swap').disabled=!state.your.length&&!state.their.length;
    $('clear-all').disabled=!state.your.length&&!state.their.length;
  }
  function renderPickerSummary() {
    const side=state.pickerSide, total=format(core.total(catalog,state[side])), quantity=count(state[side]);
    $('picker-title').textContent='Add to '+(side==='your'?'your':'their')+' offer';
    $('picker-summary').textContent=quantity+' '+(quantity===1?'item':'items')+' selected · Value '+total;
    $('picker-foot-total').textContent='Offer value: '+total;
  }
  function addItem(id, side, mega=!!state.variants[id], quantity=1) {
    if(!byId.has(id)||!['your','their'].includes(side)) throw new Error('Unknown item or offer.');
    state[side]=core.validateEntries(catalog,[...state[side],{id,mega,quantity}]);
    renderOffers();
  }
  function openPicker(side) {
    state.pickerSide=side;$('picker-search').value='';$('picker-rarity').value='';
    renderCatalog('picker');renderPickerSummary();$('picker').showModal();$('picker-search').focus();
  }
  function closePicker(){ $('picker').close(); }
  function setTarget(side) {
    state.target=side;
    for(const s of ['your','their']){ $('target-'+s).classList.toggle('selected',s===side);$('target-'+s).setAttribute('aria-pressed',String(s===side)); }
    renderCatalog('calc');
  }
  function navigate() {
    const isValues=location.hash==='#values';
    $('values-view').hidden=!isValues;$('calculator-view').hidden=isValues;
    for(const page of ['values','calculator']){const active=(page==='values')===isValues;const link=$('nav-'+page);link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
    document.title=(isValues?'Value list':'Trade calculator')+' · Carve Values';
    renderCatalog(isValues?'values':'calc');
  }
  for(const context of ['calc','values','picker']){
    $(context+'-rarity').innerHTML='<option value="">All rarities</option>'+rarities.map(r=>'<option value="'+r+'">'+(r==='Unspecified'?'Rarity not specified':r)+'</option>').join('');
    $(context+'-search').addEventListener('input',()=>renderCatalog(context));
    $(context+'-rarity').addEventListener('change',()=>renderCatalog(context));
    if(context!=='picker') $(context+'-sort').addEventListener('change',()=>renderCatalog(context));
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button || button.disabled) return;
    try {
      if(button.dataset.openPicker) return openPicker(button.dataset.openPicker);
      if(button.dataset.target) return setTarget(button.dataset.target);
      if(button.dataset.item && button.dataset.mega!==undefined){
        state.variants[button.dataset.item]=button.dataset.mega==='true';
        for(const context of ['calc','values','picker']) if(context===button.dataset.context||!$(context==='picker'?'picker':context==='calc'?'calculator-view':'values-view').hidden) renderCatalog(context,context===button.dataset.context);
        return;
      }
      if(button.dataset.add){
        const context=button.dataset.context;
        if(!['calc','picker'].includes(context)) return;
        const side=context==='picker'?state.pickerSide:state.target;
        const quantityInput=button.closest('.item-card').querySelector('[data-batch-quantity]');
        const quantity=Number(quantityInput.value);
        addItem(button.dataset.add,side,!!state.variants[button.dataset.add],quantity);
        state.addQuantities[button.dataset.add]=quantity;
        toast(quantity+' × '+byId.get(button.dataset.add).name+(state.variants[button.dataset.add]?' MEGA':'')+' added to '+(side==='your'?'your':'their')+' offer');
        return;
      }
      if(button.dataset.offerToggle!==undefined){
        const side=button.dataset.side,index=Number(button.dataset.offerToggle),entry=state[side][index];
        const focus=side+':'+entry.id+':'+(!entry.mega)+':variant';
        state[side]=core.toggle(catalog,state[side],index);renderOffers(focus);return;
      }
      if(button.dataset.quantityStep!==undefined){
        const side=button.dataset.side,index=Number(button.dataset.index);
        const next=state[side].map((entry,i)=>({...entry,quantity:entry.quantity+(i===index?Number(button.dataset.quantityStep):0)}));
        state[side]=core.validateEntries(catalog,next);renderOffers();return;
      }
      if(button.dataset.remove!==undefined){
        const side=button.dataset.side,index=Number(button.dataset.remove);state[side].splice(index,1);renderOffers();
        document.querySelector('[data-open-picker="'+side+'"]').focus({preventScroll:true});return;
      }
      if(button.dataset.resetFilter){const context=button.dataset.resetFilter;$(context+'-search').value='';$(context+'-rarity').value='';renderCatalog(context);$(context+'-search').focus();return;}
    } catch(error){toast(error.message);}
  });
  document.addEventListener('input',event=>{
    const input=event.target;
    if(input.dataset.batchQuantity===undefined) return;
    const quantity=Number(input.value);
    const valid=Number.isInteger(quantity)&&quantity>=1&&quantity<=core.MAX_QUANTITY;
    input.setCustomValidity(valid?'':'Quantity must be a whole number from 1 to 99,999.');
    input.setAttribute('aria-invalid',String(!valid));
    if(valid)state.addQuantities[input.dataset.batchQuantity]=quantity;
  });
  document.addEventListener('change',event=>{
    const input=event.target;if(input.dataset.quantity===undefined) return;
    const side=input.dataset.side,index=Number(input.dataset.quantity),quantity=Number(input.value);
    try {
      state[side]=core.validateEntries(catalog,state[side].map((entry,i)=>({...entry,quantity:i===index?quantity:entry.quantity})));
      const entry=state[side][index],item=byId.get(entry.id),lineTotal=format(item[entry.mega?'mega':'normal']*entry.quantity);
      const row=input.closest('.offer-row'),totalNode=row.querySelector('.offer-line-total');
      totalNode.textContent=lineTotal;totalNode.setAttribute('aria-label','Line value '+lineTotal);
      row.querySelector('[data-quantity-step="-1"]').disabled=quantity===1;
      row.querySelector('[data-quantity-step="1"]').disabled=quantity===core.MAX_QUANTITY;
      renderSummary();
    }
    catch(error){input.value=state[side][index].quantity;toast(error.message);}
  });
  $('swap').addEventListener('click',()=>{[state.your,state.their]=[state.their,state.your];renderOffers();toast('Offers swapped');});
  $('clear-all').addEventListener('click',()=>{state.your=[];state.their=[];renderOffers();toast('Both offers cleared');});
  for(const layout of ['list','grid']) $('layout-'+layout).addEventListener('click',()=>{state.layout=layout;for(const l of ['list','grid']){$('layout-'+l).classList.toggle('selected',layout===l);$('layout-'+l).setAttribute('aria-pressed',String(layout===l));}renderCatalog('values');});
  $('picker-close').addEventListener('click',closePicker);$('picker-done').addEventListener('click',closePicker);
  $('picker').addEventListener('click',event=>{if(event.target===$('picker')){const rect=$('picker').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closePicker();}});
  window.addEventListener('hashchange',navigate);
  renderOffers();navigate();
  const context=document.modelContext;
  if(context?.registerTool){
    const controller=new AbortController();
    const register=tool=>{try{Promise.resolve(context.registerTool(tool,{signal:controller.signal})).catch(()=>{});}catch{}};
    register({name:'get_carve_item_values',title:'Read Carve Wood item values',description:'Read Normal and MEGA values from the current catalog. Values are reference prices, not live market quotes.',inputSchema:{type:'object',properties:{query:{type:'string'}},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){if(input===null||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>k!=='query')||input.query!==undefined&&typeof input.query!=='string')throw new Error('query must be a string.');const q=(input.query||'').toLowerCase();return catalog.filter(item=>item.name.toLowerCase().includes(q)).map(item=>({id:item.id,name:item.name,rarity:item.rarity,normal:item.normal/10,mega:item.mega/10}));}});
    const entriesSchema={type:'array',items:{type:'object',properties:{id:{type:'string'},mega:{type:'boolean'},quantity:{type:'integer',minimum:1,maximum:core.MAX_QUANTITY}},required:['id','mega','quantity'],additionalProperties:false}};
    register({name:'set_carve_trade_offers',title:'Set and compare trade offers',description:'Replace both visible offers with the supplied item quantities and Normal or MEGA variants, then compare the trade from your perspective. Differences up to 3% are fair only when your offer exceeds 50 value.',inputSchema:{type:'object',properties:{your:entriesSchema,their:entriesSchema},required:['your','their'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['your','their'].includes(k)))throw new Error('Supply your and their offers.');const your=core.validateEntries(catalog,input.your),their=core.validateEntries(catalog,input.their);state.your=your;state.their=their;renderOffers();location.hash='calculator';navigate();const result=core.compare(catalog,your,their);return{yourValue:result.give/10,theirValue:result.receive/10,difference:result.difference/10,status:result.status,percent:result.percent,fairMarginApplied:result.fairMarginApplied};}});
    window.addEventListener('pagehide',()=>controller.abort(),{once:true});
  }
})();
