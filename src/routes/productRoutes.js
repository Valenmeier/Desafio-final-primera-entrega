import { Router } from "express";
import productosEnEmpresa from "../../manangers/productMananger.js";
const router = Router();
const productMananger = productosEnEmpresa;

router.get("/", async (req, res) => {
  const productos = await productMananger.getProducts();
  if (productos) {
    if (req.query.limit <= productos.length && req.query.limit > 0) {
      res.send(productos.slice(0, req.query.limit));
    } else if (req.query.limit) {
      res.send(`<h1>El limite de productos no puede ser nulo ni mayor a los productos dados, productos actuales:</h1><br>
      ${productos.map((p) => `<h2>${p.title}</h2>`)}`);
    } else {
      res.send(productos);
    }
  } else {
    res.send(`No hay ningún producto en la empresa`);
  }
});

router.post("/", async (req, res) => {
  let nuevoProducto = req.body;
  let { title, description, code, price, stock, thumbnail } = nuevoProducto;
  if ((title, description, code, price, stock)) {
    let productos = await productMananger.getProducts();
    if (productos) {
      const codeCheck = productos.find((el) => el.code == code);
      if (codeCheck) {
        res.send(
          `El código del producto agregado ya existe, porfavor agregue un producto valido o un nuevo producto.`
        );
      } else {
        productMananger.addProduct(
          title,
          description,
          code,
          price,
          stock,
          thumbnail
        );
        res.send(`Producto cargado correctamente`);
      }
    } else {
      productMananger.addProduct(
        title,
        description,
        code,
        price,
        stock,
        thumbnail
      );
      res.send(`Producto cargado correctamente`);
    }
  } else {
    res.send(
      `Compruebe que tenga todos los datos solicitados(title, description, code, price, stock, thumbnail(opcional)) para subir correctamente su producto `
    );
  }
});

router.get("/:pid", async (req, res) => {
  let producto = await productMananger.getProductById(req.params.pid);
  producto ? res.send(producto) : res.send("El id del producto no existe");
});

router.put("/:pid", async (req, res) => {
  let producto = await productMananger.getProductById(req.params.pid);
  if (producto) {
    let nuevaInformacion = req.body;
    if (nuevaInformacion) {
      await productMananger.uptadeProduct(req.params.pid, nuevaInformacion);
      res.send(`Actualizado correctamente`);
    } else {
      res.send(`Coloca la información a cambiar`);
    }
  } else {
    res.send("El id del producto no existe");
  }
});

router.delete("/:pid", async (req, res) => {
  let producto = await productMananger.getProductById(req.params.pid);
  if (producto) {
    res.send(await productMananger.deleteProduct(req.params.pid));
  } else {
    res.send("El id del producto no existe");
  }
});

export default router;
