# ola papu!

pasos y dependencias para correr la wea mas q nada....

## Marco Teorico mas o menos rapido

Cada vez que un usuario se logea a la aplicacion, se le crea un stream en el FeedChannel mediante un websocket. Un channel es una instancia de una caga de Rails llamada ActionCable. El stream es un canal unico para el usuario, donde le llegara la informacion que nos piden que le llegue, como cuando un amigo suyo ratea una cerveza y cuando sube una foto a un evento (creo que lo de confirmar asistencia no se publica en el feed pero no estoy seguro).

Feed.js se encuentra en la carpeta de _components_ y se renderea en Home, cuando searchKeywords es null. Planeaba implementar el bottomNavTab y poner el Feed en la tab de profile, pero esa wea me rompe la cabeza sinceramente. 

ver apunteslab20mil.md para mas detalles creo...

## Instalar Redis

Redis es (lamentablemente) necesario para poder correr el ActionCable y que le llegue la info del backend al frontend a un usuario a traves de su stream. Estuve mas de dos horas corriendo la wea sin Redis y estaba como ooo q wea porque no funciona pero me acorde magicamente de una seccion chica de un lab en el que el ayudante dijo q era obligatorio asi q aqui estoy para decirte el #pasoapaso de como instalarlo.

Hay que instalar el stack (??) de Redis. Los pasos estan en [este link!](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/linux/). Solo tienes que seguir la parte que dice _From the official Ubuntu/Debian APT Repository_. Voy a escribir los comandos aqui igual pq probablemente haya que dejarselos claro al ayudante en el DEMO.md.

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

## Backend

Cada usuario que se loggee a la aplicacion se subscribira al FeedChannel mediante el metodo _subscribed_ en backend/channels/feed_channel.rb, creando su stream unico de info. 

```rb
def subscribed
  @user = User.find(params[:user_id])
  stream_from "feed_#{@user.id}" #del usuario actual
  Rails.logger.info("Suscripción exitosa al canal feed_#{@user.id}")
end
```

No es necesario definir el metodo _unsubscribed_ por alguna razon?!? se maneja solo xd...

Hice el requisito 1 y 3 (que, por alguna razon, en la seccion de _Implementacion de la Funcionalidad_ del enunciado, el ultimo sale como el requisito 2)!!! la parte del backend que le hace funcionar es en el modelo de review (models/review.rb), donde esta el metodo broadcast_to_friends q en vd es super straightforward.

```rb
def broadcast_to_friends
  # solo se puede escribir user pq una review pertenece a un usuario
  user.friends.each do |friend|
    ActionCable.server.broadcast("feed_#{friend.id}", {
      review_id: self.id,        #para identificar la reseña en el front
      review_rating: self.rating,
      beer_id: beer.id,
      beer_name: beer.name,
      user_handle: user.handle    #del usuario que envio la reseña
    })
  end
end 
```

Para implementar el requisito 2, hay que hacer literal el mismo metodo pero en event.rb xdd

## Frontend

en hybrid-frontend/components se encuentra SubscribeToFeed.js y Feed.js. Feed llama a SubscribeToFeed para hacer evidentemente lo que dice!! no habria que cambiar nada de aca; solo importa lo q salga impreso en la consola sobre el estado de conexion al feed.

En Feed solo se renderea lo del requisito 3 con FlatList. No creo que hacer que se muestren lo de los requisitos 2 y 3, a la vez, sea complejo.. ojala no.. claramente deberian estar diferenciados en diferentes funciones si..

## Testear!!

ermm los pasos son los mismos que los de DEMO.md para correr la aplicacion.

Para testear que una review, de un amigo del usuario logeado, se muestre en el Feed de la pagina, conviene crearla desde la consola de rails pq es super rapido!! Un ejemplo es el siguiente!!

```rb
Review.create!(text: "hola! - user: 1", rating: 4.1, user_id: 1, beer_id: 10)
```

Deberia aparecer literalmente al instante en la aplicacion! de no ser asi contactarme .... 

## preocupaciones...

Debido a que testee de la anterior manera, no esta hecho lo de que sea autenticado tanto crear una review como crear un websocket con el FeedChannel, lo cual es el ultimo requisito ... vale poco asi q igual no me preocupa mucho.

Hasta ahora, la conexion con el Feed dura solo mientras este renderizado dicho componente en el frontend. Creoo q la idea es que siempre se vayan recibiendo cosas desde el feed; la conexion debe estar montada siempre que el usuario este en la app...en terminos de memoria no deberia ser complejo, pero habria que evitar que se desuscriba nomas creo hasta que se deslogee el usuario

tambien debido a lo ultimo, cada vez que se renderea Feed nuevamente, los posts anteriores no aparecen,,, lo cual me imagino que no es la idea.. pero si nunca se desuscribe entonces no deberia ser problema! habria que hacer que la info de los posts no se guarde en un estado en Feed.js porque eso tambien hace que se refresce en cada renderizado