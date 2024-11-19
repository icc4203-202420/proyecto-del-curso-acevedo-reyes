# Leer porfavor!! Actualizaciones de corrida de entrega 2.3...

Hola Tomás! Aquí unas instrucciones sobre como correr el proyecto híbrido, sin dolores de cabeza!!

Nuestro proyecto esta en el SDK 51 de Expo; es decir, no lo actualizamos a la ultima version!

## Instalar Redis

Redis es (lamentablemente) necesario para poder correr el ActionCable y que le llegue la info del backend al frontend a un usuario a traves de su stream.

Hay que instalar el stack de Redis. Los pasos estan en [este link!](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/linux/). Solo tienes que seguir la parte que dice _From the official Ubuntu/Debian APT Repository_, los cuales estan aqui por conveniencia:

```sh
sudo apt-get install lsb-release curl gpg

curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update

sudo apt-get install redis-stack-server
```

Recomiendo que Redis corra al empezar wsl solo por si acaso, lo cual se puede hacer asi:

```sh
sudo systemctl enable redis-stack-server

sudo systemctl start redis-stack-server
```

para checkear si es que se esta conectado a redis, haz

```sh
redis-cli ping
```

si recibes _PONG_ de vuelta, entonces esta conectado! sino entonces algo esta mal... y no podras correr el feed..

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

Hay que hacer un setup medio chico, pero que probablemente ya hayas hecho; hay que instalar @expo/cli y eas-cli globalmente!!:

```sh
npm install --global @expo/cli
npm install --global eas-cli
```

Luego, para instalar las dependencias de package.json, solo hay que hacer el siguiente comando en hybrid-frontend:

```sh
npx expo install
```

Luego, para correr el front y abrirlo en el celular
(la verdad es que nunca hemos probado a correr el siguiente comando sin dicho setup, asi que no sabemos si depende de eas-cli y expo-cli. De no funcionarte el siguiente comando, haz el setup mencionado... e.o.c entonces pulento !!), en hybrid-frontend se hace:

```sh
npx expo start --tunnel --reset-cache
```

De no hacer lo del reset cache, entonces el servidor no actualiza correctamente el valor de NGROK_URL del .env, en los archivos que hagan GET y POST requests.

Lo de --tunnel es para que expo forwardee el puerto automaticamente con ngrok, lo cual permite que se puede visualizar desde el celular. Esto fue necesario mas que nada porque trabajamos con WSL2, por lo que la red privada de esta no permitia que se conectara al celular sin forwardear el puerto..

Finalmente, y en nuestra experiencia, el anterior comando funciona en la segunda iteracion; por alguna razon, la primera vez que se corre, el celular no reconoce el puerto fordwardeado, aunque deberia.. quizas es un tema de que hay que dejar que el servidor descanse un poco antes de correrlo...