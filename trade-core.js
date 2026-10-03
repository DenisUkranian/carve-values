(function (root) {
  'use strict';
  const MAX_QUANTITY = 99999;
  function validateEntries(catalog, entries) {
    if (!Array.isArray(entries)) throw new Error('An offer must be a list of items.');
    const merged = new Map();
    for (const entry of entries) {
      if (!entry || !catalog.some(item => item.id === entry.id)) throw new Error('Unknown item.');
      if (typeof entry.mega !== 'boolean') throw new Error('Choose Normal or MEGA.');
      if (!Number.isInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > MAX_QUANTITY) throw new Error('Quantity must be a whole number from 1 to 99,999.');
      const key = entry.id + ':' + (entry.mega ? 'mega' : 'normal');
      const quantity = (merged.get(key)?.quantity || 0) + entry.quantity;
      if (quantity > MAX_QUANTITY) throw new Error('The combined quantity is too large.');
      merged.set(key, {id: entry.id, mega: entry.mega, quantity});
    }
    return Array.from(merged.values());
  }
  function total(catalog, entries) {
    const byId = new Map(catalog.map(item => [item.id, item]));
    return entries.reduce((sum, entry) => {
      const item = byId.get(entry.id);
      if (!item) throw new Error('Unknown item.');
      return sum + item[entry.mega ? 'mega' : 'normal'] * entry.quantity;
    }, 0);
  }
  function compare(catalog, your, their) {
    const give = total(catalog, your), receive = total(catalog, their);
    const difference = receive - give;
    const fairMarginApplied = Boolean(your.length && their.length && give > 500 && difference !== 0 && Math.abs(difference) * 100 <= give * 3);
    return {give, receive, difference, percent: give ? difference / give * 100 : null,
      fairMarginApplied,
      status: !your.length || !their.length ? 'incomplete' : difference === 0 || fairMarginApplied ? 'fair' : difference > 0 ? 'win' : 'loss'};
  }
  function toggle(catalog, entries, index) {
    if (!Number.isInteger(index) || index < 0 || index >= entries.length) throw new Error('Unknown offer item.');
    return validateEntries(catalog, entries.map((entry, i) => ({...entry, mega: i === index ? !entry.mega : entry.mega})));
  }
  const api = {MAX_QUANTITY, validateEntries, total, compare, toggle};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CarveTrade = api;
})(typeof window === 'undefined' ? globalThis : window);
