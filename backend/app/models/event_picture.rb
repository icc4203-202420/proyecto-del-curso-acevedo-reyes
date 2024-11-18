class EventPicture < ApplicationRecord
  after_create_commit :broadcast_to_friends
  belongs_to :event
  belongs_to :user

  has_one_attached :image
  def broadcast_to_friends
    user.friends.each do |friend|
      ActionCable.server.broadcast("feed_#{friend.id}", {
        type: 'event_picture',                    # Tipo de publicación
        event_id: event.id,                       # ID del evento
        event_name: event.name,                   # Nombre del evento
        event_start: event.start_date,            # Fecha y hora de inicio del evento
        event_end: event.end_date,                # Fecha y hora de fin del evento
        event_description: event.description,     # Descripción del evento
        bar_name: event.bar.name,                 # Nombre del bar del evento
        bar_address: event.bar.address.line1,     # Dirección del bar (si aplica)
        picture_id: id,                           # ID de la imagen
        picture_created_at: created_at,           # Fecha de creación de la imagen
        description: description,                 # Descripción de la publicación
        image_url: Rails.application.routes.url_helpers.rails_blob_url(image, host: 'https://bb44-190-22-24-23.ngrok-free.app'), # URL de la imagen
        user_id: user.id,                         # ID del usuario que publicó
        user_handle: user.handle,                 # Handle del usuario
        user_full_name: "#{user.first_name} #{user.last_name}", # Nombre completo del usuario
        #user_profile_picture: Rails.application.routes.url_helpers.rails_blob_url(user.profile_picture, host: 'https://bb44-190-22-24-23.ngrok-free.app') # URL de la foto de perfil, si existe
      })
    end
  end
end
