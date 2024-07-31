import express from 'express';
import { promisify } from 'util';
import redis from 'redis';

const port = 1245;
const app = express();
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4},
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10},
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2},
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5}
]

function getItemById(id) {
  return listProducts.find(item => item.id == id);
}

async function reserveStockById(itemId, stock) {
  setAsync(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock) : 0;
}

app.get('/list_products', (req, res) => {
  const products = listProducts.map(item => ({
    itemId: item.id,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock
  }));
  res.json(products);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    return res.json({ status: 'Product not found'});
  }

  const currentQuantity = await getCurrentReservedStockById(itemId);
  res.json({
    itemId: item.id,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock,
    currentQuantity: item.stock - currentQuantity
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    return res.json({ status: 'Product not found' });
  }

  const currentQuantity = await getCurrentReservedStockById(itemId);
  if (currentQuantity >= item.stock) {
    return res.json({ status: 'Not enough stock available', itemId: itemId });
  }

  await reserveStockById(itemId, currentQuantity + 1);
  res.json({ status: 'Reservation confirmed', itmeId: itemId });
});

app.listen(port, () => {
  console.log('Server running on port: ' + port);
});
