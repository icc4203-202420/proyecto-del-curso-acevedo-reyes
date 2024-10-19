# Leer porfavor!! sobre entrega 2.1...

Hola Tomás! Aquí unas instrucciones sobre como correr el proyecto híbrido, sin dolores de cabeza!!

## Forwarding del Backend con Ngrok

Nos imaginamos que, como el profesor recomendó usar Ngrok para dicho propósito, entonces debes tener Ngrok! Simplemente hay que abrir el backend en su carpeta:

```sh
rails s
```

y luego forward-earlo con:

```sh
ngrok http 3001
```

como lo estableció el grupo de García, Bergoeing y Hrdina en [este repo](https://github.com/icc4203-202420/ngrok-tutorial).

## Crear .env con url de Ngrok!!

Cuando se hace el paso anterior, se muestra en la consola, entre otros, un indice que se llama "Forwarding". Dicho indice muestra la url que creó Ngrok, del backend; su valor va hasta antes de la flecha "->".

Crea un .env en el root de hybrid-frontend, donde debe ir la siguiente variable con el valor del Forwarding, sin los corchetes.

```js
NGROK_URL=[la url del forwarding]
```

## Correr el servidor front!!

Para instalar las dependencias, solo hay que hacer el siguiente comando en hybrid-frontend:

```sh
npm install
```

Luego, para correr el servidor front, hay que hacer:

```sh
npm run start -- --reset-cache
```

De no hacer lo del reset cache, entonces el servidor no actualiza correctamente el valor de NGROK_URL del .env, en los archivos que hagan GET y POST requests.

Lamentablemente, y hasta ahora, el servidor corre solo en la web (estamos trabajando para que sea tambien en el celu!!), por lo que es visible en 

```
http://localhost:8081/ 
```

... esperamos que esto no sea un incoveniente para la evaluación..