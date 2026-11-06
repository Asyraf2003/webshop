type FigmaName = 'bag' | 'wishlist' | 'credit';
type IconName = FigmaName | 'arrow' | 'diagonal' | 'search' | 'menu' | 'close' | 'plus' | 'minus' | 'check' | 'shopify' | 'replay' | 'grid' | 'list' | 'bookmark' | 'cart' | 'ticket' | 'star' | 'share' | 'language' | 'play';

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
  ticket: 'M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Zm10 1v2m0 2v2m0 2v2',
  star: 'm12 3 2.7 5.6 6.2.9-4.5 4.4 1.1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.2-.9L12 3Z',
  share: 'M12 15V3m-4 4 4-4 4 4M6 11H4v10h16V11h-2',
  language: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3a14 14 0 0 1 0 18m0-18a14 14 0 0 0 0 18',
  play: 'm9 5 12 7-12 7V5Z',
  bookmark: 'M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4z',
};

export function CartIcon() {
  return (
    <svg className="icon icon-cart" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 4h2.7l2.1 10.1a1 1 0 0 0 1 .8h10.6l2.1-8H5.8M8 17.3h11" />
      <g className="cart-wheel"><circle cx="9" cy="20" r="1.5" /><path d="M9 19v.9" /></g>
      <g className="cart-wheel"><circle cx="18" cy="20" r="1.5" /><path d="M18 19v.9" /></g>
    </svg>
  );
}

export function Icon({ name }: { name: IconName }) {
  if (name === 'cart') return <CartIcon />;
  if (name === 'bag' || name === 'wishlist' || name === 'credit') {
    return <span className={`icon figma-icon icon-${name}`} aria-hidden="true"><img src={mediaUrl(figmaSources[name])} alt="" /></span>;
  }

  return (
    <svg className={`icon icon-${name}`} viewBox="0 0 24 24" aria-hidden="true">
      {name === 'list' ? <>
        <path className="list-bullets" d="M5 6v.01M5 12v.01M5 18v.01" />
        <path className="list-line" d="M9 6h11" /><path className="list-line" d="M9 12h11" /><path className="list-line" d="M9 18h11" />
      </> : <path d={outlines[name]} />}
    </svg>
  );
}
