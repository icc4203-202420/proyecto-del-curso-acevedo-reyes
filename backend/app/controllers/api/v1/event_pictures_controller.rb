require_relative Rails.root.join('app/services/push_notification_service').to_s

class API::V1::EventPicturesController < ApplicationController
  include ImageProcessing
  #include Authenticable

  respond_to :json

  before_action :set_event_picture, only: [:destroy]
  #before_action :verify_jwt_token, except: [:index, :event_index]

  # GET /api/v1/event_pictures
  def index
    @event_pictures = EventPicture.all
    render json: { event_pictures: @event_pictures }, status: :ok
  end

  # GET /api/v1/events/:id/event_pictures
  def event_index
    
    @event = Event.find(params[:id])
    @event_pictures = @event.event_pictures

    puts "MOSTRANDO IMAGENES DEL EVENTO CON ID: #{params[:id]}"

    event_pictures_with_images = @event_pictures.map do |picture|
      picture.as_json.merge(image_url: url_for(picture.image)) if picture.image.attached?
    end

    render json: { event: @event, event_pictures: event_pictures_with_images }, status: :ok
  end

  # POST /api/v1/event_pictures
  def create
    @event_picture = EventPicture.new(event_picture_params.except(:image_base64))
    
    if handle_image_attachment && @event_picture.save
      render json: { event_picture: @event_picture, message: 'Imagen subida correctamente.' }, status: :ok
      
      puts "LLAMANDO A PUSH NOTIFICATION SERVICE!!!!!!!!!!"
      PushNotificationService.notify_users_about_mention(@event_picture.description, @event_picture.event)

      puts "ENVIANDO A FEED LA IMAGEN DESDE CONTROLADOR!!"

      # Generar la URL de la imagen
      image_url = url_for(@event_picture.image) if @event_picture.image.attached?

      # Broadcast al feed de los amigos
      @event_picture.user.friends.each do |friend|
        ActionCable.server.broadcast("feed_#{friend.id}", 
        {
          type: 'event_picture',
          user_handle: @event_picture.user.handle,
          event_id: @event_picture.event.id,
          event_name: @event_picture.event.name,
          bar_name: @event_picture.event.bar.name,
          bar_country: @event_picture.event.bar.address.country.name,
          picture_id: @event_picture.id,
          picture_created_at: @event_picture.created_at,
          picture_description: @event_picture.description,
          picture_image_url: image_url,
        })
      end

      # para el mismo usuario que subio la imagen
      ActionCable.server.broadcast("feed_#{@event_picture.user.id}",
      {
        type: 'event_picture',
        user_handle: @event_picture.user.handle,
        event_id: @event_picture.event.id,
        event_name: @event_picture.event.name,
        bar_name: @event_picture.event.bar.name,
        bar_country: @event_picture.event.bar.address.country.name,
        picture_id: @event_picture.id,
        picture_created_at: @event_picture.created_at,
        picture_description: @event_picture.description,
        picture_image_url: image_url,
      })
      

    else
      render json: @event_picture.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/event_pictures/:id
  def destroy
    if @event_picture.destroy
      render json: { message: 'Event picture deleted successfully.' }, status: :ok
    else
      render json: @event_picture.errors, status: :unprocessable_entity
    end
  end

  private

  def set_event_picture
    @event_picture = EventPicture.find(params[:id])
  end

  def event_picture_params
    params.require(:event_picture).permit(:event_id, :user_id, :description, :image_base64)
  end

  def handle_image_attachment
    image_data = params[:event_picture][:image_base64]

    if image_data.present?
      decoded_image = decode_image(image_data) # Decodificar la imagen usando el módulo
      return false unless decoded_image

      @event_picture.image.attach(
        io: decoded_image[:io],
        filename: decoded_image[:filename],
        content_type: decoded_image[:content_type]
      )
    end
    
    true
  end
end