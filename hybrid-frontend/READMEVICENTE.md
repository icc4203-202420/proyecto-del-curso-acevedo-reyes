apuntes lab 6!

# Entrega 1.5

el ayudante va a subir un readme con tips de como subir archivos a la app!

aparte d lo anterior, mostro que si se hace un input html con type="file", se puede subir archivos xd

```js


const inputFiles = useRef();

const handleFileChange() => {
    
    const files = inputFiles.current.files;
    const fileArray = Array.from(files);
    
    const imageUrls = fileArray.map

    setImages()

    //me ffaltaron cosas xd

}, [inputFiles]

return (

    <input 
        type='file' 
        multiple 
        accept=".png .jpeg"
        onChange={handleFileChange}
    >

    <div >
    ermms
    </div>

)
```

las imagenes q se suban deben ser guardadas al backend 


# Entrega 2.1

esto solo aplica para la entrega 2.1 en delante! en particular, esta entrega requiere cambiar (me imagino) casi todas las cosas de las librerias de react por sus analogos en react-native, cuando sea pertinente segun los requisitos de cada entrega

## cosas varias sueltas

en package.json, el main se refiere al archivo que se va a ejecutar.. esta por default a un archivo que vive dentro de node_modules

correr con npm run start

## Definicin de rutas

las rutas se definen de diferente manera en react native... se define segun archivos! p. ej, si quiero definir /beers/:id, entonces se crea

/app
    /beers
        /[id].js

al estructurar las rutas de esta manera, el App.js actual no va xd creo q se convierte en el index.js dentro de app.

si quiero mostrar el root ("/") entonces se crea el archivo "index.js" dentro de /app. lo mismo aplica para beers, por ejemplo *(aunq no lo tenemos definido de esa manera)

dentro de /app/index.js, el ayudante importo useRouter (creo q de expo-router) y creo una variable de esa manera. Luego, para redirigir a otra vista (como /app/hello.js):

```js
<Button    
    onPress={() => router.push('/hello')}
/>
```

esto literalmente pushea a un stack la ruta definida !! luego se accede y se popea solo...

para volver a app.js desde hello.js, se hace .back en vez de .push ! (router.back())

tambien se puede linkear de manera tipica con <Link href='/beers/1'>, desde /app/index.js por ejemplo, lo cual lleva a /app/beers/[id].js (el archivo se llama literlamente asi btw)

id se puede recuperar desde /app/beers/[id].js con useLocalSearchParams de expo-router.



