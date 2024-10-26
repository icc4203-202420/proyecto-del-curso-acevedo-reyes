# Leer porfavor!! Actualizaciones de corrida de entrega 2.2...

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

Para instalar las dependencias de package.json, solo hay que hacer el siguiente comando en hybrid-frontend:

```sh
npm install
```

Luego, para correr el front y abrirlo en el celular, hay que hacer un setup medio chico, pero que probablemente ya hayas hecho:

```sh
npm install --global eas-cli
npm install --global expo-cli
```

(la verdad es que nunca hemos probado a correr el siguiente comando sin dicho setup, asi que no sabemos si depende de eas-cli y expo-cli. De no funcionarte el siguiente comando, haz el setup mencionado... e.o.c entonces pulento !!)

Una vez hecho lo anterior, el front se corre en hybrid-frontend con:

```sh
npx expo start --tunnel --reset-cache
```

De no hacer lo del reset cache, entonces el servidor no actualiza correctamente el valor de NGROK_URL del .env, en los archivos que hagan GET y POST requests.

Lo de --tunnel es para que expo forwardee el puerto automaticamente con ngrok, lo cual permite que se puede visualizar desde el celular. Esto fue necesario mas que nada porque trabajamos con WSL2, por lo que la red privada de esta no permitia que se conectara al celular sin forwardear el puerto..

Finalmente, y en nuestra experiencia, el anterior comando funciona en la segunda iteracion; por alguna razon, la primera vez que se corre, el celular no reconoce el puerto fordwardeado, aunque deberia.. quizas es un tema de que hay que dejar que el servidor descanse un poco antes de correrlo...