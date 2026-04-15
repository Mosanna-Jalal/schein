const DUMMY_BASE_URL = 'https://dummyjson.com';
const USD_TO_PKR = 285;

const SCHEIN_TO_DUMMY_CATEGORIES = {
  Kid:         ['mens-shirts', 'mens-shoes', 'sports-accessories'],
  Women:       ['womens-dresses', 'womens-shoes', 'womens-bags', 'womens-jewellery', 'skin-care'],
  Unisex:      ['tops', 'fragrances'],
  Accessories: ['sunglasses', 'mens-watches', 'womens-watches'],
};

const DUMMY_TO_SCHEIN_CATEGORY = {
  'mens-shirts':       'Kid',
  'mens-shoes':        'Kid',
  'sports-accessories':'Kid',
  'womens-dresses':    'Women',
  'womens-shoes':      'Women',
  'womens-bags':       'Women',
  'womens-jewellery':  'Women',
  'skin-care':         'Women',
  tops:                'Unisex',
  fragrances:          'Unisex',
  sunglasses:          'Accessories',
  'mens-watches':      'Accessories',
  'womens-watches':    'Accessories',
};

function toPkrPrice(usdPrice) {
  const pkr = Number(usdPrice || 0) * USD_TO_PKR;
  return Math.max(500, Math.round(pkr / 50) * 50);
}

function toScheinProduct(item) {
  const image = item.thumbnail || item.images?.[0] || '/window.svg';
  const images = (item.images?.length ? item.images : [image]).filter(Boolean);
  const category = DUMMY_TO_SCHEIN_CATEGORY[item.category] || 'Unisex';

  return {
    _id: `demo-${item.id}`,
    name: item.title,
    description: item.description || 'Premium clothing piece.',
    category,
    image,
    images,
    price: toPkrPrice(item.price),
    featured: (item.rating || 0) >= 4.7 || (item.discountPercentage || 0) >= 15,
    stock: Number.isFinite(item.stock) ? item.stock : 50,
    views: Math.round((item.rating || 0) * 100 + (item.stock || 0)),
    createdAt: new Date(Date.UTC(2025, 0, (item.id % 365) + 1)).toISOString(),
  };
}

async function fetchDummyCategory(category) {
  const res = await fetch(
    `${DUMMY_BASE_URL}/products/category/${encodeURIComponent(category)}?limit=100`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`DummyJSON category fetch failed: ${category}`);
  }

  const data = await res.json();
  return data.products || [];
}

export async function fetchDummyProducts({
  category = 'All',
  featured = false,
  minPrice,
  maxPrice,
  sort = 'createdAt',
  order = 'desc',
} = {}) {
  const categories =
    category && category !== 'All'
      ? SCHEIN_TO_DUMMY_CATEGORIES[category] || []
      : Object.values(SCHEIN_TO_DUMMY_CATEGORIES).flat();

  const uniqueCategories = [...new Set(categories)];
  const results = await Promise.all(uniqueCategories.map(fetchDummyCategory));

  let products = results.flat().map(toScheinProduct);

  if (featured) {
    products = products.filter((p) => p.featured);
  }

  if (Number.isFinite(minPrice)) {
    products = products.filter((p) => p.price >= minPrice);
  }

  if (Number.isFinite(maxPrice)) {
    products = products.filter((p) => p.price <= maxPrice);
  }

  const direction = order === 'asc' ? 1 : -1;
  products.sort((a, b) => {
    if (sort === 'price') return (a.price - b.price) * direction;
    if (sort === 'views') return (a.views - b.views) * direction;
    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
  });

  return products;
}

export async function fetchDummyProductById(id) {
  const rawId = String(id || '').replace(/^demo-/, '');
  const numericId = Number(rawId);
  if (!Number.isFinite(numericId)) return null;

  const res = await fetch(`${DUMMY_BASE_URL}/products/${numericId}`, { cache: 'no-store' });
  if (!res.ok) return null;

  const item = await res.json();
  return toScheinProduct(item);
}
