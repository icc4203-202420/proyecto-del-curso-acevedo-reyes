# Leer porfavor!! sobre entrega 2.1...

Hola Tomás! Aquí unas instrucciones sobre como correr el proyecto híbrido, sin dolores de cabeza!!

## Forwarding del Backend con Ngrok

Nos imaginamos que, como el profesor recomendó usar Ngrok para dicho propósito, entonces debes tener Ngrok! Simplemente hay que forward-ear el backend con

```sh
ngrok http 3001
```

como lo estableció el grupo de García, Bergoeing y Hrdina.

## Correr el servidor front!!

Para correr el servidor front, hay que hacer

```sh
npm run start -- --reset-cache
```

De no hacerlo, entonces el servidor no actualiza correctamente el valor de la URL de Ngrok del Backend, en los archivos que hagan GET y POST requests.

Lamentablemente, y hasta ahora, el servidor corre solo en la web hasta ahora (estamos trabajando para que sea tambien en el celu!!)... esperamos que esto no sea un incoveniente para la evaluación..