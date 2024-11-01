# app/services/push_notification_service.rb
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

  # simplemente no hay manera de que pueda obtener el token de un usuario que no soy yo mismo
  #def self.send_friend_request_notification(requestor_token:, recipient_token:)
  def self.notify_user_about_friendship(user, new_friend)
    title = 'Nueva solicitud de amistad'
    body = '¡Has sido agregado como amigo!'
    data = { screen: 'Home' }  # Esto llevará al usuario a la vista de inicio al abrir la app.

    # Enviar la notificación al solicitante y al destinatario
    #[requestor_token, recipient_token].each do |token|
    user.push_tokens.each do |token|
      send_notification(
        to: token, 
        title: title, 
        body: body, 
        data: data
      )
    end
  end

end
