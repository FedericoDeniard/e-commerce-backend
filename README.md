# Tienda virtual - Backend

Para crear este proyecto utilicé Node.Js, Express, Prisma TypeScript.

No había utilizado Prisma anteriormente, pero decidí incorporarlo ya que me pareció una tecnología interesante con una documentación amplia y concisa.

Existen 3 tablas relacionadas con los productos

- Product: Contiene un identificador: **ID** y un nombre: **NAME**. Tiene una clave única **ID** y el nombre tiene que ser único.
- Brand: Contiene un identificador: **ID**, un nombre: **NAME** y un logo: **LOGO_URL**. Tiene una clave única **ID** y el nombre tiene que ser único.
- Product_Brand: Contiene un identificador de producto **ID** (Referencia a Product ID), un identificador de marca **BRAND_ID** (Referencia a Brand ID), un nombre de modelo **MODEL**, una imagen del producto **IMG_URL**, un precio **PRICE** y una descripción **DESCIPTION**, Tiene una clave compuesta única compuesta por **(ID, BRAND_ID, MODEL)**.

Por otro lado, los usuarios cuentan con una tabla que cuenta de:

- User: Cuenta de un identificador **ID**, un nombre de usuario **USERNAME**, una contraseña **PASSWORD** y un rol **ROLE**. Es importante que en rol se utilizen como valor **"admin"** o **"user"**. Su clave única es el ID y los nombres deben ser únicos.

## Rutas

La página cuenta con nueve rutas.

• **"/products"**: Método **GET**, devuelve todos los productos. No incluye paginación, lo cuál hubiese estado bueno incluir con un poco más de tiempo.

• **"/products/:id/:brand/:model"**: Método **GET**, devuelve un producto específico.

• **"/newProduct"**: Método **POST**, recibe por body un objeto de tipo productSchema, si el producto no existe, crea uno nuevo, si el producto existe, pero es de otra marca y/o modelo, crea una variante de ese producto, si el producto junto con su modelo y marca ya existe, lo rechaza.

• **"/newBrand"**: Método **POST**, recibe en el body un nombre y un logo, si ya existe la marca, lo rechaza, en caso contrario crea una nueva marca.

• **"/login"**: Método **POST**, recibe en el body un nombre de usuario y contraseña, si son incorrectas devuelve un **401**, si es correcto, devuelve un token junto a un **200**

• **"/checkToken"**: Método **POST**, utiliza un middleware para verificar el token, si el token es válido devuelve un **200**, en caso contrario un **401**

• **"/removeProduct"**: Método **POST**, recibe en el body el id de un producto, el id de una marca y el modelo, utiliza un middleware para verificar el token, si el token es válido, continua llamando a la función para borrar un producto si existe.

• **"/modifyProduct"**: Método **POST**, recibe en el body un producto y un producto modificado, utiliza un middleware para verificar el token, si el token es válido, llama a la función modifyProduct que tiene 2 argumentos, el producto original y el producto modificado, primero buscará el producto que tiene que modificar, y luego, sobreescribirá su imagen, su precio o su descripción. No se puede modificar otro atributo del producto, en ese caso habrá que borrar el producto y crear otro nuevo.

• **"/products/filter"**: Método **POST**, similar a **"/products/:id/:brand/:model"**, esta ruta permite filtrar más de un producto, a diferencia del otro método, recibe el nombre, la marca y la descripción como query. También en este método podemos enviar más de 1 marca, para esto, deberemos enviar la marca como un string separados por "," como por ejemplo brand=lacoste,fila . El método hara un split y le pasará ese array como argumento a la función que filtra los productos.

## Como levantar el proyecto

- Instalar dependencias: `npm install`

- Archivo de configuración de entorno **.env**: Deberá contener una clave **DATABASE_URL** dónde conectaremos nuestra base de datos postgresql. También deberá contener una clave **JWT_SECRET** que usaremos para firmar los tokens.

  > [!TIP]
  > Podes usar `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` para crear una clave segura.

- Correr el proyecto: `npm run dev`: Levantará el proyecto en modo dev, tomando los archivos .env.development que ya se encuentran en el repositorio.
