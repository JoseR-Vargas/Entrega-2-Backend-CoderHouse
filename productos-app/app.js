import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect('mongodb+srv://coder_70275:Lgmd2233.@cluster0.cfpeb.mongodb.net/coder_70275')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(error => console.error('Error conectando a MongoDB:', error));

// Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Vistas
app.get('/products', async (req, res) => {
    // Obtener productos con paginación y renderizar la vista
    const products = await Product.find(); // Aquí deberías usar la paginación y filtros
    res.render('index', { products });
});

app.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    res.render('cart', { cartId: cid, products: cart.products });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
