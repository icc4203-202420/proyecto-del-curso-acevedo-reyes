# Apuntes para entrega 2.3

creo que no esta en un repositorio particular esto, pero la "base" esta en el lab11

## setup/?!?

cada usuario se subscribe al servidor rails de ActionCable mediante un websocket. Este websocket se mata cuando el usuario no esta conectado a la app creo.. aunq se podria dejar persistente...

pasos pero muy por encima!!

```sh
rails generate channel Feed
```

lo cual crea dicho canal en app/channels. La conexion sera entre el servidor y un usario particular, por lo q existe un Feed para cada usuario!

```ruby
class FeedChannel < Application...

  def subscribed
      @user = User.find(params[:user_id])

      stream_from "feed_#{@user_id}" #del usuario actual
```

ver lab11 para ver como se maneja en el front (ChatRoom.jsx), pero:

```js
const ...

const subscription = cableConection.subscriptions.create(
    { channel: 'FeedChannel', user_id: currentUser.id}
)
```

con esto, el usuario actual esta suscrito a su feed ! y puede enviar y recibir info...!

## funciones en modelos pertinentes

el usuario, mediante una solicitud HTTP, crea una review, y se envia al backend. Aqui, en el controlador de reviews, esta se mandara (o la info pertinente) a cada uno de los review.user.friends

```ruby
class Review < ApplicationRecord???#(o lo que tenga q aparecer en el feed, como reviews)

  after_create_commit :broadcast_to_friends # o after save nose

  def broadcast_to_friends

    user.friends.each do friend
      ActionCable.server.broadcast("feed_#{friend_id}", {
        activity: self,
        user: user.name #del usuario que envio la reseña
      })
    end
  end 
end
```

el cable y el servidor se crean casi al mismo tiempo. Al desconectarse del feed, o de la app, se termina la conexion al ActionCable. Al volver a logearse, se crea un nuevo cable; aunque se podria hacer q el cable persista infinitamente xd

En todos los modelos, cuando se crea algo pertinente a lo evaluado en algun modelo (como Attendance o eventPictures), se tendra que hacer algo muy parecido a lo del bloque anterior de codigo!!

