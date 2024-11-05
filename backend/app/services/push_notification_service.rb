require 'net/http'
require 'uri'
require 'json'

class PushNotificationService
  
  def self.send_notification(to:, title:, body:, data:)
    
    message = {
      to: to,
      sound: 'default',
      title: title,
      body: body,
      data: data
    }

    url = URI.parse('https://exp.host/--/api/v2/push/send')
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url.path, { 'Content-Type' => 'application/json' })
    request.body = message.to_json

    response = http.request(request)

    if response.is_a?(Net::HTTPSuccess)
      Rails.logger.info("Notificación enviada con éxito a #{to}")
    else
      Rails.logger.error("Error enviando notificación: #{response.body}")
    end
  end

  def self.notify_user_about_friendship(user, new_friend)
    title = 'Nueva solicitud de amistad'
    body = '¡Has sido agregado como amigo!'
    data = { screen: 'Home' }  # Esto llevará al usuario a la vista de inicio al abrir la app.
    
    # sabemos que solo se debe enviar al new_friend, pero ponemos para el emisor para que quede demostrado que funcionan las notis!!
    user.push_tokens.each do |push_token_object|

      next if push_token_object.token.blank?  # Ignora tokens vacíos o nulos
      
      puts "Enviando notificación a token: #{push_token_object.token}"
      
      send_notification(
        to: push_token_object.token, 
        title: title, 
        body: body, 
        data: data
      )
    end

    new_friend.push_tokens.each do |push_token_object|

      next if push_token_object.token.blank?  # Ignora tokens vacíos o nulos
      
      puts "Enviando notificación a token: #{push_token_object.token}"
      
      send_notification(
        to: push_token_object.token, 
        title: title, 
        body: body, 
        data: data
      )
    end
  end

  def self.notify_friends_about_check_in(user, event)
    title = 'Nuevo check-in de amigo'
    body = "#{user.handle} ha hecho check-in en #{event.name}"
    data = { screen: 'EventDetail', event_id: event.id }  # Esto llevará al usuario a la vista de detalles del evento al abrir la app.

    user.friends.each do |friend|
      friend.push_tokens.each do |push_token_object|
        next if push_token_object.token.blank?  # Ignora tokens vacíos o nulos

        puts "Enviando notificación a token: #{push_token_object.token}"

        send_notification(
          to: push_token_object.token,
          title: title,
          body: body,
          data: data
        )
      end
    end

    #para ver si notificacion funciona xd
    user.push_tokens.each do |push_token_object|
      next if push_token_object.token.blank?  # Ignora tokens vacíos o nulos

      puts "Enviando notificación a token: #{push_token_object.token}"

      send_notification(
        to: push_token_object.token,
        title: title,
        body: body,
        data: data
      )
    end

  end

  def self.notify_users_about_mention(description, event)
    title = 'Has sido mencionado en una foto'
    body = "Has sido mencionado en una foto de #{event.name}"
    data = { screen: 'EventPictures', event_id: event.id }  # Esto llevará al usuario a la vista de fotos del evento al abrir la app.
  
    #handles = description.scan(/@\{([^}]+)\}/).flatten
    handles = description.scan(/@(\w+(\.\w+)?)/).flatten

    puts "HANDLES: #{handles}"
  
    handles.each do |handle|
      puts "BUSCADO USUARIO CON HANDLE!!!: #{handle}"
      user = User.find_by(handle: handle)
      next unless user
  
      user.push_tokens.each do |push_token_object|
        next if push_token_object.token.blank?  # Ignora tokens vacíos o nulos
    
        puts "Enviando notificación a token: #{push_token_object.token}"
    
        send_notification(
          to: push_token_object.token,
          title: title,
          body: body,
          data: data
        )
      end
    end
  end
  
end
