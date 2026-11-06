type FigmaName = 'bag' | 'wishlist' | 'credit';
type IconName = FigmaName | 'arrow' | 'diagonal' | 'search' | 'menu' | 'close' | 'plus' | 'minus' | 'check' | 'shopify' | 'replay' | 'grid' | 'list' | 'bookmark' | 'cart';

const figmaSources: Record<FigmaName, string> = {
  bag: 'figma/bag.svg',
  wishlist: 'figma/wishlist.svg',
  credit: 'figma/credit.svg',
};

export function mediaUrl(path: string) {
  return path.startsWith('data:') ? path : import.meta.env.BASE_URL + path;
}

const outlines = {
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  diagonal: 'M6 18 18 6M7 6h11v11',
  search: 'M16.5 10.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-1.7 4.3L20 20',
  menu: 'M4 8h16M4 16h16',
  close: 'm6 6 12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'm5 12 4 4 10-10',
  shopify: 'M5 8h14l1 13H4L5 8Zm4 0V6a3 3 0 1 1 6 0v2m-1 4c-3-2-5 1-2 2s2 4-2 3',
  replay: 'M4 11a8 8 0 1 1 1.3 5.4M4 5v6h6',
  grid: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z',
  bookmark: 'M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4z',
};

export function Icon({ name }: { name: IconName }) {
  if (name === 'bag' || name === 'wishlist' || name === 'credit') {
    return <span className={`icon figma-icon icon-${name}`} aria-hidden="true"><img src={mediaUrl(figmaSources[name])} alt="" /></span>;
  }

  return (
    <svg className={`icon icon-${name}`} viewBox="0 0 24 24" aria-hidden="true">
      {name === 'cart' ? <>
        <path d="M17 17H6V3H4M6 5l14 1-1 7H6" />
        <g className="cart-wheel"><circle cx="6" cy="20" r="1.65" /><path d="M6 19v1" /></g>
        <g className="cart-wheel"><circle cx="17" cy="20" r="1.65" /><path d="M17 19v1" /></g>
      </> : name === 'list' ? <>
        <path className="list-bullets" d="M5 6v.01M5 12v.01M5 18v.01" />
        <path className="list-line" d="M9 6h11" /><path className="list-line" d="M9 12h11" /><path className="list-line" d="M9 18h11" />
      </> : <path d={outlines[name]} />}
    </svg>
  );
}
